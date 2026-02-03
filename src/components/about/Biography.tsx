'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTitle } from '@/components/ui/SectionTitle';

gsap.registerPlugin(ScrollTrigger);

export function Biography() {
  const t = useTranslations('about.bio');
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image animation
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            opacity: 0,
            x: -80,
            scale: 0.9,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Floating animation
        gsap.to(imageRef.current, {
          y: -15,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Content animation
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.querySelector('h2'),
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Paragraphs stagger animation
      paragraphsRef.current.forEach((p, index) => {
        if (!p) return;

        gsap.fromTo(
          p,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: p,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div
            ref={imageRef}
            className="relative max-w-md mx-auto lg:mx-0"
          >
            <div className="aspect-[4/5] bg-card rounded-2xl border border-card-border overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-40 h-40 mx-auto bg-gradient-to-br from-accent/20 to-accent/5 rounded-full flex items-center justify-center mb-6 relative">
                    <span className="text-6xl font-bold gradient-text">LH</span>
                    <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" style={{ animationDuration: '3s' }} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Luiz Habaeb</h3>
                  <p className="text-muted">Front-End Developer</p>
                  <p className="text-accent text-sm mt-2">HCS Founder</p>

                  {/* Status */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-muted">Available for projects</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
          </div>

          {/* Content Side */}
          <div ref={contentRef}>
            <span className="text-accent font-mono text-sm mb-4 block">MY STORY</span>
            <SectionTitle title={t('title')} centered={false} className="mb-8" />

            <div className="space-y-4 text-muted leading-relaxed">
              <p ref={(el) => { paragraphsRef.current[0] = el; }}>{t('p1')}</p>
              <p ref={(el) => { paragraphsRef.current[1] = el; }}>{t('p2')}</p>
              <p ref={(el) => { paragraphsRef.current[2] = el; }}>{t('p3')}</p>
              <p
                ref={(el) => { paragraphsRef.current[3] = el; }}
                className="text-foreground font-medium border-l-2 border-accent pl-4"
              >
                {t('p4')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
