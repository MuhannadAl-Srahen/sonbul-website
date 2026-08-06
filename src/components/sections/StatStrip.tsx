import clsx from 'clsx';
import Reveal from '../ui/Reveal';
import StatCounter from '../ui/StatCounter';

export interface Stat {
  end: number;
  suffix?: string;
  label: string;
}

interface Props {
  items: Stat[];
  className?: string;
}

/**
 * The red stats band, extracted from the home hero.
 *
 * Borders are computed rather than hardcoded per index so the strip works with any
 * count: `border-e` between columns, `border-b` between the two mobile rows. Logical
 * properties, so it flips correctly in RTL.
 */
export default function StatStrip({ items, className }: Props) {
  return (
    <div className={clsx('bg-primary/95 backdrop-blur-sm text-white', className)}>
      <div className="container-page grid grid-cols-2 md:grid-cols-4">
        {items.map((s, i) => (
          <Reveal
            key={s.label}
            delay={0.3 + i * 0.08}
            className={clsx(
              'text-center px-4 py-6',
              i % 2 === 0 && 'border-e border-white/20',
              i < items.length - 2 && 'border-b border-white/20 md:border-b-0',
              i % 4 !== 3 && 'md:border-e md:border-white/20',
            )}
          >
            <div className="text-3xl md:text-4xl font-bold tabular-nums">
              <StatCounter end={s.end} suffix={s.suffix} />
            </div>
            <p className="mt-1 text-xs text-white/75 uppercase tracking-wider">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
