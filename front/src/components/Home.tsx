// src/components/Home.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { generateStars } from "../hooks/generateStars";
import { useSound } from "../context/SoundContext"; // Importer le contexte sonore

const Home = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const starsRef = useRef(null);
  const clickSound = new Audio("/assets/sounds/click.mp3");
  const { isMuted } = useSound(); // Utiliser le contexte pour gérer l'état muted

  useEffect(() => {
    generateStars(starsRef.current);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isMuted) clickSound.play(); // Jouer le son uniquement si pas muted
    if (name.trim()) {
      localStorage.setItem("playerName", name);
      localStorage.setItem("unlockedVehicles", JSON.stringify([0])); // Débloquer le premier véhicule

      // Vérifie si "credits" est déjà défini, sinon le mettre à 0
      if (!localStorage.getItem("mars")) {
        localStorage.setItem("mars", "0");
      }

      navigate("/introduction");
    }
  };

  return (
    <div className="home-container">
      <div className="stars" ref={starsRef}></div>
      <h1> Les petits astronautes </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Entrez votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Suivant</button>
      </form>
    </div>
  );
};

export default Home;
