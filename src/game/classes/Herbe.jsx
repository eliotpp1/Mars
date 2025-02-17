import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Herbe({ position, rotation, scale }) {
  const grassRef = useRef();
  const { scene } = useGLTF("/assets/models/herbe.glb");

  return (
    <primitive
      ref={grassRef}
      object={scene.clone()} // Clonez le modèle pour chaque instance
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

useGLTF.preload("/assets/models/herbe.glb");
