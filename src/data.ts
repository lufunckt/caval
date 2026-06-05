import { Testimonial, MethodPillar, ServiceItem, StatItem } from "./types";
import beatrizAvatar from "./assets/images/beatriz_avatar_1780691088843.png";
import coupleAvatar from "./assets/images/couple_avatar_1780691103706.png";
import camilaAvatar from "./assets/images/camila_avatar_1780691116670.png";

export const STATS: StatItem[] = [
  { value: "5+", label: "Anos de imersão e prática" },
  { value: "800+", label: "Cães e famílias educados" },
  { value: "98%", label: "De tutores com vínculo reconectado" },
  { value: "100%", label: "Método humanizado, livre de punição" }
];

export const METHOD_PILLARS: MethodPillar[] = [
  {
    number: "01",
    title: "Observação Silenciosa",
    subtitle: "Antes da reação, existem sinais",
    description: "Cães comunicam intenções, medos e desconfortos o tempo todo através de micro expressão corporal. Ensinamos você a ler a linguagem silenciosa do seu cão para prever e evitar conflitos antes que eles se iniciem.",
    colorClass: "text-forest",
    bgHex: "#254E41",
    textHex: "#6CBAA4"
  },
  {
    number: "02",
    title: "Arquitetura Ambiental",
    subtitle: "O ambiente molda o comportamento",
    description: "A casa e a rotina diária são a base do equilíbrio. Ajustamos a dinâmica do lar, enriquecimento ambiental e momentos de repouso para diminuir a ansiedade e criar um refúgio seguro de tranquilidade para o cão.",
    colorClass: "text-peach",
    bgHex: "#63526E",
    textHex: "#F2AD5E"
  },
  {
    number: "03",
    title: "Educação Relacional",
    subtitle: "Antes do comando, existe relação",
    description: "Desmistificamos o conceito de dominância. A verdadeira liderança vem através de clareza, limites saudáveis, previsibilidade e afeto guiado. Seu cão aprende a cooperar com você porque se sente seguro ao seu lado.",
    colorClass: "text-rose-brand",
    bgHex: "#3E4C5E",
    textHex: "#ED4C87"
  },
  {
    number: "04",
    title: "Convivência & Emoção",
    subtitle: "Humanizar não é compreender",
    description: "Respeitamos as necessidades biológicas e emocionais da espécie. O cão necessita farejar, explorar e expressar comportamentos naturais. Oferecemos o equilíbrio entre bem-estar animal e harmonia na vida social urbana.",
    colorClass: "text-terracotta",
    bgHex: "#2F1E38",
    textHex: "#D35A42"
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: "consultoria-individual",
    badge: "Mais Procurado",
    title: "Consultoria Premium Presencial (Porto Alegre e Região)",
    tagline: "Acompanhamento cirúrgico residencial na Grande Porto Alegre",
    description: "Direcionado para tutores em Porto Alegre e região metropolitana que buscam reestruturação completa da convivência, resolvendo conflitos comportamentais na raiz diretamente no ambiente familiar.",
    features: [
      "Diagnóstico comportamental aprofundado",
      "Ajustes mecânicos de rotina e ambiente",
      "Sessões práticas individuais na sua residência",
      "Plano terapêutico personalizado digital",
      "Suporte prioritário via WhatsApp direto com Érico"
    ],
    ctaText: "Reconstruir minha relação",
    price: "A partir de R$ 380 / sessão"
  },
  {
    id: "reabilitacao-emocional",
    badge: "Alta Complexidade",
    title: "Reabilitação de Reatividade e Medo",
    tagline: "Especialista em fobias e descontrole em passeios urbanos",
    description: "Protocolos seguros baseados na neurobiologia canina para cães com reatividade a outros cães/pessoas, agressividade por medo ou insegurança e ansiedade extrema na rua.",
    features: [
      "Dessensibilização sistemática controlada",
      "Treino focado em autorregulação emocional",
      "Aulas em cenários urbanos sob medida em Porto Alegre",
      "Suporte preventivo e leitura de gatilhos",
      "Acompanhamento emocional para o tutor"
    ],
    ctaText: "Agendar Reabilitação",
    price: "Sob Avaliação Inicial"
  },
  {
    id: "mentoria-online",
    badge: "100% Flexível",
    title: "Mentoria Estratégica Online",
    tagline: "Para tutores de todo o Brasil e do mundo",
    description: "Sessões estratégicas focadas no direcionamento comportamental e preventivo guiados via chamada de vídeo. Perfeito para preparação de chegada de filhote, ajustes de rotina ou consultoria pré-adoção.",
    features: [
      "Análise minuciosa de vídeos enviados",
      "Videoconferência ao vivo de 1h30m",
      "Desenho de plano estratégico passo-a-passo",
      "Material explicativo exclusivo em PDF",
      "WhatsApp de acompanhamento por 15 dias"
    ],
    ctaText: "Fazer Sessão Online",
    price: "R$ 290 / sessão"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Beatriz M.",
    role: "Tutora reconciliada",
    dogName: "Zeus",
    dogBreed: "Pastor Alemão (2 anos)",
    avatarUrl: beatrizAvatar,
    text: "O Zeus puxava tanto a guia nos passeios que eu já tinha machucado o ombro. Passamos por três adestradores que usavam puxões. O Érico em duas sessões nos mostrou que ele não precisava de correção física, mas de previsibilidade e regulação de estímulos. Hoje o Zeus passeia com a guia solta. É mágico e respeitoso.",
    stars: 5
  },
  {
    id: "t2",
    name: "Guilherme & Mariana",
    role: "Pais da Amora",
    dogName: "Amora",
    dogBreed: "Golden Retriever (1 ano)",
    avatarUrl: coupleAvatar,
    text: "Amora destruía as portas quando ficava sozinha. Estávamos desesperados. O Érico analisou nossa rotina e propôs a 'reestruturação ambiental' e brinquedos de enriquecimento cognitivo, além de mudar a forma como nos despedíamos dela. Ela aprendeu a relaxar. Érico mudou nossa vida familiar e nos ensinou a amar a espécie dela por completo.",
    stars: 5
  },
  {
    id: "t3",
    name: "Camila Rocha",
    role: "Tutora de cão adotado",
    dogName: "Bento",
    dogBreed: "Vira-lata reativo (3 anos)",
    avatarUrl: camilaAvatar,
    text: "O Bento avançava em qualquer pessoa na rua. Eu tinha vergonha de sair de casa. O método relacional do Érico devolveu a ele a segurança e a mim, a capacidade de entendê-lo. Focamos no vínculo antes da obediência. Hoje o Bento consegue ignorar estímulos e focar em mim. Recomendo de olhos fechados!",
    stars: 5
  }
];

export const MARQUEE_WORDS = [
  "OBSERVAR",
  "ESCUTAR",
  "PREVER",
  "EDUCAR",
  "CONECTAR",
  "VÍNCULO",
  "RESPEITAR",
  "COMPREENDER",
  "CLAREZA",
  "EQUILÍBRIO",
  "PREVISIBILIDADE",
  "AFETO",
  "CONVIVÊNCIA"
];
