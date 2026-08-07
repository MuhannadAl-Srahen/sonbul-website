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
  // Set by the effect below. The arrows have to move the same accumulated position the
  // auto-advance owns, or the two fight over scrollLeft each frame.
  const nudgeRef = useRef<((dir: 1 | -1) => void) | null>(null);
  const logos = names.map(logoSrc);

  const count = logos.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rtl = getComputedStyle(el).direction === 'rtl';
    const sign = rtl ? -1 : 1;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let last = performance.now();
    // Deliberately slow: the strip should drift, not scroll past you.
    const SPEED = 16; // px per second

    /**
     * Width of one copy of the list, which is the distance the strip can travel before
     * it looks identical again. Measured off the first tile of the second copy rather
     * than `scrollWidth / 2`, because the container is padded, so half the scroll width
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

    /**
     * The position has to be accumulated here rather than read back off the element
     * every frame. `scrollLeft` snaps to whole pixels, and at this speed a frame is
     * about a quarter of one, so `scrollLeft += 0.23` rounded straight back to where
     * it started and the strip never moved at all. Keeping the real position in a
     * float and writing it out lets the sub-pixel remainder survive between frames.
     */
    let pos = el.scrollLeft;
    let written = pos;
    // While an arrow's smooth scroll is in flight, leave the element alone, because writing
    // to scrollLeft would cancel it mid-animation.
    let holdUntil = 0;

    const step = (now: number) => {
      // Clamped so a backgrounded tab does not return and jump the strip forwards.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!paused.current && now >= holdUntil) {
        // Adopt anything that moved the strip behind our back: a drag, a wheel, or an
        // arrow whose smooth scroll has just settled.
        if (Math.abs(el.scrollLeft - written) > 1) pos = el.scrollLeft;
        pos += sign * SPEED * dt;
        const span = period();
        // One copy back is pixel-identical, so the wrap is invisible.
        if (span > 0) {
          if (pos >= span) pos -= span;
          if (pos <= -span) pos += span;
        }
        el.scrollLeft = pos;
        written = el.scrollLeft;
      }
      raf = requestAnimationFrame(step);
    };
    if (!reduce) raf = requestAnimationFrame(step);

    // `dir` is logical (-1 = toward the start of the strip). `scrollTo` is physical, and
    // under RTL the start of the strip is on the right, so the sign flips.
    nudgeRef.current = (dir) => {
      pos += dir * sign * 320;
      el.scrollTo({ left: pos, behavior: 'smooth' });
      holdUntil = performance.now() + 500;
    };

    // Drag to scroll, for the mouse only.
    let down = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e: PointerEvent) => {
      paused.current = true;
      // A finger already pans an `overflow-x: auto` container natively, so running the
      // drag handler for touch too moved the strip twice as far as the finger went.
      // Native panning also carries momentum, which this cannot reproduce.
      if (e.pointerType !== 'mouse') return;
      down = true;
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
      nudgeRef.current = null;
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

  const nudge = (dir: 1 | -1) => nudgeRef.current?.(dir);

  return (
    <div className="relative">
      <div
        ref={ref}
        // Full-bleed and hard-edged. The previous version masked the strip to transparent
        // at both ends, which over a light section read as a grey smear, not a fade.
        className="no-scrollbar flex cursor-grab gap-12 overflow-x-auto overscroll-x-contain px-10 py-3 active:cursor-grabbing sm:px-14"
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
            'absolute top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full sm:h-10 sm:w-10',
            'border border-ink-100 bg-white/85 text-ink-600 shadow-card backdrop-blur-sm',
            'transition-colors hover:bg-white hover:text-primary',
            side === 'start' ? 'start-0' : 'end-0',
          )}
        >
          <Icon className="h-4 w-4 rtl-flip sm:h-5 sm:w-5" />
        </button>
      ))}
    </div>
  );
}
