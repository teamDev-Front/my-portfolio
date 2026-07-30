import { useTranslations } from 'next-intl';

/**
 * ABOUT — page masthead. Server Component: the whole masthead ships in the server HTML.
 * Motion is not owned here — <PageReveal /> (page-reveal.timeline.ts) reads the
 * [data-reveal] blocks and materialises them from depth.
 */
export function AboutHero() {
  const t = useTranslations('about');

  return (
    <section className="relative flex min-h-[70vh] items-end px-6 pb-16 pt-36 md:min-h-[78vh] md:px-12 md:pb-24 md:pt-48">
      <div className="mx-auto w-full max-w-6xl">
        <p data-reveal className="hud-readout text-[10px] opacity-100! text-red-bright">
          WHO I AM
        </p>

        <h1 data-reveal className="type-display mt-8 text-[clamp(2.6rem,9vw,6.5rem)] text-fg">
          {t('pageTitle')}
        </h1>

        <p
          data-reveal
          className="mt-10 max-w-2xl text-[clamp(0.95rem,2.2vw,1.15rem)] leading-relaxed text-fg/70"
        >
          {t('pageSubtitle')}
        </p>
      </div>
    </section>
  );
}
