export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image?: string;
  translations: {
    en: {
      quote: string;
    };
    'pt-BR': {
      quote: string;
    };
  };
  metrics?: {
    /** i18n key under `testimonials.metrics` — the label is translated, not stored here. */
    key: 'stores' | 'prescriptions' | 'patients' | 'entries' | 'reports';
    /** The number the counter climbs to. Rendered with a locale thousands separator. */
    value: number;
    /** Rendered before the number (e.g. "+"). */
    prefix?: string;
  };
}

/**
 * Every number here is a fact from the delivered system — store counts, records in
 * production, entries migrated — not a satisfaction score. The quotes describe what was
 * built and what it replaced.
 */
export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'InfiniteGear · BIOS',
    role: 'Health / Prescriptions',
    company: 'InfiniteSign',
    translations: {
      en: {
        quote:
          'The prescription platform runs the full chain for compounded hormone implants — prescriber, commercial approval and pharmacist manipulation with batch tracking — with digital signature and an auditable trail on every document issued. It holds more than 12,500 patients and 18,000 prescriptions in production.',
      },
      'pt-BR': {
        quote:
          'A plataforma de prescrições conduz toda a cadeia dos implantes hormonais manipulados — prescritor, aprovação comercial e manipulação farmacêutica com rastreio de lote — com assinatura digital e trilha auditável em cada documento emitido. Hoje sustenta mais de 12.500 pacientes e 18.000 prescrições em produção.',
      },
    },
    metrics: {
      key: 'prescriptions',
      value: 18000,
      prefix: '+',
    },
  },
  {
    id: '2',
    name: 'Vidget',
    role: 'E-commerce / AI',
    company: 'Vidget',
    translations: {
      en: {
        quote:
          'Shoppable video and AI virtual try-on embedded straight into the storefront. The app was officially homologated by Nuvemshop, and the migration to the native integration kept more than 100 stores already in production running without a single manual reinstall.',
      },
      'pt-BR': {
        quote:
          'Vídeo shoppable e provador virtual com IA embarcados direto na vitrine da loja. O app foi homologado oficialmente pela Nuvemshop, e a migração para a integração nativa manteve mais de 100 lojas já em produção rodando sem uma única reinstalação manual.',
      },
    },
    metrics: {
      key: 'stores',
      value: 100,
      prefix: '+',
    },
  },
  {
    id: '3',
    name: 'AramBI',
    role: 'Agribusiness / Management',
    company: 'Grupo Aramburu',
    translations: {
      en: {
        quote:
          'The spreadsheet stack that ran the group became a system: finance, grain inventory from electronic invoices, documents, profit distribution and a field-worker portal. 1,282 entries across 13 months were migrated with the balances matching the original spreadsheet to the cent.',
      },
      'pt-BR': {
        quote:
          'O conjunto de planilhas que tocava o grupo virou sistema: financeiro, estoque de grãos a partir das notas eletrônicas, documentos, distribuição de lucro e portal do colaborador de campo. Foram 1.282 lançamentos de 13 meses migrados, com os saldos batendo ao centavo com a planilha original.',
      },
    },
    metrics: {
      key: 'entries',
      value: 1282,
    },
  },
  {
    id: '4',
    name: 'StayDepot',
    role: 'Data / Short Stay',
    company: 'StayDepot',
    translations: {
      en: {
        quote:
          'Each short-stay property analysed inside its own regional micro-market, turning the benchmark into a prioritised action list for investors and property managers. The payment infrastructure was fully migrated to Stripe and the product line restructured into three commercial tiers.',
      },
      'pt-BR': {
        quote:
          'Cada imóvel de temporada analisado dentro do seu micro-mercado regional, transformando o benchmark em lista priorizada de ações para investidores e gestoras. A infraestrutura de pagamento foi migrada por completo para Stripe e a linha de produtos reestruturada em três níveis comerciais.',
      },
    },
  },
];
