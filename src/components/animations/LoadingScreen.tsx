'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { AnimatedBackground } from './AnimatedBackground';
import { LogoParticles } from './LogoParticles';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [viewportHeight, setViewportHeight] = useState<string | number>('100dvh');
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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

  // Animate content when ready
  useEffect(() => {
    if (isReady && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.3,
        }
      );
    }
  }, [isReady]);

  const handleParticlesReady = () => {
    // Ensure minimum loading time
    const elapsed = Date.now() - loadingStartTime.current;
    const remainingTime = Math.max(0, 1500 - elapsed);

    setTimeout(() => {
      setIsReady(true);
    }, remainingTime);
  };

  const handleEnterSite = () => {
    if (isExiting) return;
    setIsExiting(true);

    // Exit animation
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    tl.to(contentRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
    });

    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      },
      '-=0.2'
    );
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-hcs-black"
      style={{ height: viewportHeight }}
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Logo Particles */}
      <LogoParticles
        logoPath="/images/hcs-logo.png"
        onReady={handleParticlesReady}
      />

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-accent/30 pointer-events-none" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-accent/30 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-accent/30 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-accent/30 pointer-events-none" />

      {/* Bottom content */}
      <div
        ref={contentRef}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 z-20 opacity-0"
      >
        {isReady ? (
          <>
            <p className="text-xs md:text-sm text-muted/70 tracking-[0.25em] uppercase">
              Interaja com o logo
            </p>

            <button
              onClick={handleEnterSite}
              className="group relative px-10 py-3.5 overflow-hidden"
            >
              {/* Border */}
              <span className="absolute inset-0 border border-accent/40 group-hover:border-accent transition-colors duration-300" />

              {/* Fill effect */}
              <span className="absolute inset-0 bg-accent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />

              {/* Text */}
              <span className="relative z-10 text-sm font-medium tracking-[0.2em] uppercase text-white/90 group-hover:text-white transition-colors duration-300">
                Entrar
              </span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-accent/20 border-t-accent/60 rounded-full animate-spin" />
            <p className="text-xs text-muted/50 tracking-[0.2em] uppercase">
              Carregando
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
