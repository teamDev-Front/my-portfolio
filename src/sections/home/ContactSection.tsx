import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Choreography } from '@/components/shell/Choreography';

/**
 * Section 05 — CONTACT. The closing CTA: the largest type on the page, arriving through
 * the tunnel. Server Component. Reused on internal pages too, where `numbered={false}`
 * drops the "05 /" label so the section numbering stays honest to the homepage journey.
 */
export function ContactSection({ numbered = true }: { numbered?: boolean }) {
  const t = useTranslations('cta');
  const locale = useLocale();
  const words = t('title').split(' ');

  return (
    <Choreography name="contact">
      <section
        data-contact-stage
        data-stage={numbered ? 'contact' : undefined}
        data-stage-lead={numbered ? '0.5' : undefined}
        className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 py-32 text-center md:px-12"
      >
        <div className="mx-auto max-w-4xl">
          <p data-contact-eyebrow className="hud-readout text-[10px] opacity-100! text-red-bright">
            {numbered ? '05 / CONTACT' : 'CONTACT'}
          </p>

          <h2 className="type-display mt-8 text-[clamp(2.2rem,6.5vw,5.4rem)] text-fg">
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                data-contact-word
                className="inline-block whitespace-pre will-change-transform"
              >
                {i < words.length - 1 ? `${word} ` : word}
              </span>
            ))}
          </h2>

          <p data-contact-sub className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-fg/60 md:text-lg">
            {t('subtitle')}
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={`/${locale}/contact`}
              data-contact-cta
              className="group inline-flex items-center gap-3 rounded-xs bg-red px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:bg-red-bright"
            >
              {t('button')}
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href={`/${locale}/contact#schedule`}
              data-contact-cta
              className="border-hairline inline-flex items-center gap-3 rounded-xs px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-fg/80 transition-colors duration-200 hover:border-red-bright/40 hover:text-fg"
            >
              {t('secondaryButton')}
            </Link>
          </div>
        </div>
      </section>
    </Choreography>
  );
}
