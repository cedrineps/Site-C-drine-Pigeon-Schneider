import { AnimatePresence, motion } from 'motion/react';
import { SectionTheme } from '../types/portfolio';

const SWEEP_COLORS: Record<SectionTheme, string> = {
  cream: '#F5EBDD',
  coral: '#F4CECA',
  lilac: '#DED0F7',
  yellow: '#F8E39D',
  sage: '#D9E1CC',
  pink: '#F2CAD7',
};

const SWEEP_COLORS_DARK: Record<SectionTheme, string> = {
  cream: '#2A2522',
  coral: '#352524',
  lilac: '#2B2336',
  yellow: '#332B1A',
  sage: '#232B21',
  pink: '#35232B',
};

interface ColorSweepTransitionProps {
  sweepTheme: SectionTheme | null;
  reducedMotion: boolean;
  darkMode?: boolean;
}

export function ColorSweepTransition({
  sweepTheme,
  reducedMotion,
  darkMode = false,
}: ColorSweepTransitionProps) {
  if (reducedMotion) return null;

  const palette = darkMode ? SWEEP_COLORS_DARK : SWEEP_COLORS;

  return (
    <AnimatePresence>
      {sweepTheme && (
        <motion.div
          key={sweepTheme}
          aria-hidden="true"
          initial={{ y: '100%', opacity: 0.96 }}
          animate={{ y: '0%', opacity: 0.96 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed inset-0 z-[80]"
          style={{ backgroundColor: palette[sweepTheme] }}
        >
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="absolute -top-24 left-0 h-24 w-full"
          >
            <path
              d="M0,120 C360,20 1080,20 1440,120 L1440,120 L0,120 Z"
              fill={palette[sweepTheme]}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
