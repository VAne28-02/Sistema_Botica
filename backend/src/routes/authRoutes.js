const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Definimos la sub-ruta /login
router.post('/login', login);

module.exports = router;