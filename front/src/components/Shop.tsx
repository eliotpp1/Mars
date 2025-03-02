import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import API_URL from "../constants/api";
import { generateStars } from "../hooks/generateStars";

const CREDITS_KEY = "credits";
const UNLOCKED_VEHICLES_KEY = "unlockedVehicles";

const Shop = () => {
  const [vehicles, setVehicles] = useState([]);
  const [credits, setCredits] = useState(() => {
    return parseInt(localStorage.getItem(CREDITS_KEY), 10) || 100;
  });
  const [unlockedVehicles, setUnlockedVehicles] = useState(() => {
    const storedVehicles = JSON.parse(
      localStorage.getItem(UNLOCKED_VEHICLES_KEY)
    ) || [0];
    return Array.isArray(storedVehicles) ? storedVehicles : [0];
  });

  const starsRef = useRef(null);
  const audioRef = useRef(null); // Référence pour le son
  const navigate = useNavigate();

  useEffect(() => {
    if (starsRef.current) {
      generateStars(starsRef.current);
    }
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${API_URL}/vehicles`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setVehicles(data);
        }
      } catch (error) {
        console.error("Erreur API:", error);
      }
    };
    fetchVehicles();
  }, []);

  const handlePurchase = (index) => {
    if (unlockedVehicles.includes(index)) {
      alert(`Vous possédez déjà ce véhicule !`);
      return;
    }

    const vehicle = vehicles[index];

    if (credits >= vehicle.price) {
      const newCredits = credits - vehicle.price;
      const updatedUnlocked = [...unlockedVehicles, index];

      setCredits(newCredits);
      setUnlockedVehicles(updatedUnlocked);

      localStorage.setItem(CREDITS_KEY, newCredits.toString());
      localStorage.setItem(
        UNLOCKED_VEHICLES_KEY,
        JSON.stringify(updatedUnlocked)
      );

      alert(`Vous avez acheté : ${vehicle.name} !`);

      // 🔊 Jouer le son avec volume réduit (ex: 50%)
      if (audioRef.current) {
        audioRef.current.volume = 0.5; // Ajuste entre 0 (muet) et 1 (max)
        audioRef.current.play();
      }
    } else {
      alert("Crédits insuffisants !");
    }
  };

  return (
    <div className="shop-container">
      <div className="stars" ref={starsRef}></div>
      <h1>Boutique</h1>
      <p>Crédits : {credits}</p>
      <div className="shop-grid">
        {vehicles.map((vehicle, index) => {
          const isOwned = unlockedVehicles.includes(index);
          return (
            <div key={index} className={`shop-item ${isOwned ? "owned" : ""}`}>
              <img
                src={
                  vehicle.model
                    ? vehicle.model
                        .replace("/assets/models/vehicles", "/assets/images/")
                        .replace(".glb", ".PNG")
                    : "/assets/images/default.png"
                }
                alt={vehicle.name}
                className="shop-item-image"
              />

              <h3>{vehicle.name}</h3>
              <p>Prix : {vehicle.price} crédits</p>
              <button
                onClick={() => handlePurchase(index)}
                disabled={isOwned}
                className={isOwned ? "disabled-button" : ""}
              >
                <ShoppingCart size={20} />
                {isOwned ? "Acheté" : "Acheter"}
              </button>
            </div>
          );
        })}
      </div>
      <button onClick={() => navigate("/vehicles")} className="back-button">
        Retour
      </button>

      {/* 🎵 Élément audio caché */}
      <audio ref={audioRef} src="/assets/sounds/reward.mp3" preload="auto" />
    </div>
  );
};

export default Shop;
