import { lazy, Suspense, useEffect, useState } from "react";
import { Header } from "./components/Header";
import ericoPortrait from "./assets/images/about-erico-D9eoGtnm.jpg";
import { Hero } from "./components/Hero";
import { Online } from "./components/Online";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";

const About = lazy(() => import("./components/About").then((module) => ({ default: module.About })));
const Method = lazy(() => import("./components/Method").then((module) => ({ default: module.Method })));
const Ebook = lazy(() => import("./components/Ebook").then((module) => ({ default: module.Ebook })));
const Blog = lazy(() => import("./components/Blog").then((module) => ({ default: module.Blog })));
const InstagramFeed = lazy(() => import("./components/InstagramFeed").then((module) => ({ default: module.InstagramFeed })));
const CanineNews = lazy(() => import("./components/CanineNews").then((module) => ({ default: module.CanineNews })));
const Newsletter = lazy(() => import("./components/Newsletter").then((module) => ({ default: module.Newsletter })));
const DogQuestionnaire = lazy(() => import("./components/DogQuestionnaire").then((module) => ({ default: module.DogQuestionnaire })));
const TutorArea = lazy(() => import("./components/TutorArea").then((module) => ({ default: module.TutorArea })));

const questionnairePath = "/questionario-comportamento-canino";
const tabs = ["inicio", "metodo", "sobre", "conteudo", "diagnostico", "tutor"];

function readTab() {
  if (window.location.pathname.replace(/\/$/, "") === questionnairePath) return "diagnostico";
  const hash = window.location.hash.slice(1);
  return tabs.includes(hash) ? hash : "inicio";
}

export default function App() {
  const [activeTab, setActiveTab] = useState(readTab);
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    localStorage.getItem("erico-theme") === "light" ? "light" : "dark",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("erico-theme", theme);
  }, [theme]);

  useEffect(() => {
    const syncTab = () => {
      if (location.pathname === "/" && location.hash === "#diagnostico") {
        location.replace(questionnairePath);
        return;
      }
      const hash = window.location.hash.slice(1);
      if (hash && !tabs.includes(hash)) return;
      setActiveTab(readTab());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    if (location.pathname === "/" && location.hash === "#diagnostico") syncTab();
    window.addEventListener("hashchange", syncTab);
    window.addEventListener("popstate", syncTab);
    return () => {
      window.removeEventListener("hashchange", syncTab);
      window.removeEventListener("popstate", syncTab);
    };
  }, []);

  function handleTabTransition(tabId: string) {
    if (tabId === "diagnostico") {
      location.assign(questionnairePath);
      return;
    }
    if (location.pathname !== "/") {
      location.assign(`/#${tabId}`);
      return;
    }
    if (window.location.hash !== `#${tabId}`) {
      window.history.pushState(null, "", `#${tabId}`);
    }
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <div className={`relative min-h-screen selection:bg-forest selection:text-charcoal bg-charcoal editorial-site${activeTab === "inicio" ? " editorial-home" : ""}`} id="main-landing-app">
      <a href="#conteudo-principal" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ivory focus:text-charcoal focus:p-3">
        Pular para o conteúdo
      </a>
      {activeTab !== "inicio" && activeTab !== "diagnostico" && <FloatingWhatsApp />}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabTransition}
        theme={theme}
        toggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      />

      <main className="pt-20" id="conteudo-principal" tabIndex={-1}>
        <Suspense fallback={<p role="status" className="mx-auto max-w-5xl px-6 py-12 text-sand">Carregando conteúdo…</p>}>
          {activeTab === "inicio" && (
            <>
              <Hero />
              <div className="editorial-strip" aria-label="Atalhos do atendimento">
                <a href="#para-quem">Para quem é <span aria-hidden="true">✦</span></a>
                <a href="#aula-online">Como funciona <span aria-hidden="true">✦</span></a>
                <a href={questionnairePath}>Questionário <span aria-hidden="true">✦</span></a>
              </div>
              <section className="editorial-intro" aria-labelledby="para-quem">
                <span className="editorial-mark" aria-hidden="true">✳</span>
                <h2 id="para-quem">Adestramento online para cães reativos e outros desafios da rotina</h2>
                <p>Se seu cão late ou avança na guia, se agita com visitas ou reage a barulhos, o primeiro passo é identificar o que costuma desencadear a reação. Na consulta, o Érico ajuda você a observar esses padrões e escolher ajustes que façam sentido para a sua rotina.</p>
              </section>
              <section className="editorial-grid" aria-label="Conheça a abordagem e o atendimento">
                <article className="editorial-card editorial-card--portrait">
                  <img src={ericoPortrait} alt="Érico Cavalheiro" loading="lazy" decoding="async" width="400" height="400" />
                  <a href="#sobre" onClick={(event) => { event.preventDefault(); handleTabTransition("sobre"); }}>Sobre o Érico <span aria-hidden="true">↗</span></a>
                </article>
                <article className="editorial-card editorial-card--yellow">
                  <h2>Antes do comando, existe relação.</h2>
                  <p>Observe os sinais do seu cão e entenda como o ambiente e a rotina influenciam o comportamento dele.</p>
                  <a href="#metodo" onClick={(event) => { event.preventDefault(); handleTabTransition("metodo"); }}>Conhecer o método <span aria-hidden="true">↗</span></a>
                </article>
                <article className="editorial-card editorial-card--orange">
                  <h2>Atendimento por videochamada</h2>
                  <p>Converse com o Érico de qualquer lugar e receba orientações para a sua rotina.</p>
                  <a href="#aula-online">Ver as etapas <span aria-hidden="true">↓</span></a>
                </article>
                <article className="editorial-card editorial-card--blue">
                  <h2>O que está acontecendo com seu cão?</h2>
                  <p>Responda em quatro etapas e prepare um resumo para conversar com o Érico.</p>
                  <a href={questionnairePath}>Começar questionário <span aria-hidden="true">↗</span></a>
                </article>
              </section>
              <Online />
              <section className="mx-auto max-w-5xl px-6 py-10" aria-labelledby="perguntas-atendimento">
                <h2 id="perguntas-atendimento" className="font-serif text-3xl font-bold text-ivory">Perguntas frequentes</h2>
                <details className="mt-4 border-b border-plum-brand/25 text-sand">
                  <summary className="cursor-pointer py-3 font-semibold text-ivory">Posso agendar de outra cidade?</summary>
                  <p className="pb-4">Sim. A consulta é por videochamada e pode ser feita de qualquer cidade do Brasil.</p>
                </details>
                <details className="border-b border-plum-brand/25 text-sand">
                  <summary className="cursor-pointer py-3 font-semibold text-ivory">Preciso filmar meu cão antes?</summary>
                  <p className="pb-4">O Érico orienta quais registros da rotina podem ajudar na consulta.</p>
                </details>
                <details className="border-b border-plum-brand/25 text-sand">
                  <summary className="cursor-pointer py-3 font-semibold text-ivory">Posso procurar atendimento online para um cão reativo?</summary>
                  <p className="pb-4">Sim. Na consulta, vocês conversam sobre os gatilhos e o contexto das reações. O Érico orienta os primeiros ajustes e avalia com você se o caso precisa também de atendimento presencial.</p>
                </details>
              </section>
              <FinalCTA />
            </>
          )}
          {activeTab === "metodo" && (
            <>
              <Method />
              <Online />
              <p className="mx-auto max-w-5xl px-6 py-8 text-sand">
                <a href={questionnairePath} className="inline-flex min-h-11 items-center text-forest underline" onClick={(event) => { event.preventDefault(); handleTabTransition("diagnostico"); }}>Responder ao questionário de vínculo canino</a>
              </p>
            </>
          )}
          {activeTab === "sobre" && <About />}
          {activeTab === "conteudo" && (
            <>
              <header className="gallery-page-intro">
                <h1>Conteúdos sobre comportamento canino</h1>
                <p>Leia sobre comportamento e psicologia canina, vínculo com o tutor e formas de aplicar esses conceitos nos passeios e em casa.</p>
              </header>
              <Ebook />
              <Blog />
              <CanineNews />
              <InstagramFeed />
              <Newsletter />
            </>
          )}
          {activeTab === "diagnostico" && (
            <div id="tab-diagnostico-view">
              <section className="gallery-page-intro gallery-page-intro--questionnaire">
                <h1 className="font-serif text-4xl font-bold leading-tight text-ivory sm:text-5xl">Questionário de comportamento canino</h1>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-sand">Seu cachorro late, avança no passeio ou fica agitado com visitas? Responda sobre a rotina dele e envie um resumo ao Érico pelo WhatsApp.</p>
                <p className="mt-3 text-sm text-sand-deep">Você pode revisar as respostas antes de compartilhar.</p>
                <a href="#dog-questionnaire-section" className="editorial-action">Começar questionário</a>
              </section>
              <Suspense fallback={<p role="status" className="px-6 py-8 text-center text-sand">Carregando questionário…</p>}>
                <DogQuestionnaire embedded />
              </Suspense>
            </div>
          )}
          {activeTab === "tutor" && <TutorArea />}
        </Suspense>
      </main>

      <Footer activeTab={activeTab} onTabChange={handleTabTransition} />
    </div>
  );
}
