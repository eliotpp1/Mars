import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Stars } from "../../components/Stars";
import { useState, useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useNavigate } from "react-router-dom"; 

// 🚀 Composant de la fusée
const Rocket = ({ position }, ref) => {
  const { scene } = useGLTF("/assets/models/vehicles/rocket.glb");

  return (
    <primitive
      ref={ref}
      object={scene}
      position={[position, -1, 0]}
      scale={1.7}
      rotation={[-Math.PI / 3, 0, 0]} // Fusée inclinée vers l'avant
    />
  );
};

const ForwardedRocket = React.forwardRef(Rocket);

// 🌑 Composant des astéroïdes
const Asteroid = ({ startPosition, speed, spawnTime, id, onCollision, gameOver }, ref) => {
  const { scene } = useGLTF("/assets/models/lune/asteroid.glb");
  const asteroidRef = useRef();
  const [position, setPosition] = useState(startPosition.clone());

  useEffect(() => {
    if (ref) ref.current[id] = asteroidRef; // Stocker la référence avec l'ID comme clé
  }, [ref, id]);

  // Utilisation de useFrame pour animer le mouvement des astéroïdes
  useFrame(() => {
    if (asteroidRef.current && !gameOver) {
      setPosition((prev) => {
        const newPosition = prev.clone();
        newPosition.z += speed;
        asteroidRef.current.position.copy(newPosition);

        // Vérifier la collision avec la fusée
        if (onCollision) {
          onCollision(id, asteroidRef.current);
        }

        return newPosition;
      });
    }
  });

  return <primitive ref={asteroidRef} object={scene} position={position} scale={0.06} />;
};

const ForwardedAsteroid = React.forwardRef(Asteroid);

// 🎮 Composant principal du jeu
const RocketGame = () => {
  const [rocketPosition, setRocketPosition] = useState(0);
  const [asteroids, setAsteroids] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const navigate = useNavigate();
  const rocketRef = useRef();

  const [successMessage, setSuccessMessage] = useState(false);
  // Utiliser un objet pour stocker les références des astéroïdes par ID
  const asteroidRefs = useRef({});

  // Vérification des collisions
  const checkCollision = (id, asteroidMesh) => {
    if (!rocketRef.current || gameOver) return false;

    const asteroidBox = new THREE.Box3().setFromObject(asteroidMesh);
    const rocketBox = new THREE.Box3().setFromObject(rocketRef.current);

    if (asteroidBox.intersectsBox(rocketBox)) {
      setGameOver(true);
      return true;
    }


    return false;
  };
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setTimeout(() => {
        setSuccessMessage(true); // Afficher le message de réussite
        setAsteroids([]); 
        setTimeout(() => navigate("/scene3"), 3000); // Redirection après 2s
      }, 15000);

      return () => clearTimeout(timer); // Nettoyage au démontage ou si gameOver devient vrai
    }
  }, [gameStarted, gameOver, navigate]);
  // Déplacement de la fusée
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!gameStarted || gameOver) return;

      setRocketPosition((prev) => {
        if (event.key === "ArrowLeft" && prev > -2) return prev - 1;
        if (event.key === "ArrowRight" && prev < 2) return prev + 1;
        return prev;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted, gameOver]);

  // Compte à rebours avant le début du jeu
  useEffect(() => {
    if (countdown > 0 && !gameStarted) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setGameStarted(true);
    }
  }, [countdown, gameStarted]);

  // Génération des astéroïdes
  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const spawnAsteroid = () => {
      setAsteroids((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          startPosition: new THREE.Vector3(-2 + Math.random() * 4, -1, -10),
          speed: 0.1,
          spawnTime: Date.now(),
        },
      ]);
    };

    // Appel à spawnAsteroid toutes les 5 secondes
    const asteroidInterval = setInterval(spawnAsteroid, 5000);

    return () => clearInterval(asteroidInterval);
  }, [gameOver, gameStarted]);

  // Nettoyage des astéroïdes qui sont sortis de l'écran
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setAsteroids((prevAsteroids) =>
        prevAsteroids.filter((asteroid) => {
          const asteroidRef = asteroidRefs.current[asteroid.id];
          if (!asteroidRef || !asteroidRef.current) return false;

          // Supprimer les astéroïdes qui sont sortis de l'écran (z > 10)
          return asteroidRef.current.position.z < 10;
        })
      );
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Fonction pour redémarrer le jeu
  const restartGame = () => {
    setGameOver(false);
    setAsteroids([]);
    setRocketPosition(0);
    setGameStarted(true);
    setCountdown(3);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {!gameStarted && (
        <h2 style={{ color: "white", textAlign: "center", fontSize: "2em", position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)" }}>
          Évitez les astéroïdes {countdown}...
        </h2>
      )}
  
      {successMessage && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", zIndex: 10 }}>
          <h2 style={{ color: "lime", fontSize: "2em" }}>Bravo ! Direction la Lune</h2>
        </div>
      )}
  
      {gameOver && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", zIndex: 10 }}>
          <h2 style={{ color: "red", fontSize: "2em" }}>Game Over !</h2>
          <button
            onClick={restartGame}
            style={{
              padding: "10px 20px",
              fontSize: "1.2em",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Rejouer
          </button>
        </div>
      )}
  
      <Canvas camera={{ position: [0, 0, 5] }}>
        {/* Fond étoilé */}
        <color attach="background" args={["#000020"]} />
        <Stars />
  
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />
        <ForwardedRocket position={rocketPosition} ref={rocketRef} />
        {asteroids.map((asteroid) => (
          <ForwardedAsteroid
            key={asteroid.id}
            id={asteroid.id}
            startPosition={asteroid.startPosition}
            speed={asteroid.speed}
            spawnTime={asteroid.spawnTime}
            onCollision={checkCollision}
            gameOver={gameOver}
            ref={asteroidRefs}
          />
        ))}
        <OrbitControls />
      </Canvas>
    </div>
  );
};  

export default RocketGame;

