import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    duration: { type: Number, default: 0 }, // minutes
    videoUrl: { type: String, default: '' },
    isPreview: { type: Boolean, default: false },
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: 140,
    },
    slug: { type: String, unique: true, lowercase: true, index: true },
    subtitle: { type: String, default: '', maxlength: 200 },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Development', 'Design', 'Business', 'Marketing', 'Data Science', 'Photography', 'Music', 'Other'],
      default: 'Development',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
    },
    language: { type: String, default: 'English' },
    price: { type: Number, required: true, min: 0, default: 0 },
    thumbnail: { type: String, default: '' },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lessons: [lessonSchema],
    tags: [{ type: String, trim: true }],
    enrolledCount: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate a URL-friendly slug from the title
courseSchema.pre('validate', function (next) {
  if (this.isModified('title') || !this.slug) {
    const base = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    // Append a short suffix from the ObjectId to keep slugs unique
    this.slug = `${base}-${this._id.toString().slice(-5)}`;
  }
  next();
});

courseSchema.virtual('totalDuration').get(function () {
  return (this.lessons || []).reduce((sum, l) => sum + (l.duration || 0), 0);
});

courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

// Text index for search
courseSchema.index({ title: 'text', subtitle: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Course', courseSchema);
