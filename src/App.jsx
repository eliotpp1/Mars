import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { gsap } from "gsap";

const Scene = () => {
  const earthRef = useRef();
  const rocketRef = useRef();
  const cameraRef = useRef();
  const [launched, setLaunched] = useState(false);
  // Point focal initial de la caméra
  const [cameraTarget] = useState([10, 0, 0]);

  const earth = useGLTF("/assets/models/terre.glb");
  const rocket = useGLTF("/assets/models/rocket.glb");

  const launchRocket = () => {
    if (!launched) {
      setLaunched(true);
      gsap.to(rocketRef.current.position, {
        y: 30,
        duration: 4,
        ease: "power2.out",
      });
      gsap.to(rocketRef.current.rotation, {
        x: -Math.PI / 12,
        duration: 2,
        ease: "power1.inOut"
      });
    }
  };

  return (
    <>
      {/* Caméra avec position initiale */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 5, 15]}
        fov={75}
      />

      {/* Contrôles de caméra modifiés */}
      <OrbitControls
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={100}
        target={cameraTarget}
        screenSpacePanning={true}
      />

      {/* Terre */}
      <mesh
        ref={earthRef}
        position={[18, -2, -4]}
        scale={2}
      >
        <primitive object={earth.scene} />
      </mesh>

      {/* Fusée */}
      <mesh
        ref={rocketRef}
        position={[0, 2, 0]}
        scale={10}
        onClick={launchRocket}
      >
        <primitive object={rocket.scene} />
      </mesh>

      {/* Éclairage */}
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, 5, 5]} intensity={1} />
    </>
  );
};

const App = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
};

export default App;

useGLTF.preload("/assets/models/terre.glb");
useGLTF.preload("/assets/models/rocket.glb");