'use client';

import { useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FloatingShapes } from '@/components/animations/FloatingShapes';

gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase);

export function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  const heroRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<(HTMLDivElement | null)[]>([]);

  const tagline = t('tagline');
  const words = tagline.split(' ');

  useGSAP(
    (_context, contextSafe) => {
      CustomEase.create('hero-out', '0.22, 1, 0.36, 1');

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          // --- Title: word-level split with masks (all inline styles to avoid
          // Tailwind JIT missing runtime classes) ---
          const titleEl = titleRef.current;
          if (!titleEl) return;

          // Highlight words (PT+EN variants). Each matched word gets the gradient.
          const highlightWords = new Set([
            '&',
            'IA',
            'AI',
            'Automações',
            'Automations',
          ]);

          titleEl.innerHTML = '';
          titleEl.style.lineHeight = '1.15';

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

            if (highlightWords.has(word)) {
              inner.classList.add('gradient-text');
            }

            mask.appendChild(inner);
            titleEl.appendChild(mask);
            wordEls.push(inner);

            if (wIdx < words.length - 1) {
              // Plain text node — allows line-wrap between word masks.
              // Non-breaking space would force everything to one line.
              titleEl.appendChild(document.createTextNode(' '));
            }
          });

          // Set inner words invisible, then reveal the h1 container
          // (this prevents FOUC of raw tagline before masks are built)
          gsap.set(wordEls, { yPercent: 115, rotate: 6, opacity: 0 });
          gsap.set(titleEl, { opacity: 1 });

          if (reduceMotion) {
            gsap.set([titleEl, subtitleRef.current, ctaRef.current, techRef.current], {
              opacity: 1,
            });
            gsap.set(wordEls, { yPercent: 0, rotate: 0, opacity: 1 });
            gsap.set(lineRef.current, { scaleX: 1 });
            return;
          }

          // --- Master intro timeline ---
          const tl = gsap.timeline({
            defaults: { ease: 'hero-out' },
            delay: 0.2,
          });

          tl.fromTo(
            lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.1, ease: 'expo.out' }
          )
            .fromTo(
              gridRef.current,
              { opacity: 0 },
              { opacity: 1, duration: 1.2 },
              0
            )
            .fromTo(
              cornersRef.current.filter(Boolean),
              { opacity: 0, scale: 0.3 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.06,
                ease: 'back.out(2)',
              },
              0.1
            )
            .addLabel('title', '-=0.7')
            .fromTo(
              wordEls,
              {
                yPercent: 115,
                rotate: 6,
                opacity: 0,
              },
              {
                yPercent: 0,
                rotate: 0,
                opacity: 1,
                duration: 0.95,
                stagger: { each: 0.1, from: 'start' },
              },
              'title'
            )
            .fromTo(
              glowRef.current,
              { opacity: 0, scale: 0.6 },
              { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' },
              'title'
            )
            .fromTo(
              subtitleRef.current,
              { opacity: 0, y: 24, filter: 'blur(12px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 },
              'title+=0.4'
            )
            .fromTo(
              Array.from(ctaRef.current?.children || []),
              { opacity: 0, y: 30, scale: 0.88 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                stagger: 0.12,
                ease: 'back.out(1.7)',
              },
              'title+=0.55'
            )
            .fromTo(
              Array.from(techRef.current?.children || []),
              { opacity: 0, y: 14, scale: 0 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: { each: 0.05, from: 'random' },
                ease: 'back.out(2.2)',
              },
              'title+=0.75'
            )
            .fromTo(
              scrollHintRef.current,
              { opacity: 0, y: -10 },
              { opacity: 1, y: 0, duration: 0.6 },
              '-=0.2'
            );

          // --- Scroll parallax ---
          ScrollTrigger.create({
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            animation: gsap.timeline().to(
              titleContainerRef.current,
              { y: 120, opacity: 0.2, ease: 'none' }
            ),
          });

          if (glowRef.current) {
            gsap.to(glowRef.current, {
              scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
              },
              y: 180,
              scale: 1.3,
              opacity: 0.3,
              ease: 'none',
            });
          }

          // --- Scroll hint bounce (infinite) ---
          if (scrollHintRef.current) {
            gsap.to(scrollHintRef.current.querySelector('[data-dot]'), {
              y: 12,
              opacity: 0,
              duration: 1.4,
              repeat: -1,
              ease: 'power2.in',
            });
          }

          // --- Mouse parallax (desktop only) ---
          if (isDesktop && contextSafe && glowRef.current) {
            const glowX = gsap.quickTo(glowRef.current, 'x', {
              duration: 0.8,
              ease: 'power3.out',
            });
            const glowY = gsap.quickTo(glowRef.current, 'y', {
              duration: 0.8,
              ease: 'power3.out',
            });
            const titleX = gsap.quickTo(titleContainerRef.current, 'x', {
              duration: 1,
              ease: 'power3.out',
            });
            const titleY = gsap.quickTo(titleContainerRef.current, 'y', {
              duration: 1,
              ease: 'power3.out',
            });

            const handleMove = contextSafe((e: MouseEvent) => {
              const x = (e.clientX / window.innerWidth - 0.5) * 2;
              const y = (e.clientY / window.innerHeight - 0.5) * 2;
              glowX(x * 40);
              glowY(y * 40);
              titleX(x * 8);
              titleY(y * 6);
            });

            window.addEventListener('mousemove', handleMove);
            return () => window.removeEventListener('mousemove', handleMove);
          }
        }
      );

      return () => mm.revert();
    },
    { scope: heroRef }
  );

  // Magnetic hover for tech badges
  useGSAP(
    (_ctx, contextSafe) => {
      if (!techRef.current || !contextSafe) return;

      const badges = Array.from(
        techRef.current.querySelectorAll<HTMLSpanElement>('[data-tech]')
      );

      const cleanups: Array<() => void> = [];

      badges.forEach((badge) => {
        const xTo = gsap.quickTo(badge, 'x', { duration: 0.45, ease: 'power3.out' });
        const yTo = gsap.quickTo(badge, 'y', { duration: 0.45, ease: 'power3.out' });

        const onMove = contextSafe((e: MouseEvent) => {
          const rect = badge.getBoundingClientRect();
          const rx = e.clientX - rect.left - rect.width / 2;
          const ry = e.clientY - rect.top - rect.height / 2;
          xTo(rx * 0.35);
          yTo(ry * 0.5);
        });

        const onLeave = contextSafe(() => {
          xTo(0);
          yTo(0);
        });

        badge.addEventListener('mousemove', onMove);
        badge.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          badge.removeEventListener('mousemove', onMove);
          badge.removeEventListener('mouseleave', onLeave);
        });
      });

      return () => cleanups.forEach((c) => c());
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Glow that follows mouse */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vmin] h-[110vmin] rounded-full pointer-events-none will-change-transform opacity-0"
        style={{
          background:
            'radial-gradient(circle, rgba(220,38,38,0.22) 0%, rgba(220,38,38,0.08) 35%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      <FloatingShapes />

      {/* Grid pattern overlay */}
      <div
        ref={gridRef}
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px] opacity-0 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
      />

      {/* Accent line */}
      <div
        ref={lineRef}
        className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent origin-center"
        style={{ transform: 'scaleX(0)' }}
      />

      <div
        ref={titleContainerRef}
        className="container-custom relative z-10 pt-28 md:pt-36 lg:pt-40 pb-12 md:pb-20"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h1
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-8 opacity-0"
          >
            {tagline}
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 opacity-0"
          >
            {t('subtitle')}
          </p>

          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button href={`/${locale}/contact`} size="lg" className="group magnetic-btn">
              {t('cta')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              href={`/${locale}/portfolio`}
              variant="outline"
              size="lg"
              className="magnetic-btn"
            >
              <Play className="mr-2 w-5 h-5" />
              {t('secondaryCta')}
            </Button>
          </div>

          <div
            ref={techRef}
            className="mt-10 md:mt-16 flex flex-wrap justify-center gap-2 md:gap-3"
          >
            {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'AI/LLM'].map((tech) => (
              <span
                key={tech}
                data-tech
                className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-card/50 border border-card-border rounded-full text-xs md:text-sm text-muted hover:border-accent/60 hover:text-accent transition-colors duration-300 cursor-default backdrop-blur-sm will-change-transform"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 flex flex-col items-center gap-2 pointer-events-none z-10"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-muted/60">Scroll</span>
        <div className="relative w-5 h-8 border border-muted/30 rounded-full flex justify-center pt-1.5 overflow-hidden">
          <span
            data-dot
            className="block w-1 h-1.5 bg-accent/70 rounded-full"
          />
        </div>
      </div>

      {/* Corner decorations */}
      <div
        ref={(el) => {
          cornersRef.current[0] = el;
        }}
        className="hidden md:block absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-accent/25 rounded-tl-lg"
      />
      <div
        ref={(el) => {
          cornersRef.current[1] = el;
        }}
        className="hidden md:block absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-accent/25 rounded-tr-lg"
      />
      <div
        ref={(el) => {
          cornersRef.current[2] = el;
        }}
        className="hidden md:block absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-accent/25 rounded-bl-lg"
      />
      <div
        ref={(el) => {
          cornersRef.current[3] = el;
        }}
        className="hidden md:block absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-accent/25 rounded-br-lg"
      />
    </section>
  );
}
