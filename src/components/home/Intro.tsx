'use client';

import { useTranslations, useLocale } from 'next-intl';
import { GraduationCap, Briefcase, Languages } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/Button';

export function Intro() {
  const t = useTranslations('intro');
  const locale = useLocale();

  const highlights = [
    { icon: Briefcase, text: t('highlight1') },
    { icon: GraduationCap, text: t('highlight2') },
    { icon: Languages, text: t('highlight3') },
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image/Visual Side */}
          <FadeIn direction="left">
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto lg:mx-0 relative">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-3xl" />
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
                
                {/* Profile placeholder */}
                <div className="absolute inset-4 bg-card rounded-2xl border border-card-border overflow-hidden flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4">
                      <span className="text-5xl font-bold gradient-text">LH</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Luiz Habaeb</h3>
                    <p className="text-muted text-sm">{t('subtitle')}</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Content Side */}
          <FadeIn direction="right">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t('title')}
              </h2>
              <p className="text-muted leading-relaxed mb-8">
                {t('description')}
              </p>

              {/* Highlights */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {highlights.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-card rounded-xl border border-card-border"
                  >
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-sm text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>

              <Button href={`/${locale}/about`}>
                {t('cta')}
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
