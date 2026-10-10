import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.url} - ${statusCode} - ${err.stack || message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}