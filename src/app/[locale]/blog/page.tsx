import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogList } from '@/components/blog/BlogList';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  
  return {
    title: t('pageTitle'),
    description: t('pageSubtitle'),
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <BlogHero />
      <BlogList />
    </>
  );
}
