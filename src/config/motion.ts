/**
 * Motion language — single source for durations/easings/distances shared by every GSAP
 * timeline and by CSS. Scrubbed beats are tied to scroll distance, not ms.
 * Cosmetic values are PARAMETERS: tune here, never rebuild a timeline.
 */
export const motion = {
  ease: {
    /** Primary easing for played (non-scrubbed) moments. */
    out: 'power3.out',
    /** Signature curve for UI reveals — token `--ease-hcs` in CSS. */
    hcs: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },

  /** Durations in seconds (played timelines only — scrubbed ones use scroll distance). */
  duration: {
    micro: 0.16, // hover, focus, chip states (CSS-first)
    ui: 0.32, // overlays, menu
    narrative: 0.9, // word reveals, section labels
    intro: 1.2, // the on-load hero intro
  },

  /** ScrollTrigger defaults for the homepage journey. */
  scroll: {
    /** Scrub smoothing (seconds of catch-up). */
    scrub: 0.8,
    /** How long each pinned beat holds, in viewport-heights. */
    pinLength: {
      about: 1.3,
      results: 1.8,
    },
    /** Mobile pins are shorter — travel is precious on touch. */
    pinLengthMobile: {
      about: 0.9,
      results: 1.4,
    },
  },

  /**
   * The Z-axis vocabulary (the page doesn't scroll down — it travels forward).
   * Entries are born small + soft at depth; exits grow past the camera.
   */
  tunnel: {
    enter: { scale: 0.9, blur: 8 },
    enterFar: { scale: 0.78, blur: 9 },
    exit: { scale: 1.65, blur: 12 },
    exitSoft: { scale: 1.14, blur: 10 },
  },

  /**
   * Portfolio queue physics (living marquee): the row breathes forward on its own,
   * scroll VELOCITY accelerates it, and it can be dragged with manual inertia.
   * Zeroing autoSpeed/velocityGain/dragGain restores a scrub-only choreography.
   */
  workQueue: {
    /** Idle breath, in queue-phase units/s (1 = one full slot advance). */
    autoSpeed: 0.022,
    /** Extra phase/s per px/s of scroll velocity. Kept LOW — the beat is pinned. */
    velocityGain: 0.00004,
    /** Cap on the scroll-fed acceleration (phase/s). */
    maxBoost: 0.2,
    /** Phase per px of horizontal drag. */
    dragGain: 0.0026,
    /** 1/s exponential decay of thrown drag velocity. */
    inertiaDecay: 2.4,
    /** Scrub smoothing for the queue only — heavier than the global value so the cards
     *  glide instead of snapping to the scroll position. */
    scrub: 1.6,
    /** Pin length of the portfolio beat, in viewport-heights. */
    pinLength: 3.2,
    pinLengthMobile: 2.2,
  },

  /** Results metrics count 0→value with the scrub across this pin. */
  metrics: {
    countPortion: 0.42, // fraction of the pin spent counting
  },
} as const;
