import { Router } from 'express';
import { body } from 'express-validator';
import {
  getCourses,
  getCategories,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
} from '../controllers/course.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.get('/', getCourses);
router.get('/categories', getCategories);
router.get('/instructor/mine', protect, authorize('instructor', 'admin'), getMyCourses);

router.post(
  '/',
  protect,
  authorize('instructor', 'admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be 0 or more'),
  ],
  validate,
  createCourse
);

router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

// Keep slug route last so it doesn't shadow the named routes above
router.get('/:slug', getCourse);

export default router;
