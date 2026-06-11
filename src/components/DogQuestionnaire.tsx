import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  Dog,
  AlertCircle,
  Brain,
  ShieldAlert,
  Moon,
  Zap,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSupabase } from "../context/SupabaseCtx";
import { CONFIG } from "../config";

interface QuestionnaireState {
  dogName: string;
  dogBreed: string;
  dogAge: string;
  primaryIssue: string;
  intensity: "leve" | "moderada" | "grave";
  additionalNotes: string;
}

const INITIAL_STATE: QuestionnaireState = {
  dogName: "",
  dogBreed: "",
  dogAge: "",
  primaryIssue: "",
  intensity: "moderada",
  additionalNotes: "",
};

const ISSUES = [
  { id: "reactivity", label: "Reatividade na Guia", icon: <ShieldAlert size={18} />, desc: "Avança, late ou fica tenso ao ver outros cães ou pessoas no passeio." },
  { id: "separation", label: "Ansiedade de Separação", icon: <Moon size={18} />, desc: "Chora, destrói objetos ou vocaliza excessivamente quando deixado sozinho." },
  { id: "fear", label: "Medo / Insegurança", icon: <AlertCircle size={18} />, desc: "Se esconde, treme ou paralisa diante de barulhos, estranhos ou novos ambientes." },
  { id: "focus", label: "Falta de Engajamento", icon: <Brain size={18} />, desc: "Ignora o tutor na rua, parece estar em seu próprio mundo e não responde a chamados." },
  { id: "aggression", label: "Agressividade Territorial", icon: <Zap size={18} />, desc: "Rosna ou avança em visitas ou ao redor de recursos como comida e brinquedos." },
];

export const DogQuestionnaire: React.FC = () => {
  const { user, createProfile } = useSupabase();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<QuestionnaireState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (step === 1 && !form.dogName) return;
    if (step === 2 && !form.primaryIssue) return;
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => setStep((prev) => prev - 1);

  const handleComposeWhatsappMessage = async () => {
    setIsSubmitting(true);

    // If user is logged in, we update their clinical profile on Supabase
    if (user) {
      try {
        await createProfile(
          "Tutor do " + form.dogName,
          form.dogName,
          form.dogBreed,
          form.dogAge
        );
      } catch (err) {
        console.error("Erro ao salvar perfil clínico no Supabase", err);
      }
    }

    const selectedIssueLabel = ISSUES.find((i) => i.id === form.primaryIssue)?.label || "Comportamental Geral";
    
    const message = encodeURIComponent(
      `Olá Érico! Acabei de realizar o Diagnóstico de Vínculo no seu site para o ${form.dogName}.\n\n` +
      `🐾 *DADOS DO CÃO*\n` +
      `- Nome: ${form.dogName}\n` +
      `- Raça/Idade: ${form.dogBreed || "Não informada"} / ${form.dogAge || "Não informada"}\n\n` +
      `🚨 *PERFIL COMPORTAMENTAL*\n` +
      `- Queixa Principal: ${selectedIssueLabel}\n` +
      `- Intensidade Estimada: ${form.intensity.toUpperCase()}\n\n` +
      `📝 *DETALHES EXTRA*\n` +
      `"${form.additionalNotes || "Nenhum contexto extra relatado."}"\n\n` +
      `Gostaria de entender como o Método de Educação Relacional pode nos ajudar.`
    );

    window.open(`https://wa.me/5555997240369?text=${message}`, "_blank");
    setIsSubmitting(false);
  };

  const selectedIssueDetails = ISSUES.find(i => i.id === form.primaryIssue);

  return (
    <section className="py-12 px-6" id="dog-questionnaire-interactive">
      <div className="max-w-3xl mx-auto">
        <div className="bg-plum-deep/20 border border-plum-brand/20 rounded-3xl overflow-hidden backdrop-blur-md">

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-white/5">
            <motion.div
              className="h-full bg-forest shadow-[0_0_15px_rgba(45,90,39,0.5)]"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          <div className="p-8 sm:p-12">
            <AnimatePresence mode="wait">

              {/* STEP 1: Basic Identity */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2 text-forest mb-2">
                      <Dog size={20} />
                      <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Identificação Básica</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-semibold">Quem vamos ajudar hoje?</h3>
                    <p className="font-sans text-sm text-sand-deep mt-2">Dê os primeiros detalhes sobre seu companheiro.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-sand/60 tracking-wider">Nome do Cão (Obrigatório)</label>
                      <input
                        type="text"
                        placeholder="Ex: Max, Luna, Toby..."
                        value={form.dogName}
                        onChange={(e) => setForm({...form, dogName: e.target.value})}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-ivory outline-none focus:border-peach/50 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-sand/60 tracking-wider">Raça</label>
                        <input
                          type="text"
                          placeholder="Ex: Border Collie, SRD..."
                          value={form.dogBreed}
                          onChange={(e) => setForm({...form, dogBreed: e.target.value})}
                          className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-ivory outline-none focus:border-peach/50 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-sand/60 tracking-wider">Idade</label>
                        <input
                          type="text"
                          placeholder="Ex: 2 anos, 6 meses..."
                          value={form.dogAge}
                          onChange={(e) => setForm({...form, dogAge: e.target.value})}
                          className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-ivory outline-none focus:border-peach/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: The Core Issue */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-left">
                    <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-semibold">O que mais te preocupa hoje?</h3>
                    <p className="font-sans text-sm text-sand-deep mt-2">Selecione a queixa que mais impacta a rotina de vocês.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {ISSUES.map((issue) => (
                      <button
                        key={issue.id}
                        onClick={() => setForm({...form, primaryIssue: issue.id})}
                        className={`flex items-start gap-4 p-5 rounded-2xl border transition-all text-left cursor-pointer ${
                          form.primaryIssue === issue.id
                            ? "bg-peach/10 border-peach text-ivory shadow-soft"
                            : "bg-black/20 border-white/5 text-sand hover:border-white/10"
                        }`}
                      >
                        <div className={`p-2.5 rounded-lg ${form.primaryIssue === issue.id ? "bg-peach text-charcoal" : "bg-white/5 text-sand"}`}>
                          {issue.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider">{issue.label}</h4>
                          <p className="text-xs opacity-60 mt-1 font-light leading-relaxed">{issue.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Intensity & Notes */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-left">
                    <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-semibold">Intensidade e Contexto</h3>
                    <p className="font-sans text-sm text-sand-deep mt-2">Como você avalia a gravidade desse comportamento?</p>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-3 gap-4">
                      {(["leve", "moderada", "grave"] as const).map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setForm({...form, intensity: lvl})}
                          className={`py-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                            form.intensity === lvl
                              ? "bg-forest/20 border-forest text-forest shadow-soft scale-[1.02]"
                              : "bg-black/20 border-white/5 text-sand hover:border-white/10"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-sand/60 tracking-wider">Conte um exemplo de um momento difícil:</label>
                      <textarea
                        rows={4}
                        placeholder="Ex: Quando chegamos perto do portão do prédio e ele avista outro cão..."
                        value={form.additionalNotes}
                        onChange={(e) => setForm({...form, additionalNotes: e.target.value})}
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-ivory outline-none focus:border-peach/50 transition-all resize-none font-sans text-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Review */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-forest/20 rounded-full flex items-center justify-center mx-auto mb-6 text-forest">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="font-serif text-3xl text-ivory font-bold">Dossiê Pronto!</h3>
                    <p className="font-sans text-sm text-sand-deep mt-2">Compilamos suas observações. Agora, vamos encaminhar para a análise clínica do Érico.</p>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-[10px] font-mono text-sand/40 uppercase">Paciente Canino</span>
                      <span className="text-sm font-bold text-ivory">{form.dogName}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-[10px] font-mono text-sand/40 uppercase">Queixa Relacional</span>
                      <span className="text-sm font-bold text-peach">{selectedIssueDetails?.label}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-[10px] font-mono text-sand/40 uppercase">Gravidade Estimada</span>
                      <span className="text-sm font-bold text-rose-brand uppercase tracking-widest">{form.intensity}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-plum-deep/30 border border-plum-brand/20 rounded-xl text-[11px] text-sand/80 leading-relaxed italic">
                    <Info size={18} className="shrink-0 text-peach" />
                    "Ao clicar no botão abaixo, você será redirecionado para o WhatsApp com o resumo pronto."
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Actions */}
            <div className="mt-12 flex items-center justify-between gap-4">
              {step > 1 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-sand hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} /> Voltar
                </button>
              )}

              <div className="ml-auto">
                {step < 4 ? (
                  <button
                    onClick={handleNext}
                    className="bg-ivory text-charcoal px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lift flex items-center gap-2 cursor-pointer"
                  >
                    Próximo <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleComposeWhatsappMessage}
                    disabled={isSubmitting}
                    className="bg-gradient-clay text-charcoal px-10 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:shadow-warm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <MessageSquare size={16} />
                    {isSubmitting ? "Processando..." : "Enviar para Érico"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
