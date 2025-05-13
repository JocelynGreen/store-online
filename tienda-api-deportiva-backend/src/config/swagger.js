const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Tienda Deportiva',
      version: '1.0.0',
      description: 'API RESTful para la gestión de productos en una tienda deportiva.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'price', 'stock'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID auto-generado del producto',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'Nombre del producto',
              example: 'Zapatillas Running',
            },
            description: {
              type: 'string',
              description: 'Descripción del producto',
              example: 'Zapatillas ligeras para correr',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Precio del producto',
              example: 89.99,
            },
            category: {
              type: 'string',
              description: 'Categoría del producto (ej. Calzado, Ropa)',
              example: 'Calzado',
            },
            stock: {
              type: 'integer',
              description: 'Cantidad en stock',
              example: 50,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación del registro',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Última fecha de actualización del registro',
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../models/*.js'),
    path.join(__dirname, '../controllers/productControllers/*.js')
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;