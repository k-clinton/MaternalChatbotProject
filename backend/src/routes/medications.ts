import { Router } from 'express';
import { MedicationController } from '../controllers/MedicationController';
import { authMiddleware } from '../middleware/AuthMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', MedicationController.getMedications);
router.post('/', MedicationController.addMedication);
router.patch('/:id/taken', MedicationController.markAsTaken);
router.delete('/:id', MedicationController.deleteMedication);

export { router as medicationRouter };
