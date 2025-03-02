import { Canvas } from "@react-three/fiber";
import { Scene } from "../scenes/Scene";
import { useGLTF } from "@react-three/drei";
import { useState } from "react";

const Terre = () => {
  const [birdFound, setBirdFound] = useState(false);
  const [monkeyFound, setMonkeyFound] = useState(false);
  const [answer, setAnswer] = useState("");
  const [frogFound, setFrogFound] = useState(false);
  localStorage.setItem("environnement", "Terre");


  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (answer.toLowerCase().trim() === "grenouille") {
      setFrogFound(true);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {!birdFound && (
        <div
          style={{
            position: "absolute",
            top: "5px",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: '"Orbitron", sans-serif',
            background: "rgba(0, 0, 0, 0.8)",
            border: "2px solid #ff9500",
            borderRadius: "10px",
            padding: "20px",
            color: "#fff",
            textAlign: "center",
            fontSize: "1rem",
            fontWeight: "bold",
            boxShadow: "0 0 20px rgba(255, 149, 0, 0.5)",
            zIndex: 1000,
            maxWidth: "80%",
          }}
        >
          Trouve l'oiseau pour avancer !
        </div>
      )}
  
      {birdFound && !monkeyFound && (
        <div
          style={{
            position: "absolute",
            top: "5px",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: '"Orbitron", sans-serif',
            background: "rgba(0, 0, 0, 0.8)",
            border: "2px solid #ff9500",
            borderRadius: "10px",
            padding: "20px",
            color: "#fff",
            textAlign: "center",
            fontSize: "rem",
            fontWeight: "bold",
            boxShadow: "0 0 20px rgba(255, 149, 0, 0.5)",
            zIndex: 1000,
            maxWidth: "80%",
          }}
        >
          Maintenant, trouve le singe caché !
        </div>
      )}
  
      {monkeyFound && !frogFound && (
        <div
          style={{
            position: "absolute",
            top: "5px",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: '"Orbitron", sans-serif',
            background: "rgba(0, 0, 0, 0.8)",
            border: "2px solid #ff9500",
            borderRadius: "10px",
            padding: "20px",
            color: "#fff",
            textAlign: "center",
            fontSize: "1rem",
            fontWeight: "bold",
            boxShadow: "0 0 20px rgba(255, 149, 0, 0.5)",
            zIndex: 1000,
            maxWidth: "80%",
          }}
        >
          <form onSubmit={handleAnswerSubmit} style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "15px", fontSize: "1.2rem", fontWeight: "bold" }}>
              Quel animal se trouve au-dessus de la cascade ?
            </div>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Écris ta réponse..."
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "2px solid #ff9500",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                fontSize: "1rem",
                textAlign: "center",
                outline: "none",
                width: "80%",
              }}
            />
            <button
              type="submit"
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                background: "#ff9500",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "background 0.3s ease",
              }}
            >
              Valider
            </button>
          </form>
        </div>
      )}
  
      {frogFound && (
        <div
          style={{
            position: "absolute",
            top: "5px",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: '"Orbitron", sans-serif',
            background: "rgba(0, 0, 0, 0.8)",
            border: "2px solid #ff9500",
            borderRadius: "10px",
            padding: "20px",
            color: "#fff",
            textAlign: "center",
            fontSize: "1.2rem",
            fontWeight: "bold",
            boxShadow: "0 0 20px rgba(255, 149, 0, 0.5)",
            zIndex: 1000,
            maxWidth: "80%",
          }}
        >
          Bravo ! Tu as trouvé la grenouille !
        </div>
      )}
  
      <Canvas>
        <Scene
          setBirdFound={setBirdFound}
          setMonkeyFound={setMonkeyFound}
          frogFound={frogFound}
        />
      </Canvas>
    </div>
  );
  
};

export default Terre;

// Préchargement des modèles
useGLTF.preload("/assets/models/terre/terre.glb");
useGLTF.preload("/assets/models/terre/bird.glb");
useGLTF.preload("/assets/models/terre/monkey.glb");
useGLTF.preload("/assets/models/terre/frog.glb");
useGLTF.preload("/assets/models/terre/snake.glb");
useGLTF.preload("/assets/models/terre/tiger.glb");
useGLTF.preload("/assets/models/terre/homme.glb");
useGLTF.preload("/assets/models/vehicles/rocket.glb");
