import { useEffect, useRef } from 'react';
import { ALL_LOGOS, logoSrc } from '../../data/clientLogos';

interface Props {
  /** Logo basenames; defaults to the full group set. See logosFor() in clientLogos.ts. */
  logos?: string[];
}

/**
 * Client logos, auto-scrolling but grabbable.
 *
 * A real scroll container rather than a CSS transform animation. The old version could
 * not be touched: `translateX` is not scrolling, so there was nothing to drag, nothing
 * for a wheel or a trackpad to act on, and the browser would not lazy-load anything the
 * transform moved into view. Here the auto-advance just nudges `scrollLeft`, so dragging,
 * flicking and scroll-wheeling all work for free and the animation simply steps aside.
 */
export default function ClientSlider({ logos: names = ALL_LOGOS }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const logos = names.map(logoSrc);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rtl = getComputedStyle(el).direction === 'rtl';
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let last = performance.now();
    const SPEED = 28; // px per second

    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused.current) {
        // The list is rendered twice, so wrapping at the halfway mark is seamless.
        const half = el.scrollWidth / 2;
        el.scrollLeft += (rtl ? -1 : 1) * SPEED * dt;
        if (!rtl && el.scrollLeft >= half) el.scrollLeft -= half;
        if (rtl && Math.abs(el.scrollLeft) >= half) el.scrollLeft += half;
      }
      raf = requestAnimationFrame(step);
    };
    if (!reduce) raf = requestAnimationFrame(step);

    // Drag to scroll. Pointer events cover mouse, touch and pen with one path.
    let down = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e: PointerEvent) => {
      down = true;
      paused.current = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      el.scrollLeft = startScroll - (e.clientX - startX);
    };
    const onUp = (e: PointerEvent) => {
      down = false;
      paused.current = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    const hold = () => (paused.current = true);
    const release = () => {
      if (!down) paused.current = false;
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('mouseenter', hold);
    el.addEventListener('mouseleave', release);
    el.addEventListener('focusin', hold);
    el.addEventListener('focusout', release);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('mouseenter', hold);
      el.removeEventListener('mouseleave', release);
      el.removeEventListener('focusin', hold);
      el.removeEventListener('focusout', release);
    };
  }, []);

  return (
    <div
      ref={ref}
      // Full-bleed and hard-edged. The previous version masked the strip to transparent at
      // both ends, which over a light section read as a grey smear rather than a fade.
      className="no-scrollbar flex cursor-grab gap-12 overflow-x-auto overscroll-x-contain py-3 active:cursor-grabbing"
    >
      {[...logos, ...logos].map((src, i) => (
        <div
          key={i}
          className="flex h-16 w-36 flex-shrink-0 select-none items-center justify-center"
        >
          <img
            src={src}
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority="low"
            className="max-h-12 w-auto select-none object-contain transition-transform duration-300 hover:scale-110"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
