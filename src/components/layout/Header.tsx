'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';
import { experienceActions } from '@/stores/experienceStore';

/**
 * The global navigation — mono, uppercase, hairline. Sits above every section (z-50) so
 * nothing from the page can overlap it, and reports its open state to the experience
 * store so the smooth-scroll pipeline pauses while the mobile menu owns the viewport.
 */
export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The menu overlay owns the viewport: Lenis pauses while it is open.
  useEffect(() => {
    experienceActions.setMenuOpen(menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/portfolio`, label: t('portfolio') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  const switchLocale = () => {
    const newLocale = locale === 'pt-BR' ? 'en' : 'pt-BR';
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    window.location.href = `/${newLocale}${pathWithoutLocale}`;
  };

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === `/${locale}` || pathname === `/${locale}/` : pathname.startsWith(href);

  const linkClass = (href: string) =>
    cn(
      'font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-200',
      isActive(href) ? 'text-red-bright' : 'text-fg/55 hover:text-fg',
    );

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[padding,background-color,border-color] duration-300',
        isScrolled ? 'border-b border-line/10 bg-bg/80 py-3 backdrop-blur-xl' : 'border-b border-transparent py-6',
      )}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <nav className="flex items-center justify-between gap-6">
          <Link href={`/${locale}`} aria-label="Habaeb Creative Solutions">
            <Logo />
          </Link>

          <div className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={switchLocale}
              className="hud-readout rounded-xs px-2.5 py-2 text-[10px] transition-opacity duration-200 hover:opacity-100!"
              aria-label={locale === 'pt-BR' ? 'Switch to English' : 'Mudar para português'}
            >
              {locale === 'pt-BR' ? 'EN' : 'PT'}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xs p-2 text-fg/50 transition-colors duration-200 hover:text-fg"
              aria-label={theme === 'dark' ? 'Light theme' : 'Dark theme'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              href={`/${locale}/contact`}
              className="ml-2 rounded-xs bg-red px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-red-bright"
            >
              {t('getQuote')}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 text-fg lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {menuOpen ? (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-line/10 bg-bg/95 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto max-w-6xl px-6 py-8">
            <ul>
              {navLinks.map((link, i) => (
                <li key={link.href} className="border-b border-line/10 last:border-b-0">
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-5 py-4"
                  >
                    <span className="hud-readout text-[10px] opacity-100! text-red-bright">
                      0{i + 1}
                    </span>
                    <span
                      className={cn(
                        'type-display text-2xl',
                        isActive(link.href) ? 'text-red-bright' : 'text-fg',
                      )}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-6">
              <button
                type="button"
                onClick={switchLocale}
                className="hud-readout text-[10px] hover:opacity-100!"
              >
                {locale === 'pt-BR' ? 'ENGLISH' : 'PORTUGUÊS'}
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="hud-readout text-[10px] hover:opacity-100!"
              >
                {theme === 'dark' ? 'LIGHT' : 'DARK'}
              </button>
            </div>

            <Link
              href={`/${locale}/contact`}
              onClick={() => setMenuOpen(false)}
              className="mt-8 block rounded-xs bg-red px-6 py-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-white"
            >
              {t('getQuote')}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
