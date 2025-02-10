import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import GameStartPage from "./components/GetStartGame";

function App() {
  return (
    <div>
      <GameStartPage />
      <Canvas
        // style={{ width: "100vw", height: "100vh" }}
        camera={{ position: [3, 0, 0] }}
      >
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} />

        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
