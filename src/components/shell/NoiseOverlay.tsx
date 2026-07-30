'use client';

import { useEffect, useRef } from 'react';
import { visual } from '@/config/visual';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useExperience } from '@/stores/experienceStore';

/**
 * The screen grain — a living TV static riding ABOVE everything as the screen's own
 * interference. A handful of pre-rendered noise tiles shuffled at ~12fps through a canvas
 * pattern — no per-pixel work per frame, no WebGL. Every few seconds the old monitor
 * hiccups: horizontal bands tear sideways for a few frames, then the picture recovers.
 * Reduced-motion and the static quality tier get a single still frame (no RAF at all).
 */
export function NoiseOverlay() {
  const reduced = useReducedMotion();
  const isStaticTier = useExperience((s) => s.quality === 'static');
  const live = !reduced && !isStaticTier;

  return (
    <div
      aria-hidden
      data-noise
      className="pointer-events-none fixed inset-0 z-[70] mix-blend-plus-lighter"
      style={{ opacity: 'var(--grain-opacity)' }}
    >
      <StaticCanvas live={live} />
    </div>
  );
}

function StaticCanvas({ live }: { live: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cfg = visual.staticNoise;

    // Pre-render the noise tiles once — the animation is just pattern swaps.
    const tiles: CanvasPattern[] = [];
    for (let f = 0; f < cfg.frames; f += 1) {
      const tile = document.createElement('canvas');
      tile.width = cfg.tileSize;
      tile.height = cfg.tileSize;
      const tctx = tile.getContext('2d');
      if (!tctx) continue;
      const img = tctx.createImageData(cfg.tileSize, cfg.tileSize);
      const px = img.data;
      for (let i = 0; i < px.length; i += 4) {
        // Squared random biases the grain dark with sparse bright speckles — TV static,
        // not white fog.
        const r = Math.random();
        const v = r * r * cfg.amplitude + (Math.random() < 0.015 ? 90 : 0);
        px[i] = v;
        px[i + 1] = v;
        px[i + 2] = v;
        px[i + 3] = 255;
      }
      tctx.putImageData(img, 0, 0);
      const pattern = ctx.createPattern(tile, 'repeat');
      if (pattern) tiles.push(pattern);
    }
    if (tiles.length === 0) return;

    const paint = () => {
      const tile = tiles[Math.floor(Math.random() * tiles.length)];
      if (!tile) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = tile;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const fit = () => {
      canvas.width = Math.ceil(window.innerWidth * cfg.resolutionScale);
      canvas.height = Math.ceil(window.innerHeight * cfg.resolutionScale);
      if (!live) paint();
    };
    fit();
    window.addEventListener('resize', fit);

    // Static tiers: one still frame, zero per-frame work.
    if (!live) {
      paint();
      return () => window.removeEventListener('resize', fit);
    }

    const frameInterval = 1000 / cfg.fps;
    const nextGlitchAt = () =>
      performance.now() +
      (cfg.glitch.minDelaySec + Math.random() * (cfg.glitch.maxDelaySec - cfg.glitch.minDelaySec)) * 1000;

    let last = 0;
    let glitchAt = nextGlitchAt();
    let glitchUntil = 0;
    let raf = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < frameInterval) return;
      last = now;

      const { width: w, height: h } = canvas;
      paint();

      if (now >= glitchAt) {
        glitchUntil =
          now + cfg.glitch.minDurationMs + Math.random() * (cfg.glitch.maxDurationMs - cfg.glitch.minDurationMs);
        glitchAt = nextGlitchAt();
      }
      if (now < glitchUntil) {
        // The hiccup: a few horizontal bands tear sideways, plus one hot scanline.
        for (let s = 0; s < cfg.glitch.slices; s += 1) {
          const bandY = Math.random() * h;
          const bandH = 2 + Math.random() * h * 0.045;
          const shift = (Math.random() * 2 - 1) * cfg.glitch.maxSliceShift * w;
          const grab = ctx.getImageData(0, bandY, w, Math.max(1, Math.floor(bandH)));
          ctx.putImageData(grab, shift, bandY);
        }
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(0, Math.random() * h, w, 1.5);
      }
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    };
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', fit);
    };
  }, [live]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
