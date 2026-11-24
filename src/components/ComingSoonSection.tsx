import { m, useReducedMotion } from 'motion/react';
import { Language, ULAGU_MESSAGES } from '../i18n/ulaguMessages';

interface ComingSoonSectionProps {
  language: Language;
}

export function ComingSoonSection({ language }: ComingSoonSectionProps) {
  const t = ULAGU_MESSAGES[language];
  const prefersReduced = useReducedMotion();

  const posters = [
    {
      src: '/assets/posters/ulagu-india.jpg',
      alt: t.posterIndiaAlt,
      caption: t.posterIndiaCaption,
    },
    {
      src: '/assets/posters/ulagu-globe.jpg',
      alt: t.posterGlobeAlt,
      caption: t.posterGlobeCaption,
    },
  ];

  return (
    <section
      id="coming-soon"
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
          <p className="text-xs font-semibold text-[#E5863A]">{t.comingSoonLabel}</p>
          <h2
            className={`mt-2 font-bold text-[#E8F2FB] text-balance ${
              language === 'ta'
                ? 'font-tamil text-2xl sm:text-3xl leading-[1.4] tracking-normal'
                : 'text-3xl sm:text-4xl leading-tight tracking-tight'
            }`}
          >
            {t.comingSoonTitle}
          </h2>
          <p
            className={`mt-3 text-sm sm:text-base text-[#B2D5F1] ${
              language === 'ta' ? 'leading-[1.8]' : 'leading-relaxed'
            }`}
          >
            {t.comingSoonSubtitle}
          </p>
        </m.div>

        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl">
          {posters.map((poster, idx) => (
            <m.figure
              key={poster.src}
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="pointer-events-auto glass-card rounded-2xl p-3 sm:p-4 overflow-hidden group"
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl border border-[#5DB0E6]/20 bg-[#071420]">
                <img
                  src={poster.src}
                  alt={poster.alt}
                  width={1080}
                  height={1080}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <figcaption
                className={`mt-3 px-1 text-xs sm:text-sm font-medium text-[#B2D5F1] ${
                  language === 'ta' ? 'leading-[1.7]' : 'leading-relaxed'
                }`}
              >
                {poster.caption}
              </figcaption>
            </m.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ComingSoonSection;
