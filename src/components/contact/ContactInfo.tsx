'use client';

import { useTranslations } from 'next-intl';
import { Mail, MapPin, Globe, Linkedin, Github, Instagram, Calendar } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/Button';

export function ContactInfo() {
  const t = useTranslations('contact');

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

  return (
    <div className="space-y-8">
      {/* Contact Info */}
      <FadeIn delay={0.1}>
        <div className="bg-card rounded-2xl border border-card-border p-6 md:p-8">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            {t('info.title')}
          </h3>
          <div className="space-y-4">
            {contactDetails.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <span className="text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Schedule */}
      <FadeIn delay={0.2}>
        <div id="schedule" className="bg-card rounded-2xl border border-card-border p-6 md:p-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            {t('schedule.title')}
          </h3>
          <p className="text-muted mb-6">
            {t('schedule.description')}
          </p>
          <Button href="mailto:contact@habaeb.dev" className="w-full">
            <Calendar className="w-4 h-4 mr-2" />
            {t('schedule.button')}
          </Button>
        </div>
      </FadeIn>

      {/* Social */}
      <FadeIn delay={0.3}>
        <div className="bg-card rounded-2xl border border-card-border p-6 md:p-8">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            {t('social.title')}
          </h3>
          <div className="flex gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-hcs-gray rounded-xl flex items-center justify-center text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
