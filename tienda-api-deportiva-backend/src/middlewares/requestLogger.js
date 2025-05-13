const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' }),
  ],
});

const requestLogger = (req, res, next) => {
  logger.info(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    body: req.body,
    query: req.query,
    params: req.params
  });
  next();
};

module.exports = { requestLogger, logger };