// src/components/Introduction.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSound } from "../context/SoundContext"; // Importer le contexte sonore
import { generateStars } from "../hooks/generateStars"; // Générer des étoiles en fond

const Introduction = () => {
    const [name, setName] = useState(localStorage.getItem("playerName") || ""); // Récupérer le nom si existant
    const navigate = useNavigate();
    const starsRef = useRef(null);
    const clickSound = new Audio("/assets/sounds/click.mp3");
    const { isMuted } = useSound(); // Utiliser le contexte pour gérer l'état muted

    useEffect(() => {
        generateStars(starsRef.current);
    }, []);

    const handleStartClick = () => {
        if (!isMuted) clickSound.play(); // Jouer le son uniquement si pas muted
        navigate("/terre"); // Redirige vers la page /terre
    };

    return (
        <div className="home-container">
            <div className="stars" ref={starsRef}></div>
            <h1>Bienvenue, jeune astronaute !</h1> 
            <div className="lore-container">
                <p className="lore-text">
                Félicitation {name}. Tu es sélectionné pour une mission incroyable : aller sur Mars !  
                </p>
                <p className="lore-text">
                    Mais attention, prépare-toi à surmonter des défis et à faire face à tout ce qui pourrait se passer en cours de route.
                </p>
                <p className="lore-text">
                    Es-tu prêt à partir à l'aventure et devenir l'un des premiers à atteindre Mars ?
                </p>
            </div>
            <button onClick={handleStartClick}>Commencer</button>
        </div>
    );
};

export default Introduction;
