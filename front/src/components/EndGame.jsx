import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSound } from "../context/SoundContext";

const EndGame = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [mars, setMars] = useState(0);
  const { isMuted } = useSound();
  const gameOver = new Audio("/assets/sounds/gameover.mp3");

  useEffect(() => {
    const name = localStorage.getItem("playerName");
    const marsStorage = localStorage.getItem("mars");
    const startTime = localStorage.getItem("startTime");

    if (startTime) {
      const elapsedTime = Math.floor((Date.now() - parseInt(startTime)) / 1000); // Temps en secondes
      localStorage.setItem("time", elapsedTime);

      // Calcul du score
      const marsPoints = Math.floor((1000 / elapsedTime) * 1000);
      const newMars = marsStorage
        ? parseInt(marsStorage) + marsPoints
        : marsPoints;
      localStorage.setItem("mars", newMars);

      setMars(marsPoints);
    }

    setPlayerName(name);
  }, []);

  useEffect(() => {
    if (!isMuted) {
      gameOver.volume = 0.1;
      gameOver.play();
    }
  }, [isMuted]);

  return (
    <div className="gameover-container">
      <h1>Les petits astronautes</h1>
      <p>Bravo {playerName}, vous avez réussi votre exploration martienne !</p>
      <p>
        Vous avez récolté {mars} mars ! Vous pouvez les utiliser pour acheter
        des véhicules dans la boutique.
      </p>
      <button onClick={() => navigate("/vehicles")}>Accueil</button>
    </div>
  );
};

export default EndGame;
