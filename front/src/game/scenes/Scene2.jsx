import { useState, useEffect } from "react";
import { Html } from "@react-three/drei"; // Permet d'afficher des éléments HTML dans Three.js
import SimonSays from "../../components/SimonSays";
import PressureAndTemperatureGame from "../../components/PressureAndTemperatureGame"; // Assurez-vous d'importer votre jeu de pression/température

export const Scene = () => {
  const [gameState, setGameState] = useState("simonSays"); // L'état pour gérer la progression du jeu

  const handleSimonSaysWin = () => {
    setGameState("pressureTest"); // Lorsque Simon Says est gagné, on lance le jeu de pression
  };

  useEffect(() => {
    console.log("Scene2.jsx monté !");
  }, []);

  return (
    <Html position={[0, 0, 0]} center className="three-html">
  {gameState === "simonSays" ? (
    <SimonSays onWin={handleSimonSaysWin} />
  ) : gameState === "pressureTest" ? (
    <PressureAndTemperatureGame />
  ) : null}
</Html>

  );
};

export default Scene;
