'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Linkedin, Github, Instagram, Mail } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { lenisRef } from '@/lib/lenisRef';

/**
 * Footer — hairlines, mono metadata, no decoration. "Back to top" rides the same Lenis
 * pipeline as the rest of the journey instead of fighting it with native scrolling.
 */
export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();
  const pt = locale === 'pt-BR';

  const quickLinks = [
    { href: `/${locale}`, label: tNav('home') },
    { href: `/${locale}/about`, label: tNav('about') },
    { href: `/${locale}/services`, label: tNav('services') },
    { href: `/${locale}/portfolio`, label: tNav('portfolio') },
    { href: `/${locale}/contact`, label: tNav('contact') },
  ];

  const services = [
    { href: `/${locale}/services#websites`, label: pt ? 'Sites & Landing Pages' : 'Websites & Landing Pages' },
    { href: `/${locale}/services#ecommerce`, label: 'E-commerce' },
    { href: `/${locale}/services#saas`, label: pt ? 'SaaS & Sistemas' : 'SaaS & Systems' },
    { href: `/${locale}/services#ai`, label: pt ? 'IA & Automação' : 'AI & Automation' },
    { href: `/${locale}/services#design`, label: 'UX/UI Design' },
    { href: `/${locale}/services#marketing`, label: pt ? 'Marketing Digital' : 'Digital Marketing' },
  ];

  const socials = [
    { href: 'https://linkedin.com/in/luizhabaeb', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://github.com/luizhabaeb', icon: Github, label: 'GitHub' },
    { href: 'https://instagram.com/luizhabaeb', icon: Instagram, label: 'Instagram' },
    { href: 'mailto:contato@habaeb.com', icon: Mail, label: 'Email' },
  ];

  const toTop = () => {
    const lenis = lenisRef.get();
    if (lenis) lenis.scrollTo(0, { duration: 2.2 });
    else window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <footer data-stage="footer" className="relative border-t border-line/10 px-6 pb-10 pt-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-fg/55">{t('description')}</p>
            <div className="mt-7 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-hairline rounded-xs p-2.5 text-fg/55 transition-colors duration-200 hover:border-red-bright/40 hover:text-fg"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label={t('quickLinks')}>
            <h2 className="hud-readout text-[10px] opacity-100! text-red-bright">{t('quickLinks')}</h2>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-fg/60 transition-colors duration-200 hover:text-fg">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('services')}>
            <h2 className="hud-readout text-[10px] opacity-100! text-red-bright">{t('services')}</h2>
            <ul className="mt-5 space-y-3">
              {services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-fg/60 transition-colors duration-200 hover:text-fg">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="hud-readout text-[10px] opacity-100! text-red-bright">{t('newsletter.title')}</h2>
            <p className="mt-5 text-sm leading-relaxed text-fg/55">{t('newsletter.description')}</p>
            <NewsletterForm
              placeholder={t('newsletter.placeholder')}
              button={t('newsletter.button')}
              locale={locale}
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line/10 pt-8 md:flex-row md:items-center">
          <p className="hud-readout text-[10px]">
            © {currentYear} HABAEB CREATIVE SOLUTIONS · {pt ? 'JACAREÍ / SP · BRASIL' : 'JACAREÍ / SP · BRAZIL'}
          </p>
          <button
            type="button"
            onClick={toTop}
            className="hud-readout text-[10px] transition-opacity duration-200 hover:opacity-100!"
          >
            {pt ? 'VOLTAR AO TOPO' : 'BACK TO TOP'} ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

/**
 * Newsletter — previously a form with no handler at all. It now stores the address
 * through the existing contact endpoint (no new infrastructure) and reports its state
 * in the HUD language, so the control is honest about what it does.
 */
function NewsletterForm({
  placeholder,
  button,
  locale,
}: {
  placeholder: string;
  button: string;
  locale: string;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const pt = locale === 'pt-BR';

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get('email');
    if (typeof email !== 'string' || !email.includes('@')) {
      setState('error');
      return;
    }
    setState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Newsletter',
          email,
          projectType: 'newsletter',
          message: `Newsletter subscription request (${locale}).`,
        }),
      });
      setState(res.ok ? 'done' : 'error');
      if (res.ok) form.reset();
    } catch {
      setState('error');
    }
  };

  if (state === 'done') {
    return (
      <p className="hud-readout mt-6 text-[10px] opacity-100! text-red-bright" role="status">
        {pt ? 'INSCRIÇÃO CONFIRMADA' : 'SUBSCRIPTION CONFIRMED'}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6">
      <label htmlFor="newsletter-email" className="sr-only">
        {placeholder}
      </label>
      <div className="border-hairline flex items-center rounded-xs">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-3.5 py-3 font-mono text-[11px] text-fg placeholder:text-fg/35 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className="shrink-0 border-l border-line/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg/70 transition-colors duration-200 hover:text-red-bright disabled:opacity-50"
        >
          {state === 'sending' ? '···' : button}
        </button>
      </div>
      {state === 'error' ? (
        <p className="hud-readout mt-3 text-[10px] opacity-100! text-red-bright" role="alert">
          {pt ? 'FALHA — TENTE NOVAMENTE' : 'FAILED — TRY AGAIN'}
        </p>
      ) : null}
    </form>
  );
}
