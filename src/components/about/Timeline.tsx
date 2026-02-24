'use client';

import { useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { timeline } from '@/lib/data/timeline';
import type { Locale } from '@/i18n/routing';

gsap.registerPlugin(ScrollTrigger);

export function Timeline() {
  const t = useTranslations('about.timeline');
  const locale = useLocale() as Locale;
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Line drawing animation
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Timeline items and dots
      itemsRef.current.forEach((item, index) => {
        if (!item) return;
        const dot = dotsRef.current[index];
        const isEven = index % 2 === 0;

        // Dot animation
        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          // Pulse effect on dot
          gsap.to(dot, {
            boxShadow: '0 0 20px rgba(220, 38, 38, 0.5)',
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.2,
          });
        }

        // Item card animation
        gsap.fromTo(
          item,
          {
            opacity: 0,
            x: isEven ? -60 : 60,
            rotateY: isEven ? -15 : 15,
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-hcs-dark relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container-custom relative">
        <div ref={titleRef}>
          <span className="text-accent font-mono text-sm mb-4 block text-center">TIMELINE</span>
          <SectionTitle title={t('title')} />
        </div>

        <div className="max-w-3xl mx-auto mt-12">
          <div className="relative">
            {/* Timeline line */}
            <div
              ref={lineRef}
              className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/50 to-transparent md:-translate-x-1/2 origin-top"
            />

            {timeline.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`relative flex items-center mb-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Content */}
                  <div
                    ref={(el) => { itemsRef.current[index] = el; }}
                    className={`flex-1 ml-4 md:ml-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}
                    style={{ perspective: '1000px' }}
                  >
                    <div className="bg-card rounded-xl border border-card-border p-4 md:p-6 hover:border-accent/50 transition-colors duration-300">
                      <div className={`flex items-center gap-2 mb-2 ${isEven ? 'justify-start md:justify-end' : 'justify-start'}`}>
                        {item.isCurrent && (
                          <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full animate-pulse">
                            {t('current')}
                          </span>
                        )}
                        <span className="text-accent font-bold">{item.year}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {item.translations[locale].title}
                      </h3>
                      <p className="text-sm text-accent mb-2">
                        {item.translations[locale].company}
                      </p>
                      <p className="text-sm text-muted">
                        {item.translations[locale].description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div
                    ref={(el) => { dotsRef.current[index] = el; }}
                    className="absolute left-0 md:left-1/2 w-4 h-4 bg-accent rounded-full border-4 border-background -translate-x-1/2"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
