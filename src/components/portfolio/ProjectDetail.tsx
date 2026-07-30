import Image from 'next/image';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Project } from '@/lib/data/projects';
import type { Locale } from '@/i18n/routing';

/**
 * A single case study. Server Component — every word of the study (problem, solution,
 * features, results) is in the server HTML, which is what the /portfolio/[slug] route
 * is indexed for. Motion is the [data-reveal] contract only; the hero image is
 * deliberately NOT revealed so the largest paint is never gated behind hydration.
 */
export async function ProjectDetail({ project }: { project: Project }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('portfolio');
  const copy = project.translations[locale];
  const isPt = locale === 'pt-BR';

  return (
    <article className="px-6 pt-32 pb-20 md:px-12 md:pt-44 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <div data-reveal>
          <Link
            href={`/${locale}/portfolio`}
            className="inline-flex min-h-11 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-fg/60 transition-colors duration-200 hover:text-red-bright"
          >
            <span aria-hidden>←</span>
            {t('viewAll')}
          </Link>

          <p className="hud-readout mt-10 text-[10px] opacity-100! text-red-bright">
            {t(`filters.${project.category}`)}
          </p>

          <h1 className="type-display mt-5 max-w-4xl text-[clamp(2rem,6.5vw,4.5rem)] text-fg">
            {copy.title}
          </h1>

          <p className="mt-8 max-w-3xl text-base leading-relaxed text-fg/70 md:text-lg">
            {copy.fullDescription}
          </p>

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 rounded-xs bg-red px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:bg-red-bright"
            >
              {t('liveDemo')}
              <span aria-hidden>↗</span>
            </a>
          ) : null}
        </div>

        <div className="border-hairline relative mt-14 aspect-video w-full overflow-hidden rounded-xs bg-surface md:mt-20">
          <Image
            src={project.image}
            alt={copy.title}
            fill
            priority
            sizes="(max-width: 1199px) 100vw, 1152px"
            className="object-cover"
          />
        </div>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <section data-reveal className="border-t border-line/10 pt-10">
              <h2 className="hud-readout text-[10px] opacity-100! text-red-bright">
                {isPt ? 'PROBLEMA & OBJETIVO' : 'PROBLEM & GOAL'}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-fg/70 md:text-lg">
                {copy.problem}
              </p>
            </section>

            <section data-reveal className="mt-14 border-t border-line/10 pt-10 md:mt-20">
              <h2 className="hud-readout text-[10px] opacity-100! text-red-bright">
                {isPt ? 'SOLUÇÃO' : 'SOLUTION'}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-fg/70 md:text-lg">
                {copy.solution}
              </p>
            </section>

            <section data-reveal className="mt-14 border-t border-line/10 pt-10 md:mt-20">
              <h2 className="hud-readout text-[10px] opacity-100! text-red-bright">
                {isPt ? 'RECURSOS PRINCIPAIS' : 'KEY FEATURES'}
              </h2>
              <ul className="mt-6">
                {copy.features.map((feature, index) => (
                  <li
                    key={`${index}-${feature}`}
                    className="flex items-baseline gap-5 border-b border-line/10 py-4 last:border-b-0"
                  >
                    <span className="hud-readout shrink-0 text-[9px] opacity-100! text-red-bright">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm leading-relaxed text-fg md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {copy.results && copy.results.length > 0 ? (
              <section data-reveal className="mt-14 border-t border-line/10 pt-10 md:mt-20">
                <h2 className="hud-readout text-[10px] opacity-100! text-red-bright">
                  {isPt ? 'RESULTADOS' : 'RESULTS'}
                </h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                  {copy.results.map((result, index) => (
                    <li
                      key={`${index}-${result}`}
                      className="border-hairline rounded-xs bg-surface p-5 text-sm leading-relaxed text-fg"
                    >
                      {result}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div data-reveal className="border-hairline rounded-xs bg-surface p-6 md:p-7">
                <h2 className="hud-readout text-[10px] opacity-100! text-red-bright">
                  {t('techStack')}
                </h2>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="hud-readout border-hairline rounded-xs px-2.5 py-1.5 text-[9px] opacity-70!"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 flex min-h-11 items-center justify-center gap-3 rounded-xs bg-red px-6 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-red-bright"
                  >
                    {t('liveDemo')}
                    <span aria-hidden>↗</span>
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
