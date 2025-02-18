import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingBag, Play } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { generateStars } from "../hooks/generateStars";

const SELECTED_VEHICLE_KEY = "selectedVehicle";

const Vehicles = () => {
  const [currentVehicle, setCurrentVehicle] = useState(() => {
    const savedVehicle = localStorage.getItem(SELECTED_VEHICLE_KEY);
    return savedVehicle !== null ? parseInt(savedVehicle, 10) : 0;
  });
  const [isLoading, setIsLoading] = useState(true);
  const starsRef = useRef(null); // Référence pour le conteneur des étoiles

  useEffect(() => {
    if (starsRef.current) {
      generateStars(starsRef.current);
    }
  }, []);

  const navigate = useNavigate();

  const containerRef = useRef();
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();
  const modelsRef = useRef({});

  const vehicles = [
    {
      name: "Voiture de course",
      model: "/assets/models/rocket.glb",
      scale: 15,
      position: [0, 2, 0],
    },
    {
      name: "Moto",
      model: "/assets/models/motorcycle.glb",
      scale: 20,
      position: [0, 0, 0],
    },
  ];

  useEffect(() => {
    localStorage.setItem(SELECTED_VEHICLE_KEY, currentVehicle.toString());
  }, [currentVehicle]);

  const preloadModels = async () => {
    const loader = new GLTFLoader();
    setIsLoading(true);

    try {
      const modelPromises = vehicles.map(async (vehicle, index) => {
        const gltf = await loader.loadAsync(vehicle.model);
        const model = gltf.scene;
        const group = new THREE.Group();
        group.add(model);
        group.scale.setScalar(vehicle.scale);

        const box = new THREE.Box3().setFromObject(group);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        group.position.sub(center);
        group.position.y = index === 0 ? size.y / 15 : -size.y / 3;
        group.position.x += vehicle.position[0];
        group.position.z += vehicle.position[2];

        group.visible = false;
        sceneRef.current.add(group);

        return { group, size };
      });

      const loadedModels = await Promise.all(modelPromises);
      loadedModels.forEach((model, index) => {
        modelsRef.current[index] = model;
      });

      showCurrentModel(currentVehicle);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors du préchargement des modèles:", error);
      setIsLoading(false);
    }
  };

  const showCurrentModel = (index) => {
    Object.values(modelsRef.current).forEach(({ group }, i) => {
      group.visible = i === index;
    });

    const currentModel = modelsRef.current[index];
    if (currentModel) {
      const { group, size } = currentModel;
      group.visible = true;

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = cameraRef.current.fov * (Math.PI / 180);
      const cameraZ = Math.abs(maxDim / Math.sin(fov / 2));

      cameraRef.current.position.set(0, size.y * 0.5, cameraZ * 0.8);
      cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));
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

      preloadModels();
    };

    initThree();
    return () => {
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      showCurrentModel(currentVehicle);
    }
  }, [currentVehicle, isLoading]);

  return (
    <div className="game-container">
      <div className="stars" ref={starsRef}></div> {/* Conteneur des étoiles */}
      <button
        className="button button-secondary shop-button"
        onClick={() => navigate("/shop")}
      >
        <ShoppingBag size={24} />
        <span>Boutique</span>
      </button>
      <div className="vehicle-selector">
        <button
          className="button button-circular"
          onClick={() =>
            setCurrentVehicle(
              (prev) => (prev - 1 + vehicles.length) % vehicles.length
            )
          }
          disabled={isLoading}
        >
          <ChevronLeft size={32} />
        </button>
        <div className="vehicle-display" ref={containerRef}>
          {isLoading && <div className="loading">Chargement...</div>}
        </div>
        <button
          className="button button-circular"
          onClick={() =>
            setCurrentVehicle((prev) => (prev + 1) % vehicles.length)
          }
          disabled={isLoading}
        >
          <ChevronRight size={32} />
        </button>
      </div>
      <button className="button button-primary" disabled={isLoading}>
        <Play size={24} />
        JOUER
      </button>
    </div>
  );
};

export default Vehicles;
