import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { authMiddleware } from '../middleware/AuthMiddleware';

const router = Router();

router.post('/message', authMiddleware, ChatController.sendMessage);

export { router as chatRouter };
