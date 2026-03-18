import { Router } from 'express';
import { VitalsController } from '../controllers/VitalsController';

const router = Router();

router.post('/log', VitalsController.logVitals);
router.get('/', VitalsController.getLogs);

export { router as vitalsRouter };
