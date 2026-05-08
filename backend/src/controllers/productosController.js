const pool = require('../config/db');

// 1. Función para obtener
const obtenerProductos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos ORDER BY nombre ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("ERROR AL OBTENER:", err.message);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// 2. Función para crear (ESTA ES LA QUE TE ESTÁ DANDO ERROR AHORA)
const crearProducto = async (req, res) => {
    const { categoria_id, nombre, descripcion, precio_venta, stock_actual, stock_minimo } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO productos (categoria_id, nombre, descripcion, precio_venta, stock_actual, stock_minimo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [categoria_id, nombre, descripcion, precio_venta, stock_actual, stock_minimo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("ERROR AL CREAR:", err.message);
        res.status(500).json({ error: 'Error al registrar el producto' });
    }
};
const obtenerAlertas = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT nombre, stock_actual, stock_minimo FROM productos WHERE stock_actual <= stock_minimo'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener alertas' });
    }
};

// IMPORTANTE: Asegúrate de que los dos nombres estén aquí adentro
module.exports = { 
    obtenerProductos, 
    crearProducto, obtenerAlertas 
};