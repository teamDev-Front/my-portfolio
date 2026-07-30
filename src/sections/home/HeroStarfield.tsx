'use client';

import { useEffect, useRef } from 'react';
import { visual } from '@/config/visual';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useExperience } from '@/stores/experienceStore';

interface Star {
  x: number;
  y: number;
  /** Depth 0 (far) .. 1 (near) — drives size, speed and parallax weight. */
  z: number;
  r: number;
  /** Twinkle phase offset. */
  ph: number;
  red: boolean;
}

/**
 * The universe, demoted from gate to atmosphere: a Canvas 2D starfield behind the hero.
 * A few hundred points drifting slowly with depth-weighted speed + twinkle — no WebGL,
 * no Three.js, ~zero cost at 30fps. Still frame under reduced-motion / static tier.
 */
export function HeroStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const quality = useExperience((s) => s.quality);
  const live = !reduced && quality !== 'static';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cfg = visual.starfield;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let stars: Star[] = [];
    let w = 0;
    let h = 0;

    const seed = () => {
      const count = Math.min(cfg.maxStars, Math.round(((w * h) / 10000) * cfg.density));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        r: 0.4 + Math.random() * 1.1,
        ph: Math.random() * Math.PI * 2,
        red: Math.random() < 0.08,
      }));
    };

    const paint = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const depth = 0.35 + s.z * 0.65;
        const tw = live ? 0.75 + 0.25 * Math.sin(t * 0.0011 + s.ph) : 1;
        const a = cfg.baseAlpha * depth * tw;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * depth * dpr, 0, Math.PI * 2);
        ctx.fillStyle = s.red ? `rgba(248,113,113,${a * 0.8})` : `rgba(244,244,246,${a})`;
        ctx.fill();
      }
    };

    const fit = () => {
      w = canvas.width = Math.round(canvas.offsetWidth * dpr);
      h = canvas.height = Math.round(canvas.offsetHeight * dpr);
      seed();
      paint(0);
    };
    fit();
    window.addEventListener('resize', fit);

    if (!live) {
      return () => window.removeEventListener('resize', fit);
    }

    // Slow travelling drift, depth-weighted — 30fps is invisible at these speeds.
    let raf = 0;
    let last = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(now - last, 100);
      if (dt < 33) return;
      last = now;
      const v = (cfg.parallaxPx / 1000) * dpr;
      for (const s of stars) {
        s.x -= v * (0.3 + s.z) * dt * 0.06;
        s.y += v * (0.3 + s.z) * dt * 0.022;
        if (s.x < -2) s.x = w + 2;
        if (s.y > h + 2) s.y = -2;
      }
      paint(now);
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

  return (
    <canvas
      ref={canvasRef}
      data-hero-stars
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  );
}
