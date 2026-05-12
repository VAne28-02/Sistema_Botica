const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/productos', require('./routes/productosRoutes'));
app.use('/api/categorias', require('./routes/categoriasRoutes'));
app.use('/api/ventas', require('./routes/ventasRoutes'));


const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Botica Nova Salud corriendo en puerto ${PORT}`);
});