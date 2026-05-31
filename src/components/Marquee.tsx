import React from "react";
import { MARQUEE_WORDS } from "../data";

export const Marquee: React.FC = () => {
  // We duplicate the list to ensure infinite horizontal continuity
  const doubledWords = [...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS];

  return (
    <div
      className="bg-forest-deep py-5 border-y border-forest-deep/80 overflow-hidden relative select-none"
      id="values-marquee-bar"
    >
      {/* Decorative vertical bounds masks to soften entering text */}
      <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-charcoal to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-charcoal to-transparent z-10 pointer-events-none" />

      <div className="w-full flex" id="marquee-scrolling-viewport">
        <div className="animate-marquee flex items-center gap-14 whitespace-nowrap">
          {doubledWords.map((word, idx) => (
            <div key={idx} className="flex items-center gap-6" id={`marquee-item-${idx}`}>
              {/* Word styled in clean Impact design (Oswald-like display) */}
              <span className="font-display text-base font-bold tracking-widest text-[#E6EBE6] uppercase">
                {word}
              </span>
              {/* Beautiful brand orange dot spacer */}
              <span className="h-2 w-2 rounded-full bg-[#ED4C87] flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
