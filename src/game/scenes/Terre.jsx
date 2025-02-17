import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Terre() {
  const earthRef = useRef();

  // Charger la texture
  const texture = useTexture("/assets/textures/grass.jpg"); // Remplacez par le chemin de votre texture

  // Rotation lente
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Sphère terrestre */}
      <mesh
        ref={earthRef}
        position={[0, -2, 0]}
        receiveShadow
        castShadow
      >
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial
          map={texture} // Appliquer la texture ici
          roughness={1}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}
