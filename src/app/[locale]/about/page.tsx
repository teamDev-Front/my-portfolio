import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { AboutHero } from '@/components/about/AboutHero';
import { Biography } from '@/components/about/Biography';
import { Timeline } from '@/components/about/Timeline';
import { Skills } from '@/components/about/Skills';
import { Values } from '@/components/about/Values';
import { CTA } from '@/components/home/CTA';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  
  return {
    title: t('pageTitle'),
    description: t('pageSubtitle'),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AboutHero />
      <Biography />
      <Timeline />
      <Skills />
      <Values />
      <CTA />
    </>
  );
}
