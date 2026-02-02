'use client';

import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/animations/FadeIn';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { skills } from '@/lib/data/timeline';

export function Skills() {
  const t = useTranslations('about.skills');

  const skillCategories = [
    { key: 'frontend', label: t('frontend'), items: skills.frontend },
    { key: 'backend', label: t('backend'), items: skills.backend },
    { key: 'databases', label: 'Databases', items: skills.databases },
    { key: 'tools', label: t('tools'), items: skills.tools },
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <FadeIn>
          <SectionTitle title={t('title')} />
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <FadeIn key={category.key} delay={index * 0.1}>
              <div className="bg-card rounded-2xl border border-card-border p-6">
                <h3 className="text-lg font-semibold text-accent mb-4">
                  {category.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-hcs-gray rounded-lg text-sm text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
