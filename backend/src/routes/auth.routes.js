import { Router } from 'express';
import { register, login, logout, getMe, updateProfile } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/auth.validator.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authRateLimiter, validateRequest(registerSchema), register);
router.post('/login', authRateLimiter, validateRequest(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.patch('/profile', authenticate, validateRequest(updateProfileSchema), updateProfile);

export default router;