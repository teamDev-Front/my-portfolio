'use client';

import { useSyncExternalStore } from 'react';

/**
 * The experience store — SEMANTIC state only: which section of the journey the visitor
 * is in, whether an overlay owns the viewport, and the device quality tier.
 * NO per-frame values here — HUD/telemetry animation goes through refs, CSS vars or
 * GSAP writes to textContent, never a React re-render per frame.
 *
 * Deliberately dependency-free: a ~40-line vanilla store read via useSyncExternalStore.
 * Timelines (plain TS) mutate it through `experienceActions`; components subscribe with
 * `useExperience(selector)` — select PRIMITIVES so the server snapshot stays stable.
 */

/** Journey stages on the homepage; internal routes use "page". */
export type JourneyStage =
  | 'hero'
  | 'about'
  | 'services'
  | 'portfolio'
  | 'results'
  | 'contact'
  | 'footer'
  | 'page';

/** high = full choreography · reduced = short pins, no heavy canvas · static = no motion. */
export type QualityTier = 'high' | 'reduced' | 'static';

export interface ExperienceState {
  stage: JourneyStage;
  menuOpen: boolean;
  /** Project slug currently open in the detail overlay (null = none). */
  activeProjectSlug: string | null;
  quality: QualityTier;
}

const initialState: ExperienceState = {
  stage: 'hero',
  menuOpen: false,
  activeProjectSlug: null,
  quality: 'high',
};

let state: ExperienceState = initialState;
const listeners = new Set<() => void>();

function set(partial: Partial<ExperienceState>): void {
  state = { ...state, ...partial };
  listeners.forEach((l) => l());
}

export const experienceStore = {
  get: (): ExperienceState => state,
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export const experienceActions = {
  setStage: (stage: JourneyStage) => set({ stage }),
  setMenuOpen: (menuOpen: boolean) => set({ menuOpen }),
  openProject: (slug: string) => set({ activeProjectSlug: slug }),
  closeProject: () => set({ activeProjectSlug: null }),
  setQuality: (quality: QualityTier) => set({ quality }),
};

/** Subscribe to a slice of the experience state. Select primitives, not objects. */
export function useExperience<T>(selector: (s: ExperienceState) => T): T {
  return useSyncExternalStore(
    experienceStore.subscribe,
    () => selector(state),
    () => selector(initialState),
  );
}
