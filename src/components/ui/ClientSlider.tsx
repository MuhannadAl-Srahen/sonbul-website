import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { ALL_LOGOS, logoSrc } from '../../data/clientLogos';
import { useLocale } from '../../i18n';
import type { Lang } from '../../i18n';

interface Props {
  lang: Lang;
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
export default function ClientSlider({ lang, logos: names = ALL_LOGOS }: Props) {
  const { t } = useLocale(lang);
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const logos = names.map(logoSrc);

  const count = logos.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rtl = getComputedStyle(el).direction === 'rtl';
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let last = performance.now();
    // Deliberately slow — the strip should drift, not scroll past you.
    const SPEED = 14; // px per second

    /**
     * Width of one copy of the list, which is the distance the strip can travel before
     * it looks identical again. Measured off the first tile of the second copy rather
     * than `scrollWidth / 2` — the container is padded, so half the scroll width
     * overshoots one copy by the padding and the loop would jump on every wrap. The
     * tiles are fixed-size in CSS, so this is correct before any logo has loaded.
     */
    const period = () => {
      const first = el.children[0] as HTMLElement | undefined;
      const second = el.children[count] as HTMLElement | undefined;
      return first && second
        ? Math.abs(second.offsetLeft - first.offsetLeft)
        : el.scrollWidth / 2;
    };

    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused.current) {
        const span = period();
        el.scrollLeft += (rtl ? -1 : 1) * SPEED * dt;
        if (span > 0) {
          if (!rtl && el.scrollLeft >= span) el.scrollLeft -= span;
          if (rtl && Math.abs(el.scrollLeft) >= span) el.scrollLeft += span;
        }
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
  }, [count]);

  // `dir` is logical (-1 = toward the start of the strip). `scrollBy` is physical, and
  // under RTL the start of the strip is on the right, so the sign has to flip.
  const nudge = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === 'rtl';
    el.scrollBy({ left: dir * (rtl ? -320 : 320), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        // Full-bleed and hard-edged. The previous version masked the strip to transparent
        // at both ends, which over a light section read as a grey smear, not a fade.
        className="no-scrollbar flex cursor-grab gap-12 overflow-x-auto overscroll-x-contain px-14 py-3 active:cursor-grabbing"
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

      {/* Arrows on both edges so it is visible that the strip moves and can be moved.
          Without them an auto-scrolling row reads as decoration rather than something
          you are allowed to touch. */}
      {(
        [
          ['start', -1, ChevronLeft],
          ['end', 1, ChevronRight],
        ] as const
      ).map(([side, dir, Icon]) => (
        <button
          key={side}
          type="button"
          onClick={() => nudge(dir)}
          aria-label={dir === 1 ? t('gallery.next') : t('gallery.prev')}
          className={clsx(
            'absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full',
            'border border-ink-100 bg-white/85 text-ink-600 shadow-card backdrop-blur-sm',
            'transition-colors hover:bg-white hover:text-primary',
            side === 'start' ? 'start-0' : 'end-0',
          )}
        >
          <Icon className="h-5 w-5 rtl-flip" />
        </button>
      ))}
    </div>
  );
}
