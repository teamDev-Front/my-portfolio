import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { AboutHero } from '@/components/about/AboutHero';
import { Biography } from '@/components/about/Biography';
import { Timeline } from '@/components/about/Timeline';
import { Skills } from '@/components/about/Skills';
import { Values } from '@/components/about/Values';
import { PageReveal } from '@/components/shell/PageReveal';
import { ContactSection } from '@/sections/home/ContactSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildPageMetadata, type SupportedLocale } from '@/lib/seo';
import { personSchema, breadcrumbSchema } from '@/lib/schemas';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as SupportedLocale;
  const t = await getTranslations({ locale, namespace: 'about' });

  return buildPageMetadata({
    locale: l,
    title: t('pageTitle'),
    description: t('pageSubtitle'),
    path: '/about',
    keywords:
      l === 'pt-BR'
        ? [
            'Luiz Habaeb',
            'desenvolvedor full-stack Jacareí',
            'desenvolvedor React Next.js Brasil',
            'Tecnólogo em Banco de Dados',
            'FATEC',
            'full-stack developer Vale do Paraíba',
            'programador São José dos Campos',
          ]
        : [
            'Luiz Habaeb',
            'full-stack developer Brazil',
            'React Next.js developer',
            'São Paulo software engineer',
            'hire freelance developer',
          ],
    ogType: 'profile',
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as SupportedLocale;
  const t = await getTranslations({ locale, namespace: 'nav' });

  return (
    <>
      <JsonLd data={personSchema(l)} id="ld-person" />
      <JsonLd
        data={breadcrumbSchema(l, [
          { name: t('home'), path: '/' },
          { name: t('about'), path: '/about' },
        ])}
        id="ld-breadcrumb"
      />

      <PageReveal>
        <AboutHero />
        <Biography />
        <Timeline />
        <Skills />
        <Values />
      </PageReveal>

      <ContactSection numbered={false} />
    </>
  );
}
