import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import {
  LandingHero,
  LandingPillars,
  LandingProcess,
  LandingUseCases,
  LandingPackages,
  LandingFAQ,
  LandingLocalScope,
  type LandingData,
  type LandingSharedCopy,
} from '@/components/landing/LandingSections';
import { ContactSection } from '@/sections/home/ContactSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildPageMetadata, type SupportedLocale } from '@/lib/seo';
import {
  serviceListSchema,
  breadcrumbSchema,
  faqSchema,
} from '@/lib/schemas';
import { getPathname } from '@/i18n/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as SupportedLocale;
  const t = await getTranslations({ locale, namespace: 'landing.aiAutomation' });

  const localPath = getPathname({ href: '/ai-automation', locale: l });

  return buildPageMetadata({
    locale: l,
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: localPath,
    keywords:
      l === 'pt-BR'
        ? [
            'automação com IA',
            'chatbot para empresa',
            'integrar ChatGPT',
            'integrar Claude',
            'agente autônomo IA',
            'automação n8n',
            'automação de processos',
            'IA para WhatsApp',
            'RAG com documentos',
            'automação empresa Jacareí',
            'inteligência artificial São José dos Campos',
            'automatizar atendimento WhatsApp',
          ]
        : [
            'AI automation',
            'ChatGPT integration',
            'Claude integration',
            'custom chatbot',
            'autonomous AI agents',
            'n8n automation',
            'business process automation',
            'WhatsApp chatbot',
            'RAG with documents',
            'hire AI developer',
          ],
  });
}

export default async function AiAutomationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as SupportedLocale;

  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tLand = await getTranslations({ locale, namespace: 'landing.aiAutomation' });
  const tShared = await getTranslations({ locale, namespace: 'landing.shared' });
  const tScope = await getTranslations({ locale, namespace: 'landing.localScope' });

  const data = {
    metaTitle: tLand('metaTitle'),
    metaDescription: tLand('metaDescription'),
    hero: tLand.raw('hero') as LandingData['hero'],
    pillars: tLand.raw('pillars') as LandingData['pillars'],
    process: tLand.raw('process') as LandingData['process'],
    useCases: tLand.raw('useCases') as LandingData['useCases'],
    packages: tLand.raw('packages') as LandingData['packages'],
    faq: tLand.raw('faq') as LandingData['faq'],
  } satisfies LandingData;

  const shared: LandingSharedCopy = {
    orbitLabel: tShared('orbitLabel'),
    primaryCta: tShared('primaryCta'),
    secondaryCta: tShared('secondaryCta'),
    localScopeTitle: tShared('localScopeTitle'),
    localScopeSubtitle: tShared('localScopeSubtitle'),
    pillarsTitle: tShared('pillarsTitle'),
    pillarsSubtitle: tShared('pillarsSubtitle'),
    processTitle: tShared('processTitle'),
    processSubtitle: tShared('processSubtitle'),
    useCasesTitle: tShared('useCasesTitle'),
    useCasesSubtitle: tShared('useCasesSubtitle'),
    packagesTitle: tShared('packagesTitle'),
    packagesSubtitle: tShared('packagesSubtitle'),
    faqTitle: tShared('faqTitle'),
    faqSubtitle: tShared('faqSubtitle'),
    packageFeatured: tShared('packageFeatured'),
    packageStartingAt: tShared('packageStartingAt'),
    packageCta: tShared('packageCta'),
  };

  const localPath = getPathname({ href: '/ai-automation', locale: l });
  const servicesSchema = serviceListSchema(
    l,
    data.pillars.map((p) => ({ name: p.title, description: p.description }))
  );
  const breadcrumbs = breadcrumbSchema(l, [
    { name: tNav('home'), path: '/' },
    { name: tNav('services'), path: '/services' },
    { name: data.hero.title, path: localPath },
  ]);
  const faqLD = faqSchema(
    data.faq.map((q) => ({ question: q.question, answer: q.answer }))
  );

  return (
    <>
      <JsonLd data={servicesSchema} id="ld-services-list" />
      <JsonLd data={breadcrumbs} id="ld-breadcrumb" />
      <JsonLd data={faqLD} id="ld-faq" />

      <LandingHero data={data} shared={shared} />
      <LandingPillars data={data} shared={shared} />
      <LandingProcess data={data} shared={shared} />
      <LandingUseCases data={data} shared={shared} />
      <LandingPackages data={data} shared={shared} />
      <LandingFAQ data={data} shared={shared} />
      <LandingLocalScope
        title={tScope('title')}
        subtitle={tScope('subtitle')}
        cities={tScope.raw('cities') as string[]}
      />
      <ContactSection numbered={false} />
    </>
  );
}
