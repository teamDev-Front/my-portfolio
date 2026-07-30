import { heroTimeline } from '@/motion/hero.timeline';
import { aboutTimeline } from '@/motion/about.timeline';
import { servicesTimeline } from '@/motion/services.timeline';
import { portfolioTimeline } from '@/motion/portfolio.timeline';
import type { TimelineFactory } from '@/motion/types';

/**
 * Timeline registry consumed by the generic <Choreography name="..."> leaf.
 * One entry per section; adding a section = one timeline file + one entry here.
 */
export const timelines = {
  hero: heroTimeline,
  about: aboutTimeline,
  services: servicesTimeline,
  portfolio: portfolioTimeline,
} satisfies Record<string, TimelineFactory>;

export type TimelineName = keyof typeof timelines;
