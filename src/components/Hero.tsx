import React from "react";
import { CONFIG } from "../config";
import { ArrowRight, Sparkles, AlertCircle } from "lucide-react";
// @ts-ignore
import heroSunsetPhoto from "../assets/images/ChatGPT Image 14 de mai. de 2026, 04_47_06.png";

export const Hero: React.FC = () => {
  const handleScrollToMethod = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById("metodo");
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-6 overflow-hidden gradient-warm"
    >
      {/* Background radial soft light blobs for depth */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-terracotta/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-forest/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Brand positioning & High conversion text copy */}
        <div className="lg:col-span-7 flex flex-col items-start text-left" id="hero-hero-copy">
          {/* Subtle Tagline / Micro-badge */}
          <div
            className="inline-flex items-center gap-2 border border-forest/30 bg-forest/10 px-3 py-1.5 rounded-full mb-6 reveal"
            id="hero-micro-badge"
          >
            <Sparkles size={13} className="text-forest animate-pulse" />
            <span className="font-sans text-[10px] font-bold text-forest tracking-widest uppercase">
              Educação Canina Integradora & Relacional
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className="font-serif text-5xl sm:text-6xl lg:text-[70px] text-ivory font-bold leading-[1.05] tracking-tight mb-6 text-balance reveal delay-100"
            id="hero-headline"
          >
            Antes do <span className="text-rose-brand">comando</span>, <br className="hidden sm:inline" />
            existe <span className="text-forest relative inline-block">relação.</span>
          </h1>

          {/* Subheadline describing relational stance */}
          <p
            className="font-sans text-[19px] text-sand/90 font-medium leading-relaxed max-w-xl mb-6 text-balance reveal delay-200"
            id="hero-subheadline"
          >
            Comportamento canino com olhar psicológico, educação relacional e reforço positivo para tutores que querem compreender antes de corrigir.
          </p>

          {/* Core Philosophy Support Quote - elegant editorial border */}
          <div
            className="border-l-2 border-peach pl-4 py-1 mb-8 max-w-lg bg-plum-deep/20 rounded-r-md pr-4 reveal delay-300"
            id="hero-supportive-phrase"
          >
            <p className="font-serif text-[20px] italic text-peach/90 leading-relaxed font-light">
              “Educar não é humanizar. É aprender a conviver com outra espécie com clareza, vínculo e respeito.”
            </p>
          </div>

          {/* Dual Call To Actions */}
          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto reveal delay-400"
            id="hero-ctas-block"
          >
            {/* Primary high-conversion CTA (Direct conversion WhatsApp) */}
            <a
              href={CONFIG.WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group uppercase font-sans text-xs font-bold tracking-widest bg-ivory text-charcoal px-8 py-4 rounded-sm flex items-center justify-center gap-2 shadow-warm hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              id="hero-cta-whatsapp"
            >
              Agendar conversa
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Secondary Anchor CTA */}
            <button
              onClick={handleScrollToMethod}
              className="group uppercase font-sans text-xs font-bold tracking-widest text-ivory border border-sand-deep/35 hover:border-forest px-8 py-4 rounded-sm flex items-center justify-center gap-2 hover:bg-forest/5 transition-all duration-300 cursor-pointer"
              id="hero-cta-method"
            >
              Conhecer o método
            </button>
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
