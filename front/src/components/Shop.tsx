import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import API_URL from "../constants/api";
import { generateStars } from "../hooks/generateStars";

const CREDITS_KEY = "credits";
const UNLOCKED_VEHICLES_KEY = "unlockedVehicles";

const Shop = () => {
  const [vehicles, setVehicles] = useState([]);
  const [mars, setMars] = useState(() => {
    return parseInt(localStorage.getItem(CREDITS_KEY), 10) || 100;
  });
  const [unlockedVehicles, setUnlockedVehicles] = useState(() => {
    const storedVehicles = JSON.parse(
      localStorage.getItem(UNLOCKED_VEHICLES_KEY)
    ) || [0];
    return Array.isArray(storedVehicles) ? storedVehicles : [0];
  });
  const [message, setMessage] = useState(""); // Nouvel état pour le message

  const starsRef = useRef(null);
  const audioRef = useRef(null);
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
      setMessage(`Vous possédez déjà ce véhicule !`);
      setTimeout(() => setMessage(""), 3000); // Efface le message après 3 secondes
      return;
    }

    const vehicle = vehicles[index];

    if (mars >= vehicle.price) {
      const newMars = mars - vehicle.price;
      const updatedUnlocked = [...unlockedVehicles, index];

      setMars(newMars);
      setUnlockedVehicles(updatedUnlocked);
      setMessage(`Vous avez acheté : ${vehicle.name} !`);
      setTimeout(() => setMessage(""), 3000);

      localStorage.setItem(CREDITS_KEY, newMars.toString());
      localStorage.setItem(
        UNLOCKED_VEHICLES_KEY,
        JSON.stringify(updatedUnlocked)
      );

      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play();
      }
    } else {
      setMessage("Mars insuffisants !");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="shop-container">
      <div className="stars" ref={starsRef}></div>
      <h1>Boutique</h1>
      <p>Mars : {mars}</p>
      {message && <p className="shop-message">{message}</p>}{" "}
      {/* Affichage du message */}
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
              <p>Prix : {vehicle.price} Mars</p>
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
      <audio ref={audioRef} src="/assets/sounds/reward.mp3" preload="auto" />
    </div>
  );
};

export default Shop;
