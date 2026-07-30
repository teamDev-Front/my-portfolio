import { getTranslations } from 'next-intl/server';

/**
 * CONTACT — page masthead. Server Component: title and subtitle ship in the server
 * HTML. No orbs, no radial washes, no mouse parallax — the reveal is the
 * [data-reveal] contract read by <PageReveal>.
 */
export async function ContactHero() {
  const t = await getTranslations('contact');

  return (
    <section className="relative border-b border-line/10 px-6 pt-32 pb-14 md:px-12 md:pt-44 md:pb-20">
      <div data-reveal className="mx-auto max-w-6xl">
        <p className="hud-readout text-[10px] opacity-100! text-red-bright">CONTACT</p>

        <h1 className="type-display mt-6 text-[clamp(2.5rem,9vw,6.5rem)] text-fg">
          {t('pageTitle')}
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-fg/70 md:text-lg">
          {t('pageSubtitle')}
        </p>
      </div>
    </section>
  );
}
