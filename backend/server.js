import app from './app.js';
import { appConfig } from './src/config/appConfig.js';
import { setupTelemetry } from './src/config/telemetry.js';
import { getDbPool } from './src/config/database.js';
import { logger } from './src/utils/logger.js';

// Initialize Azure Application Insights
setupTelemetry();

// Attempt Azure SQL DB connection pool initialization
getDbPool().catch(err => {
  logger.warn(`[Server] Azure SQL pool deferred: ${err.message}`);
});

const server = app.listen(appConfig.port, () => {
  logger.info(`🚀 [CampusTrace Backend] Listening on port ${appConfig.port} (URL: http://localhost:${appConfig.port}/api)`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    logger.info('HTTP server closed.');
  });
});