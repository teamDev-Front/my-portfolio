'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/Button';

export function ContactForm() {
  const t = useTranslations('contact.form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const projectTypes = [
    { value: 'website', label: t('projectTypes.website') },
    { value: 'ecommerce', label: t('projectTypes.ecommerce') },
    { value: 'saas', label: t('projectTypes.saas') },
    { value: 'landing', label: t('projectTypes.landing') },
    { value: 'consulting', label: t('projectTypes.consulting') },
    { value: 'other', label: t('projectTypes.other') },
  ];

  if (isSubmitted) {
    return (
      <FadeIn>
        <div className="bg-card rounded-2xl border border-card-border p-8 text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {t('success')}
          </h3>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              {t('name')} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              {t('email')} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
              {t('company')}
            </label>
            <input
              type="text"
              id="company"
              name="company"
              className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-foreground mb-2">
              {t('projectType')} *
            </label>
            <select
              id="projectType"
              name="projectType"
              required
              className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
            >
              <option value="">--</option>
              {projectTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
            {t('message')} *
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? t('sending') : t('submit')}
          <Send className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </FadeIn>
  );
}
