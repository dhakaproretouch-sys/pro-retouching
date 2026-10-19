import mongoose from 'mongoose';

const statSchema = new mongoose.Schema(
  {
    label: { type: String, required: [true, 'Label is required'], trim: true },
    value: { type: Number, required: [true, 'Value is required'] },
    suffix: { type: String, default: '' },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export const Stat = mongoose.models.Stat || mongoose.model('Stat', statSchema);
export default Stat;
