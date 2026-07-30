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
    key: 'revenue' | 'bookings' | 'sales' | 'consultations' | 'satisfaction';
    value: string;
  };
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'AION Solution',
    role: 'AI & Marketing',
    company: 'AION',
    translations: {
      en: {
        quote: 'The platform developed by Luiz helped us achieve measurable results for our clients. The AI integration was seamless and the results speak for themselves.'
      },
      'pt-BR': {
        quote: 'A plataforma desenvolvida por Luiz nos ajudou a alcançar resultados mensuráveis para nossos clientes. A integração de IA foi perfeita e os resultados falam por si.'
      }
    },
    metrics: {
      key: 'revenue',
      value: '+30%'
    }
  },
  {
    id: '2',
    name: 'StayDepot',
    role: 'AI Analytics',
    company: 'StayDepot',
    translations: {
      en: {
        quote: 'StayDepot\'s AI-powered analytics have transformed how our hosts optimize their listings. The actionable insights have led to significant booking improvements.'
      },
      'pt-BR': {
        quote: 'As análises com IA da StayDepot transformaram como nossos anfitriões otimizam seus anúncios. Os insights acionáveis levaram a melhorias significativas nas reservas.'
      }
    },
    metrics: {
      key: 'bookings',
      value: '+20%'
    }
  },
  {
    id: '3',
    name: 'Coquim',
    role: 'Sustainability',
    company: 'Coquim',
    translations: {
      en: {
        quote: 'The new e-commerce platform beautifully represents our commitment to sustainability while making it easier for customers to shop our eco-friendly products.'
      },
      'pt-BR': {
        quote: 'A nova plataforma de e-commerce representa lindamente nosso compromisso com sustentabilidade enquanto facilita para os clientes comprarem nossos produtos ecológicos.'
      }
    },
    metrics: {
      key: 'sales',
      value: '+45%'
    }
  },
  {
    id: '4',
    name: 'Smart Controller',
    role: 'Consulting',
    company: 'Smart Controller',
    translations: {
      en: {
        quote: 'Our new website perfectly captures our humanized approach to accounting. We\'ve seen a significant increase in consultation bookings since launch.'
      },
      'pt-BR': {
        quote: 'Nosso novo site captura perfeitamente nossa abordagem humanizada de contabilidade. Vimos um aumento significativo em agendamentos de consultoria desde o lançamento.'
      }
    },
    metrics: {
      key: 'consultations',
      value: '+60%'
    }
  },
  {
    id: '5',
    name: 'Grupo NC',
    role: 'Pharma',
    company: 'Sara Digital',
    translations: {
      en: {
        quote: 'Sara has revolutionized how patients access medication information. The accessibility features have received excellent feedback from users with disabilities.'
      },
      'pt-BR': {
        quote: 'Sara revolucionou como pacientes acessam informações sobre medicamentos. Os recursos de acessibilidade receberam feedback excelente de usuários com deficiência.'
      }
    },
    metrics: {
      key: 'satisfaction',
      value: '95%'
    }
  }
];
