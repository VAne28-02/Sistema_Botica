import { useState, useEffect } from 'react';
import api from '../api/api';
import '../App.css';

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [producto, setProducto] = useState({
        categoria_id: '',
        nombre: '',
        descripcion: '',
        precio_venta: '',
        stock_actual: '',
        stock_minimo: ''
    });
    const [mensaje, setMensaje] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [{ data: productosData }, { data: categoriasData }] = await Promise.all([
                api.get('/productos'),
                api.get('/categorias')
            ]);
            setProductos(productosData);
            setCategorias(categoriasData);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            setMensaje('❌ No se pudo cargar el inventario.');
        }
    };

    const manejarCambio = (e) => {
        setProducto({ ...producto, [e.target.name]: e.target.value });
    };

    const guardarProducto = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...producto,
                categoria_id: parseInt(producto.categoria_id, 10)
            };

            if (editingId) {
                await api.put(`/productos/${editingId}`, payload);
                setMensaje('✅ Producto actualizado correctamente.');
            } else {
                await api.post('/productos', payload);
                setMensaje('✅ Producto agregado correctamente.');
            }
            setProducto({ categoria_id: '', nombre: '', descripcion: '', precio_venta: '', stock_actual: '', stock_minimo: '' });
            setEditingId(null);
            cargarDatos();
        } catch (error) {
            console.error('Error al guardar producto:', error);
            setMensaje('❌ Error al guardar producto: ' + (error.response?.data?.error || 'Revise los datos.'));
        }
    };

    const editarProducto = (item) => {
        setEditingId(item.id);
        setProducto({
            categoria_id: item.categoria_id || '',
            nombre: item.nombre || '',
            descripcion: item.descripcion || '',
            precio_venta: item.precio_venta || '',
            stock_actual: item.stock_actual || '',
            stock_minimo: item.stock_minimo || ''
        });
        setMensaje('');
    };

    const cancelarEdicion = () => {
        setEditingId(null);
        setProducto({ categoria_id: '', nombre: '', descripcion: '', precio_venta: '', stock_actual: '', stock_minimo: '' });
        setMensaje('');
    };

    const eliminarProducto = async (id) => {
        if (!window.confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;

        try {
            await api.delete(`/productos/${id}`);
            setMensaje('✅ Producto eliminado correctamente.');
            cargarDatos();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            setMensaje('❌ Error al eliminar producto.');
        }
    };

    return (
        <div className="productos-page">
            <div className="productos-header">
                <h3 className="productos-title">📦 Inventario de Productos</h3>
            </div>

            <div className="productos-grid">
                <div className="productos-panel">
                    <h4 className="productos-panel-title">{editingId ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h4>
                    <form className="productos-form" onSubmit={guardarProducto}>
                        <label>Categoría:</label>
                        <select
                            name="categoria_id"
                            value={producto.categoria_id}
                            onChange={manejarCambio}
                            required
                        >
                            <option value="">-- Seleccione categoría --</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>

                        <label>Nombre del Producto:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={producto.nombre}
                            onChange={manejarCambio}
                            placeholder="Ej. Amoxicilina 500mg"
                            required
                        />

                        <label>Descripción:</label>
                        <textarea
                            name="descripcion"
                            value={producto.descripcion}
                            onChange={manejarCambio}
                            placeholder="Formato, dosis o presentación"
                            rows="3"
                        />

                        <div className="productos-form-row">
                            <div>
                                <label>Precio Venta (S/.):</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="precio_venta"
                                    value={producto.precio_venta}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>
                            <div>
                                <label>Stock Actual</label>
                                <input
                                    type="number"
                                    name="stock_actual"
                                    value={producto.stock_actual}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>
                        </div>

                        <label>Stock Mínimo (Para Alertas):</label>
                        <input
                            type="number"
                            name="stock_minimo"
                            value={producto.stock_minimo}
                            onChange={manejarCambio}
                            required
                        />

                        <button type="submit" className="productos-button productos-button-primary">
                            {editingId ? '💾 Actualizar Producto' : '➕ Guardar Producto'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="productos-button productos-button-secondary"
                                onClick={cancelarEdicion}
                            >
                                ❌ Cancelar
                            </button>
                        )}
                    </form>
                    {mensaje && <div className="productos-message">{mensaje}</div>}
                </div>

                <div className="productos-panel">
                    <h4 className="productos-panel-title">📋 Lista de Productos ({productos.length})</h4>
                    <div className="productos-table-wrapper">
                        <table className="tabla-reporte productos-table">
                            <thead>
                                <tr>                                    <th>ID</th>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Stock Mínimo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.length > 0 ? (
                                    productos.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td>{p.nombre}</td>
                                            <td>{p.categoria_nombre || 'Sin categoría'}</td>
                                            <td>S/. {p.precio_venta}</td>
                                            <td>{p.stock_actual}</td>
                                            <td>{p.stock_minimo}</td>
                                            <td className="productos-action-buttons">
                                                <button type="button" className="productos-action-button edit" onClick={() => editarProducto(p)}>
                                                    ✏️ Editar
                                                </button>
                                                <button type="button" className="productos-action-button delete" onClick={() => eliminarProducto(p.id)}>
                                                    🗑️ Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="productos-no-data">No hay productos registrados.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
