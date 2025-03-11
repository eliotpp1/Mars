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
    
        loadQuestions();
        fetchVehicle();
      }, []);




  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas>
        <Scene
            rocketRef={rocketRef}
        />
      </Canvas>
    </div>
  );
};

export default Mars;
