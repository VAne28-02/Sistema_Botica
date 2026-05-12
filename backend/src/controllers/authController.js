const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'El correo admin@botica.com no existe en la base de datos' });
        }

        const usuario = result.rows[0];

        if (password !== usuario.password) {
            return res.status(401).json({ error: 'La contraseña es incorrecta' });
        }

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            process.env.JWT_SECRET || 'llave_secreta_botica',
            { expiresIn: '4h' }
        );

        res.json({
            mensaje: `¡Bienvenida ${usuario.nombre}!`,
            token,
            usuario: {
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (err) {
        console.error("Error en el Login:", err.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { login };