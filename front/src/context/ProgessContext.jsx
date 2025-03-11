import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Créer le contexte
const ProgressContext = createContext();

// Fournir le contexte (Provider)
export const ProgressProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();

  // Déterminer l'étape actuelle en fonction de l'URL
  const getCurrentStep = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes("terre")) return 1;
    if (path.includes("ciel")) return 2;
    if (path.includes("espace")) return 3;
    if (path.includes("lune")) return 4;
    if (path.includes("mars")) return 5;
    return 1; // Par défaut
  };

  // Mettre à jour currentStep lorsque l'URL change
  useEffect(() => {
    setCurrentStep(getCurrentStep());
  }, [location]);

  return (
    <ProgressContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </ProgressContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useProgress = () => useContext(ProgressContext);
