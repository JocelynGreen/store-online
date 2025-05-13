// src/routes/userRoutes.js
const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} = require('../controllers/userControllers'); // Ruta a tu controlador de usuarios

const { protect, authorizeAdmin } = require('../middlewares/authMiddleware'); // Importa el middleware de autenticación

const router = express.Router();

router.post('/register', registerUser); // Endpoint público para registrarse
router.post('/login', loginUser);       // Endpoint público para iniciar sesión

// Rutas protegidas: requieren un token JWT válido
router.route('/profile')
  .get(protect, getUserProfile)      // Obtener perfil del usuario autenticado
  .put(protect, updateUserProfile)   // Actualizar perfil del usuario autenticado
  .delete(protect, deleteUserProfile); // Eliminar perfil del usuario autenticado

module.exports = router;