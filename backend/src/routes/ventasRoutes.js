const express = require('express');
const router = express.Router();
const { registrarVenta, obtenerReporteDetallado} = require('../controllers/ventasController');

router.get('/reporte', obtenerReporteDetallado);
router.post('/', registrarVenta); 

module.exports = router;