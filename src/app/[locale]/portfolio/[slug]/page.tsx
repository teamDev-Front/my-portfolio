import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/portfolio/ProjectDetail';
import { CTA } from '@/components/home/CTA';
import { projects, getProjectBySlug } from '@/lib/data/projects';
import type { Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return projects.flatMap((project) => 
    ['en', 'pt-BR'].map((locale) => ({
      locale,
      slug: project.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug);
  
  if (!project) return { title: 'Project Not Found' };
  
  const translation = project.translations[locale as Locale];
  
  return {
    title: translation.title,
    description: translation.shortDescription,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  
  const project = getProjectBySlug(slug);
  
  if (!project) {
    notFound();
  }

  return (
    <>
      <ProjectDetail project={project} />
      <CTA />
    </>
  );
}
