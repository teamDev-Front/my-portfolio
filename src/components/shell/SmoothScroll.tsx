'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap';
import { lenisRef } from '@/lib/lenisRef';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useExperience } from '@/stores/experienceStore';

/**
 * Lenis smooth scroll, synced to the GSAP ticker + ScrollTrigger. Disabled entirely under
 * reduced-motion so native scrolling, anchor links and "find on page" behave normally.
 * Pauses while an overlay owns the viewport (project detail open). The instance is shared
 * through lib/lenisRef so interactions ("back to top") ride the same pipeline.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const overlayOpen = useExperience((s) => s.activeProjectSlug !== null);
  const menuOpen = useExperience((s) => s.menuOpen);

  useEffect(() => {
    if (reduced) return;
    registerGsap();

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisRef.set(lenis);
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.set(null);
    };
  }, [reduced]);

  useEffect(() => {
    const lenis = lenisRef.get();
    if (!lenis) return;
    if (overlayOpen || menuOpen) lenis.stop();
    else lenis.start();
  }, [overlayOpen, menuOpen]);

  return <>{children}</>;
}
