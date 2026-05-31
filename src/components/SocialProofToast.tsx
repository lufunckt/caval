import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, Sparkles, MessageSquare } from "lucide-react";

interface SocialProofEvent {
  id: string;
  name: string;
  location: string;
  action: string;
  timeAgo: string;
}

const EVENTS: SocialProofEvent[] = [
  {
    id: "1",
    name: "Juliana Santos",
    location: "São Paulo - SP",
    action: "agendou uma Consultoria Premium Presencial para seu cão",
    timeAgo: "há 3 minutos",
  },
  {
    id: "2",
    name: "Thiago G.",
    location: "Campinas - SP",
    action: "adquiriu o E-book Guia de Educação Relacional",
    timeAgo: "há 10 minutos",
  },
  {
    id: "3",
    name: "Gabriela Becker",
    location: "Florianópolis - SC",
    action: "agendou uma Mentoria Estratégica Online",
    timeAgo: "há 25 minutos",
  },
  {
    id: "4",
    name: "Felipe Almeida",
    location: "Curitiba - PR",
    action: "finalizou o Questionário de Avaliação de Perfil de Convivência",
    timeAgo: "há 12 minutos",
  },
  {
    id: "5",
    name: "Mariana Costa",
    location: "Rio de Janeiro - RJ",
    action: "agendou uma Reabilitação de Reatividade e Medo",
    timeAgo: "há 5 minutos",
  },
  {
    id: "6",
    name: "Rodrigo M.",
    location: "Belo Horizonte - MG",
    action: "garantiu o E-book Guia de Educação Relacional",
    timeAgo: "há 18 minutos",
  },
  {
    id: "7",
    name: "Beatriz Ribeiro",
    location: "Porto Alegre - RS",
    action: "agendou uma Consultoria Premium Presencial",
    timeAgo: "há 1 hora",
  },
  {
    id: "8",
    name: "Aline Viana",
    location: "Santos - SP",
    action: "completou o Questionário de Triagem Comportamental",
    timeAgo: "há 7 minutos",
  },
  {
    id: "9",
    name: "Lucas Fernandes",
    location: "Santo André - SP",
    action: "agendou uma Consultoria Presencial",
    timeAgo: "há 40 minutos",
  },
];

export const SocialProofToast: React.FC = () => {
  const [currentEvent, setCurrentEvent] = useState<SocialProofEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const eventIndexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to show the next toast event
  const showNextToast = () => {
    // Clear any previous timers
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);

    const nextIndex = (eventIndexRef.current + 1) % EVENTS.length;
    eventIndexRef.current = nextIndex;

    // Pick a slightly shuffled order or sequential
    const event = EVENTS[nextIndex];
    setCurrentEvent(event);
    setIsVisible(true);

    // Auto-dismiss after 6 seconds if not hovered
    dismissTimerRef.current = setTimeout(() => {
      if (!isHovered) {
        setIsVisible(false);
      }
    }, 6000);
  };

  // Setup loop
  useEffect(() => {
    // Show first toast after 4 seconds
    const initialDelay = setTimeout(() => {
      showNextToast();
    }, 4000);

    // Cycle every 25 seconds
    const intervalTimer = setInterval(() => {
      if (!isVisible && !isHovered) {
        showNextToast();
      }
    }, 25000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(intervalTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [isVisible, isHovered]);

  // Handle auto-dismiss when mouse leaves, if it was hovered and expired
  const handleMouseLeave = () => {
    setIsHovered(false);
    // If visible, reset the dismiss countdown to close shortly after hover leaves
    if (isVisible) {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && currentEvent && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="fixed bottom-6 left-6 z-50 w-[calc(100vw-3rem)] sm:w-80 md:w-[360px] bg-charcoal/95 backdrop-blur-md border border-forest/30 hover:border-peach/50 p-4 rounded-xl shadow-lift flex items-start gap-3.5 group select-none transition-colors duration-300"
          id={`social-proof-toast-${currentEvent.id}`}
        >
          {/* Accent Glowing Aura */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-forest/10 via-peach/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Left Avatar / Icon indicator */}
          <div className="relative h-10 w-10 rounded-full bg-forest-deep/30 flex items-center justify-center shrink-0 border border-forest/20 text-forest" id="toast-brand-icon-wrapper">
            <Sparkles size={16} className="animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-peach border-2 border-charcoal" />
          </div>

          {/* Details Content Box */}
          <div className="flex-1 text-left min-w-0" id="toast-content-wrapper">
            <div className="flex items-center justify-between gap-2" id="toast-header">
              <span className="font-sans text-[11px] font-bold text-sand tracking-wide truncate">
                {currentEvent.name}
              </span>
              <span className="font-sans text-[10px] text-sand-deep shrink-0">
                {currentEvent.location}
              </span>
            </div>

            <p className="font-sans text-xs text-sand-deep leading-relaxed mt-1" id="toast-body">
              {currentEvent.action.split(" ").map((word, i) => {
                // Emphasize important terms
                const matchesEmphasis = [
                  "Consultoria",
                  "Presencial",
                  "E-book",
                  "Educação",
                  "Relacional",
                  "Mentoria",
                  "Estratégica",
                  "Reabilitação",
                  "Reatividade",
                  "Questionário",
                  "Avaliação"
                ].some(term => word.includes(term));

                return (
                  <span key={i} className={matchesEmphasis ? "text-peach font-semibold" : "text-sand/85"}>
                    {word}{" "}
                  </span>
                );
              })}
            </p>

            <div className="flex items-center gap-1.5 mt-2" id="toast-metadata">
              <CheckCircle2 size={10} className="text-forest" />
              <span className="font-sans text-[9px] uppercase tracking-wider text-forest font-semibold">
                Verificado
              </span>
              <span className="text-[10px] text-zinc-600">•</span>
              <span className="font-sans text-[9px] text-sand-deep font-light">
                {currentEvent.timeAgo}
              </span>
            </div>
          </div>

          {/* Close button styling */}
          <button
            onClick={handleClose}
            className="p-1 text-sand-deep hover:text-ivory rounded-full hover:bg-white/5 transition-colors duration-200 shrink-0"
            aria-label="Dispensar notificação"
            id="toast-close-btn"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
