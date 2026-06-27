import Review from '../models/Review.js';
import Enrollment from '../models/Enrollment.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// POST /api/reviews — create or update the user's review for a course
export const upsertReview = asyncHandler(async (req, res) => {
  const { courseId, rating, comment } = req.body;

  // Must be enrolled to review
  const enrolled = await Enrollment.findOne({ student: req.user._id, course: courseId });
  if (!enrolled) {
    res.status(403);
    throw new Error('Only enrolled students can review this course');
  }

  let review = await Review.findOne({ course: courseId, user: req.user._id });
  if (review) {
    review.rating = rating;
    review.comment = comment ?? review.comment;
    await review.save();
  } else {
    review = await Review.create({ course: courseId, user: req.user._id, rating, comment });
  }

  await review.populate('user', 'name avatar');
  res.status(201).json({ review });
});

// DELETE /api/reviews/:id — owner or admin
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (req.user.role !== 'admin' && review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not allowed');
  }
  await review.deleteOne();
  res.json({ message: 'Review removed' });
});
