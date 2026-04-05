import { Router } from 'express';
import { authController } from '../controllers';
import { requireAuth } from '../middlewares';

const router = Router();

// POST /auth/register
router.post('/register', authController.register);

// POST /auth/login
router.post('/login', authController.login);

// POST /auth/logout
router.post('/logout', requireAuth(), authController.logout);

// GET /auth/me
router.get('/me', requireAuth(), authController.me);

export const authRoutes = router;
