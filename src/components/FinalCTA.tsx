import React from "react";
import { CONFIG } from "../config";
import { ArrowRight, MessageSquare, PhoneCall } from "lucide-react";

export const FinalCTA: React.FC = () => {
  return (
    <section id="final-cta" className="relative py-28 px-6 overflow-hidden bg-charcoal">
      {/* Editorial aesthetic background with intersecting light sweeps */}
      <div className="absolute inset-0 bg-radial-gradient(ellipse at 50% 50%, rgba(211, 90, 66, 0.08) 0%, transparent 60%) pointer-events-none" />
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full bg-forest/5 blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10" id="final-cta-wrapper">
        
        {/* Subtle top decoration line */}
        <div className="w-12 h-[2px] bg-peach mx-auto mb-8" />

        <span className="font-sans text-xs uppercase tracking-widest font-bold text-peach mb-4 block reveal">
          CONVITE À RECONCEITUAÇÃO DA CONVIVÊNCIA
        </span>

        <h2 className="font-serif text-4xl sm:text-5xl lg:text-[55px] text-ivory font-bold leading-tight mb-6 text-balance reveal delay-100" id="final-cta-header">
          Pronto para transformar a relação com o seu cão?
        </h2>

        <p className="font-sans text-sm sm:text-base text-sand/90 leading-relaxed max-w-xl mx-auto mb-10 text-balance reveal delay-200" id="final-cta-explanation">
          Nenhum desvio comportamental se resolve sozinho com o tempo. Dê ao seu cão a clareza, a proteção e o ambiente previsível que ele necessita para viver em calma.
        </p>

        {/* Closing High-Value CTA Button block */}
        <div className="flex flex-col items-center gap-4 reveal delay-300" id="final-cta-conversion">
          <a
            href={CONFIG.WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 bg-gradient-clay px-10 py-5 text-sm font-bold uppercase tracking-widest text-charcoal rounded-sm overflow-hidden shadow-warm hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            id="final-cta-primary-btn"
          >
            <span className="relative z-10 flex items-center gap-2">
              Agendar conversa particular
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-ivory opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </a>

          {/* Non-spam reassurance tag */}
          <div className="flex gap-4 items-center justify-center text-sans text-[11px] text-sand-deep tracking-wider uppercase mt-4" id="cta-reassurances">
            <span className="flex items-center gap-1">
              <PhoneCall size={12} className="text-forest" />
              Retorno em até 2 horas úteis
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MessageSquare size={12} className="text-forest" />
              Suporte direto pelo WhatsApp
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
