interface KineticMarqueeProps {
  items: string[];
  reverse?: boolean;
  tilt?: number;
  bgClass?: string;
  accentColor?: string;
  reducedMotion: boolean;
}

export function KineticMarquee({
  items,
  reverse = false,
  tilt = -1,
  bgClass = 'bg-white/65 dark:bg-[#2A2523]/75',
  accentColor = '#C94F7C',
  reducedMotion,
}: KineticMarqueeProps) {
  const repeated = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className="relative z-10 overflow-hidden py-5 select-none"
    >
      <div
        style={{
          transform: reducedMotion ? 'none' : `rotate(${tilt}deg) scale(1.02)`,
        }}
        className={`marquee-wrapper border-y border-[#252525]/10 dark:border-[#F5EBDD]/15 ${bgClass} py-3.5 shadow-[0_10px_28px_-16px_rgba(37,37,37,0.12)] backdrop-blur-md transition-colors duration-500`}
      >
        <div
          className={
            reducedMotion
              ? 'flex flex-wrap justify-center gap-x-6 gap-y-2 px-4'
              : reverse
              ? 'animate-marquee-reverse items-center'
              : 'animate-marquee items-center'
          }
        >
          {(reducedMotion ? items : repeated).map((phrase, idx) => (
            <span
              key={`${phrase}-${idx}`}
              className="inline-flex items-center gap-6 px-4 whitespace-nowrap"
            >
              <span
                className={
                  idx % 2 === 0
                    ? 'font-display text-sm font-bold tracking-wide text-[#252525] dark:text-[#F5EBDD] sm:text-base'
                    : 'font-hand text-xl font-bold sm:text-2xl'
                }
                style={idx % 2 !== 0 ? { color: accentColor } : undefined}
              >
                {phrase}
              </span>
              <span className="text-xs" style={{ color: accentColor }}>
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
