import { Router } from 'express';
import { login, logout, me, changePassword } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, changePasswordSchema } from '../validators/schemas.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/login', loginLimiter, validate({ body: loginSchema }), login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.put('/change-password', requireAuth, validate({ body: changePasswordSchema }), changePassword);

export default router;
