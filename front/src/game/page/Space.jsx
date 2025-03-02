import { Canvas } from "@react-three/fiber";
import { Scene } from "../scenes/Scene3";
import { useGLTF } from "@react-three/drei";
import { useState } from "react";

const Satellite = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
};

export default Satellite;

// Préchargement des modèles
useGLTF.preload("/assets/models/vehicles/rocket.glb");
useGLTF.preload("/assets/models/ciel.glb");
