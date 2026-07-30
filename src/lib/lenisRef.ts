import type Lenis from 'lenis';

/**
 * Module-level handle to the single Lenis instance (owned by SmoothScroll) so interaction
 * code — e.g. "back to top", anchor links — drives programmatic scrolls through the same
 * smooth pipeline instead of fighting it.
 */
let instance: Lenis | null = null;

export const lenisRef = {
  set(lenis: Lenis | null): void {
    instance = lenis;
  },
  get(): Lenis | null {
    return instance;
  },
};
