// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importa el modelo User
const { errorResponse } = require('../utils/responseHandler'); // Para respuestas de error estandarizadas

const protect = async (req, res, next) => {
  let token;

  // 1. Verificar si hay un token en los headers de autorización
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener el token del header 'Bearer tokenDeEjemplo'
      token = req.headers.authorization.split(' ')[1];

      // 2. Verificar el token
      // Verificar y decodificar el token usando la clave secreta JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Adjuntar el usuario a la solicitud (req.user)
      // Buscar el usuario por el ID decodificado (excluir la contraseña)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return errorResponse(res, 'Usuario no encontrado para este token', 401); // Unauthorized
      }

      next(); // Pasar al siguiente middleware o ruta
    } catch (error) {
      console.error('Error en la verificación del token:', error.message);
      return errorResponse(res, 'Token inválido o expirado', 401); // Unauthorized
    }
  }

  if (!token) {
    return errorResponse(res, 'No autorizado, no hay token', 401); // Unauthorized
  }
};

// Middleware para verificar si el usuario tiene rol de administrador
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Si es admin, permite el acceso
    } else {
        return errorResponse(res, 'No autorizado, se requiere rol de administrador', 403); // Forbidden
    }
};


module.exports = { protect, authorizeAdmin };