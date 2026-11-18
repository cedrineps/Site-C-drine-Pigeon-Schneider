import { useEffect, useMemo, useRef, useState } from 'react';
import { Maximize2, RotateCcw, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { MediaAsset, MoodboardItem } from '../types/portfolio';
import { ImageLightbox } from './ImageLightbox';
import { STATIC_MOODBOARD_PDF_PATH, withBase } from '../utils/assetUrl';

interface MoodboardSectionProps {
  items: MoodboardItem[];
  reducedMotion: boolean;
  darkMode?: boolean;
}

const TONE_BG: Record<MoodboardItem['bgTone'], string> = {
  coral: '#F7DCD7',
  lilac: '#EAE2FA',
  yellow: '#FBF0C9',
  sage: '#E5ECD9',
  pink: '#F6DCE4',
  cream: '#FFFDF9',
  sky: '#DFEEF9',
};

const TONE_BG_DARK: Record<MoodboardItem['bgTone'], string> = {
  coral: '#352524',
  lilac: '#2B2436',
  yellow: '#332C1C',
  sage: '#242D23',
  pink: '#35232B',
  cream: '#2C2724',
  sky: '#212C35',
};

export function MoodboardSection({
  items,
  reducedMotion,
  darkMode = false,
}: MoodboardSectionProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardItems, setBoardItems] = useState<MoodboardItem[]>(items);
  const [zoomedItem, setZoomedItem] = useState<MoodboardItem | null>(null);
  const [imageLightboxIndex, setImageLightboxIndex] = useState<number | null>(null);
  const dragState = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);

  const tonePalette = darkMode ? TONE_BG_DARK : TONE_BG;

  useEffect(() => {
    setBoardItems(items);
  }, [items]);

  useEffect(() => {
    if (!zoomedItem) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomedItem(null);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [zoomedItem]);

  const moodboardImageAssets = useMemo<Array<{ itemId: string; asset: MediaAsset }>>(
    () =>
      boardItems
        .filter((it) => it.type === 'image' && Boolean(it.imageUrl))
        .map((it) => ({
          itemId: it.id,
          asset: {
            id: it.id,
            url: it.imageUrl || '',
            alt: it.imageAlt || it.title,
            caption: `${it.title} — ${it.caption}`,
            updatedAt: '',
          },
        })),
    [boardItems]
  );

  const openItemZoom = (item: MoodboardItem) => {
    if (item.type === 'image' && item.imageUrl) {
      const idx = moodboardImageAssets.findIndex((entry) => entry.itemId === item.id);
      if (idx >= 0) {
        setImageLightboxIndex(idx);
        return;
      }
    }
    setZoomedItem(item);
  };

  const handleReset = () => {
    setBoardItems(items);
  };

  const bringToFront = (id: string) => {
    setBoardItems((prev) => {
      const maxZ = prev.reduce((acc, it) => Math.max(acc, it.zIndex), 1);
      return prev.map((it) => (it.id === id ? { ...it, zIndex: maxZ + 1 } : it));
    });
  };

  const handlePointerDown = (e: React.PointerEvent, item: MoodboardItem) => {
    if (!boardRef.current) return;
    bringToFront(item.id);
    dragState.current = {
      id: item.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: item.x,
      origY: item.y,
      moved: false,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const dxPx = e.clientX - dragState.current.startX;
    const dyPx = e.clientY - dragState.current.startY;
    if (Math.abs(dxPx) > 4 || Math.abs(dyPx) > 4) {
      dragState.current.moved = true;
    }
    const dxPct = (dxPx / rect.width) * 100;
    const dyPct = (dyPx / rect.height) * 100;

    const nextX = Math.max(1, Math.min(72, dragState.current.origX + dxPct));
    const nextY = Math.max(2, Math.min(68, dragState.current.origY + dyPct));

    const draggingId = dragState.current.id;
    setBoardItems((prev) =>
      prev.map((it) => (it.id === draggingId ? { ...it, x: nextX, y: nextY } : it))
    );
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  return (
    <section id="inspiration" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div className="max-w-2xl">
            <p className="font-hand text-2xl font-bold text-[#6F4FA6] dark:text-[#D2BFF7] sm:text-3xl">
              02. Univers visuel &amp; inspirations
            </p>
            <h2 className="font-display headline-balance mt-2 text-4xl font-bold tracking-tight text-[#252525] dark:text-[#F5EBDD] sm:text-5xl">
              My creative mind
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#252525]/85 dark:text-[#F5EBDD]/82">
              Construire un univers, c&rsquo;est veiller à ce que tout dialogue avec justesse : les
              mots, les images, les couleurs, le message et l&rsquo;expérience proposée. Déplacez
              les cartes façon Milanote et cliquez pour explorer chaque composition de plus près.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <motion.a
              href={withBase(STATIC_MOODBOARD_PDF_PATH)}
              download="Moodboard_Cedrine_PIGEON-SCHNEIDER.pdf"
              whileHover={reducedMotion ? undefined : { y: -2, scale: 1.03 }}
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#252525]/15 bg-white/85 px-4 py-2 text-xs font-semibold text-[#252525] shadow-xs transition-colors hover:bg-white dark:border-[#F5EBDD]/20 dark:bg-[#2B2436] dark:text-[#F5EBDD] dark:hover:bg-[#362E43]"
            >
              <span>Télécharger le moodboard (PDF)</span>
            </motion.a>

            <motion.button
              type="button"
              whileHover={reducedMotion ? undefined : { y: -2, scale: 1.03 }}
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
              onClick={handleReset}
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-[#252525]/15 bg-white/80 px-4 py-2 text-xs font-semibold text-[#252525] shadow-xs transition-colors hover:bg-white cursor-pointer dark:border-[#F5EBDD]/20 dark:bg-[#2B2436] dark:text-[#F5EBDD] dark:hover:bg-[#362E43]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Réinitialiser le moodboard</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Desktop Interactive Draggable Board */}
        <motion.div
          ref={boardRef}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="paper-texture relative mt-10 hidden h-[650px] w-full overflow-hidden rounded-[32px] border border-white/85 bg-white/45 shadow-[0_24px_60px_-24px_rgba(37,37,37,0.16)] backdrop-blur-md transition-colors duration-500 dark:border-[#F5EBDD]/15 dark:bg-[#26212B]/65 md:block"
        >
          {/* Interactive board badge */}
          <div className="pointer-events-none absolute right-5 bottom-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/75 px-3 py-1 text-xs font-medium text-[#252525]/70 backdrop-blur-sm dark:border-[#F5EBDD]/15 dark:bg-[#24201E]/85 dark:text-[#F5EBDD]/80">
            <Sparkles className="h-3.5 w-3.5 text-[#6F4FA6] dark:text-[#D2BFF7]" />
            <span>Tableau interactif — glissez &amp; réorganisez les cartes</span>
          </div>

          {boardItems.map((item, idx) => (
            <motion.div
              key={item.id}
              onPointerDown={(e) => handlePointerDown(e, item)}
              data-cursor="Glisser"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                      scale: 1.05,
                      rotate: 0,
                      boxShadow: '0 28px 50px -14px rgba(37,37,37,0.28)',
                    }
              }
              transition={{ type: 'spring', stiffness: 280, damping: 20, delay: idx * 0.04 }}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                zIndex: item.zIndex,
                backgroundColor: tonePalette[item.bgTone],
                rotate: reducedMotion ? 0 : item.rotate,
              }}
              className="group absolute w-[250px] select-none rounded-[22px] border border-white/90 p-4 shadow-[0_16px_34px_-14px_rgba(37,37,37,0.2)] cursor-grab active:cursor-grabbing transition-colors duration-400 dark:border-[#F5EBDD]/18"
            >
              {/* Pin / Tape */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-2.5 left-1/2 h-4 w-14 -translate-x-1/2 rounded-sm bg-[#CDB8F0]/80 transition-transform duration-300 group-hover:scale-105"
              />

              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-[#252525]/65 dark:text-[#F5EBDD]/70">
                  {item.title}
                </p>
                <button
                  type="button"
                  aria-label={`Agrandir ${item.title}`}
                  data-cursor="Agrandir"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => openItemZoom(item)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-[#252525] opacity-85 transition-all duration-200 hover:scale-110 hover:opacity-100 cursor-pointer dark:bg-[#24201E]/85 dark:text-[#F5EBDD]"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {item.type === 'image' && item.imageUrl && (
                <div
                  onDoubleClick={() => openItemZoom(item)}
                  className="relative mt-2.5 aspect-[4/3] overflow-hidden rounded-xl bg-[#FAF6F0] dark:bg-[#1E1B18]"
                >
                  <img
                    src={withBase(item.imageUrl)}
                    alt={item.imageAlt || item.title}
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="h-full w-full select-none object-contain p-1 transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-1.5 bottom-1.5 max-w-[92%] truncate rounded-full border border-white/25 bg-[#252525]/35 px-2 py-0.5 text-[9px] font-medium text-white/90 backdrop-blur-[3px] select-none"
                  >
                    © Cédrine Pigeon-Schneider · Création originale
                  </span>
                </div>
              )}

              {item.type === 'palette' && item.colors && (
                <div className="mt-3 grid grid-cols-7 gap-1.5">
                  {item.colors.map((hex) => (
                    <div key={hex} className="flex flex-col items-center gap-1">
                      <span
                        className="h-8 w-full rounded-lg border border-[#252525]/10 transition-transform duration-200 hover:scale-110 dark:border-white/20"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    </div>
                  ))}
                </div>
              )}

              <p
                className={`mt-3 leading-snug text-[#252525] dark:text-[#F5EBDD] ${
                  item.type === 'quote' || item.type === 'note'
                    ? 'font-hand text-xl font-bold'
                    : 'text-sm font-medium'
                }`}
              >
                {item.caption}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile / Tablet Clean Responsive Moodboard Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
          {boardItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openItemZoom(item)}
              style={{ backgroundColor: tonePalette[item.bgTone] }}
              className="rounded-[22px] border border-white/80 p-5 text-left shadow-sm transition-transform active:scale-98 dark:border-[#F5EBDD]/18"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[#252525]/65 dark:text-[#F5EBDD]/70">
                  {item.title}
                </p>
                <Maximize2 className="h-3.5 w-3.5 text-[#252525]/55 dark:text-[#F5EBDD]/60" />
              </div>
              {item.type === 'image' && item.imageUrl && (
                <div className="relative mt-2.5 aspect-[4/3] overflow-hidden rounded-xl bg-[#FAF6F0] dark:bg-[#1E1B18]">
                  <img
                    src={withBase(item.imageUrl)}
                    alt={item.imageAlt || item.title}
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="h-full w-full select-none object-contain p-1"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-2 bottom-2 max-w-[90%] truncate rounded-full border border-white/25 bg-[#252525]/35 px-2 py-0.5 text-[9px] font-medium text-white/90 backdrop-blur-[3px] select-none"
                  >
                    © Cédrine Pigeon-Schneider · Création originale
                  </span>
                </div>
              )}
              {item.type === 'palette' && item.colors && (
                <div className="mt-3 flex gap-1.5">
                  {item.colors.map((hex) => (
                    <span
                      key={hex}
                      className="h-7 flex-1 rounded-md border border-[#252525]/10 dark:border-white/20"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              )}
              <p className="font-hand mt-3 text-xl font-bold text-[#252525] dark:text-[#F5EBDD]">
                {item.caption}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Animated Lightbox Zoom Modal */}
      <AnimatePresence>
        {zoomedItem && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={zoomedItem.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#252525]/70 p-4 backdrop-blur-sm dark:bg-black/75"
            onClick={() => setZoomedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 18, rotate: -1.5 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              style={{ backgroundColor: tonePalette[zoomedItem.bgTone] }}
              className="relative w-full max-w-lg rounded-[28px] border border-white p-6 shadow-2xl dark:border-[#F5EBDD]/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Fermer l'aperçu"
                onClick={() => setZoomedItem(null)}
                className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#252525] shadow-sm transition-transform hover:scale-105 cursor-pointer dark:bg-[#24201E] dark:text-[#F5EBDD]"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="text-xs font-semibold text-[#252525]/70 dark:text-[#F5EBDD]/75">
                {zoomedItem.title}
              </p>
              {zoomedItem.type === 'image' && zoomedItem.imageUrl && (
                <div className="relative mt-4 overflow-hidden rounded-2xl bg-white dark:bg-[#1E1B18]">
                  <img
                    src={withBase(zoomedItem.imageUrl)}
                    alt={zoomedItem.imageAlt || zoomedItem.title}
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="max-h-[60vh] w-full select-none object-contain"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 bottom-3 max-w-[92%] truncate rounded-full border border-white/25 bg-[#252525]/40 px-3 py-1 text-[10px] font-medium text-white/95 backdrop-blur-[3px] select-none"
                  >
                    © Cédrine Pigeon-Schneider · Création originale — Tous droits réservés
                  </span>
                </div>
              )}
              {zoomedItem.type === 'palette' && zoomedItem.colors && (
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {zoomedItem.colors.map((hex) => (
                    <div key={hex} className="text-center">
                      <div
                        className="h-14 w-full rounded-xl border border-[#252525]/10 dark:border-white/20"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="mt-1 block text-[10px] font-mono text-[#252525]/75 dark:text-[#F5EBDD]/75">
                        {hex}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="font-hand mt-4 text-2xl font-bold text-[#252525] dark:text-[#F5EBDD]">
                {zoomedItem.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ImageLightbox
        assets={moodboardImageAssets.map((entry) => entry.asset)}
        currentIndex={imageLightboxIndex}
        contextTitle="Moodboard — My creative mind"
        onClose={() => setImageLightboxIndex(null)}
        onChangeIndex={setImageLightboxIndex}
      />
    </section>
  );
}
