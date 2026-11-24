import { m, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Language, ULAGU_MESSAGES } from '../i18n/ulaguMessages';
import { SceneControlState } from '../three/types';

interface CapabilitiesSectionProps {
  language: Language;
  onFocusMonument: (patch: Partial<SceneControlState>) => void;
}

export function CapabilitiesSection({
  language,
  onFocusMonument,
}: CapabilitiesSectionProps) {
  const t = ULAGU_MESSAGES[language];
  const prefersReduced = useReducedMotion();

  const handleFocusRights = () => {
    onFocusMonument({
      explode: 0.45,
      cameraPreset: 'overview',
      scrollSync: false,
      activeRightIndex: 5,
    });
    const el = document.getElementById('rights');
    if (el) {
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <>
      {/* Section 3: What's inside Ulagu (#features) */}
      <section
        id="features"
        className="relative border-t border-[#5DB0E6]/14 bg-transparent py-16 sm:py-20 lg:py-28 px-4 sm:px-6 pointer-events-none"
      >
        <div className="mx-auto max-w-[1240px]">
          <m.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:ml-auto max-w-2xl pointer-events-auto"
          >
            <p className="text-xs font-semibold text-[#5DB0E6]">{t.featuresKicker}</p>
            <h2
              className={`mt-2 font-bold text-[#E8F2FB] text-balance ${
                language === 'ta'
                  ? 'font-tamil text-2xl sm:text-3xl leading-[1.4] tracking-normal'
                  : 'text-3xl sm:text-4xl leading-tight tracking-tight'
              }`}
            >
              {t.featuresTitle}
            </h2>
            <p
              className={`mt-3 text-base text-[#B2D5F1] max-w-xl ${
                language === 'ta' ? 'leading-[1.78]' : 'leading-relaxed'
              }`}
            >
              {t.featuresSubtitle}
            </p>
          </m.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.features.map((feat, idx) => (
              <m.article
                key={feat.number}
                initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.16 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`pointer-events-auto rounded-2xl p-6 sm:p-7 flex flex-col justify-between ${
                  feat.featured
                    ? 'md:col-span-2 glass-card-accent'
                    : 'glass-card'
                }`}
              >
                <div>
                  <span className="block font-mono text-xs font-bold text-[#E5863A] tabular-nums">
                    {feat.number}
                  </span>
                  <h3
                    className={`mt-3 text-lg sm:text-xl font-bold text-[#E8F2FB] ${
                      feat.featured || language === 'ta'
                        ? 'font-tamil leading-[1.45]'
                        : 'leading-snug'
                    }`}
                  >
                    {feat.title}
                  </h3>
                  <p
                    className={`mt-2.5 text-sm text-[#B2D5F1] ${
                      language === 'ta' ? 'leading-[1.78]' : 'leading-relaxed'
                    }`}
                  >
                    {feat.text}
                  </p>
                </div>

                {feat.featured && (
                  <div className="mt-6 pt-4 border-t border-[#5DB0E6]/16 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleFocusRights}
                      className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-[#0B1C2A] bg-[#E5863A] rounded-lg hover:bg-[#F09952] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>{t.focusMonumentCta}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </m.article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: How it works (#how) */}
      <section
        id="how"
        className="relative border-t border-[#5DB0E6]/14 bg-transparent py-16 sm:py-20 lg:py-28 px-4 sm:px-6 pointer-events-none"
      >
        <div className="mx-auto max-w-[1240px]">
          <m.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl pointer-events-auto"
          >
            <p className="text-xs font-semibold text-[#5DB0E6]">{t.howKicker}</p>
            <h2
              className={`mt-2 font-bold text-[#E8F2FB] text-balance ${
                language === 'ta'
                  ? 'font-tamil text-2xl sm:text-3xl leading-[1.4] tracking-normal'
                  : 'text-3xl sm:text-4xl leading-tight tracking-tight'
              }`}
            >
              {t.howTitle}
            </h2>
          </m.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.steps.map((step, idx) => (
              <m.article
                key={step.number}
                initial={prefersReduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="pointer-events-auto glass-card rounded-2xl p-7 flex flex-col justify-between"
              >
                <div>
                  <span className="block font-mono text-2xl font-bold text-[#E5863A] tabular-nums">
                    0{step.number}
                  </span>
                  <div className="mt-4 pt-4 border-t border-[#5DB0E6]/14">
                    <h3
                      className={`text-lg font-bold text-[#E8F2FB] ${
                        language === 'ta' ? 'font-tamil leading-[1.45]' : 'leading-snug'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`mt-2.5 text-sm text-[#B2D5F1] ${
                        language === 'ta' ? 'leading-[1.78]' : 'leading-relaxed'
                      }`}
                    >
                      {step.text}
                    </p>
                  </div>
                </div>
              </m.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default CapabilitiesSection;
