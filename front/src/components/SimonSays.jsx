import { useState, useEffect, useRef } from "react";
import "./../assets/styles/Game.css";

const SimonSays = ({ onWin }) => {
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("");
  const [winCount, setWinCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    generatePattern();
  }, []);

  const generatePattern = () => {
    if (winCount >= 2) {
      setGameOver(true);
      setMessage("🚀 Mission réussie ! Vous avez gagné ! 🌌");
      onWin(); // Notifie le jeu que Simon Says est terminé et réussi
      return;
    }

    const newPattern = Array.from({ length: 3 }, () => Math.floor(Math.random() * 9));
    setPattern(newPattern);
    setUserPattern([]);
    setIsListening(false);
    setMessage("🔭 Regardez bien le motif...");
    playPattern(newPattern);
  };

  const playPattern = (pattern) => {
    let i = 0;
    intervalRef.current = setInterval(() => {
      highlightCell(pattern[i]);
      i++;
      if (i >= pattern.length) {
        clearInterval(intervalRef.current);
        setIsListening(true);
        setMessage("🛰️ Reproduisez le motif !");
      }
    }, 1000);
  };

  const highlightCell = (index) => {
    const cell = document.getElementById(`cell-${index}`);
    if (cell) {
      cell.classList.add("highlight");
      setTimeout(() => {
        cell.classList.remove("highlight");
      }, 500);
    }
  };

  const handleCellClick = (index) => {
    if (!isListening || gameOver) return;

    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);
    highlightCell(index);

    if (newUserPattern.length === pattern.length) {
      setIsListening(false);
      if (arraysAreEqual(newUserPattern, pattern)) {
        setWinCount((prevCount) => prevCount + 1); // Mise à jour correcte de winCount
        setMessage(`✅ Succès ${winCount + 1}/3 ! Nouveau motif...`);
        setTimeout(generatePattern, 1000);
      } else {
        setMessage("⚠️ Faux ! Essayez encore.");
        setTimeout(() => {
          playPattern(pattern);
        }, 1000);
      }
    }
  };

  const arraysAreEqual = (arr1, arr2) => arr1.length === arr2.length && arr1.every((val, i) => val === arr2[i]);

  return (
    <div className="simon-says">
      <h1>🌌 Simon Says Spatiale 🚀</h1>
      <p className="message">{message}</p>
      {!gameOver ? (
        <div className="grid">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              id={`cell-${index}`}
              className="cell"
              onClick={() => handleCellClick(index)}
            />
          ))}
        </div>
      ) : (
        <button onClick={() => window.location.reload()}>🔄 Rejouer</button>
      )}
    </div>
  );
};

export default SimonSays;
