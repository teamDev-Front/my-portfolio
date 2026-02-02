'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, Calendar } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/Button';

export function CTA() {
  const t = useTranslations('cta');
  const locale = useLocale();

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-2xl -translate-y-1/2" />
      </div>

      <div className="container-custom relative z-10">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {t('title')}
            </h2>
            <p className="text-lg text-muted mb-10 max-w-xl mx-auto">
              {t('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href={`/${locale}/contact`} size="lg" className="group">
                {t('button')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button href={`/${locale}/contact#schedule`} variant="secondary" size="lg">
                <Calendar className="mr-2 w-5 h-5" />
                {t('secondaryButton')}
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
