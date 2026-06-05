import React from "react";
import { Logo } from "./Logo";
import { CONFIG } from "../config";
import { Instagram, Send, Mail, ArrowUp } from "lucide-react";

interface FooterProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ activeTab, onTabChange }) => {
  const handleScrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const footerLinksByPage = [
    { label: "Início", tabId: "inicio" },
    { label: "O Método", tabId: "metodo" },
    { label: "Sobre o Érico", tabId: "sobre" },
    { label: "Ebook & Conteúdo", tabId: "conteudo" },
    { label: "Diagnóstico Canino", tabId: "diagnostico" },
    { label: "Área do Tutor", tabId: "tutor" },
  ];

  return (
    <footer className="bg-charcoal border-t border-plum-brand/20 pt-20 pb-12 px-6 relative z-10" id="app-footer">
      <div className="max-w-7xl mx-auto" id="footer-inner-content">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 items-start">
          
          {/* Column 1: Logo & brand mantra (span 4) */}
          <div className="md:col-span-4 flex flex-col items-start gap-4 text-left" id="footer-col-1-brand">
            <a href="#" onClick={(e) => { e.preventDefault(); onTabChange("inicio"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="focus:outline-none">
              <Logo />
            </a>
            <p className="font-serif text-sm text-sand/80 max-w-sm mt-3 leading-relaxed italic">
              “Educar não é humanizar. É aprender a conviver com outra espécie com clareza, vínculo e respeito.”
            </p>
          </div>

          {/* Column 2: Easy page navigation links (span 4) */}
          <div className="md:col-span-4 flex flex-col items-start text-left" id="footer-col-2-nav">
            <h4 className="font-display text-[10px] font-bold tracking-widest text-peach uppercase mb-6">
              Navegação do site
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3.5 w-full">
              {footerLinksByPage.map((link) => (
                <a
                  key={link.tabId}
                  href={`#${link.tabId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onTabChange(link.tabId);
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className={`text-xs transition-colors font-medium text-left ${
                    activeTab === link.tabId ? "text-forest font-bold" : "text-sand hover:text-forest"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: High conversion direct contact channels (span 4) */}
          <div className="md:col-span-4 flex flex-col items-start text-left" id="footer-col-3-channels">
            <h4 className="font-display text-[10px] font-bold tracking-widest text-peach uppercase mb-4">
              Canais Diretos de Atendimento
            </h4>
            <p className="text-xs text-sand-deep mb-6 leading-relaxed">
              Fale diretamente conosco sem intermediários para tirar qualquer dúvida e agendar sua sessão.
            </p>

            <ul className="space-y-4 w-full">
              {/* WhatsApp direct */}
              <li>
                <a
                  href={CONFIG.WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-xs text-sand hover:text-forest group transition-colors duration-200"
                >
                  <span className="p-2 rounded-full bg-forest/10 text-forest group-hover:bg-forest group-hover:text-charcoal transition-colors">
                    <Send size={15} />
                  </span>
                  <div>
                    <span className="font-sans text-[10px] text-sand-deep block font-semibold uppercase leading-none">WhatsApp</span>
                    <span className="font-sans font-medium mt-1 inline-block">+55 (55) 99724-0369</span>
                  </div>
                </a>
              </li>

              {/* Instagram link */}
              <li>
                <a
                  href={CONFIG.INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-xs text-sand hover:text-[#ED4C87] group transition-colors duration-200"
                >
                  <span className="p-2 rounded-full bg-rose-brand/10 text-rose-brand group-hover:bg-[#ED4C87] group-hover:text-charcoal transition-colors">
                    <Instagram size={15} />
                  </span>
                  <div>
                    <span className="font-sans text-[10px] text-sand-deep block font-semibold uppercase leading-none">Instagram</span>
                    <span className="font-sans font-medium mt-1 inline-block">@erico.educacaorelacional</span>
                  </div>
                </a>
              </li>

              {/* Email direct contact */}
              <li>
                <a
                  href={CONFIG.EMAIL_URL}
                  className="flex items-center gap-3 text-xs text-sand hover:text-peach group transition-colors duration-200"
                >
                  <span className="p-2 rounded-full bg-peach/10 text-peach group-hover:bg-peach group-hover:text-charcoal transition-colors">
                    <Mail size={15} />
                  </span>
                  <div>
                    <span className="font-sans text-[10px] text-sand-deep block font-semibold uppercase leading-none">E-mail Profissional</span>
                    <span className="font-sans font-medium mt-1 inline-block">{CONFIG.EMAIL}</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Closing Copyright bar and button back to top */}
        <div className="border-t border-plum-brand/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6" id="footer-legal-bar">
          <div className="text-left text-xs text-sand-deep font-sans">
            <p>© {new Date().getFullYear()} Érico Cavalheiro • Todos os direitos reservados.</p>
            <p className="mt-1 opacity-75">Educador Canino & Comportamento Relacional.</p>
          </div>

          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-2 text-[10px] font-sans font-bold tracking-widest text-sand hover:text-forest transition-colors uppercase cursor-pointer py-2 px-4 border border-sand-deep/20 rounded"
            aria-label="Voltar para o topo"
          >
            <span>Ir para o topo</span>
            <ArrowUp size={12} className="animate-bounce" />
          </button>
        </div>

      </div>
    </footer>
  );
};
