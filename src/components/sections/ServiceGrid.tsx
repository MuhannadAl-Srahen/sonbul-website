import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import Reveal from '../ui/Reveal';

export interface ServiceItem {
  key: string;
  icon: LucideIcon;
  title: string;
  short: string;
  href?: string;
}

interface Props {
  items: ServiceItem[];
  /** Label revealed on hover under each tile. Omitted when a tile has no href. */
  moreLabel?: string;
}

/**
 * Wide columns are chosen so the tiles always fill their last row.
 *
 * The grid's hairlines are the container's background showing through a 1px gap, which
 * means any leftover cell renders as a grey block rather than as nothing. Picking a
 * column count that divides the item count is simpler than patching the gap with filler
 * elements at every breakpoint. Two columns at `sm` divides every even count we have.
 */
const wideColumns: Record<number, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
};

function columnsFor(count: number) {
  if (count % 4 === 0 && count >= 8) return 4;
  if (count % 3 === 0) return 3;
  if (count % 2 === 0) return 2;
  return 3;
}

/**
 * The gap-px mosaic that fills red on hover — the site's signature service block,
 * generalised out of the home page so all three companies share it.
 */
export default function ServiceGrid({ items, moreLabel }: Props) {
  const columns = columnsFor(items.length);
  // Odd counts cannot divide evenly; pad the last row so no grey cell shows.
  const fillers = (columns - (items.length % columns)) % columns;

  return (
    <div
      className={`grid sm:grid-cols-2 ${wideColumns[columns]} gap-px bg-ink-100 border border-ink-100 rounded-xl overflow-hidden`}
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        // Tiles without a destination are still cards, just not links.
        const Tag = item.href ? 'a' : 'div';
        return (
          <Reveal key={item.key} delay={i * 0.06}>
            <Tag
              {...(item.href ? { href: item.href } : {})}
              className="group relative block bg-white p-8 hover:bg-primary transition-colors duration-300 h-full"
            >
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 text-primary group-hover:bg-white/15 group-hover:text-white transition-colors">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-ink group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-ink-500 group-hover:text-white/75 leading-relaxed transition-colors">
                {item.short}
              </p>
              {item.href && (
                <div className="mt-6 flex items-center gap-2 text-primary text-sm font-semibold group-hover:text-white transition-colors">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {moreLabel}
                  </span>
                  <ArrowRight className="h-4 w-4 rtl-flip group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Tag>
          </Reveal>
        );
      })}
      {Array.from({ length: fillers }, (_, i) => (
        <div key={`filler-${i}`} className="hidden bg-white lg:block" aria-hidden />
      ))}
    </div>
  );
}
