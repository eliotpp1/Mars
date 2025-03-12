import { Canvas } from "@react-three/fiber";
import { Scene } from "../scenes/MarsScene";
import { useGLTF } from "@react-three/drei";
import API_URL from "../../constants/api";
import { useEffect, useState, useRef } from "react";
import { useSound } from "../../context/SoundContext";

const Mars = () => {
  const [quiz1Data, setQuiz1Data] = useState(null);
  const [quiz2Data, setQuiz2Data] = useState(null);
  const [vehicleName, setVehicleName] = useState("");
  const [name, setName] = useState("");
  const [speed, setSpeed] = useState(200); // Vitesse fictive initiale en km/h
  const [start, setStart] = useState(false); // Démarre à false
  const [gameOver, setGameOver] = useState(false);
  const [landed, setLanded] = useState(false);
  const rocketRef = useRef();
  const { isMuted } = useSound();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`${API_URL}/question/Mars`);
        const data = await res.json();
        return {
          ...data,
          options: [data.choix1, data.choix2, data.choix3, data.choix4],
          correctAnswer: data[`choix${data.reponse_correcte}`],
        };
      } catch (err) {
        console.error("Erreur API:", err);
        return null;
      }
    };

    const fetchVehicle = async () => {
      let id = parseInt(localStorage.getItem("selectedVehicle")) + 1;
      const response = await fetch(`${API_URL}/vehicles/${id}`);
      const data = await response.json();
      console.log(data);
      setVehicleName(data.name);
    };

    const fetchName = async () => {
      let name = localStorage.getItem("playerName");
      setName(name);
    };

    const loadQuestions = async () => {
      const firstQuestion = await fetchQuestion();
      if (firstQuestion) {
        setQuiz1Data(firstQuestion);
        let secondQuestion;
        do {
          secondQuestion = await fetchQuestion();
        } while (!secondQuestion || secondQuestion.id === firstQuestion.id);
        setQuiz2Data(secondQuestion);
      }
    };
    fetchName();
    loadQuestions();
    fetchVehicle();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas>
        <Scene
          rocketRef={rocketRef}
          setSpeed={setSpeed}
          setGameOver={setGameOver}
          setLanded={setLanded}
          start={start} // Passe start au composant Scene
        />
      </Canvas>

      {/* Popup de démarrage */}
      {!start && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "36px",
            fontFamily: "Arial",
            background: "rgba(0, 0, 0, 0.8)",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            zIndex: 1000,
            display:"flex", 
            alignItems:"center", 
            flexDirection:"column",
          }}
        >
          <div style={{ marginBottom: "20px"}}>
            Attention { name } votre véhicules arrive trop vite sur mars, vous
            allez devoir le ralentir en cliquant sur espace plusieurs fois{" "}
          </div>
          <button
            onClick={() => setStart(true)} // Passe start à true au clic
            style={{
              padding: "10px 20px",
              fontSize: "24px",
              backgroundColor: "#ff4500",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#ff6500")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#ff4500")}
          >
            Démarrer
          </button>
        </div>
      )}

      {/* Affichage de la vitesse */}
      {start && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            color: "white",
            fontSize: "24px",
            fontFamily: "Arial",
            background: "rgba(0, 0, 0, 0.7)",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          Vitesse : {speed} km/h
          {speed === 30 && !gameOver && (
            <div style={{ color: "lime", fontWeight: "bold" }}>
              Vitesse parfaite !
            </div>
          )}
        </div>
      )}

      {/* Popup de succès */}
      {landed && speed === 30 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "lime",
            fontSize: "36px",
            fontFamily: "Arial",
            background: "rgba(0, 0, 0, 0.8)",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "15px" }}>
             Sauvetage Réussi ! 
          </div>
          <div>Atterrissage parfait à 30 km/h</div>
          <div
            style={{ fontSize: "24px", marginTop: "15px", color: "#aaffaa" }}
          >
            Mission accomplie avec {vehicleName}
          </div>
        </div>
      )}

      {/* Popup d'échec */}
      {gameOver && !landed && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "red",
            fontSize: "36px",
            fontFamily: "Arial",
            background: "rgba(0, 0, 0, 0.8)",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          Crash ! Trop rapide.
        </div>
      )}
    </div>
  );
};

export default Mars;
