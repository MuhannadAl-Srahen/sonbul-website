import { ALL_LOGOS, logoSrc } from '../../data/clientLogos';

interface Props {
  /** Logo basenames; defaults to the full group set. See logosFor() in clientLogos.ts. */
  logos?: string[];
}

export default function ClientSlider({ logos: names = ALL_LOGOS }: Props) {
  const logos = names.map(logoSrc);
  return (
    <div className="marquee-fade overflow-hidden">
      <div className="marquee-track flex gap-10 w-max py-3">
        {[...logos, ...logos].map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex items-center justify-center w-32 h-14"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="max-h-10 w-auto h-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 select-none"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
