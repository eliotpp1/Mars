import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Terre from "./game/page/Terre";
import Scene2 from "./game/page/Atmosphere";
import Scene3 from "./game/page/Space";
import Lune from "./game/page/Lune";
import Game from "./game/page/Game"; // Correction ici
import Vehicles from "./components/Vehicles";
import Shop from "./components/Shop";
import EndGame from "./components/EndGame";
import { SoundProvider } from "./context/SoundContext";
import SoundOverlay from "./components/SoundOverlay";

function App() {
  return (
    <SoundProvider>
      <Router>
        <SoundOverlay /> {/* Correction : Mettre l'overlay avant Routes si nécessaire */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terre" element={<Terre />} />
          <Route path="/scene2" element={<Scene2 />} />
          <Route path="/scene3" element={<Scene3 />} />
          <Route path="/game" element={<Game />} /> {/* Correction ici */}
          <Route path="/lune" element={<Lune />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/gameover" element={<EndGame />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </SoundProvider>
  );
}

export default App;
