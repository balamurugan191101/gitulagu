import {
  BoxGeometry,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Euler,
  ExtrudeGeometry,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LatheGeometry,
  Material,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  Path,
  PlaneGeometry,
  Quaternion,
  RingGeometry,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
} from 'three';
import { ProceduralTextureSet } from './proceduralTextures';
import { MaterialFinishId } from './types';

const _vec3 = new Vector3();
const _mat4 = new Matrix4();
const _quat = new Quaternion();
const _euler = new Euler();
const _scale = new Vector3(1, 1, 1);

export interface KineticSculptureUpdateParams {
  elapsed: number;
  delta: number;
  explodeProgress: number;
  speed: number;
  playing: boolean;
  scrollProgress: number;
  pointerX: number;
  pointerY: number;
  stageOffsetX: number;
  activeRightIndex: number | null;
}

export interface KineticSculptureHandle {
  root: Group;
  setFinish: (finish: MaterialFinishId) => void;
  update: (params: KineticSculptureUpdateParams) => void;
  dispose: () => void;
}

interface FinishPalette {
  stoneColor: number;
  stoneMetalness: number;
  stoneRoughness: number;
  columnColor: number;
  columnMetalness: number;
  columnRoughness: number;
  brassColor: number;
  brassMetalness: number;
  brassRoughness: number;
  crystalColor: number;
  shaderColorA: number;
  shaderColorB: number;
}

const FINISH_PALETTES: Record<MaterialFinishId, FinishPalette> = {
  obsidian: {
    stoneColor: 0x0f2536,
    stoneMetalness: 0.34,
    stoneRoughness: 0.62,
    columnColor: 0x1b3c55,
    columnMetalness: 0.68,
    columnRoughness: 0.34,
    brassColor: 0xe5863a,
    brassMetalness: 0.93,
    brassRoughness: 0.15,
    crystalColor: 0x5db0e6,
    shaderColorA: 0xe5863a,
    shaderColorB: 0x5db0e6,
  },
  brass: {
    stoneColor: 0x112436,
    stoneMetalness: 0.36,
    stoneRoughness: 0.58,
    columnColor: 0xc97b3a,
    columnMetalness: 0.91,
    columnRoughness: 0.2,
    brassColor: 0xf5c894,
    brassMetalness: 0.95,
    brassRoughness: 0.13,
    crystalColor: 0xb2d5f1,
    shaderColorA: 0xe5863a,
    shaderColorB: 0xb2d5f1,
  },
  marble: {
    stoneColor: 0xdce7f2,
    stoneMetalness: 0.06,
    stoneRoughness: 0.56,
    columnColor: 0xe8f2fb,
    columnMetalness: 0.08,
    columnRoughness: 0.4,
    brassColor: 0xd9772c,
    brassMetalness: 0.92,
    brassRoughness: 0.16,
    crystalColor: 0x5db0e6,
    shaderColorA: 0x5db0e6,
    shaderColorB: 0xe5863a,
  },
};

function createRingShape(outerR: number, innerR: number): Shape {
  const shape = new Shape();
  shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
  const hole = new Path();
  hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return shape;
}

function createBalanceBeamShape(): Shape {
  const shape = new Shape();
  shape.moveTo(-1.24, 0.02);
  shape.lineTo(-0.35, 0.075);
  shape.lineTo(0.0, 0.12);
  shape.lineTo(0.35, 0.075);
  shape.lineTo(1.24, 0.02);
  shape.lineTo(1.24, -0.025);
  shape.lineTo(0.28, -0.055);
  shape.lineTo(0.0, -0.08);
  shape.lineTo(-0.28, -0.055);
  shape.lineTo(-1.24, -0.025);
  shape.closePath();
  return shape;
}

function createCodexShape(): Shape {
  const w = 0.15;
  const h = 0.21;
  const r = 0.02;
  const s = new Shape();
  s.moveTo(-w + r, -h);
  s.lineTo(w - r, -h);
  s.quadraticCurveTo(w, -h, w, -h + r);
  s.lineTo(w, h - r);
  s.quadraticCurveTo(w, h, w - r, h);
  s.lineTo(-w + r, h);
  s.quadraticCurveTo(-w, h, -w, h - r);
  s.lineTo(-w, -h + r);
  s.quadraticCurveTo(-w, -h, -w + r, -h);
  return s;
}

export function createKineticSculpture(
  textures: ProceduralTextureSet,
  isSoftwareGl: boolean
): KineticSculptureHandle {
  const root = new Group();
  const monumentPivot = new Group();
  root.add(monumentPivot);

  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];

  const trackGeo = <T extends BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  const initial = FINISH_PALETTES.obsidian;

  const stoneMat = trackMat(
    new MeshStandardMaterial({
      color: initial.stoneColor,
      metalness: initial.stoneMetalness,
      roughness: initial.stoneRoughness,
      roughnessMap: textures.brushedRoughness,
    })
  );

  const columnMat = trackMat(
    new MeshStandardMaterial({
      color: initial.columnColor,
      metalness: initial.columnMetalness,
      roughness: initial.columnRoughness,
    })
  );

  const brassMat = trackMat(
    new MeshPhysicalMaterial({
      color: initial.brassColor,
      metalness: initial.brassMetalness,
      roughness: initial.brassRoughness,
      clearcoat: 0.45,
      clearcoatRoughness: 0.14,
    })
  );

  const highlightColumnMat = trackMat(
    new MeshStandardMaterial({
      color: 0xf2994a,
      emissive: 0x8f460d,
      emissiveIntensity: 0.72,
      metalness: 0.88,
      roughness: 0.18,
    })
  );

  const dialFaceMat = trackMat(
    new MeshStandardMaterial({
      map: textures.dialAlbedo,
      metalness: 0.36,
      roughness: 0.4,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    })
  );

  const crystalMat = trackMat(
    new MeshPhysicalMaterial({
      color: initial.crystalColor,
      emissive: 0x164a70,
      emissiveIntensity: 0.38,
      metalness: 0.08,
      roughness: 0.08,
      ior: 1.5,
      reflectivity: 0.94,
      transparent: true,
      opacity: isSoftwareGl ? 0.68 : 0.74,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    })
  );

  const sealShaderMat = trackMat(
    new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new Color(initial.shaderColorA) },
        uColorB: { value: new Color(initial.shaderColorB) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPos;
        uniform float uTime;

        void main() {
          vUv = uv;
          vec3 pos = position;
          float wave = sin(pos.x * 4.5 + uTime * 2.0) * cos(pos.z * 4.5 - uTime * 1.5);
          pos += normal * wave * 0.01;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vViewPos = -mvPosition.xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPos;
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;

        void main() {
          vec3 viewDir = normalize(vViewPos);
          float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 2.4);
          float pulse = 0.5 + 0.5 * sin(vUv.x * 18.8495 - uTime * 2.4);
          vec3 col = mix(uColorB, uColorA, pulse * 0.68 + fresnel * 0.32);
          float alpha = clamp(0.38 + fresnel * 0.52, 0.0, 0.88);
          gl_FragColor = vec4(col * (1.02 + pulse * 0.25), alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
    })
  );

  // 1. Contact Shadow Plane
  const shadowGeo = trackGeo(new PlaneGeometry(7.0, 7.0));
  const shadowMat = trackMat(
    new MeshBasicMaterial({
      map: textures.contactShadow,
      transparent: true,
      depthWrite: false,
      opacity: 0.76,
    })
  );
  const contactShadowMesh = new Mesh(shadowGeo, shadowMat);
  contactShadowMesh.rotation.x = -Math.PI / 2;
  contactShadowMesh.position.y = 0.004;
  monumentPivot.add(contactShadowMesh);

  // 2. Three-Tiered Civic Plinth (grounded at y = 0)
  const plinthPoints = [
    new Vector2(0, 0),
    new Vector2(2.38, 0),
    new Vector2(2.38, 0.11),
    new Vector2(2.24, 0.14),
    new Vector2(2.15, 0.14),
    new Vector2(2.15, 0.26),
    new Vector2(2.03, 0.29),
    new Vector2(1.94, 0.29),
    new Vector2(1.94, 0.42),
    new Vector2(0, 0.42),
  ];
  const plinthGeo = trackGeo(new LatheGeometry(plinthPoints, 48));
  const plinthMesh = new Mesh(plinthGeo, stoneMat);
  plinthMesh.castShadow = true;
  plinthMesh.receiveShadow = true;
  monumentPivot.add(plinthMesh);

  const plinthTrimGeo = trackGeo(new TorusGeometry(1.94, 0.018, 8, 64));
  const plinthTrim = new Mesh(plinthTrimGeo, brassMat);
  plinthTrim.rotation.x = Math.PI / 2;
  plinthTrim.position.y = 0.425;
  monumentPivot.add(plinthTrim);

  // 3. Engraved Six Fundamental Rights Roman Dial (I - VI)
  const dialGeo = trackGeo(new RingGeometry(1.42, 1.9, 48));
  const dialMesh = new Mesh(dialGeo, dialFaceMat);
  dialMesh.rotation.x = -Math.PI / 2;
  dialMesh.position.y = 0.426;
  monumentPivot.add(dialMesh);

  // 4. Six Fundamental Rights Pillars (I - VI) with Stepped Capitals & Beacon Rings
  const colonnadeGroup = new Group();
  const columnGroups: {
    group: Group;
    shaft: Mesh;
    beaconRing: Mesh;
    baseAngle: number;
    currentLift: number;
  }[] = [];

  const colPlinthGeo = trackGeo(new BoxGeometry(0.28, 0.06, 0.28));
  const colBaseGeo = trackGeo(new CylinderGeometry(0.115, 0.14, 0.11, 14));
  const colShaftGeo = trackGeo(new CylinderGeometry(0.078, 0.094, 2.04, 12));
  const colCapGeo = trackGeo(new CylinderGeometry(0.132, 0.082, 0.14, 14));
  const colAbacusGeo = trackGeo(new BoxGeometry(0.27, 0.055, 0.27));
  const colRingGeo = trackGeo(new TorusGeometry(0.105, 0.013, 8, 20));
  const beaconRingGeo = trackGeo(new TorusGeometry(0.175, 0.011, 8, 24));

  const pillarCount = 6;
  const pillarBaseRadius = 1.66;
  for (let i = 0; i < pillarCount; i++) {
    const angle = (i / pillarCount) * Math.PI * 2;
    const cg = new Group();

    const squareBase = new Mesh(colPlinthGeo, stoneMat);
    squareBase.position.y = 0.45;
    squareBase.rotation.y = -angle;
    squareBase.castShadow = true;
    squareBase.receiveShadow = true;
    cg.add(squareBase);

    const base = new Mesh(colBaseGeo, stoneMat);
    base.position.y = 0.535;
    base.castShadow = true;
    base.receiveShadow = true;
    cg.add(base);

    const shaft = new Mesh(colShaftGeo, columnMat);
    shaft.position.y = 1.61;
    shaft.castShadow = true;
    shaft.receiveShadow = true;
    cg.add(shaft);

    const cap = new Mesh(colCapGeo, stoneMat);
    cap.position.y = 2.69;
    cap.castShadow = true;
    cg.add(cap);

    const abacus = new Mesh(colAbacusGeo, stoneMat);
    abacus.position.y = 2.785;
    abacus.rotation.y = -angle;
    abacus.castShadow = true;
    cg.add(abacus);

    const collar = new Mesh(colRingGeo, brassMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 2.61;
    cg.add(collar);

    const beaconRing = new Mesh(beaconRingGeo, brassMat);
    beaconRing.rotation.x = Math.PI / 2;
    beaconRing.position.y = 0.44;
    beaconRing.visible = false;
    cg.add(beaconRing);

    cg.position.set(
      Math.cos(angle) * pillarBaseRadius,
      0,
      Math.sin(angle) * pillarBaseRadius
    );
    colonnadeGroup.add(cg);
    columnGroups.push({ group: cg, shaft, beaconRing, baseAngle: angle, currentLift: 0 });
  }
  monumentPivot.add(colonnadeGroup);

  // 5. Overhead Entablature Architrave Crown
  const crownGroup = new Group();
  crownGroup.position.y = 2.86;
  const crownShape = createRingShape(1.88, 1.44);
  const crownGeo = trackGeo(
    new ExtrudeGeometry(crownShape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.022,
      bevelSegments: 2,
      curveSegments: 48,
    })
  );
  crownGeo.rotateX(Math.PI / 2);
  const crownMesh = new Mesh(crownGeo, stoneMat);
  crownMesh.castShadow = true;
  crownMesh.receiveShadow = true;
  crownGroup.add(crownMesh);

  const crownTrimGeo = trackGeo(new TorusGeometry(1.89, 0.018, 8, 64));
  const crownTrim = new Mesh(crownTrimGeo, brassMat);
  crownTrim.rotation.x = Math.PI / 2;
  crownTrim.position.y = -0.02;
  crownGroup.add(crownTrim);

  const innerCrownTrimGeo = trackGeo(new TorusGeometry(1.44, 0.014, 8, 56));
  const innerCrownTrim = new Mesh(innerCrownTrimGeo, brassMat);
  innerCrownTrim.rotation.x = Math.PI / 2;
  innerCrownTrim.position.y = -0.02;
  crownGroup.add(innerCrownTrim);

  monumentPivot.add(crownGroup);

  // 6. Central Judicial Fulcrum Column + Ulagu Meridian Globe Core
  const fulcrumStandPoints = [
    new Vector2(0, 0.42),
    new Vector2(0.44, 0.42),
    new Vector2(0.38, 0.54),
    new Vector2(0.22, 0.65),
    new Vector2(0.105, 0.86),
    new Vector2(0.075, 1.65),
    new Vector2(0.125, 2.08),
    new Vector2(0.085, 2.28),
    new Vector2(0, 2.32),
  ];
  const standGeo = trackGeo(new LatheGeometry(fulcrumStandPoints, 32));
  const standMesh = new Mesh(standGeo, columnMat);
  standMesh.castShadow = true;
  standMesh.receiveShadow = true;
  monumentPivot.add(standMesh);

  const standCollarGeo = trackGeo(new TorusGeometry(0.145, 0.018, 8, 24));
  const standCollar = new Mesh(standCollarGeo, brassMat);
  standCollar.rotation.x = Math.PI / 2;
  standCollar.position.y = 2.08;
  monumentPivot.add(standCollar);

  // Ulagu Globe Core + Fine Brass Meridian Cage Rings
  const globeGroup = new Group();
  globeGroup.position.y = 1.48;
  const globeGeo = trackGeo(new IcosahedronGeometry(0.36, 1));
  const globeMesh = new Mesh(globeGeo, crystalMat);
  globeMesh.renderOrder = 2;
  globeGroup.add(globeMesh);

  const meridianRingGeo = trackGeo(new TorusGeometry(0.46, 0.008, 6, 48));
  const meridianA = new Mesh(meridianRingGeo, brassMat);
  meridianA.rotation.x = Math.PI / 2;
  globeGroup.add(meridianA);

  const meridianB = new Mesh(meridianRingGeo, brassMat);
  meridianB.rotation.y = Math.PI / 3;
  meridianB.rotation.z = 0.35;
  globeGroup.add(meridianB);

  const meridianC = new Mesh(meridianRingGeo, brassMat);
  meridianC.rotation.y = -Math.PI / 3;
  meridianC.rotation.z = -0.35;
  globeGroup.add(meridianC);
  monumentPivot.add(globeGroup);

  // Custom GLSL Sovereign Seal Halo encircling the globe & fulcrum
  const haloGeo = trackGeo(new TorusGeometry(0.92, 0.02, 12, 64));
  const haloMesh = new Mesh(haloGeo, sealShaderMat);
  haloMesh.rotation.x = Math.PI / 2;
  haloMesh.position.y = 1.48;
  monumentPivot.add(haloMesh);

  // 7. Articulated Scales of Justice Assembly
  const scalesRoot = new Group();
  scalesRoot.position.y = 2.34;
  monumentPivot.add(scalesRoot);

  const finialGeo = trackGeo(new SphereGeometry(0.085, 18, 16));
  const finialMesh = new Mesh(finialGeo, brassMat);
  finialMesh.position.y = 0.14;
  scalesRoot.add(finialMesh);

  const beamGroup = new Group();
  const beamShape = createBalanceBeamShape();
  const beamGeo = trackGeo(
    new ExtrudeGeometry(beamShape, {
      depth: 0.055,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.01,
      bevelSegments: 2,
    })
  );
  beamGeo.center();
  const beamMesh = new Mesh(beamGeo, brassMat);
  beamMesh.castShadow = true;
  beamGroup.add(beamMesh);
  scalesRoot.add(beamGroup);

  // Center equilibrium pointer needle
  const pointerGeo = trackGeo(new ConeGeometry(0.026, 0.24, 12));
  const pointerMesh = new Mesh(pointerGeo, brassMat);
  pointerMesh.position.y = 0.24;
  beamGroup.add(pointerMesh);

  const rodGeo = trackGeo(new CylinderGeometry(0.008, 0.008, 0.86, 6));
  const panPoints = [
    new Vector2(0, 0),
    new Vector2(0.28, 0.015),
    new Vector2(0.36, 0.07),
    new Vector2(0.37, 0.085),
    new Vector2(0.33, 0.085),
    new Vector2(0.26, 0.03),
    new Vector2(0, 0.018),
  ];
  const panGeo = trackGeo(new LatheGeometry(panPoints, 28));

  function buildScalePan(isLeft: boolean): Group {
    const panAssembly = new Group();
    panAssembly.position.set(isLeft ? -1.16 : 1.16, 0, 0);

    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const rod = new Mesh(rodGeo, brassMat);
      const rx = Math.cos(a) * 0.17;
      const rz = Math.sin(a) * 0.17;
      rod.position.set(rx, -0.41, rz);
      rod.lookAt(0, 0, 0);
      rod.rotateX(Math.PI / 2);
      panAssembly.add(rod);
    }

    const panMesh = new Mesh(panGeo, brassMat);
    panMesh.position.y = -0.86;
    panMesh.castShadow = true;
    panAssembly.add(panMesh);

    if (isLeft) {
      const prismGeo = trackGeo(new OctahedronGeometry(0.15, 0));
      const prism = new Mesh(prismGeo, crystalMat);
      prism.position.y = -0.71;
      prism.renderOrder = 2;
      panAssembly.add(prism);
    } else {
      const weightGeo = trackGeo(new CylinderGeometry(0.13, 0.15, 0.18, 16));
      const weight = new Mesh(weightGeo, columnMat);
      weight.position.y = -0.75;
      weight.castShadow = true;
      panAssembly.add(weight);

      const capGeo = trackGeo(new TorusGeometry(0.11, 0.016, 8, 18));
      const cap = new Mesh(capGeo, brassMat);
      cap.rotation.x = Math.PI / 2;
      cap.position.y = -0.66;
      panAssembly.add(cap);
    }

    return panAssembly;
  }

  const leftPan = buildScalePan(true);
  const rightPan = buildScalePan(false);
  beamGroup.add(leftPan);
  beamGroup.add(rightPan);

  // 8. Three Orbiting Constitutional Codex Volumes
  const codexOrbitGroup = new Group();
  codexOrbitGroup.position.y = 1.24;
  const codexShape = createCodexShape();
  const codexGeo = trackGeo(
    new ExtrudeGeometry(codexShape, {
      depth: 0.055,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 2,
    })
  );
  codexGeo.center();
  const claspGeo = trackGeo(new BoxGeometry(0.03, 0.34, 0.08));

  const codexMeshes: { group: Group; baseAngle: number }[] = [];
  for (let i = 0; i < 3; i++) {
    const cg = new Group();
    const cover = new Mesh(codexGeo, columnMat);
    cover.castShadow = true;
    cg.add(cover);

    const spine = new Mesh(claspGeo, brassMat);
    spine.position.x = -0.145;
    cg.add(spine);

    const angle = (i / 3) * Math.PI * 2;
    cg.position.set(Math.cos(angle) * 0.96, 0, Math.sin(angle) * 0.96);
    cg.rotation.y = -angle;
    cg.rotation.x = 0.25;
    codexOrbitGroup.add(cg);
    codexMeshes.push({ group: cg, baseAngle: angle });
  }
  monumentPivot.add(codexOrbitGroup);

  // 9. Instanced Civic Nodes (56 particles)
  const particleCount = 56;
  const nodeGeo = trackGeo(new OctahedronGeometry(0.022, 0));
  const nodeMat = trackMat(
    new MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.72,
      roughness: 0.25,
    })
  );
  const orbitalNodes = new InstancedMesh(nodeGeo, nodeMat, particleCount);
  orbitalNodes.frustumCulled = false;

  const nodeBaseAngles = new Float32Array(particleCount);
  const nodeRadii = new Float32Array(particleCount);
  const nodeHeights = new Float32Array(particleCount);
  const nodeSpeeds = new Float32Array(particleCount);
  const nodeScales = new Float32Array(particleCount);
  const _color = new Color();

  for (let i = 0; i < particleCount; i++) {
    nodeBaseAngles[i] = (i / particleCount) * Math.PI * 2 + (i % 5) * 0.2;
    nodeRadii[i] = 2.18 + (i % 7) * 0.16;
    nodeHeights[i] = 0.55 + (i % 9) * 0.28;
    nodeSpeeds[i] = 0.1 + (i % 4) * 0.035;
    nodeScales[i] = 0.68 + (i % 5) * 0.14;

    if (i % 3 === 0) _color.setHex(0xe5863a);
    else if (i % 3 === 1) _color.setHex(0xb2d5f1);
    else _color.setHex(0x5db0e6);
    orbitalNodes.setColorAt(i, _color);
  }
  if (orbitalNodes.instanceColor) orbitalNodes.instanceColor.needsUpdate = true;
  orbitalNodes.computeBoundingSphere();
  monumentPivot.add(orbitalNodes);

  // 10. Volumetric Full-Page Spatial Field (84 nodes)
  const fieldCount = 84;
  const fieldGeo = trackGeo(new OctahedronGeometry(0.025, 0));
  const fieldMat = trackMat(
    new MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.65,
      roughness: 0.3,
    })
  );
  const spatialField = new InstancedMesh(fieldGeo, fieldMat, fieldCount);
  spatialField.frustumCulled = false;

  const fieldX = new Float32Array(fieldCount);
  const fieldY = new Float32Array(fieldCount);
  const fieldZ = new Float32Array(fieldCount);
  const fieldScale = new Float32Array(fieldCount);

  for (let i = 0; i < fieldCount; i++) {
    const theta = i * 2.3999632;
    const radius = 3.6 + (i % 13) * 0.62;
    fieldX[i] = Math.cos(theta) * radius;
    fieldY[i] = 0.35 + ((i * 7) % 23) * 0.38;
    fieldZ[i] = Math.sin(theta) * radius - 1.6;
    fieldScale[i] = 0.45 + (i % 4) * 0.2;

    if (i % 5 === 0) _color.setHex(0xe5863a);
    else _color.setHex(0x2f5777);
    spatialField.setColorAt(i, _color);
  }
  if (spatialField.instanceColor) spatialField.instanceColor.needsUpdate = true;
  spatialField.computeBoundingSphere();
  root.add(spatialField);

  let currentPhase = 0;
  let lastActiveRight: number | null = null;
  let currentRotY = 0;

  return {
    root,
    setFinish(finish: MaterialFinishId) {
      const p = FINISH_PALETTES[finish];
      stoneMat.color.setHex(p.stoneColor);
      stoneMat.metalness = p.stoneMetalness;
      stoneMat.roughness = p.stoneRoughness;

      columnMat.color.setHex(p.columnColor);
      columnMat.metalness = p.columnMetalness;
      columnMat.roughness = p.columnRoughness;

      brassMat.color.setHex(p.brassColor);
      brassMat.metalness = p.brassMetalness;
      brassMat.roughness = p.brassRoughness;

      crystalMat.color.setHex(p.crystalColor);
      sealShaderMat.uniforms.uColorA.value.setHex(p.shaderColorA);
      sealShaderMat.uniforms.uColorB.value.setHex(p.shaderColorB);
    },
    update({
      elapsed,
      delta,
      explodeProgress,
      speed,
      playing,
      scrollProgress,
      pointerX,
      pointerY,
      stageOffsetX,
      activeRightIndex,
    }) {
      if (playing) {
        currentPhase += delta * speed;
      }

      if (lastActiveRight !== activeRightIndex) {
        lastActiveRight = activeRightIndex;
        for (let i = 0; i < columnGroups.length; i++) {
          const isSelected = activeRightIndex === i;
          columnGroups[i].shaft.material = isSelected ? highlightColumnMat : columnMat;
          columnGroups[i].beaconRing.visible = isSelected;
        }
      }

      const scrollAngle = scrollProgress * Math.PI * 2.4;
      sealShaderMat.uniforms.uTime.value = currentPhase + scrollProgress * 3.5;

      // Smoothly orient selected Fundamental Right pillar toward camera
      const targetRotY =
        activeRightIndex !== null
          ? Math.PI / 2 - (activeRightIndex / pillarCount) * Math.PI * 2 + pointerX * 0.1
          : scrollAngle * 0.34 + pointerX * 0.14;

      currentRotY = MathUtils.damp(currentRotY, targetRotY, 5.2, delta);
      monumentPivot.position.x = stageOffsetX;
      monumentPivot.rotation.y = currentRotY;
      monumentPivot.rotation.x = pointerY * 0.05;

      globeGroup.rotation.y = currentPhase * 0.42 + scrollAngle * 0.6;
      globeGroup.rotation.x = Math.sin(currentPhase * 0.35) * 0.14;
      meridianA.rotation.z = currentPhase * 0.25;
      meridianB.rotation.x = currentPhase * 0.18;

      const balanceAngle =
        Math.sin(currentPhase * 0.78 + scrollProgress * Math.PI * 3.0) * 0.15;
      beamGroup.rotation.z = balanceAngle;
      leftPan.rotation.z = -balanceAngle;
      rightPan.rotation.z = -balanceAngle;
      scalesRoot.rotation.y = Math.sin(currentPhase * 0.25) * 0.22 + scrollAngle * 0.35;
      scalesRoot.position.y = 2.34 + explodeProgress * 0.52;

      const expandedR = pillarBaseRadius + explodeProgress * 0.92;
      for (let i = 0; i < columnGroups.length; i++) {
        const c = columnGroups[i];
        const targetLift = activeRightIndex === i ? 0.24 : 0;
        c.currentLift = MathUtils.damp(c.currentLift, targetLift, 7.0, delta);
        c.group.position.set(
          Math.cos(c.baseAngle) * expandedR,
          explodeProgress * 0.16 + c.currentLift,
          Math.sin(c.baseAngle) * expandedR
        );
        if (c.beaconRing.visible) {
          const pulse = 1 + Math.sin(elapsed * 4.0) * 0.08;
          c.beaconRing.scale.set(pulse, pulse, 1);
        }
      }
      crownGroup.position.y = 2.86 + explodeProgress * 0.88;
      crownGroup.rotation.y = scrollAngle * 0.22;

      codexOrbitGroup.rotation.y = currentPhase * 0.3 + scrollAngle * 0.6;
      codexOrbitGroup.position.y = 1.24 + explodeProgress * 0.28;
      const codexR = 0.96 + explodeProgress * 0.42;
      for (let i = 0; i < codexMeshes.length; i++) {
        const cm = codexMeshes[i];
        cm.group.position.set(
          Math.cos(cm.baseAngle) * codexR,
          Math.sin(currentPhase * 1.1 + i * 2.0) * 0.08,
          Math.sin(cm.baseAngle) * codexR
        );
      }

      haloMesh.rotation.z = currentPhase * 0.35;
      haloMesh.position.y = 1.48 + Math.sin(currentPhase * 0.9) * 0.04;

      const radialWave = Math.sin(scrollProgress * Math.PI) * 0.45;
      for (let i = 0; i < particleCount; i++) {
        const angle = nodeBaseAngles[i] + currentPhase * nodeSpeeds[i] + scrollAngle * 0.35;
        const r = nodeRadii[i] + explodeProgress * 0.72 + radialWave;
        _vec3.set(
          Math.cos(angle) * r,
          nodeHeights[i] + Math.sin(angle * 2 + currentPhase) * 0.08,
          Math.sin(angle) * r
        );
        _euler.set(currentPhase * 0.6 + i, currentPhase * 0.4, 0);
        _quat.setFromEuler(_euler);
        const s = nodeScales[i];
        _scale.set(s, s, s);
        _mat4.compose(_vec3, _quat, _scale);
        orbitalNodes.setMatrixAt(i, _mat4);
      }
      orbitalNodes.instanceMatrix.needsUpdate = true;

      for (let i = 0; i < fieldCount; i++) {
        const driftY = ((fieldY[i] + scrollProgress * 4.5 + elapsed * 0.045) % 8.5) - 0.5;
        _vec3.set(
          fieldX[i] + Math.sin(elapsed * 0.3 + i) * 0.08,
          driftY,
          fieldZ[i]
        );
        _euler.set(elapsed * 0.22 + i, elapsed * 0.18, 0);
        _quat.setFromEuler(_euler);
        const s = fieldScale[i];
        _scale.set(s, s, s);
        _mat4.compose(_vec3, _quat, _scale);
        spatialField.setMatrixAt(i, _mat4);
      }
      spatialField.instanceMatrix.needsUpdate = true;
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
