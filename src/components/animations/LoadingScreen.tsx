'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const overlayTopRef = useRef<HTMLDivElement>(null);
  const overlayBottomRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);

  const brandName = 'HABAEB';

  useEffect(() => {
    const ctx = gsap.context(() => {
      const masterTL = gsap.timeline();

      // Create floating particles
      if (particlesRef.current) {
        for (let i = 0; i < 30; i++) {
          const particle = document.createElement('div');
          particle.className = 'absolute w-1 h-1 bg-accent rounded-full opacity-0';
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particlesRef.current.appendChild(particle);

          gsap.to(particle, {
            opacity: Math.random() * 0.5 + 0.2,
            scale: Math.random() * 2 + 0.5,
            duration: Math.random() * 2 + 1,
            delay: Math.random() * 0.5,
            repeat: -1,
            yoyo: true,
          });

          gsap.to(particle, {
            y: `${(Math.random() - 0.5) * 100}`,
            x: `${(Math.random() - 0.5) * 50}`,
            duration: Math.random() * 3 + 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
      }

      // Animate horizontal lines
      masterTL.fromTo(
        [lineLeftRef.current, lineRightRef.current],
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power4.out',
          stagger: 0.1,
        }
      );

      // Animate each letter with stagger
      masterTL.fromTo(
        lettersRef.current.filter(Boolean),
        {
          opacity: 0,
          y: 100,
          rotateX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'back.out(1.7)',
        },
        '-=0.3'
      );

      // Glitch effect on letters
      lettersRef.current.filter(Boolean).forEach((letter, i) => {
        masterTL.to(
          letter,
          {
            x: () => gsap.utils.random(-3, 3),
            y: () => gsap.utils.random(-2, 2),
            duration: 0.05,
            repeat: 5,
            yoyo: true,
            ease: 'none',
          },
          `-=${0.6 - i * 0.05}`
        );
      });

      // Color flash on letters
      masterTL.to(
        lettersRef.current.filter(Boolean),
        {
          color: '#dc2626',
          textShadow: '0 0 30px rgba(220, 38, 38, 0.8), 0 0 60px rgba(220, 38, 38, 0.4)',
          duration: 0.2,
          stagger: 0.05,
        },
        '-=0.3'
      );

      // Subtitle reveal
      masterTL.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20, letterSpacing: '0.5em' },
        {
          opacity: 1,
          y: 0,
          letterSpacing: '0.3em',
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.4'
      );

      // Progress bar fill with counter
      const progressObj = { value: 0 };
      masterTL.to(
        progressObj,
        {
          value: 100,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: () => {
            const val = Math.round(progressObj.value);
            setProgress(val);
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${val / 100})`;
            }
          },
        },
        '-=0.8'
      );

      // Scale up effect on percentage
      masterTL.fromTo(
        percentRef.current,
        { scale: 1 },
        {
          scale: 1.2,
          duration: 0.3,
          ease: 'power2.out',
        },
        '-=0.3'
      );

      // Brief pause
      masterTL.to({}, { duration: 0.3 });

      // Exit animation - dramatic reveal
      masterTL.to(lettersRef.current.filter(Boolean), {
        y: -50,
        opacity: 0,
        stagger: 0.03,
        duration: 0.4,
        ease: 'power2.in',
      });

      masterTL.to(
        [subtitleRef.current, progressBarRef.current?.parentElement, percentRef.current],
        {
          opacity: 0,
          y: -30,
          duration: 0.3,
          stagger: 0.05,
        },
        '-=0.3'
      );

      // Split screen reveal
      masterTL.to(
        overlayTopRef.current,
        {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
        },
        '-=0.1'
      );

      masterTL.to(
        overlayBottomRef.current,
        {
          yPercent: 100,
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete,
        },
        '<'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] overflow-hidden"
    >
      {/* Top overlay */}
      <div
        ref={overlayTopRef}
        className="absolute top-0 left-0 right-0 h-1/2 bg-hcs-black z-10"
      />

      {/* Bottom overlay */}
      <div
        ref={overlayBottomRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-hcs-black z-10"
      />

      {/* Main content */}
      <div className="absolute inset-0 bg-hcs-black flex flex-col items-center justify-center">
        {/* Animated particles */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* Decorative lines */}
        <div
          ref={lineLeftRef}
          className="absolute left-0 top-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
        <div
          ref={lineRightRef}
          className="absolute right-0 top-1/2 w-1/3 h-px bg-gradient-to-l from-transparent via-accent/50 to-transparent origin-right"
          style={{ transform: 'scaleX(0)' }}
        />

        {/* Logo letters */}
        <div className="relative z-20 flex items-center justify-center mb-6" style={{ perspective: '1000px' }}>
          {brandName.split('').map((letter, index) => (
            <span
              key={index}
              ref={(el) => { lettersRef.current[index] = el; }}
              className="text-6xl md:text-8xl font-black text-white inline-block"
              style={{
                opacity: 0,
                transformStyle: 'preserve-3d',
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          className="relative z-20 text-xs md:text-sm text-muted tracking-[0.3em] uppercase opacity-0"
        >
          Creative Solutions
        </div>

        {/* Progress section */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-64 z-20">
          <div className="h-px bg-white/10 rounded-full overflow-hidden mb-4">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-accent via-red-400 to-accent origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-muted">
            <span className="tracking-widest">LOADING</span>
            <span ref={percentRef} className="font-mono text-accent">
              {progress}%
            </span>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-accent/30" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-accent/30" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-accent/30" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-accent/30" />
      </div>
    </div>
  );
}
