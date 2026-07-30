'use client';

import { useRef } from 'react';
import { gsap, registerGsap } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

/**
 * Runs a GSAP setup function inside a scoped gsap.context() and reverts it on unmount.
 * This is the ONLY sanctioned way components attach animations — it prevents orphaned
 * tweens and ScrollTriggers leaking across route changes.
 *
 * @param scope  ref to the root element the animations are scoped to.
 * @param setup  function that builds the animations (called inside the context).
 * @param deps   re-run dependencies (default: run once).
 */
export function useGsapContext<T extends HTMLElement>(
  scope: React.RefObject<T | null>,
  setup: (ctx: { self: gsap.Context }) => void,
  deps: React.DependencyList = [],
): void {
  // The latest setup closure is stashed in a layout effect (never during render, which
  // would be a ref write mid-render) so re-running is driven purely by `deps` — a section
  // re-rendering must not rebuild its timelines.
  const setupRef = useRef(setup);
  useIsomorphicLayoutEffect(() => {
    setupRef.current = setup;
  });

  useIsomorphicLayoutEffect(() => {
    registerGsap();
    if (!scope.current) return;
    const ctx = gsap.context((self) => setupRef.current({ self }), scope);
    return () => ctx.revert();
  }, deps);
}
