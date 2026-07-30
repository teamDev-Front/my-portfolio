'use client';

import { useRef, type ReactNode } from 'react';
import { useGsapContext } from '@/hooks/useGsapContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { heroTimeline } from '@/motion/hero.timeline';

/**
 * Choreography leaf — the ONLY client boundary of the hero. Wraps the server-rendered
 * markup and mounts the timeline; owns zero content, so SEO/HTML stays on the server.
 */
export function HeroChoreography({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGsapContext(
    scope,
    () => {
      if (!scope.current) return;
      heroTimeline(scope.current, { reduced });
    },
    [reduced],
  );

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
