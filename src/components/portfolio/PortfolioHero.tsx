'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function PortfolioHero() {
  const t = useTranslations('portfolio');
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 100, opacity: 0 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 30 });

      const tl = gsap.timeline({ delay: 0.3 });

      // Line 1 reveal
      tl.to(line1Ref.current, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
      });

      // Line 2 reveal with offset
      tl.to(line2Ref.current, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
      }, '-=0.7');

      // Subtitle
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.5');

      // Marquee animation
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          ease: 'none',
          duration: 20,
          repeat: -1,
        });
      }

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.to(titleRef.current, {
            yPercent: self.progress * 30,
            duration: 0.1,
          });
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const marqueeWords = ['WEBSITES', 'E-COMMERCE', 'SAAS', 'AI', 'DESIGN', 'BRANDING'];

  return (
    <section ref={sectionRef} className="min-h-screen flex flex-col justify-center relative overflow-hidden bg-hcs-dark">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.1),transparent_50%)]" />

      {/* Animated grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Main content */}
      <div className="container-custom relative z-10 py-32">
        <div ref={titleRef} className="max-w-6xl">
          {/* Label */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-accent" />
            <span className="text-accent font-mono text-sm tracking-widest">SELECTED WORK</span>
          </div>

          {/* Large title with mask effect */}
          <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-bold leading-[0.85] mb-8">
            <span className="block overflow-hidden">
              <span ref={line1Ref} className="block text-foreground">
                {t('title').split(' ')[0] || 'My'}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span ref={line2Ref} className="block text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/50">
                {t('title').split(' ').slice(1).join(' ') || 'Projects'}
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p ref={subtitleRef} className="text-xl md:text-2xl text-muted max-w-2xl">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Infinite marquee */}
      <div className="absolute bottom-0 left-0 right-0 py-8 border-t border-card-border/50 overflow-hidden">
        <div ref={marqueeRef} className="flex gap-16 whitespace-nowrap" style={{ width: 'fit-content' }}>
          {[...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords].map((word, i) => (
            <span key={i} className="text-6xl md:text-8xl font-bold text-accent/5 flex items-center gap-16">
              {word}
              <span className="w-4 h-4 bg-accent/10 rounded-full" />
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-32 right-8 flex flex-col items-center gap-2">
        <div className="w-[1px] h-20 bg-gradient-to-b from-accent to-transparent" />
        <span className="text-xs text-muted uppercase tracking-widest rotate-90 origin-center translate-y-8">Scroll</span>
      </div>
    </section>
  );
}
