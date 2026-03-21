import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/AuthMiddleware';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, UserController.updateProfile);

export { router as userRouter };
