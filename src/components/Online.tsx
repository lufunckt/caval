import React from "react";
import { CONFIG } from "../config";
import { Laptop, PhoneCall, CheckCircle, Video, MessageSquare, Play } from "lucide-react";
import { Logo } from "./Logo";

export const Online: React.FC = () => {
  return (
    <section id="aula-online" className="relative py-24 px-6 overflow-hidden bg-charcoal/40 border-y border-plum-brand/10">
      {/* Background Soft Lights */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-forest/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto" id="online-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Value Proposition & High End Copy */}
          <div className="lg:col-span-7 text-left" id="online-info">
            <span className="font-sans text-xs uppercase tracking-widest font-bold text-rose-brand mb-3 block reveal">
              SUPORTE SEM FRONTEIRAS GEOGRÁFICAS
            </span>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] text-ivory font-bold leading-tight mb-6 reveal delay-100" id="online-header">
              Como funciona a Mentoria Estratégica Online?
            </h2>

            <p className="font-sans text-sm sm:text-base text-sand/90 leading-relaxed mb-6 reveal delay-200" id="online-text-1">
              A mentoria comportamental online foi desenhada para tutores de qualquer parte do mundo que buscam orientação direta, análise cirúrgica e protocolos de ajuste de rotina rápidos.
            </p>

            <p className="font-sans text-sm sm:text-base text-sand/80 leading-relaxed mb-8 reveal delay-300" id="online-text-2">
              Embora sessões presenciais sejam valiosas para treinos práticos de reatividade, **80% do sucesso da educação do seu cão vem do que você ajusta sob diretriz mental dentro de casa.** Através da videoconferência, posso ler o ambiente e direcionar seus movimentos com precisão científica.
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
              className="inline-flex items-center gap-2 uppercase font-sans text-xs font-bold tracking-widest bg-forest text-charcoal px-8 py-4 rounded-sm shadow-soft hover:bg-forest/90 transition-all duration-300 reveal delay-500"
              id="online-action-cta"
            >
              Agendar Mentoria Estratégica
            </a>

          </div>

          {/* Right Column: High End Interactive Graphic (Simulated UI of a video call session) */}
          <div className="lg:col-span-5 flex justify-center reveal delay-300" id="online-visual">
            <div className="relative w-full max-w-[380px] bg-sky-950 aspect-[4/5] rounded-xl overflow-hidden border border-plum-brand/35 shadow-lift bg-gradient-forest group">
              
              {/* Client camera picture container mockup */}
              <div className="absolute inset-x-3 top-3 bottom-24 bg-charcoal/90 rounded-lg overflow-hidden border border-plum-brand/20 relative">
                
                {/* Simulated digital grid background on call */}
                <div className="absolute inset-0 bg-radial-gradient from-charcoal to-[#1B1224] opacity-30" />

                {/* Subtitle / Screen watermark badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-ivory z-20">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-brand animate-ping" />
                  <span className="font-sans font-semibold uppercase tracking-wider">Conexão Segura ao Vivo</span>
                </div>

                {/* Digital overlay text representing video scan lines */}
                <div className="absolute inset-0 bg-linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%) bg-[length:100%_4px] pointer-events-none opacity-20" />

                {/* Interactive diagram explaining a dog's posture in video interface */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                  {/* Subtle vector shape representing target cursor framing a dog's posture */}
                  <div className="border border-dashed border-forest/50 rounded-lg p-3 bg-charcoal/40 backdrop-blur-sm self-start max-w-[200px] mb-4">
                    <span className="text-[9px] uppercase tracking-wider text-forest font-bold block mb-1">
                      Leitura Comportamental
                    </span>
                    <p className="text-[10px] text-sand leading-snug">
                      “Orelhas voltadas para trás com postura corporal baixa indica sinal de desconforto situacional.”
                    </p>
                  </div>
                </div>

                {/* Simulated floating avatar profile of Erico in small call frame */}
                <div className="absolute bottom-4 right-4 w-24 h-32 bg-[#1B1224] rounded-md border border-forest/40 overflow-hidden shadow-soft flex flex-col justify-between p-2">
                  <span className="text-[8px] text-forest font-bold uppercase tracking-widest text-center block">Érico (Guia)</span>
                  <div className="my-auto flex justify-center">
                    <Logo iconOnly={true} className="w-8 h-8 opacity-80" />
                  </div>
                  <span className="text-[8px] text-center text-sand-deep block">São Paulo</span>
                </div>

              </div>

              {/* Live calling controls styling bar */}
              <div className="absolute bottom-0 inset-x-0 h-20 bg-charcoal border-t border-plum-brand/20 px-4 flex items-center justify-between" id="video-bar-controls">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-sand-deep font-sans tracking-wide uppercase">CÃO ANALISADO</span>
                  <span className="text-xs text-ivory font-serif font-bold">Reatividade Urbana</span>
                </div>
                <div className="flex gap-2">
                  <span className="h-3.5 w-3.5 rounded-full bg-red-500/80 animate-pulse" />
                  <span className="h-3.5 w-3.5 rounded-full bg-green-500/80" />
                  <span className="h-3.5 w-3.5 rounded-full bg-gray-500/80" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
