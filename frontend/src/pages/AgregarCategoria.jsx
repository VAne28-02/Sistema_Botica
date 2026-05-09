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
            setMensaje('✅ Categoría agregada correctamente.');
            // Limpiar formulario
            setCategoria({ nombre: '' });
        } catch (error) {
            setMensaje('❌ Error: ' + (error.response?.data?.error || 'No se pudo guardar'));
        }
    };

    return (
        <div className="card" style={{ maxWidth: '500px' }}>
            <h3>📂 Registro de Nueva Categoría</h3>
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

                <button type="submit" style={{ backgroundColor: 'var(--azul-principal)', marginTop: '15px' }}>
                    Guardar Categoría
                </button>
            </form>

            {mensaje && <p className="mensaje-status">{mensaje}</p>}

            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button onClick={() => window.location.href = '/productos'} style={{ backgroundColor: '#95a5a6' }}>Productos</button>
                <button onClick={() => window.location.href = '/alertas'} style={{ backgroundColor: '#95a5a6' }}>Panel Alertas</button>
            </div>
        </div>
    );
}
