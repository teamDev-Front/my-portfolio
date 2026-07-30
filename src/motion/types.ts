/** Options every timeline factory accepts. */
export interface TimelineOptions {
  /** prefers-reduced-motion — the factory must return a calm/no-op variant. */
  reduced?: boolean;
  /** Coarse-pointer / small viewport — shorter pins, drag replaces hover. */
  mobile?: boolean;
}

/**
 * Every GSAP timeline lives in src/motion, one file per section (`*.timeline.ts`),
 * with signature `(scope, options) => gsap.core.Timeline | null`. Components NEVER
 * call gsap.to() directly — they run a factory via useGsapContext. Markup and motion
 * are contracted through data-* attributes documented in each factory's JSDoc.
 *
 * Rules:
 * - animate only transform / opacity (+ filter blur for the tunnel vocabulary);
 * - scrubbed beats must be reversible on scroll-up;
 * - reduced === true → gsap.set final states and return null.
 */
export type TimelineFactory = (
  scope: HTMLElement,
  options?: TimelineOptions,
) => gsap.core.Timeline | null;
