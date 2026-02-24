'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  // Custom cursor effect
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power3.out',
      });
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Filters animation
      if (filtersRef.current) {
        const buttons = filtersRef.current.querySelectorAll('button');
        gsap.fromTo(
          buttons,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: filtersRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Grid cards with clip-path reveal
      const cards = gridRef.current?.querySelectorAll('.project-card');
      cards?.forEach((card, index) => {
        const image = card.querySelector('.project-image');
        const content = card.querySelector('.project-content');
        const overlay = card.querySelector('.project-overlay');

        gsap.set(image, { clipPath: 'inset(100% 0 0 0)' });
        gsap.set(content, { opacity: 0, y: 40 });
        gsap.set(overlay, { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.to(image, {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1,
          ease: 'power4.out',
          delay: index * 0.1,
        })
          .to(content, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
          }, '-=0.5')
          .to(overlay, {
            opacity: 1,
            duration: 0.4,
          }, '-=0.4');
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  const handleCategoryChange = (category: Category) => {
    const cards = gridRef.current?.querySelectorAll('.project-card');
    if (!cards) return;

    gsap.to(Array.from(cards), {
      opacity: 0,
      y: 30,
      scale: 0.95,
      duration: 0.3,
      stagger: 0.03,
      ease: 'power2.in',
      onComplete: () => {
        setActiveCategory(category);
      },
    });
  };

  return (
    <section ref={sectionRef} className="py-20 relative bg-hcs-dark">
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className={cn(
          'fixed top-0 left-0 w-14 h-14 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300',
          hoveredProject ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="w-full h-full rounded-full bg-accent/80 flex items-center justify-center">
          <span className="text-white text-xs font-medium">VIEW</span>
        </div>
      </div>

      <div className="container-custom">
        {/* Filters */}
        <div ref={filtersRef} className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                'px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-medium transition-all duration-500 relative overflow-hidden group',
                activeCategory === category
                  ? 'bg-accent text-white'
                  : 'bg-transparent border border-card-border text-muted hover:text-foreground hover:border-accent'
              )}
            >
              <span className="relative z-10">{t(`filters.${category}`)}</span>
              {activeCategory !== category && (
                <span className="absolute inset-0 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              )}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 gap-6 md:gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="project-card group relative block cursor-pointer"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => router.push(`/${locale}/portfolio/${project.slug}`)}
            >
              {/* Image container with clip-path */}
              <div className="project-image relative aspect-[4/3] bg-hcs-gray rounded-2xl overflow-hidden">
                {/* Placeholder gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-accent/10 to-transparent" />
                <img
                  src={project.image}
                  alt={project.translations[locale].title}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Project initials */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[5rem] md:text-[8rem] font-bold text-white/10">
                    {project.translations[locale].title.substring(0, 2).toUpperCase()}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Project number */}
                <div className="absolute top-6 left-6 text-white/50 font-mono text-sm">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Category badge */}
                <div className="absolute top-6 right-6">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                    {t(`filters.${project.category}`)}
                  </span>
                </div>

                {/* Hover actions */}
                <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-accent hover:text-white transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="project-content mt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                      {project.translations[locale].title}
                    </h3>
                    <p className="text-muted mt-2 line-clamp-2">
                      {project.translations[locale].shortDescription}
                    </p>
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-muted group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0 mt-1" />
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-card border border-card-border rounded-full text-xs text-muted group-hover:border-accent/30 group-hover:text-foreground transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-3 py-1 bg-card border border-card-border rounded-full text-xs text-muted">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Decorative line */}
              <div className="project-overlay absolute -bottom-4 left-0 right-0 h-[2px] bg-gradient-to-r from-accent via-accent/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
