import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { PortfolioHero } from '@/components/portfolio/PortfolioHero';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { CTA } from '@/components/home/CTA';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'portfolio' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PortfolioHero />
      <PortfolioGrid />
      <CTA />
    </>
  );
}
