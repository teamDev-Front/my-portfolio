'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ServicesHero() {
  const t = useTranslations('servicesPage');
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(titleRef.current, { yPercent: 100 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 30 });

      const tl = gsap.timeline({ delay: 0.3 });

      // Title reveal with mask
      tl.to(titleRef.current, {
        yPercent: 0,
        duration: 1.2,
        ease: 'power4.out',
      });

      // Animated line drawing
      if (lineRef.current) {
        tl.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 1, ease: 'power2.inOut' },
          '-=0.6'
        );
      }

      // Subtitle fade
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.4');

      // Animated counter numbers
      if (numbersRef.current) {
        const items = numbersRef.current.querySelectorAll('.number-item');

        tl.fromTo(
          items,
          {
            opacity: 0,
            y: 60,
            rotateX: -90,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)',
          },
          '-=0.4'
        );

        // Animate the actual numbers counting up
        items.forEach((item) => {
          const numberEl = item.querySelector('.number-value');
          if (numberEl) {
            const finalValue = parseInt(numberEl.getAttribute('data-value') || '0');
            gsap.fromTo(
              { val: 0 },
              { val: finalValue },
              {
                duration: 2,
                ease: 'power2.out',
                delay: 1,
                onUpdate: function() {
                  if (numberEl) {
                    numberEl.textContent = Math.round(this.targets()[0].val) + '+';
                  }
                },
              }
            );
          }
        });
      }

      // Parallax scroll effect
      gsap.to(titleRef.current, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center relative overflow-hidden bg-hcs-dark">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:100px_100px] animate-pulse" />

      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[20vw] font-bold text-accent/[0.02] whitespace-nowrap">
          SERVICES
        </span>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Label */}
          <div className="flex items-center gap-4 mb-8">
            <div ref={lineRef} className="w-12 h-[2px] bg-accent" />
            <span className="text-accent font-mono text-sm tracking-widest">WHAT I DO</span>
          </div>

          {/* Title with mask */}
          <div ref={maskRef} className="overflow-hidden mb-8">
            <h1
              ref={titleRef}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[0.9]"
            >
              {t('pageTitle')}
            </h1>
          </div>

          {/* Subtitle */}
          <p ref={subtitleRef} className="text-xl md:text-2xl text-muted max-w-2xl mb-16">
            {t('pageSubtitle')}
          </p>

          {/* Animated stats */}
          <div ref={numbersRef} className="grid grid-cols-3 gap-8 max-w-xl" style={{ perspective: '1000px' }}>
            <div className="number-item text-center" style={{ transformStyle: 'preserve-3d' }}>
              <div className="number-value text-5xl md:text-6xl font-bold text-accent mb-2" data-value="50">0+</div>
              <div className="text-sm text-muted uppercase tracking-wider">Projects</div>
            </div>
            <div className="number-item text-center" style={{ transformStyle: 'preserve-3d' }}>
              <div className="number-value text-5xl md:text-6xl font-bold text-accent mb-2" data-value="8">0+</div>
              <div className="text-sm text-muted uppercase tracking-wider">Years</div>
            </div>
            <div className="number-item text-center" style={{ transformStyle: 'preserve-3d' }}>
              <div className="number-value text-5xl md:text-6xl font-bold text-accent mb-2" data-value="6">0+</div>
              <div className="text-sm text-muted uppercase tracking-wider">Services</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-muted uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-accent to-transparent animate-pulse" />
      </div>
    </section>
  );
}
