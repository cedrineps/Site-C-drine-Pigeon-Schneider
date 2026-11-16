import { useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Compass,
  Download,
  ExternalLink,
  Layers,
  Maximize2,
  PenTool,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { APPRENTICESHIP_DETAILS, PROFILE_CARDS, REPERES_ITEMS } from '../data/initialPortfolio';
import { MediaAsset, ProjectItem, SectionTheme } from '../types/portfolio';
import { EditorialImageSlot } from './EditorialImageSlot';
import { ImageLightbox } from './ImageLightbox';
import { ScrollReveal } from './ScrollReveal';

interface HeroSectionProps {
  portrait: MediaAsset | null;
  artisticPhoto: MediaAsset | null;
  featuredProjects: ProjectItem[];
  reducedMotion: boolean;
  darkMode?: boolean;
  onNavigate: (sectionId: string, theme: SectionTheme) => void;
  onSelectProject: (project: ProjectItem) => void;
}

const CARD_ICONS: Record<string, typeof Sparkles> = {
  creative: PenTool,
  stratege: Compass,
  organisee: Layers,
  relationnelle: Users,
};

const CARD_TARGETS: Record<string, { id: string; theme: SectionTheme }> = {
  creative: { id: 'inspiration', theme: 'lilac' },
  stratege: { id: 'projects', theme: 'yellow' },
  organisee: { id: 'about', theme: 'coral' },
  relationnelle: { id: 'contact', theme: 'pink' },
};

const DARK_CARD_STYLES: Record<string, { bg: string; border: string; accent: string }> = {
  creative: {
    bg: 'rgba(231, 164, 155, 0.16)',
    border: 'rgba(231, 164, 155, 0.35)',
    accent: '#F08AA8',
  },
  stratege: {
    bg: 'rgba(205, 184, 240, 0.16)',
    border: 'rgba(205, 184, 240, 0.36)',
    accent: '#D2BFF7',
  },
  organisee: {
    bg: 'rgba(217, 225, 204, 0.15)',
    border: 'rgba(217, 225, 204, 0.34)',
    accent: '#C5D9AA',
  },
  relationnelle: {
    bg: 'rgba(241, 209, 111, 0.16)',
    border: 'rgba(241, 209, 111, 0.35)',
    accent: '#F5D87A',
  },
};

export function HeroSection({
  portrait,
  artisticPhoto,
  featuredProjects,
  reducedMotion,
  darkMode = false,
  onNavigate,
  onSelectProject,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [heroLightbox, setHeroLightbox] = useState<{
    assets: MediaAsset[];
    index: number;
    title: string;
  } | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-linked parallax layers for light 3D shapes only
  const orbFastY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const orbSlowY = useTransform(scrollYProgress, [0, 1], [0, 45]);

  // Lightweight mouse parallax restricted strictly to floating 3D accents (never heavy photo frames)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 200, damping: 26 });
  const smoothY = useSpring(mouseY, { stiffness: 200, damping: 26 });
  const glossX = useTransform(smoothX, [-1, 1], [-14, 14]);
  const glossY = useTransform(smoothY, [-1, 1], [-12, 12]);

  const handleCollageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(nx);
    mouseY.set(ny);
  };

  const handleCollageLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-24"
    >
      {/* Pure CSS radial halos (0ms GPU blur filter overhead) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-6%] h-[540px] w-[540px] rounded-full opacity-70 dark:opacity-35"
        style={{
          background:
            'radial-gradient(circle at 45% 45%, rgba(231,164,155,0.65) 0%, rgba(231,182,197,0.45) 35%, rgba(205,184,240,0.28) 58%, transparent 72%)',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-36 -left-24 h-[420px] w-[420px] rounded-full opacity-60 dark:opacity-25"
        style={{
          background:
            'radial-gradient(circle, rgba(241,209,111,0.5) 0%, rgba(246,201,163,0.3) 45%, transparent 72%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero Split */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Typography & CTAs */}
          <div className="relative z-10 lg:col-span-6">
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 12, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="font-hand inline-block -rotate-3 text-2xl font-bold text-[#C94F7C] dark:text-[#F08AA8] sm:text-3xl"
            >
              Create. Think. Grow.
            </motion.p>

            <motion.h1
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="font-display headline-balance mt-3 text-[2.65rem] leading-[1.05] font-bold tracking-tight text-[#252525] dark:text-[#F5EBDD] sm:text-[3.6rem] lg:text-[4.15rem]"
            >
              Bonjour, moi c&rsquo;est{' '}
              <span className="relative inline-block">
                <span className="text-cedrine-gradient italic">Cédrine</span>
                {/* Hand-drawn animated brush underline */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 220 18"
                  fill="none"
                  className="pointer-events-none absolute -bottom-2 left-0 w-full overflow-visible"
                >
                  <motion.path
                    d="M4 12C54 4 148 3 216 11"
                    stroke={darkMode ? '#F08AA8' : '#C94F7C'}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
              </span>{' '}
              !
            </motion.h1>

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 font-display text-xl font-semibold text-[#252525]/90 dark:text-[#F5EBDD]/90 sm:text-2xl"
            >
              Créative dans l&rsquo;âme, stratège dans la tête.
            </motion.p>

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-xl text-base leading-relaxed text-[#252525]/85 dark:text-[#F5EBDD]/82 sm:text-[17px]"
            >
              Issue du droit et du management, je me destine à la <strong>stratégie marketing pure</strong> :
              comprendre en profondeur le produit ou le service à vendre, identifier à qui et
              comment le vendre, puis tracer la ligne directrice des visuels et vidéos
              publicitaires pour donner une cohérence forte à chaque marque.
            </motion.p>

            {/* Primary & Secondary Pill CTAs */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <motion.button
                type="button"
                whileHover={reducedMotion ? undefined : { scale: 1.04, y: -2 }}
                whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 360, damping: 20 }}
                onClick={() => onNavigate('projects', 'yellow')}
                data-cursor="Explorer"
                className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-[#252525] px-7 py-3 text-sm font-medium text-white shadow-[0_14px_28px_-10px_rgba(37,37,37,0.45)] hover:bg-[#363636] whitespace-nowrap shrink-0 cursor-pointer dark:bg-[#F5EBDD] dark:text-[#252525] dark:hover:bg-[#FFFDF9]"
              >
                <span>Voir mes projets</span>
                <ArrowUpRight className="h-4 w-4" />
              </motion.button>

              <motion.a
                href="/api/cv"
                download="CV_de_Cédrine_PIGEON-SCHNEIDER.pdf"
                whileHover={reducedMotion ? undefined : { scale: 1.04, y: -2 }}
                whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 360, damping: 20 }}
                data-cursor="PDF"
                className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-[#252525]/15 bg-white px-7 py-3 text-sm font-medium text-[#252525] shadow-[0_12px_26px_-12px_rgba(37,37,37,0.16)] hover:bg-[#FFFBF6] whitespace-nowrap shrink-0 dark:border-[#F5EBDD]/20 dark:bg-[#2C2725] dark:text-[#F5EBDD] dark:hover:bg-[#36302D]"
              >
                <Download className="h-4 w-4 text-[#C94F7C] dark:text-[#F08AA8]" />
                <span>Télécharger mon CV</span>
              </motion.a>
            </motion.div>

            {/* Handwritten doodle annotation */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.38 }}
              className="mt-7 hidden items-center gap-2 text-[#252525]/65 dark:text-[#F5EBDD]/70 sm:flex"
            >
              <svg width="38" height="22" viewBox="0 0 38 22" fill="none" aria-hidden="true">
                <motion.path
                  d="M2 4C11 16 24 18 35 12M35 12L29 8M35 12L31 18"
                  stroke={darkMode ? '#F08AA8' : '#C94F7C'}
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.55 }}
                />
              </svg>
              <span className="font-hand text-xl text-[#252525]/80 dark:text-[#F5EBDD]/80">
                Du droit à la stratégie marketing
              </span>
            </motion.div>
          </div>

          {/* Right Column: Interactive Mouse-Parallax Portrait Collage + 3D Glossy Shapes */}
          <div
            onMouseMove={handleCollageMove}
            onMouseLeave={handleCollageLeave}
            className="relative z-10 lg:col-span-6"
          >
            <div className="relative mx-auto max-w-[460px] py-4 sm:py-6">
              {/* Background Color Halo directly behind portrait (pure radial gradient, zero blur filter) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 rounded-full opacity-90 dark:opacity-50"
                style={{
                  background:
                    'radial-gradient(circle at 50% 45%, rgba(231,164,155,0.65) 0%, rgba(231,182,197,0.45) 38%, rgba(205,184,240,0.28) 58%, transparent 72%)',
                }}
              />

              {/* Sculptural Glossy 3D Shape 1: Sparkle Tile */}
              <motion.div
                aria-hidden="true"
                style={reducedMotion ? undefined : { x: glossX, y: orbFastY }}
                animate={
                  reducedMotion
                    ? undefined
                    : { rotate: [12, 18, 12] }
                }
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="pointer-events-none absolute -top-2 -left-4 z-20 flex h-16 w-16 transform-gpu items-center justify-center rounded-2xl border border-white/85 bg-gradient-to-br from-[#F1D16F]/90 to-[#E7A49B]/85 shadow-lg dark:border-[#F5EBDD]/25 sm:-left-8"
              >
                <Sparkles className="h-6 w-6 text-[#252525]/75" />
              </motion.div>

              {/* Sculptural Glossy 3D Shape 2: Iridescent Pearl Orb */}
              <motion.div
                aria-hidden="true"
                style={reducedMotion ? undefined : { x: glossX, y: glossY }}
                animate={
                  reducedMotion
                    ? undefined
                    : { rotate: [-10, -18, -10] }
                }
                transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                className="pointer-events-none absolute top-14 -right-4 z-20 h-14 w-14 transform-gpu rounded-full border border-white/90 bg-gradient-to-tr from-[#CDB8F0]/90 via-[#E7B6C5]/85 to-white shadow-lg dark:border-[#F5EBDD]/25 sm:-right-6"
              />

              {/* Sculptural Glossy 3D Shape 3: Coral Floating Pill Capsule */}
              <motion.div
                aria-hidden="true"
                style={reducedMotion ? undefined : { x: glossX, y: orbSlowY }}
                animate={
                  reducedMotion
                    ? undefined
                    : { rotate: [-20, -12, -20] }
                }
                transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
                className="pointer-events-none absolute top-1/2 -left-8 z-20 hidden h-8 w-16 transform-gpu rounded-full border border-white/85 bg-gradient-to-r from-[#E7A49B]/90 to-[#F6C9A3]/90 shadow-md dark:border-[#F5EBDD]/25 sm:block"
              />

              {/* Sculptural Glossy 3D Shape 4: Sky Soft Ring */}
              <motion.div
                aria-hidden="true"
                animate={
                  reducedMotion ? undefined : { rotate: [0, 360] }
                }
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                className="pointer-events-none absolute -right-2 bottom-20 z-10 hidden h-12 w-12 transform-gpu rounded-full border-[5px] border-white/85 bg-[#B7D8F2]/55 shadow-md dark:border-[#F5EBDD]/30 sm:block"
              />

              {/* Main Natural Portrait Frame — snappy GPU-only entrance */}
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 mx-auto w-[84%] transform-gpu sm:w-[78%]"
              >
                <EditorialImageSlot
                  asset={portrait}
                  fallbackTitle="Portrait de Cédrine"
                  fallbackHint="Portrait naturel à publier depuis votre espace privé"
                  variant="portrait"
                  defaultRotate={1.8}
                  tapeColor="#E7A49B"
                  aspectClass="aspect-[4/5]"
                  priority
                />
              </motion.div>

              {/* Overlapping Artistic Makeup Collage Card — crisp GPU-only entrance */}
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-20 -mt-20 ml-auto w-[54%] transform-gpu sm:-mt-24 sm:w-[48%]"
              >
                <EditorialImageSlot
                  asset={artisticPhoto}
                  fallbackTitle="Regard artistique"
                  fallbackHint="Photo maquillage créatif"
                  variant="artistic"
                  defaultRotate={-4.5}
                  tapeColor="#CDB8F0"
                  aspectClass="aspect-square"
                  priority
                />
              </motion.div>

              {/* Handwritten floating sticker note */}
              <motion.div
                whileHover={reducedMotion ? undefined : { rotate: 0, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                className="pointer-events-auto absolute bottom-10 left-0 z-20 hidden -rotate-6 rounded-2xl border border-white/90 bg-white/95 px-3.5 py-2 shadow-sm dark:border-[#F5EBDD]/20 dark:bg-[#2C2725] sm:block"
              >
                <p className="font-hand text-lg leading-tight text-[#252525] dark:text-[#F5EBDD]">
                  Scrapbook &amp; stratégie ✦
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Below Hero 1: Apprenticeship Search Bar Pill with pulsing status */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className="mt-14 sm:mt-16"
        >
          <motion.button
            type="button"
            whileHover={reducedMotion ? undefined : { y: -3, scale: 1.01 }}
            whileTap={reducedMotion ? undefined : { scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            onClick={() => onNavigate('contact', 'pink')}
            data-cursor="Contact"
            className="group mx-auto flex w-full max-w-4xl flex-col items-start justify-between gap-3 rounded-3xl border border-white/85 bg-white/75 px-6 py-4 text-left shadow-[0_18px_40px_-16px_rgba(37,37,37,0.14)] backdrop-blur-md hover:bg-white/95 sm:flex-row sm:items-center sm:rounded-full sm:px-7 sm:py-3.5 cursor-pointer dark:border-[#F5EBDD]/15 dark:bg-[#2A2523]/80 dark:hover:bg-[#332D2A]"
          >
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#252525] text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105 dark:bg-[#F5EBDD] dark:text-[#252525]">
                <Search className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#252525] dark:text-[#F5EBDD] sm:text-base">
                  Je cherche une alternance de 2 ans
                </p>
                <p className="text-xs text-[#252525]/70 dark:text-[#F5EBDD]/70 sm:text-sm">
                  Mastère Stratégie Marketing · 2026–2028 · Chessy &amp; RER A jusqu&rsquo;à Paris
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#C94F7C] dark:text-[#F08AA8] whitespace-nowrap">
                <span className="relative flex h-2.5 w-2.5">
                  {!reducedMotion && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C94F7C] dark:bg-[#F08AA8] opacity-65" />
                  )}
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C94F7C] dark:bg-[#F08AA8]" />
                </span>
                Disponible immédiatement
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F5EBDD] text-[#252525] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:bg-[#3A3330] dark:text-[#F5EBDD]">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </motion.button>
        </motion.div>

        {/* Below Hero 2: Living Profile Summary + 4 Colored Glass Cards */}
        <div className="mt-16 sm:mt-20">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="font-hand text-2xl font-bold text-[#C94F7C] dark:text-[#F08AA8]">
              Cap sur la stratégie marketing pure
            </p>
            <h2 className="font-display headline-balance mt-2 text-2xl font-bold text-[#252525] dark:text-[#F5EBDD] sm:text-3xl">
              Comprendre l&rsquo;offre, cibler le marché et guider la création publicitaire
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#252525]/80 dark:text-[#F5EBDD]/80 sm:text-base">
              Mon parcours raconte un transfert de compétences concret : j&rsquo;unis la rigueur
              d&rsquo;analyse, de recherche et de rédaction acquise en droit à une vision globale du
              marketing — analyser le produit ou service à vendre, définir à qui et comment le
              proposer, bâtir la stratégie et poser la ligne directrice des visuels et vidéos
              publicitaires.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROFILE_CARDS.map((card, idx) => {
              const Icon = CARD_ICONS[card.id] || Sparkles;
              const target = CARD_TARGETS[card.id];
              const darkStyle = DARK_CARD_STYLES[card.id];
              return (
                <motion.button
                  key={card.id}
                  type="button"
                  initial={reducedMotion ? false : { opacity: 0, y: 24, rotate: idx % 2 === 0 ? -2 : 2 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={
                    reducedMotion
                      ? undefined
                      : { y: -8, rotate: idx % 2 === 0 ? -1.4 : 1.4, scale: 1.02 }
                  }
                  whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: idx * 0.06,
                  }}
                  onClick={() => onNavigate(target.id, target.theme)}
                  data-cursor="Ouvrir"
                  style={{
                    backgroundColor: darkMode && darkStyle ? darkStyle.bg : card.bg,
                    borderColor: darkMode && darkStyle ? darkStyle.border : card.border,
                  }}
                  className="group flex flex-col justify-between rounded-[24px] border p-6 text-left backdrop-blur-md shadow-[0_14px_34px_-16px_rgba(37,37,37,0.12)] cursor-pointer transition-colors duration-400"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className="gloss-object flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/75 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 dark:border-[#F5EBDD]/20 dark:bg-[#24201E]/85"
                        style={{ color: darkMode && darkStyle ? darkStyle.accent : card.accent }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-[#252525]/55 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#252525] dark:text-[#F5EBDD]/60 dark:group-hover:text-[#F5EBDD]" />
                    </div>

                    <h3 className="font-display mt-5 text-xl font-bold text-[#252525] dark:text-[#F5EBDD]">
                      {card.title}
                    </h3>

                    <ul className="mt-3 space-y-2">
                      {card.points.map((point) => (
                        <li
                          key={point}
                          className="text-sm leading-snug text-[#252525]/85 dark:text-[#F5EBDD]/82"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Repères Bar */}
          <ScrollReveal reducedMotion={reducedMotion} delay={0.08} yOffset={16}>
            <div className="mt-8 border-y border-[#252525]/12 py-4 dark:border-[#F5EBDD]/15">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-xs font-medium text-[#252525]/80 dark:text-[#F5EBDD]/80 sm:text-sm">
                {REPERES_ITEMS.map((item, idx) => (
                  <span key={item} className="inline-flex items-center gap-4">
                    {idx === 0 ? (
                      <a
                        href={APPRENTICESHIP_DETAILS.formationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 underline decoration-[#C94F7C]/60 underline-offset-4 transition-colors hover:text-[#C94F7C] dark:decoration-[#F08AA8]/60 dark:hover:text-[#F08AA8]"
                      >
                        <span>{item}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    ) : (
                      <span>{item}</span>
                    )}
                    {idx < REPERES_ITEMS.length - 1 && (
                      <span aria-hidden="true" className="text-[#252525]/35 dark:text-[#F5EBDD]/35">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Below Hero 3: Recent Projects Preview */}
        <ScrollReveal reducedMotion={reducedMotion} yOffset={30} className="mt-16 sm:mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-hand text-2xl font-bold text-[#C94F7C] dark:text-[#F08AA8]">
                Aperçu des réalisations
              </p>
              <h2 className="font-display text-2xl font-bold text-[#252525] dark:text-[#F5EBDD] sm:text-3xl">
                Projets récents &amp; cas pratiques
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('projects', 'yellow')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#252525] underline decoration-[#C94F7C] decoration-2 underline-offset-4 transition-colors hover:text-[#C94F7C] cursor-pointer dark:text-[#F5EBDD] dark:decoration-[#F08AA8] dark:hover:text-[#F08AA8]"
            >
              <span>Explorer toute la galerie</span>
              <ArrowDownRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredProjects.slice(0, 3).map((project, idx) => {
              const firstVisual = project.visuals[0];
              return (
                <motion.article
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectProject(project);
                    }
                  }}
                  initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={
                    reducedMotion
                      ? undefined
                      : { y: -8, rotate: idx === 1 ? 0.6 : -0.8, scale: 1.015 }
                  }
                  whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: idx * 0.08 }}
                  onClick={() => onSelectProject(project)}
                  data-cursor="Voir"
                  className="glass-card group flex flex-col justify-between rounded-[24px] p-5 text-left cursor-pointer"
                >
                  <div>
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#F5EBDD] dark:bg-[#211D1B]">
                      {firstVisual ? (
                        <>
                          <img
                            src={firstVisual.url}
                            alt={firstVisual.alt || project.title}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            draggable={false}
                            className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-108"
                          />
                          <button
                            type="button"
                            aria-label={`Voir les visuels de ${project.title} en grand`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setHeroLightbox({
                                assets: project.visuals,
                                index: 0,
                                title: project.title,
                              });
                            }}
                            className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-full border border-white/40 bg-[#252525]/65 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm transition-transform hover:scale-105 hover:bg-[#252525] cursor-pointer"
                          >
                            <Maximize2 className="h-3 w-3" />
                            <span>Voir en grand</span>
                          </button>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute right-2 bottom-2 max-w-[92%] truncate rounded-full border border-white/25 bg-[#252525]/45 px-2.5 py-0.5 text-[10px] font-medium text-white/95 select-none"
                          >
                            © Cédrine Pigeon-Schneider · Création originale
                          </span>
                        </>
                      ) : (
                        <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#FAF0CC] via-[#F5EBDD] to-[#E7A49B]/45 p-4 dark:from-[#3D3520] dark:via-[#2B2523] dark:to-[#442D2A]">
                          <span className="font-hand text-lg text-[#252525]/70 dark:text-[#F5EBDD]/75">
                            {project.category}
                          </span>
                          <p className="font-display text-base font-semibold text-[#252525] dark:text-[#F5EBDD]">
                            {project.deliverables.join(' · ')}
                          </p>
                        </div>
                      )}
                    </div>

                    <p className="mt-4 text-xs font-medium text-[#252525]/65 dark:text-[#F5EBDD]/65">
                      {project.category} · {project.context}
                    </p>
                    <h3 className="font-display mt-1.5 text-lg font-bold text-[#252525] group-hover:text-[#C94F7C] transition-colors dark:text-[#F5EBDD] dark:group-hover:text-[#F08AA8]">
                      {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#252525]/80 dark:text-[#F5EBDD]/80">
                      {project.idea}
                    </p>
                  </div>

                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#252525] dark:text-[#F5EBDD]">
                    <span>Lire l&rsquo;étude de cas</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </ScrollReveal>
      </div>

      <ImageLightbox
        assets={heroLightbox?.assets || []}
        currentIndex={heroLightbox ? heroLightbox.index : null}
        contextTitle={heroLightbox?.title}
        onClose={() => setHeroLightbox(null)}
        onChangeIndex={(nextIndex) =>
          setHeroLightbox((prev) => (prev ? { ...prev, index: nextIndex } : null))
        }
      />
    </section>
  );
}
