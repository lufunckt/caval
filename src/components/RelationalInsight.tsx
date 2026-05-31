import React from "react";
import { CONFIG } from "../config";
import { Eye, Shield, Compass, Sparkles, ArrowRight } from "lucide-react";

export const RelationalInsight: React.FC = () => {
  return (
    <section id="insight-relacional" className="relative py-24 px-6 overflow-hidden bg-charcoal border-t border-plum-brand/20">
      {/* Editorial Decorative ambient glow */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-peach/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[200px] h-[200px] rounded-full bg-forest/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto" id="insight-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Deep copy with authority and psychology focus */}
          <div className="lg:col-span-6 text-left space-y-8" id="insight-narrative">
            <span className="font-sans text-xs uppercase tracking-widest font-bold text-peach block reveal">
              UM OLHAR CLÍNICO SOBRE A CONVIVÊNCIA
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-ivory font-bold leading-tight reveal delay-100 italic" id="insight-hero-quote">
              “Muitas vezes, uma única conversa muda completamente a forma como o tutor enxerga o comportamento do cão.”
            </h2>

            <div className="space-y-6 text-sand/90 font-sans text-base leading-relaxed font-light reveal delay-200" id="insight-paragraphs">
              <p className="font-medium text-ivory/95 text-lg">
                Nem todo problema exige meses de treinamento. Em muitos casos, o que falta é clareza.
              </p>
              
              <p>
                A partir de um olhar clínico, atento e direcionado para o reconhecimento de padrões de comportamento, Érico Cavalheiro consegue identificar rapidamente os elementos que estão sustentando os conflitos da convivência.
              </p>

              <blockquote className="border-l-2 border-peach pl-4 py-1.5 italic bg-peach/5 pr-4 rounded-r-md text-sand/85 font-light text-sm sm:text-base">
                Grande parte das dificuldades entre humanos e cães não nasce da falta de afeto, mas de padrões emocionais, expectativas humanas, ansiedade, comunicação confusa e hábitos repetidos no cotidiano da casa.
              </blockquote>

              <p>
                Muitas vezes, uma única aula ou conversa online já é suficiente para que o tutor perceba aquilo que antes passava despercebido.
              </p>

              <p className="font-medium text-forest">
                Quando existe tomada de consciência, o comportamento começa a mudar junto com a relação.
              </p>
            </div>

            {/* Immersive quote block */}
            <div className="pt-4 border-t border-plum-brand/20 reveal delay-300">
              <p className="font-serif text-xl text-sand italic">O foco não está apenas no cão.</p>
              <p className="font-serif text-2xl font-bold text-peach mt-1">Está na dinâmica construída entre ambos.</p>
            </div>

            {/* Direct elegant anchor link button */}
            <div className="pt-6 reveal delay-400">
              <a
                href={CONFIG.WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 uppercase font-sans text-xs font-bold tracking-widest bg-forest text-charcoal px-8 py-4 rounded-sm shadow-warm hover:scale-[1.02] active:scale-[0.98] hover:bg-forest/90 transition-all duration-300"
                id="insight-cta-btn"
              >
                <span>Agendar uma conversa online</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Right Column: Key Pillars of Insights styled like high-end editorial cards */}
          <div className="lg:col-span-6 space-y-6" id="insight-pillars-list">
            
            {/* Pillar 1 */}
            <div className="p-6 sm:p-8 rounded-xl bg-plum-deep/40 border border-plum-brand/25 hover:border-forest/40 transition-all duration-300 reveal delay-100 text-left group" id="pillar-card-1">
              <div className="flex gap-5 items-start">
                <div className="p-3 bg-forest/10 text-forest rounded-lg group-hover:bg-forest group-hover:text-charcoal transition-all duration-300 shrink-0">
                  <Eye size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-ivory tracking-wide">
                    Reconhecimento de padrões
                  </h3>
                  <p className="font-sans text-sm text-sand-deep leading-relaxed mt-2 font-light">
                    Entender o que realmente sustenta o comportamento do cão no dia a dia.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 sm:p-8 rounded-xl bg-plum-deep/40 border border-plum-brand/25 hover:border-peach/40 transition-all duration-300 reveal delay-200 text-left group" id="pillar-card-2">
              <div className="flex gap-5 items-start">
                <div className="p-3 bg-peach/10 text-peach rounded-lg group-hover:bg-peach group-hover:text-charcoal transition-all duration-300 shrink-0">
                  <Compass size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-ivory tracking-wide">
                    Clareza na convivência
                  </h3>
                  <p className="font-sans text-sm text-sand-deep leading-relaxed mt-2 font-light">
                    Ajustes simples podem gerar mudanças profundas na rotina da casa.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 sm:p-8 rounded-xl bg-plum-deep/40 border border-plum-brand/25 hover:border-forest/40 transition-all duration-300 reveal delay-300 text-left group" id="pillar-card-3">
              <div className="flex gap-5 items-start">
                <div className="p-3 bg-forest/10 text-forest rounded-lg group-hover:bg-forest group-hover:text-charcoal transition-all duration-300 shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-ivory tracking-wide">
                    Orientação prática
                  </h3>
                  <p className="font-sans text-sm text-sand-deep leading-relaxed mt-2 font-light">
                    Sem fórmulas prontas ou adestramento mecânico. Foco no humano e no cão.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 sm:p-8 rounded-xl bg-plum-deep/40 border border-plum-brand/25 hover:border-peach/40 transition-all duration-300 reveal delay-400 text-left group" id="pillar-card-4">
              <div className="flex gap-5 items-start">
                <div className="p-3 bg-peach/10 text-peach rounded-lg group-hover:bg-peach group-hover:text-charcoal transition-all duration-300 shrink-0">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-ivory tracking-wide">
                    Transformação relacional
                  </h3>
                  <p className="font-sans text-sm text-sand-deep leading-relaxed mt-2 font-light">
                    O comportamento muda quando a relação ganha segurança e previsibilidade.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
