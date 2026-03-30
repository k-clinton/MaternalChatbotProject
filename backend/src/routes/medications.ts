import { Router } from 'express';
import { body, param } from 'express-validator';
import { MedicationController } from '../controllers/MedicationController';
import { authMiddleware } from '../middleware/AuthMiddleware';
import { validate } from '../middleware/ValidationMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', MedicationController.getMedications);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Medication name is required').trim(),
    body('dosage').optional().trim(),
    body('frequency').optional().trim(),
    validate
  ],
  MedicationController.addMedication
);

router.patch(
  '/:id/taken',
  [
    param('id').isUUID().withMessage('Invalid medication ID'),
    validate
  ],
  MedicationController.markAsTaken
);

router.delete(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid medication ID'),
    validate
  ],
  MedicationController.deleteMedication
);

export { router as medicationRouter };
