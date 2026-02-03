'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ContactHero() {
  const t = useTranslations('contact');
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Title animation
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          }
        );
      }

      // Subtitle animation
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        );
      }

      // Decorative elements
      if (decorRef.current) {
        const elements = decorRef.current.children;
        tl.fromTo(
          elements,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(2)',
          },
          '-=0.5'
        );

        // Floating animation
        Array.from(elements).forEach((el, i) => {
          gsap.to(el, {
            y: (i % 2 === 0 ? -20 : 20),
            rotation: (i % 2 === 0 ? 10 : -10),
            duration: 2 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });
      }

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          if (titleRef.current) {
            gsap.to(titleRef.current, {
              y: self.progress * 50,
              duration: 0.1,
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="pt-32 pb-16 hero-pattern relative overflow-hidden">
      {/* Decorative elements */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 border border-accent/20 rounded-full" />
        <div className="absolute top-40 right-20 w-4 h-4 bg-accent/30 rounded-full" />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-accent/10 rotate-45" />
        <div className="absolute top-1/3 right-10 w-3 h-3 bg-accent/40 rounded-full" />
        <div className="absolute bottom-32 right-1/3 w-8 h-8 border-2 border-accent/20 rounded-lg rotate-12" />
      </div>

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-accent font-mono text-sm mb-4 block">CONTACT</span>
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            {t('pageTitle')}
          </h1>
          <p ref={subtitleRef} className="text-xl text-muted">
            {t('pageSubtitle')}
          </p>
        </div>
      </div>
    </section>
  );
}
