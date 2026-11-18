import { BookOpen, Globe, Music, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface PersonalitySectionProps {
  reducedMotion: boolean;
}

const INTERESTS = [
  {
    icon: BookOpen,
    title: 'Écriture',
    detail: 'Projet de publication en cours — le goût des mots justes, des histoires construites et du style.',
    note: 'Carnet & manuscrit',
  },
  {
    icon: Music,
    title: 'Musique',
    detail: 'Classique, jazz, pop, rock — une écoute curieuse qui nourrit le rythme, les ambiances et la sensibilité.',
    note: 'Éclectisme & tempo',
  },
  {
    icon: Globe,
    title: 'Anglais · Niveau B1',
    detail: 'Compréhension et expression professionnelle pour suivre les tendances et échanges internationaux.',
    note: 'Ouverture',
  },
];

const QUALITIES = [
  {
    title: 'Analyse, recherche & rédaction',
    desc: 'Des réflexes acquis dans le juridique, aujourd’hui transférés pour structurer des études de marché et rédiger avec justesse.',
  },
  {
    title: 'Créativité & stratégie liées',
    desc: 'Imaginer un concept, penser son positionnement et concevoir ses supports visuels dans un même mouvement.',
  },
  {
    title: 'Construction d’univers cohérents',
    desc: 'Faire en sorte que mots, images, couleurs, message et expérience racontent exactement la même histoire.',
  },
  {
    title: 'Organisation & sens du collectif',
    desc: 'Tenir les délais, coordonner les équipes et savoir écouter pour trouver des solutions constructives.',
  },
];

export function PersonalitySection({ reducedMotion }: PersonalitySectionProps) {
  return (
    <section id="personality" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="max-w-2xl"
        >
          <p className="font-hand text-2xl font-bold text-[#4F6638] dark:text-[#C5D9AA] sm:text-3xl">
            03. Ce qui m&rsquo;anime au quotidien
          </p>
          <h2 className="font-display headline-balance mt-2 text-4xl font-bold tracking-tight text-[#252525] dark:text-[#F5EBDD] sm:text-5xl">
            A little bit of everything
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#252525]/85 dark:text-[#F5EBDD]/82">
            Derrière chaque stratégie de communication, il y a une sensibilité personnelle : des
            lectures, des notes musicales et une façon d&rsquo;aborder le collectif.
          </p>
        </motion.div>

        {/* Counter-tilted Scrapbook Open-Notebook Spread */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Page: Interests */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -24, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: -1 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={reducedMotion ? undefined : { rotate: 0, y: -4 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="relative rounded-[28px] border border-white/85 bg-[#FFFDF9]/85 p-7 shadow-[0_18px_40px_-18px_rgba(37,37,37,0.12)] backdrop-blur-md transition-colors duration-400 dark:border-[#F5EBDD]/15 dark:bg-[#262A23]/90 lg:col-span-6"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-2.5 left-12 h-5 w-20 -rotate-2 rounded-sm bg-[#D9E1CC] opacity-90 shadow-xs"
            />
            <div className="flex items-center justify-between border-b border-[#252525]/10 pb-4 dark:border-[#F5EBDD]/15">
              <h3 className="font-display text-2xl font-bold text-[#252525] dark:text-[#F5EBDD]">
                Centres d&rsquo;intérêt
              </h3>
              <span className="font-hand text-xl text-[#4F6638] dark:text-[#C5D9AA]">
                Page de gauche
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {INTERESTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={reducedMotion ? false : { opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="group flex items-start gap-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D9E1CC]/70 text-[#252525] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 dark:bg-[#363E31] dark:text-[#F5EBDD]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-2.5">
                        <h4 className="font-display text-lg font-bold text-[#252525] dark:text-[#F5EBDD]">
                          {item.title}
                        </h4>
                        <span className="font-hand text-lg text-[#4F6638] dark:text-[#C5D9AA]">
                          {item.note}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-[#252525]/80 dark:text-[#F5EBDD]/80">
                        {item.detail}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Page: Qualities */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: 24, rotate: 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={reducedMotion ? undefined : { rotate: 0, y: -4 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="relative rounded-[28px] border border-white/85 bg-[#FFFDF9]/85 p-7 shadow-[0_18px_40px_-18px_rgba(37,37,37,0.12)] backdrop-blur-md transition-colors duration-400 dark:border-[#F5EBDD]/15 dark:bg-[#262A23]/90 lg:col-span-6"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-2.5 right-12 h-5 w-20 rotate-2 rounded-sm bg-[#F1D16F]/85 opacity-90 shadow-xs"
            />
            <div className="flex items-center justify-between border-b border-[#252525]/10 pb-4 dark:border-[#F5EBDD]/15">
              <h3 className="font-display text-2xl font-bold text-[#252525] dark:text-[#F5EBDD]">
                Savoir-être &amp; forces
              </h3>
              <span className="font-hand text-xl text-[#C94F7C] dark:text-[#F08AA8]">
                Page de droite
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {QUALITIES.map((q, idx) => (
                <motion.div
                  key={q.title}
                  initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  whileHover={reducedMotion ? undefined : { y: -4, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20, delay: idx * 0.06 }}
                  className="rounded-2xl border border-[#252525]/8 bg-[#F5EBDD]/55 p-4 dark:border-[#F5EBDD]/12 dark:bg-[#1E221C]/80"
                >
                  <Sparkles className="h-4 w-4 text-[#4F6638] dark:text-[#C5D9AA]" />
                  <h4 className="font-display mt-2 text-base font-bold text-[#252525] dark:text-[#F5EBDD]">
                    {q.title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#252525]/80 dark:text-[#F5EBDD]/80">
                    {q.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
