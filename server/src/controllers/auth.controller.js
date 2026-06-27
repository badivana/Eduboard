import User from '../models/User.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { signToken, sendTokenCookie } from '../utils/token.js';

const publicUser = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  avatar: u.avatar,
  bio: u.bio,
  createdAt: u.createdAt,
});

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  // Only allow self-registration as student or instructor (never admin)
  const safeRole = role === 'instructor' ? 'instructor' : 'student';

  const user = await User.create({ name, email, password, role: safeRole });
  const token = signToken(user._id);
  sendTokenCookie(res, token);

  res.status(201).json({ user: publicUser(user), token });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = signToken(user._id);
  sendTokenCookie(res, token);

  res.json({ user: publicUser(user), token });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});
