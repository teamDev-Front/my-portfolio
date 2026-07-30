import { gsap } from '@/lib/gsap';
import { motion } from '@/config/motion';
import type { TimelineOptions } from '@/motion/types';

/**
 * Section 05 — CONTACT. The final CTA arrives through the tunnel as the largest
 * typographic moment on the page: the words are born deep and small and settle at full
 * scale as the visitor arrives. No pin — the footer must follow immediately, so this is
 * a scrubbed entry across the section's own travel.
 *
 * Expected DOM (inside `scope`):
 *   [data-contact-stage]   the <section>
 *   [data-contact-eyebrow] mono label
 *   [data-contact-word]    one span per headline word
 *   [data-contact-sub]     supporting line
 *   [data-contact-cta]     the CTA links
 */
export function contactTimeline(
  scope: HTMLElement,
  { reduced = false }: TimelineOptions = {},
): gsap.core.Timeline | null {
  const q = gsap.utils.selector(scope);

  if (reduced) {
    gsap.set(q('[data-contact-eyebrow], [data-contact-word], [data-contact-sub], [data-contact-cta]'), {
      autoAlpha: 1,
      clearProps: 'transform,filter',
    });
    return null;
  }

  const enter = motion.tunnel.enterFar;

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: (q('[data-contact-stage]')[0] as HTMLElement) ?? scope,
      start: 'top 90%',
      end: 'center 45%',
      scrub: motion.scroll.scrub,
    },
  });

  tl.fromTo(q('[data-contact-eyebrow]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0);
  tl.fromTo(
    q('[data-contact-word]'),
    { autoAlpha: 0, scale: enter.scale, filter: `blur(${enter.blur}px)` },
    { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.5, stagger: 0.07 },
    0.05,
  );
  tl.fromTo(
    q('[data-contact-sub]'),
    { autoAlpha: 0, scale: 0.95 },
    { autoAlpha: 1, scale: 1, duration: 0.3 },
    0.45,
  );
  tl.fromTo(
    q('[data-contact-cta]'),
    { autoAlpha: 0, scale: 0.95 },
    { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 0.08 },
    0.55,
  );

  return tl;
}
