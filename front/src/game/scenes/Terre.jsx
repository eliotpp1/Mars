// src/game/scenes/EarthScene.js
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

export default function Terre() {
  const rocketRef = useRef();

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <mesh ref={rocketRef} position={[0, 0, 0]}>
        <coneGeometry args={[1, 2, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}
