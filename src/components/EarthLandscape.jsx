import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { createTerrain, createTrees } from './../game/scenes/LandscapeObject';
import './EarthLandscape.css';
import Rocket3D from './Rocket3D'; // Importer Rocket3D

const EarthLandscape = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Ref pour contrôler le lancement de la fusée
  const rocketRef = useRef();

  // Variables pour les contrôles
  const controls = useRef({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    velocity: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    prevTime: 0
  });

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialisation
    const init = () => {
      // Création de la scène
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87CEEB); // Ciel bleu
      scene.fog = new THREE.FogExp2(0x87CEEB, 0.01);
      sceneRef.current = scene;

      // Création de la caméra
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 5, 30);
      cameraRef.current = camera;

      // Création du renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      rendererRef.current = renderer;
      mountRef.current.appendChild(renderer.domElement);

      // Lumières
      const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight.position.set(1, 1, 0.5).normalize();
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 500;
      scene.add(directionalLight);

      // Création du terrain et des arbres
      const terrain = createTerrain();
      scene.add(terrain);

      // Ajouter la fusée à la scène
      <Rocket3D ref={rocketRef} />;


      const trees = createTrees(50);
      trees.forEach(tree => scene.add(tree));

      // Indiquer que le montage est terminé
      setIsReady(true);
    };

    // Initialiser la scène, la caméra et le renderer
    init();

    // Gestion des contrôles
    const handleKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW': controls.current.moveForward = true; break;
        case 'KeyA': controls.current.moveLeft = true; break;
        case 'KeyS': controls.current.moveBackward = true; break;
        case 'KeyD': controls.current.moveRight = true; break;
        default: break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW': controls.current.moveForward = false; break;
        case 'KeyA': controls.current.moveLeft = false; break;
        case 'KeyS': controls.current.moveBackward = false; break;
        case 'KeyD': controls.current.moveRight = false; break;
        default: break;
      }
    };

    const handleMouseMove = (event) => {
      if (!isReady) return;
    
      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;
    
      // Rotation gauche/droite (horizontal) : Ne touche qu'à l'axe Y
      cameraRef.current.rotation.y -= movementX * 0.002;
    
      // Limiter la rotation haut/bas (verticale) pour éviter que la caméra se retrouve à l'envers
      const maxRotationX = Math.PI / 2; // 90 degrés vers le bas
      const minRotationX = -Math.PI / 2; // 90 degrés vers le haut
      cameraRef.current.rotation.x -= movementY * 0.002;
    
      // Applique la limite pour l'axe X
      if (cameraRef.current.rotation.x > maxRotationX) {
        cameraRef.current.rotation.x = maxRotationX;
      } else if (cameraRef.current.rotation.x < minRotationX) {
        cameraRef.current.rotation.x = minRotationX;
      }
    
      // Assurez-vous que la rotation sur l'axe Z est nulle
      cameraRef.current.rotation.z = 0;
    };
    
    // Animation principale
    const animate = () => {
      requestAnimationFrame(animate);

      const time = performance.now();
      const delta = (time - controls.current.prevTime) / 1000;

      controls.current.velocity.x -= controls.current.velocity.x * 10.0 * delta;
      controls.current.velocity.z -= controls.current.velocity.z * 10.0 * delta;

      controls.current.direction.z = Number(controls.current.moveForward) - Number(controls.current.moveBackward);
      controls.current.direction.x = Number(controls.current.moveRight) - Number(controls.current.moveLeft);
      controls.current.direction.normalize();

      if (controls.current.moveForward || controls.current.moveBackward)
        controls.current.velocity.z -= controls.current.direction.z * 200.0 * delta;
      if (controls.current.moveLeft || controls.current.moveRight)
        controls.current.velocity.x -= controls.current.direction.x * 200.0 * delta;

      cameraRef.current.translateX(-controls.current.velocity.x * delta);
      cameraRef.current.translateZ(controls.current.velocity.z * delta);

      // Fixer la hauteur de la caméra
      cameraRef.current.position.y = 5;

      controls.current.prevTime = time;

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    // Gestion du redimensionnement
    const handleResize = () => {
      if (!mountRef.current) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    // Ajout des écouteurs d'événements
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Démarrer l'animation
    animate();

    // Nettoyage
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }

      // Libérer la mémoire
      if (sceneRef.current) {
        sceneRef.current.traverse(object => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, []);

  const lockPointer = () => {
    const canvas = mountRef.current.querySelector('canvas');
    if (canvas) {
      canvas.requestPointerLock = canvas.requestPointerLock ||
                                 canvas.mozRequestPointerLock ||
                                 canvas.webkitRequestPointerLock;
      canvas.requestPointerLock();
    }
  };

  return (
    <div className="earth-landscape-container" ref={mountRef} onClick={lockPointer}>
      <div className="instructions">
        <h2>Paysage Terrestre</h2>
        <p>Utilisez ZQSD pour vous déplacer et la souris pour regarder autour</p>
        <p>Cliquez sur l'écran pour activer les contrôles</p>
        <button onClick={() => rocketRef.current.launchRocket()}>Lancer la fusée</button> {/* Lancer la fusée */}
      </div>
    </div>
  );
};

export default EarthLandscape;
