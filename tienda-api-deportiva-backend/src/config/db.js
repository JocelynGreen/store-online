const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const dbPath = path.join(__dirname, '../../data', 'tienda_deportiva.db'); // La carpeta 'data' estará en la raíz del proyecto

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

const connectDB = async () => {
  try {
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    await sequelize.sync({ alter: true });
    console.log('Tablas sincronizadas con la base de datos.');

    const Product = require('../models/Product'); // Ruta corregida a minúsculas
    if (await Product.count() === 0) {
        console.log("Añadiendo datos de ejemplo...");
        await Product.bulkCreate([
            { name: "Zapatillas Running Ultra", description: "Zapatillas ligeras y cómodas para larga distancia", price: 89.99, category: "Calzado", stock: 50 },
            { name: "Camiseta Deportiva CoolDry", description: "Camiseta transpirable de secado rápido", price: 25.50, category: "Ropa", stock: 100 },
            { name: "Balón de Fútbol Profesional", description: "Balón oficial talla 5 para césped natural", price: 35.00, category: "Accesorios", stock: 30 },
            { name: "Pantalón Corto TechFit", description: "Pantalón corto con tecnología de compresión", price: 40.00, category: "Ropa", stock: 75 },
            { name: "Raqueta de Tenis Avanzada", description: "Raqueta de alta gama para jugadores experimentados", price: 150.00, category: "Accesorios", stock: 20 }
        ]);
        console.log("Datos de ejemplo añadidos.");
    }

  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };