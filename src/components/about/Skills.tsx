import { useTranslations } from 'next-intl';
import { skills } from '@/lib/data/timeline';

/**
 * ABOUT / 03 — the stack. Four hairline rows (label in the gutter, hairline chips in the
 * reading column) instead of four boxed cards. Server Component; reveal via [data-reveal].
 */
export function Skills() {
  const t = useTranslations('about.skills');

  const categories: Array<{ key: string; label: string; items: string[] }> = [
    { key: 'frontend', label: t('frontend'), items: skills.frontend },
    { key: 'backend', label: t('backend'), items: skills.backend },
    { key: 'databases', label: 'Databases', items: skills.databases },
    { key: 'tools', label: t('tools'), items: skills.tools },
  ];

  return (
    <section className="relative px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p data-reveal className="hud-readout text-[10px] opacity-100! text-red-bright">
            03 / TECH STACK
          </p>
          <h2 data-reveal className="type-display mt-6 text-[clamp(1.9rem,4.5vw,3.2rem)] text-fg">
            {t('title')}
          </h2>
        </div>

        <div className="mt-14 border-t border-line/10 md:mt-20">
          {categories.map((category, i) => (
            <div
              key={category.key}
              data-reveal
              className="grid gap-5 border-b border-line/10 py-8 md:grid-cols-[12rem_1fr] md:gap-10 md:py-10"
            >
              <p className="hud-readout flex items-baseline gap-3 text-[11px] opacity-100! text-red-bright">
                <span>0{i + 1}</span>
                <span>{category.label}</span>
              </p>

              <ul className="flex flex-wrap gap-2">
                {category.items.map((skill) => (
                  <li
                    key={skill}
                    className="border-hairline rounded-xs px-3 py-1.5 font-mono text-[11px] tracking-[0.04em] text-fg/70 md:text-xs"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
