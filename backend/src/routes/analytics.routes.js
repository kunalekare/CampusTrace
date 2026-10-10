import { Router } from 'express';
import { getSummary, getCategories, getLocations, getMonthlyTrends } from '../controllers/analytics.controller.js';

const router = Router();

router.get('/summary', getSummary);
router.get('/categories', getCategories);
router.get('/locations', getLocations);
router.get('/monthly-trends', getMonthlyTrends);

export default router;