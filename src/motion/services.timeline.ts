import { gsap } from '@/lib/gsap';
import { motion } from '@/config/motion';
import type { TimelineOptions } from '@/motion/types';

/**
 * Section 02 — SERVICES. An editorial list, not a card grid. The section is born from
 * the centre (tunnel entry, no pin: the list is long and must stay scrollable), then
 * each row files in with a scrubbed stagger as the visitor travels through it. Row hover
 * expansion is CSS — GSAP only owns the arrival.
 *
 * Expected DOM (inside `scope`):
 *   [data-services-stage]   the <section>
 *   [data-services-header]  eyebrow + title + subtitle block
 *   [data-service-row]      one <li> per service
 *   [data-services-cta]     "view all services" link
 */
export function servicesTimeline(
  scope: HTMLElement,
  { reduced = false }: TimelineOptions = {},
): gsap.core.Timeline | null {
  const q = gsap.utils.selector(scope);

  if (reduced) {
    gsap.set(q('[data-services-header], [data-service-row], [data-services-cta]'), {
      autoAlpha: 1,
      clearProps: 'transform,filter',
    });
    return null;
  }

  const enter = motion.tunnel.enter;

  // The header arrives from depth as the section reaches the stage.
  gsap.fromTo(
    q('[data-services-header]'),
    { autoAlpha: 0, scale: enter.scale, filter: `blur(${enter.blur}px)` },
    {
      autoAlpha: 1,
      scale: 1,
      filter: 'blur(0px)',
      ease: 'none',
      scrollTrigger: {
        trigger: (q('[data-services-stage]')[0] as HTMLElement) ?? scope,
        start: 'top 80%',
        end: 'top 30%',
        scrub: motion.scroll.scrub,
      },
    },
  );

  // The rows: one scrubbed reveal across the list, so travelling through the section
  // IS the animation. Reversible by construction.
  const rows = q('[data-service-row]');
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: (q('[data-services-list]')[0] as HTMLElement) ?? scope,
      start: 'top 85%',
      end: 'bottom 65%',
      scrub: motion.scroll.scrub,
    },
  });
  tl.fromTo(
    rows,
    { autoAlpha: 0, scale: 0.97, filter: 'blur(6px)' },
    { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.3, stagger: 0.12 },
    0,
  );
  tl.fromTo(q('[data-services-cta]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, '>-0.1');

  return tl;
}
