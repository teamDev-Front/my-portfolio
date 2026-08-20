import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Choreography } from '@/components/shell/Choreography';

/**
 * Section 01 — ABOUT. Server Component: full copy in the server HTML; the pin/parallax
 * choreography (about.timeline.ts) layers on top via the Choreography leaf.
 */
export function AboutSection() {
  const t = useTranslations('intro');
  const words = t('title').split(' ');
  const highlights = [t('highlight1'), t('highlight2'), t('highlight3')];

  return (
    <Choreography name="about">
      {/* Track + sticky section instead of a ScrollTrigger pin: identical on screen, but
          it never swaps to position:fixed, so it costs nothing in CLS. The track's extra
          height IS the beat's scroll travel. */}
      <div
        data-about-track
        data-stage="about"
        data-stage-lead="0.5"
        className="relative h-[230vh] md:h-[220vh]"
      >
      <section
        data-about-stage
        className="sticky top-0 flex h-screen items-center overflow-hidden px-6 md:px-12"
      >
        {/* The giant chapter number, surfacing at depth behind the content. */}
        <span
          aria-hidden
          data-about-number
          className="type-display pointer-events-none absolute right-[-3%] top-1/2 -translate-y-1/2 select-none text-[clamp(16rem,40vw,32rem)] leading-none text-fg opacity-0"
        >
          01
        </span>

        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Portrait panel — unveiled by a cover sheet (desktop only). */}
          <div data-about-panel className="relative hidden lg:block">
            <div className="border-hairline relative aspect-4/5 overflow-hidden rounded-xs bg-surface">
              <Image
                src="/images/luiz-habaeb-desenvolvedor-full-stack.jpg"
                alt="Luiz Habaeb"
                fill
                sizes="(max-width: 1023px) 0px, 30vw"
                className="object-cover"
              />
              {/* The readout sits on a gradient so it stays legible over the photo. */}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-bg via-bg/70 to-transparent p-6 pt-16">
                <div className="hud-readout text-[10px] opacity-100!">
                  <p className="text-fg">LUIZ HABAEB</p>
                  <p className="mt-2 text-fg/70">{t('subtitle')}</p>
                </div>
              </div>
              {/* Corner ticks — the HUD frame language. */}
              <span aria-hidden className="absolute left-3 top-3 h-3 w-3 border-l border-t border-line/25" />
              <span aria-hidden className="absolute right-3 top-3 h-3 w-3 border-r border-t border-line/25" />
              <span aria-hidden className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-line/25" />
              <span aria-hidden className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-line/25" />
              <div data-about-cover className="absolute inset-0 bg-bg" />
            </div>
          </div>

          {/* Editorial column. */}
          <div>
            <p data-about-eyebrow className="hud-readout text-[10px] opacity-100! text-red-bright">
              01 / ABOUT
            </p>
            <h2 className="type-display mt-6 text-[clamp(2rem,4.5vw,3.6rem)] text-fg">
              {words.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  data-about-word
                  className="inline-block whitespace-pre will-change-transform"
                >
                  {i < words.length - 1 ? `${word} ` : word}
                </span>
              ))}
            </h2>
            <p data-about-desc className="mt-8 max-w-xl text-base leading-relaxed text-fg/60 md:text-lg">
              {t('description')}
            </p>

            <ul className="mt-10 max-w-xl">
              {highlights.map((item, i) => (
                <li
                  key={item}
                  data-about-highlight
                  className="flex items-baseline gap-5 border-t border-line/10 py-4 last:border-b"
                >
                  <span className="hud-readout text-[10px] opacity-100! text-red-bright">
                    0{i + 1}
                  </span>
                  <span className="text-sm text-fg/80 md:text-base">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              data-about-cta
              className="animated-underline mt-10 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-fg"
            >
              {t('cta')}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
      </div>
    </Choreography>
  );
}
