import { useEffect, useState } from 'react';
import { ArrowUpRight, Maximize2, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { MediaAsset, ProjectCategory, ProjectItem } from '../types/portfolio';
import { EditorialImageSlot } from './EditorialImageSlot';
import { ImageLightbox } from './ImageLightbox';
import { ScrollReveal } from './ScrollReveal';
import { withBase } from '../utils/assetUrl';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  selectedProject: ProjectItem | null;
  onSelectProject: (project: ProjectItem | null) => void;
  reducedMotion: boolean;
}

const CATEGORIES: Array<'Tous' | ProjectCategory> = [
  'Tous',
  'Contenus & Réseaux',
  'Stratégie & KPI',
  'Communication & Événements',
  'Créations visuelles',
];

const ACCENT_SURFACE: Record<ProjectItem['accentColor'], string> = {
  coral: 'from-[#F6DCD8] to-[#FFFDF9] dark:from-[#3D2927] dark:to-[#24201E]',
  lilac: 'from-[#E9E0F8] to-[#FFFDF9] dark:from-[#332944] dark:to-[#24201E]',
  yellow: 'from-[#FAF0CC] to-[#FFFDF9] dark:from-[#3D341E] dark:to-[#24201E]',
  sage: 'from-[#E4ECD8] to-[#FFFDF9] dark:from-[#293326] dark:to-[#24201E]',
  pink: 'from-[#F6DCE4] to-[#FFFDF9] dark:from-[#3D2631] dark:to-[#24201E]',
  sky: 'from-[#DFEEF9] to-[#FFFDF9] dark:from-[#23323D] dark:to-[#24201E]',
};

export function ProjectsSection({
  projects,
  selectedProject,
  onSelectProject,
  reducedMotion,
}: ProjectsSectionProps) {
  const [filter, setFilter] = useState<'Tous' | ProjectCategory>('Tous');
  const [lightbox, setLightbox] = useState<{
    assets: MediaAsset[];
    index: number;
    title: string;
  } | null>(null);

  const visibleProjects =
    filter === 'Tous' ? projects : projects.filter((p) => p.category === filter);

  useEffect(() => {
    if (!selectedProject || lightbox) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSelectProject(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedProject, lightbox, onSelectProject]);

  return (
    <section id="projects" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal reducedMotion={reducedMotion} parallax>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="font-hand text-2xl font-bold text-[#8D690B] dark:text-[#F5D87A] sm:text-3xl">
                03. Projets stratégiques &amp; créatifs
              </p>
              <h2 className="font-display headline-balance mt-2 text-4xl font-bold tracking-tight text-[#252525] dark:text-[#F5EBDD] sm:text-5xl">
                Thinking outside the box
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#252525]/85 dark:text-[#F5EBDD]/82">
                Chaque projet est abordé comme un terrain d&rsquo;équilibre : comprendre le besoin,
                poser un cadre clair et imaginer des supports visuels justes.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Interactive Filter Tabs with elastic layoutId active pill */}
        <div
          role="tablist"
          aria-label="Filtrer les projets par catégorie"
          className="mt-8 flex flex-wrap items-center gap-2"
        >
          {CATEGORIES.map((cat) => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(cat)}
                className={`relative min-h-[40px] rounded-full px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'text-white dark:text-[#252525]'
                    : 'border border-[#252525]/10 bg-white/75 text-[#252525]/80 hover:bg-white hover:text-[#252525] dark:border-[#F5EBDD]/15 dark:bg-[#2B2722]/85 dark:text-[#F5EBDD]/80 dark:hover:bg-[#36312B] dark:hover:text-[#F5EBDD]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeProjectFilterPill"
                    transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                    className="absolute inset-0 rounded-full bg-[#252525] shadow-sm dark:bg-[#F5EBDD]"
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid with smooth layout transitions */}
        {visibleProjects.length === 0 ? (
          <div className="mt-10 rounded-[26px] border border-dashed border-[#252525]/25 bg-white/60 p-10 text-center dark:border-[#F5EBDD]/20 dark:bg-[#2B2722]/75">
            <Sparkles className="mx-auto h-7 w-7 text-[#8D690B] dark:text-[#F5D87A]" />
            <p className="font-display mt-3 text-xl font-bold text-[#252525] dark:text-[#F5EBDD]">
              Créations visuelles à découvrir prochainement
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#252525]/75 dark:text-[#F5EBDD]/75">
              Les affiches, carrousels, flyers et présentations personnels peuvent être ajoutés et
              publiés directement depuis l&rsquo;espace privé de Cédrine.
            </p>
          </div>
        ) : (
          <motion.div layout className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project, idx) => {
                const primaryVisual = project.visuals[0];
                return (
                  <motion.article
                    layout={!reducedMotion}
                    key={project.id}
                    initial={reducedMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reducedMotion ? undefined : { opacity: 0, scale: 0.92 }}
                    whileHover={
                      reducedMotion
                        ? undefined
                        : {
                            y: -8,
                            rotate: idx % 2 === 0 ? -0.8 : 0.8,
                            scale: 1.015,
                            boxShadow: '0 28px 50px -16px rgba(37, 37, 37, 0.22)',
                          }
                    }
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                      delay: Math.min(idx * 0.04, 0.2),
                    }}
                    onClick={() => onSelectProject(project)}
                    data-cursor="Ouvrir"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectProject(project);
                      }
                    }}
                    className="group flex flex-col justify-between rounded-[28px] border border-white/90 bg-white/85 p-5 shadow-[0_18px_40px_-16px_rgba(37,37,37,0.14)] backdrop-blur-md cursor-pointer transition-colors duration-400 dark:border-[#F5EBDD]/15 dark:bg-[#2B2722]/90 dark:shadow-[0_20px_44px_-16px_rgba(0,0,0,0.5)]"
                  >
                    <div>
                      <div
                        className={`relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-gradient-to-br ${
                          ACCENT_SURFACE[project.accentColor]
                        }`}
                      >
                        {primaryVisual ? (
                          <>
                            <img
                              src={withBase(primaryVisual.url)}
                              alt={firstAlt(primaryVisual.alt, project.title)}
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              draggable={false}
                              className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-108"
                            />
                            <button
                              type="button"
                              aria-label={`Agrandir les visuels de ${project.title}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setLightbox({
                                  assets: project.visuals,
                                  index: 0,
                                  title: project.title,
                                });
                              }}
                              className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 rounded-full border border-white/40 bg-[#252525]/65 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm transition-transform hover:scale-105 hover:bg-[#252525] cursor-pointer"
                            >
                              <Maximize2 className="h-3 w-3" />
                              <span>Voir en grand</span>
                            </button>
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute right-2.5 bottom-2.5 max-w-[90%] truncate rounded-full border border-white/25 bg-[#252525]/45 px-2.5 py-0.5 text-[10px] font-medium text-white/95 select-none"
                            >
                              © Cédrine Pigeon-Schneider · Création originale — Tous droits réservés
                            </span>
                          </>
                        ) : (
                          <div className="flex h-full w-full flex-col justify-between p-5">
                            <span className="font-hand text-xl text-[#252525]/70 dark:text-[#F5EBDD]/75">
                              {project.category}
                            </span>
                            <div className="space-y-1.5">
                              <p className="text-xs font-semibold text-[#252525]/60 dark:text-[#F5EBDD]/65">
                                Livrables
                              </p>
                              <p className="font-display text-base font-semibold leading-snug text-[#252525] dark:text-[#F5EBDD]">
                                {project.deliverables.join(' · ')}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2 text-xs font-medium text-[#252525]/65 dark:text-[#F5EBDD]/65">
                        <span>{project.category}</span>
                        {project.visuals.length > 0 && (
                          <span>
                            {project.visuals.length} visuel{project.visuals.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display mt-1.5 text-xl font-bold leading-snug text-[#252525] group-hover:text-[#C94F7C] transition-colors dark:text-[#F5EBDD] dark:group-hover:text-[#F08AA8]">
                        {project.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#252525]/80 dark:text-[#F5EBDD]/80">
                        {project.challenge}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[#252525]/10 pt-3.5 text-xs font-semibold text-[#252525] dark:border-[#F5EBDD]/15 dark:text-[#F5EBDD]">
                      <span>Ouvrir la fiche projet</span>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F5EBDD] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:bg-[#252525] group-hover:text-white dark:bg-[#3A332C] dark:text-[#F5EBDD] dark:group-hover:bg-[#F5EBDD] dark:group-hover:text-[#252525]">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Animated Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#252525]/70 p-4 backdrop-blur-sm dark:bg-black/75"
            onClick={() => onSelectProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: 'spring', stiffness: 290, damping: 24 }}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-white bg-[#FFFDF9] p-6 shadow-2xl dark:border-[#F5EBDD]/15 dark:bg-[#24201E] sm:p-9"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Fermer la fiche projet"
                onClick={() => onSelectProject(null)}
                className="sticky top-0 float-right inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#252525]/15 bg-white text-[#252525] shadow-sm transition-transform hover:scale-105 hover:bg-[#F5EBDD] cursor-pointer dark:border-[#F5EBDD]/20 dark:bg-[#2F2A27] dark:text-[#F5EBDD] dark:hover:bg-[#3B3531]"
              >
                <X className="h-4 w-4" />
              </button>

              <p className="text-xs font-semibold text-[#C94F7C] dark:text-[#F08AA8]">
                {selectedProject.category} · {selectedProject.context}
              </p>
              <h3 className="font-display headline-balance mt-2 pr-10 text-3xl font-bold text-[#252525] dark:text-[#F5EBDD] sm:text-4xl">
                {selectedProject.title}
              </h3>

              <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#F5EBDD]/65 p-4 dark:bg-[#2F2A27]">
                  <p className="font-hand text-xl font-bold text-[#C94F7C] dark:text-[#F08AA8]">
                    Mon rôle
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#252525]/85 dark:text-[#F5EBDD]/85">
                    {selectedProject.role}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#E7A49B]/20 p-4 dark:bg-[#E7A49B]/14">
                  <p className="font-hand text-xl font-bold text-[#252525] dark:text-[#F5EBDD]">
                    Le défi
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#252525]/85 dark:text-[#F5EBDD]/85">
                    {selectedProject.challenge}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#CDB8F0]/25 p-4 dark:bg-[#CDB8F0]/14">
                  <p className="font-hand text-xl font-bold text-[#6F4FA6] dark:text-[#D2BFF7]">
                    Mon idée
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#252525]/85 dark:text-[#F5EBDD]/85">
                    {selectedProject.idea}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-[#252525]/70 dark:text-[#F5EBDD]/70">
                <span>Livrables :</span>
                {selectedProject.deliverables.map((del, i) => (
                  <span key={del}>
                    {del}
                    {i < selectedProject.deliverables.length - 1 ? ' ·' : ''}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-display text-lg font-bold text-[#252525] dark:text-[#F5EBDD]">
                    {selectedProject.visuals.length > 1 ? 'Les visuels' : 'Le visuel'}
                  </p>
                  {selectedProject.visuals.length > 0 && (
                    <span className="font-hand text-lg text-[#C94F7C] dark:text-[#F08AA8]">
                      Cliquez sur une image pour l&rsquo;agrandir en entier
                    </span>
                  )}
                </div>
                {selectedProject.visuals.length > 0 ? (
                  <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {selectedProject.visuals.map((vis, i) => (
                      <EditorialImageSlot
                        key={vis.id}
                        asset={vis}
                        fallbackTitle={selectedProject.title}
                        fallbackHint=""
                        variant="project"
                        defaultRotate={i % 2 === 0 ? -1.5 : 1.5}
                        tapeColor={i % 2 === 0 ? '#F1D16F' : '#E7A49B'}
                        aspectClass="aspect-[4/3]"
                        fitContain
                        onClick={() =>
                          setLightbox({
                            assets: selectedProject.visuals,
                            index: i,
                            title: selectedProject.title,
                          })
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-4">
                    <EditorialImageSlot
                      asset={null}
                      fallbackTitle={selectedProject.title}
                      fallbackHint="Ajoutez vos visuels (affiches, carrousels, flyers, présentations) depuis votre espace privé"
                      variant="project"
                      defaultRotate={0}
                      tapeColor="#F1D16F"
                      aspectClass="aspect-[16/9]"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ImageLightbox
        assets={lightbox?.assets || []}
        currentIndex={lightbox ? lightbox.index : null}
        contextTitle={lightbox?.title}
        onClose={() => setLightbox(null)}
        onChangeIndex={(nextIndex) =>
          setLightbox((prev) => (prev ? { ...prev, index: nextIndex } : null))
        }
      />
    </section>
  );
}

function firstAlt(alt: string | undefined, fallback: string): string {
  return alt && alt.trim().length > 0 ? alt : fallback;
}
