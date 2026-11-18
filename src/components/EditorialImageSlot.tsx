import { useState } from 'react';
import { Camera, Maximize2, Palette, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { MediaAsset } from '../types/portfolio';
import { withBase } from '../utils/assetUrl';

interface EditorialImageSlotProps {
  asset: MediaAsset | null | undefined;
  fallbackTitle: string;
  fallbackHint: string;
  variant: 'portrait' | 'artistic' | 'project' | 'moodboard';
  defaultRotate?: number;
  tapeColor?: string;
  className?: string;
  aspectClass?: string;
  priority?: boolean;
  fitContain?: boolean;
  onClick?: () => void;
}

export function EditorialImageSlot({
  asset,
  fallbackTitle,
  fallbackHint,
  variant,
  defaultRotate = -2,
  tapeColor = '#E7A49B',
  className = '',
  aspectClass = 'aspect-[4/5]',
  priority = false,
  fitContain = false,
  onClick,
}: EditorialImageSlotProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasValidImage = Boolean(asset?.url && !imgFailed);

  const fallbackGradients: Record<EditorialImageSlotProps['variant'], string> = {
    portrait:
      'from-[#F6D5CE] via-[#F5EBDD] to-[#DFD0F4] dark:from-[#422D2B] dark:via-[#2B2523] dark:to-[#352C44]',
    artistic:
      'from-[#E7B6C5] via-[#F6C9A3] to-[#F1D16F] dark:from-[#442C36] dark:via-[#3D3124] dark:to-[#3E3520]',
    project:
      'from-[#FAF0CC] via-[#F5EBDD] to-[#E7A49B]/55 dark:from-[#3D3520] dark:via-[#2B2523] dark:to-[#442D2A]',
    moodboard:
      'from-[#E5DBF7] via-[#F5EBDD] to-[#D9E1CC] dark:from-[#342B42] dark:via-[#2B2523] dark:to-[#293226]',
  };

  return (
    <motion.div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-cursor={onClick ? 'Agrandir' : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      initial={false}
      animate={{ rotate: defaultRotate }}
      whileHover={{
        rotate: 0,
        scale: 1.025,
        y: -5,
      }}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className={`group relative transform-gpu will-change-transform rounded-[26px] border border-[#252525]/10 bg-white p-3 pb-8 shadow-[0_20px_44px_-16px_rgba(37,37,37,0.18)] transition-colors duration-400 dark:border-[#F5EBDD]/15 dark:bg-[#2C2725] dark:shadow-[0_22px_46px_-14px_rgba(0,0,0,0.55)] ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Scrapbook Washi Tape Strip */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 left-1/2 z-20 h-6 w-20 -translate-x-1/2 -rotate-2 rounded-sm opacity-85 shadow-sm transition-transform duration-200 group-hover:rotate-1"
        style={{
          backgroundColor: tapeColor,
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.22) 0px, rgba(255,255,255,0.22) 4px, transparent 4px, transparent 8px)',
        }}
      />

      {/* Image / Intentional Editorial Frame */}
      <div
        className={`relative w-full overflow-hidden rounded-[18px] ${
          fitContain ? 'bg-[#FAF6F0] dark:bg-[#211D1B]' : ''
        } ${aspectClass}`}
      >
        {hasValidImage && asset ? (
          <>
            <img
              src={withBase(asset.url)}
              alt={asset.alt || fallbackTitle}
              referrerPolicy="no-referrer"
              loading={priority ? 'eager' : 'lazy'}
              decoding={priority ? 'sync' : 'async'}
              draggable={false}
              onError={() => setImgFailed(true)}
              className={`h-full w-full transform-gpu select-none transition-transform duration-300 ease-out group-hover:scale-[1.03] ${
                fitContain ? 'object-contain p-1.5' : 'object-cover object-top'
              }`}
            />
            {onClick && (
              <span className="pointer-events-none absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full border border-white/40 bg-[#252525]/65 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Maximize2 className="h-3 w-3" />
                <span>Agrandir</span>
              </span>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#252525]/45 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            {variant !== 'portrait' && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 bottom-2.5 left-2.5 flex justify-end select-none"
              >
                <span className="max-w-full truncate rounded-full border border-white/25 bg-[#252525]/55 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-white/95">
                  © Cédrine Pigeon-Schneider · Création originale — Tous droits réservés
                </span>
              </div>
            )}
          </>
        ) : (
          <div
            className={`relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${fallbackGradients[variant]} p-6 text-center`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-3 rounded-xl border border-dashed border-[#252525]/20 dark:border-[#F5EBDD]/20"
            />
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/75 shadow-sm dark:border-[#F5EBDD]/20 dark:bg-[#2C2725]">
              {variant === 'portrait' && (
                <Camera className="h-5 w-5 text-[#252525] dark:text-[#F5EBDD]" />
              )}
              {variant === 'artistic' && (
                <Sparkles className="h-5 w-5 text-[#C94F7C] dark:text-[#F08AA8]" />
              )}
              {(variant === 'project' || variant === 'moodboard') && (
                <Palette className="h-5 w-5 text-[#252525] dark:text-[#F5EBDD]" />
              )}
            </div>
            <p className="relative z-10 mt-3 font-display text-base font-semibold text-[#252525] dark:text-[#F5EBDD]">
              {fallbackTitle}
            </p>
            <p className="relative z-10 mt-1 max-w-[200px] text-xs leading-relaxed text-[#252525]/75 dark:text-[#F5EBDD]/75">
              {fallbackHint}
            </p>
          </div>
        )}
      </div>

      {/* Handwritten Scrapbook Caption */}
      <div className="mt-2.5 flex items-center justify-between px-1">
        <p className="font-hand text-lg leading-none text-[#252525]/85 transition-colors group-hover:text-[#C94F7C] dark:text-[#F5EBDD]/90 dark:group-hover:text-[#F08AA8]">
          {asset?.caption || fallbackTitle}
        </p>
        <span className="font-hand text-sm text-[#252525]/55 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-[#F5EBDD]/60">
          ↗
        </span>
      </div>
    </motion.div>
  );
}
