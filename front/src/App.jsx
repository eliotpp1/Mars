// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Terre from "./game/page/Terre";
import Ciel from "./game/page/Ciel";
import Scene3 from "./game/page/Space";
import Lune from "./game/page/Lune";
import Vehicles from "./components/Vehicles";
import Shop from "./components/Shop";
import EndGame from "./components/EndGame";
import { SoundProvider } from "./context/SoundContext"; // Importer le contexte
import SoundOverlay from "./components/SoundOverlay"; // Importer l'overlay

function App() {
  return (
    <SoundProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terre" element={<Terre />} />
          <Route path="/ciel" element={<Ciel />} />
          <Route path="/scene3" element={<Scene3 />} />
          <Route path="/lune" element={<Lune />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/gameover" element={<EndGame />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <SoundOverlay /> {/* Overlay global */}
      </Router>
    </SoundProvider>
  );
}

export default App;