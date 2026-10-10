import { Router } from 'express';
import { getMyMatches, getMatchById, dismissMatch } from '../controllers/match.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/my-matches', authenticate, getMyMatches);
router.get('/:id', authenticate, getMatchById);
router.post('/:id/dismiss', authenticate, dismissMatch);

export default router;