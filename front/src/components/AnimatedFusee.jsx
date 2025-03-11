import { useState, useEffect, useRef } from "react";
import { useSpring, a } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";

export const AnimatedFusee = ({ modelPath, position, scale, onClick, isRocketRepaired }) => {
  const { scene } = useGLTF(modelPath);
  const rocketRef = useRef();
  
  const [rocketLanded, setRocketLanded] = useState(false);
  const [isRocketGone, setIsRocketGone] = useState(false); // Cache la fusée après son départ

  // Animation d'arrivée (descente de la fusée sur la scène)
  const arrivalAnimation = useSpring({
    position: rocketLanded ? position : [position[0], position[1] + 10, position[2]],
    config: { tension: 100, friction: 30 },
    onRest: () => setRocketLanded(true),
  });

  // Animation de départ avec un mouvement plus lent
  const departureAnimation = useSpring({
    position: isRocketRepaired 
      ? [position[0] + 80, position[1] + 100, position[2] - 80] // Plus loin et plus haut pour simuler l’espace
      : position,
    opacity: isRocketRepaired ? 0 : 1, // Disparition progressive
    config: { tension: 20, friction: 50 }, // Ralentissement du mouvement
    onRest: () => {
      if (isRocketRepaired) setIsRocketGone(true); // Cache la fusée après le départ
    }
  });

  useEffect(() => {
    setRocketLanded(false); // Reset animation lorsque la scène change
  }, []);

  // Si la fusée est complètement partie, on ne l'affiche plus
  if (isRocketGone) return null;

  return (
    <a.group
      ref={rocketRef}
      rotation={[-Math.PI / 3, 0, 0]} // Inclinaison au décollage
      {...(isRocketRepaired ? departureAnimation : arrivalAnimation)}
      onClick={onClick}
    >
      <primitive object={scene} scale={scale} />
    </a.group>
  );
};
