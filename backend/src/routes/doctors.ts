import { Router } from 'express';
import { DoctorController } from '../controllers/DoctorController';
import { authMiddleware } from '../middleware/AuthMiddleware';

const router = Router();

router.get('/', authMiddleware, DoctorController.getDoctors);
router.get('/:id', authMiddleware, DoctorController.getDoctorById);

export { router as doctorRouter };
