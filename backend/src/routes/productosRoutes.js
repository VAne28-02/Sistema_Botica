const express = require('express');
const router = express.Router();


const { 
    obtenerProductos, 
    obtenerProductoPorId, 
    crearProducto, 
    actualizarProducto, 
    eliminarProducto, 
    obtenerAlertas 
} = require('../controllers/productosController');

router.get('/alertas', obtenerAlertas);

router.get('/:id', obtenerProductoPorId);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);

router.get('/', obtenerProductos);
router.post('/', crearProducto);

module.exports = router;