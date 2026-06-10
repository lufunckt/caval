import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cookie, X, Shield, Lock, Check, Eye } from "lucide-react";

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    performance: true,
    questionnaire: true,
  });
  const [showPolicy, setShowPolicy] = useState(false);

  useEffect(() => {
    // Check if user already gave consent
    const consent = localStorage.getItem("erico-cookie-consent");
    if (!consent) {
      // Small timeout to let the page settle before displaying
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dispatchConsentEvent = () => {
    window.dispatchEvent(new Event("erico-cookie-consent-updated"));
  };

  const handleAcceptAll = () => {
    localStorage.setItem(
      "erico-cookie-consent",
      JSON.stringify({ essential: true, performance: true, questionnaire: true, date: new Date().toISOString() })
    );
    setIsVisible(false);
    dispatchConsentEvent();
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      "erico-cookie-consent",
      JSON.stringify({ ...preferences, date: new Date().toISOString() })
    );
    setIsVisible(false);
    setShowPreferences(false);
    dispatchConsentEvent();
  };

  const handleRejectAll = () => {
    localStorage.setItem(
      "erico-cookie-consent",
      JSON.stringify({ essential: true, performance: false, questionnaire: false, date: new Date().toISOString() })
    );
    setIsVisible(false);
    setShowPreferences(false);
    dispatchConsentEvent();
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed bottom-6 left-6 right-6 md:left-[initial] md:right-8 md:max-w-md z-45 bg-[#1a1120] border border-[#63526e]/30 text-[#fcf3e3] p-5 sm:p-6 rounded-2xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md"
            id="cookie-consent-banner"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-[#d5ab70]/10 text-[#d5ab70] rounded-xl shrink-0" id="cookie-icon-wrapper">
                <Cookie size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-base font-bold tracking-tight text-[#fcf3e3]" id="cookie-banner-title">
                  Nós respeitamos sua privacidade
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#fcf3e3]/85 leading-relaxed mt-1.5" id="cookie-banner-desc">
                  Utilizamos cookies e tecnologias semelhantes para melhorar sua jornada no site, salvar escolhas do tema visual, e fixar suas respostas no diagnóstico do cão.
                </p>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-[#fcf3e3]/40 hover:text-[#fcf3e3] p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title="Fechar temporariamente"
                aria-label="Dispensar aviso de cookies"
                id="close-cookie-banner"
              >
                <X size={16} />
              </button>
            </div>

            {/* Custom preferences check options panel */}
            <AnimatePresence>
              {showPreferences && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-white/10 space-y-3 overflow-hidden"
                  id="cookie-preferences-panel"
                >
                  <p className="font-sans text-[10px] uppercase tracking-widest text-[#d5ab70] font-bold">
                    Personalizar Preferências
                  </p>

                  <div className="space-y-2.5">
                    {/* Essential (Fixed) */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/15 border border-white/5">
                      <div>
                        <p className="font-serif text-xs font-bold text-ivory flex items-center gap-1.5">
                          <Lock size={12} className="text-[#6cbaa4]" /> Essenciais (Obrigatório)
                        </p>
                        <p className="font-sans text-[10px] text-sand-deep/90">Tema visual do tutor e sessões locais.</p>
                      </div>
                      <span className="text-[10px] font-sans font-semibold text-[#6cbaa4] uppercase bg-[#6cbaa4]/10 px-2 py-0.5 rounded-full">Ativo</span>
                    </div>

                    {/* Questionnaire Progress */}
                    <label 
                      className="flex items-center justify-between p-2 rounded-lg bg-black/15 border border-white/5 hover:border-[#63526e]/45 cursor-pointer transition-colors"
                      htmlFor="pref-questionnaire"
                    >
                      <div>
                        <p className="font-serif text-xs font-bold text-ivory">Diagnóstico e Formulário</p>
                        <p className="font-sans text-[10px] text-sand-deep/90">Registra seu progresso passo-a-passo.</p>
                      </div>
                      <input
                        type="checkbox"
                        id="pref-questionnaire"
                        checked={preferences.questionnaire}
                        onChange={(e) => setPreferences({ ...preferences, questionnaire: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-[#d5ab70] focus:ring-[#d5ab70] accent-[#d5ab70] cursor-pointer"
                      />
                    </label>

                    {/* Performance */}
                    <label 
                      className="flex items-center justify-between p-2 rounded-lg bg-black/15 border border-white/5 hover:border-[#63526e]/45 cursor-pointer transition-colors"
                      htmlFor="pref-performance"
                    >
                      <div>
                        <p className="font-serif text-xs font-bold text-ivory">Métricas e Desempenho</p>
                        <p className="font-sans text-[10px] text-sand-deep/90">Otimizações e estabilidade do portal.</p>
                      </div>
                      <input
                        type="checkbox"
                        id="pref-performance"
                        checked={preferences.performance}
                        onChange={(e) => setPreferences({ ...preferences, performance: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-[#d5ab70] focus:ring-[#d5ab70] accent-[#d5ab70] cursor-pointer"
                      />
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs pt-4 border-t border-white/5" id="cookie-actions-row">
              <button
                onClick={() => setShowPolicy(true)}
                className="font-sans font-medium text-sand-deep hover:text-ivory inline-flex items-center gap-1 transition-colors cursor-pointer"
                id="trigger-privacy-policy"
              >
                <Shield size={12} />
                <span>Privacidade de Dados</span>
              </button>

              <div className="flex items-center gap-2">
                {!showPreferences ? (
                  <>
                    <button
                      onClick={() => setShowPreferences(true)}
                      className="font-sans font-semibold text-sand hover:text-ivory px-3 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                      id="cookie-pref-trigger"
                    >
                      Preferências
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="font-sans font-bold uppercase tracking-wider bg-[#d5ab70] hover:bg-[#c99f63] text-charcoal px-4 py-2.5 rounded-lg transition-colors cursor-pointer shadow-soft"
                      id="cookie-accept-all"
                    >
                      Aceitar tudo
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleRejectAll}
                      className="font-sans font-semibold text-rose-brand/90 hover:text-rose-brand px-3 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                      id="cookie-reject-all"
                    >
                      Apenas Mínimos
                    </button>
                    <button
                      onClick={handleSavePreferences}
                      className="font-sans font-bold uppercase tracking-wider bg-forest hover:bg-forest/90 text-charcoal px-4 py-2.5 rounded-lg transition-colors cursor-pointer shadow-soft"
                      id="cookie-save-pref"
                    >
                      Salvar Opções
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern, elegant full policy reading modal */}
      <AnimatePresence>
        {showPolicy && (
          <div className="fixed inset-0 bg-[#0e0712]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" id="policy-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#1f1725] border border-[#63526e]/30 px-6 py-7 sm:p-8 rounded-2xl max-w-2xl w-full text-left shadow-2xl relative max-h-[85vh] flex flex-col"
              id="privacy-policy-modal"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-forest/10 text-forest rounded-lg">
                    <Shield size={18} />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-ivory">Declaração de Privacidade e Termos de Uso</h3>
                </div>
                <button
                  onClick={() => setShowPolicy(false)}
                  className="text-sand/50 hover:text-ivory bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-colors cursor-pointer"
                  aria-label="Fechar declaração de privacidade"
                  id="close-policy-modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Policy statement body text */}
              <div className="flex-1 overflow-y-auto pr-1 py-5 space-y-4 font-sans text-xs sm:text-sm text-sand/90 leading-relaxed scrollbar-thin">
                <div>
                  <h4 className="font-serif text-sm font-bold text-ivory flex items-center gap-1.5 mb-1">
                    <Check size={14} className="text-forest shrink-0" /> 1. Compromisso com o Vínculo Ético
                  </h4>
                  <p>
                    Acreditamos que a educação canina se baseia em confiança, honestidade e respeito. O mesmo compromisso se aplica aos seus dados pessoais. Respeitamos as restrições da LGPD (Lei Geral de Proteção de Dados) e todos os princípios de minimização.
                  </p>
                </div>

                <div>
                  <h4 className="font-serif text-sm font-bold text-ivory flex items-center gap-1.5 mb-1">
                    <Check size={14} className="text-forest shrink-0" /> 2. Coleta de Informações e Quiz Diagnóstico
                  </h4>
                  <p>
                    Ao utilizar o nosso formulário diagnótico sobre o seu cão, todas as respostas (idade, raça, problemas comportamentais selecionados, observações) permanecem armazenadas no armazenamento temporário do seu próprio navegador (local storage) para evitar perda de rascunhos.
                  </p>
                  <p className="mt-1">
                    No momento da submissão com seu consentimento, estes dados são salvos de forma segura em nossa base privada (Firebase Firestore) conectada para possibilitar a entrega de um dossiê terapêutico canino preciso com o tutor integrador caso você opte por enviar o caso diretamente para atendimento de Érico.
                  </p>
                </div>

                <div>
                  <h4 className="font-serif text-sm font-bold text-ivory flex items-center gap-1.5 mb-1">
                    <Check size={14} className="text-forest shrink-0" /> 3. Integração com WhatsApp e Consultorias
                  </h4>
                  <p>
                    Seus dados de diagnóstico e relato comportamental não são, sob qualquer hipótese, cedidos, vendidos ou compartilhados com terceiros sob fins publicitários ou comerciais de qualquer natureza. O WhatsApp serve estritamente como ponte direta de atendimento personalizada.
                  </p>
                </div>

                <div>
                  <h4 className="font-serif text-sm font-bold text-ivory flex items-center gap-1.5 mb-1">
                    <Check size={14} className="text-forest shrink-0" /> 4. Uso de Cookies e Preferências
                  </h4>
                  <p>
                    Os cookies são pequenos arquivos que nos auxiliam a salvar sua opção de tema (como o Modo Escuro ou Modo Claro) e acompanhar suas conquistas dentro da Área do Tutor. Você tem controle total e autonomia para desabilitá-los usando o painel de preferências a qualquer momento.
                  </p>
                </div>

                <div>
                  <h4 className="font-serif text-sm font-bold text-ivory flex items-center gap-1.5 mb-1">
                    <Check size={14} className="text-forest shrink-0" /> 5. Direitos do Tutor Titular
                  </h4>
                  <p>
                    Você pode, a qualquer tempo, apagar o cache e cookies do navegador para revogar as permissões, ou entrar em contato conosco diretamente pelo canal oficial de WhatsApp para solicitar a retirada ou expurgação de qualquer relato diagnótico inserido anteriormente.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end shrink-0">
                <button
                  onClick={() => setShowPolicy(false)}
                  className="font-sans font-bold uppercase tracking-wider bg-ivory text-charcoal px-5 py-3 rounded-lg hover:bg-white transition-colors cursor-pointer text-xs"
                  id="confirm-policy"
                >
                  Entendi e Aceito os Termos
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
