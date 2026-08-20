import Image from 'next/image';
import { useTranslations } from 'next-intl';

/**
 * ABOUT / 01 — the story. Server Component: an identity panel (the HUD monogram) beside
 * the four biography paragraphs, the last one pulled out on a red rule. Reveal comes from
 * the [data-reveal] contract read by <PageReveal />.
 */
export function Biography() {
  const t = useTranslations('about.bio');

  return (
    <section className="relative px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* Identity panel — the portrait inside the HUD frame. */}
        <div
          data-reveal
          className="border-hairline relative mx-auto w-full max-w-sm overflow-hidden rounded-xs bg-surface lg:mx-0"
        >
          <div className="relative aspect-4/5 w-full">
            <Image
              src="/images/luiz-habaeb-desenvolvedor-full-stack.jpg"
              alt="Luiz Habaeb"
              fill
              sizes="(max-width: 1023px) 90vw, 24rem"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-bg via-bg/70 to-transparent p-6 pt-16">
              <div className="hud-readout text-[10px] opacity-100!">
                <p className="text-fg">LUIZ HABAEB</p>
                <p className="mt-2 text-fg/70">SAP BTP &amp; FULL STACK DEVELOPER</p>
                <p className="mt-1 text-fg/70">HCS FOUNDER</p>
              </div>
            </div>
          </div>

          <p className="hud-readout flex items-center justify-center gap-2 border-t border-line/10 py-3 text-[9px] opacity-100! text-fg/60">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-red-bright" />
            AVAILABLE FOR PROJECTS
          </p>

          {/* Corner ticks — the HUD frame language. */}
          <span aria-hidden className="absolute left-3 top-3 h-3 w-3 border-l border-t border-line/25" />
          <span aria-hidden className="absolute right-3 top-3 h-3 w-3 border-r border-t border-line/25" />
          <span aria-hidden className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-line/25" />
          <span aria-hidden className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-line/25" />
        </div>

        {/* Editorial column. */}
        <div>
          <p data-reveal className="hud-readout text-[10px] opacity-100! text-red-bright">
            01 / MY STORY
          </p>

          <h2 data-reveal className="type-display mt-6 text-[clamp(1.9rem,4.5vw,3.2rem)] text-fg">
            {t('title')}
          </h2>

          <div className="mt-10 space-y-6">
            <p data-reveal className="text-base leading-relaxed text-fg/70 md:text-lg">
              {t('p1')}
            </p>
            <p data-reveal className="text-base leading-relaxed text-fg/70 md:text-lg">
              {t('p2')}
            </p>
            <p data-reveal className="text-base leading-relaxed text-fg/70 md:text-lg">
              {t('p3')}
            </p>
            <p
              data-reveal
              className="border-l border-red-bright/60 pl-5 text-base leading-relaxed text-fg md:pl-6 md:text-lg"
            >
              {t('p4')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
