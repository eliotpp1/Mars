import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { Stars } from "../../components/Stars";
import { SceneObject } from "../../components/SceneObject";
import { CameraSetup } from "../../components/CameraSetup";
import SimonSays from "../../components/SimonSays"; // Corrigez le chemin ici

export const Scene = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const rocketRef = useRef();
  const cameraRef = useRef();

  useEffect(() => {
    if (isZoomed && rocketRef.current && cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        x: 0,
        y: 2,
        z: 5,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          cameraRef.current.lookAt(rocketRef.current.position);
        },
      });
    }
  }, [isZoomed]);

  const handleRocketClick = () => {
    setIsZoomed(true);
  };

  return (
    <>
      <color attach="background" args={["#000020"]} />

      <CameraSetup cameraPosition={[70, 5, -48]} ref={cameraRef} />

      <SceneObject
        modelPath="/assets/models/ciel.glb"
        position={[0, 0, 0]}
        scale={10}
      />

      <SceneObject
        modelPath="/assets/models/vehicles/rocket.glb"
        position={[0, 2, 0]}
        scale={10}
        onClick={handleRocketClick}
        ref={rocketRef}
      />

      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, 5, 5]} intensity={1} />

      <SimonSays /> {/* Ajoutez le composant SimonSays ici */}
    </>
  );
};
