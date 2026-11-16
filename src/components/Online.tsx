import React from "react";
import { CONFIG } from "../config";
import { Laptop, PhoneCall, Video, MessageSquare } from "lucide-react";

export const Online: React.FC = () => {
  return (
    <section id="aula-online" className="relative py-12 px-6 sm:py-16 overflow-hidden bg-charcoal/40 border-y border-plum-brand/10">
      {/* Background Soft Lights */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-forest/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto" id="online-container">
        <div className="grid grid-cols-1 gap-16 items-center">
          
          {/* Left Column: Value Proposition & High End Copy */}
          <div className="min-w-0 text-left" id="online-info">
            <span className="font-sans text-xs uppercase tracking-widest font-bold text-rose-brand mb-3 block reveal">
              SUPORTE SEM FRONTEIRAS GEOGRÁFICAS
            </span>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] text-ivory font-bold leading-tight mb-6 reveal delay-100" id="online-header">
              Como funciona o atendimento online
            </h2>

            <p className="font-sans text-sm sm:text-base text-sand/90 leading-relaxed mb-6 reveal delay-200" id="online-text-1">
              Você conversa com o Érico por videochamada e recebe um plano de orientação para a rotina com seu cão.
            </p>


            {/* List of elegant steps with lucide icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 reveal delay-400" id="online-process-steps">
              <div className="flex gap-4 items-start" id="step-one">
                <div className="p-2.5 rounded-lg bg-rose-brand/10 text-rose-brand">
                  <Video size={18} />
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-sm font-bold text-ivory">1. Envio Prévio de Vídeos</h4>
                  <p className="font-sans text-xs text-sand-deep leading-relaxed mt-1">
                    Você filma a dinâmica da casa e as reações indesejadas do cão para diagnóstico minucioso.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start" id="step-two">
                <div className="p-2.5 rounded-lg bg-forest/10 text-forest">
                  <Laptop size={18} />
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-sm font-bold text-ivory">2. Videoconferência ao Vivo</h4>
                  <p className="font-sans text-xs text-sand-deep leading-relaxed mt-1">
                    Uma sessão individual de 1h30m onde explico o modelo psicológico por trás do comportamento.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start" id="step-three">
                <div className="p-2.5 rounded-lg bg-peach/10 text-peach">
                  <PhoneCall size={18} />
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-sm font-bold text-ivory">3. Desenho de Rotina</h4>
                  <p className="font-sans text-xs text-sand-deep leading-relaxed mt-1">
                    Criamos um cronograma detalhado de passeios regulados, enriquecimento e limites.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start" id="step-four">
                <div className="p-2.5 rounded-lg bg-gray-blue/20 text-forest">
                  <MessageSquare size={18} />
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-sm font-bold text-ivory">4. Suporte WhatsApp 15 dias</h4>
                  <p className="font-sans text-xs text-sand-deep leading-relaxed mt-1">
                    Acompanhamento pessoal para validação diária de vídeos do seu avanço com o cão.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct primary button */}
            <a
              href={CONFIG.WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 uppercase font-sans text-xs font-bold tracking-widest bg-forest text-charcoal px-8 py-4 rounded-sm shadow-soft hover:bg-terracotta hover:text-ivory hover:scale-[1.03] hover:shadow-[0_12px_25px_rgba(237,76,135,0.3)] active:scale-[0.96] active:bg-[#e780a4] transition-all transform duration-300 reveal delay-500"
              id="online-action-cta"
            >
              Agendar pelo WhatsApp
            </a>

          </div>


        </div>
      </div>
    </section>
  );
};
