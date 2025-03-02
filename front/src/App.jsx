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
import Vehicles from "./components/Vehicles";
import Shop from "./components/Shop";

import Introduction from "./components/Introduction";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Introduction" element={<Introduction />} />
        <Route path="/terre" element={<Terre />} />
        <Route path="/scene2" element={<Scene2 />} />
        <Route path="/scene3" element={<Scene3 />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
