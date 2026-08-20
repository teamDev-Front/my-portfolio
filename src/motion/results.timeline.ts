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
 * The section holds still through CSS `position: sticky` inside a taller track, not
 * ScrollTrigger's pin — pinning swaps the element to position:fixed mid-scroll, which the
 * CLS observer scores as a layout shift.
 *
 * Expected DOM (inside `scope`):
 *   [data-results-track]   the tall track that gives the sticky section its travel
 *   [data-results-stage]   the sticky <section>
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
    // Thousands separator matches the rendered locale, so the counter never disagrees
    // with the value the server painted.
    const formatted = Math.round(n).toLocaleString(el.dataset.metricLocale || undefined);
    numberEl.textContent = `${prefix}${formatted}`;
  };

  if (reduced) {
    // Final values, no counting, no sticky travel.
    const track = scope.querySelector<HTMLElement>('[data-results-track]');
    const stage = scope.querySelector<HTMLElement>('[data-results-stage]');
    if (track) track.style.height = 'auto';
    if (stage) {
      stage.style.position = 'static';
      stage.style.height = 'auto';
    }
    metrics.forEach((el) => write(el, Number(el.dataset.metricValue ?? 0)));
    gsap.set(q('[data-results-header], [data-metric], [data-metric-quote]'), {
      autoAlpha: 1,
      clearProps: 'transform,filter',
    });
    return null;
  }

  const enter = motion.tunnel.enter;
  const stage = (q('[data-results-stage]')[0] as HTMLElement) ?? scope;
  const track = (q('[data-results-track]')[0] as HTMLElement) ?? stage;

  // ARRIVAL — while the track travels up. The whole board materialises here, the numbers
  // sitting at zero: by the time the section parks, the visitor is looking at a complete
  // composition, and the scroll that follows is what makes the numbers climb. Revealing
  // them inside the parked timeline instead left a viewport of empty space under the
  // heading while the section was already filling the screen.
  metrics.forEach((el) => write(el, 0));
  const arrival = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, start: 'top 85%', end: 'top top', scrub: motion.scroll.scrub },
  });
  arrival.fromTo(
    q('[data-results-header]'),
    { autoAlpha: 0, scale: enter.scale, filter: `blur(${enter.blur}px)` },
    { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.5 },
    0,
  );
  arrival.fromTo(
    metrics,
    { autoAlpha: 0, scale: 0.94 },
    { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.06 },
    0.2,
  );
  arrival.fromTo(
    q('[data-metric-quote]'),
    { autoAlpha: 0, scale: 0.97 },
    { autoAlpha: 1, scale: 1, duration: 0.35, stagger: 0.06 },
    0.5,
  );

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: motion.scroll.scrub,
    },
  });

  // The counting itself: each number climbs across its share of the parked beat, the
  // spans overlapping so the board reads as one rising system rather than a queue.
  const span = motion.metrics.countPortion;
  const each = span / Math.max(metrics.length, 1);
  metrics.forEach((el, i) => {
    const target = Number(el.dataset.metricValue ?? 0);
    const counter = { n: 0 };
    tl.to(
      counter,
      { n: target, duration: each * 1.6, onUpdate: () => write(el, counter.n) },
      0.04 + i * each * 0.5,
    );
  });

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
