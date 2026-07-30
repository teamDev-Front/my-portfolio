'use client';

import { useRef, type ReactNode } from 'react';
import { useGsapContext } from '@/hooks/useGsapContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { timelines, type TimelineName } from '@/motion/registry';

/**
 * Generic choreography leaf — the ONLY client boundary a section needs. Wraps the
 * server-rendered markup and mounts the named timeline; owns zero content, so the
 * HTML (copy, SEO) stays on the server. `display: contents` keeps it out of layout.
 */
export function Choreography({ name, children }: { name: TimelineName; children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGsapContext(
    scope,
    () => {
      if (!scope.current) return;
      const mobile = window.matchMedia('(max-width: 767px)').matches;
      timelines[name](scope.current, { reduced, mobile });
    },
    [reduced, name],
  );

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
