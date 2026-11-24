import { m, useReducedMotion } from 'motion/react';
import { Language, ULAGU_MESSAGES } from '../i18n/ulaguMessages';

interface CaseStudiesSectionProps {
  language: Language;
}

export function CaseStudiesSection({ language }: CaseStudiesSectionProps) {
  const t = ULAGU_MESSAGES[language];
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="team"
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
          <p className="text-xs font-semibold text-[#5DB0E6]">{t.teamKicker}</p>
          <h2
            className={`mt-2 font-bold text-[#E8F2FB] text-balance ${
              language === 'ta'
                ? 'font-tamil text-2xl sm:text-3xl leading-[1.4] tracking-normal'
                : 'text-3xl sm:text-4xl leading-tight tracking-tight'
            }`}
          >
            {t.teamTitle}
          </h2>
        </m.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {t.team.map((member, idx) => (
            <m.article
              key={member.name}
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="pointer-events-auto glass-card rounded-2xl p-7 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="w-11 h-11 rounded-lg bg-[#0B2236]/60 border border-[#5DB0E6]/28 font-mono text-sm font-bold text-[#E5863A] grid place-items-center shrink-0"
                  >
                    {member.initials}
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#E8F2FB]">
                      {member.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#5DB0E6]">
                      {member.role}
                    </p>
                  </div>
                </div>

                <p
                  className={`mt-5 pt-5 border-t border-[#5DB0E6]/14 text-sm text-[#B2D5F1] ${
                    language === 'ta' ? 'leading-[1.78]' : 'leading-relaxed'
                  }`}
                >
                  {member.text}
                </p>
              </div>
            </m.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CaseStudiesSection;
