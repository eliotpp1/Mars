import { useEffect } from "react";
import { Html } from "@react-three/drei"; // Importer Html pour afficher des éléments HTML dans Three.js
import SimonSays from "../../components/SimonSays"; 

export const Scene = () => {
  useEffect(() => {
    console.log("Scene2.jsx monté !");
  }, []);

  return (
    <Html position={[0, 0, 0]} center> {/* Permet d'afficher le jeu correctement dans la scène */}
      <SimonSays />
    </Html>
  );
};

export default Scene;
