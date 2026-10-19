import mongoose from 'mongoose';

const clientLogoSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    image: { type: String, default: '' },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export const ClientLogo =
  mongoose.models.ClientLogo || mongoose.model('ClientLogo', clientLogoSchema);
export default ClientLogo;
