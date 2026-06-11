import React, { useEffect, useState, useRef } from "react";
import { 
  Newspaper, 
  RefreshCw, 
  BookOpen, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Award,
  Search,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Brain
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CanineNewsArticle } from "../types";

export function CanineNews() {
  const [articles, setArticles] = useState<CanineNewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<CanineNewsArticle | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const fetchNews = async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const { supabase } = await import("../lib/supabase");
      const { data, error: functionError } = await supabase.functions.invoke("canine-news", {
        body: { refresh: forceRefresh }
      });

      if (functionError) throw functionError;

      if (data.success && data.articles) {
        setArticles(data.articles);
        setIsFallback(!!data.isFallback);
        // Automatically set first article highlight in layout
        if (data.articles.length > 0) {
          setActiveCardId(data.articles[0].id);
        }
      } else {
        throw new Error("Formato de resposta inesperado do servidor.");
      }
    } catch (err: any) {
      console.error("Erro ao carregar Canine News:", err);
      setError("Dificuldade temporária ao conectar com o barramento de grounding. Exibindo insights científicos de segurança.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleRefresh = () => {
    if (refreshing || loading) return;
    fetchNews(true);
  };

  return (
    <section className="py-20 bg-[#160e1b] relative overflow-hidden" id="canine-news-section">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-plum-brand/20 to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-peach/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-forest/5 blur-[120px] pointer-events-none" />

      {/* 1. HORIZONTAL TICKER BAR (Dynamic Headlining) */}
      <div className="bg-[#0f0913] border-y border-plum-brand/15 py-3 overflow-hidden relative z-10 mb-12" id="news-ticker-marquee">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center gap-4">
          <div className="flex items-center gap-1.5 shrink-0 bg-rose-brand/10 border border-rose-brand/25 text-rose-brand px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider animate-pulse">
            <TrendingUp size={11} />
            <span>Ciência Hoje</span>
          </div>
          <div className="w-[1px] h-4 bg-plum-brand/20 shrink-0" />
          
          <div className="relative w-full overflow-hidden flex items-center">
            {loading ? (
              <div className="text-sand/50 text-xs font-mono">Conectando ao satélite de buscas...</div>
            ) : error ? (
              <div className="text-yellow-500/80 text-xs font-mono">Usando rede de dados de contingência científica do consultório.</div>
            ) : (
              <div className="flex animate-marquee whitespace-nowrap gap-12 text-xs font-sans text-sand/85">
                {/* Double output for continuous marquee loop */}
                {[...articles, ...articles].map((art, idx) => (
                  <button
                    key={`${art.id}-ticker-${idx}`}
                    onClick={() => {
                      setActiveCardId(art.id);
                      setSelectedArticle(art);
                      document.getElementById("news-bento-hub")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hover:text-peach transition-colors flex items-center gap-2 cursor-pointer focus:outline-none text-left"
                  >
                    <span className="font-semibold text-rose-light">[{art.source}]</span>
                    <span>{art.title}</span>
                    <span className="text-peach/40 font-mono text-[9px]">•</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" id="canine-news-header">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3d2435]/40 border border-plum-brand/35 text-peach mb-4">
            <Brain size={12} className="text-peach" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase font-bold">
              Canine Behavior Grounding
            </span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ivory mb-4" id="news-section-title">
            Canine News & <span className="italic text-rose-brand">Fronteira Científica</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-sand-deep leading-relaxed max-w-2xl mx-auto">
            Antes do comando, estudamos a biologia, a cognição e o afeto. Acompanhe os estudos internacionais mais recentes sobre psicologia canina fundamentados pelo Google Search Grounding em tempo real.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              aria-label="Atualizar feed de notícias científicas caninas buscando no Google Search em tempo real"
              className={`px-4 py-2 bg-plum-deep/30 hover:bg-plum-brand/20 active:scale-[0.98] border border-plum-brand/25 text-ivory text-xs font-bold uppercase tracking-wider rounded transition-all inline-flex items-center gap-2 cursor-pointer ${
                refreshing ? "opacity-70" : ""
              }`}
              id="refresh-search-button"
            >
              <RefreshCw size={13} className={`${refreshing || loading ? "animate-spin text-peach" : "text-peach"}`} />
              <span>{refreshing ? "Buscando Índices..." : "Atualizar via Google Search"}</span>
            </button>
            
            <div className="inline-flex items-center gap-1.5 bg-[#0f0913] border border-plum-brand/10 px-3 py-1.5 rounded text-[11px] font-mono text-sand/60">
              <Search size={11} className="text-forest" />
              <span>Filtro de busca: dog behavior scientific research 2026</span>
            </div>
          </div>
          
          {/* Live Search Grounding Badge */}
          <div className="mt-3 flex justify-center">
            {isFallback ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-yellow-500/80 bg-yellow-500/5 border border-yellow-500/10 px-2.5 py-0.5 rounded">
                <AlertTriangle size={11} /> Base de Dados Local Ativada (API Livre)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-green-400/80 bg-green-400/5 border border-green-400/10 px-2.5 py-0.5 rounded">
                <CheckCircle size={11} /> Grounding Conectado via Gemini 3.5 & Google Search
              </span>
            )}
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              id="news-loading-skeleton"
            >
              <div className="lg:col-span-2 space-y-6">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="p-6 bg-charcoal/40 border border-plum-brand/10 rounded-xl space-y-3 animate-pulse">
                    <div className="flex gap-2">
                      <div className="h-4 w-20 bg-plum-brand/20 rounded" />
                      <div className="h-4 w-16 bg-plum-brand/10 rounded" />
                    </div>
                    <div className="h-6 w-3/4 bg-plum-brand/20 rounded" />
                    <div className="h-4 w-full bg-plum-brand/10 rounded" />
                    <div className="h-4 w-5/6 bg-plum-brand/10 rounded" />
                  </div>
                ))}
              </div>
              <div className="p-8 bg-[#0f0913]/60 border border-plum-brand/15 rounded-xl h-[400px] animate-pulse">
                <div className="h-8 w-1/2 bg-plum-brand/20 rounded mb-4" />
                <div className="h-4 w-full bg-plum-brand/10 rounded mb-2" />
                <div className="h-4.5 w-full bg-plum-brand/15 rounded mb-6" />
                <div className="h-[200px] bg-plum-brand/5 rounded" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="news-bento-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              id="news-bento-hub"
            >
              {/* PRIMARY LEFT LIST COLUMN (8 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                {articles.map((art) => {
                  const isActive = activeCardId === art.id;
                  return (
                    <div
                      key={art.id}
                      onClick={() => {
                        setActiveCardId(art.id);
                        setSelectedArticle(art);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveCardId(art.id);
                          setSelectedArticle(art);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isActive}
                      aria-label={`Ver análise acadêmica do artigo: ${art.title} publicado por ${art.source}`}
                      className={`p-6 border rounded-xl transition-all duration-300 text-left cursor-pointer select-none group relative overflow-hidden flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-peach/40 ${
                        isActive
                          ? "bg-[#1f1326] border-peach/50 shadow-[0_10px_30px_rgba(213,171,112,0.04)]"
                          : "bg-[#0f0913]/60 border-plum-brand/15 hover:bg-[#1a0f21]/40 hover:border-plum-brand/30"
                      }`}
                      id={`article-card-${art.id}`}
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={16} className={`text-peach/50 ${isActive ? "text-peach" : ""}`} />
                      </div>

                      <div>
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="text-[10px] font-mono tracking-wider font-bold text-peach uppercase bg-peach/10 border border-peach/20 px-2 py-0.5 rounded-sm">
                            {art.source}
                          </span>
                          <span className="text-[9px] font-mono text-sand/50">
                            {art.date}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className={`font-serif text-base sm:text-lg font-bold leading-snug tracking-tight mb-2 transition-colors ${
                          isActive ? "text-ivory" : "text-sand hover:text-ivory"
                        }`}>
                          {art.title}
                        </h3>

                        {/* Snippet */}
                        <p className="text-xs text-sand-deep/95 line-clamp-2 md:line-clamp-3 leading-relaxed mb-4">
                          {art.snippet}
                        </p>
                      </div>

                      {/* Small Bottom Detail */}
                      <div className="flex items-center justify-between pt-2 border-t border-plum-brand/10 text-[10px] font-mono tracking-wider text-peach uppercase">
                        <span className="flex items-center gap-1">
                          <BookOpen size={11} />
                          <span>Análise de Érico</span>
                        </span>
                        
                        <span className="flex items-center gap-1 font-sans text-xs font-semibold group-hover:translate-x-1 transition-transform">
                          <span>Conferir estudo</span>
                          <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FLOATING DETAILED SIDE PANEL (5 Cols) */}
              <div className="lg:col-span-5 lg:sticky lg:top-36 bg-[#0c060f] border border-plum-brand/25 p-6 sm:p-8 rounded-2xl relative" id="article-detail-panel">
                <div className="absolute top-0 right-0 w-32 h-32 bg-peach/5 rounded-full blur-2xl pointer-events-none" />
                
                {/* Fallback detail view selector */}
                {(() => {
                  const currentArt = articles.find(a => a.id === activeCardId) || articles[0];
                  if (!currentArt) return null;
                  
                  return (
                    <div className="space-y-6">
                      
                      {/* Header info */}
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-peach mb-3">
                          <Award size={13} className="text-peach animate-pulse" />
                          <span className="font-bold tracking-wider uppercase">{currentArt.source}</span>
                          <span className="text-sand/30">•</span>
                          <span className="text-sand/@60 text-[11px] font-mono">{currentArt.date}</span>
                        </div>
                        
                        <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-ivory leading-tight mb-4">
                          {currentArt.title}
                        </h3>
                        
                        <div className="w-12 h-[1px] bg-rose-brand/30" />
                      </div>

                      {/* Core Snippet */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-mono tracking-widest text-[#d5ab70] uppercase font-bold">Resumo da Pesquisa</h4>
                        <p className="text-xs text-sand-deep/90 leading-relaxed font-sans border-l border-plum-brand/35 pl-3">
                          {currentArt.snippet}
                        </p>
                      </div>

                      {/* Relational Commentary (Psychological review by Erico) */}
                      <div className="bg-[#1f1326]/50 border border-plum-brand/20 p-5 rounded-xl space-y-3 relative overflow-hidden">
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-forest/5 rounded-full blur-xl" />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-peach" />
                            <h4 className="text-[10px] font-mono tracking-widest text-peach uppercase font-bold">Reflexão Relacional</h4>
                          </div>
                          <span className="text-[9px] font-mono text-[#d5ab70] bg-[#d5ab70]/10 px-2 py-0.5 rounded select-none">
                            Método Relacional
                          </span>
                        </div>
                        
                        <p className="text-xs text-ivory/95 italic leading-relaxed font-serif pl-1">
                          "{currentArt.behaviorDigest}"
                        </p>
                        
                        <div className="pt-2 flex items-center gap-2 text-[10px] font-sans font-bold text-sand-deep/80">
                          <span className="w-4 h-[1px] bg-sand-deep/30" />
                          <span>Érico Cavalheiro</span>
                        </div>
                      </div>

                      {/* Journal Outgoing Reference */}
                      <div className="pt-2">
                        <a
                          href={currentArt.url}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-3 px-4 bg-gradient-clay text-charcoal hover:shadow-warm hover:brightness-105 active:scale-[0.99] font-sans text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
                        >
                          <span>Acessar Publicação Original</span>
                          <ExternalLink size={13} />
                        </a>
                        <p className="text-[9px] text-center text-sand/40 font-mono mt-2.5">
                          Link externo para o indexador de periódicos acadêmicos ({currentArt.source})
                        </p>
                      </div>

                    </div>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guided banner at the bottom */}
        <div className="max-w-4xl mx-auto text-center mt-16 border-t border-plum-brand/10 pt-12" id="articles-concluding-banner">
          <p className="text-xs text-sand/60 italic max-w-lg mx-auto">
            "A ciência comportamental canina avança diariamente desvendando que o cão reflete nossa postura corporal, sintonia de vida e paciência relacional." 
          </p>
          <div className="mt-3 text-[10px] text-peach font-mono uppercase tracking-widest">— Psico canina integrada</div>
        </div>

      </div>
    </section>
  );
}
