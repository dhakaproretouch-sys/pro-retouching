import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackLabel?: string;
  gradientClass?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Product showcase',
  className = '',
  fallbackLabel,
  gradientClass = 'from-slate-100 via-amber-50/60 to-slate-200',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br ${gradientClass} text-slate-500 overflow-hidden select-none ${className}`}
        role="img"
        aria-label={alt || 'Image placeholder'}
      >
        {/* Subtle decorative mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#0F2A55_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm border border-slate-200/80 flex items-center justify-center text-amber-500 mb-2">
            <ImageIcon className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-700 tracking-tight font-heading">
            {fallbackLabel || alt || 'Pro Retouching'}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
            <span>Studio Quality Render</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
