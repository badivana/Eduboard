import { Router } from 'express';
import { body } from 'express-validator';
import { upsertReview, deleteReview } from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.post(
  '/',
  protect,
  [
    body('courseId').notEmpty().withMessage('courseId is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  ],
  validate,
  upsertReview
);

router.delete('/:id', protect, deleteReview);

export default router;
