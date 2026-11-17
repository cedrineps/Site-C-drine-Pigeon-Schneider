import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  FileText,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { CONTACT_INFO } from '../data/initialPortfolio';

if (typeof window !== 'undefined' && typeof Worker !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerPort) {
  try {
    pdfjs.GlobalWorkerOptions.workerPort = new Worker(
      new URL('../workers/pdfWorker.ts', import.meta.url),
      { type: 'module' }
    );
  } catch {
    // Fallback to pdf.js default worker behavior or iframe if module Worker is blocked
  }
}

const STATIC_CV_URL = '/assets/aistudio/CV_de_Ce_drine_PIGEON-SCHNEIDER_ac537d40.pdf';
const ZOOM_STEPS = [0.75, 1, 1.25, 1.5] as const;

export function CvPreviewCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(720);
  const [expanded, setExpanded] = useState(true);
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number | 'fit'>('fit');
  const [tallView, setTallView] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [cvFileUrl, setCvFileUrl] = useState<string>('/api/cv?inline=1');
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateWidth = () => {
      const w = el.clientWidth;
      if (w > 0) setContainerWidth(Math.max(260, w - 32));
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded]);

  useEffect(() => {
    if (!fullscreen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [fullscreen]);

  const handleZoomOut = () => {
    if (scale === 'fit') {
      setScale(1);
      return;
    }
    const idx = ZOOM_STEPS.indexOf(scale as (typeof ZOOM_STEPS)[number]);
    if (idx > 0) setScale(ZOOM_STEPS[idx - 1]);
    else setScale(0.75);
  };

  const handleZoomIn = () => {
    if (scale === 'fit') {
      setScale(1.25);
      return;
    }
    const idx = ZOOM_STEPS.indexOf(scale as (typeof ZOOM_STEPS)[number]);
    if (idx >= 0 && idx < ZOOM_STEPS.length - 1) setScale(ZOOM_STEPS[idx + 1]);
    else setScale(1.5);
  };

  const computedWidth =
    scale === 'fit'
      ? Math.min(containerWidth, 820)
      : Math.round(Math.min(containerWidth, 720) * scale);

  return (
    <div className="relative mt-8 rounded-[28px] border border-white/85 bg-white/85 p-5 shadow-[0_20px_44px_-18px_rgba(37,37,37,0.14)] backdrop-blur-md transition-colors duration-400 dark:border-[#F5EBDD]/15 dark:bg-[#2B2327]/90 sm:p-7">
      {/* Scrapbook Washi Tape */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 left-10 h-6 w-24 -rotate-1 rounded-sm bg-[#E7A49B]/85 opacity-90 shadow-xs"
      />

      {/* Interactive Toolbar */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#252525]/10 pb-4 dark:border-[#F5EBDD]/15 lg:flex-row lg:items-center">
        <div className="flex items-start gap-3.5 sm:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F6DCD8] text-[#C94F7C] dark:bg-[#3F2A31] dark:text-[#F08AA8]">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-xl font-bold text-[#252525] dark:text-[#F5EBDD]">
              Consulter mon CV en ligne
            </h3>
            <p className="truncate text-xs text-[#252525]/70 dark:text-[#F5EBDD]/70">
              {CONTACT_INFO.cvFileName} · Lecteur PDF interactif
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {expanded && !pdfError && (
            <>
              {/* Pagination if multiple pages */}
              {numPages > 1 && (
                <div className="inline-flex items-center gap-1 rounded-full border border-[#252525]/12 bg-[#F5EBDD]/65 px-2 py-1 dark:border-[#F5EBDD]/15 dark:bg-[#1E1A1C]">
                  <button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                    aria-label="Page précédente"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#252525] disabled:opacity-40 hover:bg-white cursor-pointer dark:text-[#F5EBDD] dark:hover:bg-[#362D32]"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-1.5 text-xs font-semibold tabular-nums text-[#252525] dark:text-[#F5EBDD]">
                    {pageNumber} / {numPages}
                  </span>
                  <button
                    type="button"
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                    aria-label="Page suivante"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#252525] disabled:opacity-40 hover:bg-white cursor-pointer dark:text-[#F5EBDD] dark:hover:bg-[#362D32]"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Zoom Controls */}
              <div className="inline-flex items-center rounded-full border border-[#252525]/12 bg-[#F5EBDD]/65 p-1 dark:border-[#F5EBDD]/15 dark:bg-[#1E1A1C]">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  aria-label="Zoom arrière"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#252525] hover:bg-white cursor-pointer dark:text-[#F5EBDD] dark:hover:bg-[#362D32]"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setScale('fit')}
                  className="px-2.5 text-xs font-semibold text-[#252525] tabular-nums hover:text-[#C94F7C] whitespace-nowrap cursor-pointer dark:text-[#F5EBDD] dark:hover:text-[#F08AA8]"
                  title="Ajuster à la largeur"
                >
                  {scale === 'fit' ? 'Ajusté' : `${Math.round(scale * 100)}%`}
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  aria-label="Zoom avant"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#252525] hover:bg-white cursor-pointer dark:text-[#F5EBDD] dark:hover:bg-[#362D32]"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Height Toggle */}
              <button
                type="button"
                onClick={() => setTallView((prev) => !prev)}
                className="hidden sm:inline-flex min-h-[38px] items-center rounded-full border border-[#252525]/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#252525] hover:bg-[#F5EBDD] whitespace-nowrap cursor-pointer dark:border-[#F5EBDD]/15 dark:bg-[#1E1A1C] dark:text-[#F5EBDD] dark:hover:bg-[#362D32]"
              >
                {tallView ? 'Vue compacte' : 'Vue étendue'}
              </button>

              {/* Fullscreen Modal Trigger */}
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-[#252525]/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#252525] hover:bg-[#F5EBDD] whitespace-nowrap cursor-pointer dark:border-[#F5EBDD]/15 dark:bg-[#1E1A1C] dark:text-[#F5EBDD] dark:hover:bg-[#362D32]"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Plein écran</span>
              </button>
            </>
          )}

          {/* Direct Download */}
          <a
            href="/api/cv"
            download={CONTACT_INFO.cvFileName}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#252525] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#383838] whitespace-nowrap dark:bg-[#F5EBDD] dark:text-[#252525] dark:hover:bg-[#FFFDF9]"
          >
            <Download className="h-3.5 w-3.5 text-[#E7A49B] dark:text-[#C94F7C]" />
            <span>Télécharger le CV</span>
          </a>

          {/* Collapse / Expand Toggle */}
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Réduire l’aperçu du CV' : 'Afficher l’aperçu du CV'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#252525]/15 bg-[#F5EBDD]/70 text-[#252525] hover:bg-[#F5EBDD] cursor-pointer dark:border-[#F5EBDD]/15 dark:bg-[#1E1A1C] dark:text-[#F5EBDD] dark:hover:bg-[#362D32]"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Interactive PDF Viewport */}
      {expanded && (
        <div className="mt-5">
          <div
            ref={containerRef}
            className={`relative w-full overflow-auto rounded-2xl border border-[#252525]/12 bg-[#F5EBDD]/55 p-4 transition-all duration-300 dark:border-[#F5EBDD]/12 dark:bg-[#1A1618] ${
              tallView ? 'max-h-[960px]' : 'max-h-[580px]'
            }`}
          >
            {!pdfError ? (
              <div className="flex min-h-[360px] justify-center">
                <Document
                  file={cvFileUrl}
                  onLoadSuccess={({ numPages: total }) => {
                    setNumPages(total);
                    setPdfError(false);
                  }}
                  onLoadError={() => {
                    if (cvFileUrl !== STATIC_CV_URL) {
                      setCvFileUrl(STATIC_CV_URL);
                    } else {
                      setPdfError(true);
                    }
                  }}
                  loading={
                    <div className="flex h-[420px] items-center justify-center text-sm font-medium text-[#252525]/70 dark:text-[#F5EBDD]/75">
                      Chargement du CV en cours…
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    width={computedWidth}
                    renderTextLayer
                    renderAnnotationLayer
                    className="overflow-hidden rounded-xl border border-[#252525]/10 bg-white shadow-md"
                  />
                </Document>
              </div>
            ) : (
              /* Secured iframe fallback */
              <iframe
                src={`${STATIC_CV_URL}#view=FitH`}
                title="CV de Cédrine Pigeon-Schneider"
                sandbox="allow-same-origin allow-scripts"
                className="h-[540px] w-full rounded-xl border-0 bg-white"
              />
            )}
          </div>
          <p className="mt-2.5 text-center text-xs text-[#252525]/60 dark:text-[#F5EBDD]/65 sm:text-right">
            Texte sélectionnable directement dans l’aperçu · Cliquez sur « Plein écran » pour une
            lecture grand format.
          </p>
        </div>
      )}

      {/* Fullscreen PDF Reader Modal */}
      {fullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Lecture plein écran du CV"
          className="fixed inset-0 z-[105] flex flex-col bg-[#252525]/85 p-3 backdrop-blur-sm dark:bg-black/85 sm:p-6"
          onClick={() => setFullscreen(false)}
        >
          <div
            className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-white/20 bg-[#FFFDF9] shadow-2xl dark:border-[#F5EBDD]/15 dark:bg-[#241E21]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#252525]/10 bg-[#F5EBDD]/75 px-5 py-3.5 dark:border-[#F5EBDD]/15 dark:bg-[#2E262A]">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="h-4 w-4 shrink-0 text-[#C94F7C] dark:text-[#F08AA8]" />
                <span className="truncate text-sm font-semibold text-[#252525] dark:text-[#F5EBDD]">
                  {CONTACT_INFO.cvFileName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {numPages > 1 && (
                  <div className="inline-flex items-center gap-1 rounded-full border border-[#252525]/15 bg-white px-2 py-1 dark:border-[#F5EBDD]/15 dark:bg-[#1E1A1C] dark:text-[#F5EBDD]">
                    <button
                      type="button"
                      disabled={pageNumber <= 1}
                      onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                      aria-label="Page précédente"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-1.5 text-xs font-semibold tabular-nums">
                      {pageNumber} / {numPages}
                    </span>
                    <button
                      type="button"
                      disabled={pageNumber >= numPages}
                      onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                      aria-label="Page suivante"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                <a
                  href="/api/cv"
                  download={CONTACT_INFO.cvFileName}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#252525] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap dark:bg-[#F5EBDD] dark:text-[#252525]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Télécharger</span>
                </a>
                <button
                  type="button"
                  aria-label="Fermer le mode plein écran"
                  onClick={() => setFullscreen(false)}
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
                    file={cvFileUrl}
                    onLoadError={() => {
                      if (cvFileUrl !== STATIC_CV_URL) {
                        setCvFileUrl(STATIC_CV_URL);
                      } else {
                        setPdfError(true);
                      }
                    }}
                  >
                    <Page
                      pageNumber={pageNumber}
                      width={Math.min(typeof window !== 'undefined' ? window.innerWidth - 96 : 860, 860)}
                      renderTextLayer
                      renderAnnotationLayer
                      className="overflow-hidden rounded-xl border border-[#252525]/10 bg-white shadow-lg"
                    />
                  </Document>
                </div>
              ) : (
                <iframe
                  src={`${STATIC_CV_URL}#view=FitH`}
                  title="CV complet de Cédrine Pigeon-Schneider"
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
