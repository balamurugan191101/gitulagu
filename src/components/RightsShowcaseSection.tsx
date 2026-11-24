import { m, useReducedMotion } from 'motion/react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { Language, ULAGU_MESSAGES } from '../i18n/ulaguMessages';

interface RightsShowcaseSectionProps {
  language: Language;
  activeRightIndex: number | null;
  onSelectRight: (index: number) => void;
  onClearRight: () => void;
}

const ROMAN_PILLARS = ['I', 'II', 'III', 'IV', 'V', 'VI'] as const;

export function RightsShowcaseSection({
  language,
  activeRightIndex,
  onSelectRight,
  onClearRight,
}: RightsShowcaseSectionProps) {
  const t = ULAGU_MESSAGES[language];
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="rights"
      className="relative border-t border-[#5DB0E6]/14 bg-transparent py-16 sm:py-20 lg:py-28 px-4 sm:px-6 pointer-events-none"
    >
      <div className="mx-auto max-w-[1240px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Interactive Constitutional Index — Right Side Open for 3D Rotunda */}
        <m.div
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 pointer-events-auto glass-card rounded-2xl p-5 sm:p-7 lg:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-tamil text-xs font-semibold text-[#E5863A]">{t.rightsLabel}</p>
              <h2
                className={`mt-2 font-bold text-[#E8F2FB] text-balance ${
                  language === 'ta'
                    ? 'font-tamil text-2xl sm:text-3xl leading-[1.4] tracking-normal'
                    : 'text-2xl sm:text-3xl leading-tight tracking-tight'
                }`}
              >
                {t.rightsTitle}
              </h2>
              <p
                className={`mt-2 text-sm text-[#B2D5F1] ${
                  language === 'ta' ? 'leading-[1.75]' : 'leading-relaxed'
                }`}
              >
                {t.rightsHint}
              </p>
            </div>

            {activeRightIndex !== null && (
              <button
                type="button"
                onClick={onClearRight}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#B2D5F1] border border-[#5DB0E6]/25 rounded-lg hover:text-[#E8F2FB] hover:border-[#E5863A] transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">{t.rightsClear}</span>
              </button>
            )}
          </div>

          <ul className="mt-6 divide-y divide-[#5DB0E6]/14 border-t border-b border-[#5DB0E6]/14">
            {t.rights.map((right, idx) => {
              const active = activeRightIndex === idx;
              return (
                <li key={right.id}>
                  <button
                    type="button"
                    onClick={() => onSelectRight(idx)}
                    aria-expanded={active}
                    className={`w-full text-left py-3.5 px-3 rounded-lg transition-colors duration-150 cursor-pointer group ${
                      active ? 'bg-[#5DB0E6]/16' : 'hover:bg-[#5DB0E6]/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`font-mono text-xs font-bold w-7 text-center shrink-0 tabular-nums transition-colors ${
                            active ? 'text-[#E5863A]' : 'text-[#5DB0E6]'
                          }`}
                        >
                          {ROMAN_PILLARS[idx]}
                        </span>
                        <span
                          className={`text-sm sm:text-base font-semibold transition-colors ${
                            language === 'ta' ? 'leading-[1.45]' : 'leading-snug'
                          } ${
                            active
                              ? 'text-[#E8F2FB]'
                              : 'text-[#DCEBFA] group-hover:text-[#E8F2FB]'
                          }`}
                        >
                          {right.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span
                          className={`hidden sm:inline text-xs text-[#88AED1] tabular-nums whitespace-nowrap ${
                            language === 'ta' ? 'font-tamil' : 'font-mono'
                          }`}
                        >
                          {right.articles}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 text-[#5DB0E6] transition-transform duration-150 ${
                            active ? 'rotate-90 text-[#E5863A]' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    {active && (
                      <div className="mt-2.5 pl-10.5 pr-3">
                        <p
                          className={`sm:hidden text-xs font-semibold text-[#E5863A] tabular-nums mb-1 ${
                            language === 'ta' ? 'font-tamil' : 'font-mono'
                          }`}
                        >
                          {right.articles}
                        </p>
                        <p
                          className={`text-sm text-[#B2D5F1] ${
                            language === 'ta' ? 'leading-[1.78]' : 'leading-relaxed'
                          }`}
                        >
                          {right.brief}
                        </p>
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </m.div>

        {/* Open Right Half — Interactive 3D Constitutional Rotunda Window */}
        <div className="hidden lg:block lg:col-span-6 h-[420px]" aria-hidden="true" />
      </div>
    </section>
  );
}

export default RightsShowcaseSection;
