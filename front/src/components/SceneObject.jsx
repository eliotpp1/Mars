import { useGLTF } from "@react-three/drei";

export const SceneObject = ({ modelPath, position, rotation, scale, onClick, cursor, meshRef }) => {
  const model = useGLTF(modelPath);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      cursor={cursor}
    >
      <primitive object={model.scene} />
    </mesh>
  );
};