import {
  CanvasTexture,
  EquirectangularReflectionMapping,
  RepeatWrapping,
  SRGBColorSpace,
} from 'three';

export interface ProceduralTextureSet {
  dialAlbedo: CanvasTexture;
  brushedRoughness: CanvasTexture;
  contactShadow: CanvasTexture;
  studioEnv: CanvasTexture;
  dispose: () => void;
}

const SIX_RIGHTS_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export function createProceduralTextures(maxAnisotropy: number): ProceduralTextureSet {
  // 1. Engraved Constitutional Six Fundamental Rights Dial (512x512 for rapid upload)
  const dialCanvas = document.createElement('canvas');
  dialCanvas.width = 512;
  dialCanvas.height = 512;
  const dCtx = dialCanvas.getContext('2d')!;

  dCtx.fillStyle = '#0D2233';
  dCtx.fillRect(0, 0, 512, 512);

  const cx = 256;
  const cy = 256;

  for (let r = 191; r <= 255; r += 3) {
    dCtx.beginPath();
    dCtx.arc(cx, cy, r, 0, Math.PI * 2);
    dCtx.strokeStyle =
      r === 227 || r === 251
        ? 'rgba(229, 134, 58, 0.45)'
        : r % 12 === 0
          ? 'rgba(93, 176, 230, 0.22)'
          : 'rgba(178, 213, 241, 0.06)';
    dCtx.lineWidth = r === 227 || r === 251 ? 1.5 : 1;
    dCtx.stroke();
  }

  for (let deg = 0; deg < 360; deg += 4) {
    const rad = (deg * Math.PI) / 180;
    const isMajor = deg % 60 === 0;
    const isMid = deg % 20 === 0;
    const innerR = isMajor ? 228 : isMid ? 236 : 244;
    const outerR = 251;

    dCtx.beginPath();
    dCtx.moveTo(cx + Math.cos(rad) * innerR, cy + Math.sin(rad) * innerR);
    dCtx.lineTo(cx + Math.cos(rad) * outerR, cy + Math.sin(rad) * outerR);
    dCtx.strokeStyle = isMajor
      ? '#E5863A'
      : isMid
        ? '#5DB0E6'
        : 'rgba(232, 242, 251, 0.24)';
    dCtx.lineWidth = isMajor ? 2 : isMid ? 1.25 : 0.75;
    dCtx.stroke();

    if (isMajor) {
      const roman = SIX_RIGHTS_ROMAN[(deg / 60) % 6];
      dCtx.save();
      dCtx.translate(cx + Math.cos(rad) * 212, cy + Math.sin(rad) * 212);
      dCtx.rotate(rad + Math.PI / 2);
      dCtx.fillStyle = '#E8F2FB';
      dCtx.font = '700 13px "Plus Jakarta Sans", sans-serif';
      dCtx.textAlign = 'center';
      dCtx.textBaseline = 'middle';
      dCtx.fillText(roman, 0, 0);
      dCtx.restore();
    }
  }

  const dialAlbedo = new CanvasTexture(dialCanvas);
  dialAlbedo.colorSpace = SRGBColorSpace;
  dialAlbedo.anisotropy = Math.min(4, maxAnisotropy);
  dialAlbedo.needsUpdate = true;

  // 2. Micro-grain Anisotropic Roughness Map (256x256, fast startup)
  const brushCanvas = document.createElement('canvas');
  brushCanvas.width = 256;
  brushCanvas.height = 256;
  const bCtx = brushCanvas.getContext('2d')!;
  bCtx.fillStyle = '#8A8A8A';
  bCtx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 650; i++) {
    const y = (i * 73) % 256;
    const x = (i * 137) % 256;
    const w = 16 + (i % 64);
    const lum = 108 + (i % 88);
    bCtx.fillStyle = `rgba(${lum}, ${lum}, ${lum}, 0.24)`;
    bCtx.fillRect(x, y, w, 1);
  }

  const brushedRoughness = new CanvasTexture(brushCanvas);
  brushedRoughness.wrapS = RepeatWrapping;
  brushedRoughness.wrapT = RepeatWrapping;
  brushedRoughness.repeat.set(3, 3);
  brushedRoughness.anisotropy = Math.min(4, maxAnisotropy);
  brushedRoughness.needsUpdate = true;

  // 3. Soft Radial Contact Shadow Texture (128x128)
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const sCtx = shadowCanvas.getContext('2d')!;
  const grad = sCtx.createRadialGradient(64, 64, 5, 64, 64, 62);
  grad.addColorStop(0, 'rgba(3, 10, 18, 0.84)');
  grad.addColorStop(0.45, 'rgba(3, 10, 18, 0.42)');
  grad.addColorStop(1, 'rgba(3, 10, 18, 0)');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, 128, 128);

  const contactShadow = new CanvasTexture(shadowCanvas);
  contactShadow.colorSpace = SRGBColorSpace;
  contactShadow.needsUpdate = true;

  // 4. Instant Equirectangular Studio Reflection Map
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 128;
  envCanvas.height = 64;
  const eCtx = envCanvas.getContext('2d')!;
  const skyGrad = eCtx.createLinearGradient(0, 0, 0, 64);
  skyGrad.addColorStop(0, '#588BB8');
  skyGrad.addColorStop(0.45, '#193C5A');
  skyGrad.addColorStop(0.55, '#0C2134');
  skyGrad.addColorStop(1, '#06111B');
  eCtx.fillStyle = skyGrad;
  eCtx.fillRect(0, 0, 128, 64);

  const keyGlow = eCtx.createRadialGradient(34, 18, 1, 34, 18, 22);
  keyGlow.addColorStop(0, 'rgba(255, 240, 220, 0.95)');
  keyGlow.addColorStop(0.5, 'rgba(229, 134, 58, 0.42)');
  keyGlow.addColorStop(1, 'rgba(229, 134, 58, 0)');
  eCtx.fillStyle = keyGlow;
  eCtx.fillRect(0, 0, 128, 64);

  const rimGlow = eCtx.createRadialGradient(96, 22, 1, 96, 22, 24);
  rimGlow.addColorStop(0, 'rgba(178, 213, 241, 0.9)');
  rimGlow.addColorStop(0.5, 'rgba(93, 176, 230, 0.4)');
  rimGlow.addColorStop(1, 'rgba(93, 176, 230, 0)');
  eCtx.fillStyle = rimGlow;
  eCtx.fillRect(0, 0, 128, 64);

  const studioEnv = new CanvasTexture(envCanvas);
  studioEnv.mapping = EquirectangularReflectionMapping;
  studioEnv.colorSpace = SRGBColorSpace;
  studioEnv.needsUpdate = true;

  return {
    dialAlbedo,
    brushedRoughness,
    contactShadow,
    studioEnv,
    dispose: () => {
      dialAlbedo.dispose();
      brushedRoughness.dispose();
      contactShadow.dispose();
      studioEnv.dispose();
    },
  };
}
