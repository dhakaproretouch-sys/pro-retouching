import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  label: string;
  description?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = '+',
  duration = 2000,
  label,
  description,
}) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easedProgress * value));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [hasAnimated, value, duration]);

  const formattedCount = count.toLocaleString();

  return (
    <div ref={elementRef} className="text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
      <div className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0F2A55] tracking-tight tabular-nums">
        <span>{formattedCount}</span>
        <span className="text-amber-500">{suffix}</span>
      </div>
      <h4 className="mt-2 text-sm sm:text-base font-semibold text-slate-800">
        {label}
      </h4>
      {description && (
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
};
