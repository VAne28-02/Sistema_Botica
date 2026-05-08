import { useEffect, useState } from 'react';
import api from '../api/api';
import '../App.css';

export default function Alertas() {
  const [productosBajos, setProductosBajos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerAlertas = async () => {
      try {
        // Pedimos los productos con poco stock al backend
        const { data } = await api.get('/productos/alertas');
        setProductosBajos(data);
        setCargando(false);
      } catch (error) {
        console.error("Error al traer alertas", error);
        setCargando(false);
      }
    };

    obtenerAlertas();
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>🚀 Panel de Control - Nova Salud</h3>
        <button onClick={cerrarSesion} style={{ width: 'auto', padding: '5px 10px', backgroundColor: '#95a5a6' }}>Salir</button>
      </div>

      <hr />

      <h4>⚠️ Alertas de Reposición</h4>
      
      {cargando ? (
        <p>Consultando inventario...</p>
      ) : productosBajos.length === 0 ? (
        <p style={{ color: 'var(--verde-exito)' }}>✅ Todo el stock está en niveles óptimos.</p>
      ) : (
        <div style={{ textAlign: 'left' }}>
          <p>Los siguientes productos están por debajo del stock mínimo:</p>
          {productosBajos.map(p => (
            <div key={p.id} className="alerta-item">
              <strong>{p.nombre}</strong>
              <span className="stock-bajo">
                Quedan {p.stock} (Mínimo: {p.stock_minimo})
              </span>
            </div>
          ))}
        </div>
      )}
      
      <button 
        onClick={() => window.location.href = '/ventas'} 
        style={{ marginTop: '20px', backgroundColor: 'var(--azul-principal)' }}
      >
        Ir a Registrar Venta
      </button>
      <button 
        onClick={() => window.location.href = '/reportes'} 
        style={{ marginTop: '10px', backgroundColor: '#8e44ad' }}
      >
        Ver Reportes
      </button>
    </div>
  );
}