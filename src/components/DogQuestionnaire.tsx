import React, { useState } from "react";
import { Dog, ArrowRight, ArrowLeft, Send, CheckCircle2, ShieldAlert, Sparkles, MessageSquare } from "lucide-react";

interface DiagnosticsState {
  dogName: string;
  dogAge: string;
  dogBreed: string;
  primaryIssue: string;
  intensity: "leve" | "moderada" | "grave";
  additionalNotes: string;
}

const DEFAULT_STATE: DiagnosticsState = {
  dogName: "",
  dogAge: "",
  dogBreed: "",
  primaryIssue: "",
  intensity: "moderada",
  additionalNotes: ""
};

const ISSUES = [
  { id: "reactivity", label: "Reatividade / Agressão na rua", desc: "Avança, late, rosna para outros cães ou pessoas ao passear." },
  { id: "separation_anxiety", label: "Ansiedade de Separação", desc: "Uiva, destrói portas/móveis ou chora compulsivamente sozinho." },
  { id: "excessive_excitement", label: "Agitação extrema & Puxar guia", desc: "Puxa demais a guia, pula nas pessoas e não foca em você." },
  { id: "puppy_frustration", label: "Mordidas de Filhote & Higiene", desc: "Dentes na calça/mão, xixi e cocô fora do lugar." },
  { id: "fears_phobias", label: "Medos intensos ou Fobias", desc: "Pânico de barulhos, fogos, ou tremores ao sair de casa." }
];

export const DogQuestionnaire: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<DiagnosticsState>(DEFAULT_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [errorVal, setErrorVal] = useState("");

  const handleNext = () => {
    if (step === 1 && !form.dogName.trim()) {
      setErrorVal("Por favor, digite o nome do seu cão para prosseguirmos.");
      return;
    }
    if (step === 2 && !form.primaryIssue) {
      setErrorVal("Por favor, selecione o comportamento primário que deseja diagnosticar.");
      return;
    }
    setErrorVal("");
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setErrorVal("");
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleIssueSelect = (id: string) => {
    setErrorVal("");
    setForm((prev) => ({ ...prev, primaryIssue: id }));
  };

  const selectedIssueDetails = ISSUES.find((i) => i.id === form.primaryIssue);

  // Generates beautifully written, formatted custom text for whatsapp sending
  const handleComposeWhatsappMessage = () => {
    const issueLabel = selectedIssueDetails?.label || "Comportamento Incomum";
    const uppercaseIntensity = form.intensity.toUpperCase();
    
    const message = `Olá Érico, acabei de realizar o questionário diagnóstico no seu site para o meu cão!\n\n` +
      `🐾 *PERFIL DO CÃO* 🐾\n` +
      `• *Nome:* ${form.dogName}\n` +
      `• *Idade:* ${form.dogAge || "Não especificada"}\n` +
      `• *Raça:* ${form.dogBreed || "Não especificada/SDR"}\n\n` +
      `⚠️ *COMPORTAMENTO DIAGNOSTICADO* ⚠️\n` +
      `• *Problema Principal:* ${issueLabel}\n` +
      `• *Grau de Intensidade:* ${uppercaseIntensity}\n` +
      `• *Relato Prático:* "${form.additionalNotes || "Sem observações adicionais."}"\n\n` +
      `Gostaria de agendar uma consulta inicial para entendermos as causas e aplicar o Método de Educação Relacional.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5511988887777?text=${encodedMessage}`, "_blank");
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(DEFAULT_STATE);
    setStep(1);
    setSubmitted(false);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-24 bg-charcoal relative border-t border-white/5" id="dog-questionnaire-section">
      {/* Decorative premium radial circles */}
      <div className="absolute bottom-0 left-1/3 w-80 h-80 border border-peach/5 rounded-full blur-3xl bg-peach/2 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10" id="questionnaire-container">
        
        {/* Header Block */}
        <div className="max-w-2xl mx-auto mb-16 text-center reveal" id="questionnaire-header">
          <span className="font-sans text-xs uppercase tracking-widest font-bold text-peach mb-3 inline-block">
            QUERO CONHECER A SUA HISTÓRIA
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] text-ivory font-bold leading-tight mb-4" id="questionnaire-title">
            Diagnóstico de Desbravamento Comportamental
          </h2>
          <p className="font-sans text-base text-sand/80 max-w-lg mx-auto" id="questionnaire-subtitle">
            Relate em 4 passos rápidos os problemas que enfrenta na convivência diária para entendermos a mente do seu cão antes de darmos o direcionamento clínico.
          </p>
        </div>

        {/* Master Quiz Card structure */}
        <div 
          className="bg-plum-deep/60 border border-plum-brand/25 rounded-2xl p-6 sm:p-10 shadow-lift max-w-2xl mx-auto relative overflow-hidden reveal delay-150"
          id="questionnaire-box"
        >
          {/* Internal watermark icon */}
          <div className="absolute right-[-20px] top-[-20px] opacity-[0.02] text-ivory pointer-events-none rotate-12">
            <Dog size={160} />
          </div>

          {submitted ? (
            /* SUBMISSION SUCCESS STATE */
            <div className="text-center py-6 space-y-8" id="submission-success-view">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-forest/10 border border-forest/30 text-forest rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle2 size={36} />
                </div>
                <div className="inline-flex items-center gap-2 border border-forest/30 bg-forest/10 px-3 py-1 rounded-full mb-3">
                  <span className="font-sans text-[10px] font-bold text-forest uppercase tracking-widest">
                    RELAÇÃO ENVIADA COM SUCESSO!
                  </span>
                </div>
                <h3 className="font-serif text-3xl text-ivory font-bold leading-tight">
                  Obrigado, tutor(a) de {form.dogName}!
                </h3>
                <p className="font-sans text-sm text-sand/80 max-w-md mx-auto mt-3 leading-relaxed">
                  O dossiê de comportamento foi estruturado com sucesso e a janela de redirecionamento do WhatsApp foi disparada. Érico analisará as nuances do comportamento do seu cão pessoalmente.
                </p>
              </div>

              {/* Quick feedback review summary container */}
              <div className="p-5 bg-black/40 border border-white/5 rounded-xl space-y-2.5 max-w-md mx-auto text-left text-xs font-sans">
                <p className="font-serif text-sm font-semibold text-peach border-b border-white/5 pb-2">
                  Dossiê Enviado:
                </p>
                <div className="flex justify-between">
                  <span className="text-sand-deep">Cão:</span>
                  <span className="text-ivory font-medium">{form.dogName} {form.dogBreed ? `(${form.dogBreed})` : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand-deep">Foco do Desbravamento:</span>
                  <span className="text-ivory font-medium">{selectedIssueDetails?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand-deep">Grau Estimado:</span>
                  <span className="text-rose-brand font-bold uppercase">{form.intensity}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={handleScrollToTop}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-clay text-charcoal text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-lg shadow-warm hover:shadow-lift transition-all duration-300"
                  id="success-btn-scroll-top"
                >
                  Voltar ao Topo
                </button>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 bg-black/20 text-sand text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-lg transition-all duration-300"
                  id="success-btn-reset"
                >
                  Responder Novamente
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Progress Indicator steps bar */}
              <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-sand-deep">
                  Passo {step} de 4
                </span>
                <div className="flex gap-1.5 h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="bg-peach rounded-full transition-all duration-500 ease-out h-full"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* Form screen renderer */}
              <div className="min-h-[260px] flex flex-col justify-between" id="questionnaire-screens-viewport">
                
                {errorVal && (
                  <div className="mb-4 p-3 bg-rose-brand/10 border border-rose-brand/35 text-rose-brand rounded-lg text-xs font-sans text-left animate-pulse" id="questionnaire-error-banner">
                    ⚠️ {errorVal}
                  </div>
                )}

                {/* STEP 1: Identification */}
                {step === 1 && (
                  <div className="space-y-6 text-left" id="step-1-elements">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-peach/10 text-peach rounded-lg"><Dog size={20} /></div>
                      <h3 className="font-serif text-xl sm:text-2xl text-ivory font-semibold">Fale-me um pouco sobre o cão</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="font-sans text-[11px] uppercase tracking-wider text-sand font-medium">Nome do seu cão *</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Toddy, Maia, Luna..."
                          value={form.dogName}
                          onChange={(e) => setForm({ ...form, dogName: e.target.value })}
                          className="bg-charcoal/50 border border-plum-brand/25 focus:border-peach/50 outline-none text-ivory font-sans text-sm rounded-lg p-3.5 transition-all text-left"
                          id="input-dog-name"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label className="font-sans text-[11px] uppercase tracking-wider text-sand font-medium">Raça (ou SDR)</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Golden, Bulldog, Sem Raça Definida..."
                          value={form.dogBreed}
                          onChange={(e) => setForm({ ...form, dogBreed: e.target.value })}
                          className="bg-charcoal/50 border border-plum-brand/25 focus:border-peach/50 outline-none text-ivory font-sans text-sm rounded-lg p-3.5 transition-all text-left"
                          id="input-dog-breed"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-[11px] uppercase tracking-wider text-sand font-medium">Idade aproximada</label>
                      <input 
                        type="text" 
                        placeholder="Ex: 8 meses, 2 anos, Filhote..."
                        value={form.dogAge}
                        onChange={(e) => setForm({ ...form, dogAge: e.target.value })}
                        className="bg-charcoal/50 border border-plum-brand/25 focus:border-peach/50 outline-none text-ivory font-sans text-sm rounded-lg p-3.5 transition-all text-left w-full sm:w-1/2"
                        id="input-dog-age"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: Main Behavioral Issue */}
                {step === 2 && (
                  <div className="space-y-4 text-left" id="step-2-elements">
                    <div className="mb-2">
                      <h3 className="font-serif text-xl sm:text-2xl text-ivory font-semibold">O que seu cão apresenta com mais intensidade?</h3>
                      <p className="font-sans text-xs text-sand-deep mt-1 leading-relaxed">Selecione o sintoma que mais atrapalha a paz do seu lar.</p>
                    </div>

                    <button className="hidden" /> {/* invisible button to avoid react warning */}
                    <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1" id="issues-list-scroll">
                      {ISSUES.map((issue) => {
                        const isSelected = form.primaryIssue === issue.id;
                        return (
                          <div
                            key={issue.id}
                            onClick={() => handleIssueSelect(issue.id)}
                            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-300 ${
                              isSelected 
                                ? "bg-peach/10 border-peach text-ivory shadow-soft" 
                                : "bg-black/20 border-white/5 hover:border-white/20 text-sand"
                            }`}
                            id={`issue-option-${issue.id}`}
                          >
                            <p className="font-serif font-bold text-sm text-ivory flex items-center gap-2">
                              {isSelected && <span className="w-1.5 h-1.5 bg-peach rounded-full" />}
                              {issue.label}
                            </p>
                            <p className="font-sans text-xs text-sand-deep font-light mt-0.5 leading-relaxed">{issue.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 3: Intensity & Text relato */}
                {step === 3 && (
                  <div className="space-y-6 text-left" id="step-3-elements">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl text-ivory font-semibold">Identifique o grau do desbravamento</h3>
                      <p className="font-sans text-xs text-sand-deep mt-1">Como você estima que seja a intensidade desse comportamento na rotina?</p>
                    </div>

                    {/* Intensity Selector visual design grids */}
                    <div className="grid grid-cols-3 gap-3" id="intensity-selectors">
                      {(["leve", "moderada", "grave"] as const).map((lvl) => {
                        const isSelected = form.intensity === lvl;
                        const metaColor = lvl === "leve" ? "text-forest border-forest" : lvl === "moderada" ? "text-peach border-peach" : "text-rose-brand border-rose-brand";
                        return (
                          <div
                            key={lvl}
                            onClick={() => setForm((prev) => ({ ...prev, intensity: lvl }))}
                            className={`p-4 rounded-xl border text-center cursor-pointer uppercase font-sans text-xs font-bold tracking-widest transition-all duration-300 select-none ${
                                isSelected 
                                  ? `bg-white/5 ${metaColor} shadow-soft scale-[1.02]` 
                                  : "bg-black/20 border-white/5 text-sand hover:border-white/10"
                            }`}
                            id={`lvl-option-${lvl}`}
                          >
                            {lvl}
                          </div>
                        );
                      })}
                    </div>

                    {/* Additional Text Notes Form entry */}
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-[11px] uppercase tracking-wider text-sand font-medium">Conte brevemente um pior momento ou exemplo:</label>
                      <textarea
                        rows={3}
                        placeholder="Ex: O Toddy avança muito forte perto do elevador ao ver cães pequenos, puxa tanto que rasga a enforcadeira física..."
                        value={form.additionalNotes}
                        onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
                        className="bg-charcoal/50 border border-plum-brand/25 focus:border-peach/50 outline-none text-ivory font-sans text-sm rounded-lg p-3.5 transition-all text-left resize-none"
                        id="textarea-dog-behavior"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: Review and Generate Direct Connection */}
                {step === 4 && (
                  <div className="text-left space-y-6" id="step-4-elements">
                    <div className="text-center sm:text-left">
                      <div className="inline-flex items-center gap-2 border border-forest/30 bg-forest/10 px-3 py-1.5 rounded-full mb-3">
                        <CheckCircle2 size={13} className="text-forest animate-pulse" />
                        <span className="font-sans text-[10px] font-bold text-forest uppercase tracking-widest">
                          PERFIL DIAGNÓSTICO MONTADO
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-semibold">Tudo pronto para enviar!</h3>
                      <p className="font-sans text-sm text-sand/80 mt-1 leading-relaxed">
                        Unimos as informações fornecidas e preparamos um dossiê clínico inicial para encaminhar ao WhatsApp de Érico.
                      </p>
                    </div>

                    {/* Generated Summary Card preview */}
                    <div className="p-5 bg-black/40 border border-white/10 rounded-xl space-y-3 font-sans text-xs sm:text-sm" id="summary-preview">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-sand-deep font-semibold">Nome do Cão:</span>
                        <span className="text-ivory font-medium font-serif italic text-base">{form.dogName}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-sand-deep font-semibold">Raça / Idade:</span>
                        <span className="text-ivory font-medium">{form.dogBreed || "Sem raça"} • {form.dogAge || "Não informada"}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-sand-deep font-semibold">Transtorno Principal:</span>
                        <span className="text-peach font-bold align-right">{selectedIssueDetails?.label}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-sand-deep font-semibold">Nível Estimado:</span>
                        <span className="text-rose-brand font-bold uppercase tracking-widest">{form.intensity}</span>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-1">
                        <span className="text-sand-deep font-semibold">Minúcia Comportamental:</span>
                        <p className="text-sand/95 italic bg-plum-deep/30 p-3 rounded border border-white/5 leading-relaxed font-light font-sans text-xs">
                          "{form.additionalNotes || "Nenhum contexto extra relatado."}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions Controller Buttons navigation */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                  {step > 1 && (
                    <button
                      onClick={handlePrev}
                      className="inline-flex items-center gap-2 uppercase font-sans text-[10px] font-bold tracking-widest text-[#B87333] hover:text-[#B87333]/80 transition-colors"
                      id="questionnaire-btn-back"
                    >
                      <ArrowLeft size={12} /> Voltar
                    </button>
                  )}
                  
                  <div className="ml-auto flex items-center gap-3">
                    {step < 4 ? (
                      <button
                        onClick={handleNext}
                        className="inline-flex items-center gap-1 bg-peach text-charcoal text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-lg hover:bg-peach/90 transition-all duration-300"
                        id="questionnaire-btn-next"
                      >
                        <span>Avançar</span> <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={handleComposeWhatsappMessage}
                        className="inline-flex items-center gap-2 bg-gradient-clay text-charcoal text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-lg shadow-warm hover:shadow-lift transition-all duration-300 scale-102"
                        id="questionnaire-btn-submit"
                      >
                        <MessageSquare size={16} />
                        <span>Enviar Diágnostico no WhatsApp</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
