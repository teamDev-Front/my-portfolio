'use client';

import { useTranslations } from 'next-intl';
import { Scale, Building2, HeartPulse, ShoppingBag, Rocket, Briefcase } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { SectionTitle } from '@/components/ui/SectionTitle';

const industries = [
  { icon: Scale, index: 0 },
  { icon: Building2, index: 1 },
  { icon: HeartPulse, index: 2 },
  { icon: ShoppingBag, index: 3 },
  { icon: Rocket, index: 4 },
  { icon: Briefcase, index: 5 },
];

export function Industries() {
  const t = useTranslations('servicesPage.industries');

  return (
    <section className="section-padding bg-hcs-dark">
      <div className="container-custom">
        <FadeIn>
          <SectionTitle title={t('title')} subtitle={t('subtitle')} />
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {industries.map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="bg-card rounded-xl border border-card-border p-6 text-center card-hover">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <p className="text-sm text-foreground">
                  {t(`list.${item.index}`)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
