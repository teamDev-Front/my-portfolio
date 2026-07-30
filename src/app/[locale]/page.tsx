import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { HeroSection } from '@/sections/home/HeroSection';
import { AboutSection } from '@/sections/home/AboutSection';
import { ServicesSection } from '@/sections/home/ServicesSection';
import { PortfolioSection } from '@/sections/home/PortfolioSection';
import { ResultsSection } from '@/sections/home/ResultsSection';
import { ContactSection } from '@/sections/home/ContactSection';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildPageMetadata, SITE_KEYWORDS, type SupportedLocale } from '@/lib/seo';
import { websiteSchema, faqSchema } from '@/lib/schemas';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as SupportedLocale;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return buildPageMetadata({
    locale: l,
    title: t('title'),
    description: t('description'),
    path: '/',
    keywords: SITE_KEYWORDS[l],
  });
}

/**
 * FAQ content per locale . These land in Google SERPs as expandable cards
 * and are a major source of long-tail traffic. Questions are written to
 * match actual search queries ("quanto custa", "quanto tempo leva", etc.).
 */
function getFAQs(locale: SupportedLocale) {
  if (locale === 'pt-BR') {
    return [
      {
        question: 'Quanto custa criar um site profissional?',
        answer:
          'Depende do escopo. Landing pages partem de R$ 3.000, sites institucionais começam em R$ 6.000 e plataformas SaaS customizadas têm orçamento definido após uma reunião de descoberta (discovery call) gratuita.',
      },
      {
        question: 'Quanto tempo leva para desenvolver um SaaS?',
        answer:
          'Um MVP de SaaS leva entre 8 e 16 semanas dependendo da complexidade. Sites institucionais ficam prontos em 3-5 semanas e landing pages em 1-2 semanas. Trabalhamos com sprints quinzenais e entregas incrementais.',
      },
      {
        question: 'Vocês atendem empresas fora de Jacareí e São José dos Campos?',
        answer:
          'Sim. Somos sediados em Jacareí (SP) mas atendemos clientes em todo o Vale do Paraíba, São Paulo capital, Brasil inteiro e exterior. Reuniões são feitas por Google Meet e entregamos via Git desde o primeiro commit.',
      },
      {
        question: 'É possível integrar inteligência artificial no meu sistema?',
        answer:
          'Sim. Integramos OpenAI (ChatGPT), Anthropic (Claude) e outras APIs de IA em sites, SaaS e aplicações existentes. Também desenvolvemos chatbots personalizados, agentes autônomos e automações com n8n.',
      },
      {
        question: 'O código-fonte fica comigo depois do projeto?',
        answer:
          'Sim, sempre. Você é dono do repositório Git desde o primeiro commit. Nada de caixa-preta — entregamos código bem escrito, testável, documentado e com deploy configurado no seu provedor preferido.',
      },
      {
        question: 'Fazem e-commerce / loja virtual?',
        answer:
          'Sim. Desenvolvemos em Shopify, WooCommerce ou stack customizada (Next.js + Stripe + headless CMS) dependendo do volume e necessidade de personalização do seu negócio.',
      },
      {
        question: 'Que tecnologias vocês usam?',
        answer:
          'Frontend: React, Next.js 15, TypeScript, Tailwind CSS, GSAP, Three.js. Backend: Node.js, Python, Django, FastAPI, PostgreSQL, Supabase. IA: OpenAI, Anthropic, LangChain, n8n. Deploy: Vercel, Railway, AWS.',
      },
    ];
  }
  return [
    {
      question: 'How much does it cost to build a professional website?',
      answer:
        'It depends on scope. Landing pages start at USD 800, business websites from USD 2,000, and custom SaaS platforms are quoted after a free discovery call.',
    },
    {
      question: 'How long does it take to develop a SaaS?',
      answer:
        'An MVP takes 8 to 16 weeks depending on complexity. Business websites ship in 3-5 weeks and landing pages in 1-2 weeks. We work in two-week sprints with incremental deliveries.',
    },
    {
      question: 'Do you work with international clients?',
      answer:
        'Yes. We are based in Jacareí (São Paulo, Brazil) but serve clients across Brazil, the US, and Europe remotely. All meetings over Google Meet, deliverables via Git.',
    },
    {
      question: 'Can you integrate AI into my existing product?',
      answer:
        'Absolutely. We integrate OpenAI (ChatGPT), Anthropic (Claude), and other AI APIs into websites, SaaS apps, and legacy systems. We also build custom chatbots, autonomous agents, and n8n workflows.',
    },
    {
      question: 'Do I own the source code?',
      answer:
        'Always. You own the Git repository from the first commit. No black boxes — you get well-written, tested, documented code with CI/CD set up on your preferred provider.',
    },
    {
      question: 'What tech stack do you use?',
      answer:
        'Frontend: React, Next.js 15, TypeScript, Tailwind CSS, GSAP, Three.js. Backend: Node.js, Python, Django, FastAPI, PostgreSQL, Supabase. AI: OpenAI, Anthropic, LangChain, n8n. Deploy: Vercel, Railway, AWS.',
    },
  ];
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as SupportedLocale;
  const faqs = getFAQs(l);

  return (
    <>
      {/* Structured data — WebSite + FAQPage */}
      <JsonLd data={websiteSchema(l)} id="ld-website" />
      <JsonLd data={faqSchema(faqs)} id="ld-faq" />

      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <ResultsSection />
      <ContactSection />
    </>
  );
}
