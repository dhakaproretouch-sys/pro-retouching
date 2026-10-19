import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { heroSlides } from '../data/heroSlides';

// ---------------------------------------------------------------------------
// Slider tuning constants. Change AUTOPLAY_MS to make slides advance faster
// or slower (value is in milliseconds: 5000 = every 5 seconds).
// ---------------------------------------------------------------------------
const AUTOPLAY_MS = 5000;
const CROSSFADE_MS = 0; // Disable crossfade animation for instant switch
const KEN_BURNS_MS = 0; // Disable Ken Burns effect
const KEN_BURNS_SCALE = 1; // No scaling
const SWIPE_THRESHOLD_PX = 60;

// Brand-colored fallback shown whenever a slide image is missing or fails to
// load, so the hero never looks broken in production.
const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #0F2A55 0%, #1A3E75 45%, #F59E0B 100%)',
  'linear-gradient(135deg, #7C2D12 0%, #F97316 50%, #DB2777 100%)',
  'linear-gradient(135deg, #0F2A55 0%, #6D28D9 55%, #EC4899 100%)',
];

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);
    const handleChange = (event) => setReduced(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reduced;
};

export const HeroSlider = ({ children, className = '', slides: slidesProp }) => {
  const slides = slidesProp && slidesProp.length > 0 ? slidesProp : heroSlides;
  const slideCount = slides.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [failedSlides, setFailedSlides] = useState({});
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isControlFocused, setIsControlFocused] = useState(false);
  const [isInView, setIsInView] = useState(true);

  const containerRef = useRef(null);
  const swipeStartRef = useRef(null);

  const prefersReduced = usePrefersReducedMotion();

  const goToSlide = useCallback(
    (index) => setActiveIndex(((index % slideCount) + slideCount) % slideCount),
    [slideCount]
  );
  const goToNext = useCallback(
    () => setActiveIndex((index) => (index + 1) % slideCount),
    [slideCount]
  );
  const goToPrev = useCallback(
    () => setActiveIndex((index) => (index - 1 + slideCount) % slideCount),
    [slideCount]
  );

  // Autoplay: pauses on hover / when the hero leaves the viewport.
  // Reduced-motion users still get slide changes, just without animation
  // (the crossfade/Ken Burns durations resolve to 0 above).
  useEffect(() => {
    if (isPointerInside || !isInView || slideCount < 2) return undefined;
    const timerId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slideCount);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timerId);
  }, [isPointerInside, isInView, slideCount]);

  // Track whether the hero is on screen so keyboard shortcuts only work in view.
  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => setIsInView(entries[0]?.isIntersecting ?? true),
      { threshold: 0.2 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Left / right arrow keys change the slide while the hero is in view.
  useEffect(() => {
    if (!isInView || slideCount < 2) return undefined;
    const handleKeyDown = (event) => {
      const target = event.target;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInView, slideCount, goToPrev, goToNext]);

  // Lightweight touch / pen swipe support (no extra library).
  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse') return;
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (deltaX < 0) goToNext();
    else goToPrev();
  };

  const handlePointerCancel = () => {
    swipeStartRef.current = null;
  };

  const markSlideFailed = (index) => {
    setFailedSlides((previous) => ({ ...previous, [index]: true }));
  };

  const desktopControlsClass = isPointerInside || isControlFocused
    ? 'sm:opacity-100'
    : 'sm:opacity-0';

  return (
    <div
      ref={containerRef}
      className={`group relative flex w-full items-center justify-center overflow-hidden bg-[#0F2A55] ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero background image slider"
      onMouseEnter={() => setIsPointerInside(true)}
      onMouseLeave={() => setIsPointerInside(false)}
      onFocus={() => setIsControlFocused(true)}
      onBlur={() => setIsControlFocused(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {/* ------------------------------------------------------------------
          Slides: 1s crossfade + very slow Ken Burns zoom on the active one.
          NOTE: motion's `transition.duration` is in SECONDS, so the *_MS
          constants are converted (value / 1000) before being passed.
          ------------------------------------------------------------------ */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          {slideCount > 0 && (
            <motion.div
              key={activeIndex}
              className="absolute inset-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0 }}
            >
              <div
                className="absolute inset-0"
                style={{ backgroundImage: FALLBACK_GRADIENTS[activeIndex % FALLBACK_GRADIENTS.length] }}
              >
                {!failedSlides[activeIndex] && (
                  <img
                    src={slides[activeIndex].image}
                    alt={slides[activeIndex].alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={activeIndex === 0 ? 'eager' : 'lazy'}
                    fetchPriority={activeIndex === 0 ? 'high' : 'auto'}
                    decoding="async"
                    draggable={false}
                    onError={() => markSlideFailed(activeIndex)}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ------------------------------------------------------------------
          Static content stays above the slider (gradient overlays removed
          so the banner images show their natural colors)
          ------------------------------------------------------------------ */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 pb-12 pt-6 sm:px-6 sm:pb-14 lg:px-8">
        {children}
      </div>

      {/* ------------------------------------------------------------------
          Arrow controls: glass circles, always visible on mobile, hover on desktop
          ------------------------------------------------------------------ */}
      <button
        type="button"
        onClick={goToPrev}
        aria-label="Previous slide"
        className={`absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90 sm:left-5 sm:h-12 sm:w-12 ${desktopControlsClass}`}
      >
        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={goToNext}
        aria-label="Next slide"
        className={`absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90 sm:right-5 sm:h-12 sm:w-12 ${desktopControlsClass}`}
      >
        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </button>

      {/* ------------------------------------------------------------------
          Bottom center dot indicators (active dot is orange and elongated)
          ------------------------------------------------------------------ */}
      <div
        className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2"
        role="group"
        aria-label="Choose a hero slide"
      >
        {slides.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1} of ${slideCount}: ${slide.alt}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90 ${
              index === activeIndex
                ? 'w-7 bg-[#F59E0B]'
                : 'w-2.5 bg-white/50 hover:bg-white/90'
            }`}
          />
        ))}
      </div>

      <span className="sr-only" aria-live="polite">
        {slideCount > 0
          ? `Slide ${activeIndex + 1} of ${slideCount}: ${slides[activeIndex].alt}`
          : ''}
      </span>
    </div>
  );
};

export default HeroSlider;
