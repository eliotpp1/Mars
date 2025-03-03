
import { Html } from '@react-three/drei';
import './../assets/styles/Game.css'; // Assurez-vous d'importer le fichier CSS

const GameDialogue = ({ message, onClose }) => {
  return (
    <Html fullscreen>
      <div className="introduction-container">
        <p>{message}</p>
        <button onClick={onClose} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '1.5rem', cursor: 'pointer' }}>
          Fermer
        </button>
      </div>
    </Html>
  );
};

export default GameDialogue;
