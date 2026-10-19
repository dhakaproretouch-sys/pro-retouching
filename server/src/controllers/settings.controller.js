import { SiteSettings } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

/** GET /api/admin/settings */
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSingleton();
  sendSuccess(res, settings, 'Settings fetched');
});

/** PUT /api/admin/settings (single document, upsert) */
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.findOneAndUpdate(
    { key: 'site' },
    { $set: req.body },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  sendSuccess(res, settings, 'Settings updated');
});
