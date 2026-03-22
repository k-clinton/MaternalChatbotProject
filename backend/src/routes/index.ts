import { Router } from 'express';
import { chatRouter } from './chat';
import { userRouter } from './users';
import { vitalsRouter } from './vitals';
import { appointmentRouter } from './appointments';
import { medicationRouter } from './medications';

const router = Router();

// Mount all feature routes
router.use('/chat', chatRouter);
router.use('/users', userRouter);
router.use('/vitals', vitalsRouter);
router.use('/appointments', appointmentRouter);
router.use('/medications', medicationRouter);

export { router };
