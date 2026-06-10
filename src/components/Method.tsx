import React, { useState } from "react";
import { METHOD_PILLARS } from "../data";
import { Sparkles, ArrowRight, Eye, Home, Compass, Heart } from "lucide-react";

export const Method: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Return corresponding lucide icon for each pillar
  const getPillarIcon = (num: string) => {
    switch (num) {
      case "01":
        return <Eye size={20} className="text-forest" />;
      case "02":
        return <Home size={20} className="text-peach" />;
      case "03":
        return <Compass size={20} className="text-rose-brand" />;
      case "04":
        return <Heart size={20} className="text-terracotta" />;
      default:
        return <Sparkles size={20} />;
    }
  };

  return (
    <section id="metodo" className="relative pt-32 pb-24 px-6 overflow-hidden bg-charcoal">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-peach/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-rose-brand/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10" id="method-wrapper">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto mb-16 text-center reveal" id="method-section-header">
          <span className="font-sans text-xs uppercase tracking-widest font-bold text-forest mb-3 inline-block">
            MÉTODOLOGIA INTEGRADORA E HUMANA
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] text-ivory font-bold leading-tight mb-6">
            O Método de Educação Relacional
          </h2>
          <div className="w-16 h-1 bg-gradient-clay mx-auto mb-6" />
          <p className="font-sans text-sm sm:text-base text-sand/80 leading-relaxed text-balance">
            Nossa metodologia foca na causa raiz dos desvios de comportamento, trabalhando a percepção do tutor, a estabilidade do lar e o equilíbrio das emoções do cão de forma científica e afetiva.
          </p>
        </div>

        {/* Master Pillars Grid with hover state dynamics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="method-pillars-cards-grid">
          {METHOD_PILLARS.map((pillar, idx) => {
            const isHovered = hoveredIdx === idx;
            const delayClass = idx === 0 ? "" : idx === 1 ? "delay-100" : idx === 2 ? "delay-200" : "delay-300";
            return (
              <div
                key={pillar.number}
                className={`group relative rounded-xl bg-plum-deep/40 border border-plum-brand/25 p-8 transition-all duration-300 overflow-hidden text-left cursor-pointer hover:border-forest/40 hover:-translate-y-1.5 reveal ${delayClass}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                id={`method-pillar-card-${idx}`}
                style={{
                  boxShadow: isHovered
                    ? `0 15px 35px -5px rgba(0, 0, 0, 0.4), inset 0 0 10px 0 ${pillar.bgHex}22`
                    : "0 4px 20px rgba(0,0,0,0.1)",
                }}
              >
                {/* Background glowing indicator layer matching brand colors */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 10% 10%, ${pillar.textHex}15, transparent 50%)`,
                  }}
                />

                {/* Left vertical border with matching color stripe */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300"
                  style={{
                    backgroundColor: isHovered ? pillar.textHex : "rgba(99, 82, 110, 0.2)",
                  }}
                />

                <div className="flex items-center justify-between mb-6" id={`method-pillar-header-${idx}`}>
                  {/* Pillar Sequential Number with Serif elegance */}
                  <span
                    className="font-serif text-4xl font-extrabold tracking-tight opacity-40 transition-all duration-300 group-hover:opacity-100"
                    style={{ color: pillar.textHex }}
                  >
                    {pillar.number}
                  </span>
                  
                  {/* Glowing Icon Wrapper */}
                  <div
                    className="p-3 rounded-full bg-white/5 transition-all duration-300"
                    style={{
                      boxShadow: isHovered ? `0 0 20px ${pillar.textHex}25` : "",
                      backgroundColor: isHovered ? `${pillar.textHex}10` : "rgba(255, 255, 255, 0.03)",
                    }}
                  >
                    {getPillarIcon(pillar.number)}
                  </div>
                </div>

                {/* Pillar Subtitle (Tagline) */}
                <span
                  className="font-sans text-[11px] uppercase font-bold tracking-widest block mb-1"
                  style={{ color: pillar.textHex }}
                >
                  {pillar.subtitle}
                </span>

                {/* Pillar Title */}
                <h3 className="font-serif text-2xl font-bold text-ivory mb-4" id={`method-pillar-title-${idx}`}>
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-sm text-sand/80 leading-relaxed" id={`method-pillar-desc-${idx}`}>
                  {pillar.description}
                </p>

                {/* Editorial subtle footer decoration inside card */}
                <div className="flex items-center gap-1.5 mt-6 text-xs font-semibold text-sand-deep tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" id={`method-pillar-read-${idx}`}>
                  <span>Compromisso Relacional</span>
                  <ArrowRight size={12} style={{ color: pillar.textHex }} />
                </div>

              </div>
            );
          })}
        </div>



      </div>
    </section>
  );
};
