const pool = require('../config/db');

const obtenerCategorias = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categorias ORDER BY nombre ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("ERROR AL OBTENER CATEGORÍAS:", err.message);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};

const crearCategoria = async (req, res) => {
    const { nombre } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO categorias (nombre) VALUES ($1) RETURNING *',
            [nombre]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("ERROR AL CREAR CATEGORÍA:", err.message);
        res.status(500).json({ error: 'Error al registrar la categoría' });
    }
};

module.exports = {
    obtenerCategorias,
    crearCategoria
};