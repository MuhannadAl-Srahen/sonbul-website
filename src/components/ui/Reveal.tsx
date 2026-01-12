import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export default function Reveal({ children, delay = 0, y = 20, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion / no observer support: show immediately, no animation.
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    // Anything already in (or above) the viewport on mount reveals right away.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    // Safety net: never leave content invisible even if the observer never fires.
    const t = setTimeout(() => setVisible(true), 400);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.7s ${delay}s ease-out, transform 0.7s ${delay}s ease-out`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
