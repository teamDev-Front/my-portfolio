'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { gsap, registerGsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { experienceActions, useExperience } from '@/stores/experienceStore';
import { projects } from '@/lib/data/projects';
import type { Locale } from '@/i18n/routing';

/**
 * Project detail overlay — opened by a card in the queue. The timeline is built PAUSED and
 * play()ed on open / reverse()d on close, unmounting in onReverseComplete so nothing
 * lingers in the DOM. Focus is trapped while open, Escape closes, role="dialog".
 */
export function ProjectOverlay() {
  const slug = useExperience((s) => s.activeProjectSlug);
  const [mounted, setMounted] = useState<string | null>(null);

  // Derived state, adjusted during render (React's sanctioned pattern) rather than in an
  // effect: the node stays mounted after `slug` clears so the closing timeline can run,
  // and it unmounts from onReverseComplete.
  if (slug && slug !== mounted) setMounted(slug);

  if (!mounted) return null;
  return <OverlayBody slug={mounted} open={slug === mounted} onGone={() => setMounted(null)} />;
}

function OverlayBody({ slug, open, onGone }: { slug: string; open: boolean; onGone: () => void }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('portfolio');
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const project = projects.find((p) => p.slug === slug);

  // Build the timeline paused, then drive it from the `open` flag.
  useEffect(() => {
    if (!root.current) return;
    registerGsap();
    const scope = root.current;

    if (reduced) {
      gsap.set(scope, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
    // opacity, NOT autoAlpha, throughout: autoAlpha sets visibility:hidden at time 0, and
    // nothing inside an invisible subtree can take focus — the dialog would open with the
    // focus still on the card behind it. The node unmounts when closed, so there is
    // nothing to hide from the pointer anyway.
    tl.fromTo(scope, { opacity: 0 }, { opacity: 1, duration: 0.28 }, 0);
    tl.fromTo(
      scope.querySelector('[data-overlay-panel]'),
      { opacity: 0, scale: 0.94, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.5 },
      0.04,
    );
    tl.fromTo(
      scope.querySelectorAll('[data-overlay-item]'),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 },
      0.18,
    );
    tlRef.current = tl;
    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) {
      if (!open) onGone();
      return;
    }
    if (open) {
      tl.eventCallback('onReverseComplete', null);
      tl.play();
    } else {
      tl.eventCallback('onReverseComplete', onGone);
      tl.reverse();
    }
  }, [open, onGone]);

  // Focus management + Escape + focus trap.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    // One frame late: the opening timeline has to have rendered before the button can
    // take focus (and before a screen reader announces the dialog).
    const focusFrame = requestAnimationFrame(() => closeBtn.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        experienceActions.closeProject();
        return;
      }
      if (e.key !== 'Tab' || !root.current) return;
      const focusables = root.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [open]);

  if (!project) return null;
  const copy = project.translations[locale];

  return (
    <div
      ref={root}
      data-overlay
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      className="fixed inset-0 z-60 flex items-center justify-center p-4 opacity-0 md:p-10"
    >
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={experienceActions.closeProject}
        className="absolute inset-0 cursor-default bg-bg/85 backdrop-blur-sm"
      />

      <div
        data-overlay-panel
        className="border-hairline relative max-h-full w-full max-w-4xl overflow-y-auto rounded-xs bg-surface"
      >
        <button
          ref={closeBtn}
          type="button"
          onClick={experienceActions.closeProject}
          className="hud-readout absolute right-4 top-4 z-10 rounded-xs border border-line/20 bg-bg/70 px-3 py-2 text-[10px] opacity-100! transition-colors duration-200 hover:border-red-bright/50"
        >
          ESC ✕
        </button>

        <div data-overlay-item className="relative aspect-video w-full overflow-hidden bg-bg">
          <Image
            src={project.image}
            alt={copy.title}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        <div className="p-6 md:p-10">
          <p data-overlay-item className="hud-readout text-[10px] opacity-100! text-red-bright">
            {t(`filters.${project.category}`)}
          </p>
          <h2 data-overlay-item className="type-display mt-4 text-[clamp(1.6rem,3.6vw,2.6rem)] text-fg">
            {copy.title}
          </h2>
          <p data-overlay-item className="mt-6 text-base leading-relaxed text-fg/70">
            {copy.fullDescription}
          </p>

          <ul data-overlay-item className="mt-8 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="hud-readout border-hairline rounded-xs px-2.5 py-1.5 text-[9px] opacity-70!"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div data-overlay-item className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/portfolio/${project.slug}`}
              className="inline-flex items-center gap-3 rounded-xs bg-red px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:bg-red-bright"
            >
              {locale === 'pt-BR' ? 'Ver estudo de caso' : 'View case study'}
              <span aria-hidden>→</span>
            </Link>
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-hairline inline-flex items-center gap-3 rounded-xs px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-fg/80 transition-colors duration-200 hover:border-red-bright/40 hover:text-fg"
              >
                {locale === 'pt-BR' ? 'Site ao vivo' : 'Live site'}
                <span aria-hidden>↗</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
