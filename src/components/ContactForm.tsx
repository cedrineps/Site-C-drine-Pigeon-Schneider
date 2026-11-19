import { FormEvent, useState } from 'react';
import { AlertCircle, CheckCircle2, Mail, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { CONTACT_INFO } from '../data/initialPortfolio';

interface ContactFormProps {
  reducedMotion: boolean;
}

interface FormState {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  honey: string;
}

const INITIAL_FORM: FormState = {
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  phone: '',
  message: '',
  honey: '',
};

export function ContactForm({ reducedMotion }: ContactFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (validationError) setValidationError(null);
    if (submitStatus === 'error') setSubmitStatus('idle');
  };

  const buildMailtoHref = () => {
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim() || 'Contact portfolio';
    const companyPart = form.company.trim() ? ` (${form.company.trim()})` : '';
    const subject = encodeURIComponent(`Contact portfolio — ${fullName}${companyPart}`);
    const bodyLines = [
      `Prénom : ${form.firstName.trim()}`,
      `Nom : ${form.lastName.trim()}`,
      `Entreprise : ${form.company.trim() || 'Non précisée'}`,
      `E-mail : ${form.email.trim() || 'Non renseigné'}`,
      `Téléphone : ${form.phone.trim() || 'Non renseigné'}`,
      '',
      'Message :',
      form.message.trim(),
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));
    return `mailto:${CONTACT_INFO.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (form.honey.trim().length > 0) {
      setSubmitStatus('success');
      return;
    }

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const company = form.company.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();

    if (!lastName || !firstName) {
      setValidationError('Veuillez indiquer votre nom et votre prénom.');
      return;
    }
    if (!email && !phone) {
      setValidationError('Veuillez renseigner un numéro de téléphone ou une adresse e-mail pour vous recontacter.');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('L’adresse e-mail saisie ne semble pas valide.');
      return;
    }
    if (!message) {
      setValidationError('Veuillez saisir votre message.');
      return;
    }

    setSubmitting(true);
    setValidationError(null);
    setErrorDetail(null);

    try {
      const payload: Record<string, string> = {
        Prénom: firstName,
        Nom: lastName,
        Entreprise: company || 'Non précisée',
        'E-mail': email || 'Non renseigné',
        Téléphone: phone || 'Non renseigné',
        Message: message,
        _subject: `Nouveau message portfolio — ${firstName} ${lastName}${company ? ` (${company})` : ''}`,
        _template: 'table',
        _captcha: 'false',
      };

      if (email) {
        payload._replyto = email;
      }

      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_INFO.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as
        | { success?: boolean | string; message?: string }
        | null;

      const ok = res.ok && (data?.success === true || data?.success === 'true');
      if (!ok) {
        throw new Error(
          data?.message || "L'envoi automatique n'a pas pu aboutir pour le moment."
        );
      }

      setSubmitStatus('success');
    } catch (err) {
      setSubmitStatus('error');
      setErrorDetail(
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer le message automatiquement."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputBaseClass =
    'mt-1.5 w-full rounded-2xl border border-[#252525]/12 bg-[#FFFDF9] px-4 py-2.5 text-sm text-[#252525] placeholder:text-[#252525]/40 transition-colors focus:border-[#C94F7C] focus:outline-none focus:ring-2 focus:ring-[#C94F7C]/20 dark:border-[#F5EBDD]/15 dark:bg-[#1E1A1C] dark:text-[#F5EBDD] dark:placeholder:text-[#F5EBDD]/40 dark:focus:border-[#F08AA8] dark:focus:ring-[#F08AA8]/20';

  return (
    <div
      id="contact-form"
      className="relative mt-8 scroll-mt-28 rounded-[28px] border border-white/85 bg-white/85 p-6 shadow-[0_20px_44px_-18px_rgba(37,37,37,0.14)] backdrop-blur-md transition-colors duration-400 dark:border-[#F5EBDD]/15 dark:bg-[#2B2327]/90 sm:p-8"
    >
      {/* Scrapbook Washi Tape */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 right-12 h-6 w-24 rotate-1 rounded-sm bg-[#F1D16F]/85 opacity-90 shadow-xs"
      />

      <div className="flex flex-col justify-between gap-2 border-b border-[#252525]/10 pb-4 dark:border-[#F5EBDD]/15 sm:flex-row sm:items-end">
        <div>
          <p className="font-hand text-2xl font-bold text-[#C94F7C] dark:text-[#F08AA8]">
            Écrire un message
          </p>
          <h3 className="font-display text-2xl font-bold text-[#252525] dark:text-[#F5EBDD]">
            Formulaire de contact
          </h3>
        </div>
        <p className="text-xs text-[#252525]/65 dark:text-[#F5EBDD]/65">
          Envoyé directement à <span className="font-semibold">{CONTACT_INFO.email}</span>
        </p>
      </div>

      {submitStatus === 'success' ? (
        <div className="mt-6 rounded-2xl border border-[#4F6638]/25 bg-[#D9E1CC]/45 p-6 text-center dark:border-[#C5D9AA]/25 dark:bg-[#263022]/75">
          <CheckCircle2 className="mx-auto h-10 w-10 text-[#4F6638] dark:text-[#C5D9AA]" />
          <h4 className="font-display mt-3 text-xl font-bold text-[#252525] dark:text-[#F5EBDD]">
            Merci {form.firstName.trim()}, votre message a bien été envoyé !
          </h4>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#252525]/80 dark:text-[#F5EBDD]/80">
            Vos coordonnées et votre message ont été transmis à Cédrine Pigeon-Schneider (
            <span className="font-medium">{CONTACT_INFO.email}</span>). Elle vous recontactera
            très rapidement.
          </p>
          <button
            type="button"
            onClick={() => {
              setForm(INITIAL_FORM);
              setSubmitStatus('idle');
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#252525] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#383838] cursor-pointer dark:bg-[#F5EBDD] dark:text-[#252525] dark:hover:bg-[#FFFDF9]"
          >
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          {/* Anti-spam honeypot */}
          <input
            type="text"
            name="_honey"
            value={form.honey}
            onChange={(e) => updateField('honey', e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="contact-last-name"
                className="block text-xs font-semibold text-[#252525]/80 dark:text-[#F5EBDD]/85"
              >
                Nom <span className="text-[#C94F7C] dark:text-[#F08AA8]">*</span>
              </label>
              <input
                id="contact-last-name"
                name="lastName"
                type="text"
                required
                autoComplete="family-name"
                placeholder="Ex. Dupont"
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className={inputBaseClass}
              />
            </div>

            <div>
              <label
                htmlFor="contact-first-name"
                className="block text-xs font-semibold text-[#252525]/80 dark:text-[#F5EBDD]/85"
              >
                Prénom <span className="text-[#C94F7C] dark:text-[#F08AA8]">*</span>
              </label>
              <input
                id="contact-first-name"
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
                placeholder="Ex. Camille"
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className={inputBaseClass}
              />
            </div>

            <div>
              <label
                htmlFor="contact-company"
                className="block text-xs font-semibold text-[#252525]/80 dark:text-[#F5EBDD]/85"
              >
                Nom de l&rsquo;entreprise
              </label>
              <input
                id="contact-company"
                name="company"
                type="text"
                autoComplete="organization"
                placeholder="Ex. Agence / Entreprise"
                value={form.company}
                onChange={(e) => updateField('company', e.target.value)}
                className={inputBaseClass}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#252525]/8 bg-[#F5EBDD]/40 p-4 dark:border-[#F5EBDD]/10 dark:bg-[#1E191B]/60">
            <p className="text-xs font-medium text-[#252525]/70 dark:text-[#F5EBDD]/75">
              Coordonnées pour vous recontacter{' '}
              <span className="font-semibold text-[#C94F7C] dark:text-[#F08AA8]">
                (e-mail ou téléphone requis)
              </span>
            </p>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold text-[#252525]/80 dark:text-[#F5EBDD]/85"
                >
                  Adresse e-mail
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="camille.dupont@entreprise.fr"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={inputBaseClass}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="block text-xs font-semibold text-[#252525]/80 dark:text-[#F5EBDD]/85"
                >
                  Numéro de téléphone
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="06 12 34 56 78"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={inputBaseClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="block text-xs font-semibold text-[#252525]/80 dark:text-[#F5EBDD]/85"
            >
              Votre message <span className="text-[#C94F7C] dark:text-[#F08AA8]">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={4}
              placeholder="Bonjour Cédrine, nous souhaitons échanger avec vous au sujet d'une alternance..."
              value={form.message}
              onChange={(e) => updateField('message', e.target.value)}
              className={`${inputBaseClass} resize-y`}
            />
          </div>

          {validationError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-2xl border border-[#C94F7C]/30 bg-[#F6DCD8]/60 px-4 py-3 text-xs font-medium text-[#8C284C] dark:border-[#F08AA8]/30 dark:bg-[#3F242E]/75 dark:text-[#F5B7C8]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-2xl border border-[#C94F7C]/30 bg-[#F6DCD8]/60 p-4 text-xs text-[#8C284C] dark:border-[#F08AA8]/30 dark:bg-[#3F242E]/75 dark:text-[#F5B7C8] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {errorDetail || "L'envoi direct a été bloqué par votre navigateur ou réseau."}{' '}
                  Vous pouvez envoyer votre message en un clic via votre messagerie :
                </span>
              </div>
              <a
                href={buildMailtoHref()}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#252525] px-4 py-2 text-xs font-semibold text-white hover:bg-[#383838] dark:bg-[#F5EBDD] dark:text-[#252525]"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Envoyer par e-mail</span>
              </a>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <p className="text-xs text-[#252525]/60 dark:text-[#F5EBDD]/60">
              <span className="text-[#C94F7C] dark:text-[#F08AA8]">*</span> Champs obligatoires
            </p>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={reducedMotion || submitting ? undefined : { y: -2, scale: 1.02 }}
              whileTap={reducedMotion || submitting ? undefined : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
              className="inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-full bg-[#252525] px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-10px_rgba(37,37,37,0.4)] transition-colors hover:bg-[#383838] disabled:opacity-60 cursor-pointer dark:bg-[#F5EBDD] dark:text-[#252525] dark:hover:bg-[#FFFDF9]"
            >
              <Send className="h-4 w-4 text-[#E7A49B] dark:text-[#C94F7C]" />
              <span>{submitting ? 'Envoi en cours…' : 'Envoyer le message'}</span>
            </motion.button>
          </div>
        </form>
      )}
    </div>
  );
}
