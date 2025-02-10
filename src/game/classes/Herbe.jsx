import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Herbe() {
  const grassRef = useRef();
  const { scene } = useGLTF("/assets/models/herbe.glb");

  return <primitive ref={grassRef} object={scene} position={[0, -0.6, 0]} />;
}

useGLTF.preload("/models/herbe.glb");