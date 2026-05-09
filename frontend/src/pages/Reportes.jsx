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
        <div className="card reportes-card">
            <h3>📊 Historial Detallado de Ventas</h3>
            
            {cargando ? (
                <p>Cargando datos...</p>
            ) : (
                <div className="table-container">
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
                                        <td className="text-center">{f.cantidad}</td>
                                        <td className="font-bold">S/. {f.subtotal}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No hay ventas registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="button-row">
                <button type="button" className="btn btn-primary btn-inline" onClick={() => window.location.href = '/ventas'}>
                    Nueva Venta
                </button>
                <button type="button" className="btn btn-secondary btn-inline" onClick={() => window.location.href = '/alertas'}>
                    Ver Alertas
                </button>
            </div>
        </div>
    );
}