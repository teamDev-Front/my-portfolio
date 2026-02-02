import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { ServicesHero } from '@/components/services/ServicesHero';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import { Industries } from '@/components/services/Industries';
import { CTA } from '@/components/home/CTA';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'servicesPage' });
  
  return {
    title: t('pageTitle'),
    description: t('pageSubtitle'),
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ServicesHero />
      <ServicesGrid />
      <Industries />
      <CTA />
    </>
  );
}
