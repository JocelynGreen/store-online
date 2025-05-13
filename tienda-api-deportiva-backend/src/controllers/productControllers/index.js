const Product = require('../../models/Product');
const { successResponse, errorResponse } = require('../../utils/responseHandler');

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    successResponse(res, 'Productos obtenidos correctamente', products);
  } catch (error) {
    errorResponse(res, 'Error al obtener productos', 500, error.message);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return errorResponse(res, 'Producto no encontrado', 404);
    }
    successResponse(res, 'Producto obtenido correctamente', product);
  } catch (error) {
    errorResponse(res, 'Error al obtener producto', 500, error.message);
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    if (!name || price === undefined || stock === undefined) {
      return errorResponse(res, 'Faltan campos requeridos: nombre, precio, stock', 400);
    }
    const newProduct = await Product.create({ name, description, price, category, stock });
    successResponse(res, 'Producto creado correctamente', newProduct, 201);
  } catch (error) {
    errorResponse(res, 'Error al crear producto', 500, error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return errorResponse(res, 'Producto no encontrado', 404);
    }
    await product.update(req.body);
    successResponse(res, 'Producto actualizado correctamente', product);
  } catch (error) {
    errorResponse(res, 'Error al actualizar producto', 500, error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return errorResponse(res, 'Producto no encontrado', 404);
    }
    await product.destroy();
    successResponse(res, 'Producto eliminado con éxito', {}, 204);
  } catch (error) {
    errorResponse(res, 'Error al eliminar producto', 500, error.message);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};