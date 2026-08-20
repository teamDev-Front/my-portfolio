export interface Project {
  id: string;
  slug: string;
  category: 'healthPharma' | 'retailEcommerce' | 'sustainability' | 'aiData' | 'corporate';
  image: string;
  technologies: string[];
  liveUrl?: string;
  /** Extra links (app stores, admin panel, second domain). */
  extraLinks?: { label: string; url: string }[];
  featured: boolean;
  translations: {
    en: {
      title: string;
      shortDescription: string;
      fullDescription: string;
      problem: string;
      solution: string;
      features: string[];
      results?: string[];
    };
    'pt-BR': {
      title: string;
      shortDescription: string;
      fullDescription: string;
      problem: string;
      solution: string;
      features: string[];
      results?: string[];
    };
  };
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'sara-bula-digital',
    category: 'healthPharma',
    image: '/images/projects/sara-bula-digital-grupo-nc-ems.jpg',
    technologies: ['Angular', 'TypeScript', 'MongoDB', 'Acessibilidade WCAG'],
    liveUrl: 'https://www.sara.com.br/',
    featured: true,
    translations: {
      en: {
        title: 'Sara — Digital Medication Leaflet',
        shortDescription: 'The pioneer digital leaflet platform in Brazil, for Grupo NC (EMS)',
        fullDescription:
          'Sara is the digital medication leaflet platform of Grupo NC (EMS) — the pioneer of the digital leaflet in Brazil. It gives patients the full, always up-to-date leaflet with accessibility built in: adjustable text size, zoom, audio leaflet and Brazilian Sign Language (Libras) support, plus medication search, a news portal and reminders.',
        problem:
          'Paper leaflets are printed small, go out of date the moment they leave the factory, and are effectively unreadable for people with low vision, low literacy or hearing impairment.',
        solution:
          'An accessible web platform serving the leaflet straight from the medication database, so every patient reads the current version — with audio, Libras, zoom and type-size controls as first-class features rather than add-ons.',
        features: [
          'Medication and product search',
          'Adjustable text size and zoom',
          'Audio leaflet (audiobula)',
          'Libras (Brazilian Sign Language) support',
          'Leaflet always in sync with the medication database',
          'News portal and medication reminders',
        ],
        results: [
          'Pioneer of the digital leaflet in Brazil',
          'Accessibility for low vision, low literacy and deaf patients',
          'No reprint cycle — the leaflet is updated at the source',
        ],
      },
      'pt-BR': {
        title: 'Sara — Bula Digital',
        shortDescription: 'A plataforma pioneira em bula digital no Brasil, do Grupo NC (EMS)',
        fullDescription:
          'Sara é a plataforma de bula digital do Grupo NC (EMS) — pioneira da bula digital no Brasil. Entrega ao paciente a bula completa e sempre atualizada com acessibilidade de verdade: tamanho de texto ajustável, zoom, audiobula e suporte a Libras, além de busca de medicamentos, portal de notícias e lembretes.',
        problem:
          'A bula de papel é impressa em corpo minúsculo, fica desatualizada assim que sai da fábrica e é praticamente ilegível para quem tem baixa visão, baixa escolaridade ou deficiência auditiva.',
        solution:
          'Uma plataforma web acessível que serve a bula direto do banco de medicamentos, garantindo que todo paciente leia a versão vigente — com áudio, Libras, zoom e controle de tipografia como recursos centrais, não como remendo.',
        features: [
          'Busca de medicamentos e produtos',
          'Tamanho de texto ajustável e zoom',
          'Audiobula (versão em áudio)',
          'Suporte a Libras',
          'Bula sempre sincronizada com a base de medicamentos',
          'Portal de notícias e lembretes de medicação',
        ],
        results: [
          'Pioneira da bula digital no Brasil',
          'Acessibilidade para baixa visão, baixa escolaridade e pessoas surdas',
          'Sem ciclo de reimpressão — a bula é atualizada na origem',
        ],
      },
    },
  },
  {
    id: '2',
    slug: 'infinitegear-bios',
    category: 'healthPharma',
    image: '/images/projects/infinitegear-bios-prescricoes-implantes-hormonais.jpg',
    technologies: ['Next.js 14', 'React', 'TypeScript', 'Prisma', 'PostgreSQL', 'Supabase Storage', 'jsPDF', 'Webhooks'],
    liveUrl: 'https://bios.infinitesign.com.br/login',
    featured: true,
    translations: {
      en: {
        title: 'InfiniteGear — Prescription Platform',
        shortDescription: 'Prescription system for compounded hormone implants, in daily clinical use',
        fullDescription:
          'InfiniteGear (BIOS) manages the full lifecycle of prescriptions for compounded hormone implants across three professional roles — prescriber, commercial and pharmacist — with digital signature via InfiniteSign/Autentique, generated regulatory documents and a full webhook audit trail. Live in production with over 12,500 patients and 18,000 prescriptions on record.',
        problem:
          'Prescribing compounded hormone implants involves a regulated chain — prescriber, commercial approval, pharmacist manipulation with batch tracking, signed responsibility terms. Handled by paper and spreadsheets, it loses traceability exactly where the regulator demands it.',
        solution:
          'A role-based platform where each step is a state transition on the prescription: the prescriber issues it, the commercial team approves it against an order number, and the pharmacist finalises it recording the batch of every medication — each step generating its own signed PDF and firing an audited webhook.',
        features: [
          'Four roles with two-layer RBAC (route middleware + per-handler checks)',
          'Prescription lifecycle: pending → approved → finalised, with rejection and cancellation',
          'Up to 6 medications per prescription, each with concentration and batch',
          'Automatic responsibility and manipulation terms as PDFs, with rendered cursive signatures',
          'Digital signature via InfiniteSign / Autentique, token per prescriber',
          'Full webhook logging (payload, response, error) auditable per role',
          'Patient registry with CPF validation and passport support for foreign patients',
          'Bulk patient import from CSV with column-mapping wizard',
        ],
        results: [
          '12,500+ patients registered in production',
          '18,000+ prescriptions processed',
          'Every issued document traceable — sequential numbering and stored history',
        ],
      },
      'pt-BR': {
        title: 'InfiniteGear — Plataforma de Prescrições',
        shortDescription: 'Sistema de prescrição de implantes hormonais manipulados, em uso clínico diário',
        fullDescription:
          'O InfiniteGear (BIOS) gerencia todo o ciclo de vida das prescrições de implantes hormonais manipulados entre três perfis profissionais — prescritor, comercial e farmacêutico — com assinatura digital via InfiniteSign/Autentique, geração dos documentos regulatórios e trilha de auditoria completa de webhooks. Em produção, com mais de 12.500 pacientes e 18.000 prescrições registradas.',
        problem:
          'Prescrever implante hormonal manipulado envolve uma cadeia regulada — prescritor, aprovação comercial, manipulação farmacêutica com rastreio de lote, termos de responsabilidade assinados. No papel e na planilha, essa cadeia perde rastreabilidade justamente onde o órgão regulador exige.',
        solution:
          'Uma plataforma por papel em que cada etapa é uma transição de estado da prescrição: o prescritor emite, o comercial aprova vinculando o número do pedido e o farmacêutico finaliza registrando o lote de cada medicamento — cada etapa gerando seu PDF assinado e disparando um webhook auditado.',
        features: [
          'Quatro perfis com RBAC em duas camadas (middleware de rota + verificação por handler)',
          'Ciclo da prescrição: pendente → aprovada → finalizada, com rejeição e cancelamento',
          'Até 6 medicamentos por prescrição, cada um com concentração e lote',
          'Termos de responsabilidade e manipulação gerados em PDF, com assinaturas cursivas renderizadas',
          'Assinatura digital via InfiniteSign / Autentique, com token por prescritor',
          'Log completo de webhooks (payload, resposta, erro) auditável por perfil',
          'Cadastro de pacientes com validação de CPF e suporte a estrangeiro por passaporte',
          'Importação de pacientes em lote via CSV com assistente de mapeamento de colunas',
        ],
        results: [
          'Mais de 12.500 pacientes cadastrados em produção',
          'Mais de 18.000 prescrições processadas',
          'Todo documento emitido é rastreável — numeração sequencial e histórico armazenado',
        ],
      },
    },
  },
  {
    id: '3',
    slug: 'vidget',
    category: 'aiData',
    image: '/images/projects/vidget-provador-virtual-ia-video-shoppable-ecommerce.jpg',
    technologies: ['Next.js', 'TypeScript', 'Gemini AI', 'Shopify API', 'Nuvemshop API', 'Supabase', 'pm2'],
    liveUrl: 'https://vidget.com.br/',
    extraLinks: [{ label: 'app.vidget.com.br', url: 'https://app.vidget.com.br/' }],
    featured: true,
    translations: {
      en: {
        title: 'Vidget — Shoppable Video & AI Try-On',
        shortDescription: 'Interactive video and AI virtual try-on embedded in e-commerce stores',
        fullDescription:
          'Vidget adds Stories/Reels-style interactive video to product pages and lets shoppers try clothes, glasses, shoes and accessories on virtually with AI. It ships as an embeddable widget with native Shopify and Nuvemshop integrations, its own try-on analytics, and a full merchant dashboard.',
        problem:
          'Product pages sell from static photos while the audience buys through video everywhere else — and for anything worn, the doubt "how will this look on me?" is what stalls the purchase and drives returns.',
        solution:
          'A widget that loads without hurting page performance, turns store video into shoppable stories, and runs an AI virtual try-on generated from the shopper\'s own photo — with per-store analytics behind it so the merchant sees what actually converts.',
        features: [
          'Stories/Reels interface on product pages, with product card and direct checkout',
          'AI virtual try-on (clothing, glasses, footwear, accessories)',
          'Officially homologated Nuvemshop app with auto-installed script',
          'Shopify integration via OAuth and ScriptTag, with GDPR compliance webhooks',
          'Proprietary try-on analytics with event dedupe and SKU-level product identification',
          'Tiny IIFE loader that defers the widget to first interaction, preserving LCP',
        ],
        results: [
          'Officially homologated by Nuvemshop',
          '100+ stores in production kept working through the migration to the native app',
          'Product identification by SKU with ~98% coverage in the analytics pipeline',
        ],
      },
      'pt-BR': {
        title: 'Vidget — Vídeo Shoppable & Provador Virtual com IA',
        shortDescription: 'Vídeo interativo e provador virtual com IA embarcados no e-commerce',
        fullDescription:
          'O Vidget leva vídeo interativo no estilo Stories/Reels para as páginas de produto e deixa o cliente experimentar roupas, óculos, calçados e acessórios virtualmente com IA. É entregue como widget embarcável, com integrações nativas Shopify e Nuvemshop, analytics próprio de try-on e painel completo para o lojista.',
        problem:
          'A página de produto vende com foto estática enquanto o público consome vídeo em todo o resto da internet — e, em qualquer produto vestível, a dúvida "como isso fica em mim?" é o que trava a compra e gera devolução.',
        solution:
          'Um widget que carrega sem penalizar a performance da página, transforma o vídeo da loja em stories compráveis e roda um provador virtual com IA gerado a partir da foto do próprio cliente — com analytics por loja por trás, para o lojista ver o que de fato converte.',
        features: [
          'Interface Stories/Reels na página de produto, com card do produto e ida direta ao checkout',
          'Provador virtual com IA (roupas, óculos, calçados, acessórios)',
          'App homologado oficialmente na Nuvemshop, com script auto-instalado',
          'Integração Shopify via OAuth e ScriptTag, com webhooks de compliance GDPR',
          'Analytics próprio de try-on, com deduplicação de eventos e identificação de produto por SKU',
          'Loader IIFE mínimo que adia o widget para a primeira interação, preservando o LCP',
        ],
        results: [
          'Homologado oficialmente pela Nuvemshop',
          'Mais de 100 lojas em produção mantidas funcionando durante a migração para o app nativo',
          'Identificação de produto por SKU com cerca de 98% de cobertura no analytics',
        ],
      },
    },
  },
  {
    id: '4',
    slug: 'mydose',
    category: 'healthPharma',
    image: '/images/projects/mydose-app-saude-habitos-gamificacao-ia.jpg',
    technologies: ['NestJS', 'React Native', 'Expo', 'Prisma', 'Google Cloud Run', 'Cloud SQL', 'WhatsApp Cloud API', 'SigNoz'],
    liveUrl: 'https://mydoseapp.com/',
    extraLinks: [
      { label: 'App Store', url: 'https://apps.apple.com/us/app/mydose-habits/id6757751380' },
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=habitsapp.android&hl=pt_BR' },
    ],
    featured: true,
    translations: {
      en: {
        title: 'MyDose — Health Habits Platform',
        shortDescription: 'Gamified habit and care platform for health professionals, on iOS and Android',
        fullDescription:
          'MyDose turns health professionals into health businesses: a gamified patient community, guided protocols, integrated consultations and AI, spanning a NestJS API on Google Cloud Run, a web platform for experts and a React Native app published on the App Store and Google Play.',
        problem:
          'A health professional selling one-to-one consultations hits a ceiling: adherence drops between appointments, follow-up lives in WhatsApp, and revenue stops the moment the agenda is full.',
        solution:
          'A multi-repo platform where the community, the protocols, the consultations and the billing are one product — habits gamified through the D.O.S.E. method to hold adherence, and the professional\'s recurring revenue no longer bounded by the hours in their agenda.',
        features: [
          'Gamified habit tracking (D.O.S.E. method) with streaks, points and achievements',
          'Habit communities, guided protocols and online/in-person events',
          'WhatsApp Cloud API module (Meta) for appointment and rescheduling flows',
          'Electronic prescription through the Memed integration',
          'Multi-channel notification centre with Expo Push',
          'Image pipeline with signed URLs, server-side folder authorisation and thumbnails',
        ],
        results: [
          'Published on the App Store and Google Play',
          'API test suite with 3,150 passing tests',
          'Production database migrated from Supabase to Cloud SQL with no downtime for users',
        ],
      },
      'pt-BR': {
        title: 'MyDose — Plataforma de Saúde e Hábitos',
        shortDescription: 'Plataforma gamificada de hábitos e acompanhamento para profissionais de saúde, no iOS e Android',
        fullDescription:
          'O MyDose transforma profissionais de saúde em empresas de saúde: comunidade gamificada de pacientes, protocolos guiados, consultas integradas e IA, entre uma API NestJS no Google Cloud Run, uma plataforma web para especialistas e um app React Native publicado na App Store e no Google Play.',
        problem:
          'O profissional de saúde que vende consulta um a um esbarra num teto: a adesão cai entre os atendimentos, o acompanhamento vive no WhatsApp e o faturamento para no instante em que a agenda enche.',
        solution:
          'Uma plataforma multi-repo em que comunidade, protocolos, consultas e cobrança são um produto só — com hábitos gamificados pelo método D.O.S.E. para sustentar a adesão e uma receita recorrente que deixa de depender das horas da agenda.',
        features: [
          'Hábitos gamificados (método D.O.S.E.) com streaks, pontos e conquistas',
          'Comunidades de hábitos, protocolos guiados e eventos online e presenciais',
          'Módulo WhatsApp Cloud API (Meta) para fluxos de consulta e reagendamento',
          'Prescrição eletrônica via integração com a Memed',
          'Central de notificações multi-canal com Expo Push',
          'Pipeline de imagens com signed URLs, autorização de pasta no servidor e thumbnails',
        ],
        results: [
          'Publicado na App Store e no Google Play',
          'Suíte de testes da API com 3.150 testes verdes',
          'Banco de produção migrado de Supabase para Cloud SQL sem indisponibilidade para os usuários',
        ],
      },
    },
  },
  {
    id: '5',
    slug: 'arambi',
    category: 'aiData',
    image: '/images/projects/arambi-gestao-agronegocio-financeiro-estoque.jpg',
    technologies: ['Next.js 16', 'React 19', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS v4', 'Recharts', 'PDFMonkey'],
    liveUrl: 'https://arambi.com.br/',
    featured: true,
    translations: {
      en: {
        title: 'AramBI — Agribusiness Management',
        shortDescription: 'The spreadsheet that ran a farming group, rebuilt as a real system',
        fullDescription:
          'AramBI replaced the spreadsheet stack that ran a family agribusiness group: finance, grain inventory, documents, profit distribution, livestock, machinery and a mobile portal for field workers — all on live data, with role-based access for partners, editors and viewers.',
        problem:
          'The operation ran on an Excel "Cash Flow" file with several sub-tabs, copied by hand into a second "Calculation Memory" file that became the report. Every month the numbers were retyped, and every retype was a chance to be wrong.',
        solution:
          'The report spreadsheet became the system dashboard, reading Supabase in real time. Postgres triggers keep the balances consistent at the source — FIFO grain write-off, distribution reconciliation, recycle bin on delete — so the numbers no longer depend on anyone copying a cell correctly.',
        features: [
          'Power BI-style dashboard, finance module and editable ledger with indicators',
          'Grain inventory integrated from DFe invoices, with FIFO write-off by volume',
          'Documents module with versioning, watermark and autosave',
          'Eight AI assistants (finance, accounting, labour/environmental/tax/contract law, invoices, inventory)',
          'Profit distribution, annual provisioning and future sales',
          'Livestock, machinery with licensing alerts, rain and vaccination calendars',
          'Mobile PWA worker portal: CPF login, work tickets with automatic mileage, fuel logging',
          'RBAC (admin, editor, partner, viewer), audit logs and a 30-day recycle bin',
        ],
        results: [
          '1,282 spreadsheet entries across 13 months migrated, balances matching to the cent',
          'First grain inventory integration: 3 harvests, 59 electronic invoices reconciled',
          'Around 56 SQL migrations designed and applied in production',
        ],
      },
      'pt-BR': {
        title: 'AramBI — Gestão para o Agronegócio',
        shortDescription: 'A planilha que tocava um grupo do agro, reconstruída como sistema de verdade',
        fullDescription:
          'O AramBI substituiu o conjunto de planilhas que tocava um grupo familiar do agronegócio: financeiro, estoque de grãos, documentos, distribuição de lucro, animais, maquinário e um portal mobile para os colaboradores de campo — tudo em dado vivo, com acesso por papel para sócios, editores e visualizadores.',
        problem:
          'A operação rodava numa planilha "Fluxo de Caixa" com várias subabas, copiada à mão para uma segunda planilha "Memória de Cálculo" que virava o relatório. Todo mês os números eram redigitados, e cada redigitação era uma chance de errar.',
        solution:
          'A planilha de relatório virou o dashboard do sistema, lendo o Supabase em tempo real. Triggers no Postgres mantêm os saldos consistentes na origem — baixa de estoque FIFO, consolidação da distribuição, lixeira no delete — então o número não depende mais de alguém copiar a célula certa.',
        features: [
          'Dashboard estilo Power BI, módulo financeiro e planilha editável com indicadores',
          'Estoque de grãos integrado a partir das notas DFe, com baixa FIFO por volume',
          'Módulo de documentos com versionamento, marca d\'água e autosave',
          'Oito assistentes de IA (financeiro, contabilidade, adv. trabalhista, ambiental, tributária, contratual, notas fiscais, estoque)',
          'Distribuição de lucro, provisionamento anual e vendas futuras',
          'Animais por lote, maquinário com alerta de licenciamento, calendários de chuva e vacinação',
          'Portal do Colaborador em PWA mobile: acesso por CPF, talões com KM automático, abastecimentos',
          'RBAC (admin, editor, sócio, viewer), logs de auditoria e lixeira de 30 dias',
        ],
        results: [
          '1.282 lançamentos de 13 meses migrados, com saldos batendo ao centavo com a planilha',
          'Primeira integralização do estoque de grãos: 3 safras e 59 notas eletrônicas conciliadas',
          'Cerca de 56 migrations SQL projetadas e aplicadas em produção',
        ],
      },
    },
  },
  {
    id: '6',
    slug: 'staydepot',
    category: 'aiData',
    image: '/images/projects/staydepot-analise-short-stay-inteligencia-dados.jpg',
    technologies: ['Next.js', 'TypeScript', 'n8n', 'Python', 'AI', 'Stripe', 'Supabase'],
    liveUrl: 'https://www.shortstaydepot.com/',
    featured: true,
    translations: {
      en: {
        title: 'StayDepot',
        shortDescription: 'AI intelligence for short-stay property performance',
        fullDescription:
          'StayDepot analyses each short-stay property inside its own micro-market and turns the evidence into practical decisions — for investors protecting their return and property managers winning new portfolios. Products range from a single report (SD Print) to multi-report packages (SD Vision) and managed accounts (SD Multi).',
        problem:
          'A host looking at their own listing has no reference: is the occupancy low, or is the whole street low that month? Without a micro-market benchmark, pricing and listing decisions are guesswork.',
        solution:
          'A pipeline that reads the property\'s data, compares it against its regional micro-market and returns a prioritised diagnosis — competitive benchmark and action list, not a dashboard the host has to interpret alone.',
        features: [
          'Individual property diagnosis',
          'Competitive benchmark within the regional micro-market',
          'Prioritised action recommendations',
          'Separate journeys for investors and property managers',
          'Report packages (SD Print, SD Vision, SD Multi)',
          'Stripe checkout and subscription infrastructure',
        ],
        results: [
          'Full payment gateway migration to Stripe delivered in production',
          'Product line restructured into three commercial tiers',
        ],
      },
      'pt-BR': {
        title: 'StayDepot',
        shortDescription: 'Inteligência com IA para performance de imóveis de temporada',
        fullDescription:
          'A StayDepot analisa cada imóvel de temporada dentro do seu próprio micro-mercado e transforma a evidência em decisão prática — para investidores protegerem o retorno e gestoras conquistarem novas carteiras. Os produtos vão do relatório avulso (SD Print) aos pacotes multi-relatório (SD Vision) e contas gerenciadas (SD Multi).',
        problem:
          'O anfitrião que olha só para o próprio anúncio não tem referência: a ocupação está baixa, ou a rua inteira está baixa naquele mês? Sem benchmark de micro-mercado, decisão de preço e de anúncio vira chute.',
        solution:
          'Um pipeline que lê os dados do imóvel, compara com o micro-mercado da região e devolve um diagnóstico priorizado — benchmark competitivo e lista de ações, não um dashboard que o anfitrião precisa interpretar sozinho.',
        features: [
          'Diagnóstico individual do imóvel',
          'Benchmark competitivo dentro do micro-mercado regional',
          'Recomendações de ação priorizadas',
          'Jornadas separadas para investidores e para gestoras',
          'Pacotes de relatórios (SD Print, SD Vision, SD Multi)',
          'Infraestrutura de checkout e assinaturas com Stripe',
        ],
        results: [
          'Migração completa do gateway de pagamento para Stripe entregue em produção',
          'Linha de produtos reestruturada em três níveis comerciais',
        ],
      },
    },
  },
  {
    id: '7',
    slug: 'aison-law',
    category: 'aiData',
    image: '/images/projects/aison-trademark-law-algorithms-ia-juridico.jpg',
    technologies: ['Next.js', 'React', 'TypeScript', 'shadcn/ui', 'SVG / flubber', 'Vitest'],
    liveUrl: 'https://aison-law.com/',
    featured: true,
    translations: {
      en: {
        title: 'Aison — Trademark Law in Algorithms',
        shortDescription: 'European trademark conflict analysis, calibrated against real case law',
        fullDescription:
          'Aison assesses trademark conflicts under European trademark law using algorithms calibrated against real decisions, then drafts the legal correspondence that follows. Delivered through Quantflow for a client in Potsdam, Germany.',
        problem:
          'Assessing likelihood of confusion between trademarks is expert work repeated case after case — visual, phonetic and conceptual similarity, class overlap, distinctiveness — and every hour of it is billed to someone.',
        solution:
          'A front-end where the whole assessment is visible and adjustable: each factor scored and explained, counsel able to override any of it, and the resulting letter drafted from the analysis the lawyer just approved.',
        features: [
          'Visual, phonetic and conceptual similarity analysis',
          'Goods and services class overlap comparison',
          'Distinctiveness assessment and likelihood-of-confusion score',
          'Automatic drafting of legal correspondence',
          'Transparency panels showing how each score was reached',
          'Brand loader rebuilt as inline vector SVG (flubber interpolation), sharp at any size and theme-aware',
        ],
        results: [
          'Calibrated against 1,179 EUIPO Board of Appeal decisions',
          '839 of 855 similarity cases correctly identified (98%)',
        ],
      },
      'pt-BR': {
        title: 'Aison — Direito Marcário em Algoritmos',
        shortDescription: 'Análise de conflito de marcas europeias, calibrada em jurisprudência real',
        fullDescription:
          'A Aison avalia conflitos de marca sob a lei europeia usando algoritmos calibrados em decisões reais e redige a correspondência jurídica que vem depois. Entregue através da Quantflow para um cliente em Potsdam, Alemanha.',
        problem:
          'Avaliar risco de confusão entre marcas é trabalho de especialista repetido caso após caso — semelhança visual, fonética e conceitual, sobreposição de classes, distintividade — e cada hora disso é cobrada de alguém.',
        solution:
          'Um front-end em que a avaliação inteira fica visível e ajustável: cada fator pontuado e explicado, o advogado podendo sobrescrever qualquer um deles, e a carta redigida a partir da análise que ele acabou de aprovar.',
        features: [
          'Análise de similaridade visual, fonética e conceitual',
          'Comparação de sobreposição de classes de produtos e serviços',
          'Avaliação de distintividade e score de risco de confusão',
          'Redação automática da correspondência jurídica',
          'Painéis de transparência mostrando como cada score foi obtido',
          'Loader da marca reconstruído em SVG vetorial inline (interpolação com flubber), nítido em qualquer tamanho e reativo ao tema',
        ],
        results: [
          'Calibrada em 1.179 decisões do Board of Appeal do EUIPO',
          '839 de 855 casos de similaridade identificados corretamente (98%)',
        ],
      },
    },
  },
  {
    id: '8',
    slug: 'quantflow',
    category: 'corporate',
    image: '/images/projects/quantflow-ai-platform-suica-next-js.jpg',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://www.quantflow.tech/',
    featured: false,
    translations: {
      en: {
        title: 'Quantflow',
        shortDescription: 'Website for the Swiss enterprise AI platform I work at',
        fullDescription:
          'Quantflow is an enterprise AI platform that automates administrative tasks, improves data accessibility and integrates with existing software — based in Switzerland and Liechtenstein. I built the website in Next.js, and I am part of the team behind the platform.',
        problem:
          'Selling enterprise AI in Switzerland means the buyer\'s first question is not about the model — it is where the data lives and who can see it.',
        solution:
          'A site that answers the compliance question in the same breath as the pitch: deployment region, security posture and product line stated up front, in the minimal editorial language the market expects.',
        features: [
          'Presentation of the Quantflow AI platform and the PermitSolar product',
          'Security and compliance section (GDPR, encryption, audit logs, data ownership)',
          'Deployment options: Switzerland-only, Europe-only, worldwide, on-premises',
          'Minimal editorial design with mono typography',
          'Responsive, performance-focused Next.js build',
        ],
      },
      'pt-BR': {
        title: 'Quantflow',
        shortDescription: 'Site da plataforma suíça de IA corporativa onde trabalho',
        fullDescription:
          'A Quantflow é uma plataforma de IA corporativa que automatiza tarefas administrativas, melhora o acesso a dados e integra com os sistemas existentes — sediada na Suíça e em Liechtenstein. Eu construí o site em Next.js e faço parte do time por trás da plataforma.',
        problem:
          'Vender IA corporativa na Suíça significa que a primeira pergunta do comprador não é sobre o modelo — é onde o dado mora e quem consegue vê-lo.',
        solution:
          'Um site que responde à pergunta de compliance no mesmo fôlego do pitch: região de deploy, postura de segurança e linha de produto ditas logo de cara, na linguagem editorial mínima que o mercado espera.',
        features: [
          'Apresentação da plataforma Quantflow AI e do produto PermitSolar',
          'Seção de segurança e conformidade (GDPR, criptografia, logs de auditoria, propriedade dos dados)',
          'Opções de deploy: apenas Suíça, apenas Europa, mundial, on-premises',
          'Design editorial minimalista com tipografia mono',
          'Build Next.js responsivo e focado em performance',
        ],
      },
    },
  },
  {
    id: '9',
    slug: 'mccreedy-studio',
    category: 'corporate',
    image: '/images/projects/mccreedy-studio-conor-mccreedy-arte-contemporanea.jpg',
    technologies: ['Next.js 15', 'React 19', 'GSAP / ScrollTrigger', 'Three.js', 'Lenis', 'TypeScript'],
    liveUrl: 'https://mccstudio.conormccreedy.com/',
    featured: false,
    translations: {
      en: {
        title: 'McCreedy Studio',
        shortDescription: 'Cinematic scroll-driven site for contemporary artist Conor McCreedy',
        fullDescription:
          'A site built as an artwork rather than a portfolio: the homepage is a scroll journey in Z-depth through three eras of the artist\'s work, with an infinite drag canvas for the archive, text dissolving into particles and a reactive orb. Delivered through Quantflow for the artist Conor McCreedy.',
        problem:
          'A conventional gallery grid flattens an artist\'s work into thumbnails — the exact opposite of what a body of painting is supposed to do to the person looking at it.',
        solution:
          'The site travels forward instead of scrolling down: each era arrives as its own scene, the archive is an infinite canvas you drag through, and the paintings sit alone on the page long enough to be looked at.',
        features: [
          'Scroll journey in Z-depth across three visual eras',
          'Infinite drag canvas for the archive',
          'Text-to-particle dissolve effect',
          'Mouse-reactive orb and animated TV-noise transitions',
          'Six inner pages (manifesto, bio, exhibitions, books, press, contact)',
          'Built with GSAP/ScrollTrigger, Lenis smooth scroll and Three.js',
        ],
      },
      'pt-BR': {
        title: 'McCreedy Studio',
        shortDescription: 'Site cinematográfico scroll-driven do artista contemporâneo Conor McCreedy',
        fullDescription:
          'Um site construído como obra, não como portfólio: a home é uma jornada de scroll em profundidade Z por três eras do trabalho do artista, com canvas de arraste infinito para o arquivo, texto se dissolvendo em partículas e um orb reativo. Entregue através da Quantflow para o artista Conor McCreedy.',
        problem:
          'A grade de galeria convencional achata a obra do artista em miniaturas — exatamente o oposto do que um conjunto de pinturas deveria provocar em quem olha.',
        solution:
          'O site viaja para frente em vez de rolar para baixo: cada era chega como cena própria, o arquivo é um canvas infinito que se arrasta, e as pinturas ficam sozinhas na tela tempo suficiente para serem olhadas.',
        features: [
          'Jornada de scroll em profundidade Z por três eras visuais',
          'Canvas de arraste infinito para o arquivo',
          'Efeito de dissolução de texto em partículas',
          'Orb reativo ao mouse e transições animadas de ruído de TV',
          'Seis páginas internas (manifesto, bio, exposições, livros, imprensa, contato)',
          'Construído com GSAP/ScrollTrigger, scroll suave Lenis e Three.js',
        ],
      },
    },
  },
  {
    id: '10',
    slug: 'bymen-ecommerce',
    category: 'retailEcommerce',
    image: '/images/projects/bymen-ecommerce-shopify-produtos-masculinos.jpg',
    technologies: ['Shopify', 'Liquid', 'JavaScript', 'CSS3', 'Integração de Pagamentos'],
    liveUrl: 'https://bymen.com.br/',
    featured: true,
    translations: {
      en: {
        title: 'ByMen E-commerce',
        shortDescription: 'Premium men\'s grooming store built on Shopify',
        fullDescription:
          'ByMen is a men\'s grooming e-commerce built on Shopify: beard and hair care, exfoliants, combs and kits, organised into product lines with a bold editorial identity and a conversion-focused storefront.',
        problem:
          'A men\'s grooming brand entering a market of established names needs a storefront that reads as premium immediately — a generic template signals a generic product.',
        solution:
          'A Shopify theme built around the brand\'s editorial identity: full-bleed photography, product lines as the navigation spine, and a checkout path short enough that the design never gets in the way of the purchase.',
        features: [
          'Custom Shopify theme built to the brand identity',
          'Catalogue organised by line (beard, hair, exfoliant, combs, kits)',
          'Promotional bar with first-purchase coupon',
          'Mobile-first responsive design',
          'Integrated payment gateways and WhatsApp support',
        ],
      },
      'pt-BR': {
        title: 'ByMen E-commerce',
        shortDescription: 'Loja premium de produtos masculinos construída no Shopify',
        fullDescription:
          'A ByMen é um e-commerce de produtos masculinos construído no Shopify: cuidados com barba e cabelo, esfoliantes, pentes e kits, organizados por linha de produto, com identidade editorial forte e vitrine focada em conversão.',
        problem:
          'Uma marca masculina entrando num mercado de nomes consolidados precisa de uma vitrine que leia como premium de imediato — template genérico sinaliza produto genérico.',
        solution:
          'Um tema Shopify construído em cima da identidade editorial da marca: fotografia em tela cheia, linhas de produto como espinha da navegação e um caminho até o checkout curto o bastante para o design nunca atrapalhar a compra.',
        features: [
          'Tema Shopify customizado sobre a identidade da marca',
          'Catálogo organizado por linha (barba, cabelo, esfoliante, pentes, kits)',
          'Barra promocional com cupom de primeira compra',
          'Design responsivo mobile-first',
          'Gateways de pagamento integrados e atendimento via WhatsApp',
        ],
      },
    },
  },
  {
    id: '11',
    slug: 'coquim',
    category: 'sustainability',
    image: '/images/projects/coquim-fibra-de-coco-organico-sustentavel.jpg',
    technologies: ['Framer', 'Design Responsivo', 'Multi-idioma', 'SEO'],
    liveUrl: 'https://coquim.com.br/',
    featured: true,
    translations: {
      en: {
        title: 'Coquim — Organic & Sustainable',
        shortDescription: 'Pioneers in coconut fibre gardening products since 1996',
        fullDescription:
          'Coquim has pioneered coconut fibre products for gardening since 1996 — 100% natural, biodegradable and environmentally committed. The site, built in Framer, tells that story and presents the catalogue, including the xaxim line, with multi-language support.',
        problem:
          'A company that has been doing the sustainable thing since 1996 was invisible next to newer brands that merely talk about it.',
        solution:
          'A site where the manufacturing itself is the argument: the craft shown in motion, the 1996 date stated plainly, and the catalogue reachable in a couple of clicks in more than one language.',
        features: [
          'Sustainability-led design with production video',
          'Product catalogue including the xaxim line',
          'Brand story since 1996',
          'Multi-language switcher',
          'Responsive layout and SEO for gardening keywords',
        ],
      },
      'pt-BR': {
        title: 'Coquim — Orgânico & Sustentável',
        shortDescription: 'Pioneiros em produtos de fibra de coco para jardinagem desde 1996',
        fullDescription:
          'A Coquim é pioneira em produtos de fibra de coco para jardinagem desde 1996 — 100% naturais, biodegradáveis e com compromisso ambiental. O site, construído em Framer, conta essa história e apresenta o catálogo, incluindo a linha de xaxim, com suporte a múltiplos idiomas.',
        problem:
          'Uma empresa que faz o certo em sustentabilidade desde 1996 estava invisível ao lado de marcas mais novas que apenas falam sobre isso.',
        solution:
          'Um site em que a própria fabricação é o argumento: o artesanato mostrado em movimento, a data de 1996 dita sem rodeio e o catálogo alcançável em dois cliques, em mais de um idioma.',
        features: [
          'Design conduzido pela sustentabilidade, com vídeo de produção',
          'Catálogo de produtos incluindo a linha de xaxim',
          'História da marca desde 1996',
          'Seletor de idiomas',
          'Layout responsivo e SEO para palavras-chave de jardinagem',
        ],
      },
    },
  },
  {
    id: '12',
    slug: 'piera',
    category: 'corporate',
    image: '/images/projects/piera-gestao-da-inovacao-consultoria.jpg',
    technologies: ['Framer', 'Design Responsivo', 'CMS', 'SEO'],
    liveUrl: 'https://www.piera.com.br/',
    featured: false,
    translations: {
      en: {
        title: 'Piera',
        shortDescription: 'Reference centre in innovation management',
        fullDescription:
          'Piera is a reference centre in innovation management, working across three fronts — consulting, Lab-Education and funding — with a client list that includes some of the most innovative companies in Brazil. The site was built in Framer.',
        problem:
          'An innovation consultancy has to prove the claim it sells, and a services page listing "consulting, education, funding" proves nothing.',
        solution:
          'The client logos and the "62 of the 150 most innovative companies in Brazil" line carry the argument high on the page, with the three fronts underneath as the route in.',
        features: [
          'Three service fronts: consulting, Lab-Education and funding',
          'Client logo wall with major Brazilian industry names',
          'PierX section and content area',
          'Managed content pages',
          'Responsive layout with editorial photography',
        ],
        results: ['62 of the 150 most innovative companies in Brazil are Piera clients'],
      },
      'pt-BR': {
        title: 'Piera',
        shortDescription: 'Centro de referência em Gestão da Inovação',
        fullDescription:
          'A Piera é um centro de referência em Gestão da Inovação, atuando em três frentes — Consultoria, Lab-Educação e Fomento — com uma carteira que inclui algumas das empresas mais inovadoras do Brasil. O site foi construído em Framer.',
        problem:
          'Uma consultoria de inovação precisa provar a afirmação que vende, e uma página de serviços listando "consultoria, educação, fomento" não prova nada.',
        solution:
          'Os logos dos clientes e a frase "das 150 empresas mais inovadoras do Brasil, 62 são clientes Piera" sustentam o argumento logo no alto da página, com as três frentes abaixo como porta de entrada.',
        features: [
          'Três frentes de atuação: Consultoria, Lab-Educação e Fomento',
          'Painel de logos de clientes com grandes nomes da indústria brasileira',
          'Seção PierX e área de conteúdos',
          'Páginas de conteúdo gerenciáveis',
          'Layout responsivo com fotografia editorial',
        ],
        results: ['Das 150 empresas mais inovadoras do Brasil, 62 são clientes Piera'],
      },
    },
  },
  {
    id: '13',
    slug: 'aion-solution',
    category: 'aiData',
    image: '/images/projects/aion-solution-vendas-inteligencia-artificial.jpg',
    technologies: ['React', 'Node.js', 'Integração de IA', 'Automação de Marketing', 'Analytics'],
    liveUrl: 'https://www.aionsolution.com.br/',
    featured: false,
    translations: {
      en: {
        title: 'AION Solution',
        shortDescription: 'AI-driven sales and marketing tools for SMBs',
        fullDescription:
          'AION Solution offers AI-driven sales tools for small and medium businesses — intelligent funnels, chatbots, marketing automation and business intelligence — presented through a dark, high-contrast site built around a free consultancy call.',
        problem:
          'Small and medium businesses hear about AI sales tooling constantly and have no way to judge whether any of it applies to their funnel.',
        solution:
          'A site that leads with the offer instead of the technology: one dominant claim, a free consultation as the single next step, and the solutions catalogue kept a click behind it.',
        features: [
          'Intelligent sales funnels',
          'AI-powered chatbots',
          'Marketing automation workflows',
          'Business intelligence dashboards',
          'Lead scoring and qualification',
          'High-contrast dark design with a consultation-focused CTA',
        ],
      },
      'pt-BR': {
        title: 'AION Solution',
        shortDescription: 'Ferramentas de vendas e marketing com IA para PMEs',
        fullDescription:
          'A AION Solution oferece ferramentas de vendas com IA para pequenas e médias empresas — funis inteligentes, chatbots, automação de marketing e business intelligence — apresentadas num site escuro e de alto contraste, construído em torno de uma consultoria gratuita.',
        problem:
          'Pequenas e médias empresas ouvem falar de IA em vendas o tempo todo e não têm como julgar se algo daquilo se aplica ao próprio funil.',
        solution:
          'Um site que lidera pela oferta e não pela tecnologia: uma afirmação dominante, a consultoria gratuita como único próximo passo e o catálogo de soluções guardado um clique atrás.',
        features: [
          'Funis de vendas inteligentes',
          'Chatbots com IA',
          'Fluxos de automação de marketing',
          'Dashboards de business intelligence',
          'Pontuação e qualificação de leads',
          'Design escuro de alto contraste com CTA focado em consultoria',
        ],
      },
    },
  },
  {
    id: '14',
    slug: 'smart-controller',
    category: 'corporate',
    image: '/images/projects/smart-controller-contabilidade-humanizada-jacarei.jpg',
    technologies: ['Framer', 'Design Responsivo', 'SEO Local', 'Captura de Leads'],
    liveUrl: 'https://smartcontroller.com.br/',
    featured: false,
    translations: {
      en: {
        title: 'Smart Controller',
        shortDescription: 'Humanized accounting consultancy specialised in Lucro Real',
        fullDescription:
          'Smart Cont is an accounting firm specialised in the Lucro Real tax regime, offering complete and humanized accounting consultancy across Jacareí, São José dos Campos, Vale do Paraíba, São Paulo and the rest of Brazil. Built in Framer.',
        problem:
          'Accounting firms all describe themselves the same way, so a business owner deciding whether to switch has nothing to go on except how the firm sounds.',
        solution:
          'The site leads with the switch itself — "I want to change accountants" as the primary action, named clients as proof, and the specialisms listed plainly so the reader can tell in seconds whether this firm handles their case.',
        features: [
          'Full service catalogue (accounting, tax, payroll, due diligence, valuation, auditing)',
          'Named client showcase',
          'Direct contact via WhatsApp and phone in the header',
          '"Talk to a specialist" lead-capture CTAs',
          'Regional SEO for Jacareí and Vale do Paraíba',
        ],
      },
      'pt-BR': {
        title: 'Smart Controller',
        shortDescription: 'Consultoria contábil humanizada especializada em Lucro Real',
        fullDescription:
          'A Smart Cont é um escritório de contabilidade especializado em Lucro Real, com consultoria contábil completa e humanizada para Jacareí, São José dos Campos, Vale do Paraíba, São Paulo e todo o Brasil. Construído em Framer.',
        problem:
          'Escritórios de contabilidade se descrevem todos do mesmo jeito, então o empresário que pensa em trocar não tem em que se apoiar além do tom do site.',
        solution:
          'O site lidera pela própria troca — "quero trocar de contabilidade" como ação principal, clientes nomeados como prova e as especialidades ditas de forma direta, para o leitor saber em segundos se o escritório atende o caso dele.',
        features: [
          'Catálogo completo de serviços (contábil, tributário, folha, due diligence, valuation, auditoria)',
          'Vitrine de clientes nomeados',
          'Contato direto por WhatsApp e telefone no topo',
          'CTAs de captura de lead "falar com especialista"',
          'SEO regional para Jacareí e Vale do Paraíba',
        ],
      },
    },
  },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((p) => p.slug === slug);
};

export const getFeaturedProjects = (): Project[] => {
  return projects.filter((p) => p.featured);
};

export const getProjectsByCategory = (category: Project['category']): Project[] => {
  return projects.filter((p) => p.category === category);
};
