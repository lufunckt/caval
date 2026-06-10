import React from "react";
import { CONFIG } from "../config";
import { BookOpen, Sparkles, Download, CheckCircle } from "lucide-react";
import { Logo } from "./Logo";

export const Ebook: React.FC = () => {
  return (
    <section id="ebook" className="relative py-24 px-6 overflow-hidden bg-charcoal/40 border-t border-plum-brand/15">
      {/* Background blobs for premium depth */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-peach/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10" id="ebook-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Stunning luxury book cover graphics mockup */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1 reveal" id="ebook-mockup-frame">
            <div className="relative group max-w-[320px] w-full">
              
              {/* Outer shadow / 3D book hover effects */}
              <div className="absolute -inset-1 bg-gradient-to-r from-peach to-terracotta rounded-lg opacity-40 blur transition duration-500 group-hover:opacity-75" />
              
              {/* Actual 3D stylized book cover */}
              <div className="relative aspect-[3/4] bg-[#22172C] rounded-r-xl border-l-[8px] border-[#3E2950] overflow-hidden p-6 flex flex-col justify-between text-left shadow-lift group-hover:-translate-y-1.5 transition-transform duration-300">
                
                {/* Book header text */}
                <div className="flex justify-between items-center border-b border-plum-brand/30 pb-4">
                  <span className="font-sans text-[8px] tracking-widest uppercase font-bold text-forest">
                    GUIA RELACIONAL VOL. 01
                  </span>
                  <span className="font-sans text-[8px] text-sand-deep tracking-wider uppercase font-semibold">
                    pdf gratuito
                  </span>
                </div>

                {/* Main branding & logo on cover */}
                <div className="my-auto py-4 flex flex-col items-center text-center">
                  <Logo showText={false} className="mb-4 transform scale-110" />
                  
                  <span className="font-sans text-[10px] uppercase font-semibold tracking-widest text-peach block mb-1">
                    Érico Cavalheiro
                  </span>
                  
                  {/* Huge elegant Book Title */}
                  <h3 className="font-serif text-3xl font-bold tracking-tight text-ivory italic leading-tight mb-2">
                    Vínculo Sem Comando
                  </h3>
                  
                  <div className="w-8 h-[1px] bg-forest/40 my-3" />
                  
                  <p className="font-serif text-xs text-sand-deep font-light leading-relaxed max-w-[200px]">
                    Guia prático para tutores lerem sinais do cão e reestruturarem a convivência com psicologia canina.
                  </p>
                </div>

                {/* Book footer elements */}
                <div className="border-t border-plum-brand/35 pt-4 flex justify-between items-center text-[8px] font-sans text-sand-deep uppercase">
                  <span>EDUCAÇÃO CANINA</span>
                  <span>AUTOR DESCONECTADO RESPEITO</span>
                </div>

              </div>

            </div>
          </div>

          {/* Right Column: Copy about lead magnet and high-conversion details */}
          <div className="lg:col-span-7 text-left order-1 lg:order-2" id="ebook-info-copy">
            <span className="font-sans text-xs uppercase tracking-widest font-bold text-forest mb-3 block reveal">
              MATERIAL DIDÁTICO E GRATUITO
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] text-ivory font-bold leading-tight mb-6 reveal delay-100" id="ebook-main-header">
              Baixe o Guia Exclusivo: “Vínculo Sem Comando”
            </h2>

            <p className="font-sans text-sm sm:text-base text-sand/90 leading-relaxed mb-6 reveal delay-200" id="ebook-desc-1">
              Desenvolvi este material digital para dar clareza aos tutores cansados de metodologias punitivas que desgastam a saúde e a mente do cão. Um minicurso visual prático estruturado sobre os pilares da verdadeira Educação Relacional.
            </p>

            <p className="font-sans text-sm sm:text-base text-sand/80 leading-relaxed mb-8 font-light reveal delay-250" id="ebook-desc-2">
              Aprenda a decifrar a raiz das reações do seu cão e comece a reorganizar a rotina familiar na mesma semana.
            </p>

            {/* List of included insights inside ebook */}
            <div className="space-y-4 mb-10 reveal delay-300" id="ebook-chapters-highlights">
              <div className="flex gap-3 items-start text-sm text-sand" id="insight-1">
                <span className="p-1 rounded-full bg-forest/10 text-forest shrink-0 mt-0.5">
                  <BookOpen size={14} />
                </span>
                <div>
                  <h4 className="font-serif text-sm font-bold text-ivory">A decodificação dos micro-sinais</h4>
                  <p className="font-sans text-xs text-sand-deep mt-0.5">Como ler olhares, orelhas, lamber de focinho e bocejos para evitar acidentes urbanos.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start text-sm text-sand" id="insight-2">
                <span className="p-1 rounded-full bg-forest/10 text-forest shrink-0 mt-0.5">
                  <BookOpen size={14} />
                </span>
                <div>
                  <h4 className="font-serif text-sm font-bold text-ivory">Despedidas e Chegadas Neutras</h4>
                  <p className="font-sans text-xs text-sand-deep mt-0.5">Aprenda o passo-a-passo mecânico para acalmar a ansiedade de separação.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start text-sm text-sand" id="insight-3">
                <span className="p-1 rounded-full bg-forest/10 text-forest shrink-0 mt-0.5">
                  <BookOpen size={14} />
                </span>
                <div>
                  <h4 className="font-serif text-sm font-bold text-ivory">Os 3 brinquedos cognitivos caseiros de baixo custo</h4>
                  <p className="font-sans text-xs text-sand-deep mt-0.5">Como reequilibrar a mente canina com jogos de farejo e táticas sensoriais.</p>
                </div>
              </div>
            </div>

            {/* Primary conversion CTA - opens TALLY LINK directly in new tab */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 reveal delay-400" id="ebook-action-box">
              <a
                href={CONFIG.TALLY_EBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 uppercase font-sans text-xs font-bold tracking-widest bg-gradient-clay text-charcoal px-10 py-5 rounded-sm shadow-warm hover:bg-terracotta hover:text-ivory hover:scale-[1.05] hover:shadow-[0_15px_30px_rgba(237,76,135,0.4)] active:scale-[0.96] transition-all duration-300 transform cursor-pointer"
                id="ebook-tally-button"
              >
                <span className="font-sans font-bold flex items-center gap-2">
                  Receber via WhatsApp/E-mail
                  <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                </span>
              </a>

              <div className="flex flex-col items-center sm:items-start gap-2">
                <a
                  href={(CONFIG as any).EBOOK_DOWNLOAD_URL}
                  download
                  className="group inline-flex items-center justify-center gap-2.5 uppercase font-sans text-[10px] font-bold tracking-widest bg-white/5 text-ivory border border-white/10 px-6 py-3 rounded-sm hover:bg-white/10 transition-all duration-300 transform cursor-pointer"
                  id="ebook-direct-download-button"
                >
                  <span className="font-sans font-bold flex items-center gap-2">
                    Download Direto
                  </span>
                </a>
                <span className="font-sans text-[9px] text-sand-deep uppercase tracking-[0.2em] opacity-70">
                  PDF • 2.4MB • Guia Visual
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
