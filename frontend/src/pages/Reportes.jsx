import { useEffect, useState } from 'react';
import api from '../api/api';
import '../App.css';

export default function Reportes() {
    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarReporte = async () => {
            try {
                const { data } = await api.get('/ventas/reporte');
                setDatos(data);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setCargando(false);
            }
        };
        cargarReporte();
    }, []);

    return (
        <div className="card" style={{ maxWidth: '1000px', width: '95%' }}>
            <h3>📊 Historial Detallado de Ventas</h3>
            
            {cargando ? (
                <p>Cargando datos...</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    {/* IMPORTANTE: Usar la clase que definiste en el CSS */}
                    <table className="tabla-reporte">
                        <thead>
                            <tr>
                                <th>Nro Ticket</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Medicamento</th>
                                <th>Cant.</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datos.length > 0 ? (
                                datos.map((f, i) => (
                                    <tr key={i}>
                                        <td>#{f.ticket_nro}</td>
                                        <td>{new Date(f.fecha_venta).toLocaleString()}</td>
                                        <td>{f.cliente_nombre}</td>
                                        <td>{f.medicamento}</td>
                                        <td style={{ textAlign: 'center' }}>{f.cantidad}</td>
                                        <td style={{ fontWeight: 'bold' }}>S/. {f.subtotal}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No hay ventas registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => window.location.href = '/ventas'}>
                    Nueva Venta
                </button>
                <button onClick={() => window.location.href = '/alertas'} style={{ backgroundColor: '#95a5a6' }}>
                    Ver Alertas
                </button>
            </div>
        </div>
    );
}