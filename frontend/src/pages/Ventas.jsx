import { useState, useEffect } from 'react';
import api from '../api/api';
import '../App.css';

export default function Ventas() {
    const [productosDB, setProductosDB] = useState([]);
    const [cliente, setCliente] = useState('Cliente General');
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [mensaje, setMensaje] = useState('');
    const [ventaRealizada, setVentaRealizada] = useState(null);
    const [mostrarBoleta, setMostrarBoleta] = useState(false);

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
            const producto = productosDB.find(p => p.id === parseInt(productoSeleccionado));
            setMensaje(`✅ ${res.data.mensaje}. Total: S/. ${res.data.total}`);
            setVentaRealizada({
                cliente,
                producto: producto?.nombre || 'Producto',
                cantidad: parseInt(cantidad),
                precioUnitario: producto?.precio_venta || 0,
                total: res.data.total,
                fecha: new Date().toLocaleString()
            });
            setMostrarBoleta(true);
            setProductoSeleccionado('');
            setCantidad(1);
        } catch (error) {
            console.error(error);
            setMensaje('❌ Error: ' + (error.response?.data?.error || 'Revisa que los campos coincidan con tu BD'));
        }
    };

    return (
        <div className="card ventas-card">
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

                <button type="submit" className="btn btn-success">
                    Confirmar Venta
                </button>
            </form>

            {mensaje && <p className="mensaje-status">{mensaje}</p>}

            <button
                type="button"
                className={`btn btn-primary ${ventaRealizada ? '' : 'btn-disabled'}`}
                onClick={() => setMostrarBoleta(true)}
                disabled={!ventaRealizada}
            >
                Generar Boleta
            </button>

            {mostrarBoleta && ventaRealizada && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Boleta de Venta</h2>
                        <div className="modal-details">
                            <p><strong>Cliente:</strong> {ventaRealizada.cliente}</p>
                            <p><strong>Fecha:</strong> {ventaRealizada.fecha}</p>
                            <p><strong>Producto:</strong> {ventaRealizada.producto}</p>
                            <p><strong>Cantidad:</strong> {ventaRealizada.cantidad}</p>
                            <p><strong>Precio unitario:</strong> S/. {ventaRealizada.precioUnitario}</p>
                            <p className="detalle-total">Total a pagar: S/. {ventaRealizada.total}</p>
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn btn-primary btn-inline" onClick={() => window.print()}>
                                Imprimir
                            </button>
                            <button type="button" className="btn btn-muted btn-inline" onClick={() => setMostrarBoleta(false)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="button-row">
                <button type="button" className="btn btn-secondary btn-inline" onClick={() => window.location.href = '/alertas'}>
                    Ver Alertas de Stock
                </button>
                <button type="button" className="btn btn-info btn-inline" onClick={() => window.location.href = '/reportes'}>
                    Ver Reportes
                </button>
            </div>
        </div>
    );
}