import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
  },
  { _id: false }
);

const freeTestSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    whatsapp: { type: String, default: '', trim: true },
    service: { type: String, default: '', trim: true },
    files: { type: [fileSchema], default: [] },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'done'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const FreeTest =
  mongoose.models.FreeTest || mongoose.model('FreeTest', freeTestSchema);
export default FreeTest;
