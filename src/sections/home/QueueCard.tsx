'use client';

import type { ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { experienceActions } from '@/stores/experienceStore';

/**
 * One card in the portfolio queue. Rendered as a real <a> to the case-study page — the
 * crawler and middle-click/Cmd-click get a genuine href — but a plain click is intercepted
 * to open the detail overlay instead. Position/scale/opacity are owned entirely by
 * portfolio.timeline.ts; this component only owns interaction.
 *
 * Keyboard parity with the pointer: tabbing to a card fires `queue:focus`, and the
 * timeline advances the queue until that card reaches the front slot — so a keyboard
 * visitor is never looking at a card parked off-stage. Pointer events are disabled on
 * non-front cards ([data-queue-front], written by the timeline) so a click always hits
 * the work the visitor can actually see.
 */
export function QueueCard({
  slug,
  index,
  title,
  category,
  children,
}: {
  slug: string;
  index: number;
  title: string;
  category: string;
  children: ReactNode;
}) {
  const locale = useLocale();
  const href = `/${locale}/portfolio/${slug}`;

  return (
    <a
      href={href}
      data-queue-card={index}
      data-queue-front={index === 0 ? 'on' : 'off'}
      aria-label={`${title} — ${category}`}
      onClick={(e) => {
        // Let modified clicks and middle-clicks behave like a normal link.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        experienceActions.openProject(slug);
      }}
      onKeyDown={(e) => {
        // Enter follows the link (full page — better for keyboard users); Space opens
        // the overlay, matching the pointer affordance.
        if (e.key === ' ') {
          e.preventDefault();
          experienceActions.openProject(slug);
        }
      }}
      onFocus={(e) => {
        // Bring the focused card to the front slot — keyboard gets the same view as hover.
        e.currentTarget.dispatchEvent(
          new CustomEvent('queue:focus', { detail: { index }, bubbles: true }),
        );
      }}
      className="absolute left-1/2 top-1/2 block w-[40vw] max-w-[560px] min-w-[240px] will-change-transform data-[queue-front=off]:pointer-events-none"
    >
      {children}
    </a>
  );
}
