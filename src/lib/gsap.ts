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
  // Pin with transforms, not position:fixed. Both hold the section still, but swapping an
  // element to `fixed` is reported as a layout shift by the CLS observer even though
  // nothing moves on screen — with three pinned beats that alone scored CLS ~5.6.
  // Transform pinning keeps the element in flow and scores 0.
  ScrollTrigger.defaults({ pinType: 'transform' });
  registered = true;
}

registerGsap();

export { gsap, ScrollTrigger };
