'use client';

import { useTranslations, useLocale } from 'next-intl';
import { 
  Globe, 
  ShoppingCart, 
  Server, 
  Bot, 
  Palette, 
  Megaphone,
  Lightbulb
} from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const services = [
  { key: 'websites', icon: Globe },
  { key: 'ecommerce', icon: ShoppingCart },
  { key: 'saas', icon: Server },
  { key: 'ai', icon: Bot },
  { key: 'design', icon: Palette },
  { key: 'marketing', icon: Megaphone },
  { key: 'consulting', icon: Lightbulb },
];

export function ServicesPreview() {
  const t = useTranslations('services');
  const locale = useLocale();

  return (
    <section className="section-padding bg-hcs-dark">
      <div className="container-custom">
        <FadeIn>
          <SectionTitle title={t('title')} subtitle={t('subtitle')} />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <FadeIn key={service.key} delay={index * 0.1}>
              <div className={cn(
                'group p-6 bg-card rounded-2xl border border-card-border card-hover cursor-pointer',
                'hover:border-accent/50'
              )}>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t(`${service.key}.title`)}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t(`${service.key}.description`)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.5}>
          <div className="mt-12 text-center">
            <Button href={`/${locale}/services`} variant="outline">
              {t('viewAll')}
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
