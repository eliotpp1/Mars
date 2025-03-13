import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importer useNavigate
import { Stars } from "../../components/Stars";
import { AnimatedFusee } from "../../components/AnimatedFusee";
import { CameraSetup } from "../../components/CameraSetup";
import { Line, Text, Html } from "@react-three/drei";
import SimonSays from "../../components/SimonSays";
import PressureAndTemperatureGame from "../../components/PressureAndTemperatureGame";
import GameDialogue from "../../components/GameDialogue"; // Assurez-vous d'importer correctement le composant

export const Scene = () => {
  const navigate = useNavigate(); // Initialiser le hook navigate
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
  const [vehicleName, setVehicleName] = useState("");

  useEffect(() => {
    const fetchVehicle = async () => {
      let id = parseInt(localStorage.getItem("selectedVehicle")) + 1;
      const response = await fetch(`${API_URL}/vehicles/${id}`);
      const data = await response.json();
      console.log(data);
      setVehicleName(data.name);
    };
    fetchVehicle();
  }, []);

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
  };

  useEffect(() => {
    // Vérifie si toutes les réparations sont effectuées
    if (line1Success && line2Success) {
      setIsRocketRepaired(true);
    }
  }, [line1Success, line2Success]);

  const closeDialogue = () => {
    setShowDialogue(false);
  };

  const handleRocketClick = () => {
    if (isRocketRepaired) {
      navigate("/lune"); // Redirection vers /lune
    }
  };

  const handleNext = () => {
    // Logique pour avancer après la victoire, par exemple, redirection vers la page suivante
    navigate("/lune");
  };

  return (
    <>
      <color attach="background" args={["#000020"]} />
      <Stars />

      <CameraSetup cameraPosition={cameraPosition} cameraTarget={[0, 2, 0]} />

      <AnimatedFusee
        modelPath="/assets/models/vehicles/rocket.glb"
        position={[0, 2, 0]}
        scale={10}
        onClick={handleRocketClick}
        isRocketRepaired={isRocketRepaired} // Animation du décollage quand réparée
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

      {showDialogue && !isRocketRepaired && (
        <GameDialogue
          message={`Attention ! La ${vehicleName} a un problème et doit être réparée avant de pouvoir repartir. Vous devez résoudre les problèmes de pression et de température pour assurer un lancement sécurisé.`}
          onClose={closeDialogue}
        />
      )}

      

      {isRocketRepaired && (
        <GameDialogue
          message={`Bravo, vous avez réussi ! Cliquez sur "Suivant" pour continuer.`}
          isVictory={true}
          onNext={handleNext} // Appelle handleNext lorsqu'on clique sur "Suivant"
        />
      )}

      {showGame && (
        <Html position={[0, 2, 5]} center>
          <div
            style={{
              width: "300px",
              background: "white",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <SimonSays onWin={handleGameWin} />
          </div>
        </Html>
      )}

      {showPressureGame && (
        <Html position={[0, 2, 5]} center>
          <div
            style={{
              width: "300px",
              background: "white",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <PressureAndTemperatureGame onWin={handleGameWin} />
          </div>
        </Html>
      )}
    </>
  );
};
