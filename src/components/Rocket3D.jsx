import { useRef, forwardRef, useImperativeHandle, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";

const Rocket3D = forwardRef((props, ref) => {
  const rocketRef = useRef();
  const [launched, setLaunched] = useState(false);

  // Charger le modèle .glb
  const { scene } = useGLTF("/assets/models/rocket.glb");

  // Ajuster l'échelle et la rotation initiale
  scene.scale.set(0.5, 0.5, 0.5); // Ajustez selon la taille de votre modèle

  // Animation légère (rotation de la fusée)
  useFrame(() => {
    if (rocketRef.current && !launched) {
      rocketRef.current.rotation.y += 0.005;
    }
  });

  // Exposer la fonction `launchRocket` au parent
  useImperativeHandle(ref, () => ({
    launchRocket: () => {
      setLaunched(true);

      // Animation de lancement avec une trajectoire courbe
      gsap.to(rocketRef.current.position, {
        y: 30,
        duration: 6,
        ease: "power2.out",
        onUpdate: () => {
          rocketRef.current.position.needsUpdate = true; // Force Three.js à voir le changement
        },
        onComplete: () => {
          console.log("Rocket launched successfully!");
        }
      });

      // Ajouter une légère inclinaison lors du lancement
      gsap.to(rocketRef.current.rotation, {
        x: -Math.PI / 12, // Légère inclinaison vers l'avant
        duration: 2,
        ease: "power1.inOut"
      });
    },
  }));

  return (
    <group
      ref={rocketRef}
      position={[0, 2.2, 0]} // Position sur la surface de la terre
      {...props}
    >
      <primitive object={scene} />
    </group>
  );
});

export default Rocket3D;

// Préchargement du modèle
useGLTF.preload("/assets/models/rocket.glb");
