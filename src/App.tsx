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
import { Testimonials } from "./components/Testimonials";
import { DogQuestionnaire } from "./components/DogQuestionnaire";
import { FinalCTA } from "./components/FinalCTA";
import { Newsletter } from "./components/Newsletter";
import { TutorArea } from "./components/TutorArea";
import { Footer } from "./components/Footer";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { CanineNews } from "./components/CanineNews";
import { CookieConsent } from "./components/CookieConsent";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import ReactPixel from "react-facebook-pixel";

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

  const [hasPixelConsent, setHasPixelConsent] = useState(() => {
    try {
      const consentText = localStorage.getItem("erico-cookie-consent");
      if (consentText) {
        const consent = JSON.parse(consentText);
        return consent.performance === true;
      }
    } catch(e){}
    return false;
  });

  const [pixelInitialized, setPixelInitialized] = useState(false);

  // Keep theme in sync with document attributes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("erico-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const handleConsentUpdate = () => {
      try {
        const consentText = localStorage.getItem("erico-cookie-consent");
        if (consentText) {
          const consent = JSON.parse(consentText);
          setHasPixelConsent(consent.performance === true);
        } else {
          setHasPixelConsent(false);
        }
      } catch(e){
        setHasPixelConsent(false);
      }
    };
    window.addEventListener("erico-cookie-consent-updated", handleConsentUpdate);
    return () => window.removeEventListener("erico-cookie-consent-updated", handleConsentUpdate);
  }, []);

  // Initialize and handle Meta Pixel based on consent
  useEffect(() => {
    if (hasPixelConsent && !pixelInitialized) {
      const pixelId = import.meta.env.VITE_META_PIXEL_ID;
      if (pixelId) {
        const options = {
          autoConfig: true,
          debug: import.meta.env.DEV,
        };
        ReactPixel.init(pixelId, undefined, options);
        ReactPixel.grantConsent();
        ReactPixel.pageView();
        setPixelInitialized(true);
      }
    } else if (hasPixelConsent === false && pixelInitialized) {
      ReactPixel.revokeConsent();
    }
  }, [hasPixelConsent, pixelInitialized]);

  // Keep hash in sync with browser URL
  useEffect(() => {
    window.location.hash = activeTab;
    
    // Track Meta Pixel page view on tab change
    if (import.meta.env.VITE_META_PIXEL_ID && hasPixelConsent && pixelInitialized) {
      ReactPixel.pageView();
    }
  }, [activeTab, hasPixelConsent, pixelInitialized]);

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
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="focus:outline-none"
            id={`tab-container-${activeTab}`}
          >
            {/* Dynamic Content Switching Logic */}
            {activeTab === "inicio" && (
              <div id="tab-inicio-view" className="animate-fade-in">
                <Hero />
                <Marquee />
                <RelationalInsight />
                
                {/* Ebook Download Section in Home */}
                <Ebook />
                
                {/* Active Interactive Science Grounding News Feed */}
                <CanineNews />
                
                {/* Guided Editorial Reader flow widget to make tabs super user friendly */}
                <div className="max-w-4xl mx-auto px-6 py-20 text-center" id="guided-flow-1">
                  <div className="p-10 border border-forest/20 bg-forest/5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-8 backdrop-blur-md hover:border-forest/40 transition-colors duration-500">
                    <div className="text-left">
                      <span className="text-[11px] font-mono tracking-[0.2em] text-forest uppercase font-bold flex items-center gap-2 mb-2">
                        <Sparkles size={14} /> PRÓXIMO CAPÍTULO
                      </span>
                      <h4 className="font-serif text-2xl font-bold text-ivory">Aprofunde no Método</h4>
                      <p className="text-sm text-sand-deep mt-2 leading-relaxed max-w-sm">Descubra os pilares que sustentam uma convivência baseada em respeito e clareza.</p>
                    </div>
                    <button
                      onClick={() => handleTabTransition("metodo")}
                      className="group px-8 py-4 text-xs font-bold uppercase tracking-widest bg-forest text-charcoal rounded-full hover:bg-forest/90 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 inline-flex items-center gap-2 cursor-pointer shadow-lift"
                    >
                      <span>Explorar o Método</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
                <div className="max-w-4xl mx-auto px-6 py-20 text-center" id="guided-flow-2">
                  <div className="p-10 border border-peach/20 bg-peach/5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-8 backdrop-blur-md hover:border-peach/40 transition-colors duration-500">
                    <div className="text-left">
                      <span className="text-[11px] font-mono tracking-[0.2em] text-peach uppercase font-bold flex items-center gap-2 mb-2">
                        <Sparkles size={14} /> DIAGNÓSTICO ATIVO
                      </span>
                      <h4 className="font-serif text-2xl font-bold text-ivory">Avalie seu Vínculo</h4>
                      <p className="text-sm text-sand-deep mt-2 leading-relaxed max-w-sm">Um questionário técnico para entender como está a comunicação entre você e seu cão.</p>
                    </div>
                    <button
                      onClick={() => handleTabTransition("diagnostico")}
                      className="group px-8 py-4 text-xs font-bold uppercase tracking-widest bg-peach text-charcoal rounded-full hover:bg-peach/90 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 inline-flex items-center gap-2 cursor-pointer shadow-lift"
                    >
                      <span>Fazer Diagnóstico Gratuito</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
                <div className="max-w-3xl mx-auto px-6 py-20 text-center" id="guided-flow-3">
                  <div className="p-10 border border-plum-brand/20 bg-plum-deep/20 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-8 backdrop-blur-md hover:border-plum-brand/40 transition-colors duration-500">
                    <div className="text-left">
                      <span className="text-[11px] font-mono tracking-[0.2em] text-peach uppercase font-bold">INSIGHTS GRATUITOS</span>
                      <h4 className="font-serif text-lg font-bold text-ivory mt-1">Baixe o E-book</h4>
                      <p className="text-xs text-sand-deep mt-1 leading-relaxed">Aprenda a decifrar as reações e os comportamentos do seu cão.</p>
                    </div>
                    <button
                      onClick={() => handleTabTransition("conteudo")}
                      className="group px-8 py-4 text-xs font-bold uppercase tracking-widest bg-ivory text-charcoal rounded-full hover:bg-ivory/90 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 inline-flex items-center gap-2 cursor-pointer shadow-lift"
                    >
                      <span>Ver E-book</span>
                      <ArrowRight size={13} className="text-[#160E1A]" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "conteudo" && (
              <div id="tab-conteudo-view" className="animate-fade-in">
                <Ebook />
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
                <div className="max-w-4xl mx-auto px-6 py-20 text-center" id="diagnostico-whatsapp-callout">
                  <div className="p-10 border border-peach/20 bg-peach/5 rounded-3xl backdrop-blur-md">
                    <AlertCircle className="mx-auto text-peach mb-3" size={24} />
                    <h4 className="font-serif text-2xl font-bold text-ivory">Gostaria de discutir o resultado com o Érico?</h4>
                    <p className="text-sm text-sand-deep mt-2 leading-relaxed max-w-sm mx-auto mb-8">
                      Compartilhe os resultados de sua avaliação em sua consultoria particular para que possamos traçar uma trajetória sob medida.
                    </p>
                    <button
                      onClick={() => handleTabTransition("inicio")}
                      className="group px-8 py-4 text-xs font-bold uppercase tracking-widest bg-peach text-charcoal rounded-full hover:bg-peach/90 hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer shadow-lift"
                    >
                      <span>Voltar ao Início</span>
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
      <CookieConsent />
    </div>
  );
}
