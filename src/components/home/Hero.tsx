'use client';

import { useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 }
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center hero-pattern overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6"
            style={{ opacity: 0 }}
          >
            {t('tagline').split(' ').map((word, i) => (
              <span
                key={i}
                className={word.includes('&') || word === 'Convert' || word === 'Convertem' ? 'gradient-text' : ''}
              >
                {word}{' '}
              </span>
            ))}
          </h1>
          
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10"
            style={{ opacity: 0 }}
          >
            {t('subtitle')}
          </p>

          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            style={{ opacity: 0 }}
          >
            <Button href={`/${locale}/contact`} size="lg" className="group">
              {t('cta')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button href={`/${locale}/portfolio`} variant="outline" size="lg">
              <Play className="mr-2 w-5 h-5" />
              {t('secondaryCta')}
            </Button>
          </div>

          {/* Tech stack badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-3">
            {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'AI/LLM'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-card/50 border border-card-border rounded-full text-sm text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
