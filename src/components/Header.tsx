import { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { SectionTheme } from '../types/portfolio';

interface NavLinkItem {
  id: string;
  label: string;
  theme: SectionTheme;
}

const NAV_LINKS: NavLinkItem[] = [
  { id: 'about', label: 'À propos', theme: 'coral' },
  { id: 'projects', label: 'Projets', theme: 'yellow' },
  { id: 'personality', label: 'Profil', theme: 'sage' },
  { id: 'contact', label: 'Contact', theme: 'pink' },
];

const THEME_ACCENT: Record<SectionTheme, string> = {
  cream: '#C94F7C',
  coral: '#D46D62',
  lilac: '#8B68C9',
  yellow: '#C99616',
  sage: '#5E7A44',
  pink: '#C94F7C',
};

const THEME_ACCENT_DARK: Record<SectionTheme, string> = {
  cream: '#F08AA8',
  coral: '#F09A8E',
  lilac: '#D2BFF7',
  yellow: '#F5D87A',
  sage: '#C5D9AA',
  pink: '#F08AA8',
};

interface HeaderProps {
  activeSection: string;
  activeTheme: SectionTheme;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (sectionId: string, theme: SectionTheme) => void;
}

export function Header({
  activeSection,
  activeTheme,
  darkMode,
  onToggleDarkMode,
  onNavigate,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const accentColor = (darkMode ? THEME_ACCENT_DARK : THEME_ACCENT)[activeTheme];
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 30,
    restDelta: 0.001,
  });

  const handleLinkClick = (id: string, theme: SectionTheme) => {
    setMobileOpen(false);
    onNavigate(id, theme);
  };

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-4 sm:px-6">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 overflow-hidden rounded-full border border-[#252525]/10 bg-[#F5EBDD]/85 px-5 py-2.5 shadow-[0_12px_32px_-12px_rgba(37,37,37,0.12)] backdrop-blur-md transition-colors duration-500 dark:border-[#F5EBDD]/15 dark:bg-[#24201E]/88 dark:shadow-[0_14px_36px_-12px_rgba(0,0,0,0.55)]">
        {/* Scroll Progress Accent Ribbon */}
        <motion.div
          aria-hidden="true"
          style={{
            scaleX: smoothProgress,
            transformOrigin: '0% 50%',
            background: darkMode
              ? 'linear-gradient(90deg, #E7A49B, #F08AA8, #D2BFF7, #F5D87A)'
              : 'linear-gradient(90deg, #E7A49B, #C94F7C, #8B68C9, #F1D16F)',
          }}
          className="pointer-events-none absolute right-6 bottom-0 left-6 h-[2.5px] rounded-full opacity-85"
        />

        {/* Zone 1: Single-line Brand Wordmark */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.04, rotate: -1.5 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => handleLinkClick('hero', 'cream')}
          className="font-display text-base sm:text-xl font-bold tracking-tight text-[#252525] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94F7C] rounded-full px-1 cursor-pointer dark:text-[#F5EBDD] dark:focus-visible:ring-[#F08AA8]"
        >
          PIGEON-SCHNEIDER
        </motion.button>

        {/* Zone 2: 5 single-line nav links with elastic sliding underline */}
        <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id, item.theme)}
                className="group relative py-1.5 text-sm font-medium text-[#252525]/85 transition-colors hover:text-[#252525] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94F7C] rounded cursor-pointer dark:text-[#F5EBDD]/80 dark:hover:text-[#F5EBDD]"
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="headerNavUnderline"
                    aria-hidden="true"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className="absolute right-0 bottom-0 left-0 h-[2.5px] rounded-full"
                    style={{
                      backgroundColor: (darkMode ? THEME_ACCENT_DARK : THEME_ACCENT)[item.theme],
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: CTA + Smooth Dark Mode Switch */}
        <div className="flex items-center gap-2.5 shrink-0">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            onClick={() => handleLinkClick('contact', 'pink')}
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#252525] px-5 py-2 text-xs font-medium text-white hover:bg-[#383838] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94F7C] cursor-pointer dark:bg-[#F5EBDD] dark:text-[#252525] dark:hover:bg-[#FFFDF9]"
          >
            Alternance 2026–2028
          </motion.button>

          {/* Smooth Tactile Dark Mode Toggle Switch (top-right) */}
          <button
            type="button"
            role="switch"
            aria-checked={darkMode}
            aria-label={darkMode ? 'Passer au mode clair' : 'Passer au mode sombre'}
            title={darkMode ? 'Mode clair' : 'Mode sombre'}
            onClick={onToggleDarkMode}
            data-cursor={darkMode ? 'Clair' : 'Sombre'}
            className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border p-1 transition-colors duration-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94F7C] cursor-pointer ${
              darkMode
                ? 'border-[#CDB8F0]/35 bg-[#31283B] shadow-[inset_0_2px_6px_rgba(0,0,0,0.45)]'
                : 'border-[#252525]/15 bg-[#EFE2CE] shadow-[inset_0_2px_5px_rgba(37,37,37,0.08)]'
            }`}
          >
            <Sun
              aria-hidden="true"
              className={`pointer-events-none absolute left-2 h-3 w-3 transition-opacity duration-300 ${
                darkMode ? 'text-[#F5EBDD]/40 opacity-50' : 'opacity-0'
              }`}
            />
            <Moon
              aria-hidden="true"
              className={`pointer-events-none absolute right-2 h-3 w-3 transition-opacity duration-300 ${
                darkMode ? 'opacity-0' : 'text-[#252525]/35 opacity-60'
              }`}
            />
            <motion.span
              animate={{ x: darkMode ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-colors duration-300 ${
                darkMode
                  ? 'bg-[#CDB8F0] text-[#211C29]'
                  : 'bg-[#F1D16F] text-[#252525]'
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {darkMode ? (
                  <motion.span
                    key="moon"
                    initial={{ rotate: -65, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 65, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="flex items-center justify-center"
                  >
                    <Moon className="h-3.5 w-3.5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="sun"
                    initial={{ rotate: 65, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -65, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="flex items-center justify-center"
                  >
                    <Sun className="h-3.5 w-3.5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#252525]/15 bg-white/70 text-[#252525] md:hidden cursor-pointer dark:border-[#F5EBDD]/20 dark:bg-[#2F2A27] dark:text-[#F5EBDD]"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            className="mx-auto mt-2 max-w-6xl rounded-3xl border border-[#252525]/10 bg-[#F5EBDD]/95 p-4 shadow-xl backdrop-blur-lg md:hidden dark:border-[#F5EBDD]/15 dark:bg-[#24201E]/95"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleLinkClick(item.id, item.theme)}
                    className="flex min-h-[44px] items-center justify-between rounded-2xl px-4 py-2 text-left text-base font-medium text-[#252525] transition-colors hover:bg-white/60 dark:text-[#F5EBDD] dark:hover:bg-white/8"
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      />
                    )}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => handleLinkClick('contact', 'pink')}
                className="mt-2 flex min-h-[44px] items-center justify-center rounded-full bg-[#252525] px-5 py-2.5 text-sm font-medium text-white dark:bg-[#F5EBDD] dark:text-[#252525]"
              >
                Alternance 2026–2028
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
