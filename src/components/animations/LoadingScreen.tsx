'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ParticleBackground } from './ParticleBackground';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [viewportHeight, setViewportHeight] = useState<string | number>('100dvh');
  const [isParticlesReady, setIsParticlesReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const instructionRef = useRef<HTMLDivElement>(null);
  const loadingStartTime = useRef(Date.now());

  // Handle mobile viewport height
  useEffect(() => {
    const updateHeight = () => {
      const isMobile = window.innerWidth < 1000;
      if (isMobile && window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      } else {
        setViewportHeight('100dvh');
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
    }

    return () => {
      window.removeEventListener('resize', updateHeight);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight);
      }
    };
  }, []);

  // Animate instruction text
  useEffect(() => {
    if (isParticlesReady && instructionRef.current) {
      gsap.fromTo(
        instructionRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.3,
        }
      );
    }
  }, [isParticlesReady]);

  const handleParticlesReady = () => {
    // Ensure minimum loading time of 1.5 seconds
    const elapsed = Date.now() - loadingStartTime.current;
    const remainingTime = Math.max(0, 1500 - elapsed);

    setTimeout(() => {
      setIsParticlesReady(true);
    }, remainingTime);
  };

  const handleEnterSite = () => {
    if (isExiting) return;
    setIsExiting(true);

    // Fade out animation
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        onComplete();
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-hcs-black flex flex-col items-center justify-center"
      style={{ height: viewportHeight }}
    >
      {/* Particle Background with Logo */}
      <ParticleBackground
        logoPath="/images/hcs-logo.svg"
        backgroundColor="#0a0a0a"
        onLoadComplete={handleParticlesReady}
      />

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-hcs-black/30" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(rgba(220,38,38,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-accent/30 pointer-events-none" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-accent/30 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-accent/30 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-accent/30 pointer-events-none" />

      {/* Instruction to interact */}
      {isParticlesReady && (
        <div
          ref={instructionRef}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 opacity-0"
        >
          <p className="text-xs md:text-sm text-muted tracking-[0.3em] uppercase">
            Mova o cursor para interagir
          </p>

          {/* Enter button */}
          <button
            onClick={handleEnterSite}
            className="group relative px-8 py-3 overflow-hidden"
          >
            {/* Button background */}
            <span className="absolute inset-0 bg-transparent border border-accent/50 group-hover:border-accent transition-colors duration-300" />

            {/* Hover fill effect */}
            <span className="absolute inset-0 bg-accent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />

            {/* Button text */}
            <span className="relative z-10 text-sm font-medium tracking-widest uppercase text-white group-hover:text-white transition-colors duration-300">
              Entrar
            </span>
          </button>
        </div>
      )}

      {/* Loading indicator before particles are ready */}
      {!isParticlesReady && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-xs text-muted tracking-widest uppercase">Carregando</p>
        </div>
      )}
    </div>
  );
}