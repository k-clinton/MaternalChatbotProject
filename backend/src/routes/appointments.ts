import { Router } from 'express';
import { body, param } from 'express-validator';
import { AppointmentController } from '../controllers/AppointmentController';
import { authMiddleware } from '../middleware/AuthMiddleware';
import { validate } from '../middleware/ValidationMiddleware';

const router = Router();

router.use(authMiddleware);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required').trim(),
    body('doctor').notEmpty().withMessage('Doctor name is required').trim(),
    body('date').isISO8601().withMessage('Valid date/time is required'),
    validate
  ],
  AppointmentController.scheduleAppointment
);

router.get('/', AppointmentController.getAppointments);

router.delete(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid appointment ID'),
    validate
  ],
  AppointmentController.deleteAppointment
);

export { router as appointmentRouter };
