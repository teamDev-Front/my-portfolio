'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shapeRefs = useRef<(SVGPathElement | null)[]>([]);

  // useLayoutEffect ensures GSAP sets initial states before browser paints,
  // preventing a frame where elements are visible without animations
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate floating orbs
      orbRefs.current.forEach((orb, i) => {
        if (!orb) return;

        // Initial entrance animation
        gsap.fromTo(orb,
          {
            scale: 0,
            opacity: 0
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1.5,
            delay: i * 0.2,
            ease: 'power2.out',
          }
        );

        // Continuous floating animation
        gsap.to(orb, {
          x: `+=${30 + i * 10}`,
          y: `+=${20 + i * 15}`,
          duration: 4 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        });

        // Subtle scale breathing
        gsap.to(orb, {
          scale: 1.1,
          duration: 3 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2,
        });
      });

      // Animate SVG shapes
      shapeRefs.current.forEach((shape, i) => {
        if (!shape) return;

        // Draw animation
        const length = shape.getTotalLength();
        gsap.set(shape, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });

        gsap.to(shape, {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 2,
          delay: 0.5 + i * 0.3,
          ease: 'power2.inOut',
        });

        // Subtle pulse after drawing
        gsap.to(shape, {
          opacity: 0.6,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 2.5 + i * 0.3,
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Red gradient orb - top left */}
      <div
        ref={(el) => { orbRefs.current[0] = el; }}
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle at 60% 60%, rgba(180, 30, 30, 0.4) 0%, rgba(120, 20, 20, 0.2) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Red arc glow - bottom right */}
      <div
        ref={(el) => { orbRefs.current[1] = el; }}
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(220, 50, 50, 0.3) 0%, rgba(150, 30, 30, 0.15) 30%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Ambient glow - center */}
      <div
        ref={(el) => { orbRefs.current[2] = el; }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.05) 0%, transparent 50%)',
          filter: 'blur(80px)',
        }}
      />

      {/* SVG Geometric Shapes */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Left chevron < */}
        <path
          ref={(el) => { shapeRefs.current[0] = el; }}
          d="M 58 25 L 48 35 L 58 45"
          fill="none"
          stroke="rgba(80, 80, 90, 0.4)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right chevron > */}
        <path
          ref={(el) => { shapeRefs.current[1] = el; }}
          d="M 62 25 L 72 35 L 62 45"
          fill="none"
          stroke="rgba(80, 80, 90, 0.4)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* X in center */}
        <path
          ref={(el) => { shapeRefs.current[2] = el; }}
          d="M 57 32 L 63 38 M 63 32 L 57 38"
          fill="none"
          stroke="rgba(80, 80, 90, 0.5)"
          strokeWidth="0.6"
          strokeLinecap="round"
        />

        {/* Large decorative arc */}
        <path
          ref={(el) => { shapeRefs.current[3] = el; }}
          d="M 30 85 Q 50 60 80 75"
          fill="none"
          stroke="rgba(70, 70, 80, 0.3)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* Small accent curve */}
        <path
          ref={(el) => { shapeRefs.current[4] = el; }}
          d="M 25 50 Q 35 45 40 55"
          fill="none"
          stroke="rgba(70, 70, 80, 0.25)"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Red arc stroke - bottom right */}
      <svg
        className="absolute bottom-0 right-0 w-[60%] h-[60%]"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMaxYMax slice"
      >
        {/* Glow layer */}
        <circle
          cx="120"
          cy="120"
          r="70"
          fill="none"
          stroke="rgba(200, 40, 40, 0.15)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="120 300"
          style={{ filter: 'blur(8px)' }}
        />
        {/* Main arc */}
        <circle
          ref={(el) => { shapeRefs.current[5] = el; }}
          cx="120"
          cy="120"
          r="70"
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="120 300"
        />
        {/* Inner bright edge */}
        <circle
          cx="120"
          cy="120"
          r="70"
          fill="none"
          stroke="rgba(255, 100, 100, 0.5)"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeDasharray="120 300"
        />
        <defs>
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(220, 50, 50, 1)" />
            <stop offset="50%" stopColor="rgba(180, 35, 35, 0.9)" />
            <stop offset="100%" stopColor="rgba(120, 25, 25, 0.7)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(220, 38, 38, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220, 38, 38, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
