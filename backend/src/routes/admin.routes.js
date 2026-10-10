import { Router } from 'express';
import { getUsers, updateUserStatus, getReports, getClaims, getAuditLogs } from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRole } from '../middleware/authorizeRole.js';

const router = Router();

router.use(authenticate, authorizeRole('admin'));
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/reports', getReports);
router.get('/claims', getClaims);
router.get('/audit-logs', getAuditLogs);

export default router;