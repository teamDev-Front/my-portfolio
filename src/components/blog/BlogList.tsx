'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';

const blogPosts = [
  {
    slug: 'nextjs-14-features',
    date: '2026-01-15',
    translations: {
      en: {
        title: 'Next.js 14: New Features for Modern Web Development',
        excerpt: 'Explore the latest features in Next.js 14 and how they can improve your development workflow.'
      },
      'pt-BR': {
        title: 'Next.js 14: Novos Recursos para Desenvolvimento Web Moderno',
        excerpt: 'Explore os recursos mais recentes do Next.js 14 e como eles podem melhorar seu fluxo de desenvolvimento.'
      }
    }
  },
  {
    slug: 'ai-integration-frontend',
    date: '2026-01-10',
    translations: {
      en: {
        title: 'Integrating AI/LLM Services in Front-End Applications',
        excerpt: 'A practical guide to integrating AI services like GPT and Claude into your React applications.'
      },
      'pt-BR': {
        title: 'Integrando Serviços de IA/LLM em Aplicações Front-End',
        excerpt: 'Um guia prático para integrar serviços de IA como GPT e Claude em suas aplicações React.'
      }
    }
  },
  {
    slug: 'ecommerce-conversion',
    date: '2026-01-05',
    translations: {
      en: {
        title: 'E-commerce Conversion Optimization: UX Strategies That Work',
        excerpt: 'Learn proven UX strategies to boost your e-commerce conversion rates and increase sales.'
      },
      'pt-BR': {
        title: 'Otimização de Conversão em E-commerce: Estratégias de UX que Funcionam',
        excerpt: 'Aprenda estratégias de UX comprovadas para aumentar suas taxas de conversão em e-commerce.'
      }
    }
  }
];

export function BlogList() {
  const t = useTranslations('blog');
  const locale = useLocale() as 'en' | 'pt-BR';

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl font-bold text-foreground mb-8">
              {t('recentPosts')}
            </h2>
          </FadeIn>

          <div className="space-y-8">
            {blogPosts.map((post, index) => (
              <FadeIn key={post.slug} delay={index * 0.1}>
                <article className="group bg-card rounded-2xl border border-card-border p-6 md:p-8 card-hover">
                  <div className="flex items-center gap-2 text-sm text-muted mb-4">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                    {post.translations[locale].title}
                  </h3>
                  <p className="text-muted mb-4">
                    {post.translations[locale].excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-accent font-medium">
                    {t('readMore')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </article>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <div className="mt-12 text-center">
              <p className="text-muted">
                {locale === 'pt-BR' 
                  ? 'Mais artigos em breve. Inscreva-se na newsletter para receber atualizações.'
                  : 'More articles coming soon. Subscribe to the newsletter for updates.'}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
