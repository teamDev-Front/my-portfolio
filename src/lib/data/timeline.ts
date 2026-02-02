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
    year: '2024',
    isCurrent: true,
    translations: {
      en: {
        title: 'Front-End Developer',
        company: 'Quantflow',
        description: 'Remote front-end development working with modern technologies and AI integration.'
      },
      'pt-BR': {
        title: 'Desenvolvedor Front-End',
        company: 'Quantflow',
        description: 'Desenvolvimento front-end remoto trabalhando com tecnologias modernas e integração de IA.'
      }
    }
  },
  {
    year: '2023',
    translations: {
      en: {
        title: 'Founder & Developer',
        company: 'Habaeb Creative Solutions',
        description: 'Founded freelance studio focused on landing pages, websites, custom systems and SaaS solutions.'
      },
      'pt-BR': {
        title: 'Fundador & Desenvolvedor',
        company: 'Habaeb Creative Solutions',
        description: 'Fundou estúdio freelance focado em landing pages, sites, sistemas customizados e soluções SaaS.'
      }
    }
  },
  {
    year: '2022',
    translations: {
      en: {
        title: 'Head of Development',
        company: 'Deploy Experience',
        description: 'Led development teams and delivered digital products focused on user experience.'
      },
      'pt-BR': {
        title: 'Head de Desenvolvimento',
        company: 'Deploy Experience',
        description: 'Liderou times de desenvolvimento e entregou produtos digitais focados em experiência do usuário.'
      }
    }
  },
  {
    year: '2020',
    translations: {
      en: {
        title: 'Product Owner',
        company: 'Ericsson',
        description: 'Managed product roadmap and coordinated cross-functional teams for telecom solutions.'
      },
      'pt-BR': {
        title: 'Product Owner',
        company: 'Ericsson',
        description: 'Gerenciou roadmap de produtos e coordenou times multifuncionais para soluções de telecom.'
      }
    }
  },
  {
    year: '2018',
    translations: {
      en: {
        title: 'Front-End Developer',
        company: 'Various Companies',
        description: 'Developed web applications using React, Angular and modern front-end technologies.'
      },
      'pt-BR': {
        title: 'Desenvolvedor Front-End',
        company: 'Diversas Empresas',
        description: 'Desenvolveu aplicações web usando React, Angular e tecnologias front-end modernas.'
      }
    }
  },
  {
    year: '2015',
    translations: {
      en: {
        title: 'Technical Support & Administration',
        company: 'Healthcare Sector',
        description: 'Started career in technical support and hospital administration, building foundation in problem-solving.'
      },
      'pt-BR': {
        title: 'Suporte Técnico & Administração',
        company: 'Setor de Saúde',
        description: 'Iniciou carreira em suporte técnico e administração hospitalar, construindo base em resolução de problemas.'
      }
    }
  }
];

export const skills = {
  frontend: ['React', 'Next.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'GSAP'],
  backend: ['Node.js', 'Python', 'Django', 'Express', 'REST APIs', 'GraphQL'],
  databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Supabase', 'Oracle', 'Redis'],
  tools: ['Git', 'Docker', 'Figma', 'Framer', 'VS Code', 'Vercel', 'AWS'],
  soft: ['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Adaptability', 'Continuous Learning']
};
