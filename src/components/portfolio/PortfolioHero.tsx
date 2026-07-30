import { getLocale, getTranslations } from 'next-intl/server';
import { projects } from '@/lib/data/projects';
import type { Locale } from '@/i18n/routing';

/**
 * PORTFOLIO — page masthead. Server Component: the h1, the subtitle and the index
 * readout all ship in the server HTML. No GSAP here — motion is delegated to the
 * [data-reveal] contract read by <PageReveal> (src/motion/page-reveal.timeline.ts).
 */
export async function PortfolioHero() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('portfolio');
  const count = String(projects.length).padStart(2, '0');

  return (
    <section className="relative border-b border-line/10 px-6 pt-32 pb-14 md:px-12 md:pt-44 md:pb-20">
      <div data-reveal className="mx-auto max-w-6xl">
        <p className="hud-readout text-[10px] opacity-100! text-red-bright">
          {count} {locale === 'pt-BR' ? 'PROJETOS' : 'PROJECTS'}
        </p>

        <h1 className="type-display mt-6 text-[clamp(2.5rem,9vw,6.5rem)] text-fg">
          {t('title')}
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-fg/70 md:text-lg">
          {t('subtitle')}
        </p>
      </div>
    </section>
  );
}
