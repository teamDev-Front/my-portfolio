'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/lib/data/projects';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

type Category = 'all' | 'healthPharma' | 'retailEcommerce' | 'sustainability' | 'aiData' | 'corporate';

const categories: Category[] = ['all', 'healthPharma', 'retailEcommerce', 'sustainability', 'aiData', 'corporate'];

export function PortfolioGrid() {
  const t = useTranslations('portfolio');
  const locale = useLocale() as Locale;
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const sectionRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Filters animation
      if (filtersRef.current) {
        const buttons = filtersRef.current.querySelectorAll('button');
        gsap.fromTo(
          buttons,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: filtersRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate cards when filter changes or on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // Card entrance animation
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 50,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.05,
          }
        );

        // 3D hover effect
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

        return () => {
          card.removeEventListener('mousemove', handleMouseMove);
          card.removeEventListener('mouseleave', handleMouseLeave);
        };
      });
    }, gridRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  const handleCategoryChange = (category: Category) => {
    // Animate out current cards
    gsap.to(cardsRef.current.filter(Boolean), {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 0.3,
      stagger: 0.02,
      ease: 'power2.in',
      onComplete: () => {
        setActiveCategory(category);
        // Reset refs for new cards
        cardsRef.current = [];
      },
    });
  };

  return (
    <section ref={sectionRef} className="section-padding relative">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="container-custom relative">
        {/* Filters */}
        <div ref={filtersRef} className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                'px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300',
                activeCategory === category
                  ? 'bg-accent text-white shadow-lg shadow-accent/25'
                  : 'bg-card border border-card-border text-muted hover:text-foreground hover:border-accent/50 hover:scale-105'
              )}
            >
              {t(`filters.${category}`)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="group bg-card rounded-2xl border border-card-border overflow-hidden h-full"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              {/* Image */}
              <div className="aspect-video bg-hcs-gray relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-muted/50">
                    {project.translations[locale].title.substring(0, 2).toUpperCase()}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <Link
                    href={`/${locale}/portfolio/${project.slug}`}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:bg-accent hover:text-white transition-colors transform hover:scale-110"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors transform hover:scale-110"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>

                {/* Project number */}
                <div className="absolute top-3 left-3 text-xs font-mono text-white/50">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="text-xs text-accent font-medium uppercase tracking-wider">
                  {t(`filters.${project.category}`)}
                </span>
                <h3 className="text-lg font-semibold text-foreground mt-2 mb-2 group-hover:text-accent transition-colors">
                  {project.translations[locale].title}
                </h3>
                <p className="text-sm text-muted line-clamp-2 mb-4">
                  {project.translations[locale].shortDescription}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-hcs-gray rounded text-xs text-muted group-hover:bg-accent/10 group-hover:text-accent transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-hcs-gray rounded text-xs text-muted">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
