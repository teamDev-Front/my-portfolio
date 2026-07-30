import { gsap } from '@/lib/gsap';
import { motion } from '@/config/motion';
import type { TimelineOptions } from '@/motion/types';

/**
 * Section 04 — RESULTS. The metrics are the hero: each number COUNTS from zero to its
 * value driven by the scrub, so the visitor's scroll is literally what produces the
 * result. Quotes are supporting text underneath. Pinned, scrubbed, reversible — scrolling
 * back counts the numbers down again.
 *
 * Numbers are written straight to textContent (never a React re-render per frame).
 *
 * Expected DOM (inside `scope`):
 *   [data-results-stage]   pin container (the <section>)
 *   [data-results-header]  eyebrow + title
 *   [data-metric]          one block per metric; carries
 *                            data-metric-value  the target number (e.g. "30")
 *                            data-metric-prefix optional "+"
 *                            data-metric-suffix optional "%"
 *   [data-metric-number]   the element whose textContent is written each frame
 *   [data-metric-quote]    the supporting quote + attribution
 */
export function resultsTimeline(
  scope: HTMLElement,
  { reduced = false, mobile = false }: TimelineOptions = {},
): gsap.core.Timeline | null {
  const q = gsap.utils.selector(scope);
  const metrics = Array.from(scope.querySelectorAll<HTMLElement>('[data-metric]'));

  const write = (el: HTMLElement, n: number) => {
    const numberEl = el.querySelector<HTMLElement>('[data-metric-number]');
    if (!numberEl) return;
    const prefix = el.dataset.metricPrefix ?? '';
    const suffix = el.dataset.metricSuffix ?? '';
    numberEl.textContent = `${prefix}${Math.round(n)}${suffix}`;
  };

  if (reduced) {
    // Final values, no counting, no pin.
    metrics.forEach((el) => write(el, Number(el.dataset.metricValue ?? 0)));
    gsap.set(q('[data-results-header], [data-metric], [data-metric-quote]'), {
      autoAlpha: 1,
      clearProps: 'transform,filter',
    });
    return null;
  }

  const pinLen = mobile ? motion.scroll.pinLengthMobile.results : motion.scroll.pinLength.results;
  const enter = motion.tunnel.enter;

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: (q('[data-results-stage]')[0] as HTMLElement) ?? scope,
      start: 'top top',
      end: `+=${pinLen * 100}%`,
      scrub: motion.scroll.scrub,
      pin: true,
      anticipatePin: 1,
    },
  });

  tl.fromTo(
    q('[data-results-header]'),
    { autoAlpha: 0, scale: enter.scale, filter: `blur(${enter.blur}px)` },
    { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.18 },
    0,
  );

  // Each metric arrives from depth, then counts up across its share of the pin. The
  // counters overlap slightly so the block reads as one rising system, not a queue.
  const span = motion.metrics.countPortion;
  const each = span / Math.max(metrics.length, 1);
  metrics.forEach((el, i) => {
    const target = Number(el.dataset.metricValue ?? 0);
    const at = 0.12 + i * each * 0.85;
    tl.fromTo(el, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.12 }, at);
    const counter = { n: 0 };
    tl.to(
      counter,
      {
        n: target,
        duration: each * 1.35,
        onUpdate: () => write(el, counter.n),
      },
      at,
    );
  });

  tl.fromTo(
    q('[data-metric-quote]'),
    { autoAlpha: 0, scale: 0.97 },
    { autoAlpha: 1, scale: 1, duration: 0.15, stagger: 0.06 },
    0.62,
  );

  // Hold, then the whole board grows past the camera — the pin releases empty.
  tl.to(
    q('[data-metric], [data-metric-quote], [data-results-header]'),
    {
      scale: motion.tunnel.exitSoft.scale,
      filter: `blur(${motion.tunnel.exitSoft.blur}px)`,
      autoAlpha: 0,
      duration: 0.18,
      stagger: 0.015,
    },
    0.86,
  );

  return tl;
}
