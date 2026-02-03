'use client';

import { useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Briefcase, Languages, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

gsap.registerPlugin(ScrollTrigger);

export function Intro() {
  const t = useTranslations('intro');
  const locale = useLocale();

  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const highlightsRef = useRef<(HTMLDivElement | null)[]>([]);
  const decorRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  const highlights = [
    { icon: Briefcase, text: t('highlight1') },
    { icon: GraduationCap, text: t('highlight2') },
    { icon: Languages, text: t('highlight3') },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section number parallax
      if (numberRef.current) {
        gsap.fromTo(
          numberRef.current,
          { opacity: 0, x: 100, rotateY: 90 },
          {
            opacity: 0.03,
            x: 0,
            rotateY: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Parallax on scroll
        gsap.to(numberRef.current, {
          y: -100,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Image container animation
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            opacity: 0,
            x: -100,
            rotateY: -30,
            scale: 0.9,
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Floating effect
        gsap.to(imageRef.current, {
          y: -20,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Decorative elements parallax
      if (decorRef.current) {
        const decorElements = decorRef.current.children;
        Array.from(decorElements).forEach((el, i) => {
          gsap.to(el, {
            y: (i % 2 === 0 ? -50 : 50),
            x: (i % 3 === 0 ? 30 : -30),
            rotation: i * 15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });
        });
      }

      // Title reveal with split effect
      if (titleRef.current) {
        const title = titleRef.current;
        const text = title.textContent || '';
        title.innerHTML = '';

        text.split('').forEach((char, i) => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.display = 'inline-block';
          span.style.opacity = '0';
          title.appendChild(span);
        });

        gsap.fromTo(
          title.children,
          {
            opacity: 0,
            y: 50,
            rotateX: -90,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.5,
            stagger: 0.02,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Description text reveal
      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          {
            opacity: 0,
            y: 30,
            filter: 'blur(10px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: descRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Highlights staggered animation
      highlightsRef.current.forEach((highlight, index) => {
        if (!highlight) return;

        gsap.fromTo(
          highlight,
          {
            opacity: 0,
            x: 50,
            scale: 0.8,
            rotateY: 30,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            rotateY: 0,
            duration: 0.6,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: highlight,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.15,
          }
        );

        // Hover effect
        const handleMouseEnter = () => {
          gsap.to(highlight, {
            scale: 1.05,
            y: -5,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(highlight, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        highlight.addEventListener('mouseenter', handleMouseEnter);
        highlight.addEventListener('mouseleave', handleMouseLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Large background number */}
      <div
        ref={numberRef}
        className="absolute top-1/2 right-0 -translate-y-1/2 text-[20rem] md:text-[30rem] font-bold text-foreground pointer-events-none select-none"
        style={{ opacity: 0 }}
      >
        01
      </div>

      {/* Decorative floating elements */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 border border-accent/20 rounded-full" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-accent/30 rounded-full" />
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-accent/10 rotate-45" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-accent/40 rounded-full" />
        <Sparkles className="absolute top-1/3 right-10 w-6 h-6 text-accent/20" />
      </div>

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image/Visual Side */}
          <div
            ref={imageRef}
            className="relative"
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          >
            <div className="aspect-square max-w-md mx-auto lg:mx-0 relative">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-3xl" />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-accent/5 rounded-full blur-2xl" />

              {/* Orbiting elements */}
              <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '20s' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent/50 rounded-full" />
              </div>
              <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-accent/30 rounded-full" />
              </div>

              {/* Profile placeholder */}
              <div className="absolute inset-4 bg-card rounded-2xl border border-card-border overflow-hidden flex items-center justify-center backdrop-blur-sm">
                <div className="text-center p-8">
                  <div className="w-36 h-36 mx-auto bg-gradient-to-br from-accent/20 to-accent/5 rounded-full flex items-center justify-center mb-6 relative">
                    <span className="text-5xl font-bold gradient-text">LH</span>
                    <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" style={{ animationDuration: '3s' }} />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">Luiz Habaeb</h3>
                  <p className="text-muted text-sm mt-1">{t('subtitle')}</p>

                  {/* Status indicator */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-muted">Available for projects</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div ref={contentRef}>
            <span className="text-accent font-mono text-sm mb-4 block">01 / ABOUT</span>

            <h2
              ref={titleRef}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
              style={{ perspective: '1000px' }}
            >
              {t('title')}
            </h2>

            <p ref={descRef} className="text-muted leading-relaxed mb-8 text-lg">
              {t('description')}
            </p>

            {/* Highlights */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  ref={(el) => { highlightsRef.current[index] = el; }}
                  className="flex items-center gap-3 p-4 bg-card rounded-xl border border-card-border hover:border-accent/50 transition-all duration-300 cursor-default group"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-sm text-foreground font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <Button href={`/${locale}/about`} className="group">
              <span>{t('cta')}</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
