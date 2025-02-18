import { Canvas } from "@react-three/fiber";
import { Scene } from './components/Scene';
import { useGLTF } from "@react-three/drei";
import { useState } from "react";
import './App.css';

const App = () => {
  const [birdFound, setBirdFound] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {!birdFound && (
        <div 
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.8)",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
            fontFamily: "Arial, sans-serif"
          }}
        >
          Trouve l'oiseau pour avancer !
        </div>
      )}
      <Canvas>
        <Scene setBirdFound={setBirdFound} />
      </Canvas>
    </div>
  );
};

export default App;

// N'oubliez pas de précharger les modèles
useGLTF.preload("/assets/models/terre.glb");
useGLTF.preload("/assets/models/rocket.glb");
useGLTF.preload("/assets/models/bird.glb");
useGLTF.preload("/assets/models/snake.glb");
useGLTF.preload("/assets/models/homme.gltf");
useGLTF.preload("/assets/models/tiger.glb");