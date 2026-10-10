import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { appConfig } from './src/config/appConfig.js';
import { apiRateLimiter } from './src/middleware/rateLimiter.js';
import apiRoutes from './src/routes/index.js';
import healthRoutes from './src/routes/health.routes.js';
import { notFound } from './src/middleware/notFound.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: appConfig.frontendUrl || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting on API routes
app.use('/api', apiRateLimiter);

// Health check endpoints available on all standard paths for compatibility
app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/v1/health', healthRoutes);

// Support both /api and /api/v1 prefixes seamlessly
app.use('/api', apiRoutes);
app.use('/api/v1', apiRoutes);

// Central error and 404 handling
app.use(notFound);
app.use(errorHandler);

export default app;
