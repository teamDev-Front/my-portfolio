'use client';

import { useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, TrendingUp, Star } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { testimonials } from '@/lib/data/testimonials';
import type { Locale } from '@/i18n/routing';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale() as Locale;

  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const numberRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            reduceMotion: boolean;
          };

          const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

          if (reduceMotion) {
            gsap.set([titleRef.current, ...cards], { opacity: 1 });
            return;
          }

          // Section number - entrance + parallax
          if (numberRef.current) {
            gsap.fromTo(
              numberRef.current,
              { opacity: 0, x: -120, scale: 0.85 },
              {
                opacity: 0.03,
                x: 0,
                scale: 1,
                duration: 1.2,
                ease: 'expo.out',
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: 'top 80%',
                  toggleActions: 'play none none reverse',
                },
              }
            );

            gsap.to(numberRef.current, {
              y: -80,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            });
          }

          // Title
          gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: titleRef.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          // Cards - batch entrance with wave stagger
          gsap.set(cards, { opacity: 0, y: 80, rotateX: 18, scale: 0.9 });

          ScrollTrigger.batch(cards, {
            interval: 0.1,
            batchMax: 3,
            start: 'top 88%',
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                scale: 1,
                duration: 0.9,
                stagger: 0.12,
                ease: 'back.out(1.3)',
                overwrite: true,
              }),
            onLeaveBack: (batch) =>
              gsap.to(batch, {
                opacity: 0,
                y: 80,
                rotateX: 18,
                scale: 0.9,
                duration: 0.5,
                stagger: 0.06,
                ease: 'power2.in',
                overwrite: true,
              }),
          });

          // Subtle column parallax
          cards.forEach((card, i) => {
            gsap.to(card, {
              y: ((i % 3) - 1) * 30,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
              },
            });
          });

          if (!isDesktop || !contextSafe) return;

          const cleanups: Array<() => void> = [];

          cards.forEach((card) => {
            const onEnter = contextSafe(() =>
              gsap.to(card, {
                y: '-=12',
                scale: 1.03,
                duration: 0.4,
                ease: 'power3.out',
                overwrite: 'auto',
              })
            );

            const onLeave = contextSafe(() =>
              gsap.to(card, {
                y: '+=12',
                scale: 1,
                duration: 0.5,
                ease: 'power3.out',
                overwrite: 'auto',
              })
            );

            card.addEventListener('mouseenter', onEnter);
            card.addEventListener('mouseleave', onLeave);
            cleanups.push(() => {
              card.removeEventListener('mouseenter', onEnter);
              card.removeEventListener('mouseleave', onLeave);
            });
          });

          return () => cleanups.forEach((c) => c());
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section-padding bg-hcs-dark relative overflow-hidden">
      {/* Large background number */}
      <div
        ref={numberRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 text-[20rem] md:text-[30rem] font-bold text-foreground pointer-events-none select-none"
        style={{ opacity: 0 }}
      >
        04
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container-custom relative">
        <div ref={titleRef}>
          <span className="text-accent font-mono text-sm mb-4 block text-center">04 / TESTIMONIALS</span>
          <SectionTitle title={t('title')} subtitle={t('subtitle')} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <div
              key={testimonial.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="group bg-card rounded-2xl border border-card-border p-6 h-full flex flex-col hover:border-accent/50 transition-colors duration-300 cursor-default"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Quote icon with glow */}
              <div className="relative mb-4">
                <Quote className="w-10 h-10 text-accent/20 group-hover:text-accent/40 transition-colors" />
                <div className="absolute inset-0 w-10 h-10 bg-accent/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-accent fill-accent"
                  />
                ))}
              </div>

              <p className="text-muted leading-relaxed flex-grow mb-6 group-hover:text-foreground/80 transition-colors">
                &ldquo;{testimonial.translations[locale].quote}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-card-border">
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-accent">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted">{testimonial.role}</p>
                  </div>
                </div>

                {testimonial.metrics && (
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-accent">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xl font-bold">{testimonial.metrics.value}</span>
                    </div>
                    <p className="text-xs text-muted">{testimonial.metrics.label}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
