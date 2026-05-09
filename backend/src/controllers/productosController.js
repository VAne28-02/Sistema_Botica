const pool = require('../config/db');

// 1. Función para obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.*, c.nombre AS categoria_nombre
             FROM productos p
             LEFT JOIN categorias c ON p.categoria_id = c.id
             ORDER BY p.nombre ASC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('ERROR AL OBTENER:', err.message);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// 2. Función para obtener producto por id
const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('ERROR AL OBTENER PRODUCTO:', err.message);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// 3. Función para crear producto
const crearProducto = async (req, res) => {
    const { categoria_id, nombre, descripcion, precio_venta, stock_actual, stock_minimo } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO productos (categoria_id, nombre, descripcion, precio_venta, stock_actual, stock_minimo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [categoria_id, nombre, descripcion, precio_venta, stock_actual, stock_minimo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('ERROR AL CREAR:', err.message);
        res.status(500).json({ error: 'Error al registrar el producto' });
    }
};

// 4. Función para actualizar producto
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { categoria_id, nombre, descripcion, precio_venta, stock_actual, stock_minimo } = req.body;
    try {
        const result = await pool.query(
            'UPDATE productos SET categoria_id = $1, nombre = $2, descripcion = $3, precio_venta = $4, stock_actual = $5, stock_minimo = $6 WHERE id = $7 RETURNING *',
            [categoria_id, nombre, descripcion, precio_venta, stock_actual, stock_minimo, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('ERROR AL ACTUALIZAR:', err.message);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// 5. Función para eliminar producto
const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (err) {
        console.error('ERROR AL ELIMINAR:', err.message);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

const obtenerAlertas = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, nombre, stock_actual, stock_minimo FROM productos WHERE stock_actual <= stock_minimo'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('ERROR AL OBTENER ALERTAS:', err.message);
        res.status(500).json({ error: 'Error al obtener alertas' });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerAlertas
};