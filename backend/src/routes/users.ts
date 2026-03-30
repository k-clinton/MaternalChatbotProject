import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/AuthMiddleware';
import { validate } from '../middleware/ValidationMiddleware';

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('weeksPregnant').optional().isInt({ min: 1, max: 45 }).withMessage('Weeks pregnant must be between 1 and 45'),
    validate
  ],
  UserController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  UserController.login
);

router.get('/profile', authMiddleware, UserController.getProfile);

router.put(
  '/profile',
  authMiddleware,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty').trim(),
    body('weeksPregnant').optional().isInt({ min: 1, max: 45 }).withMessage('Weeks pregnant must be between 1 and 45'),
    body('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
    body('emergencyContact').optional().trim(),
    body('emailNotifications').optional().isBoolean(),
    body('whatsappNotifications').optional().isBoolean(),
    body('whatsappNumber').optional().trim(),
    validate
  ],
  UserController.updateProfile
);

export { router as userRouter };
