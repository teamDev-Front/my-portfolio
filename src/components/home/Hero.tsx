'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FloatingShapes } from '@/components/animations/FloatingShapes';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const glitchOverlayRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const tagline = t('tagline');

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Main animation sequence
  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = charsRef.current.filter(Boolean);
      if (chars.length === 0) return;

      // Initial state - chars scattered in 3D space
      chars.forEach((char, i) => {
        const randomX = (Math.random() - 0.5) * 800;
        const randomY = (Math.random() - 0.5) * 600;
        const randomZ = Math.random() * 500 - 250;
        const randomRotateX = (Math.random() - 0.5) * 360;
        const randomRotateY = (Math.random() - 0.5) * 360;
        const randomRotateZ = (Math.random() - 0.5) * 180;

        gsap.set(char, {
          x: randomX,
          y: randomY,
          z: randomZ,
          rotateX: randomRotateX,
          rotateY: randomRotateY,
          rotateZ: randomRotateZ,
          opacity: 0,
          scale: 0,
        });
      });

      const masterTL = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.3,
        onComplete: () => setIsAnimationComplete(true),
      });

      // Glitch overlay flash
      masterTL.fromTo(
        glitchOverlayRef.current,
        { opacity: 0 },
        { opacity: 0.8, duration: 0.1 }
      );

      masterTL.to(glitchOverlayRef.current, {
        opacity: 0,
        duration: 0.1,
      });

      // Characters appear scattered with glow
      masterTL.to(chars, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: {
          each: 0.02,
          from: 'random',
        },
      });

      // Hold scattered state briefly
      masterTL.to({}, { duration: 0.5 });

      // Another glitch flash before assembly
      masterTL.to(glitchOverlayRef.current, {
        opacity: 0.6,
        duration: 0.05,
      });
      masterTL.to(glitchOverlayRef.current, {
        opacity: 0,
        duration: 0.05,
      });

      // Characters fly to their positions with elastic ease
      masterTL.to(chars, {
        x: 0,
        y: 0,
        z: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        stagger: {
          each: 0.03,
          from: 'center',
        },
      });

      // Subtle floating animation for each character after assembly
      chars.forEach((char, i) => {
        gsap.to(char, {
          y: Math.sin(i * 0.5) * 3,
          duration: 2 + (i % 3) * 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 2.5 + i * 0.05,
        });
      });

      // Subtitle with typewriter effect
      if (subtitleRef.current) {
        const text = subtitleRef.current.textContent || '';
        subtitleRef.current.innerHTML = '';

        text.split('').forEach((char) => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.display = 'inline-block';
          span.style.opacity = '0';
          span.style.transform = 'translateY(20px)';
          subtitleRef.current?.appendChild(span);
        });

        masterTL.fromTo(
          subtitleRef.current.children,
          { opacity: 0, y: 20, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.03,
            stagger: 0.015,
          },
          '-=0.5'
        );
      }

      // CTA buttons with 3D flip effect
      masterTL.fromTo(
        ctaRef.current?.children || [],
        {
          opacity: 0,
          y: 60,
          rotateX: -90,
          transformOrigin: 'top center',
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.7)',
        },
        '-=0.3'
      );

      // Tech badges spiral in
      const techBadges = techRef.current?.children || [];
      Array.from(techBadges).forEach((badge, i) => {
        const angle = (i / techBadges.length) * Math.PI * 2;
        const radius = 200;
        gsap.set(badge, {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          scale: 0,
          rotation: 360,
          opacity: 0,
        });
      });

      masterTL.to(
        techBadges,
        {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out(2)',
        },
        '-=0.4'
      );

      // Scroll indicator with bounce
      masterTL.fromTo(
        scrollRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'bounce.out' },
        '-=0.3'
      );

      // Parallax scroll effect on hero
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          if (titleContainerRef.current) {
            gsap.to(titleContainerRef.current, {
              y: self.progress * 150,
              opacity: 1 - self.progress * 0.8,
              duration: 0.1,
            });
          }
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Render characters for animation
  const renderChars = useCallback(() => {
    let charIndex = 0;
    const words = tagline.split(' ');

    return words.map((word, wordIndex) => {
      const isHighlight = word.includes('&') || word === 'Convert' || word === 'Convertem';

      const chars = word.split('').map((char, i) => {
        const currentIndex = charIndex++;
        return (
          <span
            key={`${wordIndex}-${i}`}
            ref={(el) => { charsRef.current[currentIndex] = el; }}
            className={`inline-block ${isHighlight ? 'gradient-text' : ''}`}
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity',
            }}
          >
            {char}
          </span>
        );
      });

      return (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-4">
          {chars}
        </span>
      );
    });
  }, [tagline]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Glitch overlay */}
      <div
        ref={glitchOverlayRef}
        className="absolute inset-0 z-50 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, rgba(220, 38, 38, 0.3), rgba(59, 130, 246, 0.3), rgba(220, 38, 38, 0.3))',
          mixBlendMode: 'screen',
          opacity: 0,
        }}
      />

      {/* Animated background gradient that follows mouse */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, rgba(220, 38, 38, 0.15) 0%, transparent 50%)`,
          transition: 'background 0.3s ease',
        }}
      />

      {/* Animated background elements with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)`,
            transition: 'transform 0.5s ease',
          }}
        />
        <div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)`,
            transition: 'transform 0.5s ease',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl"
          style={{
            transform: `translate(calc(-50% + ${mousePosition.x * 20}px), calc(-50% + ${mousePosition.y * 20}px)) scale(${1 + Math.abs(mousePosition.x) * 0.1})`,
            transition: 'transform 0.5s ease',
          }}
        />
      </div>

      {/* Interactive floating shapes */}
      <FloatingShapes />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div ref={titleContainerRef} className="container-custom relative z-10 pt-32 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main title with 3D character animation */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-8 flex flex-wrap justify-center"
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
          >
            {renderChars()}
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-muted max-w-4xl text-nowrap mx-auto mb-10"
          >
            {t('subtitle')}
          </p>

          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            style={{ perspective: '1000px' }}
          >
            <Button href={`/${locale}/contact`} size="lg" className="group magnetic-btn">
              {t('cta')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button href={`/${locale}/portfolio`} variant="outline" size="lg" className="magnetic-btn">
              <Play className="mr-2 w-5 h-5" />
              {t('secondaryCta')}
            </Button>
          </div>

          {/* Tech stack badges */}
          <div ref={techRef} className="mt-16 flex flex-wrap justify-center gap-3">
            {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'AI/LLM'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-card/50 border border-card-border rounded-full text-sm text-muted hover:border-accent/50 hover:text-accent hover:scale-110 transition-all duration-300 cursor-default backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        style={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center gap-2 group cursor-pointer">
          <span className="text-xs text-muted tracking-widest uppercase group-hover:text-accent transition-colors">
            Scroll
          </span>
          <div className="w-6 h-10 border-2 border-muted/50 rounded-full flex items-start justify-center p-2 group-hover:border-accent/50 transition-colors">
            <div className="w-1.5 h-3 bg-accent rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-accent/20 rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-accent/20 rounded-tr-lg" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-accent/20 rounded-bl-lg" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-accent/20 rounded-br-lg" />
    </section>
  );
}
