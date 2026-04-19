'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, MapPin, Globe, Linkedin, Github, Instagram, Calendar } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/Button';

gsap.registerPlugin(ScrollTrigger);

export function ContactInfo() {
  const t = useTranslations('contact');
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const socialsRef = useRef<HTMLDivElement>(null);

  const contactDetails = [
    { icon: Mail, label: t('info.email') },
    { icon: MapPin, label: t('info.location') },
    { icon: Globe, label: t('info.availability') },
  ];

  const socials = [
    { icon: Linkedin, href: 'https://linkedin.com/in/luizhabaeb', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/luizhabaeb', label: 'GitHub' },
    { icon: Instagram, href: 'https://instagram.com/luizhabaeb', label: 'Instagram' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards entrance animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: 50,
            rotateY: 15,
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.15,
          }
        );

        // 3D hover effect
        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const mouseX = e.clientX - centerX;
          const mouseY = e.clientY - centerY;

          const rotateX = (mouseY / rect.height) * -8;
          const rotateY = (mouseX / rect.width) * 8;

          gsap.to(card, {
            rotateX,
            rotateY,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
          });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
      });

      // Social icons animation
      if (socialsRef.current) {
        const icons = socialsRef.current.querySelectorAll('a');
        gsap.fromTo(
          icons,
          { opacity: 0, scale: 0, rotation: -180 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: socialsRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="space-y-8">
      {/* Contact Info */}
      <div
        ref={(el) => { cardsRef.current[0] = el; }}
        className="bg-card rounded-2xl border border-card-border p-6 md:p-8"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        <h3 className="text-xl font-semibold text-foreground mb-6">
          {t('info.title')}
        </h3>
        <div className="space-y-4">
          {contactDetails.map((item, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                <item.icon className="w-5 h-5 text-accent" />
              </div>
              <span className="text-foreground group-hover:text-accent transition-colors">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div
        ref={(el) => { cardsRef.current[1] = el; }}
        id="schedule"
        className="bg-card rounded-2xl border border-card-border p-6 md:p-8 relative overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            {t('schedule.title')}
          </h3>
          <p className="text-muted mb-6">
            {t('schedule.description')}
          </p>
          <Button href="mailto:contato@habaeb.com" className="w-full group">
            <Calendar className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            {t('schedule.button')}
          </Button>
        </div>
      </div>

      {/* Social */}
      <div
        ref={(el) => { cardsRef.current[2] = el; }}
        className="bg-card rounded-2xl border border-card-border p-6 md:p-8"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        <h3 className="text-xl font-semibold text-foreground mb-6">
          {t('social.title')}
        </h3>
        <div ref={socialsRef} className="flex gap-4">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-hcs-gray rounded-xl flex items-center justify-center text-muted hover:text-accent hover:bg-accent/10 hover:scale-110 transition-all duration-300"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
