import React, { useState, useEffect, useRef } from "react";
import { CONFIG } from "../config";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Square, Trash2, Send, X, Volume2, Sparkles, Check, Play, CornerDownRight } from "lucide-react";

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcriptionText, setTranscriptionText] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Suggested transcriptions matching our dog behavioral topic
  const transcriptionPhrases = [
    { time: 1, text: "Olá Érico..." },
    { time: 3, text: "Olá Érico, gostaria de tirar uma dúvida rápida..." },
    { time: 6, text: "Olá Érico, gostaria de tirar uma dúvida rápida sobre a educação do meu cão que está pulando nas visitas e latindo muito..." },
    { time: 10, text: "Olá Érico, gostaria de tirar uma dúvida rápida sobre a educação do meu cão que está pulando nas visitas e latindo muito. Como posso começar a aplicar a Educação Relacional dele?" }
  ];

  useEffect(() => {
    if (isRecording) {
      // Start stopwatch timer
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          const nextSec = prev + 1;
          
          // Match matching transcriptions progressively
          const match = [...transcriptionPhrases]
            .reverse()
            .find((phrase) => nextSec >= phrase.time);
          if (match) {
            setTranscriptionText(match.text);
          }

          // Auto-stop at 12 seconds
          if (nextSec >= 12) {
            handleStopRecording();
            return 12;
          }
          return nextSec;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setRecordingSeconds(0);
    setTranscriptionText("Sintonizando seu microfone... Comece a falar!");
    setIsRecording(true);
    setIsFinishing(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsFinishing(true);
    // If user stopped too early, guarantee a friendly default question
    if (recordingSeconds < 2) {
      setTranscriptionText("Olá Érico, gostaria de tirar uma dúvida rápida para entender a Educação Relacional com meu cão!");
    }
  };

  const handleReset = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
    setTranscriptionText("");
    setIsFinishing(false);
  };

  const handleClose = () => {
    handleReset();
    setIsOpen(false);
  };

  const handleSendToWhatsApp = () => {
    // Format message with custom voice note simulation marker
    const finalMsg = `🎙️ [Mensagem de Voz Convertida]: "${transcriptionText}"`;
    const whatsappUrl = `https://wa.me/5555997240369?text=${encodeURIComponent(finalMsg)}`;
    window.open(whatsappUrl, "_blank");
    handleClose();
  };

  // Convert timer seconds to a nice clock display
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end pointer-events-none" id="floating-whatsapp-wrapper">
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
        {/* Elegant Hover Tooltip */}
        <div 
          className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-[#22162a] border border-[#63526E]/40 text-[#FCF3E3] rounded-lg text-xs font-sans font-medium whitespace-nowrap shadow-xl pointer-events-none opacity-0 translate-y-1 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-300"
          id="whatsapp-floating-tooltip"
        >
          Fale comigo no WhatsApp
          {/* Subtle pointing arrow */}
          <div className="absolute bottom-[-5px] right-[24px] sm:right-[28px] w-2.5 h-2.5 bg-[#22162a] border-r border-b border-[#63526E]/40 rotate-45" />
        </div>

        {/* Subtle background pulsing rings */}
        <span className="absolute inset-0 rounded-full bg-[#6CBAA4]/40 animate-ping opacity-75 group-hover:animate-none pointer-events-none" />
        
        {/* Elegant WhatsApp SVG Icon for ultimate visual match */}
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="h-7 w-7 sm:h-8 sm:w-8 transition-all duration-200 group-hover:rotate-6 group-active:scale-85 group-active:text-[#22162a]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>

        {/* Small Microphone Button overlay inside trigger */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
            handleStartRecording();
          }}
          className="absolute -bottom-1 -right-1 bg-[#22162a] hover:bg-[#342240] text-[#6CBAA4] border border-[#6CBAA4]/50 rounded-full p-1.5 focus:outline-none shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
          title="Dúvida Rápida por Voz"
          aria-label="Gravar mensagem de voz para o WhatsApp"
          id="whatsapp-mic-button-badge"
        >
          <Mic size={11} className="animate-pulse text-[#6CBAA4]" />
        </button>
      </motion.a>

      {/* Voice Recorder Simulation Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="pointer-events-auto fixed bottom-24 right-6 sm:bottom-28 sm:right-8 w-[320px] sm:w-[350px] bg-[#1a1120]/95 border border-[#63526E]/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 text-[#FCF3E3] backdrop-blur-md z-50 flex flex-col gap-4"
            id="voice-recorder-overlay"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#6CBAA4]/15 rounded-lg text-[#6CBAA4]">
                  <Mic size={14} className={isRecording ? "animate-[pulse_1s_infinite]" : ""} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold tracking-tight">Dúvida Rápida por Voz</h4>
                  <p className="font-sans text-[10px] text-gray-400">Gravando e convertendo em texto</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-[#FCF3E3]/40 hover:text-[#FCF3E3] p-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                title="Fechar gravador"
              >
                <X size={15} />
              </button>
            </div>

            {/* Recorder Body */}
            <div className="space-y-4">
              {/* Pulsating Waveform Graphic during recording */}
              <div className="bg-black/20 rounded-xl p-3 flex flex-col items-center justify-center gap-2.5 min-h-[90px] border border-white/5">
                {isRecording ? (
                  <>
                    <div className="flex items-end justify-center gap-1.5 h-8">
                      <div className="w-1 bg-[#6CBAA4] rounded-full animate-[bounce_0.8s_infinite_100ms] h-3" />
                      <div className="w-1 bg-[#6CBAA4] rounded-full animate-[bounce_0.8s_infinite_300ms] h-6" />
                      <div className="w-1 bg-[#d5ab70] rounded-full animate-[bounce_0.8s_infinite_500ms] h-4" />
                      <div className="w-1 bg-[#6CBAA4] rounded-full animate-[bounce_0.8s_infinite_200ms] h-8" />
                      <div className="w-1 bg-[#6CBAA4] rounded-full animate-[bounce_0.8s_infinite_400ms] h-5" />
                      <div className="w-1 bg-[#d5ab70] rounded-full animate-[bounce_0.8s_infinite_600ms] h-7" />
                      <div className="w-1 bg-[#6CBAA4] rounded-full animate-[bounce_0.8s_infinite_150ms] h-2" />
                    </div>
                    <span className="font-mono text-sm tracking-wider text-[#6CBAA4] font-semibold">
                      {formatTime(recordingSeconds)}
                    </span>
                  </>
                ) : isFinishing ? (
                  <div className="flex flex-col items-center gap-1.5 text-center px-2">
                    <div className="p-2 bg-[#6CBAA4]/20 rounded-full text-[#6CBAA4]">
                      <Check size={18} />
                    </div>
                    <span className="font-serif text-xs font-bold text-white flex items-center gap-1">
                      <Sparkles size={11} className="text-[#d5ab70] animate-pulse" />
                      Áudio Transcrito com Sucesso!
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-[#FCF3E3]/60">
                    <Play size={20} className="text-gray-400" />
                    <span className="font-sans text-xs">Pronto para gravar dúvidas</span>
                  </div>
                )}
              </div>

              {/* Dynamic Speech to Text screen container */}
              <div className="bg-[#150e19] rounded-xl p-3 border border-[#63526E]/20">
                <span className="text-[9px] uppercase tracking-wider text-[#d5ab70] font-bold block mb-1">
                  Transcrição em Tempo Real
                </span>
                
                {isRecording || isFinishing ? (
                  <textarea
                    value={transcriptionText}
                    onChange={(e) => setTranscriptionText(e.target.value)}
                    disabled={isRecording}
                    className="w-full bg-transparent resize-none border-none focus:outline-none focus:ring-0 text-xs text-gray-100 font-sans leading-relaxed min-h-[60px] p-0"
                    placeholder="Sintonizando áudio..."
                  />
                ) : (
                  <p className="text-xs text-gray-500 font-sans italic min-h-[60px] flex items-center justify-center">
                    Sua fala será convertida aqui em poucos segundos.
                  </p>
                )}
                
                {isFinishing && (
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                    <span>Você pode editar o texto se desejar</span>
                    <span className="font-mono">{formatTime(recordingSeconds)} gravados</span>
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Action Controller Buttons */}
            <div className="flex items-center justify-between gap-2.5 pt-2">
              {isRecording ? (
                <>
                  <button
                    onClick={handleReset}
                    className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-rose-400 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-sans font-medium"
                    title="Descartar gravação"
                  >
                    <Trash2 size={13} />
                    Cancelar
                  </button>
                  <button
                    onClick={handleStopRecording}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider"
                  >
                    <Square size={13} fill="currentColor" />
                    Parar Gravação
                  </button>
                </>
              ) : isFinishing ? (
                <>
                  <button
                    onClick={handleStartRecording}
                    className="p-2.5 rounded-lg bg-white/5 hover:bg-[#6CBAA4]/15 hover:text-[#6CBAA4] text-gray-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-sans font-medium"
                  >
                    Gravar De Novo
                  </button>
                  <button
                    onClick={handleSendToWhatsApp}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-[#6CBAA4] hover:bg-[#59a38f] text-[#160E1A] transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs font-sans font-bold uppercase tracking-wider shadow-lg"
                  >
                    <Send size={13} />
                    Enviar WhatsApp
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStartRecording}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#6CBAA4] hover:bg-[#59a38f] text-[#160E1A] transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs font-sans font-bold uppercase tracking-wider"
                >
                  <Mic size={14} />
                  Iniciar Nova Gravação
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

