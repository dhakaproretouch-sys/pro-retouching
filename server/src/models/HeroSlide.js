import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema(
  {
    image: { type: String, required: [true, 'Image path or URL is required'] },
    publicId: { type: String, default: '' },
    alt: { type: String, required: [true, 'Alt text is required'], trim: true },
    order: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const HeroSlide =
  mongoose.models.HeroSlide || mongoose.model('HeroSlide', heroSlideSchema);
export default HeroSlide;
