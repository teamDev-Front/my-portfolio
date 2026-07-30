import { gsap } from '@/lib/gsap';
import { motion } from '@/config/motion';
import type { TimelineOptions } from '@/motion/types';

/**
 * Hero — the machine wakes on LOAD (a played intro, NOT scrubbed, so the surface is
 * never blank at rest: no gate, no click, content is already there). Then a scrubbed
 * departure drives the exit as the visitor starts travelling on Z: the words GROW past
 * the camera (scale + blur + fade) — nothing slides vertically. The last stretch of the
 * scroll-away is already empty, so no readable text ever scrolls up the page.
 *
 * Expected DOM (inside `scope`):
 *   [data-hero-stage]      the <section> (scroll trigger)
 *   [data-hero-eyebrow]    mono system tag above the title
 *   [data-hero-word]       one span per title word (split server-side — crawleable)
 *   [data-hero-sub]        subtitle paragraph
 *   [data-hero-cta]        the two CTA links
 *   [data-hero-chip]       tech readout chips
 *   [data-hero-scrollhint] scroll indicator
 *   [data-hero-stars]      starfield canvas
 */
export function heroTimeline(
  scope: HTMLElement,
  { reduced = false }: TimelineOptions = {},
): gsap.core.Timeline | null {
  const q = gsap.utils.selector(scope);

  if (reduced) {
    gsap.set(
      q(
        '[data-hero-eyebrow], [data-hero-word], [data-hero-sub], [data-hero-cta], [data-hero-chip], [data-hero-scrollhint]',
      ),
      { autoAlpha: 1, clearProps: 'transform,filter' },
    );
    return null;
  }

  // Arrival — played once on load. Everything materialises from depth in place.
  const enter = motion.tunnel.enter;
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.fromTo(q('[data-hero-eyebrow]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.1);
  intro.fromTo(
    q('[data-hero-word]'),
    { autoAlpha: 0, scale: enter.scale, filter: `blur(${enter.blur}px)` },
    { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.06 },
    0.15,
  );
  intro.fromTo(
    q('[data-hero-sub]'),
    { autoAlpha: 0, scale: 0.97 },
    { autoAlpha: 1, scale: 1, duration: 0.7 },
    0.55,
  );
  intro.fromTo(
    q('[data-hero-cta]'),
    { autoAlpha: 0, scale: 0.95 },
    { autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.08 },
    0.7,
  );
  intro.fromTo(q('[data-hero-chip]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.05 }, 0.85);
  intro.fromTo(q('[data-hero-scrollhint]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 1.15);

  // Departure — scrubbed: the hero leaves through the Z axis, not up the page.
  const exit = motion.tunnel.exit;
  const departure = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: (q('[data-hero-stage]')[0] as HTMLElement) ?? scope,
      start: 'top top',
      end: 'bottom top',
      scrub: motion.scroll.scrub,
    },
  });
  departure.to(q('[data-hero-scrollhint]'), { autoAlpha: 0, duration: 0.12 }, 0);
  departure.to(
    q('[data-hero-word]'),
    { scale: exit.scale, filter: `blur(${exit.blur}px)`, autoAlpha: 0, duration: 0.5, stagger: 0.04 },
    0,
  );
  departure.to(q('[data-hero-eyebrow], [data-hero-sub]'), { scale: 1.2, autoAlpha: 0, duration: 0.4 }, 0.05);
  departure.to(
    q('[data-hero-cta], [data-hero-chip]'),
    { scale: motion.tunnel.exitSoft.scale, autoAlpha: 0, duration: 0.35 },
    0.1,
  );
  departure.to(q('[data-hero-stars]'), { autoAlpha: 0, scale: 1.06, duration: 0.4 }, 0.2);
  // Tail spacer: the dive completes ~2/3 through — the rest of the scroll-away is empty.
  departure.to({}, { duration: 0.3 }, 0.7);

  return intro;
}
