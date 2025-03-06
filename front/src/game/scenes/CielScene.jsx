import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { SceneObject } from "../../components/SceneObject";
import { CameraSetup } from "../../components/CameraSetup";
import { SunRay } from "../../components/SunRay";

export const Scene = () => {
  const { camera } = useThree();

  const [gameState, setGameState] = useState({
    currentGame: 1,
    game1Completed: false,
    game2Completed: false,
    game3Completed: false,
    showPopup: false,
    popupMessage: "",
    showPathGame: false,
    awaitingConfirmation: false,
  });

  const [isRocketAnimating, setIsRocketAnimating] = useState(false);

  const planeRef = useRef();
  const rocketRef = useRef();
  const yellowRayBoxRef = useRef();
  const pathCanvasRef = useRef();
  const pathInitializedRef = useRef(false);

  const rayHeight = 200;
  const baseX = 150;
  const baseZ = 0;
  const spacing = 50;

  const handlePlaneClick = () => {
    if (gameState.currentGame === 1 && !gameState.game1Completed) {
      setGameState((prev) => ({
        ...prev,
        game1Completed: true,
        showPopup: true,
        popupMessage:
          "Bravo ! Vous avez trouvé l'avion. Prochain défi : cliquez sur le rayon de la bonne couleur !",
        currentGame: 2,
      }));

      gsap.to(planeRef.current.position, {
        y: planeRef.current.position.y + 20,
        duration: 1,
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const handleYellowRayClick = () => {
    if (gameState.currentGame === 2 && !gameState.game2Completed) {
      setGameState((prev) => ({
        ...prev,
        game2Completed: true,
        showPopup: true,
        popupMessage:
          "Parfait ! Vous avez trouvé le rayon jaune. Dernier défi : guidez l'avion hors de l'atmosphère !",
        currentGame: 3,
      }));
    }
  };

  const generatePath = () => {
    const width = 500;
    const height = 300;

    const points = [];
    points.push({ x: 50, y: 150 });
    points.push({ x: 100, y: 50 });
    points.push({ x: 200, y: 200 });
    points.push({ x: 300, y: 100 });
    points.push({ x: 400, y: 250 });
    points.push({ x: 450, y: 150 });

    return points;
  };

  const distanceToLine = (point, lineStart, lineEnd) => {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = len_sq !== 0 ? dot / len_sq : -1;

    let xx, yy;

    if (param < 0 || (lineStart.x === lineEnd.x && lineStart.y === lineEnd.y)) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  };

  useFrame(() => {
    if (isRocketAnimating && rocketRef.current) {
      const targetCameraPosition = {
        x: rocketRef.current.position.x + 50,
        y: rocketRef.current.position.y + 30,
        z: rocketRef.current.position.z + 50,
      };

      camera.position.lerp(targetCameraPosition, 0.05);
      camera.lookAt(rocketRef.current.position);
    }
  });

  // Effet pour initialiser le jeu 3 après la fermeture de la popup du jeu 2
  useEffect(() => {
    if (
      gameState.currentGame === 3 &&
      !gameState.showPopup &&
      !pathInitializedRef.current
    ) {
      console.log("Chargement du jeu 3..."); // Vérification dans la console

      setGameState((prev) => ({ ...prev, showPathGame: true }));

      setTimeout(() => {
        if (pathCanvasRef.current) {
          const cleanupFunction = initPathGame();
          pathInitializedRef.current = true;
          setGameState((prev) => ({
            ...prev,
            popupText:
              "Défi 3: Suivez le chemin avec votre souris pour faire décoller l'avion",
          }));
          if (cleanupFunction) {
            return cleanupFunction;
          }
        }
      }, 300);
    }
  }, [gameState.currentGame, gameState.showPopup]);

  const initPathGame = () => {
    const canvas = pathCanvasRef.current;

    if (!canvas) {
      console.error("Canvas not found");
      return null;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get canvas context");
      return null;
    }

    const pathPoints = generatePath();
    let currentPoint = 0;
    let pathCompleted = false;
    let mouseOnPath = false;

    const drawPath = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 20;
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);

      for (let i = 1; i < pathPoints.length; i++) {
        ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      }

      ctx.stroke();

      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.arc(pathPoints[0].x, pathPoints[0].y, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(
        pathPoints[pathPoints.length - 1].x,
        pathPoints[pathPoints.length - 1].y,
        15,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);

      for (let i = 1; i <= currentPoint; i++) {
        ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      }

      ctx.stroke();

      ctx.fillStyle = "white";
      ctx.font = "16px Orbitron";
      ctx.textAlign = "center";
      ctx.fillText(
        "Suivez le chemin du point vert au point rouge",
        canvas.width / 2,
        30
      );
    };

    try {
      drawPath();
    } catch (e) {
      console.error("Error drawing path:", e);
      return null;
    }

    const handleMouseMove = (e) => {
      if (pathCompleted || !ctx) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const checkPoint = pathPoints[currentPoint];
      const nextPoint =
        pathPoints[Math.min(currentPoint + 1, pathPoints.length - 1)];

      const distToPath = distanceToLine(
        { x: mouseX, y: mouseY },
        checkPoint,
        nextPoint
      );

      if (distToPath < 25) {
        mouseOnPath = true;

        drawPath();
        ctx.fillStyle = "#00FF00";
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 8, 0, Math.PI * 2);
        ctx.fill();

        const distToNextPoint = Math.sqrt(
          Math.pow(mouseX - nextPoint.x, 2) + Math.pow(mouseY - nextPoint.y, 2)
        );

        if (distToNextPoint < 20 && currentPoint < pathPoints.length - 2) {
          currentPoint++;
          drawPath();
        } else if (
          currentPoint === pathPoints.length - 2 &&
          distToNextPoint < 20
        ) {
          pathCompleted = true;
          canvas.removeEventListener("mousemove", handleMouseMove);

          setGameState((prev) => ({
            ...prev,
            game3Completed: true,
            showPopup: true,
            popupMessage:
              "Félicitations ! Vous avez complété tous les défis. Cliquez sur Continuer pour quitter l'atmosphère !",
            showPathGame: false,
            awaitingConfirmation: true,
          }));
        }
      } else {
        if (mouseOnPath) {
          currentPoint = 0;
          mouseOnPath = false;
          drawPath();

          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.arc(mouseX, mouseY, 8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawPath();
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(mouseX, mouseY, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    try {
      canvas.addEventListener("mousemove", handleMouseMove);
    } catch (e) {
      console.error("Error adding event listener:", e);
      return null;
    }

    return () => {
      try {
        canvas.removeEventListener("mousemove", handleMouseMove);
      } catch (e) {
        console.error("Error removing event listener:", e);
      }
    };
  };

  const handleClosePopup = () => {
    setGameState((prev) => {
      const newState = {
        ...prev,
        showPopup: false,
      };

      // Si on ferme la popup finale (après avoir terminé le jeu 3)
      if (prev.awaitingConfirmation && rocketRef.current) {
        setIsRocketAnimating(true);
        newState.awaitingConfirmation = false;

        gsap.to(rocketRef.current.position, {
          y: 500,
          duration: 4,
          ease: "power1.in",
          onComplete: () => {
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          },
        });
      }

      return newState;
    });
  };

  return (
    <>
      <color attach="background" args={["#000020"]} />

      <CameraSetup cameraPosition={[70, 5, -48]} />

      <SceneObject
        modelPath="/assets/models/ciel/ciel.glb"
        position={[0, 0, 0]}
        scale={10}
      />
      <SceneObject
        modelPath="/assets/models/ciel/planete.glb"
        position={[0, -800, 0]}
        rotation={[0, 2.8, 0]}
        scale={300}
      />
      <SceneObject
        modelPath="/assets/models/ciel/sun.glb"
        position={[150, 250, 50]}
        scale={0.2}
      />

      <group ref={planeRef} position={[-70, -100, -50]} rotation={[0, -5, 0]}>
        <mesh visible={false} onClick={handlePlaneClick} scale={[3, 3, 3]}>
          <boxGeometry args={[10, 5, 10]} />
          <meshBasicMaterial opacity={0} transparent />
        </mesh>
        <SceneObject modelPath="/assets/models/ciel/plane.glb" scale={0.5} />
      </group>

      <group position={[0, 100, 10]}>
        <SceneObject modelPath="/assets/models/ciel/fish.glb" scale={10} />
      </group>

      <group position={[-200, 0, -25]} rotation={[0, 3.2, 0]}>
        <SceneObject modelPath="/assets/models/ciel/voiture.glb" scale={10} />
      </group>

      <group ref={rocketRef} position={[0, 2, 0]}>
        <SceneObject
          modelPath="/assets/models/vehicles/rocket.glb"
          scale={20}
        />
      </group>

      <group position={[baseX, rayHeight, baseZ]}>
        {/* Rayon jaune */}
        <group rotation={[0, 0, 0]}>
          <mesh
            ref={yellowRayBoxRef}
            visible={false} // Changez à true temporairement pour déboguer
            position={[0, 500, 50]} // Centre du cylindre à length/2 + offset de startPosition
            onClick={(e) => {
              handleYellowRayClick();
            }}
          >
            <cylinderGeometry args={[5, 5, 2000, 5]} />{" "}
            {/* Même longueur que SunRay */}
            <meshBasicMaterial opacity={0} transparent />
          </mesh>
          <SunRay
            startPosition={[0, 50, 50]}
            length={1000}
            width={4}
            color="#FFA500"
            pulsate={true}
          />
        </group>

        <SunRay
          startPosition={[5, 80, 40]}
          rotation={[0, 0, 0]}
          length={10000}
          width={4}
          color="red"
          pulsate={true}
        />

        <SunRay
          startPosition={[5, 80, 64]}
          length={10000}
          width={4}
          color="blue"
          pulsate={true}
        />
      </group>

      <ambientLight intensity={4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, 5, 5]} intensity={1} />

      <Html fullscreen>
        {/* Instruction display - only shown when no popup and no path game */}
        {!gameState.showPopup && !gameState.showPathGame && (
          <div
            style={{
              position: "absolute",
              backdropFilter: "blur(5px)",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.3)",
              color: "black",
              padding: "20px",
              borderRadius: "15px",
              fontFamily: "Orbitron, sans-serif",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {gameState.currentGame === 1 && !gameState.game1Completed && (
              <p>
                Défi 1: Trouvez et cliquez sur l'objet qui est à sa place dans
                le ciel
              </p>
            )}
            {gameState.currentGame === 2 && !gameState.game2Completed && (
              <p>Défi 2: Cliquez sur le rayon de soleil de la bonne couleur</p>
            )}
            {gameState.currentGame === 3 && !gameState.game3Completed && (
              <p>
                Défi 3: Suivez le chemin avec votre souris pour faire décoller
                l'avion
              </p>
            )}
            {gameState.game1Completed &&
              gameState.game2Completed &&
              gameState.game3Completed && (
                <p>Félicitations ! Tous les défis sont complétés !</p>
              )}
          </div>
        )}

        {/* Popup messages */}
        {gameState.showPopup && (
          <div
            style={{
              position: "absolute",
              backdropFilter: "blur(5px)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.3)",
              padding: "20px",
              color: "black",

              borderRadius: "15px",
              fontFamily: "Orbitron, sans-serif",
              zIndex: 2000,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "300px",
              textAlign: "center",
            }}
          >
            <p>{gameState.popupMessage}</p>
            <button
              onClick={handleClosePopup}
              style={{
                backgroundColor: "#4CAF50",
                border: "none",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
                fontFamily: "Orbitron, sans-serif",
              }}
            >
              Continuer
            </button>
          </div>
        )}

        {/* Path game canvas */}
        {gameState.showPathGame && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              color: "black",

              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "10px",
              borderRadius: "10px",
              zIndex: 900,
            }}
          >
            <canvas
              ref={pathCanvasRef}
              width={500}
              height={300}
              style={{ border: "2px solid white" }}
            />
          </div>
        )}
      </Html>
    </>
  );
};
