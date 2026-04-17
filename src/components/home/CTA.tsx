'use client';

import { useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function CTA() {
  const t = useTranslations('cta');
  const locale = useLocale();

  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Infinite breathing glow
        gsap.to(glowRef.current, {
          scale: 1.25,
          opacity: 0.35,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        // Word-level split with inline styles (Tailwind JIT can't see
        // classes created at runtime — use style attributes instead)
        const titleEl = titleRef.current;
        if (!titleEl) return;

        const originalText = titleEl.textContent || '';
        titleEl.innerHTML = '';
        titleEl.style.lineHeight = '1.15';
        titleEl.style.textAlign = 'center';
        titleEl.style.width = '100%';

        const words = originalText.split(' ');
        const wordEls: HTMLElement[] = [];

        words.forEach((word, i) => {
          const mask = document.createElement('span');
          mask.style.display = 'inline-block';
          mask.style.overflow = 'hidden';
          mask.style.verticalAlign = 'baseline';
          mask.style.paddingBottom = '0.18em';
          mask.style.marginBottom = '-0.12em';

          const inner = document.createElement('span');
          inner.style.display = 'inline-block';
          inner.style.willChange = 'transform';
          inner.textContent = word;

          mask.appendChild(inner);
          titleEl.appendChild(mask);
          wordEls.push(inner);

          if (i < words.length - 1) {
            // Plain text node — allows line-wrap between word masks.
            // Non-breaking space would force everything to one line.
            titleEl.appendChild(document.createTextNode(' '));
          }
        });

        // Hide inner words, then reveal the container (prevents FOUC)
        gsap.set(wordEls, { yPercent: 110, rotate: 4 });
        gsap.set(titleEl, { opacity: 1 });

        // Entrance timeline tied to scroll
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.fromTo(
          labelRef.current,
          { opacity: 0, x: -20, letterSpacing: '0.5em' },
          { opacity: 1, x: 0, letterSpacing: '0.1em', duration: 0.8 }
        )
          .fromTo(
            wordEls,
            { yPercent: 110, rotate: 4 },
            {
              yPercent: 0,
              rotate: 0,
              duration: 0.9,
              stagger: 0.08,
              ease: 'expo.out',
            },
            '-=0.5'
          )
          .fromTo(
            subtitleRef.current,
            { opacity: 0, y: 20, filter: 'blur(10px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 },
            '-=0.4'
          )
          .fromTo(
            Array.from(buttonsRef.current?.children || []),
            { opacity: 0, y: 30, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.12,
              ease: 'back.out(1.7)',
            },
            '-=0.3'
          );

        // Decorative parallax
        if (decorRef.current) {
          Array.from(decorRef.current.children).forEach((el, i) => {
            gsap.to(el, {
              y: i % 2 === 0 ? -100 : 100,
              rotation: i * 60,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            });
          });
        }
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          [titleRef.current, subtitleRef.current, buttonsRef.current, labelRef.current],
          { opacity: 1 }
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          ref={glowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl"
        />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-2xl -translate-y-1/2" />
      </div>

      <div ref={decorRef} className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-20 left-20 w-8 h-8 text-accent/30" />
        <div className="absolute top-32 right-32 w-4 h-4 border-2 border-accent/30 rounded-full" />
        <div className="absolute bottom-20 left-1/3 w-6 h-6 border border-accent/20 rotate-45" />
        <Sparkles className="absolute bottom-32 right-20 w-6 h-6 text-accent/20" />
        <div className="absolute top-1/2 right-10 w-3 h-3 bg-accent/40 rounded-full" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span
            ref={labelRef}
            className="text-accent font-mono text-sm mb-6 block opacity-0"
          >
            05 / CONTACT
          </span>

          <h2
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight opacity-0 text-center"
          >
            {t('title')}
          </h2>

          <p
            ref={subtitleRef}
            className="text-lg text-muted mb-10 max-w-xl mx-auto opacity-0"
          >
            {t('subtitle')}
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={`/${locale}/contact`} size="lg" className="group">
              {t('button')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              href={`/${locale}/contact#schedule`}
              variant="secondary"
              size="lg"
              className="group"
            >
              <Calendar className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              {t('secondaryButton')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
