import mongoose from 'mongoose';

const pricingPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Plan name is required'], trim: true },
    price: { type: String, required: [true, 'Price is required'], trim: true },
    unit: { type: String, default: 'per image', trim: true },
    features: { type: [String], default: [] },
    isPopular: { type: Boolean, default: false },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export const PricingPlan =
  mongoose.models.PricingPlan || mongoose.model('PricingPlan', pricingPlanSchema);
export default PricingPlan;
