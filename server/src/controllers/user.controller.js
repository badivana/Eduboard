import User from '../models/User.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// GET /api/users  (admin) — list users
export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json({ count: users.length, users });
});

// PUT /api/users/profile — update own profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, avatar, password } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;
  if (password) user.password = password;

  await user.save();
  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
    },
  });
});

// PATCH /api/users/:id/role  (admin) — change a user's role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['student', 'instructor', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ user });
});

// DELETE /api/users/:id  (admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ message: 'User removed' });
});
