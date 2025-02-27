import { useRef, useEffect, forwardRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export const AnimatedHuman = forwardRef(
  ({ position, rotation, scale, isWalking }, ref) => {
    const localRef = useRef();
    const actualRef = ref || localRef;
    const human = useGLTF("/assets/models/terre/homme.gltf");
    const { actions, mixer } = useAnimations(human.animations, actualRef);

    useEffect(() => {
      if (actions.Walk) {
        if (isWalking) {
          actions.Walk.reset().play();
          actions.Walk.timeScale = 0.5;
        } else {
          actions.Walk.stop();
        }
      }
    }, [actions, isWalking]);

    useFrame((state, delta) => {
      mixer?.update(delta);
    });

    return (
      <mesh
        ref={actualRef}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        <primitive object={human.scene} />
      </mesh>
    );
  }
);
