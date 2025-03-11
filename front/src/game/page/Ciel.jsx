import { Canvas } from "@react-three/fiber";
import { Scene } from "../scenes/CielScene";
import { useGLTF } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import { useSound } from "../../context/SoundContext";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import API_URL from "../../constants/api";
import SpaceProgressBar from "../../components/SpaceProgressBar";
import { useProgress } from "../../context/ProgessContext";

const Ciel = () => {
  const [gameState, setGameState] = useState({
    currentGame: 0,
    game1Completed: false,
    game2Completed: false,
    game3Completed: false,
    showPopup: false,
    popupMessage: "",
    showPathGame: false,
    awaitingConfirmation: false,
    showQuiz: false,
    currentQuizIndex: 0,
    quizCompleted: false,
  });

  const [quiz1Data, setQuiz1Data] = useState(null);
  const [quiz2Data, setQuiz2Data] = useState(null);
  const [vehicleName, setVehicleName] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({
    quiz1: null,
    quiz2: null,
  });
  const [quizResults, setQuizResults] = useState({
    quiz1Correct: false,
    quiz2Correct: false,
  });
  const navigate = useNavigate();

  const pathCanvasRef = useRef();
  const pathInitializedRef = useRef(false);
  const hasPlayedRef = useRef(false);
  const [startFinalAnimation, setStartFinalAnimation] = useState(false); // Nouvel état pour déclencher l’animation
  const [showInstructions, setShowInstructions] = useState(false);

  const { isMuted } = useSound();
  const { currentStep } = useProgress();
  const winSound = new Audio("/assets/sounds/correct.mp3");
  const planeSound = new Audio("/assets/sounds/takeoff.mp3");

  useEffect(() => {
    planeSound.addEventListener("loadeddata", () =>
      console.log("Plane sound chargé")
    );
    planeSound.addEventListener("error", (e) =>
      console.error("Erreur de chargement du son:", e)
    );
    planeSound.addEventListener("ended", () => {
      planeSound.currentTime = 0;
    });
    return () => {
      planeSound.removeEventListener("loadeddata", () => {});
      planeSound.removeEventListener("error", () => {});
      planeSound.removeEventListener("ended", () => {});
    };
  }, []);

  useEffect(() => {
    if (gameState.currentGame === 0) {
      const timer = setTimeout(() => {
        setShowInstructions(true);
      }, 6000);

      return () => clearTimeout(timer); // Nettoyer le timer si le composant est démonté
    }
  }, [gameState.currentGame]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`${API_URL}/question/Ciel`);
        const data = await res.json();
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

    const fetchVehicle = async () => {
      let id = parseInt(localStorage.getItem("selectedVehicle")) + 1;
      const response = await fetch(`${API_URL}/vehicles/${id}`);
      const data = await response.json();
      console.log(data);
      setVehicleName(data.name);
    };

    const loadQuestions = async () => {
      const firstQuestion = await fetchQuestion();
      if (firstQuestion) {
        setQuiz1Data(firstQuestion);
        let secondQuestion;
        do {
          secondQuestion = await fetchQuestion();
        } while (!secondQuestion || secondQuestion.id === firstQuestion.id);
        setQuiz2Data(secondQuestion);
      }
    };

    loadQuestions();
    fetchVehicle();
  }, []);

  const handleClosePopup = () => {
    setGameState((prev) => {
      const newState = { ...prev, showPopup: false };
      if (prev.awaitingConfirmation && prev.game3Completed) {
        newState.awaitingConfirmation = false;
        newState.showQuiz = true;
        newState.currentQuizIndex = 0;
      } else if (prev.popupMessage === "Mauvaise réponse ! Réessayez.") {
        if (prev.currentQuizIndex === 0) {
          setSelectedAnswers((prev) => ({ ...prev, quiz1: null }));
        } else {
          setSelectedAnswers((prev) => ({ ...prev, quiz2: null }));
        }
      } else if (prev.quizCompleted) {
        handleFinalContinue(rocketRef.current);
      }
      return newState;
    });
  };

  const handleAnswerSelect = (answer) => {
    if (gameState.currentQuizIndex === 0) {
      setSelectedAnswers((prev) => ({ ...prev, quiz1: answer }));
      if (quiz1Data && answer === quiz1Data.correctAnswer) {
        setQuizResults((prev) => ({ ...prev, quiz1Correct: true }));
        if (!isMuted) winSound.play();
        setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            currentQuizIndex: 1,
          }));
        }, 1000);
      } else {
        setGameState((prev) => ({
          ...prev,
          showPopup: true,
          popupMessage: "Mauvaise réponse ! Réessayez.",
        }));
      }
    } else {
      setSelectedAnswers((prev) => ({ ...prev, quiz2: answer }));
      if (quiz2Data && answer === quiz2Data.correctAnswer) {
        setQuizResults((prev) => ({ ...prev, quiz2Correct: true }));
        if (!isMuted) winSound.play();
        setTimeout(() => {
          setGameState((prev) => ({
            ...prev,
            showQuiz: false,
            quizCompleted: true,
            showPopup: true,
            popupMessage:
              "Merci d'avoir répondu aux questions ! Cliquez sur Continuer pour quitter l'atmosphère !",
          }));
        }, 1000);
      } else {
        setGameState((prev) => ({
          ...prev,
          showPopup: true,
          popupMessage: "Mauvaise réponse ! Réessayez.",
        }));
      }
    }
  };

  const rocketRef = useRef();

  const handleFinalContinue = (rocket) => {
    console.log("handleFinalContinue appelé");
    console.log("rocket:", rocket);
    console.log("gameState.quizCompleted:", gameState.quizCompleted);

    if (gameState.quizCompleted && rocket && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      setStartFinalAnimation(true); // Déclencher le suivi de la caméra
      setGameState((prev) => ({ ...prev, showPopup: false }));
      if (!isMuted) {
        console.log("Tentative de lecture de planeSound");
        planeSound
          .play()
          .catch((err) =>
            console.error("Erreur lors de la lecture de planeSound:", err)
          );
        console.log("planeSound joué");
      }
      gsap.to(rocket.position, {
        y: 500,
        duration: 8,
        ease: "power1.in",
        onUpdate: () => console.log("Position Y:", rocket.position.y),
        onComplete: () => {
          navigate("/scene3");
        },
      });
    } else if (hasPlayedRef.current) {
      console.log("Animation déjà jouée, ignorée");
    } else {
      console.error("Condition non remplie : quizCompleted ou rocket manquant");
    }
  };

  const generatePath = () => {
    const points = [
      { x: 50, y: 150 },
      { x: 100, y: 50 },
      { x: 200, y: 200 },
      { x: 300, y: 100 },
      { x: 400, y: 250 },
      { x: 450, y: 150 },
    ];
    return points;
  };

  const distanceToLine = (point, lineStart, lineEnd) => {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = len_sq !== 0 ? dot / len_sq : -1;
    let xx, yy;
    if (param < 0 || (lineStart.x === lineEnd.x && lineStart.y === lineEnd.y)) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }
    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const initPathGame = () => {
    const canvas = pathCanvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const pathPoints = generatePath();
    let currentPoint = 0;
    let pathCompleted = false;
    let mouseOnPath = false;

    const drawPath = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.lineWidth = 20;
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      for (let i = 1; i < pathPoints.length; i++) {
        ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      }
      ctx.stroke();
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.arc(pathPoints[0].x, pathPoints[0].y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(
        pathPoints[pathPoints.length - 1].x,
        pathPoints[pathPoints.length - 1].y,
        15,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      for (let i = 1; i <= currentPoint; i++) {
        ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      }
      ctx.stroke();
      ctx.fillStyle = "white";
      ctx.font = "16px Orbitron";
      ctx.textAlign = "center";
      ctx.fillText(
        "Suivez le chemin du point vert au point rouge",
        canvas.width / 2,
        30
      );
    };

    drawPath();

    const handleMouseMove = (e) => {
      if (pathCompleted || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const checkPoint = pathPoints[currentPoint];
      const nextPoint =
        pathPoints[Math.min(currentPoint + 1, pathPoints.length - 1)];
      const distToPath = distanceToLine(
        { x: mouseX, y: mouseY },
        checkPoint,
        nextPoint
      );

      if (distToPath < 25) {
        mouseOnPath = true;
        drawPath();
        ctx.fillStyle = "#00FF00";
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 8, 0, Math.PI * 2);
        ctx.fill();
        const distToNextPoint = Math.sqrt(
          Math.pow(mouseX - nextPoint.x, 2) + Math.pow(mouseY - nextPoint.y, 2)
        );
        if (distToNextPoint < 20 && currentPoint < pathPoints.length - 2) {
          currentPoint++;
          drawPath();
        } else if (
          currentPoint === pathPoints.length - 2 &&
          distToNextPoint < 20
        ) {
          pathCompleted = true;
          canvas.removeEventListener("mousemove", handleMouseMove);
          setGameState((prev) => ({
            ...prev,
            game3Completed: true,
            showPopup: true,
            popupMessage:
              "Félicitations ! Vous avez complété tous les défis. Maintenant, répondez à quelques questions sur l'atmosphère !",
            showPathGame: false,
            awaitingConfirmation: true,
          }));
          if (!isMuted) winSound.play();
        }
      } else {
        if (mouseOnPath) {
          currentPoint = 0;
          mouseOnPath = false;
          drawPath();
          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.arc(mouseX, mouseY, 8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawPath();
          ctx.fillStyle = "black";
          ctx.beginPath();
          ctx.arc(mouseX, mouseY, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  };

  useEffect(() => {
    if (
      gameState.currentGame === 3 &&
      !gameState.showPopup &&
      !pathInitializedRef.current
    ) {
      setGameState((prev) => ({ ...prev, showPathGame: true }));
      setTimeout(() => {
        if (pathCanvasRef.current) {
          const cleanupFunction = initPathGame();
          pathInitializedRef.current = true;
          if (cleanupFunction) return cleanupFunction;
        }
      }, 300);
    }
  }, [gameState.currentGame, gameState.showPopup]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas>
        <Scene
          gameState={gameState}
          setGameState={setGameState}
          handleFinalContinue={handleFinalContinue}
          rocketRef={rocketRef}
          startFinalAnimation={startFinalAnimation} // Nouvelle prop
        />
      </Canvas>
      {/* SpaceProgressBar dans le DOM, hors du Canvas */}
      <div style={{ position: "absolute", zIndex: 100 }}>
        <SpaceProgressBar currentStep={currentStep} totalSteps={5} />
      </div>

      {!gameState.showPopup &&
        !gameState.showPathGame &&
        !gameState.showQuiz && (
          <div className="instructions">
            {showInstructions && gameState.currentGame === 0 && (
              <p>Oups, on dirait que la {vehicleName} a un problème !</p>
            )}
            {gameState.currentGame === 1 && !gameState.game1Completed && (
              <p>
                Il va falloir finir les minix jeux- pour redémarrer. Pour
                commencer, trouver l'objet qui est à sa place dans ce décor
              </p>
            )}
            {gameState.currentGame === 2 && !gameState.game2Completed && (
              <p>
                Bien, maintenant cliquez sur le rayon de soleil de la bonne
                couleur
              </p>
            )}
            {gameState.currentGame === 3 && !gameState.game3Completed && (
              <p>
                Défi 3 : Suivez le chemin avec votre souris pour faire décoller
                l'avion
              </p>
            )}
            {gameState.game1Completed &&
              gameState.game2Completed &&
              gameState.game3Completed && (
                <p>Félicitations ! Tous les défis sont complétés !</p>
              )}
          </div>
        )}

      {gameState.showQuiz && (
        <div className="overlay">
          <h2>
            {gameState.currentQuizIndex === 0 ? "Question 1/2" : "Question 2/2"}
          </h2>
          <p style={{ color: "black" }}>
            {gameState.currentQuizIndex === 0 && quiz1Data
              ? quiz1Data.question
              : ""}
            {gameState.currentQuizIndex === 1 && quiz2Data
              ? quiz2Data.question
              : ""}
          </p>
          <div className="quiz-answers">
            {gameState.currentQuizIndex === 0 && quiz1Data
              ? quiz1Data.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={selectedAnswers.quiz1 !== null}
                    style={{
                      backgroundColor:
                        selectedAnswers.quiz1 === option
                          ? selectedAnswers.quiz1 === quiz1Data.correctAnswer
                            ? "#4CAF50"
                            : "#FF5252"
                          : undefined,
                    }}
                  >
                    {option}
                  </button>
                ))
              : null}
            {gameState.currentQuizIndex === 1 && quiz2Data
              ? quiz2Data.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={selectedAnswers.quiz2 !== null}
                    style={{
                      backgroundColor:
                        selectedAnswers.quiz2 === option
                          ? selectedAnswers.quiz2 === quiz2Data.correctAnswer
                            ? "#4CAF50"
                            : "#FF5252"
                          : undefined,
                    }}
                  >
                    {option}
                  </button>
                ))
              : null}
          </div>
        </div>
      )}

      {gameState.showPopup && (
        <div className="overlay">
          <p style={{ color: "black" }}>{gameState.popupMessage}</p>
          <button onClick={handleClosePopup}>Continuer</button>
        </div>
      )}

      {gameState.showPathGame && (
        <div className="path-game">
          <canvas ref={pathCanvasRef} width={500} height={300} />
        </div>
      )}
    </div>
  );
};

export default Ciel;

useGLTF.preload("/assets/models/vehicles/rocket.glb");
useGLTF.preload("/assets/models/vehicles/sun.glb");
useGLTF.preload("/assets/models/ciel/fish.glb");
useGLTF.preload("/assets/models/ciel/plane.glb");
useGLTF.preload("/assets/models/ciel/planete.glb");
useGLTF.preload("/assets/models/ciel/voiture.glb");
useGLTF.preload("/assets/models/ciel/ciel.glb");
