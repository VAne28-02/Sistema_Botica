import { useEffect, useState } from 'react';
import api from '../api/api';
import '../App.css';

export default function Alertas() {
  const [productosBajos, setProductosBajos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  const obtenerAlertas = async () => {
    try {
      const { data } = await api.get('/productos/alertas');
      setProductosBajos(data);
      setMensaje('');
    } catch (error) {
      console.error("Error al traer alertas", error);
      setMensaje('❌ No se pudo cargar las alertas.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerAlertas();
  }, []);

  const actualizarProducto = async (producto) => {
    const nuevoStock = window.prompt('Ingrese el nuevo stock actual para este producto:', producto.stock_actual);
    if (nuevoStock === null) return;
    const stockActualizado = parseInt(nuevoStock, 10);
    if (Number.isNaN(stockActualizado) || stockActualizado < 0) {
      setMensaje('❌ El stock debe ser un número válido mayor o igual a 0.');
      return;
    }

    try {
      const { data } = await api.get(`/productos/${producto.id}`);
      const payload = {
        categoria_id: data.categoria_id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio_venta: data.precio_venta,
        stock_actual: stockActualizado,
        stock_minimo: data.stock_minimo
      };
      await api.put(`/productos/${producto.id}`, payload);
      setMensaje('✅ Producto actualizado correctamente.');
      await obtenerAlertas();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setMensaje('❌ No se pudo actualizar el producto.');
    }
  };

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
      {mensaje && <p style={{ marginTop: '10px' }}>{mensaje}</p>}
      {cargando ? (
        <p>Consultando inventario...</p>
      ) : productosBajos.length === 0 ? (
        <p style={{ color: 'var(--verde-exito)' }}>✅ Todo el stock está en niveles óptimos.</p>
      ) : (
        <div style={{ textAlign: 'left' }}>
          <p>Los siguientes productos están por debajo del stock mínimo:</p>
          {productosBajos.map(p => (
            <div key={p.id} className="alerta-item" style={{ alignItems: 'center' }}>
              <div>
                <strong>{p.nombre}</strong>
                <div className="stock-bajo">
                  Quedan {p.stock_actual} (Mínimo: {p.stock_minimo})
                </div>
              </div>
              <button
                type="button"
                onClick={() => actualizarProducto(p)}
                style={{
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  minWidth: '100px'
                }}
              >
                Actualizar
              </button>
            </div>
          ))}
        </div>
      )}
      
      <button 
        onClick={() => window.location.href = '/productos'}
        style={{ marginTop: '20px', backgroundColor: '#27ae60' }}
      >
        Gestionar Productos
      </button>
      <button 
        onClick={() => window.location.href = '/agregar-categoria'}
        style={{ marginTop: '10px', backgroundColor: '#e74c3c' }}
      >
        Nueva Categoría
      </button>
      <button 
        onClick={() => window.location.href = '/ventas'} 
        style={{ marginTop: '10px', backgroundColor: 'var(--azul-principal)' }}
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