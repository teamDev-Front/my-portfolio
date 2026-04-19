/**
 * Schema.org JSON-LD builders.
 *
 * Each function returns a plain object ready to pass to <JsonLd data={...} />.
 * Keep these functions pure and serialisable — they run at build time when
 * pages statically generate and at SSR for dynamic routes.
 *
 * The schemas chosen match what actually shows up in Google's rich results:
 *   - Organization + LocalBusiness → knowledge panel, local pack
 *   - WebSite + SearchAction       → sitelinks search box
 *   - Service / ItemList            → service rich cards
 *   - Person                        → author / about page
 *   - CreativeWork                  → portfolio project pages
 *   - BreadcrumbList                → breadcrumb trail in SERP
 *   - FAQPage                       → collapsible FAQs in SERP
 *   - ContactPage                   → contact intent signal
 */

import {
  SITE_URL,
  SITE_NAME,
  CONTACT,
  SOCIAL,
  PERSON,
  absoluteUrl,
  localeUrl,
  type SupportedLocale,
} from './seo';

// ---------------------------------------------------------------------------
//  Shared pieces
// ---------------------------------------------------------------------------

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PERSON_ID = `${SITE_URL}/#person-luiz-habaeb`;
const LOGO_URL = absoluteUrl('/images/hcs-logo.svg');

// ---------------------------------------------------------------------------
//  Organization (appears in root layout — shared across all pages)
// ---------------------------------------------------------------------------

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    '@id': ORG_ID,
    name: SITE_NAME,
    alternateName: ['HCS', 'Habaeb', 'Habaeb Creative'],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 512,
      height: 512,
    },
    image: absoluteUrl('/opengraph-image'),
    description:
      'Agência de desenvolvimento digital especializada em sites, SaaS, e-commerce e automação com IA. Atendemos Jacareí, São José dos Campos, Vale do Paraíba e todo o Brasil.',
    slogan: 'Criamos Sites, SaaS, Lojas Virtuais & Soluções com IA',
    founder: { '@id': PERSON_ID },
    foundingDate: '2024',
    email: CONTACT.email,
    telephone: CONTACT.phone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: CONTACT.addressLocality,
      addressRegion: CONTACT.addressRegion,
      addressCountry: CONTACT.addressCountry,
    },
    areaServed: CONTACT.areaServed.map((name) => ({
      '@type': 'City',
      name,
    })),
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: -23.3053, // Jacareí
        longitude: -45.9658,
      },
      geoRadius: '200000', // metres — covers Vale do Paraíba + SP metro
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: CONTACT.email,
        telephone: CONTACT.phone,
        availableLanguage: ['Portuguese', 'English'],
        areaServed: ['BR', 'US', 'EU'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        url: CONTACT.whatsapp,
        availableLanguage: ['Portuguese', 'English'],
      },
    ],
    sameAs: [SOCIAL.linkedin, SOCIAL.github, SOCIAL.instagram],
    knowsAbout: [
      'Web Development',
      'SaaS Development',
      'E-commerce Development',
      'AI Automation',
      'Full-Stack Engineering',
      'React',
      'Next.js',
      'TypeScript',
      'Python',
      'Django',
      'UX/UI Design',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços Habaeb Creative Solutions',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Criação de sites',
            description:
              'Sites institucionais, landing pages e portfolios com design moderno e performance.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Desenvolvimento de SaaS',
            description:
              'Plataformas SaaS multi-tenant com autenticação, billing e painéis administrativos.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'E-commerce / Lojas Virtuais',
            description:
              'Lojas online em Shopify, WooCommerce ou stack customizada.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Automação com IA',
            description:
              'Integração de ChatGPT, Claude, chatbots e automação de processos com n8n.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sistemas sob medida',
            description:
              'ERPs internos, CRMs, painéis administrativos e integrações com APIs.',
          },
        },
      ],
    },
  };
}

// ---------------------------------------------------------------------------
//  WebSite + SearchAction (enables sitelinks search box)
// ---------------------------------------------------------------------------

export function websiteSchema(locale: SupportedLocale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: locale === 'pt-BR' ? 'pt-BR' : 'en',
    publisher: { '@id': ORG_ID },
    // Search action is aspirational — Google only shows it once a real
    // search endpoint is live. Keeping it here means the day we add search
    // the schema is already in place.
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ---------------------------------------------------------------------------
//  Person (About page)
// ---------------------------------------------------------------------------

export function personSchema(locale: SupportedLocale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PERSON.name,
    jobTitle: PERSON.jobTitle,
    description:
      locale === 'pt-BR'
        ? 'Desenvolvedor full-stack com mais de 8 anos de experiência em React, Next.js, TypeScript, Python e Django. Fundador da Habaeb Creative Solutions.'
        : 'Full-stack developer with 8+ years of experience in React, Next.js, TypeScript, Python and Django. Founder of Habaeb Creative Solutions.',
    url: localeUrl(locale, '/about'),
    image: absoluteUrl('/images/hcs-logo.svg'),
    sameAs: PERSON.sameAs,
    worksFor: { '@id': ORG_ID },
    knowsLanguage: ['Portuguese', 'English'],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'FATEC',
      description: 'Tecnólogo em Banco de Dados',
    },
    knowsAbout: [
      'React',
      'Next.js',
      'TypeScript',
      'Python',
      'Django',
      'Node.js',
      'PostgreSQL',
      'AI Integration',
      'UX Engineering',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: CONTACT.addressLocality,
      addressRegion: CONTACT.addressRegion,
      addressCountry: CONTACT.addressCountry,
    },
  };
}

// ---------------------------------------------------------------------------
//  BreadcrumbList (every non-home page)
// ---------------------------------------------------------------------------

interface Crumb {
  /** Localised display name. */
  name: string;
  /** Path WITHOUT the locale prefix, e.g. `/portfolio`. */
  path: string;
}

export function breadcrumbSchema(locale: SupportedLocale, crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: localeUrl(locale, crumb.path),
    })),
  };
}

// ---------------------------------------------------------------------------
//  Service list (Services page)
// ---------------------------------------------------------------------------

interface ServiceItem {
  name: string;
  description: string;
  url?: string;
}

export function serviceListSchema(
  locale: SupportedLocale,
  services: ServiceItem[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: locale === 'pt-BR' ? 'Serviços da HCS' : 'HCS Services',
    itemListElement: services.map((service, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: { '@id': ORG_ID },
        areaServed: CONTACT.areaServed.map((n) => ({ '@type': 'City', name: n })),
        ...(service.url ? { url: service.url } : {}),
      },
    })),
  };
}

// ---------------------------------------------------------------------------
//  CreativeWork (portfolio project detail page)
// ---------------------------------------------------------------------------

interface CreativeWorkInput {
  locale: SupportedLocale;
  title: string;
  description: string;
  path: string; // e.g. '/portfolio/sara-bula-digital'
  image: string; // absolute or site-relative
  technologies: string[];
  liveUrl?: string;
  category?: string;
}

export function creativeWorkSchema(input: CreativeWorkInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: input.title,
    description: input.description,
    url: localeUrl(input.locale, input.path),
    image: absoluteUrl(input.image),
    inLanguage: input.locale === 'pt-BR' ? 'pt-BR' : 'en',
    author: { '@id': PERSON_ID },
    creator: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    keywords: input.technologies.join(', '),
    ...(input.category ? { genre: input.category } : {}),
    ...(input.liveUrl ? { workExample: { '@type': 'WebSite', url: input.liveUrl } } : {}),
  };
}

// ---------------------------------------------------------------------------
//  FAQPage (home page — high-value SERP feature)
// ---------------------------------------------------------------------------

interface FAQ {
  question: string;
  answer: string;
}

export function faqSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
//  ContactPage
// ---------------------------------------------------------------------------

export function contactPageSchema(locale: SupportedLocale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name:
      locale === 'pt-BR'
        ? 'Contato — Habaeb Creative Solutions'
        : 'Contact — Habaeb Creative Solutions',
    url: localeUrl(locale, '/contact'),
    description:
      locale === 'pt-BR'
        ? 'Entre em contato com a Habaeb Creative Solutions em Jacareí, SP. Atendemos todo o Brasil remotamente.'
        : 'Get in touch with Habaeb Creative Solutions in Jacareí, SP, Brazil. We serve clients worldwide remotely.',
    inLanguage: locale === 'pt-BR' ? 'pt-BR' : 'en',
    publisher: { '@id': ORG_ID },
    mainEntity: { '@id': ORG_ID },
  };
}

// ---------------------------------------------------------------------------
//  CollectionPage (Portfolio listing)
// ---------------------------------------------------------------------------

interface PortfolioCollectionInput {
  locale: SupportedLocale;
  projects: Array<{
    title: string;
    description: string;
    path: string;
    image: string;
  }>;
}

export function portfolioCollectionSchema({
  locale,
  projects,
}: PortfolioCollectionInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name:
      locale === 'pt-BR'
        ? 'Portfólio — Habaeb Creative Solutions'
        : 'Portfolio — Habaeb Creative Solutions',
    url: localeUrl(locale, '/portfolio'),
    inLanguage: locale === 'pt-BR' ? 'pt-BR' : 'en',
    publisher: { '@id': ORG_ID },
    hasPart: projects.map((p) => ({
      '@type': 'CreativeWork',
      name: p.title,
      description: p.description,
      url: localeUrl(locale, p.path),
      image: absoluteUrl(p.image),
    })),
  };
}
