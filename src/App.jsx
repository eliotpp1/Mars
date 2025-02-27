import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Accueil from './game/page/Terre';
import Scene2 from './game/page/Atmosphere';
import Scene3 from './game/page/Space';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/scene2" element={<Scene2 />} />
        <Route path="/scene3" element={<Scene3 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;