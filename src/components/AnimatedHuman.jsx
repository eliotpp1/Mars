import { useRef, useEffect, forwardRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export const AnimatedHuman = forwardRef(({ position, rotation, scale }, ref) => {
  const localRef = useRef();
  const actualRef = ref || localRef;
  const human = useGLTF("/assets/models/homme.gltf");
  const { actions, mixer } = useAnimations(human.animations, actualRef);

  useEffect(() => {
    if (actions.Walk) {
      actions.Walk.play();
      actions.Walk.timeScale = 0.5;
    }
  }, [actions]);

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
});