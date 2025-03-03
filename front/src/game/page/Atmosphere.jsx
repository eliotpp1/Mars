import { Canvas } from "@react-three/fiber";
import { Scene } from "./../scenes/Scene2";
import { useGLTF } from "@react-three/drei";
import { useState } from "react";
import { use } from "react";

const Atmosphere = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
};

export default Atmosphere;

// Préchargement des modèles
useGLTF.preload("/assets/models/vehicles/rocket.glb");
useGLTF.preload("/assets/models/ciel/fish.glb");
useGLTF.preload("/assets/models/ciel/plane.glb");
useGLTF.preload("/assets/models/ciel/planete.glb");
useGLTF.preload("/assets/models/ciel/voiture.glb");
useGLTF.preload("/assets/models/ciel/ciel.glb");
