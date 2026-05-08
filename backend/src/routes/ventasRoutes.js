const express = require('express');
const router = express.Router();
const { registrarVenta, obtenerReporteDetallado} = require('../controllers/ventasController');

router.get('/reporte', obtenerReporteDetallado);
router.post('/', registrarVenta); // <-- Esta es la nueva ruta

module.exports = router;