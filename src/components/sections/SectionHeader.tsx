import clsx from 'clsx';
import Reveal from '../ui/Reveal';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Centred by default so every section heading on the site reads the same way. */
  align?: 'start' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
}

/** The eyebrow + heading + lead block that appears a dozen times across the site. */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  tone = 'light',
  className,
}: Props) {
  const centered = align === 'center';
  return (
    <Reveal className={clsx('max-w-2xl', centered && 'mx-auto text-center', className)}>
      {eyebrow && <span className={clsx('eyebrow', centered && 'justify-center')}>{eyebrow}</span>}
      <h2 className={clsx('heading-lg mt-3', tone === 'dark' && '!text-white')}>{title}</h2>
      {subtitle && (
        <p className={clsx('lead mt-4', tone === 'dark' && '!text-white/70')}>{subtitle}</p>
      )}
    </Reveal>
  );
}
