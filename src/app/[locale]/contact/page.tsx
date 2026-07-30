import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { PageReveal } from '@/components/shell/PageReveal';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildPageMetadata, type SupportedLocale } from '@/lib/seo';
import { contactPageSchema, breadcrumbSchema } from '@/lib/schemas';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as SupportedLocale;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return buildPageMetadata({
    locale: l,
    title: t('pageTitle'),
    description: t('pageSubtitle'),
    path: '/contact',
    keywords:
      l === 'pt-BR'
        ? [
            'contato desenvolvedor Jacareí',
            'orçamento criar site',
            'orçamento SaaS',
            'contratar desenvolvedor São José dos Campos',
            'falar com desenvolvedor',
            'agendar reunião desenvolvimento',
            'WhatsApp desenvolvedor',
            'freelancer web Vale do Paraíba',
          ]
        : [
            'contact web developer',
            'website quote',
            'SaaS quote',
            'hire freelance developer Brazil',
            'schedule development meeting',
          ],
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as SupportedLocale;
  const t = await getTranslations({ locale, namespace: 'nav' });

  return (
    <>
      <JsonLd data={contactPageSchema(l)} id="ld-contact" />
      <JsonLd
        data={breadcrumbSchema(l, [
          { name: t('home'), path: '/' },
          { name: t('contact'), path: '/contact' },
        ])}
        id="ld-breadcrumb"
      />

      <PageReveal>
        <ContactHero />

        <section className="px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-16">
            <div data-reveal className="lg:col-span-7">
              <ContactForm />
            </div>
            <div className="lg:col-span-5">
              <ContactInfo />
            </div>
          </div>
        </section>
      </PageReveal>
    </>
  );
}
