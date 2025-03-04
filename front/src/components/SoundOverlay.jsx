// src/components/SoundOverlay.jsx
import { useSound } from "../context/SoundContext";

const SoundOverlay = () => {
  const { isMuted, toggleMute } = useSound();

  return (
    <div className="sound-overlay">
      <button onClick={toggleMute}>{isMuted ? "🔇 Unmute" : "🔊 Mute"}</button>
    </div>
  );
};

export default SoundOverlay;
