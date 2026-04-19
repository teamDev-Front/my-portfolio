/**
 * Server component that emits a JSON-LD script tag for structured data.
 *
 * Renders as a plain <script type="application/ld+json"> so Google's
 * crawler finds it before any client-side JS executes. Because this file
 * is server-only, the payload is serialised at SSR/SSG time and shipped
 * as part of the static HTML — no hydration cost.
 *
 * Usage:
 *   <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Organization', ... }} />
 *
 * For multiple schemas on one page, render multiple <JsonLd /> instances.
 */

interface JsonLdProps {
  /** Schema.org object — ensure `@context` + `@type` are present. */
  data: Record<string, unknown>;
  /** Optional id for the script tag (useful if you need to DOM-target it). */
  id?: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // Next does not HTML-escape innerHTML of <script>, so we JSON.stringify
      // safely. Empty-string `replacer` + `indent=0` keeps payload minimal.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
