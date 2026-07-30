import { useTranslations } from 'next-intl';

/**
 * ABOUT / 04 — core values. A hairline 2×2 editorial grid: mono index, title, description.
 * No icons, no tilt, no glow. Server Component; reveal via the [data-reveal] contract.
 */

const VALUES = ['teamwork', 'adaptability', 'improvement', 'quality'] as const;

export function Values() {
  const t = useTranslations('about.values');

  return (
    <section className="relative px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p data-reveal className="hud-readout text-[10px] opacity-100! text-red-bright">
            04 / CORE VALUES
          </p>
          <h2 data-reveal className="type-display mt-6 text-[clamp(1.9rem,4.5vw,3.2rem)] text-fg">
            {t('title')}
          </h2>
        </div>

        <ul className="mt-14 grid border-t border-line/10 md:mt-20 md:grid-cols-2">
          {VALUES.map((key, i) => (
            <li
              key={key}
              data-reveal
              className="border-b border-line/10 py-8 md:py-10 md:odd:pr-12 md:even:border-l md:even:border-l-line/10 md:even:pl-12"
            >
              <p className="hud-readout text-[11px] opacity-100! text-red-bright">0{i + 1}</p>
              <h3 className="type-display mt-5 text-[clamp(1.15rem,2.4vw,1.6rem)] text-fg">
                {t(key)}
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-fg/60 md:text-base">
                {t(`${key}Desc`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
