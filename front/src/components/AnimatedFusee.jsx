import { useState, useEffect, useRef } from "react";
import { useSpring, a } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";

export const AnimatedFusee = ({ modelPath, position, scale, onClick, isRocketRepaired }) => {
  const { scene } = useGLTF(modelPath);
  const rocketRef = useRef();
  
  const [isRocketGone, setIsRocketGone] = useState(false); // Cache la fusée après son départ

  // Animation de départ avec un mouvement plus lent
  const departureAnimation = useSpring({
    position: isRocketRepaired 
      ? [position[0], position[1] + 10, position[2] - 80] // Plus loin et plus haut pour simuler l’espace
      : position,
    opacity: isRocketRepaired ? 0 : 1, // Disparition progressive
    config: { tension: 20, friction: 50 }, // Ralentissement du mouvement
    onRest: () => {
      if (isRocketRepaired) setIsRocketGone(true); // Cache la fusée après le départ
    }
  });

  // Si la fusée est complètement partie, on ne l'affiche plus
  if (isRocketGone) return null;

  return (
    <a.group
      ref={rocketRef}
      rotation={[-Math.PI / 3, 0, 0]} // Inclinaison au décollage
      {...departureAnimation}
      onClick={onClick}
    >
      <primitive object={scene} scale={scale} />
    </a.group>
  );
};
