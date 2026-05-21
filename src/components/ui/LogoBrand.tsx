interface Props {
  className?: string;
}

export default function LogoBrand({ className }: Props) {
  return (
    <img
      src="/assets/logo/logo.png"
      alt="Abu Sonbul Transporters"
      className={`h-10 w-auto object-contain${className ? ` ${className}` : ''}`}
    />
  );
}
