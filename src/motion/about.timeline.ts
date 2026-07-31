import { gsap } from '@/lib/gsap';
import { motion } from '@/config/motion';
import type { TimelineOptions } from '@/motion/types';

/**
 * Section 01 — ABOUT, in two movements:
 *
 *   ARRIVAL (trigger: the section entering the viewport) — the giant "01" surfaces at
 *   depth, the title reveals word by word, the cover sheet lifts off the monogram panel.
 *   This runs BEFORE the pin: a pin only starts once the section's top reaches the top of
 *   the viewport, so gating the reveal on the pinned timeline would leave a full viewport
 *   of empty screen while the section travels up.
 *
 *   DEPARTURE — the chapter holds, readable, then grows past the camera so the stage is
 *   empty by the time it scrolls away (tunnel rule: nothing readable scrolls up the page).
 *
 * The section holds still through CSS `position: sticky` inside a taller track, NOT
 * ScrollTrigger's pin. Both look identical, but pinning swaps the element to
 * position:fixed mid-scroll, which the CLS observer scores as a layout shift — three
 * pinned beats measured CLS 5.65. Sticky never leaves the flow and measures 0.
 *
 * Both movements are scrubbed and reversible.
 *
 * Expected DOM (inside `scope`):
 *   [data-about-track]      the tall track that gives the sticky section its travel
 *   [data-about-stage]      the sticky <section>
 *   [data-about-number]     the giant background "01"
 *   [data-about-eyebrow]    "01 / ABOUT" mono label
 *   [data-about-word]       one span per title word
 *   [data-about-desc]       description paragraph
 *   [data-about-panel]      monogram panel (desktop only)
 *   [data-about-cover]      the cover sheet inside the panel (yPercent -101 to unveil)
 *   [data-about-highlight]  highlight rows
 *   [data-about-cta]        "know my story" link
 */
export function aboutTimeline(
  scope: HTMLElement,
  { reduced = false, mobile = false }: TimelineOptions = {},
): gsap.core.Timeline | null {
  const q = gsap.utils.selector(scope);
  const stage = (q('[data-about-stage]')[0] as HTMLElement) ?? scope;
  const track = (q('[data-about-track]')[0] as HTMLElement) ?? stage;

  if (reduced) {
    // Collapse the sticky travel: internal pages and reduced-motion just read.
    const track = scope.querySelector<HTMLElement>('[data-about-track]');
    if (track) track.style.height = 'auto';
    const sticky = scope.querySelector<HTMLElement>('[data-about-stage]');
    if (sticky) {
      sticky.style.position = 'static';
      sticky.style.height = 'auto';
      sticky.style.paddingBlock = '6rem';
    }
    gsap.set(
      q(
        '[data-about-eyebrow], [data-about-word], [data-about-desc], [data-about-panel], [data-about-highlight], [data-about-cta]',
      ),
      { autoAlpha: 1, clearProps: 'transform,filter' },
    );
    gsap.set(q('[data-about-cover]'), { yPercent: -101 });
    gsap.set(q('[data-about-number]'), { autoAlpha: 0.05, clearProps: 'transform' });
    return null;
  }

  const enter = motion.tunnel.enter;
  const exit = motion.tunnel.exitSoft;

  // — ARRIVAL: while the track travels up to the top of the viewport.
  const arrival = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track,
      start: 'top 88%',
      end: 'top top',
      scrub: motion.scroll.scrub,
    },
  });
  arrival.fromTo(q('[data-about-number]'), { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 0.05, scale: 1, duration: 0.4 }, 0);
  arrival.fromTo(q('[data-about-eyebrow]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0.05);
  arrival.fromTo(
    q('[data-about-word]'),
    { autoAlpha: 0, scale: enter.scale, filter: `blur(${enter.blur}px)` },
    { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.35, stagger: 0.04 },
    0.08,
  );
  arrival.fromTo(
    q('[data-about-desc]'),
    { autoAlpha: 0, scale: 0.96, filter: 'blur(5px)' },
    { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.3 },
    0.25,
  );
  arrival.fromTo(q('[data-about-panel]'), { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.32 }, 0.12);
  // Transform-only unveil — a panel the colour of the page lifting off the artwork.
  arrival.to(q('[data-about-cover]'), { yPercent: -101, duration: 0.4, ease: 'power2.inOut' }, 0.3);
  arrival.fromTo(
    q('[data-about-highlight]'),
    { autoAlpha: 0, scale: 0.96 },
    { autoAlpha: 1, scale: 1, duration: 0.22, stagger: 0.07 },
    0.45,
  );
  arrival.fromTo(q('[data-about-cta]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.72);

  // — DEPARTURE: hold while the sticky section is parked, then dive past the camera.
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: motion.scroll.scrub,
    },
  });
  tl.to({}, { duration: 0.55 }, 0); // the chapter rests, readable
  tl.to(
    q('[data-about-word]'),
    { scale: 1.3, filter: 'blur(11px)', autoAlpha: 0, duration: 0.3, stagger: 0.02 },
    0.55,
  );
  tl.to(
    q('[data-about-panel], [data-about-desc], [data-about-highlight], [data-about-cta], [data-about-eyebrow]'),
    { scale: exit.scale, filter: `blur(${exit.blur}px)`, autoAlpha: 0, duration: 0.3, stagger: 0.02 },
    0.58,
  );
  tl.to(q('[data-about-number]'), { scale: 1.1, autoAlpha: 0, duration: 0.28 }, 0.62);

  return tl;
}
