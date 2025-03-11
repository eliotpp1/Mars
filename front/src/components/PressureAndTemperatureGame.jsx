import { useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import "./../assets/styles/Game.css";

const PressureAndTemperatureGame = ({ onWin, onClose }) => {
  const getRandomPressure = () => Math.floor(Math.random() * 101);
  const getRandomTemperature = () => Math.floor(Math.random() * 101) - 50;

  const [pressure, setPressure] = useState(getRandomPressure());
  const [temperature, setTemperature] = useState(getRandomTemperature());

  const [pressureTarget] = useState(getRandomPressure());
  const [temperatureTarget] = useState(getRandomTemperature());

  const [isCorrect, setIsCorrect] = useState(false);

  const checkValues = () => {
    const pressureIsCorrect = Math.abs(pressure - pressureTarget) < 5;
    const temperatureIsCorrect = Math.abs(temperature - temperatureTarget) < 5;
    setIsCorrect(pressureIsCorrect && temperatureIsCorrect);
  };

  useEffect(() => {
    checkValues();
  }, [pressure, temperature]);

  return (
    <Canvas>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />

      <Html position={[0, 1, 0]} style={{ transform: "translate(-50%, -50%)" }}>
        <div className="game-container-Pressure">
          <button className="close-btn" onClick={onClose}>✖</button>

          <h2>Réglage Pression & Température</h2>

          <div className="slider-container">
            <label>Pression: {pressure} PSI</label>
            <input
              type="range"
              min="0"
              max="100"
              value={pressure}
              onChange={(e) => setPressure(Number(e.target.value))}
              onMouseUp={checkValues}
              className="slider"
            />
            <div className={`feedback ${pressure < pressureTarget ? "low" : pressure > pressureTarget ? "high" : "correct"}`}>
              {pressure < pressureTarget ? "Trop basse" : pressure > pressureTarget ? "Trop haute" : "Correcte ✅"}
            </div>
          </div>

          <div className="slider-container">
            <label>Température: {temperature}°C</label>
            <input
              type="range"
              min="-50"
              max="50"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              onMouseUp={checkValues}
              className="slider"
            />
            <div className={`feedback ${temperature < temperatureTarget ? "low" : temperature > temperatureTarget ? "high" : "correct"}`}>
              {temperature < temperatureTarget ? "Trop basse" : temperature > temperatureTarget ? "Trop haute" : "Correcte ✅"}
            </div>
          </div>

          <div className="button-container">
            {isCorrect ? (
              <button className="success-btn" onClick={onWin}>✔ Réparation terminée</button>
            ) : (
              <button className="retry-btn" disabled></button>
            )}
          </div>
        </div>
      </Html>
    </Canvas>
  );
};

export default PressureAndTemperatureGame;
