import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Alertas from './pages/Alertas';
import Ventas from './pages/Ventas';
import Reportes from './pages/Reportes';
import AgregarCategoria from './pages/AgregarCategoria';
import Productos from './pages/Productos';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/agregar-categoria" element={<AgregarCategoria />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;