import { Canvas } from "@react-three/fiber";
import { Scene } from "../scenes/Scene";
import { useGLTF } from "@react-three/drei";
import { useState } from "react";

const Terre = () => {
  const [birdFound, setBirdFound] = useState(false);
  const [monkeyFound, setMonkeyFound] = useState(false);
  const [answer, setAnswer] = useState("");
  const [frogFound, setFrogFound] = useState(false);
  const [errorCount, setErrorCount] = useState(0); // Compteur d'erreurs
  const [message, setMessage] = useState(""); // Message d'erreur ou indice

  localStorage.setItem("environnement", "Terre");

  // Fonction pour vérifier si l'orthographe est proche
  const isSpellingClose = (input, target) => {
    const cleanInput = input.toLowerCase().trim();
    const cleanTarget = target.toLowerCase().trim();
    if (cleanInput === cleanTarget) return false; // Exact match, pas une erreur proche
    const distance = Math.abs(cleanInput.length - cleanTarget.length);
    if (distance > 2) return false; // Trop différent
    let differences = 0;
    for (let i = 0; i < Math.min(cleanInput.length, cleanTarget.length); i++) {
      if (cleanInput[i] !== cleanTarget[i]) differences++;
      if (differences > 2) return false; // Trop d'erreurs
    }
    return true;
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    const userAnswer = answer.toLowerCase().trim();

    if (userAnswer === "grenouille" || userAnswer === "Grenouille") {
      setFrogFound(true);
      setMessage("Bravo ! Tu as trouvé la grenouille !");
      setErrorCount(0); // Réinitialiser le compteur
    } else {
      setErrorCount((prev) => prev + 1);
      setAnswer(""); // Vider l'input

      if (userAnswer === "crapaud") {
        setMessage("Non, pas le crapaud, cherche la femelle !");
      } else if (isSpellingClose(userAnswer, "grenouille")) {
        setMessage("Tu es proche, mais vérifie l'orthographe ! Réessaie.");
      } else {
        if (errorCount === 0) {
          setMessage("Mauvaise réponse ! Réessaie.");
        } else if (errorCount === 1) {
          setMessage("Encore faux ! Indice : c'est vert et ça saute.");
        } else {
          setMessage("Toujours pas ! Indice : ça commence par 'gren'.");
        }
      }
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {!birdFound && (
        <div
          style={{
            position: "absolute",
            backdropFilter: "blur(5px)",
            top: "20px",
            left: "50%",
            display: "flex",
            alignItems: "center",
            color: "black",
            flexDirection: "column",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.3)",
            padding: "20px",
            borderRadius: "15px",
            fontFamily: "Orbitron, sans-serif",
            zIndex: 1000,
          }}
        >
          Trouve l&apos;oiseau pour avancer !
        </div>
      )}

      {birdFound && !monkeyFound && (
        <div
          style={{
            position: "absolute",
            backdropFilter: "blur(5px)",
            top: "20px",
            left: "50%",
            display: "flex",
            alignItems: "center",
            color: "black",
            flexDirection: "column",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.3)",
            padding: "20px",
            borderRadius: "15px",
            fontFamily: "Orbitron, sans-serif",
            zIndex: 1000,
          }}
        >
          Maintenant, trouve le singe caché !
        </div>
      )}

      {monkeyFound && !frogFound && (
        <div
          style={{
            position: "absolute",
            backdropFilter: "blur(5px)",
            top: "20px",
            left: "50%",
            display: "flex",
            color: "black",
            alignItems: "center",
            flexDirection: "column",
            transform: "translateX(-50%)",
            borderRadius: "15px",
            fontFamily: "Orbitron, sans-serif",
            zIndex: 1000,
          }}
        >
          <form
            onSubmit={handleAnswerSubmit}
            style={{
              padding: "20px",
              background: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.3)",
              borderRadius: "15px",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              Quel animal se trouve au dessus de la cascade ?
            </div>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{
                padding: "5px",
                marginRight: "10px",
                borderRadius: "10px",
                border: "3px solid var(--yellow)",
                textAlign: "center",
                background: "rgba(83, 83, 83, 0.29)",

                outline: "none",
                fontFamily: "Orbitron, sans-serif",
                // Ajout du style pour le placeholder
                "::placeholder": {
                  color: "black",
                  opacity: 1, // Assure que la couleur est pleinement appliquée
                },
              }}
              placeholder="Écris ta réponse..."
            />
            <button type="submit" style={{}}>
              Valider
            </button>
            {message && (
              <div
                style={{
                  marginTop: "15px",
                  color: errorCount > 0 ? "#ff4444" : "#4CAF50",
                  textAlign: "center",
                }}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      )}

      {frogFound && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            color: "black",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.8)",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
            fontFamily: "Arial, sans-serif",
          }}
        >
          Bravo ! Tu as trouvé la grenouille !
        </div>
      )}

      <Canvas>
        <Scene
          setBirdFound={setBirdFound}
          setMonkeyFound={setMonkeyFound}
          frogFound={frogFound}
        />
      </Canvas>
    </div>
  );
};

export default Terre;

// Préchargement des modèles
useGLTF.preload("/assets/models/terre/terre.glb");
useGLTF.preload("/assets/models/terre/bird.glb");
useGLTF.preload("/assets/models/terre/monkey.glb");
useGLTF.preload("/assets/models/terre/frog.glb");
useGLTF.preload("/assets/models/terre/snake.glb");
useGLTF.preload("/assets/models/terre/tiger.glb");
useGLTF.preload("/assets/models/terre/homme.glb");
useGLTF.preload("/assets/models/vehicles/rocket.glb");
