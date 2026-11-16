import React from "react";
import { CONFIG } from "../config";
import { ArrowRight } from "lucide-react";
// @ts-ignore
import heroSunsetPhoto from "../assets/images/ChatGPT Image 14 de mai. de 2026, 04_47_06.png";

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative px-6 pt-8 pb-10 sm:py-16 lg:py-20 overflow-hidden gradient-warm"
    >
      {/* Background radial soft light blobs for depth */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-terracotta/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-forest/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Side: Brand positioning & High conversion text copy */}
        <div className="lg:col-span-7 flex flex-col items-start text-left" id="hero-hero-copy">
          <p className="mb-3 font-serif text-lg italic text-peach">Antes do comando, existe relação.</p>
          <h1 className="mb-4 font-serif text-4xl leading-tight font-bold text-ivory sm:text-5xl lg:text-6xl" id="hero-headline">
            Adestramento online e orientação comportamental para cães
          </h1>
          <p className="mb-6 max-w-xl text-base leading-relaxed text-sand sm:text-lg" id="hero-subheadline">
            Atendimento por videochamada, de qualquer lugar. Entenda por que seu cão late, avança ou se agita no passeio e receba orientações para a rotina de vocês.
          </p>
          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto reveal delay-400"
            id="hero-ctas-block"
          >
            {/* Primary high-conversion CTA (Direct conversion WhatsApp) */}
            <a
              href={CONFIG.WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group uppercase font-sans text-xs font-bold tracking-widest bg-ivory text-charcoal px-8 py-4 rounded-sm flex items-center justify-center gap-2 shadow-warm hover:bg-terracotta hover:text-ivory hover:scale-[1.03] hover:shadow-[0_12px_25px_rgba(237,76,135,0.3)] active:scale-[0.96] active:bg-[#e780a4] transition-all duration-300 transform"
              id="hero-cta-whatsapp"
            >
              Agendar pelo WhatsApp
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Secondary Anchor CTA */}
            <a href="#aula-online"
              onClick={(event) => {
                const section = document.getElementById("aula-online");
                if (!section) return;
                event.preventDefault();
                section.scrollIntoView();
              }}
              className="group uppercase font-sans text-xs font-bold tracking-widest text-ivory border border-sand-deep/35 hover:border-terracotta hover:bg-terracotta/10 px-8 py-4 rounded-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.96] transition-all duration-300 cursor-pointer transform"
              id="hero-cta-method"
            >
              Como funciona o atendimento
            </a>
          </div>


        </div>

        {/* Right Side: Spectacular Editorial Magazine Layout Poster */}
        <div className="lg:col-span-5 w-full flex justify-center lg:justify-end reveal delay-200" id="hero-editorial-poster">
          {/* Main Photo Frame with realistic depth, texture, and elegant shadow */}
          <div className="w-full max-w-[420px] aspect-[4/5] bg-[#efe7e7] border border-plum-brand/20 shadow-[-16px_16px_48px_rgba(10,5,15,0.6)] rounded-xl overflow-hidden relative group flex flex-col justify-between">
            
            {/* The Image taking up the entire frame under overlays */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img 
                src={heroSunsetPhoto} 
                alt="Érico Cavalheiro caminhando com cão no pôr do sol" 
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
              
              {/* High Quality SVG Noise film grain texture overlay to add organic texture */}
              <div 
                className="absolute inset-0 opacity-[0.16] pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
              />

              {/* Warm Analog Film Vignette effect overlay to blend with the golden hour */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-charcoal/20 mix-blend-multiply pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(22,14,26,0.4)_95%)] pointer-events-none" />
              
              {/* Subtle warm sunset light leak glow inside the cover */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-peach/10 blur-3xl rounded-full mix-blend-screen pointer-events-none" />
            </div>

            {/* Bottom floating details */}
            <div className="z-20 relative p-5 bg-gradient-to-t from-charcoal/60 to-transparent mt-auto flex justify-between items-center">
              <span className="text-[10px] font-sans tracking-widest text-ivory/80 uppercase font-medium">
                Érico Cavalheiro
              </span>
              <span className="text-[9px] font-sans tracking-wider text-peach uppercase font-semibold">
                Educação Relacional
              </span>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
};
