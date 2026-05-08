import { useState, useEffect } from 'react';
import api from '../api/api';
import '../App.css';

export default function Ventas() {
    const [productosDB, setProductosDB] = useState([]);
    const [cliente, setCliente] = useState('Cliente General');
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const traerProductos = async () => {
            try {
                const { data } = await api.get('/productos');
                setProductosDB(data);
            } catch (error) {
                console.error("Error al cargar productos", error);
            }
        };
        traerProductos();
    }, []);

    const realizarVenta = async (e) => {
        e.preventDefault();
        
        // ESTRUCTURA QUE PIDE TU CONTROLLER:
        const datosVenta = {
            cliente_nombre: cliente,
            productos: [
                { 
                    producto_id: parseInt(productoSeleccionado), 
                    cantidad: parseInt(cantidad) 
                }
            ]
        };

        try {
            const res = await api.post('/ventas', datosVenta);
            setMensaje(`✅ ${res.data.mensaje}. Total: S/. ${res.data.total}`);
            setProductoSeleccionado('');
            setCantidad(1);
        } catch (error) {
            console.error(error);
            setMensaje('❌ Error: ' + (error.response?.data?.error || 'Revisa que los campos coincidan con tu BD'));
        }
    };

    return (
        <div className="card" style={{ maxWidth: '500px' }}>
            <h3>Nueva Venta - Nova Salud</h3>
            <form onSubmit={realizarVenta}>
                <label>Nombre del Cliente:</label>
                <input 
                    type="text" 
                    value={cliente} 
                    onChange={(e) => setCliente(e.target.value)} 
                    placeholder="Ej: Vanesa Macedo"
                />

                <label>Seleccionar Producto:</label>
                <select 
                    value={productoSeleccionado} 
                    onChange={(e) => setProductoSeleccionado(e.target.value)}
                    required
                >
                    <option value="">-- Seleccione --</option>
                    {productosDB.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.nombre} (S/. {p.precio_venta})
                        </option>
                    ))}
                </select>

                <label>Cantidad:</label>
                <input 
                    type="number" 
                    min="1" 
                    value={cantidad} 
                    onChange={(e) => setCantidad(e.target.value)} 
                />

                <button type="submit" style={{ backgroundColor: 'var(--verde-exito)', marginTop: '10px' }}>
                    Confirmar Venta
                </button>
            </form>

            {mensaje && <p className="mensaje-status">{mensaje}</p>}

            <button onClick={() => window.location.href = '/alertas'} style={{ marginTop: '10px', backgroundColor: '#95a5a6' }}>
                Ver Alertas de Stock
            </button>
            <button onClick={() => window.location.href = '/reportes'} style={{ marginTop: '10px', backgroundColor: '#8e44ad' }}>
                Ver Reportes
            </button>
        </div>
    );
}