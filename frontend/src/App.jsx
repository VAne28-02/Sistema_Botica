import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Alertas from './pages/Alertas';
import Ventas from './pages/Ventas';
import Reportes from './pages/Reportes'; // <--- Nueva importación
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/ventas" element={<Ventas />} /> {/* <--- Nueva ruta */}
        <Route path="/reportes" element={<Reportes />} /> {/* <--- Nueva ruta */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;