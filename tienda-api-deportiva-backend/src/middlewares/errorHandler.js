const { errorResponse } = require('../Utils/responseHandler');
const { logger } = require('./requestLogger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Error en la solicitud: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  if (err.name === 'SequelizeUniqueConstraintError') {
    return errorResponse(res, 'El registro ya existe (violación de unicidad).', 409);
  }

  errorResponse(res, message, statusCode);
};

module.exports = errorHandler;