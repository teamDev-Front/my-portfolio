import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { HeroChoreography } from '@/sections/home/HeroChoreography';
import { HeroStarfield } from '@/sections/home/HeroStarfield';

/**
 * Hero — SERVER component: the full copy ships in the server HTML (title split into
 * per-word spans server-side, so the reveal needs no DOM surgery and crawlers see
 * everything). Motion is layered on by the HeroChoreography client leaf.
 */

const HIGHLIGHTS = new Set(['&', 'ia', 'ai']);
const TECH = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'AI/LLM'];

export function HeroSection() {
  const t = useTranslations('hero');
  const words = t('tagline').split(' ');

  return (
    <HeroChoreography>
      <section
        data-hero-stage
        data-stage="hero"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
      >
        <HeroStarfield />

        <div className="relative z-10 flex max-w-6xl flex-col items-center text-center">
          <p data-hero-eyebrow className="hud-readout mb-8 text-[10px] md:text-[11px]">
            [ HCS.OS V2.0 ] · CREATIVE SYSTEMS
          </p>

          <h1 className="type-display text-[clamp(2.4rem,7vw,6.2rem)] text-fg">
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                data-hero-word
                className={`inline-block will-change-transform ${
                  HIGHLIGHTS.has(word.toLowerCase()) ? 'text-red-bright' : ''
                }`}
              >
                {word}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>

          <p
            data-hero-sub
            className="mt-8 max-w-2xl text-base leading-relaxed text-fg/60 md:text-lg"
          >
            {t('subtitle')}
          </p>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              data-hero-cta
              className="group inline-flex items-center gap-3 rounded-[2px] bg-red px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:bg-red-bright"
            >
              {t('cta')}
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/portfolio"
              data-hero-cta
              className="border-hairline inline-flex items-center gap-3 rounded-[2px] px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-fg/80 transition-colors duration-200 hover:border-red-bright/40 hover:text-fg"
            >
              {t('secondaryCta')}
            </Link>
          </div>

          <ul aria-label="Stack" className="mt-16 flex flex-wrap justify-center gap-x-6 gap-y-3">
            {TECH.map((tech) => (
              <li
                key={tech}
                data-hero-chip
                className="hud-readout border-hairline rounded-[2px] px-3 py-1.5 text-[9px] !opacity-60 md:text-[10px]"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div
          data-hero-scrollhint
          aria-hidden
          className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="hud-readout text-[9px]">SCROLL</span>
          <span className="relative block h-10 w-px overflow-hidden bg-line/15">
            <span className="animate-scroll-hint absolute left-0 top-0 h-3 w-px bg-red-bright" />
          </span>
        </div>
      </section>
    </HeroChoreography>
  );
}
