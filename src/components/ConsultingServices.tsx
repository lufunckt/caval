import React from "react";
import { SERVICES } from "../data";
import { CONFIG } from "../config";
import { Check, Sparkles, AlertCircle, Calendar } from "lucide-react";

export const ConsultingServices: React.FC = () => {
  return (
    <section id="servicos" className="py-24 px-6 bg-charcoal relative border-t border-plum-brand/20">
      {/* Visual background lights for prestige */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-peach/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-forest/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10" id="services-container">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto mb-16 text-center reveal" id="services-header">
          <span className="font-sans text-[11px] uppercase tracking-widest font-bold text-peach mb-3 inline-block">
            ACOMPANHAMENTO DIRECIONADO
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ivory font-bold leading-tight mb-5">
            Consultorias & Serviços Relacionais
          </h2>
          <div className="w-16 h-px bg-peach/40 mx-auto mb-6" />
          <p className="font-sans text-xs sm:text-sm text-sand/80 leading-relaxed">
            Abordagens sob medida que unem psicologia, comportamento e afeto estruturado. Escolha o formato ideal para restabelecer a harmonia na convivência com seu companheiro canino.
          </p>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch" id="services-grid">
          {SERVICES.map((service, idx) => {
            const isIndividual = service.id === "consultoria-individual";
            const isRehab = service.id === "reabilitacao-emocional";
            
            // Custom dynamic styles according to the product tier
            const badgeColor = isIndividual 
              ? "bg-peach/10 text-peach border-peach/20" 
              : isRehab 
                ? "bg-rose-brand/10 text-rose-brand border-rose-brand/20" 
                : "bg-forest/10 text-forest border-forest/20";

            const cardBorder = isIndividual
              ? "border-peach/35 bg-plum-deep/40 shadow-[-8px_8px_32px_rgba(242,173,94,0.06)]"
              : "border-plum-brand/25 bg-plum-deep/20";
              
            const btnBg = isIndividual
              ? "bg-gradient-clay text-[#160E1A] hover:scale-[1.01]"
              : "bg-backdrop border border-plum-brand/30 hover:border-sand/40 text-ivory";

            // Redirect text built specifically for whatsapp message flow context
            const customWhatsappURL = `${CONFIG.WHATSAPP_URL}&text=Olá,%20gostaria%20de%20saber%20mais%20detalhes%20sobre%20a%20sua%20${encodeURIComponent(service.title)}.`;

            return (
              <div
                key={service.id}
                className={`flex flex-col rounded-xl p-8 border transition-all duration-300 relative justify-between reveal ${cardBorder}`}
                id={`service-card-${service.id}`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Visual glow on top-right for highly focused individual tier */}
                {isIndividual && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-peach/5 blur-2xl rounded-full pointer-events-none" />
                )}

                <div>
                  {/* Badge & Meta info */}
                  <div className="flex justify-between items-center mb-6">
                    <span className={`text-[9px] font-sans tracking-widest uppercase font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                      {service.badge}
                    </span>
                    <span className="text-[10px] font-mono text-sand-deep/70">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-ivory mb-2 leading-tight">
                    {service.title}
                  </h3>
                  <p className="font-sans text-[11px] text-peach uppercase tracking-widest font-semibold mb-5">
                    {service.tagline}
                  </p>

                  <div className="w-full h-px bg-plum-brand/15 mb-6" />

                  {/* Description */}
                  <p className="font-sans text-xs sm:text-sm text-sand/85 leading-relaxed mb-6 italic">
                    {service.description}
                  </p>

                  {/* Checklist Features */}
                  <div className="space-y-3.5 mb-8" id={`service-features-${service.id}`}>
                    <span className="text-[9px] text-sand-deep tracking-wider uppercase font-bold block mb-4">
                      O que está incluído:
                    </span>
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-left">
                        <span className="mt-1 p-0.5 rounded-full bg-forest/15 text-forest shrink-0">
                          <Check size={11} className="stroke-[3]" />
                        </span>
                        <span className="font-sans text-xs text-sand/90 leading-normal">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Button and Pricing Sits comfortably at the bottom */}
                <div>
                  <div className="w-full h-px bg-plum-brand/15 mb-6" />
                  
                  <div className="flex justify-between items-baseline mb-5">
                    <span className="text-[10px] font-sans text-sand-deep uppercase tracking-wider font-semibold">
                      Investimento
                    </span>
                    <span className="font-serif text-sm font-bold text-ivory">
                      {service.price}
                    </span>
                  </div>

                  <a
                    href={customWhatsappURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full h-11 text-center flex items-center justify-center font-sans text-[11px] font-bold uppercase tracking-wider rounded-sm transition-all transform duration-300 cursor-pointer hover:scale-[1.03] active:scale-[0.96] hover:shadow-[0_10px_20px_rgba(237,76,135,0.2)] hover:border-terracotta/40 ${btnBg}`}
                    id={`service-cta-btn-${service.id}`}
                  >
                    <Calendar size={13} className="mr-2" />
                    <span>{service.ctaText}</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
