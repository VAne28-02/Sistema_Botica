import { useState } from 'react';
import api from '../api/api';
import '../App.css';

export default function AgregarCategoria() {
    const [categoria, setCategoria] = useState({
        nombre: ''
    });
    const [mensaje, setMensaje] = useState('');

    const manejarCambio = (e) => {
        setCategoria({ ...categoria, [e.target.name]: e.target.value });
    };

    const guardarCategoria = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categorias', categoria);
            setMensaje('Categoría agregada correctamente.');
            
            setCategoria({ nombre: '' });
        } catch (error) {
            setMensaje('Error: ' + (error.response?.data?.error || 'No se pudo guardar'));
        }
    };

    return (
        <div className="card categoria-card">
            <h3>Registro de Nueva Categoría</h3>
            <form onSubmit={guardarCategoria}>
                <label>Nombre de la Categoría:</label>
                <input
                    type="text"
                    name="nombre"
                    value={categoria.nombre}
                    onChange={manejarCambio}
                    placeholder="Ej. Antibiótico"
                    required
                />

                <button type="submit" className="btn btn-primary">
                    Guardar Categoría
                </button>
            </form>

            {mensaje && <p className="mensaje-status">{mensaje}</p>}

            <div className="button-row">
                <button type="button" className="btn btn-secondary btn-inline" onClick={() => window.location.href = '/productos'}>Productos</button>
                <button type="button" className="btn btn-secondary btn-inline" onClick={() => window.location.href = '/alertas'}>Panel Alertas</button>
            </div>
        </div>
    );
}
