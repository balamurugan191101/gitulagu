import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { LazyMotion, m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight, ArrowUp, ChevronUp, X } from 'lucide-react';
import { TopNav } from './components/TopNav';
import { Language, ULAGU_MESSAGES } from './i18n/ulaguMessages';
import { SceneControlState } from './three/types';

const loadMotionFeatures = () => import('./motionFeatures').then((mod) => mod.default);

const HeroSceneCanvas = lazy(() => import('./components/HeroSceneCanvas'));
const RightsShowcaseSection = lazy(() => import('./components/RightsShowcaseSection'));
const CapabilitiesSection = lazy(() => import('./components/CapabilitiesSection'));
const CaseStudiesSection = lazy(() => import('./components/CaseStudiesSection'));
const ComingSoonSection = lazy(() => import('./components/ComingSoonSection'));
const CommissionSection = lazy(() => import('./components/CommissionSection'));
const ControlDock = lazy(() => import('./components/ControlDock'));

const STORAGE_KEY = 'ulagu-language';

type InfoModalType = 'privacy' | 'delete' | null;

const DEFAULT_SCENE_STATE: SceneControlState = {
  explode: 0,
  cameraPreset: 'overview',
  finish: 'obsidian',
  playing: true,
  speed: 1,
  scrollSync: true,
  activeRightIndex: null,
};

function BelowFoldPlaceholders() {
  return (
    <>
      <section
        id="rights"
        className="border-t border-[#5DB0E6]/14 min-h-[680px]"
        aria-hidden="true"
      />
      <section
        id="features"
        className="border-t border-[#5DB0E6]/14 min-h-[760px]"
        aria-hidden="true"
      />
      <section
        id="how"
        className="border-t border-[#5DB0E6]/14 min-h-[520px]"
        aria-hidden="true"
      />
      <section
        id="team"
        className="border-t border-[#5DB0E6]/14 min-h-[480px]"
        aria-hidden="true"
      />
      <section
        id="coming-soon"
        className="border-t border-[#5DB0E6]/14 min-h-[680px]"
        aria-hidden="true"
      />
      <section
        id="join"
        className="border-t border-[#5DB0E6]/14 min-h-[540px]"
        aria-hidden="true"
      />
    </>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    try {
      return window.localStorage.getItem(STORAGE_KEY) === 'ta' ? 'ta' : 'en';
    } catch {
      return 'en';
    }
  });

  const [sceneState, setSceneState] = useState<SceneControlState>(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return {
      ...DEFAULT_SCENE_STATE,
      playing: !prefersReduced,
    };
  });

  const [dockCollapsed, setDockCollapsed] = useState(true);
  const [dockMounted, setDockMounted] = useState(false);
  const [activeModal, setActiveModal] = useState<InfoModalType>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [belowFoldReady, setBelowFoldReady] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(window.location.hash && window.location.hash !== '#top');
  });

  const heroRef = useRef<HTMLElement | null>(null);
  const belowFoldTriggerRef = useRef<HTMLDivElement | null>(null);
  const pendingHashRef = useRef<string | null>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroCopyY = useTransform(heroScrollProgress, [0, 1], [0, -64]);
  const heroCopyOpacity = useTransform(heroScrollProgress, [0, 0.78], [1, 0]);

  const t = ULAGU_MESSAGES[language];

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore storage failures in restricted contexts
    }
  }, [language]);

  // Defer 3D WebGL scene initialization until after first paint
  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof win.requestIdleCallback === 'function') {
      const id = win.requestIdleCallback(() => setSceneReady(true), { timeout: 600 });
      return () => win.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(() => setSceneReady(true), 1);
    return () => window.clearTimeout(timer);
  }, []);

  // Load below-the-fold sections when approaching viewport, clicking an anchor link, or changing hash
  useEffect(() => {
    if (belowFoldReady) return;

    const triggerEl = belowFoldTriggerRef.current;
    const observer =
      triggerEl && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries, obs) => {
              if (entries.some((entry) => entry.isIntersecting)) {
                setBelowFoldReady(true);
                obs.disconnect();
              }
            },
            { rootMargin: '600px 0px' }
          )
        : null;

    if (observer && triggerEl) {
      observer.observe(triggerEl);
    }

    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash !== '#top') {
        pendingHashRef.current = hash.slice(1);
        setBelowFoldReady(true);
      }
    };

    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      const href = anchor?.getAttribute('href');
      if (href && href !== '#' && href !== '#top') {
        pendingHashRef.current = href.slice(1);
        setBelowFoldReady(true);
      }
    };

    window.addEventListener('hashchange', onHashChange);
    document.addEventListener('click', onAnchorClick);

    return () => {
      observer?.disconnect();
      window.removeEventListener('hashchange', onHashChange);
      document.removeEventListener('click', onAnchorClick);
    };
  }, [belowFoldReady]);

  // Complete pending anchor scroll once lazy below-the-fold sections mount
  useEffect(() => {
    if (!belowFoldReady || !pendingHashRef.current) return;
    const targetId = pendingHashRef.current;
    pendingHashRef.current = null;
    requestAnimationFrame(() => {
      const el = document.getElementById(targetId);
      el?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }, [belowFoldReady, prefersReduced]);

  const handleStatePatch = useCallback((patch: Partial<SceneControlState>) => {
    setSceneState((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleManualOrbitStart = useCallback(() => {
    setSceneState((prev) => (prev.scrollSync ? { ...prev, scrollSync: false } : prev));
  }, []);

  const handleReset = useCallback(() => {
    setSceneState((prev) => ({
      ...DEFAULT_SCENE_STATE,
      playing: prev.playing,
    }));
  }, []);

  const handleSelectRight = useCallback((index: number) => {
    setSceneState((prev) => {
      const nextIndex = prev.activeRightIndex === index ? null : index;
      return {
        ...prev,
        activeRightIndex: nextIndex,
        explode: nextIndex !== null && prev.explode < 0.34 ? 0.42 : prev.explode,
        scrollSync: false,
      };
    });
  }, []);

  const handleClearRight = useCallback(() => {
    setSceneState((prev) => ({
      ...prev,
      activeRightIndex: null,
      explode: 0,
      scrollSync: true,
    }));
  }, []);

  const handleToggleDock = useCallback(() => {
    setDockMounted(true);
    setDockCollapsed((prev) => !prev);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
        return;
      }
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'h' || e.key === 'H') {
        handleToggleDock();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModal, handleToggleDock]);

  const modalTitle =
    activeModal === 'privacy'
      ? t.privacyModalTitle
      : activeModal === 'delete'
        ? t.deleteModalTitle
        : '';

  const modalBody =
    activeModal === 'privacy'
      ? t.privacyModalBody
      : activeModal === 'delete'
        ? t.deleteModalBody
        : '';

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <div className="relative min-h-screen bg-[#071420] text-[#E8F2FB]">
        {/* Fallback / initial-paint dark civic radial backdrop behind the 3D scene */}
        <div
          aria-hidden="true"
          className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(60rem_circle_at_72%_46%,rgba(93,176,230,0.14),rgba(7,20,32,0.92)_60%,#071420_100%)]"
        />

        {/* Fixed Full-Page Interactive 3D Constitutional Monument (deferred after first paint) */}
        {sceneReady && (
          <Suspense fallback={null}>
            <HeroSceneCanvas
              language={language}
              controlState={sceneState}
              onManualOrbitStart={handleManualOrbitStart}
            />
          </Suspense>
        )}

        <TopNav
          language={language}
          onLanguageChange={setLanguage}
          sectionsReady={belowFoldReady}
        />

        {/* Scrollable Bilingual Semantic DOM Overlay */}
        <main className="relative z-10 pointer-events-none">
          {/* Section 1: Glass Hero Card over Live 3D Monument */}
          <section
            ref={heroRef}
            id="top"
            className="hero-section-pad relative min-h-screen w-full pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28 flex items-center"
          >
            <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 sm:px-6">
              <m.div
                style={prefersReduced ? undefined : { y: heroCopyY, opacity: heroCopyOpacity }}
                className="max-w-[540px] lg:max-w-[560px] glass-card rounded-2xl p-6 sm:p-8 lg:p-9 pointer-events-auto"
              >
                <p className="text-xs font-semibold text-[#5DB0E6]">{t.heroPill}</p>

                <h1
                  className={`mt-3.5 text-[#E8F2FB] text-balance ${
                    language === 'ta'
                      ? 'font-tamil font-bold text-[clamp(1.6rem,2.4vw,2.25rem)] leading-[1.42] tracking-normal'
                      : 'font-extrabold text-[clamp(2.2rem,3.9vw,3.5rem)] leading-[1.1] tracking-tight'
                  }`}
                >
                  {t.heroTitle}
                </h1>

                <p className="mt-4 font-tamil text-base sm:text-lg font-semibold leading-[1.55] text-[#E5863A]">
                  {t.heroTamilLine}
                </p>

                <p
                  className={`mt-3.5 text-sm sm:text-base text-[#B2D5F1] max-w-[460px] ${
                    language === 'ta' ? 'leading-[1.8]' : 'leading-relaxed'
                  }`}
                >
                  {t.heroParagraph}
                </p>

                <div className="mt-7 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pointer-events-auto">
                  <a
                    href="#join"
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-[#0B1C2A] bg-[#E5863A] rounded-lg hover:bg-[#F09952] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5863A]"
                  >
                    <span>{t.joinWaitlist}</span>
                    <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
                  </a>

                  <a
                    href="#rights"
                    className="min-h-[44px] inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-[#E8F2FB] bg-[#0B1E2E]/94 border border-[#5DB0E6]/28 rounded-lg hover:border-[#5DB0E6]/60 transition-colors duration-150 whitespace-nowrap shrink-0"
                  >
                    {t.rightsLabel}
                  </a>
                </div>

                <p className="mt-6 text-xs text-[#82A8CA] leading-relaxed">{t.scrollHint}</p>
              </m.div>
            </div>
          </section>

          <div ref={belowFoldTriggerRef}>
            {belowFoldReady ? (
              <Suspense fallback={<BelowFoldPlaceholders />}>
                {/* Section 2: Interactive Fundamental Rights Explorer (My Rights · நான் யார்?) */}
                <RightsShowcaseSection
                  language={language}
                  activeRightIndex={sceneState.activeRightIndex}
                  onSelectRight={handleSelectRight}
                  onClearRight={handleClearRight}
                />

                {/* Sections 3 & 4: What's inside Ulagu (#features) + How it works (#how) */}
                <CapabilitiesSection language={language} onFocusMonument={handleStatePatch} />

                {/* Section 5: The people behind Ulagu (#team) */}
                <CaseStudiesSection language={language} />

                {/* Section 6: Coming soon posters (#coming-soon) */}
                <ComingSoonSection language={language} />

                {/* Section 7: Waitlist (#join) */}
                <CommissionSection
                  language={language}
                  onOpenPrivacy={() => setActiveModal('privacy')}
                />
              </Suspense>
            ) : (
              <BelowFoldPlaceholders />
            )}
          </div>
        </main>

        {/* Collapsible Bottom 3D Control Dock (chunk loads on demand) */}
        {dockMounted ? (
          <Suspense fallback={null}>
            <ControlDock
              language={language}
              state={sceneState}
              collapsed={dockCollapsed}
              onToggleCollapsed={handleToggleDock}
              onChange={handleStatePatch}
              onReset={handleReset}
            />
          </Suspense>
        ) : (
          <div
            className="fixed bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 z-30 w-[min(980px,95vw)] pointer-events-none flex flex-col items-center"
            role="region"
            aria-label={t.dock.regionLabel}
          >
            <button
              type="button"
              onClick={handleToggleDock}
              aria-expanded={false}
              className="pointer-events-auto mb-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-1 text-xs font-semibold text-[#D4E7F8] hover:text-[#F3F8FE] glass-bar border border-[#5DB0E6]/28 rounded-t-lg hover:border-[#E5863A]/60 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5863A]"
            >
              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.dock.showControls}</span>
            </button>
          </div>
        )}

        {/* Executive Glass Footer */}
        <footer className="relative z-10 border-t border-[#5DB0E6]/20 glass-bar py-10 pb-24 px-4 sm:px-6">
          <div className="mx-auto max-w-[1240px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <a
                href="#top"
                className="inline-flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E5863A]"
              >
                <img
                  src="/assets/brand/ulagu-logo.svg"
                  alt={`${t.brandEnglish} ${t.brandTamil}`}
                  width={122}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  className="h-10 sm:h-11 w-auto object-contain"
                />
              </a>
              <p
                className={`mt-1.5 text-xs text-[#5DB0E6] tabular-nums ${
                  language === 'ta' ? 'font-tamil' : 'font-mono'
                }`}
              >
                {t.footerLaunchDate}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-[#B2D5F1]">
                <button
                  type="button"
                  onClick={() => setActiveModal('privacy')}
                  className="hover:text-[#E5863A] hover:underline underline-offset-4 transition-colors cursor-pointer"
                >
                  {t.privacyLink}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('delete')}
                  className="hover:text-[#E5863A] hover:underline underline-offset-4 transition-colors cursor-pointer"
                >
                  {t.deleteLink}
                </button>
                <a
                  href="mailto:ulagu2026@gmail.com"
                  className="font-mono hover:text-[#E5863A] hover:underline underline-offset-4 transition-colors"
                >
                  ulagu2026@gmail.com
                </a>
              </div>
              <p
                className={`mt-2.5 text-xs text-[#88AED1] max-w-xl ${
                  language === 'ta' ? 'font-tamil leading-[1.7]' : 'leading-relaxed'
                }`}
              >
                {t.footerLegal}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 max-w-md">
              <p
                className={`text-xs text-[#B2D5F1] md:text-right ${
                  language === 'ta' ? 'leading-[1.78]' : 'leading-relaxed'
                }`}
              >
                {t.footerDescription}
              </p>
              <a
                href="#top"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#E8F2FB] bg-[#0B1E2E] border border-[#5DB0E6]/25 rounded-lg hover:border-[#E5863A] transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5 text-[#E5863A]" aria-hidden="true" />
                <span>{t.backToTop}</span>
              </a>
            </div>
          </div>
        </footer>

        {/* Privacy / Delete Account Dialog */}
        {activeModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-dialog-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040C14]/72"
            onClick={() => setActiveModal(null)}
          >
            <div
              className="w-full max-w-md glass-card rounded-2xl p-6 sm:p-7"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <h2
                  id="info-dialog-title"
                  className={`text-lg sm:text-xl font-bold text-[#E8F2FB] ${
                    language === 'ta' ? 'leading-[1.42] tracking-normal' : 'leading-snug'
                  }`}
                >
                  {modalTitle}
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  aria-label={t.modalClose}
                  className="p-1.5 rounded-lg text-[#B2D5F1] hover:text-[#E8F2FB] hover:bg-[#132E44] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <p
                className={`mt-3 text-sm text-[#B2D5F1] ${
                  language === 'ta' ? 'leading-[1.78]' : 'leading-relaxed'
                }`}
              >
                {modalBody}
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#B2D5F1] bg-[#071420] border border-[#5DB0E6]/22 rounded-lg hover:text-[#E8F2FB] cursor-pointer"
                >
                  {t.modalClose}
                </button>
                <a
                  href="mailto:ulagu2026@gmail.com"
                  className="px-4 py-2 text-xs font-bold text-[#0B1C2A] bg-[#E5863A] rounded-lg hover:bg-[#F09952] transition-colors"
                >
                  ulagu2026@gmail.com
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </LazyMotion>
  );
}
