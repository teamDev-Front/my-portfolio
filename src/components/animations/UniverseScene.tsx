'use client';

/**
 * Realistic 3D universe rendered with Three.js (WebGL).
 *
 * Architecture:
 *  - Scene: stars (THREE.Points), galaxy spiral (Points), 2 planets (Mesh)
 *  - Planets use a custom ShaderMaterial: equirectangular diffuse texture +
 *    Lambertian lighting + specular for ocean worlds + atmospheric Fresnel.
 *  - A second, slightly larger sphere with a Fresnel shader renders the
 *    atmospheric glow that hugs the limb (same trick 08mfp's project uses).
 *  - Post-processing: UnrealBloomPass for additive starlight glow.
 *  - Interactions: mouse/touch parallax (camera tilt), click → shockwave,
 *    warp() method animates a warp-speed drive toward the stars + flash.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

export interface UniverseSceneHandle {
  warp: () => Promise<void>;
  getProgress: () => number;
}

interface UniverseSceneProps {
  onReady?: () => void;
  className?: string;
}

// =====================================================================
// SHADERS
// =====================================================================

/**
 * Planet surface shader.
 * Receives:
 *  - uDayMap: equirectangular color map
 *  - uCloudsMap: optional cloud layer (rgba)
 *  - uNormalScale: bump influence
 *  - uLightDir: sun direction in world space
 *  - uSpecular, uShininess: ocean specular
 *  - uAtmosphereColor: limb color for soft rim scattering
 *  - uCloudRotation, uSurfaceRotation: independent UV shifts
 */
const PLANET_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vPosW = worldPos.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const PLANET_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform sampler2D uDayMap;
  uniform sampler2D uCloudsMap;
  uniform bool uHasClouds;
  uniform vec3 uLightDir;       // direction light travels (world space)
  uniform vec3 uCameraPosW;
  uniform vec3 uAtmosphereColor;
  uniform float uAtmosphereStrength;
  uniform float uSpecular;
  uniform float uShininess;
  uniform float uAmbient;
  uniform float uSurfaceRotation;
  uniform float uCloudRotation;

  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 L = normalize(-uLightDir);                  // toward the sun
    vec3 V = normalize(uCameraPosW - vPosW);         // toward the camera
    vec3 H = normalize(L + V);                       // halfway for Blinn-Phong

    // ----- Surface texture with rotation offset -----
    vec2 surfUv = vec2(vUv.x + uSurfaceRotation, vUv.y);
    vec3 albedo = texture2D(uDayMap, surfUv).rgb;

    // ----- Clouds (independent rotation, blended by alpha) -----
    if (uHasClouds) {
      vec2 cloudUv = vec2(vUv.x + uCloudRotation, vUv.y);
      vec4 cloudSample = texture2D(uCloudsMap, cloudUv);
      albedo = mix(albedo, cloudSample.rgb, cloudSample.a);
    }

    // ----- Lambertian diffuse -----
    float ndotl = max(dot(N, L), 0.0);
    float diffuse = uAmbient + (1.0 - uAmbient) * ndotl;

    // Slight warm sunlight tint
    vec3 sunColor = vec3(1.0, 0.96, 0.9);
    vec3 lit = albedo * diffuse * sunColor;

    // ----- Specular (Blinn-Phong) — only lit-side gets specular -----
    if (uSpecular > 0.0 && ndotl > 0.0) {
      float spec = pow(max(dot(N, H), 0.0), uShininess);
      lit += vec3(1.0, 0.97, 0.92) * spec * uSpecular;
    }

    // ----- Fresnel rim / atmosphere scatter -----
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    float atmMix = fresnel * uAtmosphereStrength;
    // Lit side scatters more, dark side minimal
    atmMix *= 0.2 + 0.8 * ndotl;
    lit += uAtmosphereColor * atmMix;

    // ----- Terminator softening: slight tint around the day/night line -----
    float term = smoothstep(-0.15, 0.15, dot(N, L));
    lit = mix(lit * 0.6, lit, term);

    gl_FragColor = vec4(lit, 1.0);
  }
`;

/**
 * Atmosphere shell shader — drawn on a slightly larger sphere with
 * back-face rendering and additive blending. Produces the classic soft
 * blue halo around Earth.
 */
const ATMOSPHERE_VERTEX = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vPosW = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const ATMOSPHERE_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform vec3 uCameraPosW;
  uniform vec3 uLightDir;
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  varying vec3 vNormalW;
  varying vec3 vPosW;

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(uCameraPosW - vPosW);
    vec3 L = normalize(-uLightDir);

    // Inverted fresnel — brightest on the edge when viewed straight on
    float fresnel = pow(1.0 - abs(dot(N, V)), uPower);
    // Daylight scattering factor
    float day = smoothstep(-0.35, 0.55, dot(N, L));
    float a = fresnel * uIntensity * (0.25 + 0.75 * day);
    gl_FragColor = vec4(uColor, a);
  }
`;

/**
 * Star shader — draws each point as a soft circular splat with
 * temperature-based color + twinkle.
 */
const STAR_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aTwinkle;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uWarp;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // Distance-based size scale (perspective)
    float depth = -mv.z;
    float size = aSize * (300.0 / max(depth, 1.0)) * uPixelRatio;

    // Twinkle
    float t = 0.6 + 0.4 * sin(uTime * 2.3 + aTwinkle * 6.28);
    vAlpha = clamp(t, 0.2, 1.0);

    // Warp stretches stars slightly forward
    size *= 1.0 + uWarp * 0.8;

    gl_PointSize = max(1.5, size);
    gl_Position = projectionMatrix * mv;
  }
`;

const STAR_FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 p = gl_PointCoord - vec2(0.5);
    float d = length(p);
    float core = smoothstep(0.5, 0.0, d);
    float halo = smoothstep(0.5, 0.15, d) * 0.4;
    float a = (core + halo) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

const GALAXY_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uPixelRatio;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = max(1.0, aSize * uPixelRatio);
    gl_Position = projectionMatrix * mv;
  }
`;

const GALAXY_FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  void main() {
    vec2 p = gl_PointCoord - vec2(0.5);
    float d = length(p);
    float a = smoothstep(0.5, 0.0, d) * 0.65;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

/**
 * Final flash pass — full-screen white fade used during warp completion.
 */
const FLASH_SHADER = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uFlash: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform float uFlash;
    varying vec2 vUv;
    void main() {
      vec4 base = texture2D(tDiffuse, vUv);
      gl_FragColor = mix(base, vec4(1.0), uFlash);
    }
  `,
};

// =====================================================================
// PROCEDURAL TEXTURES (generated on a 2D canvas, uploaded to GPU)
// =====================================================================

function buildGasGiantTexture(): THREE.CanvasTexture {
  const W = 2048;
  const H = 1024;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;

  // Base pole-to-pole gradient
  const base = g.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, '#9b6a46');
  base.addColorStop(0.2, '#c99872');
  base.addColorStop(0.5, '#dfb185');
  base.addColorStop(0.8, '#bc8d60');
  base.addColorStop(1, '#7c553a');
  g.fillStyle = base;
  g.fillRect(0, 0, W, H);

  // Turbulent bands
  const BANDS = [
    [210, 170, 125],
    [175, 120, 78],
    [235, 195, 145],
    [150, 95, 55],
    [225, 180, 130],
    [195, 140, 90],
    [250, 210, 160],
    [165, 110, 70],
  ];
  const bandCount = 30;
  for (let i = 0; i < bandCount; i++) {
    const yCenter = (i / bandCount) * H + (Math.random() - 0.5) * 10;
    const bandH = (H / bandCount) * (0.6 + Math.random() * 1.0);
    const c2 = BANDS[i % BANDS.length];
    g.fillStyle = `rgba(${c2[0]}, ${c2[1]}, ${c2[2]}, ${
      0.2 + Math.random() * 0.5
    })`;
    g.beginPath();
    g.moveTo(0, yCenter);
    for (let x = 0; x <= W; x += 8) {
      const wave =
        Math.sin(x * 0.012 + i * 1.7) * 6 +
        Math.cos(x * 0.038 + i * 2.3) * 3 +
        Math.sin(x * 0.004 + i * 0.9) * 9;
      g.lineTo(x, yCenter + wave);
    }
    for (let x = W; x >= 0; x -= 8) {
      const wave =
        Math.sin(x * 0.012 + i * 1.7 + 0.6) * 6 +
        Math.cos(x * 0.038 + i * 2.3 + 0.3) * 3 +
        Math.sin(x * 0.004 + i * 0.9 + 0.4) * 9;
      g.lineTo(x, yCenter + bandH + wave);
    }
    g.closePath();
    g.fill();
  }

  // Flow streamers
  g.globalAlpha = 0.22;
  g.strokeStyle = '#4d2a12';
  for (let i = 0; i < 180; i++) {
    const y = Math.random() * H;
    g.lineWidth = 0.8 + Math.random() * 1.8;
    g.beginPath();
    for (let x = 0; x <= W; x += 6) {
      const wy =
        y + Math.sin(x * 0.018 + i * 0.7) * 8 + Math.cos(x * 0.05) * 3;
      if (x === 0) g.moveTo(x, wy);
      else g.lineTo(x, wy);
    }
    g.stroke();
  }
  g.globalAlpha = 1;

  // Storm vortices
  const storms = [
    { cx: 0.17, cy: 0.42, size: 150, r: 230, gn: 100, b: 70 }, // GRS
    { cx: 0.62, cy: 0.3, size: 85, r: 210, gn: 155, b: 115 },
    { cx: 0.83, cy: 0.66, size: 65, r: 185, gn: 135, b: 95 },
    { cx: 0.38, cy: 0.72, size: 110, r: 220, gn: 175, b: 135 },
    { cx: 0.05, cy: 0.58, size: 55, r: 195, gn: 145, b: 105 },
    { cx: 0.5, cy: 0.5, size: 40, r: 240, gn: 200, b: 150 },
  ];
  for (const s of storms) {
    const cx = s.cx * W;
    const cy = s.cy * H;
    g.save();
    g.translate(cx, cy);
    g.scale(1.9, 0.7);
    const outer = g.createRadialGradient(0, 0, s.size * 0.2, 0, 0, s.size);
    outer.addColorStop(0, `rgba(${s.r}, ${s.gn}, ${s.b}, 0.9)`);
    outer.addColorStop(0.5, `rgba(${s.r - 30}, ${s.gn - 20}, ${s.b - 15}, 0.55)`);
    outer.addColorStop(1, `rgba(${s.r - 60}, ${s.gn - 40}, ${s.b - 30}, 0)`);
    g.fillStyle = outer;
    g.beginPath();
    g.arc(0, 0, s.size, 0, Math.PI * 2);
    g.fill();
    const core = g.createRadialGradient(0, 0, 0, 0, 0, s.size * 0.5);
    core.addColorStop(0, 'rgba(255, 215, 170, 0.95)');
    core.addColorStop(1, `rgba(${s.r}, ${s.gn}, ${s.b}, 0)`);
    g.fillStyle = core;
    g.beginPath();
    g.arc(0, 0, s.size * 0.5, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }

  // Grain
  const img = g.getImageData(0, 0, W, H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 18;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n * 0.9));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n * 0.75));
  }
  g.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildEarthTexture(): THREE.CanvasTexture {
  const W = 2048;
  const H = 1024;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;

  // Deep ocean gradient
  const ocean = g.createLinearGradient(0, 0, 0, H);
  ocean.addColorStop(0, '#061d36');
  ocean.addColorStop(0.2, '#0f3461');
  ocean.addColorStop(0.5, '#19528e');
  ocean.addColorStop(0.8, '#10406f');
  ocean.addColorStop(1, '#05182d');
  g.fillStyle = ocean;
  g.fillRect(0, 0, W, H);

  // Continents — multiple biome-colored masses
  const continents = 22;
  for (let i = 0; i < continents; i++) {
    const cx = Math.random() * W;
    const cy = H * 0.18 + Math.random() * H * 0.64;
    const baseSize = 60 + Math.random() * 180;
    const latFactor = Math.abs(cy / H - 0.5) * 2;
    const greenness = 1 - latFactor;
    const rC = 70 + latFactor * 95;
    const gC = 105 + greenness * 70;
    const bC = 50 + latFactor * 35;

    g.fillStyle = `rgba(${rC | 0}, ${gC | 0}, ${bC | 0}, 0.96)`;
    g.beginPath();
    const blobs = 10 + Math.floor(Math.random() * 8);
    for (let k = 0; k < blobs; k++) {
      const ang = (k / blobs) * Math.PI * 2 + Math.random() * 0.7;
      const dist = baseSize * (0.3 + Math.random() * 0.9);
      const bx = cx + Math.cos(ang) * dist;
      const by = cy + Math.sin(ang) * dist * 0.65;
      const br = baseSize * (0.35 + Math.random() * 0.55);
      g.moveTo(bx + br, by);
      g.arc(bx, by, br, 0, Math.PI * 2);
    }
    g.fill();

    // Inland darker patches
    g.fillStyle = `rgba(${Math.max(0, rC - 35) | 0}, ${
      Math.max(0, gC - 40) | 0
    }, ${Math.max(0, bC - 25) | 0}, 0.55)`;
    for (let k = 0; k < 6; k++) {
      const bx = cx + (Math.random() - 0.5) * baseSize * 1.2;
      const by = cy + (Math.random() - 0.5) * baseSize * 0.7;
      const br = baseSize * (0.15 + Math.random() * 0.35);
      g.beginPath();
      g.arc(bx, by, br, 0, Math.PI * 2);
      g.fill();
    }
  }

  // Polar ice caps
  const capTop = g.createLinearGradient(0, 0, 0, H * 0.16);
  capTop.addColorStop(0, 'rgba(245, 250, 255, 0.98)');
  capTop.addColorStop(0.6, 'rgba(230, 240, 250, 0.55)');
  capTop.addColorStop(1, 'rgba(230, 240, 250, 0)');
  g.fillStyle = capTop;
  g.fillRect(0, 0, W, H * 0.16);

  const capBot = g.createLinearGradient(0, H, 0, H * 0.84);
  capBot.addColorStop(0, 'rgba(245, 250, 255, 0.98)');
  capBot.addColorStop(0.6, 'rgba(230, 240, 250, 0.55)');
  capBot.addColorStop(1, 'rgba(230, 240, 250, 0)');
  g.fillStyle = capBot;
  g.fillRect(0, H * 0.84, W, H * 0.16);

  // Grain
  const img = g.getImageData(0, 0, W, H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n * 0.92));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n * 0.8));
  }
  g.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildCloudTexture(): THREE.CanvasTexture {
  const W = 2048;
  const H = 1024;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  g.clearRect(0, 0, W, H);

  const clusterCount = 24;
  for (let cIdx = 0; cIdx < clusterCount; cIdx++) {
    const cy = H * 0.1 + Math.random() * H * 0.8;
    const cx = Math.random() * W;
    const spread = 120 + Math.random() * 280;
    const puffs = 40 + Math.floor(Math.random() * 50);
    for (let p = 0; p < puffs; p++) {
      const px = cx + (Math.random() - 0.5) * spread * 2;
      const py = cy + (Math.random() - 0.5) * spread * 0.7;
      const r = 16 + Math.random() * 50;
      const alpha = 0.32 + Math.random() * 0.45;
      const grad = g.createRadialGradient(px, py, 0, px, py, r);
      grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      g.fillStyle = grad;
      g.beginPath();
      g.arc(px, py, r, 0, Math.PI * 2);
      g.fill();
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 4;
  return tex;
}

function buildRingTexture(): THREE.CanvasTexture {
  // 1D ring profile — radius goes from inner to outer
  const W = 512;
  const H = 64;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  g.clearRect(0, 0, W, H);

  // Define ring bands with densities, mirrored by Saturn
  const bands: [number, number, number, number, number, number][] = [
    // startPct, endPct, r, g, b, alpha
    [0.0, 0.05, 150, 120, 85, 0.0],
    [0.05, 0.25, 180, 150, 110, 0.35],
    [0.25, 0.3, 140, 115, 85, 0.1],
    [0.3, 0.55, 225, 195, 150, 0.85],
    [0.55, 0.62, 140, 115, 85, 0.15],
    [0.62, 0.85, 215, 180, 135, 0.75],
    [0.85, 0.92, 195, 160, 120, 0.5],
    [0.92, 1.0, 170, 140, 105, 0.2],
  ];

  const img = g.createImageData(W, H);
  const d = img.data;
  for (let x = 0; x < W; x++) {
    const t = x / W;
    let band = bands[0];
    for (const b of bands) {
      if (t >= b[0] && t <= b[1]) {
        band = b;
        break;
      }
    }
    const variance = (Math.sin(t * 180) * 0.5 + 0.5) * 0.15;
    const a = Math.max(0, Math.min(1, band[5] + variance - 0.07));
    for (let y = 0; y < H; y++) {
      const i = (y * W + x) * 4;
      d[i] = band[2];
      d[i + 1] = band[3];
      d[i + 2] = band[4];
      d[i + 3] = Math.floor(a * 255);
    }
  }
  g.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 8;
  return tex;
}

// =====================================================================
// COMPONENT
// =====================================================================

export const UniverseScene = forwardRef<UniverseSceneHandle, UniverseSceneProps>(
  function UniverseScene({ onReady, className }, ref) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);

    // Three.js refs
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const composerRef = useRef<EffectComposer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

    const planetsRef = useRef<
      Array<{
        mesh: THREE.Mesh;
        atmosphere: THREE.Mesh;
        rings?: THREE.Mesh;
        material: THREE.ShaderMaterial;
        atmosphereMaterial: THREE.ShaderMaterial;
        rotationSpeed: number;
        cloudRotationSpeed: number;
      }>
    >([]);

    const starsRef = useRef<{
      points: THREE.Points;
      material: THREE.ShaderMaterial;
    } | null>(null);
    const galaxyRef = useRef<THREE.Points | null>(null);
    const flashPassRef = useRef<ShaderPass | null>(null);
    const bloomPassRef = useRef<UnrealBloomPass | null>(null);

    // Shared light direction — shader uniforms hold a reference to this
    // Vector3, so mutating it in the render loop updates every planet.
    const lightDirRef = useRef<THREE.Vector3 | null>(null);
    const lightDirBaseRef = useRef<THREE.Vector3>(new THREE.Vector3());

    // Animation state
    const stateRef = useRef({
      mouseX: 0,
      mouseY: 0,
      targetCamX: 0,
      targetCamY: 0,
      camX: 0,
      camY: 0,
      warp: 0, // 0..1
      baseZ: 0, // camera z (normal = 0, warp moves it forward)
      time: 0,
      globalAlpha: 0,
      revealing: true,
      flashAlpha: 0,
      bloomBoost: 0, // temporarily raised on click for a brief visual pulse
      cameraZ: 18, // overwritten in setup() based on mobile/desktop
      ambientMul: 1, // multiplier for ambient orbit amplitude (mobile reduces)
    });

    const isWarpingRef = useRef(false);
    const readyFiredRef = useRef(false);

    // Click supernova bursts — each click spawns a bright central flare,
    // radial particle burst, and a brief bloom pulse.
    const burstsRef = useRef<
      Array<{
        particles: THREE.Points;
        particleMat: THREE.ShaderMaterial;
        flare: THREE.Mesh;
        flareMat: THREE.MeshBasicMaterial;
        velocities: Float32Array;
        start: number;
        life: number;
      }>
    >([]);


    // =================================================================
    // SETUP
    // =================================================================
    const setup = useCallback(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const isMobile = window.innerWidth < 768;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      renderer.setClearColor(0x03030a, 1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      rendererRef.current = renderer;

      // Scene + camera
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Wider FOV + pull camera back on mobile so portrait aspect shows
      // both planets comfortably without clipping or being dominated.
      const camera = new THREE.PerspectiveCamera(
        isMobile ? 68 : 55,
        width / height,
        0.1,
        4000
      );
      const cameraZ = isMobile ? 23 : 18;
      camera.position.set(0, 0, cameraZ);
      stateRef.current.cameraZ = cameraZ;
      stateRef.current.ambientMul = isMobile ? 0.45 : 1;
      cameraRef.current = camera;

      // Light direction (same for everyone — acts like distant sun).
      // This Vector3 is SHARED across all planet/atmosphere uniforms by
      // reference, so rotating it in the render loop updates every shader
      // at once (giving a slow "sun drift" day/night cycle).
      const lightDir = new THREE.Vector3(0.6, 0.3, -0.7).normalize();
      lightDirRef.current = lightDir;
      lightDirBaseRef.current.copy(lightDir);
      // Note: light "direction" here is the direction light travels,
      // so pointing into the planets from slightly right-up-front.

      // ============================================================
      // PLANETS
      // ============================================================
      const planets: typeof planetsRef.current = [];

      // --- Planet 1: Saturn-like gas giant with rings ---
      {
        const surf = buildGasGiantTexture();

        const material = new THREE.ShaderMaterial({
          vertexShader: PLANET_VERTEX,
          fragmentShader: PLANET_FRAGMENT,
          uniforms: {
            uDayMap: { value: surf },
            uCloudsMap: { value: null },
            uHasClouds: { value: false },
            uLightDir: { value: lightDir },
            uCameraPosW: { value: new THREE.Vector3() },
            uAtmosphereColor: { value: new THREE.Color(0xf5b072) },
            uAtmosphereStrength: { value: 0.75 },
            uSpecular: { value: 0.0 },
            uShininess: { value: 1 },
            uAmbient: { value: 0.05 },
            uSurfaceRotation: { value: 0 },
            uCloudRotation: { value: 0 },
          },
        });

        // Smaller planet pushed closer to center on mobile so portrait
        // aspect keeps it in view without dominating the scene
        const saturnR = isMobile ? 2.2 : 3.2;
        const geo = new THREE.SphereGeometry(saturnR, 128, 128);
        const mesh = new THREE.Mesh(geo, material);
        if (isMobile) {
          mesh.position.set(-3.5, 5.5, -11);
        } else {
          mesh.position.set(-12, 2.0, -10);
        }
        mesh.rotation.z = 0.25; // slight axial tilt
        scene.add(mesh);

        // Atmosphere shell
        const atmMat = new THREE.ShaderMaterial({
          vertexShader: ATMOSPHERE_VERTEX,
          fragmentShader: ATMOSPHERE_FRAGMENT,
          uniforms: {
            uCameraPosW: { value: new THREE.Vector3() },
            uLightDir: { value: lightDir },
            uColor: { value: new THREE.Color(0xf5b072) },
            uIntensity: { value: 1.3 },
            uPower: { value: 3.0 },
          },
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        });
        const atmGeo = new THREE.SphereGeometry(saturnR * 1.08, 64, 64);
        const atm = new THREE.Mesh(atmGeo, atmMat);
        mesh.add(atm);

        // Rings — flat disk around the planet
        const ringTex = buildRingTexture();
        const ringInner = saturnR * 1.25;
        const ringOuter = saturnR * 2.3;
        const ringGeo = new THREE.RingGeometry(ringInner, ringOuter, 128, 1);
        // Custom UVs so the texture samples radially (from inner to outer)
        const ringPos = ringGeo.attributes.position;
        const ringUv = ringGeo.attributes.uv;
        for (let i = 0; i < ringPos.count; i++) {
          const x = ringPos.getX(i);
          const y = ringPos.getY(i);
          const d = Math.sqrt(x * x + y * y);
          const t = (d - ringInner) / (ringOuter - ringInner);
          ringUv.setXY(i, t, 0.5);
        }
        ringUv.needsUpdate = true;

        const ringMat = new THREE.MeshBasicMaterial({
          map: ringTex,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const rings = new THREE.Mesh(ringGeo, ringMat);
        rings.rotation.x = Math.PI / 2 - 0.35;
        mesh.add(rings);

        planets.push({
          mesh,
          atmosphere: atm,
          rings,
          material,
          atmosphereMaterial: atmMat,
          rotationSpeed: 0.04,
          cloudRotationSpeed: 0,
        });
      }

      // --- Planet 2: Earth-like ocean world with clouds ---
      {
        const surf = buildEarthTexture();
        const clouds = buildCloudTexture();

        const material = new THREE.ShaderMaterial({
          vertexShader: PLANET_VERTEX,
          fragmentShader: PLANET_FRAGMENT,
          uniforms: {
            uDayMap: { value: surf },
            uCloudsMap: { value: clouds },
            uHasClouds: { value: true },
            uLightDir: { value: lightDir },
            uCameraPosW: { value: new THREE.Vector3() },
            uAtmosphereColor: { value: new THREE.Color(0x83b6ff) },
            uAtmosphereStrength: { value: 1.0 },
            uSpecular: { value: 0.75 },
            uShininess: { value: 32 },
            uAmbient: { value: 0.05 },
            uSurfaceRotation: { value: 0 },
            uCloudRotation: { value: 0 },
          },
        });

        const earthR = isMobile ? 1.55 : 2.2;
        const geo = new THREE.SphereGeometry(earthR, 128, 128);
        const mesh = new THREE.Mesh(geo, material);
        if (isMobile) {
          mesh.position.set(3.8, -6, -13);
        } else {
          mesh.position.set(13, -2.6, -14);
        }
        mesh.rotation.z = -0.2;
        scene.add(mesh);

        const atmMat = new THREE.ShaderMaterial({
          vertexShader: ATMOSPHERE_VERTEX,
          fragmentShader: ATMOSPHERE_FRAGMENT,
          uniforms: {
            uCameraPosW: { value: new THREE.Vector3() },
            uLightDir: { value: lightDir },
            uColor: { value: new THREE.Color(0x83b6ff) },
            uIntensity: { value: 1.6 },
            uPower: { value: 2.6 },
          },
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        });
        const atmGeo = new THREE.SphereGeometry(earthR * 1.08, 64, 64);
        const atm = new THREE.Mesh(atmGeo, atmMat);
        mesh.add(atm);

        planets.push({
          mesh,
          atmosphere: atm,
          material,
          atmosphereMaterial: atmMat,
          rotationSpeed: 0.055,
          cloudRotationSpeed: 0.075,
        });
      }

      planetsRef.current = planets;

      // ============================================================
      // STARS
      // ============================================================
      {
        const count = isMobile ? 3500 : 9000;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const twinkles = new Float32Array(count);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
          // Distribute in a spherical shell around camera
          const r = 60 + Math.random() * 900;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const x = r * Math.sin(phi) * Math.cos(theta);
          const y = r * Math.sin(phi) * Math.sin(theta);
          const z = r * Math.cos(phi) - 50;
          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;

          sizes[i] = 1.4 + Math.pow(Math.random(), 3) * 7.0;
          twinkles[i] = Math.random();

          // Stellar temperature → color
          const t = Math.random();
          let cr: number, cg: number, cb: number;
          if (t < 0.55) {
            // Blue-white
            cr = 0.8 + Math.random() * 0.2;
            cg = 0.85 + Math.random() * 0.15;
            cb = 1.0;
          } else if (t < 0.8) {
            // Warm yellow-orange
            cr = 1.0;
            cg = 0.85 + Math.random() * 0.1;
            cb = 0.7 + Math.random() * 0.1;
          } else if (t < 0.93) {
            // Red-orange
            cr = 1.0;
            cg = 0.55 + Math.random() * 0.2;
            cb = 0.4 + Math.random() * 0.2;
          } else {
            // Rare cyan
            cr = 0.65;
            cg = 0.9;
            cb = 1.0;
          }
          colors[i * 3] = cr;
          colors[i * 3 + 1] = cg;
          colors[i * 3 + 2] = cb;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geo.setAttribute('aTwinkle', new THREE.BufferAttribute(twinkles, 1));
        geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.ShaderMaterial({
          vertexShader: STAR_VERTEX,
          fragmentShader: STAR_FRAGMENT,
          uniforms: {
            uTime: { value: 0 },
            uPixelRatio: { value: renderer.getPixelRatio() },
            uWarp: { value: 0 },
          },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

        const points = new THREE.Points(geo, mat);
        scene.add(points);
        starsRef.current = { points, material: mat };
      }

      // ============================================================
      // GALAXY SPIRAL (distant background)
      // ============================================================
      {
        const count = isMobile ? 8000 : 18000;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const colors = new Float32Array(count * 3);

        const arms = 4;
        const armSeparation = (Math.PI * 2) / arms;
        const twistAmount = 2.8;

        const insideColor = new THREE.Color(0xffb070);
        const midColor = new THREE.Color(0xe07a9b);
        const outsideColor = new THREE.Color(0x5a8fff);

        for (let i = 0; i < count; i++) {
          // Local galaxy coords centered at origin — position/rotation of
          // the Points object will place and tilt it afterwards.
          const radius = Math.pow(Math.random(), 2) * 260 + 25;
          const armIdx = i % arms;
          const branchAngle = armIdx * armSeparation;
          const spinAngle = (radius / 90) * twistAmount;

          const randomness = Math.pow(Math.random(), 3) * 40 * (radius / 180);
          const rx = (Math.random() - 0.5) * randomness;
          const ry = (Math.random() - 0.5) * randomness * 0.35;
          const rz = (Math.random() - 0.5) * randomness;

          const angle = branchAngle + spinAngle;
          const x = Math.cos(angle) * radius + rx;
          const y = ry;
          const z = Math.sin(angle) * radius + rz;

          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;

          sizes[i] = 1.5 + Math.random() * 3.5;

          // 3-color gradient: warm core → pink mid → cool edge
          const mixVal = Math.min(1, radius / 350);
          const c =
            mixVal < 0.5
              ? insideColor.clone().lerp(midColor, mixVal * 2)
              : midColor.clone().lerp(outsideColor, (mixVal - 0.5) * 2);
          colors[i * 3] = c.r;
          colors[i * 3 + 1] = c.g;
          colors[i * 3 + 2] = c.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.ShaderMaterial({
          vertexShader: GALAXY_VERTEX,
          fragmentShader: GALAXY_FRAGMENT,
          uniforms: {
            uPixelRatio: { value: renderer.getPixelRatio() },
          },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

        const points = new THREE.Points(geo, mat);
        // Place galaxy center BEHIND the scene, then rotate so we see the
        // spiral face at ~40° tilt. On mobile push it further back so it
        // reads as a smaller, less busy background element.
        points.position.set(0, 0, isMobile ? -620 : -450);
        points.rotation.x = -0.7;
        points.rotation.z = 0.25;
        points.rotation.y = 0.15;
        scene.add(points);
        galaxyRef.current = points;
      }

      // ============================================================
      // POST-PROCESSING (bloom + flash)
      // ============================================================
      const composer = new EffectComposer(renderer);
      composer.setPixelRatio(renderer.getPixelRatio());
      composer.setSize(width, height);

      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      const bloom = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        0.55, // strength
        0.85, // radius
        0.25  // threshold
      );
      composer.addPass(bloom);
      bloomPassRef.current = bloom;

      const flashPass = new ShaderPass(FLASH_SHADER);
      composer.addPass(flashPass);
      flashPassRef.current = flashPass;

      composerRef.current = composer;
    }, []);

    // =================================================================
    // RENDER LOOP
    // =================================================================
    const renderFrame = useCallback(() => {
      const renderer = rendererRef.current;
      const composer = composerRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      if (!renderer || !composer || !scene || !camera) return;

      const state = stateRef.current;
      state.time += 1 / 60;

      // ---- Ambient camera choreography ----
      // Long slow 3D sway built from three irrational-frequency sinusoids,
      // so it never visibly repeats. Main component period ~74s. This
      // produces a cinematic drift across many angles over a minute+.
      state.camX += (state.targetCamX - state.camX) * 0.04;
      state.camY += (state.targetCamY - state.camY) * 0.04;

      const phase = state.time;
      const m = state.ambientMul;
      const ambX =
        Math.sin(phase * 0.085) * 7 * m +
        Math.cos(phase * 0.19) * 2.2 * m;
      const ambY =
        Math.sin(phase * 0.062) * 2.8 * m +
        Math.cos(phase * 0.14) * 1.1 * m;
      const ambZ = Math.cos(phase * 0.073) * 4.5 * m;

      camera.position.x = state.camX * 1.5 + ambX;
      camera.position.y = state.camY * 1.0 + ambY;
      camera.position.z = state.cameraZ + ambZ - state.baseZ;
      camera.lookAt(0, 0, 0);

      // ---- Slow sun rotation ----
      // Rotates the shared light direction around the Y axis over ~8 min,
      // so the terminator on each planet walks slowly across their surface.
      // Over a ~60 s dwell, the lit side shifts ~45° — enough to notice.
      if (lightDirRef.current && lightDirBaseRef.current) {
        const sunAngle = phase * 0.013; // radians per second
        const base = lightDirBaseRef.current;
        const rotated = lightDirRef.current;
        const c = Math.cos(sunAngle);
        const s = Math.sin(sunAngle);
        // Rotate around Y: (x,z) plane spins, y stays
        rotated.x = base.x * c - base.z * s;
        rotated.y = base.y;
        rotated.z = base.x * s + base.z * c;
        rotated.normalize();
      }

      // Entrance fade
      if (state.revealing) {
        state.globalAlpha = Math.min(1, state.globalAlpha + 1 / 120);
        if (state.globalAlpha >= 1) {
          state.revealing = false;
          if (!readyFiredRef.current) {
            readyFiredRef.current = true;
            onReady?.();
          }
        }
      }

      // Planets
      for (const p of planetsRef.current) {
        p.mesh.rotation.y += p.rotationSpeed / 60;
        p.material.uniforms.uCameraPosW.value.copy(camera.position);
        p.atmosphereMaterial.uniforms.uCameraPosW.value.copy(camera.position);
        p.material.uniforms.uSurfaceRotation.value =
          -p.mesh.rotation.y / (Math.PI * 2);
        if (p.cloudRotationSpeed > 0) {
          p.material.uniforms.uCloudRotation.value =
            -(p.mesh.rotation.y + state.time * p.cloudRotationSpeed) /
            (Math.PI * 2);
        }
      }

      // Stars — twinkle + warp
      if (starsRef.current) {
        starsRef.current.material.uniforms.uTime.value = state.time;
        starsRef.current.material.uniforms.uWarp.value = state.warp;
        // Slow rotation of entire starfield for ambient motion
        starsRef.current.points.rotation.y += 0.0006;
      }
      if (galaxyRef.current) {
        galaxyRef.current.rotation.y += 0.0004;
      }

      // Supernova bursts — radial particles fly outward from click point,
      // flare at the centre scales up and fades out, and a brief bloom boost
      // pulses the whole scene.
      const now = performance.now();
      const dt = 1 / 60;
      burstsRef.current = burstsRef.current.filter((b) => {
        const t = (now - b.start) / b.life;
        if (t >= 1) {
          scene.remove(b.particles);
          scene.remove(b.flare);
          b.particles.geometry.dispose();
          b.particleMat.dispose();
          b.flare.geometry.dispose();
          b.flareMat.dispose();
          return false;
        }

        // Advance each particle by its velocity (with mild drag)
        const posAttr = b.particles.geometry.getAttribute(
          'position'
        ) as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        const drag = 0.955;
        const n = arr.length / 3;
        for (let i = 0; i < n; i++) {
          arr[i * 3] += b.velocities[i * 3] * dt;
          arr[i * 3 + 1] += b.velocities[i * 3 + 1] * dt;
          arr[i * 3 + 2] += b.velocities[i * 3 + 2] * dt;
          b.velocities[i * 3] *= drag;
          b.velocities[i * 3 + 1] *= drag;
          b.velocities[i * 3 + 2] *= drag;
        }
        posAttr.needsUpdate = true;

        // Fade particles with ease-out
        b.particleMat.uniforms.uOpacity.value = Math.pow(1 - t, 1.3);

        // Flare: scale up sharp, opacity fades fast
        const flareScale = 1 + Math.pow(t, 0.6) * 3.8;
        b.flare.scale.set(flareScale, flareScale, flareScale);
        b.flareMat.opacity = Math.pow(1 - t, 2) * 0.95;

        return true;
      });

      // Warp effect on stars: accelerate camera forward
      if (state.warp > 0.01) {
        state.baseZ = state.warp * state.warp * 60;
      } else {
        state.baseZ *= 0.9;
      }

      // Flash uniform
      if (flashPassRef.current) {
        flashPassRef.current.uniforms.uFlash.value = state.flashAlpha;
      }

      // Bloom boost decays over time
      state.bloomBoost *= 0.94;
      if (bloomPassRef.current) {
        bloomPassRef.current.strength =
          (0.55 + state.bloomBoost) * state.globalAlpha;
      }

      composer.render();
      rafRef.current = requestAnimationFrame(renderFrame);
    }, [onReady]);

    // =================================================================
    // RESIZE
    // =================================================================
    const resize = useCallback(() => {
      const container = containerRef.current;
      const renderer = rendererRef.current;
      const camera = cameraRef.current;
      const composer = composerRef.current;
      if (!container || !renderer || !camera || !composer) return;
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      composer.setSize(rect.width, rect.height);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    }, []);

    // =================================================================
    // EVENTS
    // =================================================================
    useEffect(() => {
      setup();
      rafRef.current = requestAnimationFrame(renderFrame);

      const container = containerRef.current!;

      const onResize = () => resize();
      window.addEventListener('resize', onResize);

      const handlePointer = (clientX: number, clientY: number) => {
        const rect = container.getBoundingClientRect();
        const nx = (clientX - rect.left) / rect.width - 0.5;
        const ny = (clientY - rect.top) / rect.height - 0.5;
        stateRef.current.targetCamX = nx * 3.5;
        stateRef.current.targetCamY = -ny * 2.5;
      };

      const onMouseMove = (e: MouseEvent) => handlePointer(e.clientX, e.clientY);
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches[0])
          handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      };

      const onClick = (e: MouseEvent) => {
        if (isWarpingRef.current) return;
        const scene = sceneRef.current;
        const camera = cameraRef.current;
        const renderer = rendererRef.current;
        if (!scene || !camera || !renderer) return;

        // Unproject click into 3D at a fixed distance in front of camera
        const rect = container.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        const ndc = new THREE.Vector3(nx, ny, 0.5);
        ndc.unproject(camera);
        const dir = ndc.sub(camera.position).normalize();
        const dist = 10;
        const pos = camera.position.clone().add(dir.multiplyScalar(dist));

        // ---- Central flare (additive glowing sphere) ----
        const flareGeo = new THREE.SphereGeometry(0.35, 24, 24);
        const flareMat = new THREE.MeshBasicMaterial({
          color: 0xffd9a0,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const flare = new THREE.Mesh(flareGeo, flareMat);
        flare.position.copy(pos);
        scene.add(flare);

        // ---- Radial particle burst ----
        const N = 30;
        const positions = new Float32Array(N * 3);
        const velocities = new Float32Array(N * 3);
        const colors = new Float32Array(N * 3);
        const sizes = new Float32Array(N);
        for (let i = 0; i < N; i++) {
          positions[i * 3] = pos.x;
          positions[i * 3 + 1] = pos.y;
          positions[i * 3 + 2] = pos.z;

          // Random direction on a sphere, flattened slightly in z
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const speed = 5 + Math.random() * 7;
          velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
          velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
          velocities[i * 3 + 2] = Math.cos(phi) * speed * 0.45;

          // Warm gold/orange palette
          colors[i * 3] = 1.0;
          colors[i * 3 + 1] = 0.85 + Math.random() * 0.15;
          colors[i * 3 + 2] = 0.55 + Math.random() * 0.35;

          sizes[i] = 6 + Math.random() * 10;
        }

        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
        pGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

        const pMat = new THREE.ShaderMaterial({
          vertexShader: /* glsl */ `
            attribute vec3 aColor;
            attribute float aSize;
            uniform float uPixelRatio;
            varying vec3 vColor;
            void main() {
              vColor = aColor;
              vec4 mv = modelViewMatrix * vec4(position, 1.0);
              float depth = max(-mv.z, 1.0);
              gl_PointSize = max(2.0, aSize * uPixelRatio * (80.0 / depth));
              gl_Position = projectionMatrix * mv;
            }
          `,
          fragmentShader: /* glsl */ `
            precision highp float;
            uniform float uOpacity;
            varying vec3 vColor;
            void main() {
              vec2 p = gl_PointCoord - vec2(0.5);
              float d = length(p);
              float core = smoothstep(0.5, 0.0, d);
              float halo = smoothstep(0.5, 0.2, d) * 0.5;
              float a = (core + halo) * uOpacity;
              if (a < 0.01) discard;
              gl_FragColor = vec4(vColor, a);
            }
          `,
          uniforms: {
            uOpacity: { value: 1.0 },
            uPixelRatio: { value: renderer.getPixelRatio() },
          },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        burstsRef.current.push({
          particles,
          particleMat: pMat,
          flare,
          flareMat,
          velocities,
          start: performance.now(),
          life: 1300,
        });

        // Brief bloom pulse so the whole scene reacts
        stateRef.current.bloomBoost = Math.min(
          1.4,
          stateRef.current.bloomBoost + 0.9
        );
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      container.addEventListener('click', onClick);

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
        container.removeEventListener('click', onClick);

        // Dispose GPU resources
        for (const p of planetsRef.current) {
          p.mesh.geometry.dispose();
          p.material.dispose();
          p.atmosphere.geometry.dispose();
          p.atmosphereMaterial.dispose();
          if (p.rings) {
            p.rings.geometry.dispose();
            (p.rings.material as THREE.Material).dispose();
          }
        }
        starsRef.current?.points.geometry.dispose();
        starsRef.current?.material.dispose();
        galaxyRef.current?.geometry.dispose();
        (galaxyRef.current?.material as THREE.Material | undefined)?.dispose();
        for (const b of burstsRef.current) {
          b.particles.geometry.dispose();
          b.particleMat.dispose();
          b.flare.geometry.dispose();
          b.flareMat.dispose();
        }
        rendererRef.current?.dispose();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // =================================================================
    // IMPERATIVE HANDLE
    // =================================================================
    useImperativeHandle(
      ref,
      () => ({
        warp: () =>
          new Promise<void>((resolve) => {
            if (isWarpingRef.current) {
              resolve();
              return;
            }
            isWarpingRef.current = true;

            const accelDuration = 900;
            const flashDuration = 220;
            const start = performance.now();

            const tickAccel = () => {
              const elapsed = performance.now() - start;
              const t = Math.min(1, elapsed / accelDuration);
              const eased = t * t * t * t; // ease-in-quart
              stateRef.current.warp = eased;

              if (t < 1) {
                requestAnimationFrame(tickAccel);
              } else {
                const flashStart = performance.now();
                const tickFlash = () => {
                  const fe = performance.now() - flashStart;
                  const ft = Math.min(1, fe / flashDuration);
                  stateRef.current.flashAlpha =
                    ft < 0.5 ? ft * 2 : 1 - (ft - 0.5) * 2;
                  if (ft < 1) {
                    requestAnimationFrame(tickFlash);
                  } else {
                    stateRef.current.flashAlpha = 0;
                    resolve();
                  }
                };
                tickFlash();
              }
            };
            tickAccel();
          }),
        getProgress: () => stateRef.current.globalAlpha,
      }),
      []
    );

    return (
      <div
        ref={containerRef}
        className={className}
        style={{ touchAction: 'none', cursor: 'crosshair' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          aria-hidden="true"
        />
      </div>
    );
  }
);
