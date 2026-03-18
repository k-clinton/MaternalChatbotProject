import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';

const router = Router();

router.post('/', AppointmentController.scheduleAppointment);
router.get('/', AppointmentController.getAppointments);

export { router as appointmentRouter };
