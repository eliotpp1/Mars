import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSound } from "../context/SoundContext";

const EndGame = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [marsGained, setMarsGained] = useState(0); // Points gagnés cette partie
  const [totalMars, setTotalMars] = useState(0); // Total des mars en localStorage
  const { isMuted } = useSound();
  const gameOver = new Audio("/assets/sounds/gameover.mp3");

  useEffect(() => {
    const name = localStorage.getItem("playerName");
    const marsStorage = localStorage.getItem("mars");
    const startTime = localStorage.getItem("startTime");

    console.log("startTime", startTime);
    console.log("scoreCalculated", localStorage.getItem("scoreCalculated"));

    if (startTime) {
      const elapsedTime = Math.floor((Date.now() - parseInt(startTime)) / 1000); // Temps en secondes
      const scoreCalculated = localStorage.getItem("scoreCalculated");

      if (!scoreCalculated || scoreCalculated === "false") {
        // Calcul du score (entre 150 et ~2000)
        const marsPoints = Math.max(
          150,
          Math.floor(2000 / (1 + elapsedTime / 30))
        );
        const newMars = marsStorage
          ? parseInt(marsStorage, 10) + marsPoints
          : marsPoints;

        // Mettre à jour localStorage
        localStorage.setItem("mars", newMars);
        localStorage.setItem("time", elapsedTime);
        localStorage.setItem("scoreCalculated", "true");

        // Définir les points gagnés et le total
        setMarsGained(marsPoints); // Points gagnés cette partie
        setTotalMars(newMars); // Total cumulé
      } else {
        // Si déjà calculé, récupérer les points gagnés de cette partie depuis le temps écoulé
        const marsPoints = Math.max(
          150,
          Math.floor(2000 / (1 + elapsedTime / 30))
        );
        setMarsGained(marsPoints); // Afficher les points gagnés
        setTotalMars(parseInt(marsStorage, 10) || 0); // Afficher le total
      }
    } else {
      // Si startTime n'existe pas, aucun point gagné cette partie
      setMarsGained(0);
      setTotalMars(parseInt(marsStorage, 10) || 0); // Total existant
    }

    setPlayerName(name);
  }, []);

  useEffect(() => {
    if (!isMuted) {
      gameOver.volume = 0.1;
      gameOver.play();
    }
  }, [isMuted]);

  // Fonction pour rejouer
  const handleReplay = () => {
    localStorage.setItem("scoreCalculated", "false"); // Réinitialiser pour une nouvelle partie
    localStorage.setItem("startTime", Date.now().toString()); // Nouveau temps de départ
    navigate("/terre");
  };

  return (
    <div className="gameover-container">
      <h1>Les petits astronautes</h1>
      <p>Bravo {playerName}, vous avez réussi votre exploration martienne !</p>
      <p>
        Vous avez récolté {marsGained} mars ! Votre total est maintenant de{" "}
        {totalMars} mars. Vous pouvez les utiliser pour acheter des véhicules
        dans la boutique.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button onClick={() => navigate("/vehicles")}>Accueil</button>
        <button onClick={handleReplay}>Rejouer</button>
      </div>
    </div>
  );
};

export default EndGame;
