import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { Stars } from "../../components/Stars";
import { SceneObject } from "../../components/SceneObject";
import { CameraSetup } from "../../components/CameraSetup";

export const Scene = ({}) => {
  useEffect(() => {}, []);

  return (
    <>
      <color attach="background" args={["#000020"]} />
      <Stars />

      <CameraSetup cameraPosition={[70, 5, -48]} />

      <SceneObject
        modelPath="/assets/models/vehicles/rocket.glb"
        position={[0, 2, 0]}
        scale={10}
      />

      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, 5, 5]} intensity={1} />
    </>
  );
};
