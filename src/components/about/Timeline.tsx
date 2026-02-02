'use client';

import { useTranslations, useLocale } from 'next-intl';
import { FadeIn } from '@/components/animations/FadeIn';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { timeline } from '@/lib/data/timeline';
import type { Locale } from '@/i18n/routing';

export function Timeline() {
  const t = useTranslations('about.timeline');
  const locale = useLocale() as Locale;

  return (
    <section className="section-padding bg-hcs-dark">
      <div className="container-custom">
        <FadeIn>
          <SectionTitle title={t('title')} />
        </FadeIn>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-card-border md:-translate-x-1/2" />

            {timeline.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <FadeIn key={index} delay={index * 0.1}>
                  <div className={`relative flex items-center mb-12 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`flex-1 ml-8 md:ml-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                      <div className="bg-card rounded-xl border border-card-border p-6">
                        <div className="flex items-center gap-2 mb-2 justify-start md:justify-end">
                          {item.isCurrent && (
                            <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full">
                              {t('current')}
                            </span>
                          )}
                          <span className="text-accent font-bold">{item.year}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {item.translations[locale].title}
                        </h3>
                        <p className="text-sm text-accent mb-2">
                          {item.translations[locale].company}
                        </p>
                        <p className="text-sm text-muted">
                          {item.translations[locale].description}
                        </p>
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-accent rounded-full border-4 border-background -translate-x-1/2" />
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
