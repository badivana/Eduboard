import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Review from '../models/Review.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// GET /api/courses — list with search, filter, sort, pagination
export const getCourses = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    level,
    minPrice,
    maxPrice,
    featured,
    sort = '-createdAt',
    page = 1,
    limit = 12,
  } = req.query;

  const filter = { isPublished: true };

  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (level) filter.level = level;
  if (featured) filter.featured = featured === 'true';
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    popular: '-enrolledCount',
    rating: '-ratingAverage',
    'price-low': 'price',
    'price-high': '-price',
    newest: '-createdAt',
  };
  const sortBy = sortMap[sort] || sort;

  const pageNum = Math.max(1, Number(page));
  const perPage = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * perPage;

  const [courses, total] = await Promise.all([
    Course.find(filter)
      .populate('instructor', 'name avatar')
      .sort(sortBy)
      .skip(skip)
      .limit(perPage),
    Course.countDocuments(filter),
  ]);

  res.json({
    courses,
    page: pageNum,
    pages: Math.ceil(total / perPage),
    total,
  });
});

// GET /api/courses/categories — distinct categories with counts
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Course.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  res.json({ categories });
});

// GET /api/courses/:slug — single course by slug (or id)
export const getCourse = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const query = slug.match(/^[0-9a-fA-F]{24}$/) ? { _id: slug } : { slug };

  const course = await Course.findOne(query).populate('instructor', 'name avatar bio');
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const reviews = await Review.find({ course: course._id })
    .populate('user', 'name avatar')
    .sort('-createdAt');

  res.json({ course, reviews });
});

// POST /api/courses — instructor/admin
export const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create({ ...req.body, instructor: req.user._id });
  res.status(201).json({ course });
});

// PUT /api/courses/:id — owner instructor or admin
export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not allowed to edit this course');
  }

  Object.assign(course, req.body);
  await course.save();
  res.json({ course });
});

// DELETE /api/courses/:id
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not allowed to delete this course');
  }

  await course.deleteOne();
  await Enrollment.deleteMany({ course: course._id });
  await Review.deleteMany({ course: course._id });
  res.json({ message: 'Course removed' });
});

// GET /api/courses/instructor/mine — courses owned by the logged-in instructor
export const getMyCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).sort('-createdAt');
  res.json({ courses });
});
