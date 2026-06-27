import { Router } from 'express';
import {
  listUsers,
  updateProfile,
  updateUserRole,
  deleteUser,
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.put('/profile', protect, updateProfile);
router.get('/', protect, authorize('admin'), listUsers);
router.patch('/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;
