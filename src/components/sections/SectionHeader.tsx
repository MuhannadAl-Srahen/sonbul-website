import clsx from 'clsx';
import Reveal from '../ui/Reveal';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'start' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
}

/** The eyebrow + heading + lead block that appears a dozen times across the site. */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'start',
  tone = 'light',
  className,
}: Props) {
  return (
    <Reveal
      className={clsx(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className={clsx('heading-lg mt-3', tone === 'dark' && '!text-white')}>{title}</h2>
      {subtitle && (
        <p className={clsx('lead mt-4', tone === 'dark' && '!text-white/70')}>{subtitle}</p>
      )}
    </Reveal>
  );
}
