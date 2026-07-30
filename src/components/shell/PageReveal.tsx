'use client';

import { useRef, type ReactNode } from 'react';
import { useGsapContext } from '@/hooks/useGsapContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { pageRevealTimeline } from '@/motion/page-reveal.timeline';

/**
 * Wraps an internal page and reveals every [data-reveal] descendant from depth.
 * Client leaf only — the page itself stays a Server Component.
 */
export function PageReveal({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGsapContext(
    scope,
    () => {
      if (!scope.current) return;
      pageRevealTimeline(scope.current, { reduced });
    },
    [reduced],
  );

  return <div ref={scope}>{children}</div>;
}
