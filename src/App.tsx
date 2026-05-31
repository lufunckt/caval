import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { About } from "./components/About";
import { Method } from "./components/Method";
import { RelationalInsight } from "./components/RelationalInsight";
import { Online } from "./components/Online";
import { ConsultingServices } from "./components/ConsultingServices";
import { Ebook } from "./components/Ebook";
import { Blog } from "./components/Blog";
import { InstagramFeed } from "./components/InstagramFeed";
import { Testimonials } from "./components/Testimonials";
import { DogQuestionnaire } from "./components/DogQuestionnaire";
import { FinalCTA } from "./components/FinalCTA";
import { Newsletter } from "./components/Newsletter";
import { TutorArea } from "./components/TutorArea";
import { Footer } from "./components/Footer";
import { SocialProofToast } from "./components/SocialProofToast";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Sparkles, AlertCircle } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash.replace("#", "");
    const allowed = ["inicio", "metodo", "sobre", "conteudo", "diagnostico", "tutor"];
    return allowed.includes(hash) ? hash : "inicio";
  });

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("erico-theme");
    return saved === "light" ? "light" : "dark";
  });

  // Keep theme in sync with document attributes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("erico-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Keep hash in sync with browser URL
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  // Handle back/forward events in natural browsing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const allowed = ["inicio", "metodo", "sobre", "conteudo", "diagnostico", "tutor"];
      if (allowed.includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Set up scroll reveal observers whenever dynamic tab shifts occur
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -80px 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(".reveal");
      elements.forEach((el) => observer.observe(el));
    }, 150);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeTab]);

  const handleTabTransition = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative min-h-screen selection:bg-forest selection:text-charcoal bg-charcoal" id="main-landing-app">
      {/* Premium Fine-Grain Editorial Vector Overlay */}
      <div className="grain-overlay" />

      {/* Brand Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Animated Navigation Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} theme={theme} toggleTheme={toggleTheme} />

      <main className="pt-[80px]" id="scrollable-landing-content">
        
        {/* Elegant Tab Index Navigation Hub (helps avoid scroll pollution completely) */}
        <div className="bg-charcoal border-b border-plum-brand/15 py-3.5 px-6 sticky top-[73px] z-30 backdrop-blur-md bg-charcoal/90" id="tabs-index-hub">
          <div className="max-w-4xl mx-auto flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: "inicio", label: "Apresentação", sub: "Home" },
              { id: "metodo", label: "O Método", sub: "Relacional" },
              { id: "sobre", label: "Érico Cavalheiro", sub: "Sobre" },
              { id: "conteudo", label: "Ebook & Conteúdos", sub: "Insights" },
              { id: "diagnostico", label: "Fazer Diagnóstico", sub: "Quiz" },
              { id: "tutor", label: "Área do Tutor", sub: "Portal" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabTransition(tab.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 shrink-0 text-center flex flex-col items-center justify-center min-w-[120px] focus:outline-none cursor-pointer border ${
                    isActive
                      ? "bg-ivory text-charcoal border-transparent shadow-warm scale-[1.02]"
                      : "bg-[#1f1725]/30 hover:bg-[#1f1725]/60 hover:text-ivory text-sand/75 border-plum-brand/15"
                  }`}
                  id={`hub-tab-trigger-${tab.id}`}
                >
                  <span className="text-[10px] sm:text-[11px] font-sans font-bold leading-none">{tab.label}</span>
                  <span className={`text-[8px] tracking-wider uppercase mt-0.5 leading-none block ${isActive ? "text-rose-brand" : "text-sand-deep/60"}`}>
                    {tab.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="focus:outline-none"
            id={`tab-container-${activeTab}`}
          >
            {/* Dynamic Content Switching Logic */}
            {activeTab === "inicio" && (
              <div id="tab-inicio-view" className="animate-fade-in">
                <Hero />
                <Marquee />
                <RelationalInsight />
                
                {/* Guided Editorial Reader flow widget to make tabs super user friendly */}
                <div className="max-w-3xl mx-auto px-6 py-12 text-center" id="guided-flow-1">
                  <div className="p-8 border border-plum-brand/20 bg-plum-deep/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-sm">
                    <div className="text-left">
                      <span className="text-[10px] font-mono tracking-widest text-[#d5ab70] uppercase font-bold flex items-center gap-1">
                        <Sparkles size={11} /> PRÓXIMO CAPÍTULO
                      </span>
                      <h4 className="font-serif text-lg font-bold text-ivory mt-1">Conheça o Método de Educação Relacional</h4>
                      <p className="text-xs text-sand-deep mt-1 leading-relaxed">Entenda como construímos a clareza e o vínculo real.</p>
                    </div>
                    <button
                      onClick={() => handleTabTransition("metodo")}
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wider bg-[#efe7e7] hover:bg-[#eae0e0] text-charcoal rounded duration-200 shrink-0 inline-flex items-center gap-1.5 cursor-pointer shadow-soft"
                    >
                      <span>Ver o Método</span>
                      <ArrowRight size={13} className="text-charcoal" />
                    </button>
                  </div>
                </div>

                {/* Commented out for now as requested */}
                {/* <Testimonials /> */}
                <FinalCTA />
              </div>
            )}

            {activeTab === "metodo" && (
              <div id="tab-metodo-view" className="animate-fade-in">
                <Method />
                {/* Commented out for now as requested */}
                {/* <ConsultingServices /> */}
                <Online />
                
                {/* Guided Action flow */}
                <div className="max-w-3xl mx-auto px-6 py-12 text-center animate-fade-in" id="guided-flow-2">
                  <div className="p-8 border border-plum-brand/20 bg-plum-deep/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-sm">
                    <div className="text-left">
                      <span className="text-[10px] font-mono tracking-widest text-forest uppercase font-bold flex items-center gap-1">
                        <Sparkles size={11} /> EXAME CORTÊS
                      </span>
                      <h4 className="font-serif text-lg font-bold text-ivory mt-1">Diagnóstico Gratuito de Vínculo</h4>
                      <p className="text-xs text-sand-deep mt-1 leading-relaxed">Responda a perguntas simples e entenda a qualidade da relação com seu cão.</p>
                    </div>
                    <button
                      onClick={() => handleTabTransition("diagnostico")}
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wider bg-gradient-clay text-charcoal rounded duration-200 shrink-0 inline-flex items-center gap-1.5 cursor-pointer shadow-soft"
                    >
                      <span>Fazer Diagnóstico</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                <FinalCTA />
              </div>
            )}

            {activeTab === "sobre" && (
              <div id="tab-sobre-view" className="animate-fade-in">
                <About />
                {/* Commented out for now as requested */}
                {/* <Testimonials /> */}
                
                {/* Guided flow callback */}
                <div className="max-w-3xl mx-auto px-6 py-12 text-center" id="guided-flow-3">
                  <div className="p-8 border border-plum-brand/20 bg-plum-deep/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-sm">
                    <div className="text-left">
                      <span className="text-[10px] font-mono tracking-widest text-[#d5ab70] uppercase font-bold">INSIGHTS GRATUITOS</span>
                      <h4 className="font-serif text-lg font-bold text-ivory mt-1">Baixe o E-book & Faça a leitura do Blog</h4>
                      <p className="text-xs text-sand-deep mt-1 leading-relaxed">Aprenda a decifrar as reações e os comportamentos do seu cão.</p>
                    </div>
                    <button
                      onClick={() => handleTabTransition("conteudo")}
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wider bg-[#efe7e7] text-charcoal rounded duration-200 shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Ver E-book e Blog</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "conteudo" && (
              <div id="tab-conteudo-view" className="animate-fade-in">
                <Ebook />
                <Blog />
                <InstagramFeed />
              </div>
            )}

            {activeTab === "diagnostico" && (
              <div id="tab-diagnostico-view" className="animate-fade-in">
                <div className="pt-8 px-6 max-w-4xl mx-auto text-center" id="diagnostico-header">
                  <span className="text-[11px] font-mono tracking-widest text-forest uppercase font-bold bg-forest/10 px-3 py-1 rounded border border-forest/20 inline-block mb-3">
                    Ferramenta Interativa
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ivory mb-2">
                    Diagnóstico de Vínculo Canino
                  </h2>
                  <p className="text-xs sm:text-sm text-sand-deep max-w-lg mx-auto leading-relaxed mb-6">
                    Desenvolvemos este breve questionário relacional para que você observe os pontos sutis da convivência e do respeito mútuo.
                  </p>
                </div>
                
                <DogQuestionnaire />
                
                {/* Guide to direct help */}
                <div className="max-w-3xl mx-auto px-6 py-12 text-center" id="diagnostico-whatsapp-callout">
                  <div className="p-6 border border-plum-brand/25 bg-plum-deep/30 rounded-2xl">
                    <AlertCircle className="mx-auto text-peach mb-3" size={24} />
                    <h4 className="font-serif text-base font-bold text-ivory">Gostaria de discutir o resultado com o Érico?</h4>
                    <p className="text-xs text-sand-deep mt-1 leading-relaxed max-w-md mx-auto mb-4">
                      Compartilhe os resultados de sua avaliação em sua consultoria particular para que possamos traçar uma trajetória sob medida.
                    </p>
                    <button
                      onClick={() => handleTabTransition("inicio")}
                      className="px-4 py-2 text-[10px] font-sans font-bold tracking-wider text-sand hover:text-forest uppercase transition-colors"
                    >
                      ← Voltar ao Início
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tutor" && (
              <div id="tab-tutor-view" className="animate-fade-in">
                <TutorArea />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Global Newsletter placement sits beautifully on every tab right above the Footer */}
        <Newsletter />
      </main>

      <Footer activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Dynamic Social Proof Notifications */}
      <SocialProofToast />
    </div>
  );
}
