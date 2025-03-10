import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useThree, useFrame } from "@react-three/fiber";
import { SceneObject } from "../../components/SceneObject";
import { CameraSetup } from "../../components/CameraSetup";
import { useSound } from "../../context/SoundContext";
import { SunRay } from "../../components/SunRay";
import API_URL from "../../constants/api";

export const Scene = ({ gameState, setGameState, handleFinalContinue, rocketRef, startFinalAnimation }) => {
  const { camera } = useThree();
  const { isMuted } = useSound();

  const [isRocketAnimating, setIsRocketAnimating] = useState(false);
  const [isIntroAnimating, setIsIntroAnimating] = useState(true);
  const [vehicle, setVehicle] = useState(null);
  const [introComplete, setIntroComplete] = useState(false);
  
  // Flag pour contrôler si la caméra doit automatiquement suivre la fusée
  const shouldFollowRocket = useRef(true);

  const planeRef = useRef();
  const yellowRayBoxRef = useRef();

  const rayHeight = 200;
  const baseX = 150;
  const baseZ = 0;
  const ambianceSound = useRef(new Audio("/assets/sounds/vent.mp3")).current;
  const winSound = new Audio("/assets/sounds/correct.mp3");

  useEffect(() => {
    if (localStorage.getItem("selectedVehicle") === null) {
      localStorage.setItem("selectedVehicle", 0);
    }
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    let id = parseInt(localStorage.getItem("selectedVehicle")) + 1;
    const response = await fetch(`${API_URL}/vehicles/${id}`);
    const data = await response.json();
    setVehicle(data.model);
  };

  // Gestion de l'animation d'introduction
  useEffect(() => {
    if (isIntroAnimating && rocketRef.current) {
      // Position initiale de la fusée en dehors de l'écran
      rocketRef.current.position.y = -500;
      
      // Animation de montée de la fusée
      gsap.to(rocketRef.current.position, {
        y: 2,
        duration: 8,
        ease: "power1.inOut",
        onComplete: () => {
          setIsIntroAnimating(false);
          setIntroComplete(true);
          shouldFollowRocket.current = false; // Arrêter de suivre la fusée après l'intro
          setGameState((prev) => ({ ...prev, currentGame: 1 }));
        },
      });
      
      // Animation de la caméra (indépendante de l'animation de la fusée)
      gsap.to(camera.position, {
        x: 70,
        y: 5,
        z: -48,
        duration: 8,
        ease: "power1.inOut",
      });
    }
  }, [isIntroAnimating, camera]);

  useEffect(() => {
    ambianceSound.loop = true;
    ambianceSound.volume = 0.1;
    if (!isMuted) {
      ambianceSound.play().catch(() => {
        const startOnInteraction = () => {
          ambianceSound.play();
          document.removeEventListener("click", startOnInteraction);
        };
        document.addEventListener("click", startOnInteraction);
      });
    } else {
      ambianceSound.pause();
      ambianceSound.currentTime = 0;
    }
    return () => {
      ambianceSound.pause();
      ambianceSound.currentTime = 0;
    };
  }, [isMuted]);

  // Activer le suivi de la caméra pour l'animation finale
  useEffect(() => {
    if (startFinalAnimation) {
      setIsRocketAnimating(true);
      shouldFollowRocket.current = true; // Réactiver le suivi pour l'animation finale
    }
  }, [startFinalAnimation]);

  const handlePlaneClick = () => {
    if (gameState.currentGame === 1 && !gameState.game1Completed) {
      setGameState((prev) => ({
        ...prev,
        game1Completed: true,
        showPopup: true,
        popupMessage: "Bravo ! Vous avez trouvé l'avion. Prochain défi : cliquez sur le rayon de la bonne couleur !",
        currentGame: 2,
      }));
      if (!isMuted) winSound.play();
    }
  };

  const handleYellowRayClick = () => {
    if (gameState.currentGame === 2 && !gameState.game2Completed) {
      setGameState((prev) => ({
        ...prev,
        game2Completed: true,
        showPopup: true,
        popupMessage: "Parfait ! Vous avez trouvé le rayon jaune. Dernier défi : guidez l'avion hors de l'atmosphère !",
        currentGame: 3,
      }));
      if (!isMuted) winSound.play();
    }
  };

  // Gestion de la caméra dans le cycle de rendu
  useFrame(() => {
    if (rocketRef.current) {
      // Condition de suivi modifiée pour ne s'activer que pendant l'animation d'intro
      // ou l'animation finale, mais pas pendant le gameplay normal
      if (shouldFollowRocket.current && ((isIntroAnimating || isRocketAnimating))) {
        // Pour l'animation d'intro, on veut que la caméra regarde toujours la fusée
        if (isIntroAnimating) {
          camera.lookAt(rocketRef.current.position);
        }
        // Pour l'animation finale, on veut suivre la fusée avec la caméra
        else if (isRocketAnimating) {
          const targetCameraPosition = {
            x: rocketRef.current.position.x + 50,
            y: rocketRef.current.position.y + 30,
            z: rocketRef.current.position.z + 50,
          };
          camera.position.lerp(targetCameraPosition, 0.05);
          camera.lookAt(rocketRef.current.position);
        }
      }
    }
  });

  return (
    <>
      <color attach="background" args={["#000020"]} />
      <CameraSetup cameraPosition={[70, 5, -48]} />

      <SceneObject modelPath="/assets/models/ciel/ciel.glb" position={[0, 0, 0]} scale={10} />
      <SceneObject modelPath="/assets/models/ciel/planete.glb" position={[0, -800, 0]} rotation={[0, 2.8, 0]} scale={300} />
      <SceneObject modelPath="/assets/models/ciel/sun.glb" position={[150, 250, 50]} scale={0.2} />

      <group ref={planeRef} position={[-70, -100, -50]} rotation={[0, -5, 0]}>
        <mesh visible={false} onClick={handlePlaneClick} scale={[3, 3, 3]}>
          <boxGeometry args={[10, 5, 10]} />
          <meshBasicMaterial opacity={0} transparent />
        </mesh>
        <SceneObject modelPath="/assets/models/ciel/plane.glb" scale={0.5} />
      </group>

      <group position={[0, 100, 10]}>
        <SceneObject modelPath="/assets/models/ciel/fish.glb" scale={10} />
      </group>

      <group ref={rocketRef} position={[0, -500, 0]}>
        <SceneObject modelPath={vehicle || "/assets/models/vehicles/rocket.glb"} position={[0, 0, 0]} scale={20} />
      </group>

      <group position={[-200, 0, 25]} rotation={[0, 3.2, 0]}>
        <SceneObject modelPath="/assets/models/ciel/voiture.glb" scale={10} />
      </group>

      <group position={[baseX, rayHeight, baseZ]}>
        <group rotation={[0, 0, 0]}>
          <mesh ref={yellowRayBoxRef} visible={false} position={[0, 500, 50]} onClick={handleYellowRayClick}>
            <cylinderGeometry args={[5, 5, 2000, 5]} />
            <meshBasicMaterial opacity={0} transparent />
          </mesh>
          <SunRay startPosition={[0, 50, 50]} length={1000} width={4} color="#FFA500" pulsate={true} />
        </group>
        <SunRay startPosition={[5, 80, 40]} rotation={[0, 0, 0]} length={10000} width={4} color="red" pulsate={true} />
        <SunRay startPosition={[5, 80, 64]} length={10000} width={4} color="blue" pulsate={true} />
      </group>

      <ambientLight intensity={4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, 5, 5]} intensity={1} />
    </>
  );
};