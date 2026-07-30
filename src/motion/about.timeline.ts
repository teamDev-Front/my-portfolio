import { gsap } from '@/lib/gsap';
import { motion } from '@/config/motion';
import type { TimelineOptions } from '@/motion/types';

/**
 * Section 01 — ABOUT. A short pin: the giant "01" surfaces at depth behind the content,
 * the title reveals word by word, the monogram panel unveils under a cover sheet
 * (transform-only), the highlight rows file in — hold — then everything grows past the
 * camera and the pin releases empty (tunnel rule: nothing readable scrolls up the page).
 * Fully scrubbed and reversible.
 *
 * Expected DOM (inside `scope`):
 *   [data-about-stage]      pin container (the <section>)
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

  if (reduced) {
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

  const pinLen = mobile ? motion.scroll.pinLengthMobile.about : motion.scroll.pinLength.about;
  const enter = motion.tunnel.enter;
  const exit = motion.tunnel.exitSoft;

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: (q('[data-about-stage]')[0] as HTMLElement) ?? scope,
      start: 'top top',
      end: `+=${pinLen * 100}%`,
      scrub: motion.scroll.scrub,
      pin: true,
      anticipatePin: 1,
    },
  });

  // Arrival — everything is timeline-gated (tunnel rule: nothing visible pre-pin).
  tl.fromTo(q('[data-about-number]'), { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 0.05, scale: 1, duration: 0.35 }, 0);
  tl.fromTo(q('[data-about-eyebrow]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.04);
  tl.fromTo(
    q('[data-about-word]'),
    { autoAlpha: 0, scale: enter.scale, filter: `blur(${enter.blur}px)` },
    { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.22, stagger: 0.02 },
    0.06,
  );
  tl.fromTo(
    q('[data-about-desc]'),
    { autoAlpha: 0, scale: 0.96, filter: 'blur(5px)' },
    { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.2 },
    0.18,
  );
  // The panel materialises covered, then the cover sheet lifts — transform-only unveil.
  tl.fromTo(q('[data-about-panel]'), { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.22 }, 0.1);
  tl.to(q('[data-about-cover]'), { yPercent: -101, duration: 0.3, ease: 'power2.inOut' }, 0.2);
  tl.fromTo(
    q('[data-about-highlight]'),
    { autoAlpha: 0, scale: 0.96 },
    { autoAlpha: 1, scale: 1, duration: 0.16, stagger: 0.05 },
    0.3,
  );
  tl.fromTo(q('[data-about-cta]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0.48);

  // Hold — the chapter rests, readable.
  tl.to({}, { duration: 0.12 }, 0.63);

  // Departure — grows past the camera; the pin releases an empty stage.
  tl.to(
    q('[data-about-word]'),
    { scale: 1.3, filter: 'blur(11px)', autoAlpha: 0, duration: 0.2, stagger: 0.012 },
    0.76,
  );
  tl.to(
    q('[data-about-panel], [data-about-desc], [data-about-highlight], [data-about-cta], [data-about-eyebrow]'),
    { scale: exit.scale, filter: `blur(${exit.blur}px)`, autoAlpha: 0, duration: 0.2, stagger: 0.01 },
    0.78,
  );
  tl.to(q('[data-about-number]'), { scale: 1.1, autoAlpha: 0, duration: 0.18 }, 0.8);

  return tl;
}
