// Lune.jsx
import { Canvas } from "@react-three/fiber";
import { Scene } from "../scenes/LuneScene";
import { useGLTF } from "@react-three/drei";
import API_URL from "../../constants/api";
import { useState, useEffect } from "react";

const Lune = () => {
  const [step, setStep] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [quiz1Answer, setQuiz1Answer] = useState(null);
  const [quiz1Data, setQuiz1Data] = useState(null);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [quiz2Answer, setQuiz2Answer] = useState(null);
  const [quiz2Data, setQuiz2Data] = useState(null);
  const [threatDestroyed, setThreatDestroyed] = useState(false);
  const [message, setMessage] = useState("");

  localStorage.setItem("environnement", "Lune");

  useEffect(() => {
    fetch(`${API_URL}/question/Lune`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id === 11) setQuiz1Data(data);
        if (data.id === 15) setQuiz2Data(data);
      })
      .catch((err) => console.error("Erreur API:", err));
  }, []);

  const handlePlanetSelection = (planet) => {
    if (planet === "Terre") {
      setMessage("Bravo ! Tu as trouvé la Terre !");
      setTimeout(() => setStep(2), 1500);
    } else {
      setMessage("Ce n'est pas la Terre, essaie encore !");
    }
    setSelectedPlanet(planet);
  };

  const handleQuiz1Submit = (answer) => {
    if (answer === quiz1Data?.reponse_correcte) {
      setMessage("Bonne réponse !");
      setTimeout(() => setStep(3), 1500);
    } else {
      setMessage("Mauvaise réponse, réessaie !");
    }
    setQuiz1Answer(answer);
  };

  const handleFlagSelection = (flag) => {
    if (flag === "USA") {
      setMessage("Correct ! Les USA ont été les premiers sur la Lune !");
      setTimeout(() => setStep(4), 1500);
    } else {
      setMessage("Non, ce n'est pas le bon drapeau !");
    }
    setSelectedFlag(flag);
  };

  const handleQuiz2Submit = (answer) => {
    if (answer === quiz2Data?.reponse_correcte) {
      setMessage("Super ! Tu as trouvé la bonne réponse !");
      setTimeout(() => setStep(5), 1500);
    } else {
      setMessage("Oups, essaie encore !");
    }
    setQuiz2Answer(answer);
  };

  const handleThreatClick = (object) => {
    if (object === "asteroid") {
      setMessage("Bien joué ! La Lune est sauvée !");
      setThreatDestroyed(true);
    } else {
      setMessage("Ce n'est pas une menace pour la Lune !");
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {step === 1 && (
        <div className="overlay">
          <h2>Clique sur la planete Terre !</h2>
        </div>
      )}

      {step === 2 && quiz1Data && (
        <div className="overlay">
          <h2>{quiz1Data.question}</h2>
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
      )}

      {step === 3 && (
        <div className="overlay">
          <h2>Choisis le drapeau des premiers sur la Lune :</h2>
          <button onClick={() => handleFlagSelection("France")}>France</button>
          <button onClick={() => handleFlagSelection("USA")}>USA</button>
          <button onClick={() => handleFlagSelection("Russie")}>Russie</button>
          <button onClick={() => handleFlagSelection("Chine")}>Chine</button>
        </div>
      )}

      {step === 4 && quiz2Data && (
        <div className="overlay">
          <h2>{quiz2Data.question}</h2>
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
      )}

      {step === 5 && !threatDestroyed && (
        <div className="overlay">
          <h2>Vite ! Protège la Lune en cliquant sur la menace :</h2>
        </div>
      )}

      {message && <div className="message">{message}</div>}

      <Canvas>
        <Scene
          step={step}
          threatDestroyed={threatDestroyed}
          handleThreatClick={handleThreatClick}
          handlePlanetSelection={handlePlanetSelection}
        />
      </Canvas>
    </div>
  );
};

export default Lune;
