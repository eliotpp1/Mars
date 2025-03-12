import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { SceneObject } from "../../components/SceneObject";
import { PerspectiveCamera } from "@react-three/drei";
import API_URL from "../../constants/api";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export const Scene = ({ rocketRef, setSpeed, setGameOver, setLanded, start }) => {
  const cameraRef = useRef();
  const [vehicle, setVehicle] = useState(null);
  const [velocity, setVelocity] = useState({ x: 0, y: -1, z: 0 }); // Vitesse réelle : -1 unité/frame
  const [gameOverLocal, setGameOverLocal] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(200); // Vitesse fictive locale
  const [successDetected, setSuccessDetected] = useState(false); // Pour suivre si on a détecté 30km/h

  // Chargement du modèle du véhicule
  useEffect(() => {
    if (localStorage.getItem("selectedVehicle") === null) {
      localStorage.setItem("selectedVehicle", 0);
    }
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    let id = parseInt(localStorage.getItem("selectedVehicle")) + 1;
    const response = await fetch(`${API_URL}/vehicles/${id}`);
    const data = await response.json();
    setVehicle(data.model);
  };

  // Gestion de la touche Espace pour ralentir
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOverLocal) return;
      if (e.key === " ") {
        if (currentSpeed <= 30){
          return;
        }
        console.log("Espace pressé, vitesse actuelle :", currentSpeed);
        setVelocity((prev) => ({
          ...prev,
          y: Math.min(prev.y + 0.05, 0), // Gardons cette valeur
        }));
        setCurrentSpeed((prev) => {
          // Réduisons l'impact de l'espace à -10 au lieu de -20
          const newSpeed = Math.max(prev - 10, 0);
          setSpeed(newSpeed);
          return newSpeed;
        });
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOverLocal, setSpeed, currentSpeed, start]);

  // Logique de physique et mise à jour des états
  useFrame(() => {
    if (!rocketRef.current || gameOverLocal || !start) return;

    // Déplacement basé sur la vitesse réelle (pas de gravité)
    rocketRef.current.position.y += velocity.y;

    // Synchronisation de la vitesse affichée
    setSpeed(currentSpeed);
    
    // Suivi de la caméra
    const rocketPos = rocketRef.current.position;
    gsap.to(cameraRef.current.position, {
      x: rocketPos.x,
      y: rocketPos.y + 30,
      z: rocketPos.z + 50,
      duration: 0.5,
      ease: "power2.out",
    });
    cameraRef.current.lookAt(rocketPos);

    // Détection d'atterrissage ou crash
    if (rocketPos.y <= 0) {
      const finalSpeed = currentSpeed; // Capture la vitesse au moment de l'atterrissage
      if (finalSpeed > 30) {
        console.log("Crash ! Vitesse trop élevée : ", finalSpeed, "km/h");
        setGameOver(true);
        setLanded(false);
      } else {
        console.log("Atterrissage réussi ! Vitesse : ", finalSpeed, "km/h");
        setGameOver(true);
        setLanded(true);
      }
      setVelocity({ x: 0, y: 0, z: 0 });
      rocketRef.current.position.y = 0;
      setGameOverLocal(true);
    }
    
    // Détecter si la vitesse est exactement 30 km/h pour afficher la popup
    // sans arrêter l'animation
    if (currentSpeed === 30 && !successDetected) {
      console.log("Vitesse parfaite de 30 km/h atteinte !");
      setSuccessDetected(true);
      setLanded(true);
      setGameOver(true);
      
      // On ne modifie pas gameOverLocal pour laisser l'animation continuer
      // On ne modifie pas non plus velocity pour que la fusée continue de descendre
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 180, 200]} // Ajusté pour y=150
        fov={75}
        far={10000}
      />
      <SceneObject
        modelPath="/assets/models/mars/landscape.glb"
        position={[0, -10, 0]}
        scale={200}
      />
      <SceneObject
        modelPath="/assets/models/lune/decor.glb"
        position={[0,0,0]}
        scale={500}
      />

      <group ref={rocketRef} position={[0, 150, 0]}> {/* Départ à y=150 */}
        <SceneObject
          modelPath={vehicle || "/assets/models/vehicles/rocket.glb"}
          position={[0, 8.5, 0]}
          rotation={[0, -1.6, 0]}
          scale={20}
        />
      </group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} />
      <directionalLight position={[-10, 10, -10]} intensity={0.8} color="#aabbff" />
      <pointLight position={[0, 5, 0]} intensity={1.2} distance={50} color="#ffffff" />
      <spotLight
        position={[5, 20, 15]}
        angle={0.6}
        penumbra={0.2}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
};