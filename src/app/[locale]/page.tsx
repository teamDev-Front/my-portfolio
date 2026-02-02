import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { Intro } from '@/components/home/Intro';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { PortfolioPreview } from '@/components/home/PortfolioPreview';
import { Testimonials } from '@/components/home/Testimonials';
import { CTA } from '@/components/home/CTA';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Intro />
      <ServicesPreview />
      <PortfolioPreview />
      <Testimonials />
      <CTA />
    </>
  );
}
