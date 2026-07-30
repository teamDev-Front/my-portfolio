import { getLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

const SOCIALS = [
  { href: 'https://linkedin.com/in/luizhabaeb', label: 'LinkedIn' },
  { href: 'https://github.com/luizhabaeb', label: 'GitHub' },
  { href: 'https://instagram.com/luizhabaeb', label: 'Instagram' },
];

/**
 * The sidebar of the contact page: coordinates, the scheduling CTA and the social
 * links. Server Component — no 3D tilt, no glow blobs, no per-card mousemove
 * listeners. Hairline panels + [data-reveal] blocks only.
 *
 * `id="schedule"` is a real anchor target: the homepage ContactSection links to
 * /contact#schedule. It must survive any redesign.
 */
export async function ContactInfo() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('contact');
  const isPt = locale === 'pt-BR';

  const details = [
    { key: isPt ? 'E-MAIL' : 'EMAIL', value: t('info.email'), href: `mailto:${t('info.email')}` },
    { key: isPt ? 'LOCAL' : 'LOCATION', value: t('info.location') },
    { key: isPt ? 'DISPONIBILIDADE' : 'AVAILABILITY', value: t('info.availability') },
  ];

  return (
    <div className="space-y-6">
      <section data-reveal className="border-hairline rounded-xs bg-surface p-6 md:p-8">
        <h2 className="hud-readout text-[10px] opacity-100! text-red-bright">{t('info.title')}</h2>

        <dl className="mt-6">
          {details.map((item) => (
            <div key={item.key} className="border-b border-line/10 py-4 first:pt-0 last:border-b-0 last:pb-0">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg/60">
                {item.key}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-fg md:text-base">
                {item.href ? (
                  <a
                    href={item.href}
                    className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-red-bright"
                  >
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        data-reveal
        id="schedule"
        className="border-hairline scroll-mt-32 rounded-xs bg-surface p-6 md:p-8"
      >
        <h2 className="hud-readout text-[10px] opacity-100! text-red-bright">
          {t('schedule.title')}
        </h2>

        <p className="mt-6 text-sm leading-relaxed text-fg/70 md:text-base">
          {t('schedule.description')}
        </p>

        <a
          href="mailto:contato@habaeb.com"
          className="mt-8 flex min-h-14 items-center justify-center gap-3 rounded-xs bg-red px-6 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-red-bright"
        >
          {t('schedule.button')}
          <span aria-hidden>→</span>
        </a>
      </section>

      <section data-reveal className="border-hairline rounded-xs bg-surface p-6 md:p-8">
        <h2 className="hud-readout text-[10px] opacity-100! text-red-bright">{t('social.title')}</h2>

        <ul className="mt-6">
          {SOCIALS.map((social) => (
            <li key={social.label} className="border-b border-line/10 last:border-b-0">
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-between gap-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-fg/70 transition-colors duration-200 hover:text-red-bright"
              >
                {social.label}
                <span aria-hidden>↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
