// src/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Ruta a tu archivo db.js
const bcrypt = require('bcryptjs'); // Importa bcryptjs

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true, // El email debe ser único
    validate: {
      isEmail: true, // Valida que sea un formato de email válido
    }
  },
  password: {
    type: DataTypes.STRING(255), // Mayor longitud para almacenar el hash
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'), // Ejemplo de roles: 'user' y 'admin'
    defaultValue: 'user',
    allowNull: false,
  }
}, {
  tableName: 'users', // Nombre de la tabla en la DB
  timestamps: true,
  // Hooks de Sequelize para hashear la contraseña antes de guardar
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user) => {
      // Solo hashear si la contraseña ha sido modificada
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Método para comparar contraseñas
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;