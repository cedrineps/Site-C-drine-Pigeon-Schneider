import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { SectionTheme } from '../types/portfolio';

const CURSOR_COLORS: Record<SectionTheme, string> = {
  cream: '#C94F7C',
  coral: '#C45347',
  lilac: '#6F4FA6',
  yellow: '#8D690B',
  sage: '#4F6638',
  pink: '#C94F7C',
};

const CURSOR_COLORS_DARK: Record<SectionTheme, string> = {
  cream: '#F08AA8',
  coral: '#F09A8E',
  lilac: '#D2BFF7',
  yellow: '#F5D87A',
  sage: '#C5D9AA',
  pink: '#F08AA8',
};

interface CustomCursorProps {
  activeTheme: SectionTheme;
  reducedMotion: boolean;
  darkMode?: boolean;
}

export function CustomCursor({ activeTheme, reducedMotion, darkMode = false }: CustomCursorProps) {
  const [visible, setVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const ringX = useSpring(rawX, { stiffness: 380, damping: 30, mass: 0.4 });
  const ringY = useSpring(rawY, { stiffness: 380, damping: 30, mass: 0.4 });

  useEffect(() => {
    if (reducedMotion) return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) return;

    const handleMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);
      const target = e.target as HTMLElement | null;
      if (target) {
        const labelEl = target.closest('[data-cursor]') as HTMLElement | null;
        const nextLabel = labelEl?.dataset.cursor?.trim() || null;
        setCursorLabel(nextLabel);
        const interactive = Boolean(
          target.closest(
            'a, button, input, textarea, select, [role="button"], [data-interactive="true"]'
          )
        );
        setIsInteractive(interactive || Boolean(nextLabel));
      }
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('blur', handleLeave);
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('blur', handleLeave);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [reducedMotion, rawX, rawY]);

  if (reducedMotion || !visible) return null;

  const color = (darkMode ? CURSOR_COLORS_DARK : CURSOR_COLORS)[activeTheme] || '#C94F7C';

  return (
    <>
      {/* Outer spring follower: never uses CSS scale() on text and never nests overlapping borders */}
      <motion.div
        aria-hidden="true"
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden md:block"
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <AnimatePresence mode="wait" initial={false}>
            {cursorLabel ? (
              <motion.div
                key="cursor-pill"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.14, ease: 'easeOut' }}
                style={{
                  backgroundColor: color,
                  borderColor: darkMode ? 'rgba(30, 27, 24, 0.25)' : 'rgba(255, 255, 255, 0.5)',
                }}
                className="flex items-center justify-center rounded-full border-[1.5px] px-3 py-1.5 shadow-[0_8px_20px_-6px_rgba(37,37,37,0.35)]"
              >
                <span
                  className={`block whitespace-nowrap text-[11px] leading-none font-bold tracking-[0.07em] uppercase antialiased ${
                    darkMode ? 'text-[#1E1B18]' : 'text-white'
                  }`}
                >
                  {cursorLabel}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="cursor-ring"
                initial={false}
                animate={{
                  width: isInteractive ? 38 : 26,
                  height: isInteractive ? 38 : 26,
                  borderColor: color,
                  backgroundColor: isInteractive ? `${color}1F` : 'rgba(0,0,0,0)',
                }}
                transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                className="rounded-full border-[1.75px]"
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Crisp inner center dot when no word pill is shown */}
      {!cursorLabel && (
        <motion.div
          aria-hidden="true"
          style={{ x: rawX, y: rawY, backgroundColor: color }}
          animate={{ scale: isInteractive ? 0.55 : 1 }}
          transition={{ duration: 0.14 }}
          className="pointer-events-none fixed left-0 top-0 z-[91] -ml-1 -mt-1 hidden h-2 w-2 rounded-full md:block"
        />
      )}
    </>
  );
}
