// src/game/page/Lune.jsx
import { Canvas } from "@react-three/fiber";
import { Scene } from "../scenes/LuneScene";
import { useGLTF } from "@react-three/drei";
import API_URL from "../../constants/api";
import { useState, useEffect } from "react";
import { useSound } from "../../context/SoundContext";

const Lune = () => {
  const [step, setStep] = useState(0);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [quiz1Answer, setQuiz1Answer] = useState(null);
  const [quiz1Data, setQuiz1Data] = useState(null);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [quiz2Answer, setQuiz2Answer] = useState(null);
  const [quiz2Data, setQuiz2Data] = useState(null);
  const [threatDestroyed, setThreatDestroyed] = useState(false);
  const [message, setMessage] = useState("");
  const [hasLanded, setHasLanded] = useState(false);
  const [hasStartedLanding, setHasStartedLanding] = useState(false);
  const [asteroidGauge, setAsteroidGauge] = useState(0); // Jauge en pourcentage (0 à 100)
  const maxGauge = 100; // Valeur maximale de la jauge

  const { isMuted } = useSound();

  const landingSound = new Audio("/assets/sounds/landing.mp3");
  const clickSound = new Audio("/assets/sounds/click.mp3");
  const errorSound = new Audio("/assets/sounds/error.mp3");

  useEffect(() => {
    const fetchQuestion = () =>
      fetch(`${API_URL}/question/Lune`)
        .then((res) => res.json())
        .catch((err) => {
          console.error("Erreur API:", err);
          return null;
        });

    fetchQuestion().then((firstQuestion) => {
      if (firstQuestion) {
        setQuiz1Data(firstQuestion);
        const fetchSecondQuestion = () => {
          fetchQuestion().then((secondQuestion) => {
            if (secondQuestion && secondQuestion.id !== firstQuestion.id) {
              setQuiz2Data(secondQuestion);
            } else {
              fetchSecondQuestion();
            }
          });
        };
        fetchSecondQuestion();
      }
    });
  }, []);

  // Diminution progressive de la jauge au step 5
  useEffect(() => {
    let interval;
    if (step === 5 && !threatDestroyed) {
      interval = setInterval(() => {
        setAsteroidGauge((prev) => {
          const newGauge = Math.max(prev - 2, 0); // Diminue de 2% toutes les 100ms
          if (newGauge === 0 && prev > 0) {
            setMessage(
              "La jauge est vide ! Clique plus vite sur l'astéroïde !"
            );
          }
          return newGauge;
        });
      }, 100); // Diminution toutes les 100ms
    }
    return () => clearInterval(interval); // Nettoyage de l'intervalle
  }, [step, threatDestroyed]);

  const startLanding = () => {
    if (!isMuted) landingSound.play();
    setHasStartedLanding(true);
  };

  const handleLandingComplete = () => {
    console.log("Landing complete");
    setMessage("Atterrissage réussi ! Prépare-toi pour la mission.");
    setHasLanded(true);
    setStep(1);
  };

  const playClickSound = () => {
    if (!isMuted) clickSound.play();
  };

  const playErrorSound = () => {
    if (!isMuted) errorSound.play();
  };

  const handlePlanetSelection = (planet) => {
    playClickSound();
    if (planet === "Terre") {
      setMessage("Bravo, tu as identifié la Terre depuis la Lune !");
      setTimeout(() => setStep(2), 1500);
    } else {
      setMessage("Ce n'est pas la Terre, réessaye !");
      playErrorSound();
    }
    setSelectedPlanet(planet);
  };

  const handleQuiz1Submit = (answer) => {
    if (answer === quiz1Data?.reponse_correcte) {
      playClickSound();
      setMessage("Bonne réponse ! Tu progresses dans notre mission lunaire.");
      setTimeout(() => setStep(3), 1500);
    } else {
      setMessage("Mauvaise réponse, concentre-toi, astronaute !");
      playErrorSound();
    }
    setQuiz1Answer(answer);
  };

  const handleFlagSelection = (flag) => {
    if (flag === "USA") {
      playClickSound();
      setMessage("Correct ! Les USA ont marqué l'histoire lunaire en premier.");
      setTimeout(() => setStep(4), 1500);
    } else {
      setMessage("Non, ce drapeau n'a pas été planté sur la Lune !");
      playErrorSound();
    }
    setSelectedFlag(flag);
  };

  const handleQuiz2Submit = (answer) => {
    if (answer === quiz2Data?.reponse_correcte) {
      playClickSound();
      setMessage("Super ! La Lune n'a plus de secrets pour toi.");
      setTimeout(() => setStep(5), 1500);
    } else {
      setMessage("Oups, pas tout à fait, essaie encore !");
      playErrorSound();
    }
    setQuiz2Answer(answer);
  };

  const handleThreatClick = (object) => {
    if (object === "asteroid") {
      playClickSound();
      setAsteroidGauge((prev) => {
        const newGauge = Math.min(prev + 10, maxGauge); // Chaque clic ajoute 5%
        if (newGauge === maxGauge) {
          setThreatDestroyed(true);
          setMessage(
            "Bravo ! Un astéroïde peut être dangereux pour la Lune comme pour la Terre. Clique sur le vaisseau pour partir vers Mars !"
          );
        } else {
          setMessage(
            `Clique vite pour remplir la jauge avant qu'elle ne baisse !`
          );
        }
        return newGauge;
      });
    } else {
      playErrorSound();
      setMessage("Ce n'est pas une menace, vise l'astéroïde !");
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {step === 0 && !hasStartedLanding && (
        <div className="overlay">
          <h2>Approche de la Lune</h2>
          <button onClick={startLanding}>Démarrer l'atterrissage</button>
        </div>
      )}
      {step === 0 && hasStartedLanding && !hasLanded && (
        <div className="overlay">
          <h2>Atterrissage en cours...</h2>
        </div>
      )}
      {step === 1 && hasLanded && (
        <div className="overlay">
          <h2>Trouve la planète Terre parmi ces 4 planètes :</h2>
        </div>
      )}
      {step === 2 && quiz1Data && (
        <div className="overlay">
          <h2>{quiz1Data.question}</h2>
          <div className="quiz-answers">
            <button onClick={() => handleQuiz1Submit(1)}>
              {quiz1Data.choix1}
            </button>
            <button onClick={() => handleQuiz1Submit(2)}>
              {quiz1Data.choix2}
            </button>
            <button onClick={() => handleQuiz1Submit(3)}>
              {quiz1Data.choix3}
            </button>
            <button onClick={() => handleQuiz1Submit(4)}>
              {quiz1Data.choix4}
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="overlay">
          <h2>Quel drapeau a été planté en premier sur la Lune ?</h2>
          <button onClick={() => handleFlagSelection("France")}>France</button>
          <button onClick={() => handleFlagSelection("USA")}>USA</button>
          <button onClick={() => handleFlagSelection("Russie")}>Russie</button>
          <button onClick={() => handleFlagSelection("Chine")}>Chine</button>
        </div>
      )}
      {step === 4 && quiz2Data && (
        <div className="overlay">
          <h2>{quiz2Data.question}</h2>
          <div className="quiz-answers">
            <button onClick={() => handleQuiz2Submit(1)}>
              {quiz2Data.choix1}
            </button>
            <button onClick={() => handleQuiz2Submit(2)}>
              {quiz2Data.choix2}
            </button>
            <button onClick={() => handleQuiz2Submit(3)}>
              {quiz2Data.choix3}
            </button>
            <button onClick={() => handleQuiz2Submit(4)}>
              {quiz2Data.choix4}
            </button>
          </div>
        </div>
      )}
      {step === 5 && !threatDestroyed && (
        <div className="overlay">
          <h2>
            Une menace approche ! Clique vite sur l'astéroïde pour le détruire :
          </h2>
          <div style={{ marginTop: "10px" }}>
            <div
              style={{
                width: "200px",
                height: "20px",
                border: "2px solid white",
                background: "#333",
              }}
            >
              <div
                style={{
                  width: `${(asteroidGauge / maxGauge) * 100}%`,
                  height: "100%",
                  background: asteroidGauge === maxGauge ? "green" : "red",
                  transition: "width 0.1s ease-in-out",
                }}
              />
            </div>
            <p>Jauge : {Math.round(asteroidGauge)}%</p>
          </div>
        </div>
      )}
      {message && step !== 0 && step !== 5 && (
        <div className="message">{message}</div>
      )}
      {message && step === 5 && <div className="message">{message}</div>}
      <Canvas>
        <Scene
          step={step}
          threatDestroyed={threatDestroyed}
          handleThreatClick={handleThreatClick}
          handlePlanetSelection={handlePlanetSelection}
          onLandingComplete={handleLandingComplete}
          isMuted={isMuted}
          hasStartedLanding={hasStartedLanding}
        />
      </Canvas>
    </div>
  );
};

export default Lune;
