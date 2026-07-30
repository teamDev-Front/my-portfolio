'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Single registration point for GSAP plugins. Import { gsap, ScrollTrigger } FROM HERE,
 * never from "gsap" directly — this guarantees plugins register exactly once and only
 * on the client, and keeps the motion language consistent via shared defaults.
 */
let registered = false;

export function registerGsap(): void {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 0.6 });
  registered = true;
}

registerGsap();

export { gsap, ScrollTrigger };
