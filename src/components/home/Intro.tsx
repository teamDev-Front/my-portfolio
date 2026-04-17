'use client';

import { useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Briefcase, Languages, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Intro() {
  const t = useTranslations('intro');
  const locale = useLocale();

  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const highlightsRef = useRef<(HTMLDivElement | null)[]>([]);
  const decorRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  const highlights = [
    { icon: Briefcase, text: t('highlight1') },
    { icon: GraduationCap, text: t('highlight2') },
    { icon: Languages, text: t('highlight3') },
  ];

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

          if (reduceMotion) {
            gsap.set(
              [
                titleRef.current,
                descRef.current,
                imageRef.current,
                ...highlightsRef.current.filter(Boolean),
              ],
              { opacity: 1 }
            );
            return;
          }

          // Big number - entrance + scroll parallax
          if (numberRef.current) {
            gsap.fromTo(
              numberRef.current,
              { opacity: 0, x: 120, rotateY: 90 },
              {
                opacity: 0.03,
                x: 0,
                rotateY: 0,
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
              y: -120,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            });
          }

          // Image: tilted entrance + idle float
          if (imageRef.current) {
            gsap.fromTo(
              imageRef.current,
              { opacity: 0, x: -100, rotateY: -25, scale: 0.92 },
              {
                opacity: 1,
                x: 0,
                rotateY: 0,
                scale: 1,
                duration: 1.1,
                ease: 'expo.out',
                scrollTrigger: {
                  trigger: imageRef.current,
                  start: 'top 80%',
                  toggleActions: 'play none none reverse',
                },
              }
            );

            gsap.to(imageRef.current, {
              y: -18,
              duration: 3.2,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
            });
          }

          // Decorative float parallax
          if (decorRef.current) {
            Array.from(decorRef.current.children).forEach((el, i) => {
              gsap.to(el, {
                y: i % 2 === 0 ? -60 : 60,
                x: i % 3 === 0 ? 30 : -30,
                rotation: i * 20,
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1,
                },
              });
            });
          }

          // Title word-level split reveal (inline styles to survive Tailwind JIT)
          if (titleRef.current) {
            const title = titleRef.current;
            const text = title.textContent || '';
            title.innerHTML = '';
            title.style.lineHeight = '1.15';

            const words = text.split(' ');
            const wordEls: HTMLElement[] = [];

            words.forEach((word, wIdx) => {
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
              title.appendChild(mask);
              wordEls.push(inner);

              if (wIdx < words.length - 1) {
                title.appendChild(document.createTextNode(' '));
              }
            });

            // Hide inner words first, then reveal the title container
            gsap.set(wordEls, { yPercent: 110, rotate: 4 });
            gsap.set(title, { opacity: 1 });

            gsap.fromTo(
              wordEls,
              { yPercent: 110, rotate: 4 },
              {
                yPercent: 0,
                rotate: 0,
                duration: 0.9,
                stagger: 0.08,
                ease: 'expo.out',
                scrollTrigger: {
                  trigger: title,
                  start: 'top 85%',
                  toggleActions: 'play none none reverse',
                },
              }
            );
          }

          // Description blur-reveal
          if (descRef.current) {
            gsap.fromTo(
              descRef.current,
              { opacity: 0, y: 24, filter: 'blur(10px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: descRef.current,
                  start: 'top 85%',
                  toggleActions: 'play none none reverse',
                },
              }
            );
          }

          // Highlights - batch reveal with stagger
          const highlights = highlightsRef.current.filter(Boolean) as HTMLDivElement[];
          gsap.set(highlights, { opacity: 0, x: 50, scale: 0.85, rotateY: 25 });

          ScrollTrigger.batch(highlights, {
            start: 'top 90%',
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                x: 0,
                scale: 1,
                rotateY: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'back.out(1.6)',
                overwrite: true,
              }),
          });

          // Hover magnetic (desktop)
          if (!isDesktop || !contextSafe) return;

          const cleanups: Array<() => void> = [];

          highlights.forEach((highlight) => {
            const xTo = gsap.quickTo(highlight, 'x', {
              duration: 0.45,
              ease: 'power3.out',
            });
            const yTo = gsap.quickTo(highlight, 'y', {
              duration: 0.45,
              ease: 'power3.out',
            });

            const onMove = contextSafe((e: MouseEvent) => {
              const rect = highlight.getBoundingClientRect();
              const rx = e.clientX - rect.left - rect.width / 2;
              const ry = e.clientY - rect.top - rect.height / 2;
              xTo(rx * 0.2);
              yTo(ry * 0.3);
            });

            const onEnter = contextSafe(() =>
              gsap.to(highlight, {
                scale: 1.05,
                duration: 0.35,
                ease: 'power2.out',
              })
            );

            const onLeave = contextSafe(() => {
              xTo(0);
              yTo(0);
              gsap.to(highlight, {
                scale: 1,
                duration: 0.5,
                ease: 'elastic.out(1, 0.6)',
              });
            });

            highlight.addEventListener('mousemove', onMove);
            highlight.addEventListener('mouseenter', onEnter);
            highlight.addEventListener('mouseleave', onLeave);

            cleanups.push(() => {
              highlight.removeEventListener('mousemove', onMove);
              highlight.removeEventListener('mouseenter', onEnter);
              highlight.removeEventListener('mouseleave', onLeave);
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
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Large background number */}
      <div
        ref={numberRef}
        className="absolute top-1/2 right-0 -translate-y-1/2 text-[20rem] md:text-[30rem] font-bold text-foreground pointer-events-none select-none"
        style={{ opacity: 0 }}
      >
        01
      </div>

      {/* Decorative floating elements */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 border border-accent/20 rounded-full" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-accent/30 rounded-full" />
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-accent/10 rotate-45" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-accent/40 rounded-full" />
        <Sparkles className="absolute top-1/3 right-10 w-6 h-6 text-accent/20" />
      </div>

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image/Visual Side */}
          <div
            ref={imageRef}
            className="relative"
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          >
            <div className="aspect-square max-w-md mx-auto lg:mx-0 relative">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-3xl" />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-accent/5 rounded-full blur-2xl" />

              {/* Orbiting elements */}
              <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '20s' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent/50 rounded-full" />
              </div>
              <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-accent/30 rounded-full" />
              </div>

              {/* Profile placeholder */}
              <div className="absolute inset-4 bg-card rounded-2xl border border-card-border overflow-hidden flex items-center justify-center backdrop-blur-sm">
                <div className="text-center p-8">
                  <div className="w-36 h-36 mx-auto bg-gradient-to-br from-accent/20 to-accent/5 rounded-full flex items-center justify-center mb-6 relative">
                    <span className="text-5xl font-bold gradient-text">LH</span>
                    <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" style={{ animationDuration: '3s' }} />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">Luiz Habaeb</h3>
                  <p className="text-muted text-sm mt-1">{t('subtitle')}</p>

                  {/* Status indicator */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-muted">Available for projects</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div ref={contentRef}>
            <span className="text-accent font-mono text-sm mb-4 block">01 / ABOUT</span>

            <h2
              ref={titleRef}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 opacity-0"
              style={{ perspective: '1000px' }}
            >
              {t('title')}
            </h2>

            <p ref={descRef} className="text-muted leading-relaxed mb-8 text-lg">
              {t('description')}
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  ref={(el) => { highlightsRef.current[index] = el; }}
                  className="flex items-center gap-3 p-4 bg-card rounded-xl border border-card-border hover:border-accent/50 transition-all duration-300 cursor-default group"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-sm text-foreground font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <Button href={`/${locale}/about`} className="group">
              <span>{t('cta')}</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
