import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Accueil from './game/page/Accueil';
import Scene2 from './game/page/Atmosphere';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/scene2" element={<Scene2 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;