import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { ServicesHero } from '@/components/services/ServicesHero';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import { Industries } from '@/components/services/Industries';
import { CTA } from '@/components/home/CTA';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildPageMetadata, type SupportedLocale } from '@/lib/seo';
import { serviceListSchema, breadcrumbSchema } from '@/lib/schemas';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as SupportedLocale;
  const t = await getTranslations({ locale, namespace: 'servicesPage' });

  return buildPageMetadata({
    locale: l,
    title: t('pageTitle'),
    description: t('pageSubtitle'),
    path: '/services',
    keywords:
      l === 'pt-BR'
        ? [
            'serviços de desenvolvimento web',
            'criar site Jacareí',
            'criar SaaS',
            'desenvolver sistema web',
            'criar loja virtual Shopify',
            'automação com IA para empresas',
            'chatbot para empresa',
            'integrar ChatGPT no site',
            'landing page profissional',
            'sistema sob medida São José dos Campos',
            'desenvolvedor React freelancer',
            'agência de desenvolvimento Vale do Paraíba',
          ]
        : [
            'web development services',
            'SaaS development',
            'e-commerce development',
            'AI automation services',
            'chatbot development',
            'custom web systems',
            'landing page design',
            'React Next.js developer',
            'full-stack services Brazil',
          ],
  });
}

/**
 * Hand-authored service list used for schema. Keep in sync with the
 * visual grid rendered by <ServicesGrid />. The order matters — position
 * in the ItemList shows up in rich results.
 */
function getServiceItems(locale: SupportedLocale) {
  if (locale === 'pt-BR') {
    return [
      {
        name: 'Criação de Sites Profissionais',
        description:
          'Sites institucionais, landing pages e portfolios com design moderno, performance excelente e SEO desde o dia 1. Construídos em Next.js e Tailwind.',
      },
      {
        name: 'Desenvolvimento de SaaS',
        description:
          'Plataformas SaaS multi-tenant com autenticação, billing, painéis administrativos e infraestrutura escalável. Do MVP à produção.',
      },
      {
        name: 'E-commerce e Lojas Virtuais',
        description:
          'Lojas online em Shopify, WooCommerce ou headless customizado com Next.js + Stripe. Checkout otimizado e integração com gateways brasileiros.',
      },
      {
        name: 'Automação com Inteligência Artificial',
        description:
          'Integração de ChatGPT e Claude em seu produto, chatbots personalizados, agentes autônomos e automação de processos com n8n e LangChain.',
      },
      {
        name: 'Sistemas Sob Medida',
        description:
          'ERPs internos, CRMs, painéis administrativos, APIs REST/GraphQL e integrações com sistemas legados. Código 100% seu.',
      },
      {
        name: 'UX/UI Design',
        description:
          'Design centrado no usuário com Figma, animações avançadas com GSAP e Three.js, e protótipos interativos antes da implementação.',
      },
      {
        name: 'Consultoria Técnica',
        description:
          'Revisão de arquitetura, code review, migração de stacks, auditoria de performance e acessibilidade. Ideal para times internos.',
      },
    ];
  }
  return [
    {
      name: 'Professional Website Development',
      description:
        'Business websites, landing pages, and portfolios with modern design, top-tier performance, and SEO from day one. Built with Next.js and Tailwind.',
    },
    {
      name: 'SaaS Development',
      description:
        'Multi-tenant SaaS platforms with authentication, billing, admin dashboards, and scalable infrastructure. From MVP to production.',
    },
    {
      name: 'E-commerce & Online Stores',
      description:
        'Shopify, WooCommerce, or custom headless storefronts with Next.js + Stripe. Optimised checkout and payment gateway integrations.',
    },
    {
      name: 'AI Automation',
      description:
        'ChatGPT and Claude integration into your product, custom chatbots, autonomous agents, and process automation with n8n and LangChain.',
    },
    {
      name: 'Custom Software Systems',
      description:
        'Internal ERPs, CRMs, admin panels, REST/GraphQL APIs, and integrations with legacy systems. 100% yours.',
    },
    {
      name: 'UX/UI Design',
      description:
        'User-centred design in Figma, advanced animations with GSAP and Three.js, and interactive prototypes before implementation.',
    },
    {
      name: 'Technical Consulting',
      description:
        'Architecture review, code review, stack migration, performance audits, and accessibility audits. Great for internal teams.',
    },
  ];
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as SupportedLocale;
  const t = await getTranslations({ locale, namespace: 'nav' });

  const services = getServiceItems(l);

  return (
    <>
      <JsonLd data={serviceListSchema(l, services)} id="ld-services" />
      <JsonLd
        data={breadcrumbSchema(l, [
          { name: t('home'), path: '/' },
          { name: t('services'), path: '/services' },
        ])}
        id="ld-breadcrumb"
      />

      <ServicesHero />
      <ServicesGrid />
      <Industries />
      <CTA />
    </>
  );
}
