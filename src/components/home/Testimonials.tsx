'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Quote, TrendingUp } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { testimonials } from '@/lib/data/testimonials';
import type { Locale } from '@/i18n/routing';

export function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale() as Locale;

  return (
    <section className="section-padding bg-hcs-dark">
      <div className="container-custom">
        <FadeIn>
          <SectionTitle title={t('title')} subtitle={t('subtitle')} />
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <FadeIn key={testimonial.id} delay={index * 0.1}>
              <div className="bg-card rounded-2xl border border-card-border p-6 h-full flex flex-col">
                <Quote className="w-8 h-8 text-accent/30 mb-4" />
                
                <p className="text-muted leading-relaxed flex-grow mb-6">
                  &ldquo;{testimonial.translations[locale].quote}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-card-border">
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted">{testimonial.role}</p>
                  </div>
                  
                  {testimonial.metrics && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-accent">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xl font-bold">{testimonial.metrics.value}</span>
                      </div>
                      <p className="text-xs text-muted">{testimonial.metrics.label}</p>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
