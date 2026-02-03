'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AboutHero() {
  const t = useTranslations('about');
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

      // Line 2 reveal
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

      // Floating orbs
      if (orbsRef.current) {
        const orbs = orbsRef.current.children;
        Array.from(orbs).forEach((orb, i) => {
          gsap.to(orb, {
            y: 'random(-40, 40)',
            x: 'random(-30, 30)',
            scale: 'random(0.8, 1.2)',
            duration: 'random(4, 6)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.3,
          });
        });
      }

      // Grid animation
      if (gridRef.current) {
        gsap.fromTo(gridRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 2, delay: 0.5 }
        );
      }

      // Mouse parallax
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 40;
        const y = (clientY / window.innerHeight - 0.5) * 40;

        gsap.to(titleRef.current, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 1,
          ease: 'power3.out',
        });

        if (orbsRef.current) {
          gsap.to(orbsRef.current.children, {
            x: x * -0.2,
            y: y * -0.2,
            stagger: 0.05,
            duration: 1,
            ease: 'power3.out',
          });
        }
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Scroll parallax
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.to(titleRef.current, {
            yPercent: self.progress * 20,
            duration: 0.1,
          });
        },
      });

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center relative overflow-hidden bg-hcs-dark">
      {/* Animated grid */}
      <div
        ref={gridRef}
        className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"
      />

      {/* Gradient backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(239,68,68,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(239,68,68,0.05),transparent_50%)]" />

      {/* Floating orbs */}
      <div ref={orbsRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
        <div className="absolute top-1/3 right-1/5 w-24 h-24 bg-accent/15 rounded-full blur-lg" />
      </div>

      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[25vw] font-bold text-accent/[0.02] whitespace-nowrap">
          ABOUT
        </span>
      </div>

      <div className="container-custom relative z-10 py-32">
        <div ref={titleRef} className="max-w-5xl mx-auto text-center">
          {/* Label */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-accent" />
            <span className="text-accent font-mono text-sm tracking-widest">WHO I AM</span>
            <div className="w-12 h-[2px] bg-accent" />
          </div>

          {/* Large title with mask effect */}
          <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-bold leading-[1.1] mb-8">
            <span className="block overflow-hidden pb-2">
              <span ref={line1Ref} className="block text-foreground">
                {t('pageTitle').split(' ')[0] || 'About'}
              </span>
            </span>
            <span className="block overflow-hidden pb-4">
              <span ref={line2Ref} className="block text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent to-accent/50">
                {t('pageTitle').split(' ').slice(1).join(' ') || 'Me'}
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p ref={subtitleRef} className="text-xl md:text-2xl text-muted max-w-2xl mx-auto">
            {t('pageSubtitle')}
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-6 h-10 border-2 border-accent/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-accent rounded-full animate-bounce" />
        </div>
        <span className="text-xs text-muted uppercase tracking-widest">Scroll</span>
      </div>
    </section>
  );
}
