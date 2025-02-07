// src/game/components/Rocket3D.jsx
import { useRef, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei"; // Hook pour charger un modèle GLTF/GLB
import gsap from "gsap";

const Rocket3D = forwardRef((props, ref) => {
  const rocketRef = useRef();

  // Charger le modèle .glb (assure-toi que le chemin est correct)
  const { scene } = useGLTF("/assets/models/rocket.glb"); // Remplace ce chemin par celui de ton fichier .glb

  // Animation légère (rotation de la fusée)
  useFrame(() => {
    if (rocketRef.current) {
      rocketRef.current.rotation.y += 0.005;
    }
  });

  // Exposer la fonction `launchRocket` au parent
  useImperativeHandle(ref, () => ({
    launchRocket: () => {
      gsap.to(rocketRef.current.position, {
        y: 10,
        duration: 3,
        ease: "power2.out",
      });
    },
  }));

  return (
    <group ref={rocketRef} position={[0, 0, 0]}>
      {/* Charger le modèle 3D de la fusée */}
      <primitive object={scene} />
    </group>
  );
});

export default Rocket3D;
