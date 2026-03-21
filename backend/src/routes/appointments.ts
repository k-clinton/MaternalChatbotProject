import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { authMiddleware } from '../middleware/AuthMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', AppointmentController.scheduleAppointment);
router.get('/', AppointmentController.getAppointments);

export { router as appointmentRouter };
