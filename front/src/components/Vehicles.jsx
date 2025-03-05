// src/components/Vehicles.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingBag, Play } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { generateStars } from "../hooks/generateStars";
import { useSound } from "../context/SoundContext"; // Importer le contexte sonore

const SELECTED_VEHICLE_KEY = "selectedVehicle";
const UNLOCKED_VEHICLES_KEY = "unlockedVehicles";

const Vehicles = () => {
  const [vehiclesApi, setVehiclesApi] = useState([]);
  const [currentVehicle, setCurrentVehicle] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const starsRef = useRef(null);
  const containerRef = useRef();
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();
  const modelsRef = useRef({});
  const currentModelRef = useRef(null);
  const audioRef = useRef(null); // Pour le son de démarrage
  const clickSoundRef = useRef(new Audio("/assets/sounds/click.mp3")); // Son de clic

  const navigate = useNavigate();
  const { isMuted } = useSound(); // Utiliser le contexte pour gérer le mute

  useEffect(() => {
    if (starsRef.current) {
      generateStars(starsRef.current);
    }
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(
          "https://easydeck.alwaysdata.net/vehicles"
        );
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setVehiclesApi(data);
          let unlocked = JSON.parse(
            localStorage.getItem(UNLOCKED_VEHICLES_KEY)
          ) || [0];
          if (!Array.isArray(unlocked)) {
            unlocked = [0];
            localStorage.setItem(
              UNLOCKED_VEHICLES_KEY,
              JSON.stringify(unlocked)
            );
          }
          const savedVehicle = parseInt(
            localStorage.getItem(SELECTED_VEHICLE_KEY),
            10
          );
          const validVehicle = unlocked.includes(savedVehicle)
            ? savedVehicle
            : unlocked[0];
          setCurrentVehicle(validVehicle);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des véhicules:", error);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (vehiclesApi.length > 0) {
      preloadModels();
    }
  }, [vehiclesApi]);

  useEffect(() => {
    if (vehiclesApi.length > 0 && Object.keys(modelsRef.current).length > 0) {
      localStorage.setItem(SELECTED_VEHICLE_KEY, currentVehicle.toString());
      showCurrentModel(currentVehicle);
    }
  }, [currentVehicle, vehiclesApi]);

  useEffect(() => {
    let unlocked = JSON.parse(localStorage.getItem(UNLOCKED_VEHICLES_KEY)) || [
      0,
    ];
    if (!unlocked.includes(currentVehicle)) {
      unlocked.push(currentVehicle);
      localStorage.setItem(UNLOCKED_VEHICLES_KEY, JSON.stringify(unlocked));
    }
  }, [currentVehicle]);

  const preloadModels = async () => {
    const loader = new GLTFLoader();
    setIsLoading(true);

    try {
      const modelPromises = vehiclesApi.map(async (vehicle, index) => {
        try {
          const gltf = await loader.loadAsync(vehicle.model);
          const model = gltf.scene;
          const group = new THREE.Group();
          group.add(model);
          group.scale.setScalar(vehicle.scale || 1);

          const box = new THREE.Box3().setFromObject(group);
          const center = box.getCenter(new THREE.Vector3());
          group.position.sub(center);
          group.position.y += vehicle.position ? vehicle.position[1] : 0;

          console.log(`Modèle chargé: ${vehicle.name} (index ${index})`);
          return { group, size: box.getSize(new THREE.Vector3()) };
        } catch (error) {
          console.error(`Erreur lors du chargement de ${vehicle.name}:`, error);
          return null;
        }
      });

      const loadedModels = await Promise.all(modelPromises);
      loadedModels.forEach((model, index) => {
        if (model) {
          modelsRef.current[index] = model;
        }
      });
      setIsLoading(false);
      showCurrentModel(currentVehicle);
    } catch (error) {
      console.error("Erreur lors du préchargement des modèles:", error);
      setIsLoading(false);
    }
  };

  const showCurrentModel = (index) => {
    if (currentModelRef.current) {
      sceneRef.current.remove(currentModelRef.current);
    }

    const currentModel = modelsRef.current[index];
    if (currentModel) {
      const { group, size } = currentModel;
      sceneRef.current.add(group);
      currentModelRef.current = group;

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = cameraRef.current.fov * (Math.PI / 180);
      const cameraZ = Math.abs(maxDim / Math.sin(fov / 2));

      cameraRef.current.position.set(0, size.y * 0.5, cameraZ * 0.8);
      cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));

      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    }
  };

  useEffect(() => {
    const initThree = () => {
      const scene = sceneRef.current;
      scene.background = null;

      const camera = new THREE.PerspectiveCamera(
        35,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      cameraRef.current = camera;
      camera.position.set(5, 2, 5);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      rendererRef.current = renderer;
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      renderer.shadowMap.enabled = true;
      containerRef.current.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controlsRef.current = controls;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = false;
      controls.enableRotate = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2.0;
      controls.enablePan = false;
      controls.minPolarAngle = Math.PI / 3;
      controls.maxPolarAngle = Math.PI / 1.8;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
    };

    initThree();
    return () => {
      if (currentModelRef.current) {
        sceneRef.current.remove(currentModelRef.current);
      }
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, []);

  const unlockedVehicles = JSON.parse(
    localStorage.getItem(UNLOCKED_VEHICLES_KEY)
  ) || [0];
  const unlockedIndexes = vehiclesApi
    .map((_, index) => index)
    .filter((index) => unlockedVehicles.includes(index));

  const currentIndex = unlockedIndexes.indexOf(currentVehicle);

  // Fonction pour jouer le son de clic
  const playClickSound = () => {
    if (!isMuted) {
      clickSoundRef.current.currentTime = 0; // Réinitialiser pour éviter le chevauchement
      clickSoundRef.current.play();
    }
  };

  const goToPrevious = () => {
    playClickSound(); // Jouer le son au clic
    const prevIndex =
      (currentIndex - 1 + unlockedIndexes.length) % unlockedIndexes.length;
    setCurrentVehicle(unlockedIndexes[prevIndex]);
  };

  const goToNext = () => {
    playClickSound(); // Jouer le son au clic
    const nextIndex = (currentIndex + 1) % unlockedIndexes.length;
    setCurrentVehicle(unlockedIndexes[nextIndex]);
  };

  const play = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play();
    }
    setTimeout(() => navigate("/terre"), 1000);
  };

  const goToShop = () => {
    playClickSound(); // Jouer le son au clic sur "Boutique"
    navigate("/shop");
  };

  return (
    <div className="game-container">
      <h1>Choisissez un véhicule</h1>
      <div className="stars" ref={starsRef}></div>
      <div className="vehicle-selector">
        <button
          className="button button-circular"
          onClick={goToPrevious}
          disabled={unlockedIndexes.length <= 1}
        >
          <ChevronLeft size={32} />
        </button>
        <div className="vehicle-display" ref={containerRef}>
          {isLoading && <div className="loading">Chargement...</div>}
        </div>
        <button
          className="button button-circular"
          onClick={goToNext}
          disabled={unlockedIndexes.length <= 1}
        >
          <ChevronRight size={32} />
        </button>
      </div>
      <div className="vehicle-info">
        <h2>{vehiclesApi[currentVehicle]?.name}</h2>
      </div>
      <div className="buttonHomeContainer">
        <button className="button button-primary" onClick={play}>
          <Play size={24} />
          JOUER
        </button>
        <button
          className="button button-secondary shop-button"
          onClick={goToShop} // Nouvelle fonction avec son
        >
          <ShoppingBag size={24} />
          <span>Boutique</span>
        </button>
      </div>

      <audio
        ref={audioRef}
        src="/assets/sounds/start_game.mp3"
        preload="auto"
      />
    </div>
  );
};

export default Vehicles;
