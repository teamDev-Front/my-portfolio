'use client';

import { useTranslations } from 'next-intl';
import { Users, RefreshCw, TrendingUp, Award } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function Values() {
  const t = useTranslations('about.values');

  const values = [
    { key: 'teamwork', icon: Users },
    { key: 'adaptability', icon: RefreshCw },
    { key: 'improvement', icon: TrendingUp },
    { key: 'quality', icon: Award },
  ];

  return (
    <section className="section-padding bg-hcs-dark">
      <div className="container-custom">
        <FadeIn>
          <SectionTitle title={t('title')} />
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <FadeIn key={value.key} delay={index * 0.1}>
              <div className="bg-card rounded-2xl border border-card-border p-6 text-center card-hover">
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t(value.key)}
                </h3>
                <p className="text-sm text-muted">
                  {t(`${value.key}Desc`)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
