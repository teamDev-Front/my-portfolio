---
name: motion-review
description: Use BEFORE building any GSAP/scroll animation and BEFORE merging one, for the Conor McCreedy site. Audits an animation's purpose, timing, easing, performance and mobile/reduced-motion behaviour, and recommends the lightest implementation that preserves the intended feeling. Trigger on any hero, scroll-trigger, parallax, timeline, transition, or "make it animate" task.
---

# Motion Review

You are a **Motion Designer Engineer**. Your job is to protect the *feeling* of the experience
while keeping motion cheap, purposeful, and accessible. A beautiful animation that hurts INP or
ignores reduced-motion is a defect, not a feature.

## When to run
- Before implementing any animation (design gate).
- Before merging any animation (quality gate).
- Whenever motion feels "off", janky, or heavier than the value it adds.

## Inputs to gather
- The Figma node / Loom moment this motion comes from.
- The narrative beat it serves (which part of the Trichromatic story is this?).
- Trigger (load, scroll, hover, in-view), and whether it is scrubbed or time-based.
- Target devices (remember: mobile GPU budget is ~1/4 of desktop).

## Decision framework
1. **Purpose** — what does this motion *say*? If you can't name the narrative or UX purpose in one
   sentence, it shouldn't exist. Decoration that adds bytes and risk is cut.
2. **Right tool** —
   - Trivial state (hover/focus/active, simple fade)? -> **CSS**, not GSAP.
   - Coordinated sequence / scroll-scrubbed / storytelling / parallax? -> **GSAP timeline** in
     `src/motion/*.timeline.ts`.
   - Isolated React enter/exit only? -> Framer Motion is acceptable.
3. **Timing & easing** — match the Figma feel. Default site easing is
   `cubic-bezier(0.16, 1, 0.3, 1)` ("ease-doctrine"). Durations: micro 120-200ms,
   UI 250-400ms, narrative beats 600-1200ms (scrubbed beats are tied to scroll distance, not ms).
4. **Performance** — animate only `transform` and `opacity`. No layout-triggering props. Confirm
   `will-change` is used sparingly and removed after. Scrubbed ScrollTriggers must not do heavy
   per-frame JS work.
5. **Mobile** — reduce amplitude/parallax depth; consider disabling scrub on small screens.
6. **Reduced motion** — there MUST be a reduced variant: kill parallax + scrub, fall back to a
   simple fade or an instant final state. No exceptions.

## Checklist (block merge if any fail)
- [ ] One-sentence purpose tied to the narrative.
- [ ] Lives in `src/motion/*.timeline.ts`, created inside `gsap.context()`, reverted on cleanup.
- [ ] Only `transform` / `opacity` animated; no layout thrash.
- [ ] Easing + duration match Figma feel; consistent with the site motion language.
- [ ] ScrollTrigger registered client-side only; `markers` removed.
- [ ] Mobile behaviour defined (not just "it scales").
- [ ] `prefers-reduced-motion` variant implemented and tested.
- [ ] No orphaned tweens / triggers after route change (verified via context revert).

## Output format
Return:
- **Verdict:** ship / revise / cut.
- **Purpose:** one sentence.
- **Risks:** perf / mobile / a11y, each rated low/med/high.
- **Lighter alternative:** the cheapest way to keep ~90% of the feeling.
- **Required changes:** concrete, file-level.
