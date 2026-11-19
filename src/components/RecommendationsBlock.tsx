import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Award, Download, Eye, FileText, Quote, X } from 'lucide-react';
import { motion } from 'motion/react';
import { RECOMMENDATIONS, RecommendationLetter } from '../data/initialPortfolio';
import { withBase } from '../utils/assetUrl';

if (
  typeof window !== 'undefined' &&
  typeof Worker !== 'undefined' &&
  !pdfjs.GlobalWorkerOptions.workerPort
) {
  try {
    pdfjs.GlobalWorkerOptions.workerPort = new Worker(
      new URL('../workers/pdfWorker.ts', import.meta.url),
      { type: 'module' }
    );
  } catch {
    // Fallback to iframe viewer if worker is blocked
  }
}

interface RecommendationsBlockProps {
  reducedMotion: boolean;
}

export function RecommendationsBlock({ reducedMotion }: RecommendationsBlockProps) {
  const [activeLetter, setActiveLetter] = useState<RecommendationLetter | null>(null);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    if (!activeLetter) return;
    setPdfError(false);
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveLetter(null);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [activeLetter]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="font-hand text-2xl font-bold text-[#C94F7C] dark:text-[#F08AA8]">
            Témoignages &amp; documents officiels
          </p>
          <h3 className="font-display text-2xl font-bold text-[#252525] dark:text-[#F5EBDD] sm:text-3xl">
            Lettres de recommandation
          </h3>
        </div>
        <span className="font-hand text-xl text-[#252525]/75 dark:text-[#F5EBDD]/75">
          Regards académique &amp; professionnel
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {RECOMMENDATIONS.map((item, idx) => {
          const pdfUrl = withBase(item.pdfPath);
          return (
            <motion.article
              key={item.id}
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, y: 22, rotate: item.rotate * 1.4 }
              }
              whileInView={{ opacity: 1, y: 0, rotate: item.rotate }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 20,
                delay: idx * 0.08,
              }}
              className="relative flex flex-col justify-between rounded-[28px] border border-white/85 bg-white/85 p-6 shadow-[0_18px_40px_-18px_rgba(37,37,37,0.13)] backdrop-blur-md transition-colors duration-400 dark:border-[#F5EBDD]/15 dark:bg-[#2B2327]/90 sm:p-7"
            >
              {/* Washi Tape */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-2.5 left-10 h-5 w-20 -rotate-2 rounded-sm opacity-90 shadow-xs"
                style={{ backgroundColor: item.tapeColor }}
              />

              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-[#F5EBDD]/85 shadow-xs dark:border-[#F5EBDD]/15 dark:bg-[#3A2D33]"
                      style={{ color: item.accentColor }}
                    >
                      <Award className="h-5 w-5 dark:text-[#F08AA8]" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#C94F7C] dark:text-[#F08AA8]">
                        {item.documentTitle} · {item.date}
                      </p>
                      <h4 className="font-display mt-0.5 text-xl font-bold text-[#252525] dark:text-[#F5EBDD]">
                        {item.author}
                      </h4>
                      <p className="text-xs font-medium text-[#252525]/70 dark:text-[#F5EBDD]/70">
                        {item.role} — {item.organization}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="font-hand mt-4 text-xl font-bold leading-snug text-[#C94F7C] dark:text-[#F08AA8]">
                  {item.highlight}
                </p>

                <div className="relative mt-3 rounded-2xl border border-[#252525]/8 bg-[#F5EBDD]/45 p-4 dark:border-[#F5EBDD]/10 dark:bg-[#1E191B]/75">
                  <Quote
                    aria-hidden="true"
                    className="mb-1.5 h-4 w-4 text-[#C94F7C]/65 dark:text-[#F08AA8]/65"
                  />
                  <p className="text-sm italic leading-relaxed text-[#252525]/85 dark:text-[#F5EBDD]/85">
                    {item.quote}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#252525]/10 pt-4 dark:border-[#F5EBDD]/15">
                <button
                  type="button"
                  onClick={() => setActiveLetter(item)}
                  data-cursor="Lire"
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#252525] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#383838] whitespace-nowrap cursor-pointer dark:bg-[#F5EBDD] dark:text-[#252525] dark:hover:bg-[#FFFDF9]"
                >
                  <Eye className="h-3.5 w-3.5 text-[#E7A49B] dark:text-[#C94F7C]" />
                  <span>Consulter le document</span>
                </button>

                <a
                  href={pdfUrl}
                  download={item.downloadName}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#252525]/15 bg-white px-4 py-2 text-xs font-semibold text-[#252525] transition-colors hover:bg-[#F5EBDD] whitespace-nowrap dark:border-[#F5EBDD]/15 dark:bg-[#1E1A1C] dark:text-[#F5EBDD] dark:hover:bg-[#362D32]"
                >
                  <Download className="h-3.5 w-3.5 text-[#C94F7C] dark:text-[#F08AA8]" />
                  <span>Télécharger (PDF)</span>
                </a>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Fullscreen Recommendation PDF Reader Modal */}
      {activeLetter && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeLetter.documentTitle} — ${activeLetter.author}`}
          className="fixed inset-0 z-[105] flex flex-col bg-[#252525]/85 p-3 backdrop-blur-sm dark:bg-black/85 sm:p-6"
          onClick={() => setActiveLetter(null)}
        >
          <div
            className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-white/20 bg-[#FFFDF9] shadow-2xl dark:border-[#F5EBDD]/15 dark:bg-[#241E21]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#252525]/10 bg-[#F5EBDD]/75 px-5 py-3.5 dark:border-[#F5EBDD]/15 dark:bg-[#2E262A]">
              <div className="flex min-w-0 items-center gap-2.5">
                <FileText className="h-4 w-4 shrink-0 text-[#C94F7C] dark:text-[#F08AA8]" />
                <span className="truncate text-sm font-semibold text-[#252525] dark:text-[#F5EBDD]">
                  {activeLetter.documentTitle} — {activeLetter.author} ({activeLetter.date})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={withBase(activeLetter.pdfPath)}
                  download={activeLetter.downloadName}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#252525] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap dark:bg-[#F5EBDD] dark:text-[#252525]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Télécharger</span>
                </a>
                <button
                  type="button"
                  aria-label="Fermer l’aperçu de la lettre"
                  onClick={() => setActiveLetter(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#252525] shadow-xs cursor-pointer dark:bg-[#1E1A1C] dark:text-[#F5EBDD]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#F5EBDD]/35 p-4 dark:bg-[#181416] sm:p-6">
              {!pdfError ? (
                <div className="flex justify-center">
                  <Document
                    file={withBase(activeLetter.pdfPath)}
                    onLoadError={() => setPdfError(true)}
                    loading={
                      <div className="flex h-[420px] items-center justify-center text-sm font-medium text-[#252525]/70 dark:text-[#F5EBDD]/75">
                        Chargement du document en cours…
                      </div>
                    }
                  >
                    <Page
                      pageNumber={1}
                      width={Math.min(
                        typeof window !== 'undefined' ? window.innerWidth - 96 : 860,
                        860
                      )}
                      renderTextLayer
                      renderAnnotationLayer
                      className="overflow-hidden rounded-xl border border-[#252525]/10 bg-white shadow-lg"
                    />
                  </Document>
                </div>
              ) : (
                <iframe
                  src={`${withBase(activeLetter.pdfPath)}#view=FitH`}
                  title={`${activeLetter.documentTitle} — ${activeLetter.author}`}
                  sandbox="allow-same-origin allow-scripts"
                  className="h-full w-full rounded-xl border-0 bg-white"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
