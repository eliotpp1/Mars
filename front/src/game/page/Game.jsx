import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";  
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
      rotation={[-Math.PI / 3, 0, 0]}
    />
  );
};

const ForwardedRocket = React.forwardRef(Rocket);

// 🌑 Composant des astéroïdes
const Asteroid = ({ startPosition, speed, id, onCollision, gameOver }) => {
  const { scene } = useGLTF("/assets/models/lune/asteroid.glb");
  const asteroidRef = useRef();

  useFrame(() => {
    if (asteroidRef.current && !gameOver) {
      asteroidRef.current.position.z += speed;

      if (onCollision) {
        onCollision(id, asteroidRef.current);
      }
    }
  });

  return <primitive ref={asteroidRef} object={scene} position={startPosition} scale={0.06} />;
};

// 🎮 Composant principal du jeu
const RocketGame = () => {
  const [rocketPosition, setRocketPosition] = useState(0);
  const [asteroids, setAsteroids] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const navigate = useNavigate();
  const rocketRef = useRef();
  const { scene: decorScene } = useGLTF("/assets/models/lune/decor.glb");
  const [hasWon, setHasWon] = useState(false);

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

  // Démarrage du jeu après le compte à rebours
  useEffect(() => {
    if (countdown > 0 && !gameStarted) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setGameStarted(true);
    }
  }, [countdown, gameStarted]);

  // Timer de victoire (10 à 15 secondes après le début du jeu)
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const winTimer = setTimeout(() => {
        setHasWon(true); // Indiquer que le joueur a gagné
        setAsteroids([]); // Supprime les astéroïdes
        setTimeout(() => {
          navigate("/scene3"); // 🚀 Redirection vers "scene3" après l'animation
        }, 3000); // Attendre la fin de l'animation
      }, 10000 + Math.random() * 5000); // Entre 10 et 15 secondes
  
      return () => clearTimeout(winTimer);
    }
  }, [gameStarted, gameOver, navigate]);

  // Apparition immédiate d'un astéroïde dès le début du jeu
  useEffect(() => {
    if (gameStarted && !gameOver) {
      spawnAsteroid();
    }
  }, [gameStarted]);

  // Apparition continue d'astéroïdes avec un timing aléatoire
  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const asteroidSpawner = setInterval(() => {
      spawnAsteroid();
    }, Math.random() * 2000 + 1000); // Intervalle entre 1s et 3s

    return () => clearInterval(asteroidSpawner);
  }, [gameOver, gameStarted]);

  // Fonction pour générer un astéroïde
  const spawnAsteroid = () => {
    setAsteroids((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        startPosition: new THREE.Vector3(-2 + Math.random() * 4, -1, -10),
        speed: 0.03 + Math.random() * 0.02, // 🚀 Astéroïdes plus lents (0.03 - 0.05)
      },
    ]);
  };

  // Suppression des astéroïdes qui sortent de l'écran
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setAsteroids((prev) =>
        prev.filter((asteroid) => asteroid.startPosition.z < 10)
      );
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

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
        <h2 style={{ color: "white", textAlign: "center", fontSize: "2em", position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}>
          Évitez les astéroïdes {countdown}...
        </h2>
      )}
{hasWon && (
  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", zIndex: 10 }}>
    <h2 style={{ color: "lightgreen", fontSize: "2em" }}>Mission accomplie ! 🚀</h2>
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
        <color attach="background" args={["#000020"]} />

        <primitive object={decorScene} scale={10} position={[0, 0, 0]} />

        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />

        <ForwardedRocket position={rocketPosition} ref={rocketRef} />
        {asteroids.map((asteroid) => (
          <Asteroid
            key={asteroid.id}
            id={asteroid.id}
            startPosition={asteroid.startPosition}
            speed={asteroid.speed}
            onCollision={checkCollision}
            gameOver={gameOver}
          />
        ))}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default RocketGame;
