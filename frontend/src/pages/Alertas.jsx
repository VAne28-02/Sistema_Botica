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
      setMensaje('No se pudo cargar las alertas.');
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
      setMensaje('Producto actualizado correctamente.');
      await obtenerAlertas();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setMensaje('No se pudo actualizar el producto.');
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="card alertas-card">
      <div className="page-header">
        <h3>Panel de Control - Nova Salud</h3>
        <button type="button" className="btn btn-secondary btn-inline" onClick={cerrarSesion}>Salir</button>
      </div>

      <hr />

      <h4>Alertas de Reposición</h4>
      {mensaje && <p className="mensaje-status">{mensaje}</p>}
      {cargando ? (
        <p>Consultando inventario...</p>
      ) : productosBajos.length === 0 ? (
        <p className="mensaje-status">Todo el stock está en niveles óptimos.</p>
      ) : (
        <div className="page-section">
          <p>Los siguientes productos están por debajo del stock mínimo:</p>
          {productosBajos.map(p => (
            <div key={p.id} className="alerta-item">
              <div>
                <strong>{p.nombre}</strong>
                <div className="stock-bajo">
                  Quedan {p.stock_actual} (Mínimo: {p.stock_minimo})
                </div>
              </div>
              <button
                type="button"
                className="btn btn-success btn-small btn-inline"
                onClick={() => actualizarProducto(p)}
              >
                Actualizar
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="button-row">
        <button type="button" className="btn btn-success btn-inline" onClick={() => window.location.href = '/productos'}>
          Gestionar Productos
        </button>
        <button type="button" className="btn btn-danger btn-inline" onClick={() => window.location.href = '/agregar-categoria'}>
          Nueva Categoría
        </button>
        <button type="button" className="btn btn-primary btn-inline" onClick={() => window.location.href = '/ventas'}>
          Ir a Registrar Venta
        </button>
        <button type="button" className="btn btn-info btn-inline" onClick={() => window.location.href = '/reportes'}>
          Ver Reportes
        </button>
      </div>
    </div>
  );
}