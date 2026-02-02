'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { TiltCard } from '@/components/animations/TiltCard';
import { projects } from '@/lib/data/projects';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

type Category = 'all' | 'healthPharma' | 'retailEcommerce' | 'sustainability' | 'aiData' | 'corporate';

const categories: Category[] = ['all', 'healthPharma', 'retailEcommerce', 'sustainability', 'aiData', 'corporate'];

export function PortfolioGrid() {
  const t = useTranslations('portfolio');
  const locale = useLocale() as Locale;
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Filters */}
        <FadeIn>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-5 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeCategory === category
                    ? 'bg-accent text-white'
                    : 'bg-card border border-card-border text-muted hover:text-foreground hover:border-accent/50'
                )}
              >
                {t(`filters.${category}`)}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <FadeIn key={project.id} delay={index * 0.05}>
              <TiltCard tiltAmount={8} className="h-full">
              <div className="group bg-card rounded-2xl border border-card-border overflow-hidden card-hover h-full">
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
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:bg-accent hover:text-white transition-colors"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </Link>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="text-xs text-accent font-medium uppercase tracking-wider">
                    {t(`filters.${project.category}`)}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mt-2 mb-2">
                    {project.translations[locale].title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2 mb-4">
                    {project.translations[locale].shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-hcs-gray rounded text-xs text-muted"
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
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
