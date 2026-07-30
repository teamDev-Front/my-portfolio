# src/motion

Every GSAP timeline lives here, one file per section (`*.timeline.ts`). Components NEVER
call `gsap.to()` directly — they import a factory from this folder and run it through
`useGsapContext` (or the generic `<Choreography name="…">` leaf, which does it for them).

Each factory:

- has the signature `(scope: HTMLElement, { reduced, mobile }: TimelineOptions) => gsap.core.Timeline | null`;
- documents its **Expected DOM** (the `data-*` contract) in JSDoc;
- returns a calm / no-op variant (final states via `gsap.set`, return `null`) when `reduced`;
- animates only `transform` / `opacity` (+ `filter: blur` for the tunnel vocabulary);
- must be **reversible on scroll-up** — every scrubbed beat, no exceptions.

## The motion language

The page does not scroll down — it travels forward in depth.

| Beat | Vocabulary |
| --- | --- |
| Entry | born small and soft at depth: `scale 0.78–0.94` + `blur(7–9px)` + `autoAlpha 0` → settle |
| Exit | grows past the camera: `scale 1.14–2.05` + `blur(10–12px)` + `autoAlpha 0` |
| Never | `translateY` for section entries — vertical slides read as page scroll and break the tunnel |

Values live in `src/config/motion.ts` (`motion.tunnel`), never inline in a timeline.

## Sections

| Section | File | Shape |
| --- | --- | --- |
| Hero | `hero.timeline.ts` | played intro on load + scrubbed departure |
| 01 About | `about.timeline.ts` | short pin, cover-sheet unveil, departure empties the pin |
| 02 Services | `services.timeline.ts` | no pin — scrubbed stagger across the editorial list |
| 03 Portfolio | `portfolio.timeline.ts` | pinned queue: scrub phase + drift + velocity boost + drag inertia |
| 04 Results | `results.timeline.ts` | pinned; metrics count 0→value with the scrub |
| 05 Contact | `contact.timeline.ts` | tunnel entry at the largest type scale |
| Internal pages | `page-reveal.timeline.ts` | one trigger per `[data-reveal]`, no pinning |

## Rules that bite

- **One GSAP registration point** — import `{ gsap, ScrollTrigger }` from `@/lib/gsap`, never from `"gsap"`.
- **Sections are Server Components.** Motion enters through a small client leaf that only
  wraps `{children}`; content and copy never move to the client.
- **No per-frame React state.** HUD/telemetry/counters write to `textContent` or CSS vars.
  The store (`src/stores/experienceStore.ts`) holds semantic state only.
- **Cosmetic values are parameters** — `src/config/motion.ts` and `src/config/visual.ts`.
  Tune there; never bury a magic number in a timeline.
- **Clean up.** `useGsapContext` reverts the context; manual listeners use an
  `AbortController` aborted from the tween's `onInterrupt`.
