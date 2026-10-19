import mongoose from 'mongoose';

const socialSchema = new mongoose.Schema(
  {
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    skype: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
  },
  { _id: false }
);

const whyChooseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, default: '' },
  },
  { _id: false }
);

const priceHighlightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    value: { type: String, required: true },
    subtext: { type: String, default: '' },
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    // Single-document collection: the key lets us upsert idempotently.
    key: { type: String, default: 'site', unique: true },
    siteName: { type: String, default: 'Pro Retouching' },
    tagline: { type: String, default: '' },
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    social: { type: socialSchema, default: () => ({}) },
    footerText: { type: String, default: '' },
    aboutText: { type: String, default: '' },
    whyChoose: { type: [whyChooseSchema], default: [] },
    priceHighlights: { type: [priceHighlightSchema], default: [] },
  },
  { timestamps: true }
);

/** Get the singleton settings document, creating it from defaults if missing. */
siteSettingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne({ key: 'site' });
  if (!doc) doc = await this.create({ key: 'site' });
  return doc;
};

export const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
