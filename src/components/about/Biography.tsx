'use client';

import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/animations/FadeIn';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function Biography() {
  const t = useTranslations('about.bio');

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <FadeIn direction="left">
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="aspect-[4/5] bg-card rounded-2xl border border-card-border overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-40 h-40 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-6">
                      <span className="text-6xl font-bold gradient-text">LH</span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Luiz Habaeb</h3>
                    <p className="text-muted">Front-End Developer</p>
                    <p className="text-accent text-sm mt-2">HCS Founder</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
            </div>
          </FadeIn>

          {/* Content Side */}
          <FadeIn direction="right">
            <div>
              <SectionTitle title={t('title')} centered={false} className="mb-8" />
              
              <div className="space-y-4 text-muted leading-relaxed">
                <p>{t('p1')}</p>
                <p>{t('p2')}</p>
                <p>{t('p3')}</p>
                <p className="text-foreground font-medium">{t('p4')}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
