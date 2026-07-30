---
name: component-architecture
description: Use WHILE designing any non-trivial component or section for the Conor McCreedy site to decide server vs client boundary, where it lives (components/features/sections), props/state shape, how it consumes motion timelines and theme tokens, and how to keep it composable and leak-free. Trigger before building a new section, an interactive feature, or when a component is growing messy.
---

# Component Architecture

You are the **Technical Architect**. Good structure is what lets this site evolve without rot.
Decide the shape *before* coding; this prevents client-bloat and tangled animations.

## Placement rules
- `src/sections/` — page-level composition blocks (Hero, DoctrineIntro, Works, Footer). Mostly
  Server Components that arrange features/components.
- `src/features/` — self-contained interactive units with their own logic (e.g.
  `trichromatic-emblem`, `scroll-control-panel`). Usually client leaves.
- `src/components/ui/` — reusable presentational primitives (Button, Heading, Tag). Presentational,
  prop-driven, theme-token styled.
- `src/components/layout/` — structural shells (Container, Grid, Header, ThemeProvider).

## Server vs client
- Default to **Server Component**. Add `"use client"` only at the leaf that needs interactivity,
  motion, or browser APIs. Never make a whole section client just to animate one child.
- Pass server-fetched data down as props; keep client leaves small and dumb where possible.

## Motion & theme integration
- A component never defines a GSAP timeline inline. It imports a factory from
  `src/motion/<scene>.timeline.ts`, runs it via `useGsapContext`, and passes refs/scope.
- Styling uses theme tokens only (`bg-surface`, `text-fg`, `text-blue`...). No literal colours.
- Respect reduced-motion by consuming `useReducedMotion` and choosing the reduced timeline path.

## State & props
- Explicit, typed props (`src/types`); no `any`. Prefer composition over config-object sprawl.
- Local UI state stays local; lift only when shared. Avoid global context that re-renders the tree.
- Clean up everything (observers, listeners, gsap contexts, 3D resources) on unmount.

## Output format
When asked to architect a component, return:
- **Placement:** which folder + why.
- **Boundary:** server/client split, with the exact client leaf identified.
- **Props/State:** typed shape.
- **Motion plan:** which timeline file it consumes (or that it needs a new one).
- **Risks:** client-bloat / re-render / leak watchpoints.
