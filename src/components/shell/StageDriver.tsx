'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap';
import { experienceActions, experienceStore, type JourneyStage } from '@/stores/experienceStore';

/**
 * Watches the page's [data-stage] markers and drives the SEMANTIC journey state
 * (store.stage) — which in turn drives the BackgroundWash and the HUD readouts.
 *
 * ONE boundary scan instead of per-element toggles: pinned beats stretch a marker's
 * scroll footprint far beyond its layout box (pin spacers), and instant jumps can skip
 * a toggle window entirely — so on every scroll update the stage is simply "the last
 * boundary whose top crossed the 55% line". Reversible and jump-proof by construction.
 *
 * data-stage-lead (in viewport-heights) fires a boundary EARLY, so the next section's
 * wash crosses under the outgoing beat before the content arrives (seam lead).
 */
export function StageDriver() {
  const pathname = usePathname();

  useEffect(() => {
    registerGsap();

    let bounds: { y: number; stage: JourneyStage }[] = [];

    const measure = () => {
      bounds = Array.from(document.querySelectorAll<HTMLElement>('[data-stage]'))
        .map((el) => {
          const stage = el.dataset.stage as JourneyStage;
          // A pinned beat's real position is its pin-spacer's (layout stays put there).
          const anchor = (el.closest('.pin-spacer') as HTMLElement | null) ?? el;
          const lead = Number(el.dataset.stageLead ?? 0) || 0;
          return {
            y: anchor.getBoundingClientRect().top + window.scrollY - lead * window.innerHeight,
            stage,
          };
        })
        .sort((a, b) => a.y - b.y);
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onRefresh: measure,
        onUpdate: (self) => {
          if (bounds.length === 0) return;
          const line = self.scroll() + window.innerHeight * 0.55;
          let stage: JourneyStage | undefined;
          for (const b of bounds) {
            if (b.y <= line) stage = b.stage;
            else break;
          }
          if (stage && experienceStore.get().stage !== stage) {
            experienceActions.setStage(stage);
          }
        },
      });
    });

    measure();

    return () => ctx.revert();
  }, [pathname]);

  return null;
}
