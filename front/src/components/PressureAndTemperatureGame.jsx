import { useState } from 'react';
import { Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import "./../assets/styles/Game.css";

const PressureAndTemperatureGame = () => {
  // Génération de valeurs aléatoires pour la pression et la température
  const getRandomPressure = () => Math.floor(Math.random() * 101); // Valeur aléatoire entre 0 et 100
  const getRandomTemperature = () => Math.floor(Math.random() * 101) - 50; // Valeur aléatoire entre -50 et 50

  // Génération de cibles aléatoires pour la pression et la température
  const getRandomPressureTarget = () => Math.floor(Math.random() * 101); // Valeur cible aléatoire entre 0 et 100
  const getRandomTemperatureTarget = () => Math.floor(Math.random() * 101) - 50; // Valeur cible aléatoire entre -50 et 50

  // État pour la pression et la température
  const [pressure, setPressure] = useState(getRandomPressure()); // Initiale à une valeur aléatoire
  const [temperature, setTemperature] = useState(getRandomTemperature()); // Initiale à une valeur aléatoire
  
  // Cibles aléatoires pour la pression et la température
  const [pressureTarget] = useState(getRandomPressureTarget()); // Cible aléatoire pour la pression
  const [temperatureTarget] = useState(getRandomTemperatureTarget()); // Cible aléatoire pour la température

  const [isCorrect, setIsCorrect] = useState(false); // Pour vérifier si tout est correct

  // Fonction pour vérifier si les valeurs sont correctes
  const checkValues = () => {
    if (Math.abs(pressure - pressureTarget) < 5 && Math.abs(temperature - temperatureTarget) < 5) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />

      <Html position={[0, 1, 0]} style={{ transform: "translate(-50%, -50%)" }}>
        <div className="game-container">
          <h2>Test de pression et de température</h2>

          {/* Section de la pression */}
          <div>
            <label>Pression: {pressure} PSI</label>
            <input
              type="range"
              min="0"
              max="100"
              value={pressure}
              onChange={(e) => setPressure(e.target.value)}
              onMouseUp={checkValues}
              className="slider"
            />
            <div className={`feedback ${pressure < pressureTarget ? 'low' : pressure > pressureTarget ? 'high' : 'correct'}`}>
              {pressure < pressureTarget ? 'Pression trop basse' : pressure > pressureTarget ? 'Pression trop haute' : 'Pression correcte'}
            </div>
          </div>

          {/* Section de la température */}
          <div>
            <label>Température: {temperature}°C</label>
            <input
              type="range"
              min="-50"
              max="50"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              onMouseUp={checkValues}
              className="slider"
            />
            <div className={`feedback ${temperature < temperatureTarget ? 'low' : temperature > temperatureTarget ? 'high' : 'correct'}`}>
              {temperature < temperatureTarget ? 'Température trop basse' : temperature > temperatureTarget ? 'Température trop haute' : 'Température correcte'}
            </div>
          </div>

          {/* Bouton de résultat */}
          <div style={{ marginTop: '20px' }}>
            {isCorrect ? (
              <button className="success-btn">Fusée prête pour le lancement !</button>
            ) : (
              <button className="retry-btn" disabled>Réessayez</button>
            )}
          </div>
        </div>
      </Html>
    </Canvas>
  );
};

export default PressureAndTemperatureGame;
