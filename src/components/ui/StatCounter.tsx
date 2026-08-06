import { useEffect, useRef } from 'react';

interface Props {
  end: number;
  suffix?: string;
  duration?: number;
}

/**
 * Counts up to `end` the first time it scrolls into view.
 *
 * The final number is server-rendered and the animation drives `textContent` directly
 * rather than React state. Holding it in state meant the HTML shipped "0+", so until
 * ~350 KB of JavaScript had parsed — and forever without JavaScript — the stat bands
 * read "0+ Years in business". Crawlers saw the same thing.
 */
export default function StatCounter({ end, suffix = '', duration = 1600 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const write = (n: number) => {
      el.textContent = `${n}${suffix}`;
    };

    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        write(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    write(0);
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        run();
      }
    });
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      // Leave the real number behind if this unmounts mid-animation.
      write(end);
    };
  }, [end, suffix, duration]);

  return (
    <span ref={ref}>
      {end}
      {suffix}
    </span>
  );
}
