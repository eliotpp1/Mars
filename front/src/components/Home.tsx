import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { generateStars } from "../hooks/generateStars";

const Home = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const starsRef = useRef(null); // Référence pour le conteneur des étoiles

  useEffect(() => {
    generateStars(starsRef.current);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("playerName", name);

      // Vérifie si "credits" est déjà défini, sinon le mettre à 0
      if (!localStorage.getItem("credits")) {
        localStorage.setItem("credits", "100");
      }

      navigate("/Introduction");
    }
  };

  return (
    <div className="home-container">
      <div className="stars" ref={starsRef}></div> {/* Conteneur des étoiles */}
      <h1>Bienvenue !</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Entrez votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Commencer</button>
      </form>
    </div>
  );
};

export default Home;
