'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Heart, Linkedin, Github, Instagram, Mail } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: `/${locale}`, label: tNav('home') },
    { href: `/${locale}/about`, label: tNav('about') },
    { href: `/${locale}/services`, label: tNav('services') },
    { href: `/${locale}/portfolio`, label: tNav('portfolio') },
    { href: `/${locale}/contact`, label: tNav('contact') },
  ];

  const services = [
    { href: `/${locale}/services#websites`, label: locale === 'pt-BR' ? 'Sites & Landing Pages' : 'Websites & Landing Pages' },
    { href: `/${locale}/services#ecommerce`, label: 'E-commerce' },
    { href: `/${locale}/services#saas`, label: 'SaaS & Systems' },
    { href: `/${locale}/services#ai`, label: locale === 'pt-BR' ? 'IA & Automação' : 'AI & Automation' },
    { href: `/${locale}/services#design`, label: 'UX/UI Design' },
    { href: `/${locale}/services#marketing`, label: 'Marketing Digital' },
  ];

  const socials = [
    { href: 'https://linkedin.com/in/luizhabaeb', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://github.com/luizhabaeb', icon: Github, label: 'GitHub' },
    { href: 'https://instagram.com/luizhabaeb', icon: Instagram, label: 'Instagram' },
    { href: 'mailto:contact@habaeb.dev', icon: Mail, label: 'Email' },
  ];

  return (
    <footer className="bg-hcs-dark border-t border-card-border">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 text-muted text-sm leading-relaxed">
              {t('description')}
            </p>
            <div className="flex gap-4 mt-6">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted hover:text-accent transition-colors rounded-lg hover:bg-card"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">{t('services')}</h3>
            <ul className="space-y-3">
              {services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">{t('newsletter.title')}</h3>
            <p className="text-muted text-sm mb-4">{t('newsletter.description')}</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder={t('newsletter.placeholder')}
                className="flex-1 px-4 py-2 bg-card border border-card-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
              >
                {t('newsletter.button')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-card-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-sm">
            © {currentYear} Habaeb Creative Solutions. {locale === 'pt-BR' ? 'Todos os direitos reservados.' : 'All rights reserved.'}
          </p>
          <p className="text-muted text-sm flex items-center gap-1">
            {t('madeWith')} <Heart className="w-4 h-4 text-accent fill-accent" /> {locale === 'pt-BR' ? 'em São Paulo, Brasil' : 'in São Paulo, Brazil'}
          </p>
        </div>
      </div>
    </footer>
  );
}
