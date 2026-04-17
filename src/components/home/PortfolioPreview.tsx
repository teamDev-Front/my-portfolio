'use client';

import { useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getFeaturedProjects } from '@/lib/data/projects';
import type { Locale } from '@/i18n/routing';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function PortfolioPreview() {
  const t = useTranslations('portfolio');
  const locale = useLocale() as Locale;
  const featuredProjects = getFeaturedProjects().slice(0, 6);

  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          canHorizontalScroll: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, canHorizontalScroll, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            canHorizontalScroll: boolean;
            reduceMotion: boolean;
          };

          // Title skew-reveal
          if (titleRef.current && !reduceMotion) {
            gsap.fromTo(
              titleRef.current,
              { opacity: 0, y: 80, skewY: 4 },
              {
                opacity: 1,
                y: 0,
                skewY: 0,
                duration: 1.1,
                ease: 'expo.out',
                scrollTrigger: {
                  trigger: titleRef.current,
                  start: 'top 85%',
                  toggleActions: 'play none none reverse',
                },
              }
            );
          }

          const cards = cardsRef.current.filter(Boolean) as HTMLAnchorElement[];

          if (!canHorizontalScroll || !horizontalRef.current || !triggerRef.current) {
            // Mobile: vertical stack with ScrollTrigger.batch
            ScrollTrigger.batch(cards, {
              start: 'top 88%',
              onEnter: (batch) =>
                gsap.fromTo(
                  batch,
                  { opacity: 0, y: 60, scale: 0.95 },
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: 'expo.out',
                    overwrite: true,
                  }
                ),
            });
            return;
          }

          // Desktop: horizontal scroll with pinning
          const el = horizontalRef.current;
          const scrollWidth = () => el.scrollWidth - window.innerWidth + 100;

          const horizontalScroll = gsap.to(el, {
            x: () => -scrollWidth(),
            ease: 'none',
            scrollTrigger: {
              trigger: triggerRef.current,
              start: 'top top',
              end: () => `+=${scrollWidth()}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (progressRef.current) {
                  gsap.set(progressRef.current, { scaleX: self.progress });
                }
              },
            },
          });

          // Per-card scrub animation tied to horizontal scroll
          cards.forEach((card) => {
            gsap.fromTo(
              card,
              { scale: 0.88, opacity: 0.4, rotateY: 12 },
              {
                scale: 1,
                opacity: 1,
                rotateY: 0,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: horizontalScroll,
                  start: 'left 85%',
                  end: 'left 30%',
                  scrub: 1,
                },
              }
            );
          });

          // 3D hover (desktop only)
          if (!isDesktop || !contextSafe) return;

          const cleanups: Array<() => void> = [];

          cards.forEach((card) => {
            const rotX = gsap.quickTo(card, 'rotateX', {
              duration: 0.5,
              ease: 'power3.out',
            });
            const rotY = gsap.quickTo(card, 'rotateY', {
              duration: 0.5,
              ease: 'power3.out',
            });

            const onMove = contextSafe((e: MouseEvent) => {
              const rect = card.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width - 0.5;
              const y = (e.clientY - rect.top) / rect.height - 0.5;
              rotX(-y * 10);
              rotY(x * 10);
            });

            const onEnter = contextSafe(() =>
              gsap.to(card, {
                scale: 1.02,
                duration: 0.4,
                ease: 'power3.out',
              })
            );

            const onLeave = contextSafe(() => {
              rotX(0);
              rotY(0);
              gsap.to(card, {
                scale: 1,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)',
              });
            });

            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseenter', onEnter);
            card.addEventListener('mouseleave', onLeave);

            cleanups.push(() => {
              card.removeEventListener('mousemove', onMove);
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
    <section ref={sectionRef} className="relative">
      <div className="section-padding pb-8">
        <div className="container-custom">
          <div
            ref={titleRef}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              <span className="text-accent font-mono text-sm mb-2 block">03 / PORTFOLIO</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                {t('title')}
              </h2>
              <p className="text-muted mt-4 max-w-xl">{t('subtitle')}</p>
            </div>
            <Button href={`/${locale}/portfolio`} variant="outline" className="group shrink-0">
              {t('viewAll')}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={triggerRef}
        className="relative md:h-screen md:overflow-hidden"
        style={{ perspective: '1400px' }}
      >
        <div className="hidden md:block absolute top-0 left-0 right-0 h-1 bg-card-border z-20">
          <div
            ref={progressRef}
            className="h-full bg-accent origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        <div
          ref={horizontalRef}
          className="flex flex-col md:flex-row items-stretch md:items-center gap-6 md:gap-8 md:h-full md:pl-[10vw] md:pr-[30vw] px-4 md:px-0 py-8 md:py-0"
          style={{ width: 'max-content' }}
        >
          {featuredProjects.map((project, index) => (
            <Link
              key={project.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              href={`/${locale}/portfolio/${project.slug}`}
              className="group block w-full md:w-[45vw] lg:w-[35vw] md:h-[70vh] bg-card rounded-2xl md:rounded-3xl border border-card-border overflow-hidden md:flex-shrink-0 relative will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative h-48 md:h-1/2 bg-hcs-gray overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
                <img
                  src={project.image}
                  alt={project.translations[locale].title}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-4 right-4 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5 text-accent" />
                </div>

                <div className="absolute bottom-4 left-4 text-5xl md:text-7xl font-bold text-foreground/10 group-hover:text-accent/20 transition-colors">
                  0{index + 1}
                </div>
              </div>

              <div className="p-4 md:p-8 md:h-1/2 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-accent font-medium uppercase tracking-wider">
                    {t(`filters.${project.category}`)}
                  </span>
                  <h3 className="text-lg md:text-2xl font-semibold text-foreground mt-2 mb-2 md:mb-3 group-hover:text-accent transition-colors duration-300">
                    {project.translations[locale].title}
                  </h3>
                  <p className="text-muted text-sm md:text-base line-clamp-2 md:line-clamp-3">
                    {project.translations[locale].shortDescription}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-hcs-gray rounded-full text-xs text-muted group-hover:bg-accent/10 group-hover:text-accent transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}

          <Link
            href={`/${locale}/portfolio`}
            className="group hidden md:flex items-center justify-center w-[30vw] h-[70vh] bg-card rounded-3xl border border-card-border border-dashed flex-shrink-0 hover:border-accent/50 transition-colors"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-dashed border-muted/50 flex items-center justify-center group-hover:border-accent group-hover:scale-110 transition-all duration-300">
                <ArrowRight className="w-8 h-8 text-muted group-hover:text-accent transition-colors" />
              </div>
              <p className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                {t('viewAll')}
              </p>
              <p className="text-muted text-sm mt-2">+{featuredProjects.length} projects</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
