import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    interval: { type: String, enum: ['month', 'year', 'once'], default: 'month' },
    tagline: { type: String, default: '' },
    features: [{ type: String }],
    highlighted: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Plan', planSchema);
