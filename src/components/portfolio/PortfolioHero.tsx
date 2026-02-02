'use client';

import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/animations/FadeIn';

export function PortfolioHero() {
  const t = useTranslations('portfolio');

  return (
    <section className="pt-32 pb-16 hero-pattern">
      <div className="container-custom">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-muted">
              {t('subtitle')}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
