import { useRef, useState } from "react";
import { gsap } from "gsap";
import { Stars } from './Stars';
import { SceneObject } from './SceneObject';
import { AnimatedHuman } from './AnimatedHuman';
import { CameraSetup } from './CameraSetup';

export const Scene = ({ setBirdFound }) => {
  const cameraRef = useRef();
  const birdRef = useRef();
  const humanRef = useRef();
  const rocketRef = useRef();
  const [launched, setLaunched] = useState(false);
  const [cameraTarget, setCameraTarget] = useState([65, 0, -47]);

  const handleBirdClick = () => {
    setBirdFound(true);
    
    // Animation de l'humain
    gsap.to(humanRef.current.position, {
      x: 35,
      duration: 2,
      ease: "power1.inOut"
    });

    // Animation de l'oiseau
    gsap.to(birdRef.current.position, {
      y: 25,
      duration: 1.5,
      ease: "power1.out"
    });
    gsap.to(birdRef.current.rotation, {
      y: Math.PI * 2,
      duration: 2,
      ease: "power1.inOut"
    });

// Variables pour stocker les valeurs de la cible
let targetX = cameraTarget[0]; // 65 initialement
let targetY = cameraTarget[1]; // 0 initialement
let targetZ = cameraTarget[2]; // -47 initialement

// Animation complexe de la caméra
gsap.timeline()
  .to(cameraRef.current.position, {
    x: 60,
    y: 10,
    z: -40,
    duration: 1,
    ease: "power2.inOut"
  })
  .to(cameraRef.current.position, {
    x: 50,
    y: 5,
    z: -48,
    duration: 1.5,
    ease: "power1.out"
  });

// Mise à jour de la cible de la caméra (corrigée)
gsap.to({ x: targetX, y: targetY, z: targetZ }, {
  x: 45,
  y: 5,
  z: -48,
  duration: 2,
  ease: "power1.inOut",
  onUpdate: function() {
    setCameraTarget([this.targets()[0].x, this.targets()[0].y, this.targets()[0].z]);
  }
});
};

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
      <color attach="background" args={['#000020']} />
      <Stars />
      
      <CameraSetup 
        cameraRef={cameraRef}
        cameraPosition={[75, 5, -48]}
        cameraTarget={cameraTarget}
      />

      <SceneObject
        modelPath="/assets/models/terre.glb"
        position={[18, -2, -4]}
        scale={2}
      />

      <AnimatedHuman
        position={[65, -2, -46]}
        rotation={[0, 4.7, 0]}
        scale={1}
        ref={humanRef}
      />

      <SceneObject
        modelPath="/assets/models/bird.glb"
        position={[97, 20, -61]}
        scale={5}
        onClick={handleBirdClick}
        cursor="pointer"
        meshRef={birdRef}
      />

      <SceneObject
        modelPath="/assets/models/snake.glb"
        position={[65, 0.3, -35]}
        rotation={[0, 3, 0]}
        scale={3}
      />

      <SceneObject
        modelPath="/assets/models/tiger.glb"
        position={[50, -2, -55]}
        rotation={[0, 1.4, 0]}
        scale={1.3}
      />

      <SceneObject
        modelPath="/assets/models/rocket.glb"
        position={[0, 2, 0]}
        scale={10}
        onClick={launchRocket}
        meshRef={rocketRef}
      />

      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, 5, 5]} intensity={1} />
    </>
  );
};
