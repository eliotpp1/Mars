import { useRef, useState, useEffect } from "react";
import { Stars } from "../../components/Stars";
import { SceneObject } from "../../components/SceneObject";
import { CameraSetup } from "../../components/CameraSetup";
import { Line, Text, Html } from "@react-three/drei";
import SimonSays from "../../components/SimonSays";
import PressureAndTemperatureGame from "../../components/PressureAndTemperatureGame";
import GameDialogue from "../../components/GameDialogue"; // Assurez-vous d'importer correctement le composant

export const Scene = () => {
  const line1Ref = useRef();
  const line2Ref = useRef();
  const [cameraPosition] = useState([0, 5, 20]);
  const [showGame, setShowGame] = useState(false);
  const [showPressureGame, setShowPressureGame] = useState(false);
  const [line1Success, setLine1Success] = useState(false);
  const [line2Success, setLine2Success] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);
  const [showDialogue, setShowDialogue] = useState(true); // État pour contrôler l'affichage du dialogue
  const [isRocketRepaired, setIsRocketRepaired] = useState(false); // État pour suivre si la fusée est réparée

  const handleTextClick = (lineNumber) => {
    setCurrentLine(lineNumber);
    if (lineNumber === 1) {
      setShowGame(true);
    } else if (lineNumber === 2) {
      setShowPressureGame(true);
    }
  };

  const handleGameWin = () => {
    if (currentLine === 1) {
      setLine1Success(true);
    } else if (currentLine === 2) {
      setLine2Success(true);
    }
    setShowGame(false);
    setShowPressureGame(false);

    // Vérifier si les deux lignes sont réussies
    if (line1Success && line2Success) {
      setIsRocketRepaired(true);
    }
  };

  const closeDialogue = () => {
    setShowDialogue(false);
  };

  const handleRocketClick = () => {
    // Vérifiez que les deux lignes ont été réparées avant de permettre le décollage
    if (isRocketRepaired) {
      alert("La fusée décolle ! 🚀");
      // Ajoutez ici la logique pour faire décoller la fusée
    }
  };

  useEffect(() => {
    // Vérifie dès que les lignes sont toutes réussies si la fusée peut être réparée
    if (line1Success && line2Success) {
      setIsRocketRepaired(true);
    }
  }, [line1Success, line2Success]);

  return (
    <>
      <color attach="background" args={["#000020"]} />
      <Stars />

      <CameraSetup cameraPosition={cameraPosition} cameraTarget={[0, 2, 0]} />

      <SceneObject
        modelPath="/assets/models/vehicles/rocket.glb"
        position={[0, 2, 0]}
        scale={10}
        onClick={handleRocketClick} // Ajoutez l'événement onClick pour la fusée
      />

      {/* Ligne 1 */}
      <Line
        ref={line1Ref}
        points={[[-10, 4, 0], [0, 4, 0]]}
        color={line1Success ? "green" : "red"}
        lineWidth={2}
      />
      <Text
        position={[-10, 5, 0]}
        fontSize={1}
        color={line1Success ? "green" : "red"}
        anchorX="left"
        anchorY="middle"
        onClick={() => handleTextClick(1)}
      >
        Réparation
      </Text>

      {/* Ligne 2 */}
      <Line
        ref={line2Ref}
        points={[[10, 0, 0], [0, 0, 0]]}
        color={line2Success ? "green" : "red"}
        lineWidth={2}
      />
      <Text
        position={[10, 1, 0]}
        fontSize={1}
        color={line2Success ? "green" : "red"}
        anchorX="right"
        anchorY="middle"
        onClick={() => handleTextClick(2)}
      >
        Réparation
      </Text>

      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, 5, 5]} intensity={1} />

      {showDialogue && (
        <GameDialogue
          message="Attention ! La fusée a du hurté un objet. Vous devez résoudre les problèmes de pression et de température pour assurer un lancement sécurisé."
          onClose={closeDialogue}
        />
      )}

      {isRocketRepaired && (
       <GameDialogue
       message="Félicitations ! La fusée est réparée et prête à décoller ! Cliquez sur la fusée pour la faire décoller."
       onClose={closeDialogue}
     />
      )}

      {showGame && (
        <Html position={[0, 2, 5]} center>
          <div style={{ width: '300px', background: 'white', padding: '20px', borderRadius: '10px' }}>
            <SimonSays onWin={handleGameWin} />
          </div>
        </Html>
      )}

      {showPressureGame && (
        <Html position={[0, 2, 5]} center>
          <div style={{ width: '300px', background: 'white', padding: '20px', borderRadius: '10px' }}>
            <PressureAndTemperatureGame onWin={handleGameWin} />
          </div>
        </Html>
      )}
    </>
  );
};
