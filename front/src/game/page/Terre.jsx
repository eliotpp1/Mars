import { Canvas } from "@react-three/fiber";
import { Scene } from "../scenes/Scene";
import { useGLTF } from "@react-three/drei";
import { useState } from "react";

const Terre = () => {
  const [birdFound, setBirdFound] = useState(false);
  const [monkeyFound, setMonkeyFound] = useState(false);
  const [answer, setAnswer] = useState("");
  const [frogFound, setFrogFound] = useState(false);
  const [q1Found, setQ1Found] = useState(false); // État pour le premier QCM
  const [q2Found, setQ2Found] = useState(false); // État pour le deuxième QCM
  const [errorCount, setErrorCount] = useState(0);
  const [message, setMessage] = useState("");

  localStorage.setItem("environnement", "Terre");

  const isSpellingClose = (input, target) => {
    const cleanInput = input.toLowerCase().trim();
    const cleanTarget = target.toLowerCase().trim();
    if (cleanInput === cleanTarget) return false;
    const distance = Math.abs(cleanInput.length - cleanTarget.length);
    if (distance > 2) return false;
    let differences = 0;
    for (let i = 0; i < Math.min(cleanInput.length, cleanTarget.length); i++) {
      if (cleanInput[i] !== cleanTarget[i]) differences++;
      if (differences > 2) return false;
    }
    return true;
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    const userAnswer = answer.toLowerCase().trim();

    if (userAnswer === "grenouille" || userAnswer === "Grenouille") {
      setFrogFound(true);
      setMessage("Bravo ! Tu as trouvé la grenouille !");
      setErrorCount(0);
    } else {
      setErrorCount((prev) => prev + 1);
      setAnswer("");

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

  const handleQ1Submit = (selectedAnswer) => {
    if (selectedAnswer === "oxygène") {
      setQ1Found(true);
      setMessage("Correct ! Que respirent les humains ? Oxygène !");
    } else {
      setMessage("Faux ! Réessaie.");
    }
  };

  const handleQ2Submit = (selectedAnswer) => {
    if (selectedAnswer === "8 milliards") {
      setQ2Found(true);
      setMessage("Correct ! La population est d'environ 8 milliards !");
    } else {
      setMessage("Faux ! Réessaie.");
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
          Trouve l'oiseau pour avancer !
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
              }}
              placeholder="Écris ta réponse..."
            />
            <button type="submit">Valider</button>
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

      {frogFound && !q1Found && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.8)",
            padding: "20px",
            borderRadius: "15px",
            fontFamily: "Orbitron, sans-serif",
            zIndex: 1000,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            Que respirent les humains pour vivre ?
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button onClick={() => handleQ1Submit("oxygène")}>Oxygène</button>
            <button onClick={() => handleQ1Submit("azote")}>Azote</button>
            <button onClick={() => handleQ1Submit("carbone")}>Carbone</button>
          </div>
          {message && (
            <div
              style={{
                marginTop: "15px",
                color: q1Found ? "#4CAF50" : "#ff4444",
                textAlign: "center",
              }}
            >
              {message}
            </div>
          )}
        </div>
      )}

      {q1Found && !q2Found && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.8)",
            padding: "20px",
            borderRadius: "15px",
            fontFamily: "Orbitron, sans-serif",
            zIndex: 1000,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            Combien d'habitants y a-t-il sur Terre environ ?
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button onClick={() => handleQ2Submit("8 milliards")}>8 milliards</button>
            <button onClick={() => handleQ2Submit("5 millions")}>5 millions</button>
            <button onClick={() => handleQ2Submit("12 milliards")}>12 milliards</button>
          </div>
          {message && (
            <div
              style={{
                marginTop: "15px",
                color: q2Found ? "#4CAF50" : "#ff4444",
                textAlign: "center",
              }}
            >
              {message}
            </div>
          )}
        </div>
      )}

      {q2Found && (
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
          Clique sur la fusée pour continuer !
        </div>
      )}

      <Canvas>
        <Scene
          setBirdFound={setBirdFound}
          setMonkeyFound={setMonkeyFound}
          frogFound={frogFound}
          q1Found={q1Found}
          q2Found={q2Found}
        />
      </Canvas>
    </div>
  );
};

export default Terre;

useGLTF.preload("/assets/models/terre/terre.glb");
useGLTF.preload("/assets/models/terre/bird.glb");
useGLTF.preload("/assets/models/terre/monkey.glb");
useGLTF.preload("/assets/models/terre/frog.glb");
useGLTF.preload("/assets/models/terre/snake.glb");
useGLTF.preload("/assets/models/terre/tiger.glb");
useGLTF.preload("/assets/models/terre/homme.glb");
useGLTF.preload("/assets/models/vehicles/rocket.glb");