import { gsap } from '@/lib/gsap';
import { motion } from '@/config/motion';
import type { TimelineOptions } from '@/motion/types';

/**
 * Section 03 — PORTFOLIO. A QUEUE with manual physics, not a carousel. The cards'
 * positions are a pure function of `scrubPhase + liveOffset`:
 *
 *   · scrubPhase — driven by the pinned scrub: the narrative layer, reversible on
 *     scroll-up exactly like every other beat.
 *   · liveOffset — the living layer: breathes forward on its own (autoSpeed), accelerates
 *     with scroll VELOCITY (velocityGain), and takes horizontal DRAG with manual inertia
 *     (exponential decay — no paid plugins). N-periodic, so the wrap has no seam.
 *
 * Each card PHYSICALLY travels slot to slot (translate + uniform scale + paint order),
 * never a crossfade. All gains live in config/motion.workQueue — zero them and this is
 * the exact scrub-only choreography.
 *
 * The section holds still through CSS `position: sticky` inside a taller track, not
 * ScrollTrigger's pin — pinning swaps the element to position:fixed mid-scroll, which the
 * CLS observer scores as a layout shift.
 *
 * Expected DOM (inside `scope`):
 *   [data-portfolio-track]   the tall track that gives the sticky section its travel
 *   [data-portfolio-stage]   the sticky <section>
 *   [data-portfolio-header]  eyebrow + title
 *   [data-queue-surface]     the drag surface (touch-action: pan-y)
 *   [data-queue-card="i"]    one element per project (0 starts at the front slot)
 *   [data-queue-hint]        drag affordance readout
 *   [data-portfolio-cta]     "view all" link
 */

/**
 * Queue slots in viewport units: centre-x (%), centre-y (%), width (vw), paint order,
 * opacity. Slot 0 is the front, anchored left of centre; the rest recede to the right,
 * smaller, higher and dimmer — a corridor of work receding into the screen. Every slot's
 * box (cx ± w/2) stays inside 0–100% so nothing is ever clipped at the edge.
 */
interface Slot {
  cx: number;
  cy: number;
  w: number;
  z: number;
  o: number;
}

const SLOTS_DESKTOP: readonly Slot[] = [
  { cx: 30, cy: 53, w: 40, z: 50, o: 1 },
  { cx: 62, cy: 50, w: 26, z: 40, o: 0.7 },
  { cx: 80, cy: 48, w: 18, z: 30, o: 0.38 },
  { cx: 91, cy: 46.5, w: 12, z: 20, o: 0.16 },
  // Off-stage staging slot: cards recycle through here unseen.
  { cx: 104, cy: 46, w: 9, z: 10, o: 0 },
];

/**
 * Mobile has no room for a four-deep corridor: the front card takes most of the width,
 * one card peeks in from the right as the affordance that there is more, and the rest
 * stage off-screen. Drag (already pointer-based) is the primary control here.
 */
const SLOTS_MOBILE: readonly Slot[] = [
  { cx: 46, cy: 52, w: 78, z: 50, o: 1 },
  { cx: 108, cy: 50, w: 56, z: 40, o: 0.45 },
  { cx: 150, cy: 49, w: 40, z: 20, o: 0 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function portfolioTimeline(
  scope: HTMLElement,
  { reduced = false, mobile = false }: TimelineOptions = {},
): gsap.core.Timeline | null {
  const q = gsap.utils.selector(scope);
  const cards = Array.from(scope.querySelectorAll<HTMLElement>('[data-queue-card]'));
  if (cards.length === 0) return null;

  const stage = (q('[data-portfolio-stage]')[0] as HTMLElement) ?? scope;
  const track = (q('[data-portfolio-track]')[0] as HTMLElement) ?? stage;

  if (reduced) {
    // Reduced motion: the queue collapses to a plain readable stack (CSS owns the layout
    // via [data-queue-static]); nothing moves, every card is reachable and tabbable.
    stage.setAttribute('data-queue-static', 'on');
    gsap.set(cards, { clearProps: 'all' });
    cards.forEach((el) => {
      el.dataset.queueFront = 'on';
    });
    gsap.set(q('[data-portfolio-header], [data-portfolio-cta]'), { autoAlpha: 1, clearProps: 'transform' });
    gsap.set(q('[data-queue-hint]'), { autoAlpha: 0 });
    return null;
  }

  const cfg = motion.workQueue;
  const n = cards.length;
  const SLOTS = mobile ? SLOTS_MOBILE : SLOTS_DESKTOP;
  const CYCLE = SLOTS.length;

  // Cards sit at left/top 50% with xPercent/yPercent -50, so slot positions are offsets
  // from the viewport centre — slot 0 lands at its designed cx, not at 50%.
  const slotX = (s: number) => ((SLOTS[s]!.cx - 50) / 100) * window.innerWidth;
  const slotY = (s: number) => ((SLOTS[s]!.cy - 50) / 100) * window.innerHeight;
  const slotScale = (s: number) => SLOTS[s]!.w / SLOTS[0]!.w;
  const easeStep = gsap.parseEase('power1.inOut');
  const easeExit = gsap.parseEase('power2.out');

  /**
   * Places every card from one continuous queue phase. The front card exits fast
   * (power2.out over the first 45% of its step), stays NEAREST while it clears the
   * stage, then dives behind the queue and files in at the back.
   */
  const applyPhase = (total: number) => {
    const t = ((total % n) + n) % n;
    const step = Math.floor(t);
    const f = t - step;
    cards.forEach((el, i) => {
      // The card's raw place in the queue (0 = front), then its VISUAL slot: anything
      // deeper than the corridor shares the off-stage staging slot. Mapping raw→visual
      // (rather than clamping first) keeps exactly one card entering the corridor per
      // step — clamping first would march two cards onto the same slot.
      const rawFrom = (i - step + n) % n;
      const rawTo = rawFrom === 0 ? n - 1 : rawFrom - 1;
      const from = Math.min(rawFrom, CYCLE - 1);
      const to = Math.min(rawTo, CYCLE - 1);
      let x: number;
      let y: number;
      let sc: number;
      let op: number;
      let z: number;
      if (rawFrom === 0) {
        // The front card leaves toward the viewer — left and slightly larger, then out.
        const ef = easeExit(Math.min(f / 0.45, 1));
        x = lerp(slotX(0), slotX(0) - window.innerWidth * 0.42, ef);
        y = slotY(0);
        sc = lerp(slotScale(0), slotScale(0) * 1.08, ef);
        op = 1 - ef;
        z = f < 0.5 ? 60 : 5;
      } else {
        const ef = easeStep(f);
        x = lerp(slotX(from), slotX(to), ef);
        y = lerp(slotY(from), slotY(to), ef);
        sc = lerp(slotScale(from), slotScale(to), ef);
        op = lerp(SLOTS[from]!.o, SLOTS[to]!.o, ef);
        z = f < 0.99 ? SLOTS[from]!.z : SLOTS[to]!.z;
      }
      // gsap.set (not quickSetter): scale must land in the same transform as x/y.
      gsap.set(el, { x, y, scale: sc, autoAlpha: op });
      el.style.zIndex = String(z);
      // Pointer events belong to whichever card is NEAREST the front slot: the one
      // sitting in it while it still holds the stage (f < 0.5), otherwise the one
      // already arriving. Gating on "rawFrom === 0" alone would leave the queue
      // unclickable for half of every step.
      el.dataset.queueFront = (f < 0.5 ? rawFrom === 0 : rawFrom === 1) ? 'on' : 'off';
    });
  };

  cards.forEach((el) => gsap.set(el, { xPercent: -50, yPercent: -50, transformOrigin: 'center center' }));
  applyPhase(0);

  const state = { scrubPhase: 0 };

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: cfg.scrub,
      invalidateOnRefresh: true,
    },
  });

  // ARRIVAL — before the pin. The pin only starts once the section's top reaches the top
  // of the viewport; gating the reveal on the pinned timeline would leave a full viewport
  // of empty screen while the section travels up. The queue's own opacity is owned by
  // applyPhase per slot, so the whole surface fades as one here instead.
  const arrival = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, start: 'top 85%', end: 'top top', scrub: cfg.scrub },
  });
  arrival.fromTo(
    q('[data-portfolio-header]'),
    { autoAlpha: 0, scale: 0.94, filter: 'blur(8px)' },
    { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.5 },
    0,
  );
  arrival.fromTo(q('[data-queue-surface]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0.1);
  arrival.fromTo(q('[data-queue-hint]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.5);

  // The narrative layer: the scrub advances the queue across the pin, chained with no
  // gap — every pixel of scroll moves the fila.
  tl.to(state, { scrubPhase: n - 1, duration: n - 1 }, 0);
  tl.to(q('[data-queue-hint]'), { autoAlpha: 0, duration: 0.2 }, `>-0.3`);
  tl.fromTo(q('[data-portfolio-cta]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, '>-0.1');

  // The living layer + drag, applied on top of the scrub phase every frame while the pin
  // is active. Listeners are torn down when the context reverts (onInterrupt).
  const live = { offset: 0, boost: 0, dragVel: 0 };
  let lastT = gsap.ticker.time;
  let lastY = window.scrollY;
  let dragging = false;
  let lastPX = 0;
  let lastMoveT = 0;
  let dragMoved = 0;

  const surface = q('[data-queue-surface]')[0] as HTMLElement | undefined;
  const abort = new AbortController();
  if (surface) {
    const { signal } = abort;
    surface.addEventListener(
      'pointerdown',
      (e) => {
        dragging = true;
        dragMoved = 0;
        lastPX = e.clientX;
        lastMoveT = performance.now() / 1000;
        live.dragVel = 0;
        // Pointer capture is claimed LATER, only once this becomes a real drag: capturing
        // on pointerdown would retarget the subsequent click to the surface, so a card
        // could never be opened by clicking it.
      },
      { signal },
    );
    surface.addEventListener(
      'pointermove',
      (e) => {
        if (!dragging) return;
        const now = performance.now() / 1000;
        const dt = Math.max(now - lastMoveT, 1 / 240);
        const dx = e.clientX - lastPX;
        lastPX = e.clientX;
        lastMoveT = now;
        dragMoved += Math.abs(dx);
        if (dragMoved > 6) {
          surface.setPointerCapture(e.pointerId);
          surface.style.cursor = 'grabbing';
        }
        // Drag left = pull the queue forward (the next work steps up to the front).
        live.offset -= dx * cfg.dragGain;
        live.dragVel = gsap.utils.clamp(-1.5, 1.5, (-dx * cfg.dragGain) / dt);
      },
      { signal },
    );
    const release = () => {
      dragging = false;
      surface.style.cursor = '';
    };
    surface.addEventListener('pointerup', release, { signal });
    surface.addEventListener('pointercancel', release, { signal });
    // A drag must never fire the card's click underneath the pointer.
    surface.addEventListener(
      'click',
      (e) => {
        if (dragMoved > 6) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      { capture: true, signal },
    );

    // Keyboard parity: a focused card is pulled to the front slot. Offset is solved
    // modulo n and eased through the same live layer, so the queue arrives naturally
    // instead of snapping.
    surface.addEventListener(
      'queue:focus',
      (e) => {
        const index = (e as CustomEvent<{ index: number }>).detail?.index;
        if (typeof index !== 'number') return;
        // Front means total ≡ index (mod n) — pick the nearest equivalent offset.
        let target = index - state.scrubPhase;
        target = ((target % n) + n) % n;
        const delta = ((target - live.offset + n * 1.5) % n) - n * 0.5;
        gsap.to(live, {
          offset: live.offset + delta,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: true,
        });
      },
      { signal },
    );
  }

  gsap.to(
    { t: 0 },
    {
      t: 1,
      duration: 1e9,
      ease: 'none',
      onInterrupt: () => abort.abort(),
      onUpdate: () => {
        const now = gsap.ticker.time;
        const dt = Math.min(Math.max(now - lastT, 0), 0.1);
        lastT = now;
        const y = window.scrollY;
        const v = dt > 0 ? (y - lastY) / dt : 0;
        lastY = y;
        const targetBoost = Math.min(Math.abs(v) * cfg.velocityGain, cfg.maxBoost);
        live.boost += (targetBoost - live.boost) * Math.min(1, dt * 6);
        live.dragVel *= Math.exp(-cfg.inertiaDecay * dt);
        // Not wrapped here: applyPhase already works modulo n, and a focus tween needs a
        // continuous target to ease toward (wrapping mid-tween would snap the queue).
        live.offset += (cfg.autoSpeed + live.boost) * dt + (dragging ? 0 : live.dragVel * dt);
        // Runs while the section is anywhere on screen, not only while pinned — the
        // queue must already be alive as it arrives.
        if (tl.scrollTrigger?.isActive || arrival.scrollTrigger?.isActive) {
          applyPhase(state.scrubPhase + live.offset);
        }
      },
    },
  );

  return tl;
}
