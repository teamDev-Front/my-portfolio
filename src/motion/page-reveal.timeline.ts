import { gsap, ScrollTrigger } from '@/lib/gsap';
import type { TimelineOptions } from '@/motion/types';

/**
 * Internal-page reveal grammar: content NEVER slides in from below — every [data-reveal]
 * element materialises IN PLACE from depth (small + soft → present), the same tunnel rule
 * the homepage follows. One trigger per element, played on entry and reversed on exit
 * above the viewport, so scrolling back re-runs the materialisation. No pinning here:
 * internal pages are for reading.
 */
export function pageRevealTimeline(scope: HTMLElement, { reduced = false }: TimelineOptions = {}): null {
  const items = Array.from(scope.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (items.length === 0) return null;

  if (reduced) {
    gsap.set(items, { autoAlpha: 1, clearProps: 'transform,filter' });
    return null;
  }

  for (const el of items) {
    gsap.fromTo(
      el,
      { autoAlpha: 0, scale: 0.94, filter: 'blur(7px)', transformOrigin: '50% 50%' },
      {
        autoAlpha: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      },
    );
  }
  ScrollTrigger.refresh();
  return null;
}
