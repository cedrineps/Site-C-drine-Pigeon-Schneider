import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { MediaAsset } from '../types/portfolio';
import { withBase } from '../utils/assetUrl';

interface ImageLightboxProps {
  assets: MediaAsset[];
  currentIndex: number | null;
  contextTitle?: string;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export function ImageLightbox({
  assets,
  currentIndex,
  contextTitle,
  onClose,
  onChangeIndex,
}: ImageLightboxProps) {
  const [zoomed, setZoomed] = useState(false);

  const isOpen = currentIndex !== null && assets[currentIndex] !== undefined;
  const activeAsset = isOpen && currentIndex !== null ? assets[currentIndex] : null;
  const total = assets.length;

  useEffect(() => {
    setZoomed(false);
  }, [currentIndex]);

  useEffect(() => {
    if (!isOpen || currentIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && total > 1) {
        onChangeIndex((currentIndex + 1) % total);
      } else if (e.key === 'ArrowLeft' && total > 1) {
        onChangeIndex((currentIndex - 1 + total) % total);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, currentIndex, total, onClose, onChangeIndex]);

  return (
    <AnimatePresence>
      {isOpen && activeAsset && currentIndex !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={activeAsset.caption || contextTitle || 'Aperçu grand format'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[130] flex flex-col bg-[#252525]/90 p-3 backdrop-blur-md sm:p-6"
          onClick={onClose}
        >
          {/* Top Bar */}
          <div
            className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 rounded-full border border-white/15 bg-[#252525]/70 px-4 py-2 text-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              {contextTitle && (
                <p className="truncate text-[11px] font-medium text-white/65">{contextTitle}</p>
              )}
              <p className="truncate font-display text-sm font-semibold sm:text-base">
                {activeAsset.caption || activeAsset.alt || 'Visuel en grand format'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {total > 1 && (
                <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tabular-nums sm:inline-block">
                  {currentIndex + 1} / {total}
                </span>
              )}

              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/12 px-3 text-xs font-semibold text-white transition-colors hover:bg-white/22 cursor-pointer"
                title={zoomed ? 'Ajuster à l’écran' : 'Zoomer pour lire les détails'}
              >
                {zoomed ? (
                  <>
                    <ZoomOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Ajuster</span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Zoom détails</span>
                  </>
                )}
              </button>

              <button
                type="button"
                aria-label="Fermer l’aperçu grand format"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#252525] shadow-sm transition-transform hover:scale-105 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Center Canvas */}
          <div
            className="relative mx-auto mt-3 flex w-full max-w-6xl flex-1 items-center justify-center overflow-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            {total > 1 && !zoomed && (
              <button
                type="button"
                aria-label="Visuel précédent"
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeIndex((currentIndex - 1 + total) % total);
                }}
                className="absolute left-1 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-[#252525]/70 text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#252525] sm:left-3 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            <motion.div
              key={activeAsset.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative rounded-[24px] border border-white/20 bg-[#FFFDF9] p-2.5 shadow-2xl sm:p-4 ${
                zoomed ? 'max-w-none' : 'max-h-[82vh] max-w-full'
              }`}
            >
              <div className="relative overflow-hidden rounded-2xl bg-[#F5EBDD]/40">
                <img
                  src={withBase(activeAsset.url)}
                  alt={activeAsset.alt || activeAsset.caption || 'Création originale'}
                  referrerPolicy="no-referrer"
                  draggable={false}
                  onClick={() => setZoomed((z) => !z)}
                  className={
                    zoomed
                      ? 'h-auto w-auto max-w-[1400px] cursor-zoom-out select-none object-contain'
                      : 'max-h-[73vh] w-auto max-w-full cursor-zoom-in select-none object-contain mx-auto'
                  }
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 bottom-3 max-w-[92%] truncate rounded-full border border-white/25 bg-[#252525]/55 px-3 py-1 text-[10px] font-medium text-white/95 select-none"
                >
                  © Cédrine Pigeon-Schneider · Création originale — Tous droits réservés
                </span>
              </div>
            </motion.div>

            {total > 1 && !zoomed && (
              <button
                type="button"
                aria-label="Visuel suivant"
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeIndex((currentIndex + 1) % total);
                }}
                className="absolute right-1 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-[#252525]/70 text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#252525] sm:right-3 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Bottom hint */}
          <div
            className="mx-auto mt-2 flex items-center gap-2 text-xs text-white/75"
            onClick={(e) => e.stopPropagation()}
          >
            <Maximize2 className="h-3.5 w-3.5 text-[#E7B6C5]" />
            <span>
              Cliquez sur l&rsquo;image pour {zoomed ? 'ajuster à l’écran' : 'zoomer sur les détails'}
              {total > 1 ? ' · Flèches clavier pour naviguer' : ''}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
