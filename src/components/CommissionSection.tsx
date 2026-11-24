import { FormEvent, useState } from 'react';
import { m, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';
import { Language, ULAGU_MESSAGES } from '../i18n/ulaguMessages';

interface CommissionSectionProps {
  language: Language;
  onOpenPrivacy: () => void;
}

const WAITLIST_STORAGE_KEY = 'ulagu-waitlist-email';

const WAITLIST_CONFIG = {
  FORM_URL:
    'https://docs.google.com/forms/d/e/1FAIpQLSdV4TWelmvFSv7g6EH3CM8cvh0IP1eV7udN2IBTIu2LucoR1g/viewform',
  EMAIL_ENTRY: 'entry.276694625',
  LANGUAGE_ENTRY: 'entry.1138279952',
};

type WaitlistErrorType = 'invalidEmail' | 'missingConsent' | 'submitFailed' | null;

export function CommissionSection({ language, onOpenPrivacy }: CommissionSectionProps) {
  const t = ULAGU_MESSAGES[language];
  const prefersReduced = useReducedMotion();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorType, setErrorType] = useState<WaitlistErrorType>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(WAITLIST_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed)) {
      setErrorType('invalidEmail');
      return;
    }

    if (!consent) {
      setErrorType('missingConsent');
      return;
    }

    setErrorType(null);
    setSubmitting(true);

    try {
      const body = new FormData();
      body.append(WAITLIST_CONFIG.EMAIL_ENTRY, trimmed);
      body.append(WAITLIST_CONFIG.LANGUAGE_ENTRY, language === 'ta' ? 'Tamil' : 'English');

      await fetch(WAITLIST_CONFIG.FORM_URL.replace(/\/viewform.*$/, '/formResponse'), {
        method: 'POST',
        mode: 'no-cors',
        body,
      });

      setSubmittedEmail(trimmed);
      try {
        window.localStorage.setItem(WAITLIST_STORAGE_KEY, trimmed);
      } catch {
        // Ignore storage errors in restricted browsing modes
      }
    } catch {
      setErrorType('submitFailed');
    } finally {
      setSubmitting(false);
    }
  };

  const errorMessage =
    errorType === 'invalidEmail'
      ? t.waitlistInvalid
      : errorType === 'missingConsent'
        ? t.consentMissing
        : errorType === 'submitFailed'
          ? t.waitlistError
          : null;

  return (
    <section
      id="join"
      className="relative border-t border-[#5DB0E6]/14 bg-transparent py-16 sm:py-20 lg:py-28 pb-28 sm:pb-36 px-4 sm:px-6 pointer-events-none"
    >
      <div className="mx-auto max-w-[1240px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        <m.div
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 pointer-events-auto glass-card rounded-2xl p-5 sm:p-8 lg:p-10 text-left"
        >
          <p
            className={`text-xs font-semibold text-[#E5863A] tabular-nums ${
              language === 'ta' ? 'font-tamil' : 'font-mono'
            }`}
          >
            {t.joinKicker}
          </p>
          <h2
            className={`mt-2.5 font-bold text-[#E8F2FB] text-balance ${
              language === 'ta'
                ? 'font-tamil text-2xl sm:text-3xl leading-[1.42] tracking-normal'
                : 'text-2xl sm:text-4xl leading-tight tracking-tight'
            }`}
          >
            {t.joinTitle}
          </h2>
          <p
            className={`mt-3.5 text-sm sm:text-base text-[#B2D5F1] max-w-xl ${
              language === 'ta' ? 'leading-[1.8]' : 'leading-relaxed'
            }`}
          >
            {t.joinText}
          </p>

          {submittedEmail ? (
            <div
              role="status"
              aria-live="polite"
              className="mt-8 bg-[#071420]/65 border border-[#5DB0E6]/28 rounded-xl p-6 text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#E5863A]/15 border border-[#E5863A]/45 flex items-center justify-center text-[#E5863A] shrink-0">
                  <Check className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#E8F2FB]">{t.waitlistSuccess}</p>
                  <p className="mt-1 font-mono text-xs text-[#5DB0E6]">{submittedEmail}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedEmail(null);
                      setEmail('');
                      setConsent(false);
                      setErrorType(null);
                      try {
                        window.localStorage.removeItem(WAITLIST_STORAGE_KEY);
                      } catch {
                        // Ignore storage errors
                      }
                    }}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-[#E8F2FB] bg-[#132E44] border border-[#5DB0E6]/28 rounded-lg hover:border-[#E5863A] transition-colors duration-150 cursor-pointer"
                  >
                    {t.waitlistAnother}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-8">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <label htmlFor="waitlist-email" className="sr-only">
                  {t.emailLabel}
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorType === 'invalidEmail') setErrorType(null);
                  }}
                  placeholder={t.emailPlaceholder}
                  aria-invalid={errorType === 'invalidEmail'}
                  aria-describedby={errorMessage ? 'waitlist-feedback' : undefined}
                  className="flex-1 min-w-0 min-h-[46px] px-4 py-3 text-sm font-medium text-[#E8F2FB] bg-[#06121E]/62 border border-[#5DB0E6]/32 rounded-lg placeholder:text-[#8FB4D4] focus:outline-none focus:border-[#E5863A] transition-colors"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto min-h-[46px] px-5 py-3 text-sm font-bold text-[#0B1C2A] bg-[#E5863A] rounded-lg hover:bg-[#F09952] disabled:opacity-70 disabled:cursor-wait transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5863A]"
                >
                  {submitting ? t.submittingWaitlist : t.submitWaitlist}
                </button>
              </div>

              <label className="mt-4 flex items-start gap-2.5 text-xs text-[#B2D5F1] leading-relaxed cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="consent"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (errorType === 'missingConsent') setErrorType(null);
                  }}
                  aria-invalid={errorType === 'missingConsent'}
                  className="mt-0.5 h-4 w-4 rounded border border-[#5DB0E6]/45 bg-[#06121E] accent-[#E5863A] shrink-0 cursor-pointer"
                />
                <span>
                  {t.consentPrefix}
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="text-[#5DB0E6] underline underline-offset-4 hover:text-[#E5863A] transition-colors cursor-pointer"
                  >
                    {t.consentLinkLabel}
                  </button>
                  {t.consentSuffix}
                </span>
              </label>

              {errorMessage && (
                <p
                  id="waitlist-feedback"
                  role="alert"
                  className="mt-3 text-xs font-semibold text-[#F87171]"
                >
                  {errorMessage}
                </p>
              )}
            </form>
          )}
        </m.div>

        {/* Open Right Column — Re-converged 3D Monument Stage */}
        <div className="hidden lg:block lg:col-span-6 h-[380px]" aria-hidden="true" />
      </div>
    </section>
  );
}

export default CommissionSection;
