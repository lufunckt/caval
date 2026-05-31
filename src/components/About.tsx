import React, { useState } from "react";
import { STATS } from "../data";
import { GraduationCap } from "lucide-react";
// @ts-ignore
import ericoPhoto from "../assets/images/about-erico-D9eoGtnm.jpg";

export const About: React.FC = () => {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <section id="sobre" className="relative py-24 px-6 overflow-hidden bg-charcoal/40">
      {/* Decorative radial gradients */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-forest/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto" id="about-container">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Premium Photo representation of Érico */}
          <div className="lg:col-span-5 order-2 lg:order-1 reveal" id="about-brand-visual-column">
            <div className="relative group max-w-[340px] sm:max-w-[380px] mx-auto">
              
              {/* Outer glowing frame border */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-forest/30 via-peach/20 to-rose-brand/30 opacity-70 blur-xl group-hover:opacity-100 transition duration-1000" />
              
              {/* Elegant image container box */}
              <div className="relative aspect-[3/4] rounded-2xl bg-plum-deep border border-plum-brand/40 overflow-hidden shadow-lift flex flex-col justify-between">
                {useFallback ? (
                  <div className="w-full h-full bg-gradient-to-b from-charcoal to-plum-deep flex flex-col justify-between p-8 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-forest/5 blur-3xl pointer-events-none" />
                    
                    {/* Branded minimalist SVG lockup matching user image */}
                    <div className="flex flex-col items-center justify-center flex-grow text-center space-y-4">
                      <svg className="w-20 h-20 text-forest/90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 20C33 20 37 25 35 30C33 34 39 37 41 39C43 41 45 40 43 43C41 46 39 45 37 49C35 53 38 56 34 60C31 63 32 68 30 72C28 75 25 78 22 80" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="49" cy="45" r="3" fill="#ED4C87" className="animate-pulse" />
                        <path d="M74 25C76 28 72 34 68 36C64 38 61 36 57 41C54 44 55 48 57 52C59 55 64 56 63 60C62 63 56 66 59 70C61 73 66 76 68 79" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M52 74C61 74 68 67 68 59" stroke="currentColor" strokeWidth="1.8" strokeDasharray="2 3" />
                      </svg>
                      
                      <div className="space-y-1">
                        <h3 className="font-display font-medium text-4xl text-peach leading-none tracking-normal lowercase">érico</h3>
                        <h3 className="font-display font-medium text-4xl text-ivory leading-none tracking-normal lowercase">cavalheiro</h3>
                        <p className="font-sans text-[9px] text-forest/90 tracking-widest uppercase font-semibold pt-1">educação relacional</p>
                      </div>
                    </div>
                    
                    <div className="text-center font-serif text-xs italic text-sand-deep/80 border-t border-plum-brand/20 pt-4">
                      “Antes da reação, existem sinais.”
                    </div>
                  </div>
                ) : (
                  <img 
                    src={ericoPhoto} 
                    alt="Érico Cavalheiro" 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
                    referrerPolicy="no-referrer"
                    id="erico-photo-media"
                    onError={() => setUseFallback(true)}
                  />
                )}
                
                {/* Visual badge overlay */}
                <div className="absolute top-4 left-4 bg-charcoal/90 backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-forest animate-pulse" />
                  <span className="font-sans text-[10px] font-bold text-sand tracking-widest uppercase">
                    Psicólogo de Formação
                  </span>
                </div>
              </div>

              {/* Decorative tag hanging out of the frame */}
              <div className="absolute -bottom-6 -right-4 bg-gradient-clay text-charcoal px-4 py-2 font-display text-[10px] font-bold tracking-widest uppercase rounded shadow-soft">
                Educação Relacional
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy with Authority and Statistics */}
          <div className="lg:col-span-7 order-1 lg:order-2 text-left" id="about-info-column">
            
            <span className="font-sans text-xs uppercase tracking-widest font-bold text-peach mb-3 block reveal">
              SOBRE
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] text-ivory font-bold leading-tight mb-6 reveal delay-100" id="about-headline">
              Um olhar que começa no humano.
            </h2>

            <p className="font-sans text-base sm:text-lg text-sand/95 leading-relaxed mb-6 font-medium reveal delay-200" id="about-main-lead">
              Érico Cavalheiro é psicólogo de formação e estudioso do comportamento humano.
            </p>

            <blockquote className="border-l-2 border-forest pl-4 py-1.5 mb-6 bg-forest-deep/10 pr-4 rounded-r-md reveal delay-300">
              <p className="font-sans text-sm sm:text-base text-sand/80 leading-relaxed font-light">
                Sua curiosidade sempre esteve voltada para aquilo que acontece entre o gesto, o hábito e a resposta. Ao observar as relações entre tutores e cães, percebeu que muitos conflitos não nascem da falta de afeto, mas da dificuldade de comunicação, previsibilidade e convivência.
              </p>
            </blockquote>

            <p className="font-sans text-sm sm:text-base text-sand/80 leading-relaxed mb-8 font-light reveal delay-400" id="about-text-secondary">
              A partir de estudo, prática e observação cotidiana, desenvolveu uma abordagem própria que une comportamento, vínculo e educação relacional. O foco não está apenas em ensinar cães, mas em orientar humanos a compreender, acolher, conviver, ensinar e aprender com seus companheiros caninos.
            </p>

            {/* Callout box supporting high authority */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-10 p-5 border border-plum-brand/35 bg-plum-deep/30 rounded-md reveal delay-500" id="about-qualifications">
              <div className="p-3 rounded-full bg-forest/10 text-forest shrink-0">
                <GraduationCap size={22} />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-ivory text-left">Psicologia & Convivência Saudável</h4>
                <p className="font-sans text-[12px] text-sand-deep text-left leading-normal mt-1">
                  Abordagem fundamentada no respeito absoluto à biologia canina e cognição animal, integrando psicologia humana e educação comportamental canina.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
