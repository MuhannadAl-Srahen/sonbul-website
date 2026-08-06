import Reveal from '../ui/Reveal';

export interface Feature {
  key: string;
  title: string;
  body: string;
}

interface Props {
  items: Feature[];
}

/**
 * The dark numbered feature list from the home "why us" block, standing alone so a
 * company page can carry it without the paired image.
 */
export default function FeatureGrid({ items }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
      {items.map((item, i) => (
        <Reveal key={item.key} delay={i * 0.08}>
          <div className="flex gap-4">
            <span className="flex-shrink-0 text-sm font-bold tabular-nums text-primary-300 pt-1">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="text-lg font-bold !text-white">{item.title}</h3>
              <p className="mt-2 text-sm !text-white/65 leading-relaxed">{item.body}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
