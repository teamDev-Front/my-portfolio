import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/portfolio/ProjectDetail';
import { PageReveal } from '@/components/shell/PageReveal';
import { ContactSection } from '@/sections/home/ContactSection';
import { projects, getProjectBySlug } from '@/lib/data/projects';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildPageMetadata,
  absoluteUrl,
  type SupportedLocale,
} from '@/lib/seo';
import { creativeWorkSchema, breadcrumbSchema } from '@/lib/schemas';
import { routing } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return projects.flatMap((project) =>
    routing.locales.map((locale) => ({
      locale,
      slug: project.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = locale as SupportedLocale;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  const translation = project.translations[l];

  return buildPageMetadata({
    locale: l,
    title: translation.title,
    description: translation.shortDescription,
    path: `/portfolio/${project.slug}`,
    image: absoluteUrl(project.image),
    keywords: [
      translation.title,
      ...project.technologies,
      l === 'pt-BR' ? 'case de desenvolvimento' : 'development case study',
      l === 'pt-BR' ? 'projeto HCS' : 'HCS project',
      l === 'pt-BR'
        ? 'desenvolvedor web Jacareí'
        : 'web developer Brazil',
    ],
    ogType: 'article',
  });
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as SupportedLocale;

  const project = getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const translation = project.translations[l];
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <>
      <JsonLd
        data={creativeWorkSchema({
          locale: l,
          title: translation.title,
          description: translation.fullDescription,
          path: `/portfolio/${project.slug}`,
          image: project.image,
          technologies: project.technologies,
          liveUrl: project.liveUrl,
          category: project.category,
        })}
        id="ld-creativework"
      />
      <JsonLd
        data={breadcrumbSchema(l, [
          { name: tNav('home'), path: '/' },
          { name: tNav('portfolio'), path: '/portfolio' },
          {
            name: translation.title,
            path: `/portfolio/${project.slug}`,
          },
        ])}
        id="ld-breadcrumb"
      />

      <PageReveal>
        <ProjectDetail project={project} />
      </PageReveal>

      <ContactSection numbered={false} />
    </>
  );
}
