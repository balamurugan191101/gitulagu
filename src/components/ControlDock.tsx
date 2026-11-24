import { ChevronDown, ChevronUp, Compass, Pause, Play, RotateCcw } from 'lucide-react';
import { Language, ULAGU_MESSAGES } from '../i18n/ulaguMessages';
import { CameraPresetId, MaterialFinishId, SceneControlState } from '../three/types';

interface ControlDockProps {
  language: Language;
  state: SceneControlState;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onChange: (patch: Partial<SceneControlState>) => void;
  onReset: () => void;
}

const SPEED_OPTIONS = [0.5, 1, 2];

export function ControlDock({
  language,
  state,
  collapsed,
  onToggleCollapsed,
  onChange,
  onReset,
}: ControlDockProps) {
  const d = ULAGU_MESSAGES[language].dock;

  const cameraOptions: { id: CameraPresetId; label: string }[] = [
    { id: 'overview', label: d.viewOverview },
    { id: 'scales', label: d.viewScales },
    { id: 'rotunda', label: d.viewRotunda },
  ];

  const finishOptions: { id: MaterialFinishId; label: string; swatch: string }[] = [
    { id: 'obsidian', label: d.finishObsidian, swatch: '#10283A' },
    { id: 'brass', label: d.finishBrass, swatch: '#E5863A' },
    { id: 'marble', label: d.finishMarble, swatch: '#E8F2FB' },
  ];

  return (
    <div
      className="fixed bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 z-30 w-[min(980px,95vw)] pointer-events-none flex flex-col items-center"
      role="region"
      aria-label={d.regionLabel}
    >
      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-expanded={!collapsed}
        aria-controls="scene-controls-panel"
        className="pointer-events-auto mb-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-1 text-xs font-semibold text-[#D4E7F8] hover:text-[#F3F8FE] glass-bar border border-[#5DB0E6]/28 rounded-t-lg hover:border-[#E5863A]/60 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5863A]"
      >
        {collapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{d.showControls}</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{d.hideControls}</span>
          </>
        )}
      </button>

      <div
        id="scene-controls-panel"
        hidden={collapsed}
        className={`pointer-events-auto w-full glass-card rounded-xl px-3 sm:px-4 py-2.5 sm:py-2 transition-[transform,opacity] duration-200 ease-out ${
          collapsed
            ? 'translate-y-4 opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100 max-h-[45dvh] overflow-y-auto sm:overflow-visible'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:flex-wrap xl:flex-nowrap items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center justify-between sm:justify-start gap-2.5 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => onChange({ scrollSync: !state.scrollSync })}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                state.scrollSync
                  ? 'border-[#E5863A]/80 bg-[#122D44] text-[#E8F2FB]'
                  : 'border-[#5DB0E6]/22 bg-[#0B1E2E] text-[#B2D5F1] hover:text-[#E8F2FB]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#E5863A]" aria-hidden="true" />
              <span>{state.scrollSync ? d.scrollSync : d.freeOrbit}</span>
            </button>

            <div className="flex items-center gap-2 min-w-0 flex-1 max-w-[220px]">
              <label
                htmlFor="explode-slider"
                className="text-xs font-medium text-[#B2D5F1] whitespace-nowrap shrink-0"
              >
                {d.breakdown}
              </label>
              <input
                id="explode-slider"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={state.explode}
                onChange={(e) => onChange({ explode: parseFloat(e.target.value) })}
                className="ulagu-slider w-full min-w-[60px]"
              />
              <span className="font-mono text-xs text-[#E8F2FB] tabular-nums w-8 text-right shrink-0">
                {Math.round(state.explode * 100)}%
              </span>
            </div>
          </div>

          <div className="hidden xl:block h-5 w-px bg-[#5DB0E6]/18 shrink-0" aria-hidden="true" />

          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-medium text-[#B2D5F1] whitespace-nowrap">
                {d.view}
              </span>
              <div className="flex items-center gap-1 p-0.5 bg-[#0B1E2E] rounded-lg border border-[#5DB0E6]/18">
                {cameraOptions.map((cam) => {
                  const active = !state.scrollSync && state.cameraPreset === cam.id;
                  return (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => onChange({ cameraPreset: cam.id, scrollSync: false })}
                      className={`px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#173854] text-[#E8F2FB]'
                          : 'text-[#B2D5F1] hover:text-[#E8F2FB]'
                      }`}
                    >
                      {cam.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="hidden sm:inline text-xs font-medium text-[#B2D5F1] whitespace-nowrap">
                {d.finish}
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {finishOptions.map((fin) => {
                  const active = state.finish === fin.id;
                  return (
                    <button
                      key={fin.id}
                      type="button"
                      onClick={() => onChange({ finish: fin.id })}
                      className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'border-[#E5863A]/80 bg-[#122D44] text-[#E8F2FB]'
                          : 'border-[#5DB0E6]/18 bg-[#0B1E2E] text-[#B2D5F1] hover:text-[#E8F2FB]'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
                        style={{ backgroundColor: fin.swatch }}
                        aria-hidden="true"
                      />
                      <span>{fin.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="hidden xl:block h-5 w-px bg-[#5DB0E6]/18 shrink-0" aria-hidden="true" />

          <div className="flex items-center justify-end gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onChange({ playing: !state.playing })}
              aria-label={state.playing ? d.pause : d.play}
              className="inline-flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-[#0B1E2E] border border-[#5DB0E6]/18 text-[#E8F2FB] hover:border-[#E5863A] transition-colors duration-150 shrink-0 cursor-pointer"
            >
              {state.playing ? (
                <Pause className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>

            <div className="flex items-center gap-0.5 p-0.5 bg-[#0B1E2E] rounded-lg border border-[#5DB0E6]/18">
              {SPEED_OPTIONS.map((spd) => {
                const active = state.speed === spd;
                return (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => onChange({ speed: spd })}
                    className={`px-2 py-1 font-mono text-xs tabular-nums rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#173854] text-[#E5863A]'
                        : 'text-[#B2D5F1] hover:text-[#E8F2FB]'
                    }`}
                  >
                    {spd}x
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onReset}
              aria-label={d.reset}
              title={d.reset}
              className="inline-flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-lg bg-[#0B1E2E] border border-[#5DB0E6]/18 text-[#B2D5F1] hover:text-[#E8F2FB] hover:border-[#E5863A] transition-colors duration-150 shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlDock;
