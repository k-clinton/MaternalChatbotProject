import { Router } from 'express';
import { chatRouter } from './chat';
import { userRouter } from './users';
import { vitalsRouter } from './vitals';
import { appointmentRouter } from './appointments';
import { medicationRouter } from './medications';
import { doctorRouter } from './doctors';

const router = Router();

// Mount all feature routes
router.use('/chat', chatRouter);
router.use('/users', userRouter);
router.use('/vitals', vitalsRouter);
router.use('/appointments', appointmentRouter);
router.use('/medications', medicationRouter);
router.use('/doctors', doctorRouter);

// Add health check under /api/v1/health too
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', source: 'api_router' });
});

export { router };
