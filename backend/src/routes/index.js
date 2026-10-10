import { Router } from 'express';
import authRoutes from './auth.routes.js';
import reportRoutes from './report.routes.js';
import matchRoutes from './match.routes.js';
import claimRoutes from './claim.routes.js';
import notificationRoutes from './notification.routes.js';
import uploadRoutes from './upload.routes.js';
import analyticsRoutes from './analytics.routes.js';
import adminRoutes from './admin.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/reports', reportRoutes);
router.use('/matches', matchRoutes);
router.use('/claims', claimRoutes);
router.use('/notifications', notificationRoutes);
router.use('/uploads', uploadRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);

export default router;