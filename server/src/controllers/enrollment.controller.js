import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// POST /api/enrollments — enroll the logged-in student in a course
export const enroll = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
  if (existing) {
    res.status(409);
    throw new Error('You are already enrolled in this course');
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: courseId,
    pricePaid: course.price,
  });

  course.enrolledCount += 1;
  await course.save();

  res.status(201).json({ enrollment });
});

// GET /api/enrollments/me — current student's enrollments with course data
export const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({
      path: 'course',
      populate: { path: 'instructor', select: 'name avatar' },
    })
    .sort('-createdAt');
  res.json({ enrollments });
});

// PATCH /api/enrollments/:id/progress — update lesson progress
export const updateProgress = asyncHandler(async (req, res) => {
  const { completedLessons } = req.body;
  const enrollment = await Enrollment.findById(req.params.id).populate('course', 'lessons');

  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }
  if (enrollment.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not your enrollment');
  }

  if (Array.isArray(completedLessons)) {
    enrollment.completedLessons = completedLessons;
    const totalLessons = enrollment.course?.lessons?.length || 0;
    enrollment.progress = totalLessons
      ? Math.min(100, Math.round((completedLessons.length / totalLessons) * 100))
      : 0;
    enrollment.status = enrollment.progress === 100 ? 'completed' : 'active';
  }

  await enrollment.save();
  res.json({ enrollment });
});

// GET /api/enrollments/check/:courseId — is the student enrolled?
export const checkEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId,
  });
  res.json({ enrolled: !!enrollment, enrollment });
});
