import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Image field combining the drag-and-drop uploader with a "paste URL" fallback
 * (used everywhere Cloudinary may be unconfigured or a CDN URL is preferred).
 */
export const ImageField: React.FC<ImageFieldProps> = ({
  label,
  value,
  onChange,
  hint = 'Recommended 1920x900 px, JPG/WEBP, under 300 KB',
  disabled = false,
  required = false,
}) => {
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const effective = uploadUrl || value;

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <ImageUploader
        value={effective}
        hint={hint}
        disabled={disabled}
        onChange={(image) => {
          setUploadUrl(image?.url || null);
          onChange(image?.url || '');
        }}
      />
      <div className="mt-3">
        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
          …or paste an image URL
        </label>
        <input
          type="url"
          placeholder="https://…/image.jpg"
          value={uploadUrl ? '' : value}
          disabled={disabled || Boolean(uploadUrl)}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all disabled:opacity-50"
        />
      </div>
    </div>
  );
};

export default ImageField;
