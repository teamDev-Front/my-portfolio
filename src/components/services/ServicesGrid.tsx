'use client';

import { useTranslations } from 'next-intl';
import { Globe, ShoppingCart, Server, Bot, Palette, Megaphone, Check } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';

const services = [
  { key: 'websites', icon: Globe, id: 'websites' },
  { key: 'ecommerce', icon: ShoppingCart, id: 'ecommerce' },
  { key: 'saas', icon: Server, id: 'saas' },
  { key: 'ai', icon: Bot, id: 'ai' },
  { key: 'design', icon: Palette, id: 'design' },
  { key: 'marketing', icon: Megaphone, id: 'marketing' },
];

export function ServicesGrid() {
  const t = useTranslations('servicesPage');

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="space-y-12">
          {services.map((service, index) => (
            <FadeIn key={service.key} delay={index * 0.1}>
              <div
                id={service.id}
                className="bg-card rounded-2xl border border-card-border p-8 lg:p-12"
              >
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                  <div>
                    <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                      <service.icon className="w-7 h-7 text-accent" />
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                      {t(`${service.key}.title`)}
                    </h2>
                    <p className="text-muted leading-relaxed">
                      {t(`${service.key}.description`)}
                    </p>
                  </div>
                  <div>
                    <ul className="space-y-3">
                      {[0, 1, 2, 3, 4, 5].map((i) => {
                        const feature = t(`${service.key}.features.${i}`);
                        if (!feature || feature.includes('.features.')) return null;
                        return (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-accent" />
                            </div>
                            <span className="text-foreground">{feature}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
