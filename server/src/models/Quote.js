import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema(
  {
    service: { type: String, default: '', trim: true },
    quantity: { type: String, default: '', trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'done'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export const Quote = mongoose.models.Quote || mongoose.model('Quote', quoteSchema);
export default Quote;
