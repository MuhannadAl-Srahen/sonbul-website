import type { CompanyId } from '../../data/companies';

/**
 * The glyph that follows the red rule before a hero eyebrow.
 *
 * One of the quiet signals that tells you which company you are on without introducing
 * a second brand colour: one bar, two bars, or a bar and a dot.
 */
export default function EyebrowRule({ company }: { company: CompanyId }) {
  if (company === 'project-services') {
    return (
      <span className="inline-flex flex-col gap-[3px]">
        <span className="h-[2px] w-3 bg-primary" />
        <span className="h-[2px] w-3 bg-primary" />
      </span>
    );
  }
  if (company === 'logistics') return <span className="h-[5px] w-[5px] rounded-full bg-primary" />;
  return null;
}
