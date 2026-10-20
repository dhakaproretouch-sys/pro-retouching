import React, { useState, useRef, useCallback } from 'react';
import { SafeImage } from './SafeImage';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: string;
  variant?: 'cutout' | 'retouch' | 'ghost' | 'standard';
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  aspectRatio = 'aspect-[4/3]',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${aspectRatio} overflow-hidden rounded-2xl select-none shadow-lg border border-slate-200/80 bg-slate-100 cursor-ew-resize group`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={handleTrackClick}
    >
      {/* AFTER IMAGE (Underneath, full container) */}
      <div className="absolute inset-0 w-full h-full">
        <SafeImage
          src={afterImage}
          alt={afterLabel}
          fallbackLabel={`After: ${afterLabel}`}
          gradientClass="from-slate-100 via-emerald-50/50 to-slate-200"
          className="w-full h-full object-contain object-center"
        />
        <div className="absolute top-4 right-4 bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm pointer-events-none z-10">
          {afterLabel}
        </div>
      </div>

      {/* BEFORE IMAGE (Clipped on top according to sliderPosition) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div
          className="relative w-full h-full"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
        >
          <SafeImage
            src={beforeImage}
            alt={beforeLabel}
            fallbackLabel={`Before: ${beforeLabel}`}
            gradientClass="from-slate-200 via-slate-100 to-amber-50/40"
            className="w-full h-full object-contain object-center"
          />
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm pointer-events-none z-10">
            {beforeLabel}
          </div>
        </div>
      </div>

      {/* DRAG HANDLE LINE */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-amber-500 shadow-xl pointer-events-none z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* CENTER BUTTON */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white pointer-events-auto cursor-ew-resize group-hover:scale-110 transition-transform">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M8.5 7l-5 5 5 5V7zm7 0v10l5-5-5-5z" />
          </svg>
        </div>
      </div>

      {/* Hover Instruction helper */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white/90 text-[11px] px-3 py-1 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20">
        Drag slider or click anywhere to compare
      </div>
    </div>
  );
};
