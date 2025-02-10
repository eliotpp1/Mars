import { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function Terre() {
  const earthRef = useRef();

  return (
    <mesh ref={earthRef} position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#008000" />
    </mesh>
  );
}