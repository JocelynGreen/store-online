const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./src/config/db'); // Ruta a tu archivo db.js
const productRoutes = require('./src/routes/productRoutes'); // Rutas de productos
const userRoutes = require('./src/routes/userRoutes'); // <-- NUEVA LÍNEA: Rutas de usuario
const { requestLogger } = require('./src/middlewares/requestLogger'); // Middleware de logging
const errorHandler = require('./src/middlewares/errorHandler'); // Middleware de manejo de errores
const cors = require('cors'); // Middleware CORS

dotenv.config(); // Carga las variables de entorno desde .env

const app = express();

// --- Middlewares Globales ---
// Permite a la aplicación parsear JSON del cuerpo de las peticiones
app.use(express.json()); 
// Habilita CORS para todas las solicitudes (permite la comunicación con el frontend)
app.use(cors()); 
// Usa tu middleware custom para registrar cada petición entrante
app.use(requestLogger);

// --- Rutas de la API ---
// Todas las peticiones a /products serán manejadas por productRoutes
app.use('/products', productRoutes); 
// <-- NUEVA LÍNEA: Todas las peticiones a /users serán manejadas por userRoutes
app.use('/users', userRoutes); 

// Ruta de prueba para la raíz de la API
app.get('/', (req, res) => {
  res.send('¡API de Tienda Deportiva funcionando! Visita /products para productos y /users para gestión de usuarios.');
});

// --- Middleware de Manejo de Errores ---
// Este middleware debe ser el ÚLTIMO en la cadena, después de todas las rutas y otros middlewares
app.use(errorHandler);

// Conecta a la base de datos al iniciar la aplicación
connectDB();

module.exports = app; // Exporta la instancia de la aplicación para que server.js la pueda usar