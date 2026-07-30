'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const FIELD =
  'border-hairline w-full rounded-xs bg-surface px-4 py-3.5 text-base text-fg transition-colors duration-200 hover:border-line/20 focus:border-red-bright/60';

const LABEL =
  'block font-mono text-[10px] uppercase tracking-[0.16em] text-fg/70 transition-colors duration-200 group-focus-within:text-red-bright';

/**
 * The brief. Client Component because it owns submit state — nothing else. No GSAP:
 * the entry animation is the page-level [data-reveal] block, and the label/field
 * feedback is pure CSS (:focus-within), so there is no listener to leak and no
 * reduced-motion branch to get wrong.
 *
 * The POST contract is unchanged: JSON { name, email, company, projectType, message }
 * to /api/contact, success swaps the panel, failure surfaces the translated error.
 */
export function ContactForm() {
  const t = useTranslations('contact.form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const projectTypes = [
    { value: 'website', label: t('projectTypes.website') },
    { value: 'ecommerce', label: t('projectTypes.ecommerce') },
    { value: 'saas', label: t('projectTypes.saas') },
    { value: 'landing', label: t('projectTypes.landing') },
    { value: 'consulting', label: t('projectTypes.consulting') },
    { value: 'other', label: t('projectTypes.other') },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      company: String(formData.get('company') ?? ''),
      projectType: String(formData.get('projectType') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      setIsSubmitted(true);
    } catch {
      setErrorMessage(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        role="status"
        className="border-hairline flex min-h-80 flex-col justify-center rounded-xs bg-surface p-8 md:p-12"
      >
        <p className="hud-readout text-[10px] opacity-100! text-red-bright">✓ 200 / OK</p>
        <p className="type-display mt-6 text-[clamp(1.4rem,3.2vw,2.2rem)] text-fg">{t('success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
      <div className="grid gap-8 sm:grid-cols-2 md:gap-10">
        <div className="group">
          <label htmlFor="name" className={LABEL}>
            {t('name')} <span className="text-red-bright">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            autoComplete="name"
            className={`${FIELD} mt-3`}
          />
        </div>

        <div className="group">
          <label htmlFor="email" className={LABEL}>
            {t('email')} <span className="text-red-bright">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            className={`${FIELD} mt-3`}
          />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 md:gap-10">
        <div className="group">
          <label htmlFor="company" className={LABEL}>
            {t('company')}
          </label>
          <input
            type="text"
            id="company"
            name="company"
            autoComplete="organization"
            className={`${FIELD} mt-3`}
          />
        </div>

        <div className="group">
          <label htmlFor="projectType" className={LABEL}>
            {t('projectType')} <span className="text-red-bright">*</span>
          </label>
          <div className="relative mt-3">
            <select
              id="projectType"
              name="projectType"
              required
              defaultValue=""
              className={`${FIELD} cursor-pointer appearance-none pr-10`}
            >
              {/* No placeholder copy exists in the messages, so the field label doubles
                  as the empty option — translated, and `required` keeps it unselectable. */}
              <option value="" className="bg-surface text-fg">
                {t('projectType')}
              </option>
              {projectTypes.map((type) => (
                <option key={type.value} value={type.value} className="bg-surface text-fg">
                  {type.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-fg/60"
            >
              ▼
            </span>
          </div>
        </div>
      </div>

      <div className="group">
        <label htmlFor="message" className={LABEL}>
          {t('message')} <span className="text-red-bright">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className={`${FIELD} mt-3 resize-y`}
        />
      </div>

      <div className="pt-2">
        {errorMessage ? (
          <p role="alert" className="mb-6 text-sm text-red-bright">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xs bg-red px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:bg-red-bright disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? (
            t('sending')
          ) : (
            <>
              {t('submit')}
              <span aria-hidden>→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
