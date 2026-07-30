'use client';

import { visual } from '@/config/visual';
import { useExperience, type JourneyStage } from '@/stores/experienceStore';

/**
 * The section wash — a deep red field breathing behind each chapter of the journey.
 * Pure CSS gradients cross-faded by opacity (1600ms): the stage flips EARLY via
 * data-stage-lead, so the long fade lets the next section's colour cross UNDER the
 * outgoing beat (seam lead). Cheap, reversible, reduced-motion friendly.
 * Sits at z-0, under all content.
 */
export function BackgroundWash() {
  const stage = useExperience((s) => s.stage);

  return (
    <div aria-hidden data-background-wash className="pointer-events-none fixed inset-0 z-0">
      {(Object.keys(visual.washes) as JourneyStage[]).map((key) => {
        const wash = visual.washes[key];
        if (!wash) return null;
        return (
          <div
            key={key}
            data-wash={key}
            className="absolute inset-0 transition-opacity duration-[1600ms]"
            style={{
              backgroundImage: wash,
              opacity: stage === key ? 1 : 0,
              transitionTimingFunction: 'var(--ease-hcs)',
            }}
          />
        );
      })}
    </div>
  );
}
