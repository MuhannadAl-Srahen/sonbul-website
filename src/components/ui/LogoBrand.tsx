import clsx from 'clsx';

interface Props {
  /** Set true on dark backgrounds — adds subtle drop-shadow glow instead of a wrapper */
  dark?: boolean;
  className?: string;
}

export default function LogoBrand({ dark = false, className }: Props) {
  return (
    <img
      src="/assets/logo/logo.png"
      alt="Abu Sonbul Transporters"
      className={clsx(
        'h-10 w-auto object-contain transition-all duration-300',
        dark && 'logo-dark-glow',
        className,
      )}
    />
  );
}
