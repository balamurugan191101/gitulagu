import { useEffect, useState } from 'react';
import { m, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Language, ULAGU_MESSAGES } from '../i18n/ulaguMessages';

interface TopNavProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  sectionsReady?: boolean;
}

const TRACKED_SECTION_IDS = ['rights', 'features', 'how', 'team', 'coming-soon', 'join'] as const;

export function TopNav({ language, onLanguageChange, sectionsReady = false }: TopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const prefersReduced = useReducedMotion();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  const t = ULAGU_MESSAGES[language];

  const navItems = [
    { id: 'rights', href: '#rights', label: t.navRights },
    { id: 'features', href: '#features', label: t.navFeatures },
    { id: 'how', href: '#how', label: t.navHow },
    { id: 'team', href: '#team', label: t.navTeam },
    { id: 'coming-soon', href: '#coming-soon', label: t.comingSoonLabel },
  ];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const sections = TRACKED_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -45% 0px' }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [sectionsReady]);

  return (
    <header className="fixed top-0 inset-x-0 z-30 border-b border-[#5DB0E6]/20 glass-bar">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3 xl:gap-6">
        {/* Zone 1: Official Ulagu Brand Logo */}
        <a
          href="#top"
          className="inline-flex items-center shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E5863A]"
        >
          <img
            src="/assets/brand/ulagu-logo.svg"
            alt={`${t.brandEnglish} ${t.brandTamil}`}
            width={114}
            height={45}
            decoding="async"
            className="h-8 sm:h-9 xl:h-10 w-auto object-contain shrink-0"
          />
        </a>

        {/* Zone 2: Section-Synced Single-Line Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-2.5 xl:gap-5 text-[11.5px] xl:text-[13px] font-medium text-[#B2D5F1]"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={isActive ? 'location' : undefined}
                className={`py-1 transition-colors duration-150 whitespace-nowrap shrink-0 underline-offset-[6px] ${
                  isActive
                    ? 'text-[#E8F2FB] font-semibold underline decoration-[#E5863A] decoration-2'
                    : 'hover:text-[#E8F2FB] hover:underline decoration-[#5DB0E6]/60'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Language Switcher + Primary Action + Mobile Drawer Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div
            role="group"
            aria-label="Language selector"
            className="inline-flex items-center p-0.5 border border-[#5DB0E6]/28 rounded-lg bg-[#0D2133]"
          >
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              aria-pressed={language === 'en'}
              className={`px-2 sm:px-2.5 py-1.5 sm:py-1 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                language === 'en'
                  ? 'bg-[#E8F2FB] text-[#0B1C2A]'
                  : 'text-[#B2D5F1] hover:text-[#E8F2FB]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('ta')}
              aria-pressed={language === 'ta'}
              className={`font-tamil px-2 sm:px-2.5 py-1.5 sm:py-1 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                language === 'ta'
                  ? 'bg-[#E8F2FB] text-[#0B1C2A]'
                  : 'text-[#B2D5F1] hover:text-[#E8F2FB]'
              }`}
            >
              தமிழ்
            </button>
          </div>

          <a
            href="#join"
            className="hidden sm:inline-flex px-2.5 xl:px-4 py-2 text-[11.5px] xl:text-xs font-bold text-[#0B1C2A] bg-[#E5863A] rounded-lg hover:bg-[#F09952] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5863A]"
          >
            {t.joinWaitlist}
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? t.menuClose : t.menuOpen}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-[#5DB0E6]/28 text-[#E8F2FB] hover:border-[#E5863A] transition-colors cursor-pointer"
          >
            {menuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile & Tablet Navigation Drawer */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-[#5DB0E6]/18 bg-[#071420] px-4 sm:px-6 py-4 max-h-[calc(100dvh-3.75rem)] overflow-y-auto flex flex-col gap-1"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive ? 'location' : undefined}
                className={`min-h-[44px] flex items-center px-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#10283A] text-[#E5863A] font-semibold'
                    : 'text-[#E8F2FB] hover:bg-[#10283A]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <a
            href="#join"
            onClick={() => setMenuOpen(false)}
            className="mt-2 min-h-[44px] flex items-center justify-center px-4 rounded-lg text-sm font-bold text-center text-[#0B1C2A] bg-[#E5863A]"
          >
            {t.joinWaitlist}
          </a>
        </nav>
      )}

      {/* Compositor-only scroll progress hairline */}
      <m.div
        aria-hidden="true"
        style={{
          scaleX: prefersReduced ? scrollYProgress : smoothProgress,
          transformOrigin: '0% 50%',
        }}
        className="h-[2px] w-full bg-[#E5863A]"
      />
    </header>
  );
}
