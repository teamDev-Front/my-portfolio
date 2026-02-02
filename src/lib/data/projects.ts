export interface Project {
  id: string;
  slug: string;
  category: 'healthPharma' | 'retailEcommerce' | 'sustainability' | 'aiData' | 'corporate';
  image: string;
  technologies: string[];
  liveUrl?: string;
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
    image: '/images/projects/sara.jpg',
    technologies: ['React', 'Next.js', 'TypeScript', 'Accessibility APIs', 'Libras Integration'],
    liveUrl: 'https://sara.grupocimed.com.br',
    featured: true,
    translations: {
      en: {
        title: 'Sara - Digital Medication Leaflet',
        shortDescription: 'Accessible digital medication leaflet platform for Grupo NC',
        fullDescription: 'Sara is a digital medication leaflet platform offering accessible features like adjustable text size, zoom, audio versions and Libras (Brazilian Sign Language) support. The platform is constantly updated to ensure sustainability and compliance.',
        problem: 'Traditional paper leaflets are difficult to read, not accessible for people with disabilities, and have significant environmental impact.',
        solution: 'Built a comprehensive digital platform with multiple accessibility features, following WCAG guidelines, and integrated with the company\'s medication database for real-time updates.',
        features: [
          'Adjustable text size and zoom functionality',
          'Audio versions of medication information',
          'Libras (Brazilian Sign Language) support',
          'Real-time database updates',
          'Mobile-responsive design',
          'Sustainable digital-first approach'
        ],
        results: [
          '95% user satisfaction rate',
          'Reduced paper waste significantly',
          'Improved accessibility compliance'
        ]
      },
      'pt-BR': {
        title: 'Sara - Bula Digital',
        shortDescription: 'Plataforma de bula digital acessível para o Grupo NC',
        fullDescription: 'Sara é uma plataforma de bula digital que oferece recursos acessíveis como tamanho de texto ajustável, zoom, versões em áudio e suporte a Libras. A plataforma é constantemente atualizada para garantir sustentabilidade e conformidade.',
        problem: 'Bulas tradicionais em papel são difíceis de ler, não são acessíveis para pessoas com deficiência e têm impacto ambiental significativo.',
        solution: 'Construímos uma plataforma digital abrangente com múltiplos recursos de acessibilidade, seguindo diretrizes WCAG, e integrada ao banco de dados de medicamentos da empresa para atualizações em tempo real.',
        features: [
          'Tamanho de texto ajustável e funcionalidade de zoom',
          'Versões em áudio das informações dos medicamentos',
          'Suporte a Libras',
          'Atualizações em tempo real do banco de dados',
          'Design responsivo para mobile',
          'Abordagem sustentável digital-first'
        ],
        results: [
          '95% de taxa de satisfação dos usuários',
          'Redução significativa de desperdício de papel',
          'Melhoria na conformidade de acessibilidade'
        ]
      }
    }
  },
  {
    id: '2',
    slug: 'bymen-ecommerce',
    category: 'retailEcommerce',
    image: '/images/projects/bymen.jpg',
    technologies: ['Shopify', 'Liquid', 'JavaScript', 'CSS3', 'Payment Integration'],
    liveUrl: 'https://bymen.com.br',
    featured: true,
    translations: {
      en: {
        title: 'ByMen E-commerce',
        shortDescription: 'Premium men\'s grooming shop built on Shopify',
        fullDescription: 'ByMen is a men\'s grooming e-commerce platform featuring beard care, hair products, kits and accessories. The store focuses on conversion optimization and exceptional user experience.',
        problem: 'The client needed a professional e-commerce presence that could compete with established grooming brands while maintaining a unique identity.',
        solution: 'Developed a custom Shopify theme with optimized checkout flow, product categorization, and conversion-focused design elements.',
        features: [
          'Custom Shopify theme development',
          'Optimized product categorization (beard, hair, kits)',
          'Streamlined checkout process',
          'Mobile-first responsive design',
          'Integrated payment gateways',
          'Product recommendations engine'
        ],
        results: [
          'Increased conversion rate by 35%',
          'Reduced cart abandonment',
          'Improved average order value'
        ]
      },
      'pt-BR': {
        title: 'ByMen E-commerce',
        shortDescription: 'Loja premium de produtos masculinos construída no Shopify',
        fullDescription: 'ByMen é uma plataforma de e-commerce de produtos masculinos com cuidados para barba, cabelo, kits e acessórios. A loja foca em otimização de conversão e experiência excepcional do usuário.',
        problem: 'O cliente precisava de uma presença profissional de e-commerce que pudesse competir com marcas estabelecidas mantendo uma identidade única.',
        solution: 'Desenvolvemos um tema Shopify customizado com fluxo de checkout otimizado, categorização de produtos e elementos de design focados em conversão.',
        features: [
          'Desenvolvimento de tema Shopify customizado',
          'Categorização otimizada de produtos (barba, cabelo, kits)',
          'Processo de checkout simplificado',
          'Design responsivo mobile-first',
          'Gateways de pagamento integrados',
          'Motor de recomendações de produtos'
        ],
        results: [
          'Aumento de 35% na taxa de conversão',
          'Redução do abandono de carrinho',
          'Melhoria no valor médio do pedido'
        ]
      }
    }
  },
  {
    id: '3',
    slug: 'x-fitness-shop',
    category: 'retailEcommerce',
    image: '/images/projects/xfitness.jpg',
    technologies: ['Shopify', 'Multi-language', 'JavaScript', 'Logistics Integration'],
    liveUrl: 'https://xfitness.ch',
    featured: true,
    translations: {
      en: {
        title: 'X Fitness Shop',
        shortDescription: 'Swiss e-commerce for supplements with multi-language support',
        fullDescription: 'X Fitness Shop is a Swiss e-commerce platform selling supplements including whey protein, amino acids and creatine. Features German language support and free shipping threshold.',
        problem: 'Swiss market requires multi-language support, specific payment methods, and local logistics integration.',
        solution: 'Built a localized Shopify store with German language support, Swiss payment methods, and optimized logistics for the Swiss market.',
        features: [
          'German language support',
          'Swiss payment method integration',
          'Free shipping threshold system',
          'Product filtering by category',
          'Subscription options for supplements',
          'Local logistics integration'
        ],
        results: [
          'Successful Swiss market entry',
          'High customer retention rate',
          'Efficient logistics operations'
        ]
      },
      'pt-BR': {
        title: 'X Fitness Shop',
        shortDescription: 'E-commerce suíço de suplementos com suporte multi-idioma',
        fullDescription: 'X Fitness Shop é uma plataforma de e-commerce suíça vendendo suplementos incluindo whey protein, aminoácidos e creatina. Possui suporte ao idioma alemão e limite de frete grátis.',
        problem: 'O mercado suíço requer suporte multi-idioma, métodos de pagamento específicos e integração logística local.',
        solution: 'Construímos uma loja Shopify localizada com suporte ao alemão, métodos de pagamento suíços e logística otimizada para o mercado suíço.',
        features: [
          'Suporte ao idioma alemão',
          'Integração de métodos de pagamento suíços',
          'Sistema de limite de frete grátis',
          'Filtro de produtos por categoria',
          'Opções de assinatura para suplementos',
          'Integração logística local'
        ],
        results: [
          'Entrada bem-sucedida no mercado suíço',
          'Alta taxa de retenção de clientes',
          'Operações logísticas eficientes'
        ]
      }
    }
  },
  {
    id: '4',
    slug: 'staydepot',
    category: 'aiData',
    image: '/images/projects/staydepot.jpg',
    technologies: ['Next.js', 'TypeScript', 'Python', 'AI/ML', 'Data Analytics', 'Supabase'],
    liveUrl: 'https://shortstaydepot.com',
    featured: true,
    translations: {
      en: {
        title: 'StayDepot',
        shortDescription: 'AI-powered short-stay listing performance analytics',
        fullDescription: 'StayDepot is an AI-powered platform that compares a host\'s short-stay listing performance with regional benchmarks and provides actionable recommendations to increase bookings, reviews and profits.',
        problem: 'Short-stay hosts struggle to optimize their listings without data-driven insights and regional benchmarking.',
        solution: 'Developed an AI analytics platform that processes listing data, compares against regional benchmarks, and generates personalized improvement recommendations.',
        features: [
          'AI-powered performance analysis',
          'Regional benchmark comparisons',
          'Actionable recommendations engine',
          'Booking optimization insights',
          'Review analysis and suggestions',
          'Profit maximization strategies'
        ],
        results: [
          '+20% average booking increase',
          'Improved host satisfaction',
          'Data-driven decision making'
        ]
      },
      'pt-BR': {
        title: 'StayDepot',
        shortDescription: 'Analytics de performance de hospedagens curtas com IA',
        fullDescription: 'StayDepot é uma plataforma com IA que compara a performance de anúncios de hospedagem curta com benchmarks regionais e fornece recomendações acionáveis para aumentar reservas, avaliações e lucros.',
        problem: 'Anfitriões de estadias curtas têm dificuldade em otimizar seus anúncios sem insights baseados em dados e benchmarking regional.',
        solution: 'Desenvolvemos uma plataforma de analytics com IA que processa dados de anúncios, compara com benchmarks regionais e gera recomendações personalizadas de melhoria.',
        features: [
          'Análise de performance com IA',
          'Comparações com benchmarks regionais',
          'Motor de recomendações acionáveis',
          'Insights de otimização de reservas',
          'Análise de avaliações e sugestões',
          'Estratégias de maximização de lucro'
        ],
        results: [
          '+20% de aumento médio em reservas',
          'Melhoria na satisfação dos anfitriões',
          'Tomada de decisão baseada em dados'
        ]
      }
    }
  },
  {
    id: '5',
    slug: 'aion-solution',
    category: 'aiData',
    image: '/images/projects/aion.jpg',
    technologies: ['React', 'Node.js', 'AI/LLM Integration', 'Marketing Automation', 'Analytics'],
    liveUrl: 'https://aionsolution.com.br',
    featured: true,
    translations: {
      en: {
        title: 'AION Solution',
        shortDescription: 'AI-driven sales and marketing tools for SMBs',
        fullDescription: 'AION Solution offers AI-driven sales and marketing tools for small and medium businesses. Their platform includes intelligent sales funnels, chatbots, marketing automation and business intelligence.',
        problem: 'Small and medium businesses lack access to enterprise-level AI-powered marketing and sales tools.',
        solution: 'Created an accessible platform with AI tools that automate marketing, optimize sales funnels, and provide actionable business intelligence.',
        features: [
          'Intelligent sales funnels',
          'AI-powered chatbots',
          'Marketing automation workflows',
          'Business intelligence dashboards',
          'Lead scoring and qualification',
          'Performance analytics'
        ],
        results: [
          '+15% profit improvement',
          '+30% revenue increase',
          'Automated lead qualification'
        ]
      },
      'pt-BR': {
        title: 'AION Solution',
        shortDescription: 'Ferramentas de vendas e marketing com IA para PMEs',
        fullDescription: 'AION Solution oferece ferramentas de vendas e marketing com IA para pequenas e médias empresas. A plataforma inclui funis de vendas inteligentes, chatbots, automação de marketing e business intelligence.',
        problem: 'Pequenas e médias empresas não têm acesso a ferramentas de marketing e vendas com IA de nível empresarial.',
        solution: 'Criamos uma plataforma acessível com ferramentas de IA que automatizam marketing, otimizam funis de vendas e fornecem business intelligence acionável.',
        features: [
          'Funis de vendas inteligentes',
          'Chatbots com IA',
          'Fluxos de automação de marketing',
          'Dashboards de business intelligence',
          'Pontuação e qualificação de leads',
          'Analytics de performance'
        ],
        results: [
          '+15% de melhoria no lucro',
          '+30% de aumento na receita',
          'Qualificação automatizada de leads'
        ]
      }
    }
  },
  {
    id: '6',
    slug: 'coquim',
    category: 'sustainability',
    image: '/images/projects/coquim.jpg',
    technologies: ['WordPress', 'WooCommerce', 'PHP', 'SEO Optimization'],
    liveUrl: 'https://coquim.com.br',
    featured: true,
    translations: {
      en: {
        title: 'Coquim - Organic & Sustainable',
        shortDescription: 'Pioneers in coconut fiber products for gardening',
        fullDescription: 'Coquim has been pioneering coconut fibre products for gardening since 1996. Their products are 100% natural, biodegradable and eco-friendly. The website highlights sustainability and innovation.',
        problem: 'Needed a modern digital presence that communicates their sustainability mission and makes products accessible to gardening enthusiasts.',
        solution: 'Built an e-commerce platform with strong emphasis on storytelling around sustainability, product education, and conversion optimization.',
        features: [
          'Sustainability-focused design',
          'Product education content',
          'E-commerce with WooCommerce',
          'Environmental impact storytelling',
          'SEO optimization for gardening keywords',
          'Mobile-responsive catalog'
        ],
        results: [
          '+45% online sales increase',
          'Improved brand awareness',
          'Strong organic search presence'
        ]
      },
      'pt-BR': {
        title: 'Coquim - Orgânico & Sustentável',
        shortDescription: 'Pioneiros em produtos de fibra de coco para jardinagem',
        fullDescription: 'Coquim é pioneira em produtos de fibra de coco para jardinagem desde 1996. Seus produtos são 100% naturais, biodegradáveis e ecológicos. O site destaca sustentabilidade e inovação.',
        problem: 'Precisavam de uma presença digital moderna que comunicasse sua missão de sustentabilidade e tornasse os produtos acessíveis para entusiastas de jardinagem.',
        solution: 'Construímos uma plataforma de e-commerce com forte ênfase em storytelling sobre sustentabilidade, educação sobre produtos e otimização de conversão.',
        features: [
          'Design focado em sustentabilidade',
          'Conteúdo educacional sobre produtos',
          'E-commerce com WooCommerce',
          'Storytelling de impacto ambiental',
          'Otimização SEO para palavras-chave de jardinagem',
          'Catálogo responsivo para mobile'
        ],
        results: [
          '+45% de aumento em vendas online',
          'Melhoria no reconhecimento da marca',
          'Forte presença em busca orgânica'
        ]
      }
    }
  },
  {
    id: '7',
    slug: 'smart-controller',
    category: 'corporate',
    image: '/images/projects/smartcontroller.jpg',
    technologies: ['React', 'Next.js', 'TypeScript', 'Contact Forms', 'SEO'],
    liveUrl: 'https://smartcontroller.com.br',
    featured: false,
    translations: {
      en: {
        title: 'Smart Controller',
        shortDescription: 'Humanized accounting consultancy website',
        fullDescription: 'Smart Controller is a humanized accounting consultancy serving Jacareí, São José dos Campos, Vale do Paraíba and all of Brazil. The website emphasizes personalized service and invites visitors to connect with experts.',
        problem: 'Accounting firms often appear impersonal. Smart Controller needed a digital presence that reflected their humanized approach.',
        solution: 'Designed a warm, approachable website that highlights their team, services, and commitment to personalized consulting while maintaining professionalism.',
        features: [
          'Humanized design approach',
          'Service showcase',
          'Team presentation',
          'Contact and scheduling system',
          'Regional SEO optimization',
          'Lead capture forms'
        ],
        results: [
          '+60% consultation bookings',
          'Improved local search visibility',
          'Higher client engagement'
        ]
      },
      'pt-BR': {
        title: 'Smart Controller',
        shortDescription: 'Site de consultoria contábil humanizada',
        fullDescription: 'Smart Controller é uma consultoria contábil humanizada atendendo Jacareí, São José dos Campos, Vale do Paraíba e todo o Brasil. O site enfatiza serviço personalizado e convida visitantes a conversar com especialistas.',
        problem: 'Escritórios de contabilidade frequentemente parecem impessoais. Smart Controller precisava de uma presença digital que refletisse sua abordagem humanizada.',
        solution: 'Projetamos um site caloroso e acessível que destaca sua equipe, serviços e compromisso com consultoria personalizada mantendo profissionalismo.',
        features: [
          'Abordagem de design humanizado',
          'Showcase de serviços',
          'Apresentação da equipe',
          'Sistema de contato e agendamento',
          'Otimização SEO regional',
          'Formulários de captura de leads'
        ],
        results: [
          '+60% de agendamentos de consultoria',
          'Melhoria na visibilidade de busca local',
          'Maior engajamento de clientes'
        ]
      }
    }
  },
  {
    id: '8',
    slug: 'saf-swiss-armsport',
    category: 'corporate',
    image: '/images/projects/saf.jpg',
    technologies: ['React', 'Next.js', 'Event Management', 'Countdown Timer'],
    featured: false,
    translations: {
      en: {
        title: 'Swiss Armsport Federation (SAF)',
        shortDescription: 'Federation website promoting arm wrestling in Switzerland',
        fullDescription: 'The Swiss Armsport Federation website features event countdowns and mission statements promoting fair play and growth of the arm wrestling sport in Switzerland.',
        problem: 'The federation needed a professional online presence to promote events, attract new members, and communicate their mission.',
        solution: 'Built a dynamic website with event management features, countdown timers for upcoming competitions, and content showcasing the sport\'s values.',
        features: [
          'Event countdown timers',
          'Mission and values showcase',
          'Event calendar and management',
          'Member information portal',
          'News and updates section',
          'Competition results display'
        ]
      },
      'pt-BR': {
        title: 'Federação Suíça de Armsport (SAF)',
        shortDescription: 'Site da federação promovendo luta de braço na Suíça',
        fullDescription: 'O site da Federação Suíça de Armsport apresenta contagens regressivas de eventos e declarações de missão promovendo fair play e crescimento do esporte de luta de braço na Suíça.',
        problem: 'A federação precisava de uma presença online profissional para promover eventos, atrair novos membros e comunicar sua missão.',
        solution: 'Construímos um site dinâmico com recursos de gestão de eventos, contagens regressivas para competições e conteúdo destacando os valores do esporte.',
        features: [
          'Contagens regressivas de eventos',
          'Showcase de missão e valores',
          'Calendário e gestão de eventos',
          'Portal de informações para membros',
          'Seção de notícias e atualizações',
          'Exibição de resultados de competições'
        ]
      }
    }
  },
  {
    id: '9',
    slug: 'vidget',
    category: 'retailEcommerce',
    image: '/images/projects/vidget.jpg',
    technologies: ['React', 'Video API', 'E-commerce Integration', 'Interactive UI'],
    featured: false,
    translations: {
      en: {
        title: 'Vidget',
        shortDescription: 'Instagram Stories/Reels experience for e-commerce',
        fullDescription: 'Vidget brings the Instagram Stories/Reels experience to e-commerce, turning videos into interactive shoppable content that engages customers and drives conversions.',
        problem: 'E-commerce sites struggle to engage users with static product images. Video content is underutilized in the shopping experience.',
        solution: 'Created an embeddable widget that transforms product videos into interactive, shoppable content similar to social media stories.',
        features: [
          'Stories/Reels style interface',
          'Shoppable video content',
          'Easy e-commerce integration',
          'Analytics and engagement tracking',
          'Mobile-optimized experience',
          'Customizable design'
        ]
      },
      'pt-BR': {
        title: 'Vidget',
        shortDescription: 'Experiência Instagram Stories/Reels para e-commerce',
        fullDescription: 'Vidget traz a experiência do Instagram Stories/Reels para e-commerce, transformando vídeos em conteúdo interativo de compras que engaja clientes e impulsiona conversões.',
        problem: 'Sites de e-commerce têm dificuldade em engajar usuários com imagens estáticas de produtos. Conteúdo de vídeo é subutilizado na experiência de compra.',
        solution: 'Criamos um widget embarcável que transforma vídeos de produtos em conteúdo interativo de compras similar aos stories de redes sociais.',
        features: [
          'Interface estilo Stories/Reels',
          'Conteúdo de vídeo comprável',
          'Fácil integração com e-commerce',
          'Analytics e rastreamento de engajamento',
          'Experiência otimizada para mobile',
          'Design personalizável'
        ]
      }
    }
  },
  {
    id: '10',
    slug: 'mydose-app',
    category: 'healthPharma',
    image: '/images/projects/mydose.jpg',
    technologies: ['React Native', 'Gamification', 'Health APIs', 'Social Features'],
    featured: false,
    translations: {
      en: {
        title: 'Mydose App',
        shortDescription: 'Gamified wellness ecosystem for healthy habits',
        fullDescription: 'Mydose is a gamified wellness ecosystem that helps users build healthy habits collaboratively. Described as a "collective wellness ecosystem" encouraging personal growth.',
        problem: 'People struggle to maintain healthy habits without motivation and accountability. Traditional health apps lack engagement.',
        solution: 'Built a gamified platform that makes building healthy habits fun and social, with collaborative challenges and personal growth tracking.',
        features: [
          'Gamified habit tracking',
          'Collaborative challenges',
          'Personal growth metrics',
          'Social accountability features',
          'Wellness content library',
          'Progress visualization'
        ]
      },
      'pt-BR': {
        title: 'Mydose App',
        shortDescription: 'Ecossistema de bem-estar gamificado para hábitos saudáveis',
        fullDescription: 'Mydose é um ecossistema de bem-estar gamificado que ajuda usuários a construir hábitos saudáveis colaborativamente. Descrito como um "ecossistema de bem-estar coletivo" incentivando crescimento pessoal.',
        problem: 'Pessoas têm dificuldade em manter hábitos saudáveis sem motivação e responsabilização. Apps de saúde tradicionais carecem de engajamento.',
        solution: 'Construímos uma plataforma gamificada que torna a construção de hábitos saudáveis divertida e social, com desafios colaborativos e rastreamento de crescimento pessoal.',
        features: [
          'Rastreamento de hábitos gamificado',
          'Desafios colaborativos',
          'Métricas de crescimento pessoal',
          'Recursos de responsabilização social',
          'Biblioteca de conteúdo de bem-estar',
          'Visualização de progresso'
        ]
      }
    }
  }
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(p => p.slug === slug);
};

export const getFeaturedProjects = (): Project[] => {
  return projects.filter(p => p.featured);
};

export const getProjectsByCategory = (category: Project['category']): Project[] => {
  return projects.filter(p => p.category === category);
};
