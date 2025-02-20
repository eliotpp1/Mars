import { Canvas } from "@react-three/fiber";
import { Scene } from './../scenes/Scene';
import { useGLTF } from "@react-three/drei";
import { useState } from "react";

const Atmosphere = () => {
  const [birdFound, setBirdFound] = useState(false);
  const [monkeyFound, setMonkeyFound] = useState(false);
  const [answer, setAnswer] = useState('');
  const [frogFound, setFrogFound] = useState(false);

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (answer.toLowerCase().trim() === 'grenouille') {
      setFrogFound(true);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {!birdFound && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.8)",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
            fontFamily: "Arial, sans-serif"
          }}
        >
          Trouve l'oiseau pour avancer !
        </div>
      )}
      
      {birdFound && !monkeyFound && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.8)",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
            fontFamily: "Arial, sans-serif"
          }}
        >
          Maintenant, trouve le singe caché !
        </div>
      )}

      {monkeyFound && !frogFound && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.8)",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
            fontFamily: "Arial, sans-serif"
          }}
        >
          <form onSubmit={handleAnswerSubmit}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              Quel animal se trouve au dessus de la cascade ?
            </div>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{
                padding: '5px',
                marginRight: '10px',
                borderRadius: '3px',
                border: '1px solid #ccc'
              }}
              placeholder="Écris ta réponse..."
            />
            <button
              type="submit"
              style={{
                padding: '5px 10px',
                borderRadius: '3px',
                border: 'none',
                backgroundColor: '#4CAF50',
                color: 'white',
                cursor: 'pointer'
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
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.8)",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
            fontFamily: "Arial, sans-serif"
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

export default Atmosphere;

// Préchargement des modèles
useGLTF.preload("/assets/models/terre.glb");
useGLTF.preload("/assets/models/rocket.glb");
useGLTF.preload("/assets/models/bird.glb");
useGLTF.preload("/assets/models/snake.glb");
useGLTF.preload("/assets/models/homme.gltf");
useGLTF.preload("/assets/models/tiger.glb");
useGLTF.preload("/assets/models/singe.glb");
useGLTF.preload("/assets/models/frog.glb");