import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { PortfolioHero } from '@/components/portfolio/PortfolioHero';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { CTA } from '@/components/home/CTA';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildPageMetadata, type SupportedLocale } from '@/lib/seo';
import { portfolioCollectionSchema, breadcrumbSchema } from '@/lib/schemas';
import { projects } from '@/lib/data/projects';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as SupportedLocale;
  const t = await getTranslations({ locale, namespace: 'portfolio' });

  return buildPageMetadata({
    locale: l,
    title: t('title'),
    description: t('subtitle'),
    path: '/portfolio',
    keywords:
      l === 'pt-BR'
        ? [
            'portfolio desenvolvedor web',
            'cases de desenvolvimento',
            'projetos SaaS Brasil',
            'projetos e-commerce',
            'sites feitos Jacareí',
            'sistemas desenvolvidos São José dos Campos',
            'trabalhos de design e desenvolvimento',
            'cases de automação com IA',
            'projetos React Next.js',
          ]
        : [
            'web development portfolio',
            'SaaS case studies',
            'e-commerce projects',
            'React Next.js portfolio',
            'AI automation projects',
            'freelance developer portfolio',
          ],
  });
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as SupportedLocale;
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const collectionProjects = projects.map((p) => ({
    title: p.translations[l].title,
    description: p.translations[l].shortDescription,
    path: `/portfolio/${p.slug}`,
    image: p.image,
  }));

  return (
    <>
      <JsonLd
        data={portfolioCollectionSchema({
          locale: l,
          projects: collectionProjects,
        })}
        id="ld-portfolio"
      />
      <JsonLd
        data={breadcrumbSchema(l, [
          { name: tNav('home'), path: '/' },
          { name: tNav('portfolio'), path: '/portfolio' },
        ])}
        id="ld-breadcrumb"
      />

      <PortfolioHero />
      <PortfolioGrid />
      <CTA />
    </>
  );
}
