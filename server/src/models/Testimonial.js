import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    role: { type: String, default: '', trim: true },
    text: { type: String, required: [true, 'Testimonial text is required'] },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export const Testimonial =
  mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
