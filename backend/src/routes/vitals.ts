import { Router } from 'express';
import { body } from 'express-validator';
import { VitalsController } from '../controllers/VitalsController';
import { authMiddleware } from '../middleware/AuthMiddleware';
import { validate } from '../middleware/ValidationMiddleware';

const router = Router();

router.use(authMiddleware);

router.post(
  '/log',
  [
    body('bloodPressure')
      .optional()
      .matches(/^\d{2,3}\/\d{2,3}$/)
      .withMessage('Blood pressure must be in the format systolic/diastolic (e.g., 120/80)'),
    body('weight')
      .optional()
      .isFloat({ min: 30, max: 200 })
      .withMessage('Weight must be a valid number between 30 and 200 kg'),
    body('fetalMovement')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Fetal movement must be a positive integer'),
    validate
  ],
  VitalsController.logVitals
);

router.get('/', VitalsController.getLogs);
router.get('/alerts', VitalsController.getAlerts);

export { router as vitalsRouter };
