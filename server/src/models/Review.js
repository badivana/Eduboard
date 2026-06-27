import mongoose from 'mongoose';
import Course from './Course.js';

const reviewSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', maxlength: 1000 },
  },
  { timestamps: true }
);

// One review per user per course
reviewSchema.index({ course: 1, user: 1 }, { unique: true });

// Recalculate the course's average rating whenever reviews change
reviewSchema.statics.recalcRating = async function (courseId) {
  const stats = await this.aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: '$course',
        ratingCount: { $sum: 1 },
        ratingAverage: { $avg: '$rating' },
      },
    },
  ]);

  const { ratingCount = 0, ratingAverage = 0 } = stats[0] || {};
  await Course.findByIdAndUpdate(courseId, {
    ratingCount,
    ratingAverage: Math.round(ratingAverage * 10) / 10,
  });
};

reviewSchema.post('save', function () {
  this.constructor.recalcRating(this.course);
});

reviewSchema.post('deleteOne', { document: true, query: false }, function () {
  this.constructor.recalcRating(this.course);
});

export default mongoose.model('Review', reviewSchema);
