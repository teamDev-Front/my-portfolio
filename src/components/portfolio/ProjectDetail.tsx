'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Check } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/lib/data/projects';
import type { Locale } from '@/i18n/routing';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const t = useTranslations('portfolio');
  const locale = useLocale() as Locale;
  const translation = project.translations[locale];

  return (
    <article className="pt-32 pb-16">
      <div className="container-custom">
        {/* Back link */}
        <FadeIn>
          <Link
            href={`/${locale}/portfolio`}
            className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('viewAll')}
          </Link>
        </FadeIn>

        {/* Hero */}
        <FadeIn>
          <div className="mb-12">
            <span className="text-sm text-accent font-medium uppercase tracking-wider">
              {t(`filters.${project.category}`)}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6">
              {translation.title}
            </h1>
            <p className="text-xl text-muted max-w-3xl">
              {translation.fullDescription}
            </p>
            {project.liveUrl && (
              <Button href={project.liveUrl} external className="mt-6">
                <ExternalLink className="w-4 h-4 mr-2" />
                {t('liveDemo')}
              </Button>
            )}
          </div>
        </FadeIn>

        {/* Image placeholder */}
        <FadeIn>
          <div className="aspect-video bg-card rounded-2xl border border-card-border mb-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-muted/30">
                {translation.title.substring(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Content grid */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Problem */}
            <FadeIn>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {locale === 'pt-BR' ? 'Problema & Objetivo' : 'Problem & Goal'}
                </h2>
                <p className="text-muted leading-relaxed">
                  {translation.problem}
                </p>
              </div>
            </FadeIn>

            {/* Solution */}
            <FadeIn>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {locale === 'pt-BR' ? 'Solução' : 'Solution'}
                </h2>
                <p className="text-muted leading-relaxed">
                  {translation.solution}
                </p>
              </div>
            </FadeIn>

            {/* Features */}
            <FadeIn>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {locale === 'pt-BR' ? 'Recursos Principais' : 'Key Features'}
                </h2>
                <ul className="space-y-3">
                  {translation.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Results */}
            {translation.results && translation.results.length > 0 && (
              <FadeIn>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {locale === 'pt-BR' ? 'Resultados' : 'Results'}
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {translation.results.map((result, index) => (
                      <div key={index} className="bg-card rounded-xl border border-card-border p-4 text-center">
                        <p className="text-foreground font-medium">{result}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FadeIn>
              <div className="bg-card rounded-2xl border border-card-border p-6 sticky top-32">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {t('techStack')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-hcs-gray rounded-lg text-sm text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {project.liveUrl && (
                  <div className="mt-6 pt-6 border-t border-card-border">
                    <Button href={project.liveUrl} external className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t('liveDemo')}
                    </Button>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </article>
  );
}
