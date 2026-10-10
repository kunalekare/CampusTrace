import { Router } from 'express';
import { checkDbHealth } from '../config/database.js';
import { appConfig } from '../config/appConfig.js';

const router = Router();

// General Health Info
router.get('/', async (req, res) => {
  const dbHealth = await checkDbHealth();
  const isHealthy = dbHealth.status === 'healthy';

  res.status(200).json({
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'CampusTrace REST API',
    environment: appConfig.env,
    timestamp: new Date().toISOString(),
    database: {
      status: dbHealth.status,
      adapter: dbHealth.adapter,
      server: dbHealth.server || 'unconfigured',
      database: dbHealth.database || appConfig.db.name,
      error: dbHealth.error || null
    }
  });
});

// Liveness Probe (process is responsive)
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Readiness Probe (checks required dependencies like Azure SQL)
router.get('/ready', async (req, res) => {
  const dbHealth = await checkDbHealth();
  const isReady = dbHealth.status === 'healthy';

  if (isReady) {
    return res.status(200).json({
      status: 'ready',
      dependencies: {
        database: dbHealth
      },
      timestamp: new Date().toISOString()
    });
  }

  return res.status(503).json({
    status: 'not_ready',
    dependencies: {
      database: dbHealth
    },
    message: 'Required dependency (Azure SQL Database) is unavailable.',
    timestamp: new Date().toISOString()
  });
});

export default router;
