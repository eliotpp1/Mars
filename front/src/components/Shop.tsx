import { useState, useEffect, useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import API_URL from "../constants/api";
import { generateStars } from "../hooks/generateStars";

const Shop = () => {
  const [vehicles, setVehicles] = useState([]);
  const [credits, setCredits] = useState(
    parseInt(localStorage.getItem("credits"), 10) || 1000
  );
  const starsRef = useRef(null); // Référence pour le conteneur des étoiles

  const navigate = useNavigate();
  useEffect(() => {
    generateStars(starsRef.current);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/vehicles`)
      .then((res) => res.json())
      .then((data) => setVehicles(data))
      .catch((error) => console.error("Erreur API:", error));
  }, []);

  const handlePurchase = (vehicle) => {
    if (credits >= vehicle.price) {
      const newCredits = credits - vehicle.price;
      setCredits(newCredits);
      localStorage.setItem("credits", newCredits);
      alert(`Vous avez acheté : ${vehicle.name} !`);
    } else {
      alert("Crédits insuffisants !");
    }
  };

  return (
    <div className="shop-container">
      <div className="stars" ref={starsRef}></div> {/* Conteneur des étoiles */}
      <h1>Boutique</h1>
      <p>Crédits : {credits}</p>
      <div className="shop-grid">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="shop-item">
            <img
              src={vehicle.model_path.replace(".glb", ".png")}
              alt={vehicle.name}
              className="shop-item-image"
            />
            <h3>{vehicle.name}</h3>
            <p>Prix : {vehicle.price} crédits</p>
            <button onClick={() => handlePurchase(vehicle)}>
              <ShoppingCart size={20} /> Acheter
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/vehicles")} className="back-button">
        Retour
      </button>
    </div>
  );
};

export default Shop;
