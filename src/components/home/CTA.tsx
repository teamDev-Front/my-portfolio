'use client';

import { useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

gsap.registerPlugin(ScrollTrigger);

export function CTA() {
  const t = useTranslations('cta');
  const locale = useLocale();

  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pulsing glow effect
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.2,
          opacity: 0.3,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Title animation with wave effect
      if (titleRef.current) {
        const title = titleRef.current;
        const text = title.textContent || '';
        title.innerHTML = '';

        text.split(' ').forEach((word, wordIndex) => {
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.style.marginRight = '0.3em';

          word.split('').forEach((char) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            wordSpan.appendChild(span);
          });

          title.appendChild(wordSpan);
        });

        const allChars = title.querySelectorAll('span > span');

        gsap.fromTo(
          allChars,
          {
            opacity: 0,
            y: 80,
            rotateX: -90,
            scale: 0.5,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.02,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Add floating effect after animation
        Array.from(allChars).forEach((char, i) => {
          gsap.to(char, {
            y: Math.sin(i * 0.3) * 3,
            duration: 2 + (i % 3) * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1,
          });
        });
      }

      // Subtitle animation
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          {
            opacity: 0,
            y: 30,
            filter: 'blur(10px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Buttons animation
      if (buttonsRef.current) {
        gsap.fromTo(
          buttonsRef.current.children,
          {
            opacity: 0,
            y: 50,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: buttonsRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Decorative elements parallax
      if (decorRef.current) {
        const decorElements = decorRef.current.children;
        Array.from(decorElements).forEach((el, i) => {
          gsap.to(el, {
            y: (i % 2 === 0 ? -80 : 80),
            rotation: i * 45,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div
          ref={glowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl"
        />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-2xl -translate-y-1/2" />
      </div>

      {/* Decorative elements */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-20 left-20 w-8 h-8 text-accent/30" />
        <div className="absolute top-32 right-32 w-4 h-4 border-2 border-accent/30 rounded-full" />
        <div className="absolute bottom-20 left-1/3 w-6 h-6 border border-accent/20 rotate-45" />
        <Sparkles className="absolute bottom-32 right-20 w-6 h-6 text-accent/20" />
        <div className="absolute top-1/2 right-10 w-3 h-3 bg-accent/40 rounded-full" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-accent font-mono text-sm mb-6 block">05 / CONTACT</span>

          <h2
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
            style={{ perspective: '1000px' }}
          >
            {t('title')}
          </h2>

          <p ref={subtitleRef} className="text-lg text-muted mb-10 max-w-xl mx-auto">
            {t('subtitle')}
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={`/${locale}/contact`} size="lg" className="group">
              {t('button')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button href={`/${locale}/contact#schedule`} variant="secondary" size="lg" className="group">
              <Calendar className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              {t('secondaryButton')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
