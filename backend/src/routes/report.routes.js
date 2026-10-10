import { Router } from 'express';
import { createReport, getReports, getReportById, getMyReports, updateReport, updateStatus, deleteReport } from '../controllers/report.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createReportSchema, updateReportSchema } from '../validators/report.validator.js';

const router = Router();

router.get('/', getReports);
router.get('/my-reports', authenticate, getMyReports);
router.get('/:id', getReportById);
router.post('/', authenticate, validateRequest(createReportSchema), createReport);
router.patch('/:id', authenticate, validateRequest(updateReportSchema), updateReport);
router.patch('/:id/status', authenticate, updateStatus);
router.delete('/:id', authenticate, deleteReport);

export default router;