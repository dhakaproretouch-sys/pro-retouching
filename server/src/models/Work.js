import mongoose from 'mongoose';

const workSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    category: { type: String, default: '', trim: true },
    beforeImage: { type: String, default: '' },
    afterImage: { type: String, default: '' },
    order: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Work = mongoose.models.Work || mongoose.model('Work', workSchema);
export default Work;
