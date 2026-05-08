const express = require('express');
const router = express.Router();

// EL ERROR ESTABA AQUÍ: Tenías que agregar 'obtenerAlertas' dentro de las llaves
const { 
    obtenerProductos, 
    crearProducto, 
    obtenerAlertas 
} = require('../controllers/productosController');

// 1. Ruta de alertas (Siempre pon las específicas arriba)
router.get('/alertas', obtenerAlertas);

// 2. Rutas generales
router.get('/', obtenerProductos);
router.post('/', crearProducto); 

module.exports = router;