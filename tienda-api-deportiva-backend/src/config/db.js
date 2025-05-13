// src/config/db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const dbPath = path.join(__dirname, '../../data', 'tienda_deportiva.db');

// 1. Define la instancia de Sequelize INMEDIATAMENTE y expórtala
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

// 2. La función para conectar y sincronizar los modelos
const connectDB = async () => {
  try {
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // 3. Importa los modelos *dentro* de connectDB, después de que sequelize esté definido
    //    Esto asegura que sequelize está disponible cuando los modelos lo requieren
    const User = require('../models/User');
    const Product = require('../models/Product');

    // 4. Sincroniza todos los modelos (creará/actualizará las tablas)
    await sequelize.sync({ alter: true });
    console.log('Tablas sincronizadas con la base de datos.');

    // 5. Añade datos de ejemplo solo si las tablas están vacías (opcional)
    if (await User.count() === 0) {
        console.log("Añadiendo usuario administrador de ejemplo...");
        await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "password123", // Esta contraseña se hasheará automáticamente
            role: "admin"
        });
        console.log("Usuario administrador añadido.");
    }

    if (await Product.count() === 0) {
        console.log("Añadiendo datos de ejemplo de productos...");
        await Product.bulkCreate([
            { name: "Zapatillas Running Ultra", description: "Zapatillas ligeras y cómodas para larga distancia", price: 89.99, category: "Calzado", stock: 50 },
            { name: "Camiseta Deportiva CoolDry", description: "Camiseta transpirable de secado rápido", price: 25.50, category: "Ropa", stock: 100 },
            { name: "Balón de Fútbol Profesional", description: "Balón oficial talla 5 para césped natural", price: 35.00, category: "Accesorios", stock: 30 }
        ]);
        console.log("Datos de ejemplo de productos añadidos.");
    }

  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB }; // Exporta tanto la instancia de sequelize como la función de conexión