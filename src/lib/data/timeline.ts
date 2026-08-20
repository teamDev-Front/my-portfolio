export interface TimelineItem {
  year: string;
  isCurrent?: boolean;
  translations: {
    en: {
      title: string;
      company: string;
      description: string;
    };
    'pt-BR': {
      title: string;
      company: string;
      description: string;
    };
  };
}

export const timeline: TimelineItem[] = [
  {
    year: '2026',
    isCurrent: true,
    translations: {
      en: {
        title: 'Senior SAP BTP & Fiori Analyst',
        company: 'SAUTER',
        description:
          'Support and evolution of SAP BTP applications for the HR area of a large Brazilian retailer with over 40,000 employees. CAP (Node.js) on Cloud Foundry integrated end to end with SAP SuccessFactors via OData, plus HANA HDI, XSUAA, Event Mesh and DocuSign e-signature. Root-cause incident investigation, production fixes with mapped rollback, and new business rules — expanding into SAP Integration Suite (CPI, CLD900 certified course).'
      },
      'pt-BR': {
        title: 'Analista Sênior SAP BTP & Fiori',
        company: 'SAUTER',
        description:
          'Sustentação e evolução de aplicações SAP BTP para a área de RH de um grande varejista brasileiro com mais de 40.000 funcionários. CAP (Node.js) em Cloud Foundry integrado de ponta a ponta ao SAP SuccessFactors via OData, com HANA HDI, XSUAA, Event Mesh e assinatura eletrônica DocuSign. Investigação de incidentes até a causa raiz, correções em produção com rollback mapeado e novas regras de negócio — expandindo para SAP Integration Suite (CPI, curso oficial CLD900).'
      }
    }
  },
  {
    year: '2024',
    isCurrent: true,
    translations: {
      en: {
        title: 'Front-end Developer',
        company: 'Quantflow (Switzerland)',
        description:
          'Leading front-end development of high-performance web applications with Next.js, React and TypeScript, integrated with Django back-ends via Azure DevOps workflows. Design and implementation of LLM integrations — including orchestration with platforms such as Ollama — for AI-driven product features.'
      },
      'pt-BR': {
        title: 'Desenvolvedor Front-end',
        company: 'Quantflow (Suíça)',
        description:
          'Liderança do desenvolvimento front-end de aplicações web de alta performance com Next.js, React e TypeScript, integradas a back-ends Django com fluxos no Azure DevOps. Projeto e implementação de integrações com LLMs — incluindo orquestração com plataformas como Ollama — para funcionalidades de produto com IA.'
      }
    }
  },
  {
    year: '2024',
    translations: {
      en: {
        title: 'Head of Development',
        company: 'Deploy Experience',
        description:
          'Led development teams and delivery of digital products (2024–2025), after serving as Frontend Manager from 2022 to 2024 — nearly three years shaping front-end architecture, code standards and delivery workflows.'
      },
      'pt-BR': {
        title: 'Head de Desenvolvimento',
        company: 'Deploy Experience',
        description:
          'Liderança de times de desenvolvimento e entrega de produtos digitais (2024–2025), depois de atuar como Frontend Manager de 2022 a 2024 — quase três anos definindo arquitetura front-end, padrões de código e fluxos de entrega.'
      }
    }
  },
  {
    year: '2022',
    translations: {
      en: {
        title: 'Founder & Full Stack Developer',
        company: 'HABAEB Creative Solutions',
        description:
          'Founded the studio behind most of the work in this portfolio: landing pages, websites, e-commerce, SaaS platforms and AI-powered systems for clients in Brazil and Europe (2022–2025, and ongoing as HCS).'
      },
      'pt-BR': {
        title: 'Fundador & Desenvolvedor Full Stack',
        company: 'HABAEB Creative Solutions',
        description:
          'Fundou o estúdio por trás da maior parte dos trabalhos deste portfólio: landing pages, sites, e-commerce, plataformas SaaS e sistemas com IA para clientes no Brasil e na Europa (2022–2025, e em atividade como HCS).'
      }
    }
  },
  {
    year: '2022',
    translations: {
      en: {
        title: '.NET Developer (Internship)',
        company: 'Ericsson',
        description:
          'Software development internship at Ericsson São José dos Campos (2022–2023), working with .NET, Node.js and web development in a global telecom engineering environment.'
      },
      'pt-BR': {
        title: 'Desenvolvedor .NET (Estágio)',
        company: 'Ericsson',
        description:
          'Estágio em desenvolvimento de software na Ericsson São José dos Campos (2022–2023), trabalhando com .NET, Node.js e desenvolvimento web em um ambiente global de engenharia de telecom.'
      }
    }
  },
  {
    year: '2021',
    translations: {
      en: {
        title: 'Technical Support (Internship)',
        company: 'CS DEVICES',
        description:
          'Field equipment support and analysis, equipment documentation, testing and systems/test automation support for a hardware company in São José dos Campos.'
      },
      'pt-BR': {
        title: 'Suporte Técnico (Estágio)',
        company: 'CS DEVICES',
        description:
          'Suporte e análise de equipamentos em campo, documentação de equipamentos, testes e apoio à automatização de sistemas e testes em uma empresa de hardware de São José dos Campos.'
      }
    }
  },
  {
    year: '2018',
    translations: {
      en: {
        title: 'Hospital Administration',
        company: 'Healthcare Sector (ISG / INCS)',
        description:
          'Emergency-room reception and hospital administration at Hospital Regional de São José dos Campos and UPA Campo dos Alemães (2018–2021): patient admission, medical records, hospitalization protocols via CROSS and the SOUL MV hospital system — where the discipline for handling critical data was built.'
      },
      'pt-BR': {
        title: 'Administração Hospitalar',
        company: 'Setor de Saúde (ISG / INCS)',
        description:
          'Recepção de emergência e administração hospitalar no Hospital Regional de São José dos Campos e na UPA Campo dos Alemães (2018–2021): admissão de pacientes, prontuários, protocolos de internação via CROSS e sistema SOUL MV — onde nasceu a disciplina para lidar com dados críticos.'
      }
    }
  },
  {
    year: '2013',
    translations: {
      en: {
        title: 'Electronics Technician',
        company: 'WLLCTEL Professional Services',
        description:
          'Software patch updates (SUM) on Ericsson AXE/CPP sites, radio transmitters and MiniLinks for the carrier TIM across Brazil (2013–2015), with preventive maintenance, backup tests and integrity checks via WinFiol and MiniLink CRAFT.'
      },
      'pt-BR': {
        title: 'Técnico em Eletrônica',
        company: 'WLLCTEL Professional Services',
        description:
          'Atualizações de pacotes de software (SUM) em sites Ericsson AXE/CPP, rádios transmissores e MiniLinks da operadora TIM em todo o Brasil (2013–2015), com manutenção preventiva, testes de backup e verificação de integridade via WinFiol e MiniLink CRAFT.'
      }
    }
  }
];

export const skills = {
  frontend: ['React', 'Next.js', 'Angular', 'TypeScript', 'JavaScript', 'SAPUI5 / Fiori', 'HTML5', 'CSS3', 'Tailwind CSS', 'GSAP'],
  backend: ['Node.js', 'SAP CAP', 'Python', 'Django', 'NestJS', 'Express', 'REST APIs', 'OData'],
  databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Supabase', 'SAP HANA', 'Oracle', 'Redis'],
  tools: ['SAP BTP', 'SuccessFactors', 'SAP CPI', 'Git', 'Docker', 'Figma', 'Framer', 'Vercel', 'AWS', 'Azure DevOps'],
  soft: ['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Adaptability', 'Continuous Learning']
};
