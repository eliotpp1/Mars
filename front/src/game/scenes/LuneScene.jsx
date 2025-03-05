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
  const dustRef = useRef();
  const apolloRef = useRef();
  const usaFlagRef = useRef();
  const franceFlagRef = useRef();
  const indiaRef = useRef();
  const chinaFlagRef = useRef();
  const orbitControlsRef = useRef();
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

  const createDustParticles = () => {
    const particleCount = 200;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      velocities[i * 3] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 1] = Math.random() * 0.2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "velocity",
      new THREE.BufferAttribute(velocities, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.2,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.position.set(0, 10, 6);
    dustRef.current = particles;

    return particles;
  };

  // Animation initiale (atterrissage)
  useEffect(() => {
    if (
      step === 0 &&
      rocketRef.current &&
      marsRef.current &&
      hasStartedLanding
    ) {
      rocketRef.current.visible = true;
      rocketRef.current.position.set(0, 200, 100);
      rocketRef.current.rotation.set(-Math.PI / 8, 0, 0);
      marsRef.current.position.set(500, 200, -1000);

      gsap
        .timeline({ onComplete: onLandingComplete })
        .fromTo(
          cameraRef.current.position,
          { x: 0, y: 50, z: 150 },
          {
            x: 0,
            y: 150,
            z: 50,
            duration: 5,
            ease: "sine.inOut",
            onUpdate: () =>
              cameraRef.current.lookAt(rocketRef.current.position),
          }
        )
        .to(
          rocketRef.current.position,
          { x: 0, y: 50, z: 6, duration: 5, ease: "sine.inOut" },
          0
        )
        .to(
          rocketRef.current.rotation,
          { x: 0, y: 0, z: 0, duration: 3, ease: "sine.inOut" },
          "-=3"
        )
        .to(rocketRef.current.position, {
          y: 15,
          duration: 4.483,
          ease: "power2.out",
        })
        .to(rocketRef.current.position, {
          y: 14.8,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        })
        .to(cameraRef.current.position, {
          x: 0,
          y: 100,
          z: 100,
          duration: 1,
          ease: "sine.inOut",
          onUpdate: () => cameraRef.current.lookAt(0, 5, 0),
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

  // Animation pour déplacer la caméra vers la scène des drapeaux (step 3) et revenir au véhicule
  useEffect(() => {
    if (
      step === 3 &&
      apolloRef.current &&
      cameraRef.current &&
      orbitControlsRef.current
    ) {
      // Désactiver temporairement les interactions
      orbitControlsRef.current.enabled = false;

      // Animation de déplacement de la caméra
      const cameraMovement = gsap.timeline({
        onComplete: () => {
          // Réactiver les contrôles après l'animation
          if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = true;
          }
        },
      });

      cameraMovement.to(cameraRef.current.position, {
        x: -450, // Position X plus large pour voir la scène
        y: 50, // Hauteur
        z: -100, // Profondeur
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          // Forcer la caméra à regarder vers la scène des drapeaux
          if (cameraRef.current) {
            cameraRef.current.lookAt(350, -15, -150);
          }

          // Mettre à jour manuellement le point de visée des OrbitControls
          if (orbitControlsRef.current) {
            orbitControlsRef.current.target.set(350, -15, -150);
            orbitControlsRef.current.update();
          }
        },
      });
    }
  }, [step]);

  // Animation de l’astéroïde (step 5)
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
    if (step === 5 && threatDestroyed && rocketRef.current && dustRef.current) {
      if (!isMuted) takeoffSound.play();

      const dustParticles = dustRef.current;
      const positions = dustParticles.geometry.attributes.position.array;
      const velocities = dustParticles.geometry.attributes.velocity.array;

      gsap.to(dustParticles.material, {
        opacity: 0,
        duration: 3,
        ease: "power1.out",
      });

      const animateDust = () => {
        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3] += velocities[i * 3];
          positions[i * 3 + 1] += velocities[i * 3 + 1];
          positions[i * 3 + 2] += velocities[i * 3 + 2];
        }
        dustParticles.geometry.attributes.position.needsUpdate = true;
      };

      gsap
        .timeline({
          onUpdate: animateDust,
          onComplete: () => navigate("/mars"),
        })
        .to(rocketRef.current.position, {
          y: 20,
          duration: 2,
          ease: "power1.in",
        })
        .to(
          rocketRef.current.rotation,
          { x: -Math.PI / 6, duration: 2, ease: "power1.in" },
          0
        )
        .to(rocketRef.current.position, {
          x: 500,
          y: 200,
          z: -1000,
          duration: 13.836,
          ease: "power2.in",
        });
    }
  };

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <Stars position={[0, 0, -1000]} radius={1000} count={5000} />
      <CameraSetup
        cameraRef={cameraRef}
        orbitControlsRef={orbitControlsRef} // Nouveau prop
        cameraPosition={[0, 50, 100]}
        cameraTarget={[0, 5, 0]}
      />
      <SceneObject
        modelPath="/assets/models/lune/lune.glb"
        position={[300, 0, 0]}
        scale={1000}
      />
      <SceneObject
        modelPath={vehicle || "/assets/models/vehicles/rocket.glb"}
        position={[-500, 14.8, 6]}
        scale={4}
        onClick={launchRocket}
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

      {/* Scène des drapeaux au step 3 */}
      {step >= 3 && (
        <>
          <SceneObject
            modelPath="/assets/models/lune/apollo.glb"
            position={[400, -14, -150]}
            rotation={[0, Math.PI / 2, 0]}
            scale={1}
            meshRef={apolloRef}
          />
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
                position={[-150, 100, -200]}
                scale={1.5}
                onClick={() => handleThreatClick("asteroid")}
                meshRef={asteroidRef}
                cursor="pointer"
              />
              <SceneObject
                modelPath="/assets/models/lune/toaster.glb"
                position={[0, 100, -200]}
                scale={100}
                onClick={() => handleThreatClick("toaster")}
                meshRef={toasterRef}
                cursor="pointer"
              />
              <SceneObject
                modelPath="/assets/models/lune/helmet.glb"
                position={[150, 100, -200]}
                scale={4}
                onClick={() => handleThreatClick("helmet")}
                meshRef={helmetRef}
                cursor="pointer"
              />
            </>
          )}
          {step === 5 && threatDestroyed && createDustParticles()}
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

// Préchargement des nouveaux modèles
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
