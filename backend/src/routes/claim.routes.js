import { Router } from 'express';
import { createClaim, getMyClaims, getClaimById, reviewClaim, confirmHandover } from '../controllers/claim.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createClaimSchema, reviewClaimSchema } from '../validators/claim.validator.js';

const router = Router();

router.post('/', authenticate, validateRequest(createClaimSchema), createClaim);
router.get('/my-claims', authenticate, getMyClaims);
router.get('/:id', authenticate, getClaimById);
router.patch('/:id/review', authenticate, authorizeRole('admin'), validateRequest(reviewClaimSchema), reviewClaim);
router.patch('/:id/handover', authenticate, authorizeRole('admin'), confirmHandover);

export default router;