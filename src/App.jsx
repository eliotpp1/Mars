import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Rocket3D from "./components/Rocket3D";

function App() {
  const rocketRef = useRef();

  return (
    <div className="w-screen h-screen relative">
      <button onClick={() => rocketRef.current?.launchRocket()} className="">
        🚀 Lancer la fusée
      </button>

      <Canvas camera={{ position: [0, 3, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Rocket3D ref={rocketRef} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
