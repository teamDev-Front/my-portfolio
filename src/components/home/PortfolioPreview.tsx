'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { getFeaturedProjects } from '@/lib/data/projects';
import type { Locale } from '@/i18n/routing';

export function PortfolioPreview() {
  const t = useTranslations('portfolio');
  const locale = useLocale() as Locale;
  const featuredProjects = getFeaturedProjects().slice(0, 6);

  return (
    <section className="section-padding">
      <div className="container-custom">
        <FadeIn>
          <SectionTitle title={t('title')} subtitle={t('subtitle')} />
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project, index) => (
            <FadeIn key={project.id} delay={index * 0.1}>
              <Link
                href={`/${locale}/portfolio/${project.slug}`}
                className="group block bg-card rounded-2xl border border-card-border overflow-hidden card-hover"
              >
                {/* Image placeholder */}
                <div className="aspect-video bg-hcs-gray relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-muted/50">
                      {project.translations[locale].title.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-5 h-5 text-accent" />
                  </div>
                </div>
                
                <div className="p-6">
                  <span className="text-xs text-accent font-medium uppercase tracking-wider">
                    {t(`filters.${project.category}`)}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mt-2 mb-2 group-hover:text-accent transition-colors">
                    {project.translations[locale].title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2">
                    {project.translations[locale].shortDescription}
                  </p>
                  
                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-hcs-gray rounded text-xs text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.5}>
          <div className="mt-12 text-center">
            <Button href={`/${locale}/portfolio`}>
              {t('viewAll')}
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
