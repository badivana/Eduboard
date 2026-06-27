import { Router } from 'express';
import {
  enroll,
  getMyEnrollments,
  updateProgress,
  checkEnrollment,
} from '../controllers/enrollment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect); // all enrollment routes require auth

router.post('/', enroll);
router.get('/me', getMyEnrollments);
router.get('/check/:courseId', checkEnrollment);
router.patch('/:id/progress', updateProgress);

export default router;
