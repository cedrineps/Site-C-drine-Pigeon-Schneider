import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { SectionTheme } from '../types/portfolio';

const CURSOR_COLORS: Record<SectionTheme, string> = {
  cream: '#C94F7C',
  coral: '#D46D62',
  lilac: '#8B68C9',
  yellow: '#C99616',
  sage: '#5E7A44',
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
  const ringX = useSpring(rawX, { stiffness: 360, damping: 28, mass: 0.45 });
  const ringY = useSpring(rawY, { stiffness: 360, damping: 28, mass: 0.45 });

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
        setCursorLabel(labelEl?.dataset.cursor || null);
        const interactive = Boolean(
          target.closest('a, button, input, textarea, select, [role="button"], [data-interactive="true"]')
        );
        setIsInteractive(interactive || Boolean(labelEl));
      }
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [reducedMotion, rawX, rawY]);

  if (reducedMotion || !visible) return null;

  const color = (darkMode ? CURSOR_COLORS_DARK : CURSOR_COLORS)[activeTheme] || '#C94F7C';

  return (
    <>
      {/* Outer spring halo */}
      <motion.div
        aria-hidden="true"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: cursorLabel ? 1.85 : isInteractive ? 1.45 : 1,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        className="pointer-events-none fixed left-0 top-0 z-[90] -ml-4 -mt-4 hidden h-8 w-8 items-center justify-center rounded-full border-2 md:flex"
      >
        <div
          className="h-full w-full rounded-full transition-colors duration-300"
          style={{
            border: `2px solid ${color}`,
            backgroundColor: cursorLabel ? `${color}EE` : isInteractive ? `${color}22` : 'transparent',
          }}
        />
        {cursorLabel && (
          <span
            className={`absolute text-[7px] font-bold tracking-wider uppercase ${
              darkMode ? 'text-[#1E1B18]' : 'text-white'
            }`}
          >
            {cursorLabel}
          </span>
        )}
      </motion.div>

      {/* Crisp inner center dot */}
      {!cursorLabel && (
        <motion.div
          aria-hidden="true"
          style={{ x: rawX, y: rawY, backgroundColor: color }}
          animate={{ scale: isInteractive ? 0.5 : 1 }}
          className="pointer-events-none fixed left-0 top-0 z-[91] -ml-1 -mt-1 hidden h-2 w-2 rounded-full transition-colors duration-300 md:block"
        />
      )}
    </>
  );
}
