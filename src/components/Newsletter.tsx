import React, { useState } from "react";
import { Mail, CheckCircle2, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const validateEmail = (val: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setStatus("error");
      setMessage("Por favor, digite um endereço de e-mail.");
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setStatus("error");
      setMessage("O formato deste e-mail parece inválido. Exemplo: seu@email.com");
      return;
    }

    setStatus("loading");
    setMessage("");

    // Simulate standard server/database network delay
    setTimeout(() => {
      // Check for hypothetical duplicates in local storage for a richer functional prototype
      try {
        const key = "erico_newsletter_subscribers";
        const currentList: string[] = JSON.parse(localStorage.getItem(key) || "[]");
        
        if (currentList.includes(cleanEmail.toLowerCase())) {
          setStatus("error");
          setMessage("Este e-mail já está inscrito em nossa lista de percepções.");
          return;
        }

        currentList.push(cleanEmail.toLowerCase());
        localStorage.setItem(key, JSON.stringify(currentList));
        
        setStatus("success");
        setEmail("");
      } catch (err) {
        // Fallback gracefully If localStorage fails
        setStatus("success");
        setEmail("");
      }
    }, 1200);
  };

  return (
    <section 
      className="relative py-16 px-6 bg-charcoal border-t border-plum-brand/20 overflow-hidden" 
      id="newsletter-insights-section"
    >
      {/* Sutil background light effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-plum-brand/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10" id="newsletter-container">
        <div 
          className="bg-plum-deep/40 rounded-2xl border border-plum-brand/25 p-8 md:p-12 text-center relative overflow-hidden shadow-lift reveal"
          id="newsletter-card"
        >
          {/* Accent decoration inside card */}
          <div className="absolute top-0 left-12 w-24 h-px bg-gradient-to-r from-transparent via-peach/30 to-transparent" />
          
          <div className="max-w-2xl mx-auto" id="newsletter-content-wrapper">
            
            {/* Newsletter Badge Icon */}
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-peach/10 text-peach mb-5" id="newsletter-badge">
              <Mail size={22} className="stroke-[1.75]" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ivory mb-3" id="newsletter-title">
              Cartas Relacionais de Érico
            </h3>
            
            <p className="font-sans text-xs sm:text-sm text-sand/85 leading-relaxed mb-8 max-w-lg mx-auto" id="newsletter-description">
              Receba semanalmente nossas percepções, reflexões cotidianas e orientações sobre convivência, comunicação e vínculo verdadeiro com seu cão. Escrevemos para humanos que desejam aprender.
            </p>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-forest/10 border border-forest/35 rounded-xl p-6 text-center max-w-md mx-auto"
                  id="newsletter-success-box"
                >
                  <div className="flex justify-center text-forest mb-3">
                    <CheckCircle2 size={36} className="animate-pulse" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-ivory mb-1">
                    Inscrição Confirmada!
                  </h4>
                  <p className="font-sans text-xs text-sand-deep leading-relaxed">
                    Você começará a receber nossas percepções semanais. Seja bem-vindo à nossa comunidade com foco em educação relacional.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 text-[10px] font-sans font-bold tracking-wider text-peach hover:text-peach/85 uppercase transition-colors"
                    id="newsletter-back-button"
                  >
                    Cadastrar outro e-mail
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <form 
                    onSubmit={handleSubmit} 
                    className="flex flex-col sm:flex-row items-stretch gap-3 max-w-lg mx-auto mb-3"
                    id="newsletter-form"
                    noValidate
                  >
                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === "error") setStatus("idle");
                        }}
                        placeholder="Seu melhor e-mail"
                        disabled={status === "loading"}
                        className={`w-full h-12 pl-11 pr-4 bg-charcoal/80 text-ivory border text-sm rounded-sm font-sans focus:outline-none transition-all ${
                          status === "error" 
                            ? "border-rose-brand/70 focus:border-rose-brand focus:ring-1 focus:ring-rose-brand/30" 
                            : "border-plum-brand/40 focus:border-peach focus:ring-1 focus:ring-peach/30"
                        } placeholder:text-sand-deep/60`}
                        id="newsletter-email-input"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sand-deep/60">
                        <Mail size={16} />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="h-12 px-6 bg-ivory border border-plum-brand/20 hover:opacity-90 active:scale-[0.98] text-charcoal font-sans text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
                      id="newsletter-submit-button"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-charcoal" />
                          <span>Inscrevendo...</span>
                        </>
                      ) : (
                        <>
                          <span>Receber insights</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Accessible validation message */}
                  <AnimatePresence>
                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center justify-center gap-1.5 text-rose-brand text-xs font-sans mt-2"
                        id="newsletter-error-message"
                      >
                        <AlertCircle size={13} className="shrink-0" />
                        <span>{message}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Privacy Promise */}
            <p className="font-sans text-[10px] text-sand-deep/60 mt-4" id="newsletter-policy-note">
              Respeitamos seu tempo. Sem spam. Cancele sua inscrição quando desejar com um clique.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
};
