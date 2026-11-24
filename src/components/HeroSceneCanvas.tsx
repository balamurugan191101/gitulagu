import { useEffect, useRef, useState } from 'react';
import {
  ACESFilmicToneMapping,
  CircleGeometry,
  Clock,
  Color,
  DirectionalLight,
  DoubleSide,
  FogExp2,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  RingGeometry,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Language, ULAGU_MESSAGES } from '../i18n/ulaguMessages';
import { createKineticSculpture, KineticSculptureHandle } from '../three/kineticModel';
import { createProceduralTextures } from '../three/proceduralTextures';
import { CameraPresetId, SceneControlState } from '../three/types';

interface HeroSceneCanvasProps {
  language: Language;
  controlState: SceneControlState;
  onManualOrbitStart?: () => void;
}

const CAMERA_PRESETS: Record<
  CameraPresetId,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: { pos: [0.25, 2.75, 6.6], target: [0.0, 1.75, 0] },
  scales: { pos: [1.3, 2.68, 3.3], target: [0.0, 2.18, 0] },
  rotunda: { pos: [-4.6, 3.25, 4.15], target: [0.0, 1.65, 0] },
};

interface ScrollKeyframe {
  t: number;
  camPos: [number, number, number];
  lookAt: [number, number, number];
  stageX: number;
  explode: number;
}

// 7-chapter architectural scroll choreography for Ulagu
const SCROLL_KEYFRAMES: ScrollKeyframe[] = [
  {
    t: 0.0,
    camPos: [0.1, 2.75, 6.75],
    lookAt: [0.0, 1.72, 0.0],
    stageX: 1.72,
    explode: 0.0,
  },
  {
    t: 0.17,
    camPos: [-0.8, 2.88, 5.5],
    lookAt: [0.0, 1.78, 0.0],
    stageX: 1.55,
    explode: 0.34,
  },
  {
    t: 0.36,
    camPos: [-1.4, 3.1, 5.75],
    lookAt: [-0.25, 1.82, 0.0],
    stageX: -1.35,
    explode: 0.68,
  },
  {
    t: 0.54,
    camPos: [2.2, 2.65, 4.2],
    lookAt: [0.2, 1.98, 0.0],
    stageX: 0.85,
    explode: 0.24,
  },
  {
    t: 0.7,
    camPos: [-2.25, 3.1, 5.45],
    lookAt: [0.0, 1.75, 0.0],
    stageX: 1.55,
    explode: 0.12,
  },
  {
    t: 0.85,
    camPos: [0.0, 2.95, 7.15],
    lookAt: [0.0, 1.78, 0.0],
    stageX: 0.0,
    explode: 0.22,
  },
  {
    t: 1.0,
    camPos: [0.1, 2.75, 6.5],
    lookAt: [0.0, 1.72, 0.0],
    stageX: 1.55,
    explode: 0.03,
  },
];

function sampleScrollChoreography(
  progress: number,
  isDesktop: boolean,
  outCamPos: Vector3,
  outLookAt: Vector3
): { stageX: number; explode: number } {
  const clamped = Math.max(0, Math.min(1, progress));
  let k0 = SCROLL_KEYFRAMES[0];
  let k1 = SCROLL_KEYFRAMES[SCROLL_KEYFRAMES.length - 1];

  for (let i = 0; i < SCROLL_KEYFRAMES.length - 1; i++) {
    if (clamped >= SCROLL_KEYFRAMES[i].t && clamped <= SCROLL_KEYFRAMES[i + 1].t) {
      k0 = SCROLL_KEYFRAMES[i];
      k1 = SCROLL_KEYFRAMES[i + 1];
      break;
    }
  }

  const span = Math.max(0.0001, k1.t - k0.t);
  const rawAlpha = (clamped - k0.t) / span;
  const alpha = rawAlpha * rawAlpha * (3 - 2 * rawAlpha);

  outCamPos.set(
    MathUtils.lerp(k0.camPos[0], k1.camPos[0], alpha),
    MathUtils.lerp(k0.camPos[1], k1.camPos[1], alpha),
    MathUtils.lerp(k0.camPos[2], k1.camPos[2], alpha)
  );
  outLookAt.set(
    MathUtils.lerp(k0.lookAt[0], k1.lookAt[0], alpha),
    MathUtils.lerp(k0.lookAt[1], k1.lookAt[1], alpha),
    MathUtils.lerp(k0.lookAt[2], k1.lookAt[2], alpha)
  );

  const stageScale = isDesktop ? 1.0 : 0.12;
  return {
    stageX: MathUtils.lerp(k0.stageX, k1.stageX, alpha) * stageScale,
    explode: MathUtils.lerp(k0.explode, k1.explode, alpha),
  };
}

function detectSoftwareRenderer(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

const _scrollCamPos = new Vector3();
const _scrollLookAt = new Vector3();

export function HeroSceneCanvas({
  language,
  controlState,
  onManualOrbitStart,
}: HeroSceneCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<SceneControlState>(controlState);
  const onOrbitStartRef = useRef(onManualOrbitStart);
  onOrbitStartRef.current = onManualOrbitStart;

  const sculptureRef = useRef<KineticSculptureHandle | null>(null);
  const cameraTransitionRef = useRef<{
    active: boolean;
    targetPos: Vector3;
    targetLook: Vector3;
  }>({
    active: false,
    targetPos: new Vector3(...CAMERA_PRESETS.overview.pos),
    targetLook: new Vector3(...CAMERA_PRESETS.overview.target),
  });

  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    const prevFinish = stateRef.current.finish;
    const prevPreset = stateRef.current.cameraPreset;
    const prevScrollSync = stateRef.current.scrollSync;
    stateRef.current = controlState;

    if (prevFinish !== controlState.finish && sculptureRef.current) {
      sculptureRef.current.setFinish(controlState.finish);
    }

    if (
      !controlState.scrollSync &&
      (prevPreset !== controlState.cameraPreset || prevScrollSync !== controlState.scrollSync)
    ) {
      const preset = CAMERA_PRESETS[controlState.cameraPreset];
      const desktopOffset = window.innerWidth >= 1024 ? -1.05 : 0;
      cameraTransitionRef.current.targetPos.set(
        preset.pos[0] + desktopOffset * 0.45,
        preset.pos[1],
        preset.pos[2]
      );
      cameraTransitionRef.current.targetLook.set(
        preset.target[0] + desktopOffset,
        preset.target[1],
        preset.target[2]
      );
      cameraTransitionRef.current.active = true;
    }
  }, [controlState]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const lowPowerDevice =
      width < 768 || (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4);

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        antialias: !lowPowerDevice,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    const isSoftwareGl = detectSoftwareRenderer(renderer.getContext());

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = !isSoftwareGl && !lowPowerDevice;
    renderer.shadowMap.type = PCFSoftShadowMap;

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const textures = createProceduralTextures(maxAniso);

    const scene = new Scene();
    const bgHex = 0x071420;
    scene.background = new Color(bgHex);
    scene.fog = new FogExp2(bgHex, 0.036);
    scene.environment = textures.studioEnv;

    const getResponsiveFov = (w: number, h: number) => {
      const aspect = w / Math.max(1, h);
      if (aspect < 0.72) return 56;
      if (aspect < 1.05) return 50;
      if (w < 1200) return 45;
      return 42;
    };

    const camera = new PerspectiveCamera(
      getResponsiveFov(width, height),
      width / Math.max(1, height),
      0.1,
      60
    );
    camera.position.set(0.1, 2.75, 6.75);

    const controls = new OrbitControls(camera, canvas);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minPolarAngle = Math.PI * 0.2;
    controls.maxPolarAngle = Math.PI * 0.58;
    controls.target.set(0.0, 1.72, 0.0);
    controls.update();

    const onControlsStart = () => {
      cameraTransitionRef.current.active = false;
      onOrbitStartRef.current?.();
    };
    controls.addEventListener('start', onControlsStart);

    const hemiLight = new HemisphereLight(0xc2dff8, 0x071420, 1.05);
    scene.add(hemiLight);

    const keyLight = new DirectionalLight(0xfff0dc, 2.85);
    keyLight.position.set(5.5, 8.8, 5.5);
    keyLight.castShadow = !isSoftwareGl && !lowPowerDevice;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 24;
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5.5;
    keyLight.shadow.camera.bottom = -2;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new DirectionalLight(0x63b6eb, 2.15);
    rimLight.position.set(-5.2, 4.8, -5.5);
    scene.add(rimLight);

    const fillLight = new DirectionalLight(0xfff1e0, 0.9);
    fillLight.position.set(4.5, 4.2, 2.8);
    scene.add(fillLight);

    const floorGeo = new CircleGeometry(34, 32);
    const floorMat = new MeshStandardMaterial({
      color: 0x0a1c2c,
      metalness: 0.18,
      roughness: 0.84,
    });
    const floorMesh = new Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const ringGeo = new RingGeometry(2.74, 2.77, 48);
    const ringMat = new MeshBasicMaterial({
      color: 0x5db0e6,
      transparent: true,
      opacity: 0.14,
      side: DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const floorRing = new Mesh(ringGeo, ringMat);
    floorRing.rotation.x = -Math.PI / 2;
    floorRing.position.y = 0.002;
    scene.add(floorRing);

    const sculpture = createKineticSculpture(textures, isSoftwareGl);
    sculpture.setFinish(stateRef.current.finish);
    scene.add(sculpture.root);
    sculptureRef.current = sculpture;

    // Cache layout values so scroll/resize never causes forced reflow in the render loop
    let cachedMaxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    let cachedWidth = width;
    let cachedHeight = height;

    let targetScroll = Math.max(0, Math.min(1, window.scrollY / cachedMaxScroll));
    let currentScroll = targetScroll;
    let targetPtrX = 0;
    let targetPtrY = 0;
    let currentPtrX = 0;
    let currentPtrY = 0;

    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        targetScroll = Math.max(0, Math.min(1, window.scrollY / cachedMaxScroll));
      });
    };

    const onPointerMove = (e: PointerEvent) => {
      targetPtrX = (e.clientX / Math.max(1, cachedWidth) - 0.5) * 2;
      targetPtrY = (e.clientY / Math.max(1, cachedHeight) - 0.5) * 2;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };
    const onContextRestored = () => {
      setWebglError(false);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    const onResize = () => {
      cachedWidth = window.innerWidth;
      cachedHeight = window.innerHeight;
      cachedMaxScroll = Math.max(1, document.documentElement.scrollHeight - cachedHeight);
      camera.fov = getResponsiveFov(cachedWidth, cachedHeight);
      camera.aspect = cachedWidth / Math.max(1, cachedHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(cachedWidth, cachedHeight);
      renderer.setPixelRatio(
        isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
      );
      targetScroll = Math.max(0, Math.min(1, window.scrollY / cachedMaxScroll));
    };
    window.addEventListener('resize', onResize, { passive: true });

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            cachedMaxScroll = Math.max(1, document.documentElement.scrollHeight - cachedHeight);
          })
        : null;
    resizeObserver?.observe(document.documentElement);

    const clock = new Clock();
    let frameId = 0;
    let disposed = false;
    const isInitialDesktop = cachedWidth >= 1024;
    const initialChoreo = sampleScrollChoreography(
      currentScroll,
      isInitialDesktop,
      _scrollCamPos,
      _scrollLookAt
    );
    camera.position.copy(_scrollCamPos);
    controls.target.copy(_scrollLookAt);
    controls.update();

    let currentExplode = Math.max(stateRef.current.explode, initialChoreo.explode);
    let currentStageX = initialChoreo.stageX;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed || document.visibilityState === 'hidden') return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed || document.visibilityState === 'hidden') {
        frameId = 0;
        return;
      }
      const rawDelta = clock.getDelta();
      const delta = Math.min(rawDelta, 0.1);
      const elapsed = clock.elapsedTime;
      const st = stateRef.current;
      const isDesktop = cachedWidth >= 1024;

      currentScroll = MathUtils.damp(currentScroll, targetScroll, 6.0, delta);
      currentPtrX = MathUtils.damp(currentPtrX, targetPtrX, 4.5, delta);
      currentPtrY = MathUtils.damp(currentPtrY, targetPtrY, 4.5, delta);

      const choreo = sampleScrollChoreography(
        currentScroll,
        isDesktop,
        _scrollCamPos,
        _scrollLookAt
      );

      const desiredExplode = st.scrollSync
        ? Math.max(st.explode, choreo.explode)
        : st.explode;
      currentExplode = MathUtils.damp(currentExplode, desiredExplode, 6.5, delta);

      const desiredStageX = st.scrollSync ? choreo.stageX : isDesktop ? 0.55 : 0;
      currentStageX = MathUtils.damp(currentStageX, desiredStageX, 5.5, delta);

      if (st.scrollSync) {
        const px = _scrollCamPos.x + currentPtrX * 0.2;
        const py = _scrollCamPos.y - currentPtrY * 0.12;
        const pz = _scrollCamPos.z;

        camera.position.x = MathUtils.damp(camera.position.x, px, 5.5, delta);
        camera.position.y = MathUtils.damp(camera.position.y, py, 5.5, delta);
        camera.position.z = MathUtils.damp(camera.position.z, pz, 5.5, delta);

        controls.target.x = MathUtils.damp(controls.target.x, _scrollLookAt.x, 5.5, delta);
        controls.target.y = MathUtils.damp(controls.target.y, _scrollLookAt.y, 5.5, delta);
        controls.target.z = MathUtils.damp(controls.target.z, _scrollLookAt.z, 5.5, delta);
      } else if (cameraTransitionRef.current.active) {
        const tPos = cameraTransitionRef.current.targetPos;
        const tLook = cameraTransitionRef.current.targetLook;
        camera.position.x = MathUtils.damp(camera.position.x, tPos.x, 5.5, delta);
        camera.position.y = MathUtils.damp(camera.position.y, tPos.y, 5.5, delta);
        camera.position.z = MathUtils.damp(camera.position.z, tPos.z, 5.5, delta);

        controls.target.x = MathUtils.damp(controls.target.x, tLook.x, 5.5, delta);
        controls.target.y = MathUtils.damp(controls.target.y, tLook.y, 5.5, delta);
        controls.target.z = MathUtils.damp(controls.target.z, tLook.z, 5.5, delta);

        if (
          camera.position.distanceTo(tPos) < 0.015 &&
          controls.target.distanceTo(tLook) < 0.015
        ) {
          cameraTransitionRef.current.active = false;
        }
      }

      controls.update();
      sculpture.update({
        elapsed,
        delta,
        explodeProgress: currentExplode,
        speed: st.speed,
        playing: st.playing,
        scrollProgress: currentScroll,
        pointerX: currentPtrX,
        pointerY: currentPtrY,
        stageOffsetX: currentStageX,
        activeRightIndex: st.activeRightIndex,
      });
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    const onVisibilityChange = () => {
      if (disposed) return;
      if (document.visibilityState === 'hidden') {
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        frameId = 0;
        clock.stop();
      } else {
        clock.start();
        if (!frameId) {
          tick();
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    if (document.visibilityState !== 'hidden') {
      tick();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(scrollRaf);
      clearTimeout(frameId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      resizeObserver?.disconnect();
      controls.removeEventListener('start', onControlsStart);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);

      controls.dispose();
      sculpture.dispose();
      textures.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  if (webglError) {
    const t = ULAGU_MESSAGES[language];
    return (
      <div className="fixed inset-0 z-0 bg-[#071420] flex items-center justify-center p-6">
        <div className="max-w-md glass-card rounded-xl p-6 text-center">
          <p className="text-sm font-semibold text-[#E8F2FB]">{t.webglUnavailableTitle}</p>
          <p className="mt-2 text-xs text-[#B2D5F1] leading-relaxed">
            {t.webglUnavailableBody}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      role="img"
      aria-label="Ulagu interactive 3D Fundamental Rights Rotunda and Scales of Justice"
      className="fixed inset-0 z-0 w-full h-full cursor-grab active:cursor-grabbing"
    />
  );
}

export default HeroSceneCanvas;
