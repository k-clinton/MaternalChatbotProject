import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);

export { router as userRouter };
