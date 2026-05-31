import React, { useState, useEffect } from "react";
import { CONFIG } from "../config";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show a helpful conversion tooltip 3 seconds after the page loads
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);

    // Auto fade-out the tooltip after 10 seconds of visibility to avoid intrusive UI
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 14000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end pointer-events-none" id="floating-whatsapp-wrapper">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-3 max-w-[250px] bg-[#22162a] border border-[#63526E]/40 text-[#FCF3E3] p-3 rounded-xl shadow-xl pointer-events-auto flex items-start gap-2.5 relative"
            id="whatsapp-floating-tooltip"
          >
            {/* Tiny arrow pointing down to the button */}
            <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-[#22162a] border-r border-b border-[#63526E]/40 rotate-45" />
            
            <div className="flex-1 text-xs">
              <p className="font-sans font-semibold text-[#6CBAA4] mb-0.5">Érico Cavalheiro</p>
              <p className="font-sans text-[#FCF3E3]/80 leading-snug">
                Fale comigo agora e tire suas dúvidas sobre a educação do seu cão.
              </p>
            </div>
            <button 
              onClick={() => setShowTooltip(false)}
              className="text-[#FCF3E3]/40 hover:text-[#FCF3E3] text-[10px] uppercase font-bold p-0.5"
              title="Fechar"
              aria-label="Fechar dica"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Button */}
      <motion.a
        href={CONFIG.WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#6CBAA4] text-[#160E1A] shadow-lg hover:shadow-xl transition-all duration-300 group"
        aria-label="Falar no WhatsApp"
        id="whatsapp-floating-trigger"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Subtle background pulsing rings */}
        <span className="absolute inset-0 rounded-full bg-[#6CBAA4]/40 animate-ping opacity-75 group-hover:animate-none pointer-events-none" />
        
        {/* Elegant WhatsApp SVG Icon for ultimate visual match */}
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="h-7 w-7 sm:h-8 sm:w-8 transition-transform duration-300 group-hover:rotate-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </motion.a>
    </div>
  );
};
