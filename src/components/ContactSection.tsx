import { useState } from 'react';
import {
  Briefcase,
  Calendar,
  Check,
  Copy,
  Download,
  ExternalLink,
  Lock,
  Mail,
  MapPin,
} from 'lucide-react';
import { motion } from 'motion/react';
import { APPRENTICESHIP_DETAILS, CONTACT_INFO } from '../data/initialPortfolio';
import { CvPreviewCard } from './CvPreviewCard';
import { ScrollReveal } from './ScrollReveal';
import { STATIC_CV_PDF_PATH, withBase } from '../utils/assetUrl';

interface ContactSectionProps {
  hasBackendApi?: boolean;
  onOpenStudio: () => void;
  reducedMotion: boolean;
}

export function ContactSection({
  hasBackendApi = false,
  onOpenStudio,
  reducedMotion,
}: ContactSectionProps) {
  const cvHref = hasBackendApi ? '/api/cv' : withBase(STATIC_CV_PDF_PATH);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${CONTACT_INFO.email}`;
    }
  };

  return (
    <section id="contact" className="relative pt-20 pb-14 sm:pt-28 sm:pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="max-w-2xl"
        >
          <p className="font-hand text-2xl font-bold text-[#C94F7C] dark:text-[#F08AA8] sm:text-3xl">
            04. Alternance &amp; prise de contact
          </p>
          <h2 className="font-display headline-balance mt-2 text-4xl font-bold tracking-tight text-[#252525] dark:text-[#F5EBDD] sm:text-5xl">
            Let&rsquo;s make it happen!
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#252525]/85 dark:text-[#F5EBDD]/82">
            Vous recherchez une alternante tournée vers la <strong>stratégie marketing</strong> —
            comprendre le produit ou service, cibler le marché, définir comment le vendre et guider
            la ligne directrice des visuels et vidéos publicitaires ? Échangeons sur vos prochains
            enjeux.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Apprenticeship Details */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="rounded-[28px] border border-white/85 bg-white/80 p-7 shadow-[0_20px_44px_-18px_rgba(37,37,37,0.14)] backdrop-blur-md transition-colors duration-400 dark:border-[#F5EBDD]/15 dark:bg-[#2B2327]/90 lg:col-span-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#252525]/10 pb-4 dark:border-[#F5EBDD]/15">
              <h3 className="font-display text-2xl font-bold text-[#252525] dark:text-[#F5EBDD]">
                Ma recherche d&rsquo;alternance
              </h3>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#C94F7C] dark:text-[#F08AA8]">
                <span className="relative flex h-2 w-2">
                  {!reducedMotion && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C94F7C] dark:bg-[#F08AA8] opacity-75" />
                  )}
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C94F7C] dark:bg-[#F08AA8]" />
                </span>
                Disponible immédiatement
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-[#C94F7C] dark:text-[#F08AA8]" />
                <div>
                  <p className="text-xs font-semibold text-[#252525]/60 dark:text-[#F5EBDD]/65">
                    Formation
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[#252525] dark:text-[#F5EBDD]">
                    {APPRENTICESHIP_DETAILS.formation}
                  </p>
                  <a
                    href={APPRENTICESHIP_DETAILS.formationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#C94F7C] underline underline-offset-4 hover:text-[#252525] dark:text-[#F08AA8] dark:hover:text-[#F5EBDD]"
                  >
                    <span>Programme officiel Ascencia</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-[#C94F7C] dark:text-[#F08AA8]" />
                <div>
                  <p className="text-xs font-semibold text-[#252525]/60 dark:text-[#F5EBDD]/65">
                    Durée &amp; rythme
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[#252525] dark:text-[#F5EBDD]">
                    {APPRENTICESHIP_DETAILS.duration} · {APPRENTICESHIP_DETAILS.rhythm}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#C94F7C] dark:text-[#F08AA8]" />
                <div>
                  <p className="text-xs font-semibold text-[#252525]/60 dark:text-[#F5EBDD]/65">
                    Localisation &amp; mobilité
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-[#252525] dark:text-[#F5EBDD]">
                    {APPRENTICESHIP_DETAILS.location} — Mobilité : {APPRENTICESHIP_DETAILS.mobility}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#252525]/10 pt-5 dark:border-[#F5EBDD]/15">
              <p className="text-xs font-semibold text-[#252525]/60 dark:text-[#F5EBDD]/65">
                Missions recherchées
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {APPRENTICESHIP_DETAILS.missions.map((mission) => (
                  <li
                    key={mission}
                    className="flex items-start gap-2 text-sm leading-snug text-[#252525]/90 dark:text-[#F5EBDD]/88"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C94F7C] dark:bg-[#F08AA8]"
                    />
                    <span>{mission}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right: Direct Contact Card */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 24, rotate: 1 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.08 }}
            className="flex flex-col justify-between rounded-[28px] bg-[#252525] p-7 text-white shadow-[0_24px_50px_-18px_rgba(37,37,37,0.45)] dark:border dark:border-[#E7B6C5]/25 dark:bg-[#33242B] lg:col-span-5"
          >
            <div>
              <p className="font-hand text-2xl text-[#E7B6C5]">Prenons rendez-vous</p>
              <h3 className="font-display mt-1 text-2xl font-bold text-white">
                Contact direct
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Pour convenir d&rsquo;un entretien, recevoir un dossier complet ou discuter d&rsquo;une
                opportunité d&rsquo;alternance :
              </p>

              {/* Email explicitly visible in full text */}
              <div className="mt-6 rounded-2xl border border-white/15 bg-white/8 p-4">
                <p className="text-xs font-medium text-white/65">Adresse e-mail</p>
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-[#E7A49B] underline-offset-4 hover:text-[#E7B6C5] break-all"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-[#E7A49B]" />
                    <span>{CONTACT_INFO.email}</span>
                  </a>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#D9E1CC]" />
                        <span>Copié</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copier</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <motion.a
                href={cvHref}
                download={CONTACT_INFO.cvFileName}
                whileHover={reducedMotion ? undefined : { y: -2, scale: 1.02 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#252525] dark:bg-[#F5EBDD]"
              >
                <Download className="h-4 w-4 text-[#C94F7C]" />
                <span>Télécharger mon CV</span>
              </motion.a>

              <motion.a
                href={CONTACT_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={reducedMotion ? undefined : { y: -2, scale: 1.02 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full border border-white/25 bg-transparent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <span>Voir mon LinkedIn</span>
                <ExternalLink className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Interactive PDF CV Preview */}
        <ScrollReveal reducedMotion={reducedMotion} yOffset={26}>
          <CvPreviewCard hasBackendApi={hasBackendApi} />
        </ScrollReveal>

        {/* Clean Footer */}
        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#252525]/12 pt-8 text-xs text-[#252525]/75 dark:border-[#F5EBDD]/15 dark:text-[#F5EBDD]/75 sm:flex-row">
          <div className="flex flex-col items-center gap-1.5 text-center sm:items-start sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <span className="font-display text-base font-bold text-[#252525] dark:text-[#F5EBDD]">
                PIGEON.
              </span>
              <span aria-hidden="true">·</span>
              <span>Cédrine Pigeon-Schneider</span>
              <span aria-hidden="true">·</span>
              <span>{CONTACT_INFO.city}</span>
            </div>
            <p className="text-[11px] text-[#252525]/65 dark:text-[#F5EBDD]/65">
              © 2026 Cédrine Pigeon-Schneider — L’ensemble des visuels et créations présentés sont
              des réalisations originales. Tous droits réservés.
            </p>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="hover:text-[#252525] transition-colors dark:hover:text-[#F5EBDD]"
            >
              {CONTACT_INFO.email}
            </a>
            <button
              type="button"
              onClick={onOpenStudio}
              className="inline-flex items-center gap-1.5 text-[#252525]/60 transition-colors hover:text-[#252525] cursor-pointer dark:text-[#F5EBDD]/65 dark:hover:text-[#F5EBDD]"
              title="Espace réservé à Cédrine pour gérer les images et publier en un clic"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Espace Cédrine</span>
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}
