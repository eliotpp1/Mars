import { Canvas } from "@react-three/fiber";
import { Scene } from "../scenes/TerreScene";
import { useGLTF } from "@react-three/drei";
import { useSound } from "../../context/SoundContext";
import { useState, useEffect } from "react";
import API_URL from "../../constants/api";

const Terre = () => {
  const [birdFound, setBirdFound] = useState(false);
  const [monkeyFound, setMonkeyFound] = useState(false);
  const [answer, setAnswer] = useState("");
  const [frogFound, setFrogFound] = useState(false);
  const [q1Found, setQ1Found] = useState(false);
  const [q2Found, setQ2Found] = useState(false);
  const [quiz1Data, setQuiz1Data] = useState(null);
  const [quiz2Data, setQuiz2Data] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [message, setMessage] = useState("");
  const { isMuted } = useSound();

  const errorSound = new Audio("/assets/sounds/error.mp3");
  const correctSound = new Audio("/assets/sounds/correct.mp3");

  localStorage.setItem("environnement", "Terre");

  // Fetch des questions au chargement
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`${API_URL}/question/Terre`);
        const data = await res.json();
        // Transformer les choix en tableau pour faciliter l'affichage
        return {
          ...data,
          options: [data.choix1, data.choix2, data.choix3, data.choix4],
          correctAnswer: data[`choix${data.reponse_correcte}`],
        };
      } catch (err) {
        console.error("Erreur API:", err);
        return null;
      }
    };

    const loadQuestions = async () => {
      const firstQuestion = await fetchQuestion();
      if (firstQuestion) {
        setQuiz1Data(firstQuestion);

        // Assurer qu'on a une question différente pour quiz2
        let secondQuestion;
        do {
          secondQuestion = await fetchQuestion();
        } while (!secondQuestion || secondQuestion.id === firstQuestion.id);

        setQuiz2Data(secondQuestion);
      }
    };

    loadQuestions();
  }, []);

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

    if (userAnswer === "grenouille") {
      if (!isMuted) correctSound.play();
      setFrogFound(true);
      setMessage("Bravo ! Tu as trouvé la grenouille !");
      setErrorCount(0);
    } else {
      if (!isMuted) errorSound.play();
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
    if (selectedAnswer === quiz1Data?.correctAnswer) {
      if (!isMuted) correctSound.play();
      setMessage(
        `Correct ! ${quiz1Data.question} ${quiz1Data.correctAnswer} !`
      );
      setTimeout(() => {
        setQ1Found(true);
        setMessage("");
      }, 1500);
    } else {
      if (!isMuted) errorSound.play();
      setMessage("Faux ! Réessaie.");
    }
  };

  const handleQ2Submit = (selectedAnswer) => {
    if (selectedAnswer === quiz2Data?.correctAnswer) {
      if (!isMuted) correctSound.play();
      setMessage(
        `Correct ! ${quiz2Data.question} ${quiz2Data.correctAnswer} !`
      );
      setTimeout(() => {
        setQ2Found(true);
        setMessage("");
      }, 1500);
    } else {
      if (!isMuted) errorSound.play();
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

      {frogFound && !q1Found && quiz1Data && (
        <div className="overlay">
          <h2>{quiz1Data.question}</h2>
          <div className="quiz-answers">
            {quiz1Data.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleQ1Submit(option)}
                style={{
                  margin: "5px",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontFamily: "Orbitron, sans-serif",
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {q1Found && !q2Found && quiz2Data && (
        <div className="overlay">
          <h2>{quiz2Data.question}</h2>
          <div className="quiz-answers">
            {quiz2Data.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleQ2Submit(option)}
                style={{
                  margin: "5px",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontFamily: "Orbitron, sans-serif",
                }}
              >
                {option}
              </button>
            ))}
          </div>
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
            fontFamily: "Orbitron, sans-serif",
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
