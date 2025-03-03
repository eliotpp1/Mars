import { useState, useEffect } from "react";  // Ajout de l'import manquant
import { useNavigate } from "react-router-dom";
import "./../assets/styles/introduction.css"; 

const Introduction = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      setPlayerName(storedName);
    }
  }, []);

  const startGame = () => {
    navigate("/Scene4.jsx");
  };

  return (
    <div className="introduction-container">
      <h1>Bienvenue {playerName} dans ton aventure !</h1>
      <p className="styled-paragraph">
  Vous êtes un nouvel astronaute en mission pour Mars. Pour atteindre votre
  destination, vous devrez résoudre divers problèmes et surmonter des défis.
</p>

      <button onClick={startGame} className="start-button">
        Commencer l'aventure
      </button>
    </div>
  );
};

export default Introduction;
