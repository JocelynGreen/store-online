// src/controllers/userControllers/index.js
const User = require('../../models/User');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken

// Función para generar un token JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1h', // El token expirará en 1 hora
  });
};

// 1. POST /users/register - Registrar un nuevo usuario
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación básica (puedes añadir más validación con Joi/Yup después)
    if (!name || !email || !password) {
      return errorResponse(res, 'Faltan campos requeridos: nombre, email, contraseña', 400);
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return errorResponse(res, 'El email ya está registrado', 400);
    }

    const newUser = await User.create({ name, email, password });

    // Genera un token JWT para el usuario recién registrado
    const token = generateToken(newUser.id, newUser.role);

    successResponse(res, 'Usuario registrado correctamente', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: token // Devuelve el token al usuario
    }, 201); // 201 Created

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    errorResponse(res, 'Error al registrar usuario', 500, error.message);
  }
};

// 2. POST /users/login - Iniciar sesión de usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Faltan campos requeridos: email, contraseña', 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 'Credenciales inválidas', 401); // 401 Unauthorized
    }

    // Compara la contraseña proporcionada con la hasheada en la DB
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Credenciales inválidas', 401);
    }

    // Genera un token JWT para el usuario autenticado
    const token = generateToken(user.id, user.role);

    successResponse(res, 'Inicio de sesión exitoso', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token // Devuelve el token al usuario
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    errorResponse(res, 'Error al iniciar sesión', 500, error.message);
  }
};

// 3. GET /users/profile - Obtener perfil del usuario autenticado
const getUserProfile = async (req, res) => {
  // req.user es añadido por el middleware de autenticación
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } // Excluir la contraseña
    });

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    successResponse(res, 'Perfil de usuario obtenido correctamente', user);
  } catch (error) {
    console.error('Error al obtener perfil del usuario:', error);
    errorResponse(res, 'Error al obtener perfil del usuario', 500, error.message);
  }
};

// 4. PUT /users/profile - Actualizar perfil del usuario autenticado
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    // Actualiza solo los campos que se enviaron
    user.name = name || user.name;
    user.email = email || user.email;
    // La contraseña se hashea automáticamente si se cambia gracias al hook en el modelo
    if (password) {
      user.password = password;
    }

    await user.save(); // Usa save() para que el hook beforeUpdate se active

    successResponse(res, 'Perfil de usuario actualizado correctamente', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error('Error al actualizar perfil del usuario:', error);
    errorResponse(res, 'Error al actualizar perfil del usuario', 500, error.message);
  }
};

// 5. DELETE /users/profile - Eliminar cuenta de usuario autenticado
const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    await user.destroy();
    successResponse(res, 'Cuenta eliminada con éxito', {}, 204); // 204 No Content

  } catch (error) {
    console.error('Error al eliminar cuenta del usuario:', error);
    errorResponse(res, 'Error al eliminar cuenta del usuario', 500, error.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};