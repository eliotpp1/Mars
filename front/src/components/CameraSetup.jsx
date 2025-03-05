import { PerspectiveCamera, OrbitControls } from "@react-three/drei";

export const CameraSetup = ({ cameraRef, cameraPosition, cameraTarget }) => {
  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={cameraPosition}
        fov={75}
      />
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
    </>
  );
};
