import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Stars } from "../../components/Stars";
import { SceneObject } from "../../components/SceneObject";
import { CameraSetup } from "../../components/CameraSetup";
import { useNavigate } from "react-router-dom";
import { useGLTF } from "@react-three/drei";
import API_URL from "../../constants/api";

export const Scene = ({
  step,
  threatDestroyed,
  handleThreatClick,
  handlePlanetSelection,
}) => {
  const navigate = useNavigate();
  const cameraRef = useRef();
  const rocketRef = useRef();
  const asteroidRef = useRef();
  const toasterRef = useRef();
  const helmetRef = useRef();
  const terreRef = useRef();
  const marsRef = useRef();
  const venusRef = useRef();
  const jupiterRef = useRef();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    try {
      let id = parseInt(localStorage.getItem("selectedVehicle")) + 1;
      const response = await fetch(`${API_URL}/vehicles/${id}`);
      const data = await response.json();
      setVehicle(data.model);
    } catch (error) {
      console.error("Erreur lors du chargement du véhicule:", error);
      // Utiliser un modèle par défaut en cas d'erreur
      setVehicle("/assets/models/vehicles/rocket.glb");
    }
  };

  // Animation des planètes dans le ciel
  useEffect(() => {
    if (
      step === 1 &&
      terreRef.current &&
      marsRef.current &&
      venusRef.current &&
      jupiterRef.current
    ) {
      // S'assurer que les animations précédentes sont tuées avant d'en créer de nouvelles
      gsap.killTweensOf(terreRef.current.position);
      gsap.killTweensOf(marsRef.current.position);
      gsap.killTweensOf(venusRef.current.position);
      gsap.killTweensOf(jupiterRef.current.position);

      // Ajuster les positions initiales pour s'assurer qu'elles sont visibles
      terreRef.current.position.set(-20, 25, -15);
      marsRef.current.position.set(20, 20, -20);
      venusRef.current.position.set(0, 15, -25);
      jupiterRef.current.position.set(30, 30, -30);

      // Animer les planètes avec des amplitudes d'oscillation plus faibles
      gsap.to(terreRef.current.position, {
        y: 27, // Amplitude réduite
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(marsRef.current.position, {
        y: 22, // Amplitude réduite
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(venusRef.current.position, {
        y: 17, // Amplitude réduite
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(jupiterRef.current.position, {
        y: 32, // Amplitude réduite
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }
  }, [step]);

  // Animation des menaces
  useEffect(() => {
    if (
      step === 5 &&
      !threatDestroyed &&
      asteroidRef.current &&
      toasterRef.current &&
      helmetRef.current
    ) {
      gsap.to(asteroidRef.current.position, {
        y: 10,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(toasterRef.current.position, {
        y: 8,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(helmetRef.current.position, {
        y: 6,
        duration: 1.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }
  }, [step, threatDestroyed]);

  const launchRocket = () => {
    if (step === 5 && threatDestroyed && rocketRef.current) {
      gsap.to(rocketRef.current.position, {
        y: 50,
        duration: 3,
        ease: "power2.out",
        onComplete: () => navigate("/mars"),
      });
    }
  };

  return (
    <>
      <color attach="background" args={["#000000"]} />{" "}
      {/* Fond plus sombre pour meilleur contraste */}
      <Stars position={[0, 0, -1000]} radius={1000} count={5000} />{" "}
      {/* Étoiles loin derrière */}
      {/* Ajusté pour la Lune */}
      <CameraSetup
        cameraRef={cameraRef}
        cameraPosition={[0, 100, 100]} // Position de la caméra ajustée
        cameraTarget={[0, 5, 0]} // Vise légèrement au-dessus de la surface
      />
      {/* Modèle de la Lune */}
      <SceneObject
        modelPath="/assets/models/lune/lune.glb"
        position={[300, 0, 0]} // Position centrée
        scale={1000}
      />
      {/* Véhicule posé sur la Lune - aligné avec la surface de la lune */}
      <SceneObject
        modelPath={vehicle || "/assets/models/vehicles/rocket.glb"}
        position={[0, 15, 6]} // Positionné sur la surface de la lune
        scale={4}
        onClick={launchRocket}
        meshRef={rocketRef}
        rotation={[0, 0, 0]} // S'assurer que la rotation est correcte
      />
      {/* Planètes dans le ciel (Étape 1) */}
      {step === 1 && (
        <>
          <SceneObject
            modelPath="/assets/models/planets/terre.glb"
            scale={4} // Échelle ajustée pour la Terre
            onClick={() => handlePlanetSelection("Terre")}
            meshRef={terreRef}
            cursor="pointer"
          />
          <SceneObject
            modelPath="/assets/models/planets/mars.glb"
            position={[150, 120, -250]}
            scale={2.1} // Échelle ajustée pour Mars
            onClick={() => handlePlanetSelection("Mars")}
            meshRef={marsRef}
            cursor="pointer"
          />
          <SceneObject
            modelPath="/assets/models/planets/venus.glb"
            position={[1000, 80, -220]}
            scale={3.8} // Garder l'échelle qui fonctionne pour Venus
            onClick={() => handlePlanetSelection("Venus")}
            meshRef={venusRef}
            cursor="pointer"
          />
          <SceneObject
            modelPath="/assets/models/planets/jupiter.glb"
            position={[200, 150, -300]}
            scale={6} // Échelle ajustée pour Jupiter
            onClick={() => handlePlanetSelection("Jupiter")}
            meshRef={jupiterRef}
            cursor="pointer"
          />
        </>
      )}
      {/* Menaces (Étape 5) */}
      {step === 5 && !threatDestroyed && (
        <>
          <SceneObject
            modelPath="/assets/models/lune/asteroid.glb"
            position={[20, 15, 0]}
            scale={3}
            onClick={() => handleThreatClick("asteroid")}
            meshRef={asteroidRef}
            cursor="pointer"
          />
          <SceneObject
            modelPath="/assets/models/lune/toaster.glb"
            position={[0, 10, 20]}
            scale={2}
            onClick={() => handleThreatClick("toaster")}
            meshRef={toasterRef}
            cursor="pointer"
          />
          <SceneObject
            modelPath="/assets/models/lune/helmet.glb"
            position={[-20, 12, 0]}
            scale={2}
            onClick={() => handleThreatClick("helmet")}
            meshRef={helmetRef}
            cursor="pointer"
          />
        </>
      )}
      {/* Éclairage amélioré pour une meilleure visibilité */}
      <ambientLight intensity={0.5} /> {/* Lumière ambiante modérée */}
      <directionalLight position={[10, 15, 10]} intensity={1.5} />{" "}
      {/* Lumière principale plus intense */}
      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.8}
        color="#aabbff"
      />{" "}
      {/* Lumière secondaire */}
      <pointLight
        position={[0, 5, 0]}
        intensity={1.2}
        distance={50}
        color="#ffffff"
      />{" "}
      {/* Lumière pour la lune */}
      <spotLight
        position={[5, 20, 15]}
        angle={0.6}
        penumbra={0.2}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />{" "}
      {/* Spot pour mettre en valeur la fusée et la lune */}
    </>
  );
};

// Préchargement des modèles
useGLTF.preload("/assets/models/lune/lune.glb");
useGLTF.preload("/assets/models/vehicles/rocket.glb");
useGLTF.preload("/assets/models/planets/terre.glb");
useGLTF.preload("/assets/models/planets/mars.glb");
useGLTF.preload("/assets/models/planets/venus.glb");
useGLTF.preload("/assets/models/planets/jupiter.glb");
useGLTF.preload("/assets/models/lune/asteroid.glb");
useGLTF.preload("/assets/models/lune/toaster.glb");
useGLTF.preload("/assets/models/lune/helmet.glb");
