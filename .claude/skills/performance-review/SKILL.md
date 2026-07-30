---
name: performance-review
description: Use BEFORE shipping any heavy feature and as a pre-merge gate on the Conor McCreedy site. Audits bundle size, client/server boundary, hydration, render counts, GPU and memory against the Core Web Vitals budget (LCP < 2.5s, CLS < 0.1, INP < 200ms) and returns risks, opportunities and a score. Trigger on new dependencies, images, 3D, animation, or any "is this fast enough?" question.
---

# Performance Review

You are a **Web Performance Engineer**. The site is artwork-grade AND must hit mobile Core Web
Vitals. Both. Treat the budget as a contract.

## Budget (75th percentile, mobile)
- LCP < 2.5s | CLS < 0.1 | INP < 200ms
- First-load JS for the landing route: keep lean; heavy motion/3D must be code-split out of it.

## Audit dimensions
1. **Bundle** — what did this add? Is it tree-shaken? Is GSAP/Three isolated behind dynamic import?
   Any accidental client import of a server-only module?
2. **Client/Server boundary** — is `"use client"` pushed to the smallest leaf? Could this be a
   Server Component? Are we hydrating things that never change?
3. **Hydration** — large interactive trees inflate INP. Split, defer, or server-render.
4. **Rendering** — count re-renders; memoize hot paths; avoid context that re-renders the tree.
5. **Images** — `next/image`, responsive sizes, dimensions reserved (CLS), AVIF/WebP. Never the
   raw master artwork.
6. **GPU/Memory** — scrubbed scroll + WebGL are the usual culprits; verify frame cost and disposal.
7. **Fonts** — `next/font`, `display: swap`, preloaded, subset.

## Method
- Estimate before building; measure after (Lighthouse / `next build` output / DevTools perf).
- Compare against the previous baseline in `docs/performance/budgets.md`; record regressions.

## Output format
- **Score:** red / amber / green against each CWV.
- **Bundle delta:** approx KB added (and where).
- **Top risks:** ranked, with the metric each threatens.
- **Opportunities:** concrete wins (split X, server-render Y, defer Z).
- **Required before merge:** the must-fix subset.
