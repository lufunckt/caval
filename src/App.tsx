import { lazy, Suspense, useEffect, useState } from "react";
import { Header } from "./components/Header";
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
  if (window.location.pathname.replace(/\/$/, "") === "/area-do-tutor") return "tutor";
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

  if (activeTab === "tutor") return <Suspense fallback={<p role="status">Carregando Área do Tutor…</p>}><TutorArea /></Suspense>;

  return (
    <div className="relative min-h-screen selection:bg-forest selection:text-charcoal bg-charcoal" id="main-landing-app">
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
              <section className="mx-auto max-w-5xl px-6 py-10" aria-labelledby="para-quem">
                <h2 id="para-quem" className="font-serif text-3xl font-bold text-ivory">Para quem é o atendimento?</h2>
                <ul className="mt-4 grid list-disc gap-3 pl-5 text-sand sm:grid-cols-3">
                  <li>Seu cão late ou avança ao ver outros cães no passeio.</li>
                  <li>Ele fica agitado com visitas, barulhos ou mudanças na rotina.</li>
                  <li>Você quer entender os sinais do seu cão e melhorar a convivência.</li>
                </ul>
              </section>
              <Online />
              <p className="mx-auto max-w-5xl px-6 pt-6"><a href={questionnairePath} className="inline-flex min-h-11 items-center text-forest underline">Responder ao questionário de comportamento canino</a></p>
              <section className="mx-auto max-w-5xl px-6 py-10" aria-labelledby="sobre-atendimento">
                <h2 id="sobre-atendimento" className="font-serif text-3xl font-bold text-ivory">Quem vai te orientar</h2>
                <p className="mt-3 max-w-2xl text-sand">Érico Cavalheiro trabalha com educação relacional e comportamento canino, observando como a rotina, o ambiente e a comunicação influenciam o comportamento do cão.</p>
                <a href="#sobre" className="mt-4 inline-flex min-h-11 items-center text-forest underline" onClick={(event) => { event.preventDefault(); handleTabTransition("sobre"); }}>Conheça o Érico</a>
              </section>
              <section className="mx-auto max-w-5xl px-6 py-10" aria-labelledby="perguntas-atendimento">
                <h2 id="perguntas-atendimento" className="font-serif text-3xl font-bold text-ivory">Perguntas frequentes</h2>
                <details className="mt-4 border-b border-plum-brand/25 text-sand">
                  <summary className="cursor-pointer py-3 font-semibold text-ivory">Posso agendar de outra cidade?</summary>
                  <p className="pb-4">Sim. A sessão é por videochamada.</p>
                </details>
                <details className="border-b border-plum-brand/25 text-sand">
                  <summary className="cursor-pointer py-3 font-semibold text-ivory">Preciso filmar meu cão antes?</summary>
                  <p className="pb-4">O Érico orienta quais registros da rotina podem ajudar na consulta.</p>
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
              <Ebook />
              <Blog />
              <CanineNews />
              <InstagramFeed />
              <Newsletter />
            </>
          )}
          {activeTab === "diagnostico" && (
            <div id="tab-diagnostico-view">
              <section className="mx-auto max-w-3xl px-6 pb-8 pt-10 text-center sm:pt-16">
                <h1 className="font-serif text-4xl font-bold leading-tight text-ivory sm:text-5xl">Questionário de comportamento canino</h1>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-sand">Seu cachorro late, avança no passeio ou fica agitado com visitas? Responda sobre a rotina dele e envie um resumo ao Érico pelo WhatsApp.</p>
                <p className="mt-3 text-sm text-sand-deep">Você pode revisar as respostas antes de compartilhar.</p>
                <a href="#dog-questionnaire-section" className="mt-6 inline-flex min-h-11 items-center rounded-sm bg-ivory px-6 font-semibold text-charcoal">Começar questionário</a>
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
