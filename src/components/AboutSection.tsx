import { useRef } from 'react';
import { Compass, ExternalLink, Layers, Scale } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { TIMELINE_ITEMS } from '../data/initialPortfolio';
import { MediaAsset } from '../types/portfolio';
import { EditorialImageSlot } from './EditorialImageSlot';
import { RecommendationsBlock } from './RecommendationsBlock';
import { ScrollReveal } from './ScrollReveal';

interface AboutSectionProps {
  portrait: MediaAsset | null;
  reducedMotion: boolean;
  darkMode?: boolean;
}

const RECRUITER_PILLARS = [
  {
    number: '01',
    icon: Scale,
    badge: 'Transfert de compétences',
    title: 'Double culture : juridique & marketing',
    lead: 'Je ne repars pas de zéro : je transfère des réflexes solides.',
    body: "Dans mon parcours juridique, j’ai développé de solides capacités d’analyse, de recherche documentaire et de rédaction exigeante. Aujourd’hui, je mets cette rigueur au service d’une nouvelle orientation professionnelle : structurer un argumentaire de marque, fiabiliser une veille et clarifier des messages complexes.",
    tapeColor: '#E7A49B',
    surface: 'rgba(231, 164, 155, 0.24)',
    darkSurface: 'rgba(231, 164, 155, 0.14)',
    accentColor: '#C94F7C',
    darkAccentColor: '#F08AA8',
    rotate: -1.4,
  },
  {
    number: '02',
    icon: Compass,
    badge: 'Stratégie marketing pure',
    title: 'Analyser l’offre, trouver la cible, définir comment vendre',
    lead: 'Comprendre le produit ou service avant même de créer.',
    body: "Ce que je vise, c’est la stratégie marketing pure : décrypter ce que l’on vend, chercher à qui le vendre, trouver comment convaincre et bâtir le plan d’action. Mes travaux sur les innovations immersives, mon projet scolaire L’Épifemme (exercice noté) et mes analyses marketing illustrent cette démarche complète.",
    tapeColor: '#CDB8F0',
    surface: 'rgba(205, 184, 240, 0.28)',
    darkSurface: 'rgba(205, 184, 240, 0.14)',
    accentColor: '#6F4FA6',
    darkAccentColor: '#D2BFF7',
    rotate: 1.2,
  },
  {
    number: '03',
    icon: Layers,
    badge: 'Direction de campagne',
    title: 'Créer la ligne directrice des visuels & vidéos publicitaires',
    lead: 'Construire un univers cohérent de la stratégie jusqu’à l’écran.',
    body: "C’est ce qui relie ma pensée stratégique à ma sensibilité créative : définir le cap éditorial et esthétique des campagnes pour que chaque mot, chaque visuel, chaque couleur, chaque vidéo publicitaire et chaque expérience client racontent la même histoire.",
    tapeColor: '#F1D16F',
    surface: 'rgba(241, 209, 111, 0.28)',
    darkSurface: 'rgba(241, 209, 111, 0.14)',
    accentColor: '#8D690B',
    darkAccentColor: '#F5D87A',
    rotate: -1.1,
  },
];

export function AboutSection({ portrait, reducedMotion, darkMode = false }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const portraitDriftY = useTransform(scrollYProgress, [0, 1], [35, -35]);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden py-20 sm:py-28">
      {/* Subtle animated "fil rouge" SVG doodle behind the story */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 260"
        fill="none"
        className="pointer-events-none absolute top-14 left-0 hidden w-full opacity-25 dark:opacity-20 lg:block"
      >
        <motion.path
          d="M-40 160 C 210 20, 460 240, 740 110 C 940 15, 1080 180, 1240 80"
          stroke={darkMode ? '#F08AA8' : '#C94F7C'}
          strokeWidth="3"
          strokeDasharray="10 10"
          strokeLinecap="round"
          initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top Story Bridge */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className="lg:col-span-7"
          >
            <p className="font-hand text-2xl font-bold text-[#C94F7C] dark:text-[#F08AA8] sm:text-3xl">
              01. Parcours &amp; fil rouge
            </p>
            <h2 className="font-display headline-balance mt-2 text-4xl font-bold tracking-tight text-[#252525] dark:text-[#F5EBDD] sm:text-5xl">
              Hello, it&rsquo;s me!
            </h2>
            <p className="mt-4 font-display text-xl font-semibold leading-snug text-[#252525] dark:text-[#F5EBDD]">
              Mon objectif : faire de la stratégie marketing pure, de l&rsquo;analyse du produit ou
              du service jusqu&rsquo;à la ligne directrice des campagnes visuelles et vidéo.
            </p>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-[#252525]/85 dark:text-[#F5EBDD]/82">
              <p>
                Passer du droit au marketing n&rsquo;est pas une rupture, c&rsquo;est un transfert
                de compétences assumé. Mon parcours juridique m&rsquo;a appris à mener des
                recherches poussées, à analyser des situations complexes et à rédiger avec rigueur.
                Aujourd&rsquo;hui, je mets cette méthode au service de la stratégie marketing :
                comprendre précisément le produit ou le service à vendre, identifier à qui le vendre
                et construire la meilleure façon de le proposer.
              </p>
              <p>
                Mes travaux sur les <strong>innovations immersives</strong>, mon projet scolaire{' '}
                <strong>L&rsquo;Épifemme</strong> (exercice noté), mes analyses marketing et mes créations
                visuelles traduisent cette vision : ne pas s&rsquo;arrêter au constat, mais tracer
                la <strong>ligne directrice des visuels et des vidéos publicitaires</strong> pour
                que mots, images, couleurs, message et expérience composent un univers irrésistible.
              </p>
            </div>
          </motion.div>

          {/* Persistent Portrait Continuity Card with scroll parallax drift */}
          <motion.div
            style={reducedMotion ? undefined : { y: portraitDriftY }}
            className="lg:col-span-5"
          >
            <div className="mx-auto max-w-[330px]">
              <EditorialImageSlot
                asset={portrait}
                fallbackTitle="Cédrine — Le fil rouge"
                fallbackHint="Analyser, relier les personnes, donner du sens"
                variant="portrait"
                defaultRotate={-2.5}
                tapeColor="#F1D16F"
                aspectClass="aspect-[4/4.5]"
              />
              <p className="font-hand mt-4 text-center text-xl text-[#252525]/80 dark:text-[#F5EBDD]/80">
                « Ne jamais séparer le fond stratégique de la forme sensible. »
              </p>
            </div>
          </motion.div>
        </div>

        {/* 3 Persuasive Recruiter Pillars */}
        <ScrollReveal reducedMotion={reducedMotion} parallax className="mt-16 sm:mt-20">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="font-hand text-2xl font-bold text-[#C94F7C] dark:text-[#F08AA8]">
                Ce que j&rsquo;apporte à votre équipe
              </p>
              <h3 className="font-display text-2xl font-bold text-[#252525] dark:text-[#F5EBDD] sm:text-3xl">
                Trois forces complémentaires pour vos enjeux de marque
              </h3>
            </div>
            <span className="font-hand text-xl text-[#252525]/75 dark:text-[#F5EBDD]/75">
              Fond · Forme · Cohérence
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {RECRUITER_PILLARS.map((pillar, index) => {
              const Icon = pillar.icon;
              const currentAccent = darkMode ? pillar.darkAccentColor : pillar.accentColor;
              return (
                <motion.article
                  key={pillar.number}
                  initial={
                    reducedMotion
                      ? false
                      : { opacity: 0, y: 28, rotate: pillar.rotate * 2 }
                  }
                  whileInView={{ opacity: 1, y: 0, rotate: pillar.rotate }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: index * 0.08 }}
                  style={{
                    backgroundColor: darkMode ? pillar.darkSurface : pillar.surface,
                  }}
                  className="relative flex flex-col justify-between rounded-[26px] border border-white/90 p-7 shadow-[0_18px_38px_-16px_rgba(37,37,37,0.13)] backdrop-blur-md transition-colors duration-400 dark:border-[#F5EBDD]/15"
                >
                  {/* Washi Tape */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-2.5 left-9 h-5 w-16 -rotate-2 rounded-sm opacity-90 shadow-xs"
                    style={{ backgroundColor: pillar.tapeColor }}
                  />

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="gloss-object flex h-11 w-11 items-center justify-center rounded-2xl border border-white/85 bg-white/80 dark:border-[#F5EBDD]/20 dark:bg-[#24201E]/85"
                        style={{ color: currentAccent }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-hand text-xl font-bold text-[#252525]/75 dark:text-[#F5EBDD]/75">
                        {pillar.number} · {pillar.badge}
                      </span>
                    </div>

                    <h4 className="font-display mt-5 text-xl font-bold leading-snug text-[#252525] dark:text-[#F5EBDD]">
                      {pillar.title}
                    </h4>

                    <p
                      className="font-hand mt-2 text-xl font-bold leading-snug"
                      style={{ color: currentAccent }}
                    >
                      {pillar.lead}
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-[#252525]/85 dark:text-[#F5EBDD]/82">
                      {pillar.body}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Scrapbook Collage Timeline */}
        <ScrollReveal reducedMotion={reducedMotion} yOffset={26} className="mt-16 sm:mt-20">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="font-display text-2xl font-bold text-[#252525] dark:text-[#F5EBDD] sm:text-3xl">
              La frise de mon parcours
            </h3>
            <span className="font-hand text-xl text-[#252525]/75 dark:text-[#F5EBDD]/75">
              Carnet de route 2013 → 2028
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TIMELINE_ITEMS.map((step, index) => (
              <motion.article
                key={`${step.period}-${step.label}`}
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, y: 22, rotate: step.rotate * 1.5 }
                }
                whileInView={{ opacity: 1, y: 0, rotate: step.rotate }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  type: 'spring',
                  stiffness: 270,
                  damping: 20,
                  delay: Math.min(index * 0.04, 0.25),
                }}
                className={`relative rounded-[22px] p-6 transition-colors duration-400 ${
                  step.highlight
                    ? 'bg-[#252525] text-white shadow-[0_22px_42px_-16px_rgba(37,37,37,0.45)] dark:border dark:border-[#E7A49B]/40 dark:bg-[#35242B]'
                    : 'border border-white bg-white/85 text-[#252525] shadow-[0_14px_30px_-14px_rgba(37,37,37,0.12)] backdrop-blur-sm dark:border-[#F5EBDD]/15 dark:bg-[#2B2624]/90 dark:text-[#F5EBDD]'
                }`}
              >
                {/* Washi tape */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2.5 left-8 h-5 w-16 -rotate-2 rounded-sm opacity-90 shadow-xs"
                  style={{ backgroundColor: step.tapeColor }}
                />

                <div className="flex items-center justify-between gap-2 text-xs">
                  <span
                    className={`font-semibold tabular-nums ${
                      step.highlight ? 'text-[#F1D16F]' : 'text-[#C94F7C] dark:text-[#F08AA8]'
                    }`}
                  >
                    {step.period}
                  </span>
                  <span
                    className={`${
                      step.highlight ? 'text-white/70' : 'text-[#252525]/60 dark:text-[#F5EBDD]/65'
                    }`}
                  >
                    {step.place}
                  </span>
                </div>

                <h4 className="font-display mt-2.5 text-lg font-semibold leading-snug">
                  {step.label}
                </h4>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p
                    className={`font-hand text-lg ${
                      step.highlight ? 'text-[#E7B6C5]' : 'text-[#252525]/70 dark:text-[#F5EBDD]/75'
                    }`}
                  >
                    {step.tag}
                  </p>

                  {step.url && (
                    <a
                      href={step.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#F1D16F] underline underline-offset-4 hover:text-white"
                    >
                      <span>Voir la formation</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </ScrollReveal>

        {/* Recommendation Letters */}
        <ScrollReveal reducedMotion={reducedMotion} yOffset={26} className="mt-16 sm:mt-20">
          <RecommendationsBlock reducedMotion={reducedMotion} />
        </ScrollReveal>
      </div>
    </section>
  );
}
