import type { JourneyStage } from '@/stores/experienceStore';

/**
 * Cosmetic parameters — HUD opacity, starfield, wash recipes. They are PARAMETERS,
 * NOT BLOCKERS: tune here, never rebuild the experience. CSS-facing twins of some values
 * live in globals.css (--hud-opacity, --line-alpha) — keep in sync.
 */
export const visual = {
  /** HUD / terminal chrome. */
  hud: {
    opacity: 0.62,
    lineAlpha: 0.1,
    pageMarginPx: 24,
  },

  /** Hero starfield (Canvas 2D — the universe survives as atmosphere, not a gate). */
  starfield: {
    /** Stars per 10_000 px² of viewport. */
    density: 0.9,
    maxStars: 420,
    /** Parallax drift amplitude in px for the deepest layer. */
    parallaxPx: 26,
    /** Twinkle probability per star per second. */
    twinkle: 0.28,
    baseAlpha: 0.65,
  },

  /**
   * The section washes — a deep red field breathing behind each chapter, crossfaded by
   * opacity (1600ms) with a seam lead: the next section's colour crosses ~1 viewport
   * before its content arrives. Pure CSS gradients — cheap, reversible, reduced-motion ok.
   */
  washes: {
    hero: 'radial-gradient(120% 85% at 50% 110%, rgb(var(--c-red) / 0.10), rgb(var(--c-red-deep) / 0.05) 45%, transparent 75%)',
    about:
      'radial-gradient(110% 80% at 12% 30%, rgb(var(--c-red-deep) / 0.32), rgb(var(--c-red-deep) / 0.08) 50%, transparent 78%)',
    services:
      'radial-gradient(130% 90% at 88% 18%, rgb(var(--c-red-deep) / 0.26), rgb(var(--c-red-deep) / 0.06) 48%, transparent 76%)',
    portfolio:
      'radial-gradient(140% 95% at 50% 0%, rgb(var(--c-red-deep) / 0.38), rgb(var(--c-red-deep) / 0.1) 46%, transparent 78%)',
    results:
      'radial-gradient(120% 85% at 14% 78%, rgb(var(--c-red-deep) / 0.3), rgb(var(--c-red-deep) / 0.08) 50%, transparent 76%)',
    contact:
      'radial-gradient(150% 100% at 50% 100%, rgb(var(--c-red) / 0.30), rgb(var(--c-red-deep) / 0.12) 45%, transparent 80%)',
    footer: null,
    page: null,
  } satisfies Record<JourneyStage, string | null>,
} as const;
