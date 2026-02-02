'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Exit animation
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.8,
            ease: 'power4.inOut',
            onComplete,
          });
        },
      });

      // Animate SVG paths drawing
      const paths = logoRef.current?.querySelectorAll('path');
      if (paths) {
        paths.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
        });

        tl.to(paths, {
          strokeDashoffset: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: 'power2.inOut',
        });
      }

      // Progress bar animation
      tl.to(
        progressRef.current,
        {
          scaleX: 1,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: function () {
            setProgress(Math.round(this.progress() * 100));
          },
        },
        0
      );

      // Text reveal
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        0.5
      );

      // Logo glow pulse
      tl.to(
        logoRef.current,
        {
          filter: 'drop-shadow(0 0 30px rgba(220, 38, 38, 0.8))',
          duration: 0.3,
          repeat: 2,
          yoyo: true,
        },
        1.2
      );

      // Hold briefly before exit
      tl.to({}, { duration: 0.3 });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-hcs-black flex flex-col items-center justify-center"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse" />
      </div>

      {/* Logo */}
      <svg
        ref={logoRef}
        width="120"
        height="120"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-8"
      >
        {/* Top left heart */}
        <path
          d="M25 35 Q25 20 40 20 Q55 20 55 35 Q55 50 40 65 Q25 50 25 35"
          stroke="#dc2626"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Top right heart */}
        <path
          d="M75 35 Q75 20 60 20 Q45 20 45 35 Q45 50 60 65 Q75 50 75 35"
          stroke="#dc2626"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Bottom left heart */}
        <path
          d="M25 65 Q25 50 40 50 Q55 50 55 65 Q55 80 40 95 Q25 80 25 65"
          stroke="#dc2626"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Bottom right heart */}
        <path
          d="M75 65 Q75 50 60 50 Q45 50 45 65 Q45 80 60 95 Q75 80 75 65"
          stroke="#dc2626"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Center circle */}
        <circle cx="50" cy="50" r="8" fill="#dc2626" opacity="0">
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.5s"
            begin="1s"
            fill="freeze"
          />
        </circle>
      </svg>

      {/* Text */}
      <div ref={textRef} className="text-center opacity-0">
        <h1 className="text-2xl font-bold text-white tracking-wider">HABAEB</h1>
        <p className="text-xs tracking-[0.3em] text-muted mt-1">CREATIVE SOLUTIONS</p>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48">
        <div className="h-0.5 bg-hcs-gray rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-accent origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
        <p className="text-center text-muted text-xs mt-2">{progress}%</p>
      </div>
    </div>
  );
}
