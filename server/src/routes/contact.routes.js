import { Router } from 'express';
import { body } from 'express-validator';
import { submitContact, listContacts, markHandled } from '../controllers/contact.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('message').trim().isLength({ min: 5 }).withMessage('Message is too short'),
  ],
  validate,
  submitContact
);

router.get('/', protect, authorize('admin'), listContacts);
router.patch('/:id', protect, authorize('admin'), markHandled);

export default router;
