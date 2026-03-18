import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';

const router = Router();

router.post('/message', ChatController.sendMessage);

export { router as chatRouter };
