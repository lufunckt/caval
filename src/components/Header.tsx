import React, { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { CONFIG } from "../config";
import { Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Início", id: "inicio" },
    { label: "O Método", id: "metodo" },
    { label: "Sobre Érico", id: "sobre" },
    { label: "Ebook & Conteúdo", id: "conteudo" },
    { label: "Diagnóstico", id: "diagnostico" },
    { label: "Área do Tutor", id: "tutor" },
  ];

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, tabId: string) => {
    e.preventDefault();
    setIsOpen(false);
    onTabChange(tabId);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-charcoal/90 backdrop-blur-md border-b border-plum-brand/20 py-4 shadow-soft"
          : "bg-transparent py-6"
      }`}
      id="main-app-header"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" id="header-container">
        {/* Logo and Personal Brand */}
        <a href="#" onClick={(e) => handleTabClick(e, "inicio")} className="focus:outline-none" aria-label="Voltar ao início">
          <Logo />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleTabClick(e, item.id)}
              aria-current={activeTab === item.id ? "page" : undefined}
              className={`text-sm font-medium transition-colors duration-200 uppercase tracking-widest text-[11px] relative py-1 ${
                activeTab === item.id
                  ? "text-forest font-bold"
                  : "text-sand hover:text-forest"
              }`}
              id={`nav-link-${item.id}`}
            >
              {item.label}
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-forest rounded-full" />
              )}
            </a>
          ))}
        </nav>

        {/* Desktop Call To Action */}
        <div className="hidden md:flex items-center gap-4" id="desktop-cta-container">
          <button
            onClick={toggleTheme}
            className="p-2 ml-1 rounded-full border border-plum-brand/20 hover:bg-plum-brand/10 text-sand hover:text-forest transition-colors duration-200 focus:outline-none flex items-center justify-center cursor-pointer"
            aria-label={`Alternar para tema ${theme === "dark" ? "claro" : "escuro"}`}
            title={`Alternar para tema ${theme === "dark" ? "claro" : "escuro"}`}
            id="desktop-theme-toggle"
          >
            {theme === "dark" ? (
              <Sun size={17} className="stroke-[1.75]" />
            ) : (
              <Moon size={17} className="stroke-[1.75]" />
            )}
          </button>

          <a
            href={CONFIG.WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Agendar conversa profissional de educação canina pelo WhatsApp"
            className="group relative inline-flex items-center bg-gradient-clay p-0.5 text-xs font-bold uppercase tracking-wider text-charcoal rounded-sm shadow-warm hover:scale-[1.02] transition-transform duration-300 p-[1px]"
            id="header-cta-button"
          >
            <span 
              className="relative z-10 flex items-center gap-1.5 font-sans font-bold text-charcoal px-5 py-2.5 rounded-[1px] transition-colors"
              style={{ backgroundColor: "#f9eded" }}
            >
              Agendar conversa
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </span>
          </a>
        </div>

        {/* Mobile menu and theme buttons container */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full border border-plum-brand/20 text-sand hover:text-forest transition-colors duration-200 focus:outline-none flex items-center justify-center cursor-pointer"
            aria-label={`Alternar para tema ${theme === "dark" ? "claro" : "escuro"}`}
            id="mobile-theme-toggle"
          >
            {theme === "dark" ? (
              <Sun size={18} className="stroke-[1.75]" />
            ) : (
              <Moon size={18} className="stroke-[1.75]" />
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-sand hover:text-ivory p-2 focus:outline-none"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isOpen}
            id="mobile-menu-trigger"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer menu */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 top-[73px] bg-charcoal/98 backdrop-blur-lg z-40 flex flex-col justify-between p-8 border-t border-plum-brand/20 animate-fade-in"
          id="mobile-navigation-drawer"
        >
          <nav className="flex flex-col gap-6" aria-label="Navegação móvel">
            {navItems.map((item, idx) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleTabClick(e, item.id)}
                aria-current={activeTab === item.id ? "page" : undefined}
                className={`text-lg font-serif tracking-wide transition-colors py-2 border-b border-plum-brand/10 text-left ${
                  activeTab === item.id
                    ? "text-forest font-bold"
                    : "text-ivory/90 hover:text-forest"
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
                id={`mobile-nav-link-${item.id}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-4 mt-8" id="mobile-drawer-cta-container">
            <a
              href={CONFIG.WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Agendar conversa profissional de educação canina pelo WhatsApp"
              className="w-full text-center bg-gradient-clay py-4 text-sm font-bold uppercase tracking-wider text-charcoal rounded-sm shadow-warm"
              id="mobile-drawer-whatsapp-btn"
            >
              Agendar Conversa WhatsApp
            </a>
            <p className="text-[11px] text-center text-sand-deep tracking-wider uppercase font-sans mt-2">
              “Antes do comando, existe relação.”
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
