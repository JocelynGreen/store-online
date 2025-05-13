const request = require('supertest');
const app = require('../../app'); // app.js está en la raíz
const { sequelize } = require('../config/db');
const Product = require('../models/Product');

beforeEach(async () => {
  await sequelize.sync({ force: true });
  await Product.bulkCreate([
      { name: "Pelota de Baloncesto", description: "Pelota de baloncesto talla 7", price: 29.99, category: "Accesorios", stock: 10 },
      { name: "Zapatillas de Senderismo", description: "Botas impermeables para montaña", price: 110.00, category: "Calzado", stock: 5 }
  ]);
});

afterAll(async () => {
  await sequelize.close();
});

describe('Product API', () => {
  let productId;

  it('should create a new product', async () => {
    const newProduct = {
      name: 'Guantes de Ciclismo',
      description: 'Guantes acolchados para ciclismo de carretera',
      price: 22.50,
      category: 'Accesorios',
      stock: 50
    };

    const res = await request(app)
      .post('/products')
      .send(newProduct)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Producto creado correctamente');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toBe(newProduct.name);
    productId = res.body.data.id;
  });

  it('should get all products', async () => {
    const res = await request(app)
      .get('/products')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('should get a product by ID', async () => {
    const res = await request(app)
      .get(`/products/${productId}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id', productId);
    expect(res.body.data.name).toBe('Guantes de Ciclismo');
  });

  it('should update a product', async () => {
    const updatedData = { price: 25.00, stock: 45 };
    const res = await request(app)
      .put(`/products/${productId}`)
      .send(updatedData)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Producto actualizado correctamente');
    expect(res.body.data.price).toBe(updatedData.price);
    expect(res.body.data.stock).toBe(updatedData.stock);
  });

  it('should delete a product', async () => {
    const res = await request(app)
      .delete(`/products/${productId}`)
      .expect(204);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Producto eliminado con éxito');

    const checkRes = await request(app)
      .get(`/products/${productId}`)
      .expect(404);
    expect(checkRes.body.success).toBe(false);
  });
});