import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Stars } from "../../components/Stars";
import { SceneObject } from "../../components/SceneObject";
import { CameraSetup } from "../../components/CameraSetup";
import { useNavigate } from "react-router-dom";
import { useGLTF } from "@react-three/drei";
import API_URL from "../../constants/api";
import * as THREE from "three";

export const Scene = ({
  step,
  threatDestroyed,
  handleThreatClick,
  handlePlanetSelection,
  handleFlagUproot,
  uprootedFlags,
  onLandingComplete,
  isMuted,
  hasStartedLanding,
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
  const apolloRef = useRef();
  const usaFlagRef = useRef();
  const franceFlagRef = useRef();
  const indiaRef = useRef();
  const chinaFlagRef = useRef();
  const orbitControlsRef = useRef();
  const alienRef = useRef();
  const [vehicle, setVehicle] = useState(null);

  const takeoffSound = new Audio("/assets/sounds/takeoff.mp3");

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
      setVehicle("/assets/models/vehicles/rocket.glb");
    }
  };

  // Animation initiale (atterrissage)
  // Animation initiale (atterrissage)
  useEffect(() => {
    if (
      step === 0 &&
      rocketRef.current &&
      marsRef.current &&
      hasStartedLanding
    ) {
      rocketRef.current.visible = true;
      rocketRef.current.position.set(15, 200, 35); // Position initiale avec x à 15
      rocketRef.current.rotation.set(-Math.PI / 8, 0, 0);
      marsRef.current.position.set(500, 200, -1000);

      gsap
        .timeline({ onComplete: onLandingComplete })
        .fromTo(
          cameraRef.current.position,
          { x: 15, y: 50, z: 85 }, // Caméra alignée avec l'axe x de la fusée
          {
            x: 15, // Garde la caméra centrée sur l'axe x de la fusée
            y: 150,
            z: 85,
            duration: 5,
            ease: "sine.inOut",
            onUpdate: () =>
              cameraRef.current.lookAt(rocketRef.current.position),
          }
        )
        .to(
          rocketRef.current.position,
          { x: 15, y: 50, z: 35, duration: 5, ease: "sine.inOut" },
          0
        )
        .to(
          rocketRef.current.rotation,
          { x: 0, y: 0, z: 0, duration: 3, ease: "sine.inOut" },
          "-=3"
        )
        .to(rocketRef.current.position, {
          x: 15, // Maintient x à 15
          y: 6.5,
          z: 35,
          duration: 5,
          ease: "power2.out",
          onUpdate: () => {
            // La caméra reste alignée sur l'axe x de la fusée
            cameraRef.current.position.x = 15;
            cameraRef.current.position.y = rocketRef.current.position.y + 30;
            cameraRef.current.lookAt(rocketRef.current.position);
          },
        })
        .to(cameraRef.current.position, {
          x: 15, // Maintient l'alignement en x
          y: 50,
          z: 85,
          duration: 1,
          ease: "sine.inOut",
          onUpdate: () => cameraRef.current.lookAt(15, 6.5, 35), // Regarde vers la position finale centrée de la fusée
        });
    }
    if (rocketRef.current && !hasStartedLanding) {
      rocketRef.current.visible = false;
    }
  }, [step, hasStartedLanding]);

  // Animation des planètes (step 1)
  useEffect(() => {
    if (
      step === 1 &&
      terreRef.current &&
      marsRef.current &&
      venusRef.current &&
      jupiterRef.current
    ) {
      gsap.killTweensOf(terreRef.current.position);
      gsap.killTweensOf(marsRef.current.position);
      gsap.killTweensOf(venusRef.current.position);
      gsap.killTweensOf(jupiterRef.current.position);

      terreRef.current.position.set(-20, 25, -15);
      marsRef.current.position.set(20, 20, -20);
      venusRef.current.position.set(0, 15, -25);
      jupiterRef.current.position.set(30, 30, -30);

      gsap.to(terreRef.current.position, {
        y: 27,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(marsRef.current.position, {
        y: 22,
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(venusRef.current.position, {
        y: 17,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(jupiterRef.current.position, {
        y: 32,
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }

    if (step >= 2 && marsRef.current) {
      gsap.killTweensOf(marsRef.current.position);
      gsap.to(marsRef.current.position, {
        x: 500,
        y: 200,
        z: -1000,
        duration: 1,
        ease: "power2.out",
      });
    }
  }, [step]);

  // Animation pour déplacer la caméra vers la scène des drapeaux (step 3)
  useEffect(() => {
    if (
      step === 3 &&
      apolloRef.current &&
      cameraRef.current &&
      orbitControlsRef.current
    ) {
      orbitControlsRef.current.enabled = false;

      const cameraMovement = gsap.timeline({
        onComplete: () => {
          if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = true;
          }
        },
      });

      cameraMovement.to(cameraRef.current.position, {
        x: -450,
        y: 50,
        z: -100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          if (cameraRef.current) {
            cameraRef.current.lookAt(350, -15, -150);
          }
          if (orbitControlsRef.current) {
            orbitControlsRef.current.target.set(350, -15, -150);
            orbitControlsRef.current.update();
          }
        },
      });
    }
  }, [step]);

  // Animation de l'astéroïde avant destruction (step 5)
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

  // Animation de destruction de l'astéroïde
  useEffect(() => {
    if (step === 5 && threatDestroyed && asteroidRef.current) {
      gsap
        .timeline({
          onComplete: () => {
            if (asteroidRef.current) {
              asteroidRef.current.visible = false; // Masquer l'astéroïde après l'animation
            }
          },
        })
        .to(asteroidRef.current.scale, {
          x: 2,
          y: 2,
          z: 2,
          duration: 0.5,
          ease: "power2.out",
        })
        .to(asteroidRef.current.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.8,
          ease: "power2.in",
        })
        .to(
          asteroidRef.current.position,
          {
            y: "+=20",
            duration: 1.3,
            ease: "power1.inOut",
          },
          0
        );
    }
  }, [threatDestroyed]);

  // Animation de décollage du véhicule
  const launchRocket = () => {
    if (step === 5 && threatDestroyed && rocketRef.current) {
      if (!isMuted) takeoffSound.play();

      gsap
        .timeline({
          onComplete: () => navigate("/mars"),
        })
        .to(rocketRef.current.position, {
          y: 20,
          duration: 1.5,
          ease: "power1.in",
        })
        .to(
          rocketRef.current.rotation,
          { x: -Math.PI / 6, duration: 1.5, ease: "power1.in" },
          0
        )
        .to(rocketRef.current.position, {
          x: 500,
          y: 200,
          z: -1000,
          duration: 3,
          ease: "power2.in",
        });
    }
  };

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <CameraSetup
        cameraRef={cameraRef}
        orbitControlsRef={orbitControlsRef}
        cameraPosition={[0, 50, 100]}
        cameraTarget={[0, 5, 0]}
      />
      <SceneObject
        modelPath="/assets/models/lune/decor.glb"
        position={[0, 0, 0]}
        scale={500}
      />
      <SceneObject
        modelPath="/assets/models/lune/lune.glb"
        position={[300, 0, 0]}
        scale={1000}
      />
      <SceneObject
        modelPath={vehicle || "/assets/models/vehicles/rocket.glb"}
        position={[-500, 15, 6]}
        scale={55}
        onClick={() => launchRocket()}
        meshRef={rocketRef}
        rotation={[0, 0, 0]}
        cursor={step === 5 && threatDestroyed ? "pointer" : "default"}
      />
      <SceneObject
        modelPath="/assets/models/planets/mars.glb"
        position={[500, 200, -1000]}
        scale={2.1}
        meshRef={marsRef}
      />
      <SceneObject
        modelPath="/assets/models/lune/apollo.glb"
        position={[400, -14, -150]}
        rotation={[0, Math.PI / 2, 0]}
        scale={1}
        meshRef={apolloRef}
      />
      <SceneObject
        modelPath="/assets/models/lune/alien.glb"
        position={[-400, -100, 200]}
        rotation={[0, 1.9, 0]}
        scale={1}
        meshRef={alienRef}
      />
      {step >= 3 && (
        <>
          {!uprootedFlags.includes("USA") && (
            <SceneObject
              modelPath="/assets/models/lune/usa_flag.glb"
              position={[45, -22, -75]}
              scale={0.025}
              rotation={[0, Math.PI / 1, 0]}
              onClick={() => handleFlagUproot("USA")}
              meshRef={usaFlagRef}
              cursor="pointer"
            />
          )}
          {!uprootedFlags.includes("France") && (
            <SceneObject
              modelPath="/assets/models/lune/france_flag.glb"
              position={[15, -16.5, -75]}
              rotation={[0, Math.PI / 2, 0]}
              scale={85}
              onClick={() => handleFlagUproot("France")}
              meshRef={franceFlagRef}
              cursor="pointer"
            />
          )}
          {!uprootedFlags.includes("Inde") && (
            <SceneObject
              modelPath="/assets/models/lune/india_flag.glb"
              position={[-55, -25, -93]}
              scale={20}
              onClick={() => handleFlagUproot("Inde")}
              meshRef={indiaRef}
              cursor="pointer"
            />
          )}
          {!uprootedFlags.includes("Chine") && (
            <SceneObject
              modelPath="/assets/models/lune/china_flag.glb"
              position={[-85, -16.5, -75]}
              scale={4.5}
              rotation={[0, -Math.PI / 1, 0]}
              onClick={() => handleFlagUproot("Chine")}
              meshRef={chinaFlagRef}
              cursor="pointer"
            />
          )}
        </>
      )}
      {step >= 1 && (
        <>
          {step === 1 && (
            <>
              <SceneObject
                modelPath="/assets/models/planets/terre.glb"
                scale={4}
                onClick={() => handlePlanetSelection("Terre")}
                meshRef={terreRef}
                cursor="pointer"
              />
              <SceneObject
                modelPath="/assets/models/planets/venus.glb"
                position={[1000, 80, -220]}
                scale={3.8}
                onClick={() => handlePlanetSelection("Venus")}
                meshRef={venusRef}
                cursor="pointer"
              />
              <SceneObject
                modelPath="/assets/models/planets/jupiter.glb"
                position={[200, 150, -300]}
                scale={6}
                onClick={() => handlePlanetSelection("Jupiter")}
                meshRef={jupiterRef}
                cursor="pointer"
              />
            </>
          )}
          {step === 5 && !threatDestroyed && (
            <>
              <SceneObject
                modelPath="/assets/models/lune/asteroid.glb"
                position={[-135, 175, -150]}
                scale={1.35}
                onClick={() => handleThreatClick("asteroid")}
                meshRef={asteroidRef}
                cursor="pointer"
              />
              <SceneObject
                modelPath="/assets/models/lune/toaster.glb"
                position={[0, 100, -150]}
                scale={100}
                onClick={() => handleThreatClick("toaster")}
                meshRef={toasterRef}
                cursor="pointer"
              />
              <SceneObject
                modelPath="/assets/models/lune/helmet.glb"
                position={[135, 100, -150]}
                scale={4}
                onClick={() => handleThreatClick("helmet")}
                meshRef={helmetRef}
                cursor="pointer"
              />
            </>
          )}
        </>
      )}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} />
      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.8}
        color="#aabbff"
      />
      <pointLight
        position={[0, 5, 0]}
        intensity={1.2}
        distance={50}
        color="#ffffff"
      />
      <spotLight
        position={[5, 20, 15]}
        angle={0.6}
        penumbra={0.2}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
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
useGLTF.preload("/assets/models/lune/apollo.glb");
useGLTF.preload("/assets/models/lune/usa_flag.glb");
useGLTF.preload("/assets/models/lune/france_flag.glb");
useGLTF.preload("/assets/models/lune/india_flag.glb");
useGLTF.preload("/assets/models/lune/china_flag.glb");
useGLTF.preload("/assets/models/lune/alien.glb");
