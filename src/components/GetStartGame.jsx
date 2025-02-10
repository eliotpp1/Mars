import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, Play } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const GameStartPage = () => {
  const [currentVehicle, setCurrentVehicle] = useState(0);
  const containerRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const modelRef = useRef(null);
  const controlsRef = useRef();

  const vehicles = [
    {
      name: "Voiture de course",
      model: "/assets/models/rocket.glb",
      scale: 10,
      position: [0, 0, 0],
      rotation: [0, Math.PI / 2, 0],
      length: 2,
    },
    {
      name: "Moto",
      model: "/assets/models/motorcycle.glb",
      scale: 10,
      position: [0, , 0],
      rotation: [0, Math.PI / 2, 0],
      length: 2,
    },
  ];

  useEffect(() => {
    const initThree = () => {
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      scene.background = null;

      const camera = new THREE.PerspectiveCamera(
        45,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      cameraRef.current = camera;
      camera.position.set(5, 0, 5);

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

      controls.minPolarAngle = Math.PI / 4;
      controls.maxPolarAngle = Math.PI / 1.5;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      const animate = () => {
        requestAnimationFrame(animate);
        if (modelRef.current) {
          modelRef.current.rotation.y += 0.005;
        }
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
    };

    initThree();

    return () => {
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  const loadModel = async () => {
    const loader = new GLTFLoader();
    const currentVehicleData = vehicles[currentVehicle];

    try {
      // Nettoyage complet de la scène
      if (modelRef.current) {
        sceneRef.current.remove(modelRef.current);
        modelRef.current.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
        modelRef.current = null;
      }

      // Nettoyer tous les objets de la scène sauf les lumières
      while (sceneRef.current.children.length > 0) {
        const object = sceneRef.current.children[0];
        if (
          object.type === "AmbientLight" ||
          object.type === "DirectionalLight"
        ) {
          break;
        }
        sceneRef.current.remove(object);
      }

      const gltf = await loader.loadAsync(currentVehicleData.model);
      const model = gltf.scene;

      // Créer un groupe pour contenir le modèle
      const group = new THREE.Group();
      group.add(model);

      group.scale.setScalar(currentVehicleData.scale);
      group.position.set(...currentVehicleData.position);
      group.rotation.set(...currentVehicleData.rotation);

      // Centre le modèle
      const box = new THREE.Box3().setFromObject(group);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Ajuste la position du groupe
      group.position.sub(center.multiplyScalar(1));
      group.position.y = -size.y / 2;

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = cameraRef.current.fov * (Math.PI / 180);
      const cameraZ = Math.abs(maxDim / Math.sin(fov / 2));

      cameraRef.current.position.set(0, size.y * 0.8, cameraZ * 1.2);
      cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));

      // Assigner le groupe comme référence du modèle
      modelRef.current = group;
      sceneRef.current.add(group);
    } catch (error) {
      console.error("Erreur lors du chargement du modèle:", error);
    }
  };

  useEffect(() => {
    loadModel();
  }, [currentVehicle]);

  const nextVehicle = () => {
    setCurrentVehicle((prev) => (prev + 1) % vehicles.length);
  };

  const prevVehicle = () => {
    setCurrentVehicle((prev) => (prev - 1 + vehicles.length) % vehicles.length);
  };

  return (
    <div className="game-container">
      <button className="button button-secondary shop-button">
        <ShoppingBag size={24} />
        <span>Boutique</span>
      </button>

      <div className="vehicle-selector">
        <button className="button button-circular" onClick={prevVehicle}>
          <ChevronLeft size={32} />
        </button>

        <div className="vehicle-display" ref={containerRef} />

        <button className="button button-circular" onClick={nextVehicle}>
          <ChevronRight size={32} />
        </button>
      </div>

      <button className="button button-primary">
        <Play size={24} />
        JOUER
      </button>
    </div>
  );
};

export default GameStartPage;
