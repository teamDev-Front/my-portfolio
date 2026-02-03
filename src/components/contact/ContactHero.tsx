'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ContactHero() {
  const t = useTranslations('contact');
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);

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

      // Floating orbs animation
      if (orbsRef.current) {
        const orbs = orbsRef.current.children;
        Array.from(orbs).forEach((orb, i) => {
          gsap.to(orb, {
            y: 'random(-30, 30)',
            x: 'random(-20, 20)',
            scale: 'random(0.8, 1.2)',
            duration: 'random(3, 5)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.2,
          });
        });
      }

      // Mouse parallax effect
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 30;
        const y = (clientY / window.innerHeight - 0.5) * 30;

        gsap.to(titleRef.current, {
          x: x * 0.5,
          y: y * 0.5,
          duration: 1,
          ease: 'power3.out',
        });

        if (orbsRef.current) {
          gsap.to(orbsRef.current.children, {
            x: x * -0.3,
            y: y * -0.3,
            stagger: 0.05,
            duration: 1,
            ease: 'power3.out',
          });
        }
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[70vh] flex items-center justify-center relative overflow-hidden bg-hcs-dark">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(239,68,68,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.1),transparent_50%)]" />

      {/* Floating orbs */}
      <div ref={orbsRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-accent/20 rounded-full blur-lg" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Main content */}
      <div className="container-custom relative z-10 py-32">
        <div ref={titleRef} className="max-w-5xl mx-auto text-center">
          {/* Large title with mask effect */}
          <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-bold leading-[0.9] mb-8">
            <span className="block overflow-hidden">
              <span ref={line1Ref} className="block text-foreground">
                Let&apos;s Work
              </span>
            </span>
            <span className="block overflow-hidden">
              <span ref={line2Ref} className="block text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent to-accent/50">
                Together
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p ref={subtitleRef} className="text-xl md:text-2xl text-muted max-w-2xl mx-auto">
            {t('pageSubtitle')}
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-hcs-dark to-transparent" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-6 h-10 border-2 border-accent/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-accent rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
