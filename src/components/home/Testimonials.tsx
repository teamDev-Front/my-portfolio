'use client';

import { useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, TrendingUp, Star } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { testimonials } from '@/lib/data/testimonials';
import type { Locale } from '@/i18n/routing';

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale() as Locale;

  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section number
      if (numberRef.current) {
        gsap.fromTo(
          numberRef.current,
          { opacity: 0, x: -100 },
          {
            opacity: 0.03,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

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

      // Cards animation with stagger and 3D effect
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // Entrance animation
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 80,
            rotateX: 20,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );

        // Parallax effect
        gsap.to(card, {
          y: (index % 3 - 1) * 20,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        // Hover effect
        const handleMouseEnter = () => {
          gsap.to(card, {
            y: -10,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
