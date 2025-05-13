const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./src/config/db'); // Ruta corregida a minúsculas
const productRoutes = require('./src/routes/productRoutes'); // Ruta corregida a minúsculas
const { requestLogger } = require('./src/middlewares/requestLogger'); // Ruta corregida a minúsculas
const errorHandler = require('./src/middlewares/errorHandler'); // Ruta corregida a minúsculas
const cors = require('cors');

dotenv.config();

const app = express();

// --- Middlewares Globales ---
app.use(express.json());
app.use(cors());
app.use(requestLogger);

// --- Rutas de la API ---
app.use('/products', productRoutes);

// Ruta de prueba para la raíz
app.get('/', (req, res) => {
  res.send('¡API de Tienda Deportiva funcionando! Visita /products para ver los productos.');
});

// --- Middleware de Manejo de Errores (DEBE IR DESPUÉS DE TODAS LAS RUTAS) ---
app.use(errorHandler);

// Conecta a la base de datos (se ejecuta al iniciar la app)
connectDB();

module.exports = app;