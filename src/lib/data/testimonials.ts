export interface Testimonial {
  id: string;
  name: string;
  company: string;
  image?: string;
  translations: {
    en: {
      /** Sector / product line, shown next to the name — translated, so it reads
       *  in the visitor's language rather than always in English. */
      role: string;
      quote: string;
    };
    'pt-BR': {
      role: string;
      quote: string;
    };
  };
  metrics?: {
    /** i18n key under `testimonials.metrics` — the label is translated, not stored here. */
    key: 'stores' | 'prescriptions' | 'tests' | 'entries' | 'accuracy';
    /** The number the counter climbs to. Rendered with a locale thousands separator. */
    value: number;
    /** Rendered before the number (e.g. "+"). */
    prefix?: string;
    /** Rendered after the number (e.g. "%"). */
    suffix?: string;
  };
}

/**
 * Every number here is a fact from the delivered system — records in production, stores
 * live, entries migrated, tests passing — never a satisfaction score. The quotes say what
 * was built and what it replaced.
 *
 * Entries WITH a metric become ledger rows; entries without one close the section as
 * short quotes. Each project therefore appears exactly once.
 */
export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'InfiniteGear · BIOS',
    company: 'InfiniteSign',
    translations: {
      en: {
        role: 'Health / Prescriptions',
        quote:
          'Runs the full chain for compounded hormone implants — prescriber, commercial approval and pharmacist manipulation with batch tracking — with digital signature and an auditable trail on every document issued.',
      },
      'pt-BR': {
        role: 'Saúde / Prescrições',
        quote:
          'Conduz toda a cadeia dos implantes hormonais manipulados — prescritor, aprovação comercial e manipulação farmacêutica com rastreio de lote — com assinatura digital e trilha auditável em cada documento emitido.',
      },
    },
    metrics: { key: 'prescriptions', value: 18000, prefix: '+' },
  },
  {
    id: '2',
    name: 'MyDose',
    company: 'MyDose LLC',
    translations: {
      en: {
        role: 'Native app / iOS + Android',
        quote:
          'A native app on the App Store and Google Play, backed by a NestJS API on Google Cloud Run: gamified habits, WhatsApp Cloud API flows and electronic prescription — with the production database migrated to Cloud SQL live.',
      },
      'pt-BR': {
        role: 'App nativo / iOS + Android',
        quote:
          'App nativo publicado na App Store e no Google Play, sobre uma API NestJS no Google Cloud Run: hábitos gamificados, fluxos via WhatsApp Cloud API e prescrição eletrônica — com o banco de produção migrado para Cloud SQL sem parar.',
      },
    },
    metrics: { key: 'tests', value: 3150 },
  },
  {
    id: '3',
    name: 'Vidget',
    company: 'Vidget',
    translations: {
      en: {
        role: 'E-commerce / AI',
        quote:
          'Shoppable video and AI virtual try-on embedded straight into the storefront. Officially homologated by Nuvemshop, and the migration to the native integration kept every store already live running without a manual reinstall.',
      },
      'pt-BR': {
        role: 'E-commerce / IA',
        quote:
          'Vídeo shoppable e provador virtual com IA embarcados direto na vitrine. Homologado oficialmente pela Nuvemshop, e a migração para a integração nativa manteve todas as lojas já no ar sem uma reinstalação manual.',
      },
    },
    metrics: { key: 'stores', value: 100, prefix: '+' },
  },
  {
    id: '4',
    name: 'AramBI',
    company: 'Grupo Aramburu',
    translations: {
      en: {
        role: 'Agribusiness / Management',
        quote:
          'The spreadsheet stack that ran the group became a system: finance, grain inventory from electronic invoices, documents and a field-worker portal — migrated with the balances matching the original spreadsheet to the cent.',
      },
      'pt-BR': {
        role: 'Agro / Gestão',
        quote:
          'O conjunto de planilhas que tocava o grupo virou sistema: financeiro, estoque de grãos a partir das notas eletrônicas, documentos e portal do colaborador — migrado com os saldos batendo ao centavo com a planilha original.',
      },
    },
    metrics: { key: 'entries', value: 1282 },
  },
  {
    id: '5',
    name: 'Aison',
    company: 'Aison GmbH',
    translations: {
      en: {
        role: 'Legal / AI',
        quote:
          'European trademark conflict analysis calibrated against 1,179 EUIPO Board of Appeal decisions, scoring similarity and distinctiveness and drafting the legal correspondence that follows.',
      },
      'pt-BR': {
        role: 'Jurídico / IA',
        quote:
          'Análise de conflito de marcas europeias calibrada em 1.179 decisões do Board of Appeal do EUIPO, pontuando similaridade e distintividade e redigindo a correspondência jurídica que vem depois.',
      },
    },
    metrics: { key: 'accuracy', value: 98, suffix: '%' },
  },
  {
    id: '6',
    name: 'Sara · Grupo NC (EMS)',
    company: 'Grupo NC',
    translations: {
      en: {
        role: 'Health / Pharma',
        quote:
          'The pioneer digital medication leaflet in Brazil: the full, always-current leaflet with audio, Libras sign language, zoom and type-size controls built in as first-class features.',
      },
      'pt-BR': {
        role: 'Saúde / Pharma',
        quote:
          'A pioneira da bula digital no Brasil: a bula completa e sempre vigente, com audiobula, Libras, zoom e controle de tipografia como recursos centrais, não como remendo.',
      },
    },
  },
  {
    id: '7',
    name: 'StayDepot',
    company: 'StayDepot',
    translations: {
      en: {
        role: 'Data / Short Stay',
        quote:
          'Each short-stay property analysed inside its own regional micro-market, turning the benchmark into a prioritised action list — with the payment infrastructure fully migrated to Stripe.',
      },
      'pt-BR': {
        role: 'Dados / Temporada',
        quote:
          'Cada imóvel de temporada analisado dentro do seu micro-mercado regional, transformando o benchmark em lista priorizada de ações — com a infraestrutura de pagamento migrada por completo para Stripe.',
      },
    },
  },
];
