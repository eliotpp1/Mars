import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Stars } from "../../components/Stars";
import { SceneObject } from "../../components/SceneObject";
import { CameraSetup } from "../../components/CameraSetup";
import { useNavigate } from "react-router-dom";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import API_URL from "../../constants/api";
import * as THREE from "three";



export const Scene = ({rocketRef}) => {
    const cameraRef = useRef();
    const [vehicle, setVehicle] = useState(null);

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
  
    return (
      <>
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[0, 50, 80]} // Position initiale
          fov={75}
          far={10000}
        />
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1} // Distance minimale de zoom
          maxDistance={300} // Distance maximale de zoom
          target={[0, 5, 0]} // Point cible
          screenSpacePanning={true}
          zoomSpeed={1.2}
        />
        <SceneObject
          modelPath="/assets/models/lune/decor.glb"
          position={[0, 0, 0]}
          scale={500}
        />
        <SceneObject
          modelPath="/assets/models/mars/landscape.glb"
          position={[0, 0, 0]}
          scale={200}
        />
           <group ref={rocketRef} position={[0, 21, 12]}>
        <SceneObject modelPath={vehicle || "/assets/models/vehicles/rocket.glb"} position={[0, 0, 0]} rotation={[0,-1.6,0]} scale={20} />
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

// Préchargement des modèles
