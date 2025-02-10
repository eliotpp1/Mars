import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Rocket3D from "./components/Rocket3D";
import Terre from "./game/scenes/Terre";
import Herbe from "./game/classes/Herbe";

function App() {
  const rocketRef = useRef();

  return (
    <div className="w-screen h-screen relative" style={{ backgroundColor: "#000" }}>
      <button onClick={() => rocketRef.current?.launchRocket()} className="">
        🚀 Lancer la fusée
      </button>

      <Canvas
        style={{ width: "100vw", height: "100vh" }}
        camera={{ position: [0, 1, 5] }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Rocket3D ref={rocketRef} />
        <Terre />
        <Herbe />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;