'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FloatingShapes } from '@/components/animations/FloatingShapes';

export function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const words = t('tagline').split(' ');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const masterTL = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.2,
      });

      // Animate horizontal accent line
      masterTL.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'power4.out' }
      );

      // Split text animation - each word flies in with rotation
      titleWordsRef.current.filter(Boolean).forEach((word, index) => {
        masterTL.fromTo(
          word,
          {
            opacity: 0,
            y: 120,
            rotateX: -80,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.2)',
          },
          index * 0.1
        );
      });

      // Subtle float animation on words
      titleWordsRef.current.filter(Boolean).forEach((word, i) => {
        gsap.to(word, {
          y: Math.sin(i) * 5,
          duration: 2 + i * 0.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.5 + i * 0.1,
        });
      });

      // Subtitle with letter stagger
      if (subtitleRef.current) {
        const text = subtitleRef.current.textContent || '';
        subtitleRef.current.innerHTML = '';
        text.split('').forEach((char) => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.display = 'inline-block';
          span.style.opacity = '0';
          subtitleRef.current?.appendChild(span);
        });

        masterTL.fromTo(
          subtitleRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.03,
            stagger: 0.02,
          },
          '-=0.3'
        );
      }

      // CTA buttons with bounce
      masterTL.fromTo(
        ctaRef.current?.children || [],
        {
          opacity: 0,
          y: 40,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.7)',
        },
        '-=0.2'
      );

      // Tech badges with scale and stagger
      masterTL.fromTo(
        techRef.current?.children || [],
        {
          opacity: 0,
          scale: 0,
          rotate: -10,
        },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'back.out(2)',
        },
        '-=0.3'
      );

      // Scroll indicator
      masterTL.fromTo(
        scrollRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.2'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center hero-pattern overflow-hidden"
    >
      {/* Animated background gradient that follows mouse */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, rgba(220, 38, 38, 0.15) 0%, transparent 50%)`,
          transition: 'background 0.3s ease',
        }}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
            transition: 'transform 0.5s ease',
          }}
        />
        <div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
            transition: 'transform 0.5s ease',
          }}
        />
      </div>

      {/* Interactive floating shapes */}
      <FloatingShapes />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Accent line */}
      <div
        ref={lineRef}
        className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent origin-center"
        style={{ transform: 'scaleX(0)' }}
      />

      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6 flex flex-wrap justify-center gap-x-4"
            style={{ perspective: '1000px' }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                ref={(el) => { titleWordsRef.current[i] = el; }}
                className={`inline-block ${
                  word.includes('&') || word === 'Convert' || word === 'Convertem'
                    ? 'gradient-text'
                    : ''
                }`}
                style={{
                  opacity: 0,
                  transformStyle: 'preserve-3d',
                }}
              >
                {word}
              </span>
            ))}
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
                className="px-4 py-2 bg-card/50 border border-card-border rounded-full text-sm text-muted hover:border-accent/50 hover:text-accent hover:scale-110 transition-all duration-300 cursor-default"
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
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted tracking-widest uppercase">Scroll</span>
          <div className="w-6 h-10 border-2 border-muted/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-accent rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
