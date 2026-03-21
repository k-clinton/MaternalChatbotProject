import { Router } from 'express';
import { VitalsController } from '../controllers/VitalsController';
import { authMiddleware } from '../middleware/AuthMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/log', VitalsController.logVitals);
router.get('/', VitalsController.getLogs);
router.get('/alerts', VitalsController.getAlerts);

export { router as vitalsRouter };
