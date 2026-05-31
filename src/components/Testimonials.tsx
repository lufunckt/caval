import React from "react";
import { TESTIMONIALS } from "../data";
import { Star, MessageSquare } from "lucide-react";

export const Testimonials: React.FC = () => {
  return (
    <section id="depoimentos" className="relative py-24 px-6 overflow-hidden bg-charcoal">
      {/* Background gradients */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-forest/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10" id="testimonials-wrapper">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto mb-16 text-center reveal" id="testimonials-section-header">
          <span className="font-sans text-xs uppercase tracking-widest font-bold text-forest mb-3 inline-block">
            RESULTADOS REAIS NA PRÁTICA
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] text-ivory font-bold leading-tight mb-6">
            O que dizem os tutores transformados
          </h2>
          <div className="w-16 h-1 bg-gradient-clay mx-auto mb-6" />
          <p className="font-sans text-sm sm:text-base text-sand/80 leading-relaxed text-balance">
            Mais do que 'adestrar', ajudamos famílias a reconquistar a serenidade, restabelecendo a confiança, prevendo tensões e reeducando sob o afeto correto.
          </p>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="testimonials-grid">
          {TESTIMONIALS.map((test, idx) => {
            const delayClass = idx === 0 ? "" : idx === 1 ? "delay-100" : "delay-200";
            return (
              <div
                key={test.id}
                className={`flex flex-col justify-between rounded-xl bg-plum-deep/40 border border-plum-brand/20 p-8 hover:border-sand-deep/30 transition-all duration-300 relative group reveal ${delayClass}`}
                id={`testimonial-card-${test.id}`}
              >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-forest/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />

              {/* Card top */}
              <div className="text-left" id={`test-top-${test.id}`}>
                {/* 5 Organic Stars */}
                <div className="flex gap-1 mb-5 text-peach">
                  {[...Array(test.stars)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>

                {/* Main Opinion */}
                <p className="font-sans text-xs sm:text-sm text-sand/90 leading-relaxed mb-6 italic" id={`test-text-${test.id}`}>
                  “{test.text}”
                </p>
              </div>

              {/* Card Bottom / Personal profile metadata */}
              <div className="border-t border-plum-brand/20 pt-6 flex justify-between items-center text-left" id={`test-bottom-${test.id}`}>
                <div>
                  <h4 className="font-serif text-base font-bold text-ivory">{test.name}</h4>
                  <span className="font-sans text-[10px] text-forest font-semibold uppercase tracking-widest block mt-0.5">
                    {test.role}
                  </span>
                </div>
                
                {/* Dog Name & Breed Badge */}
                <div className="text-right">
                  <span className="font-serif text-xs italic text-peach font-semibold block leading-none">
                    {test.dogName}
                  </span>
                  <span className="font-sans text-[9px] text-sand-deep tracking-wide uppercase block mt-1">
                    {test.dogBreed}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
        </div>

        {/* Closing conversion nudge */}
        <div className="mt-16 text-center select-none reveal delay-100" id="testimonials-closure-bar">
          <p className="font-sans text-xs text-sand-deep uppercase tracking-widest inline-flex items-center gap-2">
            <MessageSquare size={13} className="text-forest animate-bounce" />
            Vínculo reconectado através do entendimento mútuas e respeito à biologia canina.
          </p>
        </div>

      </div>
    </section>
  );
};
