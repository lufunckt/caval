import React, { useState } from "react";
import { BookOpen, Calendar, ArrowRight, X } from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  content: string[]; // Divided by paragraphs
}

const ARTICLES: Article[] = [
  {
    id: "art1",
    title: "O Silêncio do Cão Nem Sempre é Calma: Identificando o 'Shutdown'",
    category: "Psicologia Canina",
    date: "14 Mai, 2026",
    readTime: "5 min de leitura",
    excerpt: "Muitos tutores comemoram quando um cão agitado de repente se cala e aceita submissivamente cenários aterrorizantes. Entenda o fenômeno psicológico do desamparo aprendido.",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format,compress&fm=webp&fit=crop&q=70&w=600",
    author: "Érico Cavalheiro",
    content: [
      "No universo do adestramento tradicional canino, existe um equívoco perigoso e persistente: medir a eficácia de um treinamento unicamente pelo silêncio ou passividade do animal. Quando o cão subitamente cessa seus latidos ou desiste de resistir em uma situação de estresse extremo, é frequente que o tutor interprete isso como 'comportamento resolvido'. No entanto, sob uma leitura psicológica profunda, o que estamos observando é muitas vezes o estado de 'shutdown' emocional.",
      "O shutdown é a manifestação física do desamparo aprendido (learned helplessness) ou do congelamento como resposta de sobrevivência. Diante de punições repetitivas ou de uma saturação sensorial intolerável da qual não se pode escapar, a mente do cão ativa um mecanismo de autopreservação extrema. O cão desiste de tentar porque concluiu que sua conduta não possui eficácia sobre o que lhe acontece.",
      "Diferenciar a verdadeira calma cognitiva (em que os batimentos associados ao sistema parassimpático estão equilibrados e o cão demonstra relaxamento corporal real, olhos suaves e respiração profunda) de um estado de shutdown é o primeiro passo para uma convivência relacional saudável. Cães no estado de shutdown acumulam o estresse em silêncio. Esse acúmulo de ansiedade crônica frequentemente explode mais tarde em comportamentos graves de agressividade reativa redirecionada ou em enfermidades psicossomáticas graves.",
      "Para tratar esse quadro, o profissional de Educação Relacional deve desconstruir protocolos militarizados de submissão. Devemos devolver ao cão a sensação de agência e controle sobre seu ambiente imediato através de escolhas simples e previsibilidade rígida. A verdadeira obediência não reside no silêncio forçado pelo medo, mas sim na cooperação voluntária motivada pelo respeito mútuo."
    ]
  },
  {
    id: "art2",
    title: "Reatividade Canina no Passeio: O Guia Definitivo do Vínculo",
    category: "Reabilitação Emocional",
    date: "03 Mai, 2026",
    readTime: "7 min de leitura",
    excerpt: "Seu cão avança em outros cães ou pessoas na rua? Descubra por que trancos na guia pioram o quadro de agressividade reativa e como mudar o foco de atenção de maneira natural.",
    imageUrl: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?auto=format,compress&fm=webp&fit=crop&q=70&w=600",
    author: "Érico Cavalheiro",
    content: [
      "A reatividade urbana — manifestada através de latidos estridentes, rosnados, pulos e cães que praticamente enforcam a si mesmos na guia ao avistar outro animal ou transeunte — é um dos motivos mais recorrentes de frustração nas residências. A reação instintiva da grande maioria dos tutores é dar um tranco físico agressivo na focinheira ou coleira, acompanhado de um grito ríspido: 'NÃO!'",
      "Contudo, analisemos a associação mental feita pelo cão nesse exato milésimo de segundo. O cão avista um estímulo que lhe gera incerteza ou medo (outro cão). No mesmo instante em que seus olhos focam nesse estímulo, ele recebe uma dor física ou um susto do tutor vindo da guia. A mente canina conclui de forma lógica e primitiva: 'A presença daquele cão estranho me causa dor na garganta. Portanto, eu estava certo ao odiá-lo e querer mantê-lo longe.'",
      "Ao tentar suprimir o latido com dor, o tutor acaba retroalimentando e validando o perigo percebido pelo cão, tornando o animal progressivamente mais hostil a cada passeio. Para romper esse ciclo destrutivo, precisamos focar na reabilitação do vínculo antes de exigir obediência.",
      "O protocolo de Reabilitação da Educação Relacional atua na dessensibilização sistemática. Nós identificamos o limiar de gatilho do cão (a distância exata em que ele percebe o outro animal mas ainda é capaz de ouvir). Dentro dessa zona de segurança emocional, recompensamos estados espontâneos de calma e redirecionamos o foco de atenção para o tutor sem punição física. O cão aprende que o tutor é um escudo seguro e previsível para o qual ele pode olhar para buscar referencial protetivo."
    ]
  },
  {
    id: "art3",
    title: "Como Educar um Cão Filhote Sem Punir: Roteiro Prático Relacional",
    category: "Educação Preventiva",
    date: "19 Abr, 2026",
    readTime: "6 min de leitura",
    excerpt: "Preparar a chegada do bebê cão de forma científica. Esqueça táticas obsoletas como esfregar o nariz no xixi ou isolamento em cômodos escuros para educar.",
    imageUrl: "https://images.unsplash.com/photo-1591561954555-607968c989ab?auto=format,compress&fm=webp&fit=crop&q=70&w=600",
    author: "Érico Cavalheiro",
    content: [
      "A chegada de um filhote é cercada de grandes expectativas e, invariavelmente, de noites mal dormidas e frustrações com cães mordiscando móveis e urinando nos locais errados. Nesse momento de vulnerabilidade, muitos tutores recorrem a velhos conselhos de avós e táticas agressivas de isolamento que geram sérios traumas comportamentais no filhote.",
      "O confinamento prolongado de um filhote que recém saiu do convívio com a mãe gera crises de ansiedade de separação severas. Esfregar o nariz do filhote no xixi que ele fez na sala apenas o ensina que o tutor é um indivíduo instável e violento do qual ele deve ocultar suas necessidades físicas, urinando atrás das cortinas ou em cantos escuros.",
      "A pedagogia filhote inteligente repousa sobre a previsibilidade temporal e o manejo proativo e gentil da rotina. Filhotes possuem uma biologia exata: eles urinam e defecam quase imediatamente após acordar, brincar ou comer. Sabendo disso, o tutor relacional facilita o acerto ao guiar o animal gentilmente ao local correto nos momentos cruciais.",
      "Para resolver as mordidas de dente de agulha em calcanhares e calças, compreenda que o filhote morde porque está em fase exploratória e de coceira dentária. Interromper o convívio subitamente de maneira neutra ou redirecionar a mordida para mordedores de borracha texturizada recheada de patê são respostas que preservam o vínculo e ensinam as regras sociais da casa de modo lúdico e eficiente."
    ]
  }
];

export const Blog: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <section className="py-24 bg-[#1A1A1A] relative border-t border-white/5" id="blog-section">
      <div className="absolute top-1/2 left-0 w-80 h-80 border border-forest/5 rounded-full blur-3xl bg-forest/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10" id="blog-container">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16 text-center reveal" id="blog-header-block">
          <span className="font-sans text-xs uppercase tracking-widest font-bold text-forest mb-3 inline-block">
            MUITO ALÉM DE REQUISITOS TÉCNICOS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] text-ivory font-bold leading-tight mb-4" id="blog-title">
            Artigos & Leituras Recomendadas
          </h2>
          <p className="font-sans text-base text-sand/80 max-w-xl mx-auto" id="blog-subtitle">
            Compreenda a ciência do comportamento dos cães sob a perspectiva de quem estuda a mente animal. Leia os editoriais explicativos produzidos exclusivamente por Érico.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="blog-articles-grid">
          {ARTICLES.map((art, idx) => {
            const delayClass = idx === 0 ? "" : idx === 1 ? "delay-100" : "delay-200";
            return (
              <article 
                key={art.id}
                className={`flex flex-col bg-[#141414] border border-white/5 hover:border-forest/20 rounded-xl overflow-hidden shadow-soft hover:shadow-warm transition-all duration-300 group cursor-pointer reveal ${delayClass}`}
                onClick={() => setSelectedArticle(art)}
                id={`blog-article-card-${art.id}`}
              >
                {/* Thumbnail image with subtle zoom transition */}
                <div className="relative h-48 overflow-hidden bg-black/30 shrink-0" id={`blog-card-media-${art.id}`}>
                  <img 
                    src={art.imageUrl} 
                    alt={art.title} 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-forest text-[#160E1A] px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded">
                    {art.category}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between text-left" id={`blog-card-body-${art.id}`}>
                  <div>
                    {/* Metadata line */}
                    <div className="flex items-center gap-3 text-sand-deep text-[11px] mb-3">
                      <span className="flex items-center gap-1"><Calendar size={12} className="text-forest" /> {art.date}</span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl text-ivory font-bold leading-snug mb-3 group-hover:text-forest transition-colors duration-300">
                      {art.title}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-sand/70 leading-relaxed font-light mb-6">
                      {art.excerpt}
                    </p>
                  </div>

                  {/* Elegant bottom button link layout */}
                  <div className="flex items-center gap-1.5 text-forest font-sans text-xs font-bold uppercase tracking-widest pt-4 border-t border-white/5">
                    <span>Ler Artigo Completo</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Interactive Article Reading Overlay Modal */}
        {selectedArticle && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md transition-opacity duration-300 overflow-y-auto"
            onClick={() => setSelectedArticle(null)}
            id="blog-modal-overlay"
          >
            <div 
              className="relative w-full max-w-3xl bg-charcoal border border-white/10 rounded-2xl shadow-lift overflow-hidden text-left my-8"
              onClick={(e) => e.stopPropagation()}
              id="blog-modal-content-container"
            >
              {/* Close Button top floating */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-35 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-ivory hover:text-rose-brand hover:border-rose-brand/35 transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
                aria-label="Fechar Modal"
                id="blog-modal-close-btn"
              >
                <X size={20} />
              </button>

              {/* Banner visual header */}
              <div className="relative h-60 sm:h-72 w-full bg-black/40">
                <img 
                  src={selectedArticle.imageUrl} 
                  alt={selectedArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-black/35" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-forest text-[#160E1A] px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded mb-3 inline-block">
                    {selectedArticle.category}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-ivory font-bold leading-tight drop-shadow-md text-balance">
                    {selectedArticle.title}
                  </h2>
                </div>
              </div>

              {/* Editorial Article Body scroll room */}
              <div className="p-6 sm:p-10 max-h-[calc(100vh-280px)] overflow-y-auto" id="blog-modal-scroller">
                {/* Authoring & Reading metrics info */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-sand-deep border-b border-white/5 pb-5 mb-6">
                  <span className="flex items-center gap-1.5">
                    <div className="w-5 h-5 bg-gradient-clay rounded-full flex items-center justify-center text-[8px] font-bold text-[#160E1A]">EC</div>
                    <span className="font-medium text-ivory">Por {selectedArticle.author}</span>
                  </span>
                  <span>•</span>
                  <span>Publicado em {selectedArticle.date}</span>
                  <span>•</span>
                  <span className="text-forest font-mono">{selectedArticle.readTime}</span>
                </div>

                {/* Actual article text blocks structured layout */}
                <div className="space-y-6 font-sans text-sm sm:text-base text-sand/90 leading-relaxed font-light" id="blog-article-paragraphs">
                  {selectedArticle.content.map((p, idx) => (
                    <p key={idx} className="indent-4" id={`p-${idx}`}>
                      {p}
                    </p>
                  ))}
                </div>

                {/* Footnote citation styled with bronze copper color */}
                <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-[11px] text-[#B87333] uppercase font-sans tracking-widest font-semibold">
                    EDUCAÇÃO RELACIONAL CANINA • Érico Cavalheiro
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="text-xs uppercase font-bold text-ivory hover:text-forest tracking-wider font-sans transition-colors cursor-pointer"
                  >
                    Voltar para o site
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
