'use client';

import { useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { getFeaturedProjects } from '@/lib/data/projects';
import type { Locale } from '@/i18n/routing';

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 80, skewY: 3 },
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Horizontal scroll animation
      if (horizontalRef.current && triggerRef.current) {
        const cards = horizontalRef.current;
        const scrollWidth = cards.scrollWidth - window.innerWidth + 100;

        // Pin and horizontal scroll
        const horizontalScroll = gsap.to(cards, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: triggerRef.current,
            start: 'top top',
            end: () => `+=${scrollWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              // Update progress bar
              if (progressRef.current) {
                gsap.to(progressRef.current, {
                  scaleX: self.progress,
                  duration: 0.1,
                });
              }
            },
          },
        });

        // Individual card animations
        cardsRef.current.forEach((card, index) => {
          if (!card) return;

          // Parallax effect on each card
          gsap.fromTo(
            card,
            {
              scale: 0.9,
              opacity: 0.5,
              rotateY: 15,
            },
            {
              scale: 1,
              opacity: 1,
              rotateY: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalScroll,
                start: 'left 80%',
                end: 'left 20%',
                scrub: 1,
              },
            }
          );

          // Hover 3D effect
          const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            const rotateX = (mouseY / rect.height) * -10;
            const rotateY = (mouseX / rect.width) * 10;

            gsap.to(card, {
              rotateX,
              rotateY,
              scale: 1.02,
              duration: 0.3,
              ease: 'power2.out',
              transformPerspective: 1000,
            });
          };

          const handleMouseLeave = () => {
            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              duration: 0.5,
              ease: 'elastic.out(1, 0.5)',
            });
          };

          card.addEventListener('mousemove', handleMouseMove);
          card.addEventListener('mouseleave', handleMouseLeave);
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      {/* Title section */}
      <div className="section-padding pb-8">
        <div className="container-custom">
          <div ref={titleRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
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

      {/* Horizontal scroll section */}
      <div ref={triggerRef} className="relative h-screen overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-card-border z-20">
          <div
            ref={progressRef}
            className="h-full bg-accent origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Cards container */}
        <div
          ref={horizontalRef}
          className="flex items-center gap-8 h-full pl-[10vw] pr-[30vw]"
          style={{ width: 'max-content' }}
        >
          {featuredProjects.map((project, index) => (
            <Link
              key={project.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              href={`/${locale}/portfolio/${project.slug}`}
              className="group block w-[70vw] md:w-[45vw] lg:w-[35vw] h-[70vh] rounded-3xl border border-card-border flex-shrink-0 relative"
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              {/* Inner wrapper handles clipping independently from 3D transforms */}
              <div className="w-full h-full rounded-3xl overflow-hidden bg-card relative">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Image placeholder */}
                <div className="relative h-1/2 bg-hcs-gray overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={project.image}
                      alt={project.translations[locale].title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Arrow icon */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 text-accent" />
                  </div>

                  {/* Project number */}
                  <div className="absolute bottom-4 left-4 text-7xl font-bold text-foreground/10 group-hover:text-accent/20 transition-colors">
                    0{index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 h-1/2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-accent font-medium uppercase tracking-wider">
                      {t(`filters.${project.category}`)}
                    </span>
                    <h3 className="text-2xl font-semibold text-foreground mt-2 mb-3 group-hover:text-accent transition-colors duration-300">
                      {project.translations[locale].title}
                    </h3>
                    <p className="text-muted line-clamp-3">
                      {project.translations[locale].shortDescription}
                    </p>
                  </div>

                  {/* Tech tags */}
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
              </div>
            </Link>
          ))}

          {/* Final CTA card */}
          <Link
            href={`/${locale}/portfolio`}
            className="group flex items-center justify-center w-[40vw] md:w-[30vw] h-[70vh] bg-card rounded-3xl border border-card-border border-dashed flex-shrink-0 hover:border-accent/50 transition-colors"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-dashed border-muted/50 flex items-center justify-center group-hover:border-accent group-hover:scale-110 transition-all duration-300">
                <ArrowRight className="w-8 h-8 text-muted group-hover:text-accent transition-colors" />
              </div>
              <p className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                {t('viewAll')}
              </p>
              <p className="text-muted text-sm mt-2">
                +{featuredProjects.length} projects
              </p>
            </div>
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted text-sm">
          <span className="w-8 h-[2px] bg-muted/50" />
          <span>Scroll</span>
          <span className="w-8 h-[2px] bg-muted/50" />
        </div>
      </div>
    </section>
  );
}
