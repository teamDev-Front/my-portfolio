import { Choreography } from '@/components/shell/Choreography';

/**
 * The FAQ, rendered as real content.
 *
 * These questions already fed the FAQPage JSON-LD, but the answers existed nowhere in the
 * visible DOM — so answer engines and AI crawlers had structured data with no prose to
 * corroborate or quote. Native <details> keeps every answer in the server HTML (open or
 * closed, the text is there and searchable), needs no JavaScript, and is keyboard- and
 * screen-reader-accessible for free.
 */
export function FaqSection({
  faqs,
  title,
}: {
  faqs: { question: string; answer: string }[];
  title: string;
}) {
  return (
    <Choreography name="services">
      {/* Reuses the services timeline (same editorial-list grammar), so it must declare
          the same stage/list hooks — without them the trigger would fall back to the
          Choreography wrapper, which is display:contents and has no measurable box. */}
      <section data-services-stage className="relative px-6 py-28 md:px-12 md:py-36">
        <div className="mx-auto max-w-4xl">
          <div data-services-header>
            <p className="hud-readout text-[10px] opacity-100! text-red-bright">FAQ</p>
            <h2 className="type-display mt-6 text-[clamp(1.8rem,4vw,3.2rem)] text-fg">{title}</h2>
          </div>

          <div data-services-list className="mt-14 border-t border-line/10">
            {faqs.map((faq) => (
              <details key={faq.question} data-service-row className="group border-b border-line/10">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-medium text-fg/85 transition-colors duration-200 group-open:text-fg md:text-lg">
                    {faq.question}
                  </h3>
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 font-mono text-sm text-red-bright transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p
                  data-speakable
                  className="max-w-3xl pb-7 text-sm leading-relaxed text-fg/60 md:text-base"
                >
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </Choreography>
  );
}
