import type { CSSProperties, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Scroll-in wrapper.
 *
 * Deliberately ships no client JS of its own. The observer that adds `.is-visible` lives
 * in a single inline script in BaseLayout, so the content still appears even if the
 * island wrapping it fails to hydrate — previously one hydration error left every
 * section on the page stuck at opacity 0 with no way back.
 */
export default function Reveal({ children, delay = 0, y = 20, className }: Props) {
  return (
    <div
      data-reveal
      className={className}
      style={{ '--reveal-delay': `${delay}s`, '--reveal-y': `${y}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}
