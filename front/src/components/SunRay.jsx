import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SunRay = ({ 
  startPosition = [-100, 100, -100], // Position de départ en hauteur
  length = 10000, 
  width = 10, 
  color = '#FFA500', 
  pulsate = false
}) => {
  const rayRef = useRef();
  
  // Direction fixe vers le bas
  const direction = [0, -1, 0];
  
  useEffect(() => {
    if (rayRef.current) {
      // Positionnement du rayon
      // Pour un rayon vertical, on descend de la moitié de la longueur
      rayRef.current.position.set(
        startPosition[0],
        startPosition[1] - length/2, // Le centre du rayon est à mi-chemin
        startPosition[2]
      );
      
      // Pas besoin de rotation spéciale car le cylindre est déjà orienté selon l'axe Y (vertical)
    }
  }, [startPosition, length]);
  
  useFrame((state, delta) => {
    if (pulsate && rayRef.current) {
      const material = rayRef.current.material;
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      rayRef.current.scale.set(scale, 1, scale);
    }
  });
  
  return (
    <mesh ref={rayRef}>
      <cylinderGeometry args={[width/2, width/2, length, 16, 1]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={1.5} 
        transparent 
        opacity={0.7} 
      />
    </mesh>
  );
};