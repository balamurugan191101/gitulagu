export type CameraPresetId = 'overview' | 'scales' | 'rotunda';

export type MaterialFinishId = 'obsidian' | 'brass' | 'marble';

export interface SceneControlState {
  explode: number; // 0 to 1
  cameraPreset: CameraPresetId;
  finish: MaterialFinishId;
  playing: boolean;
  speed: number; // 0.5, 1, 2
  scrollSync: boolean;
  activeRightIndex: number | null; // 0..5 corresponding to the 6 Fundamental Rights
}
