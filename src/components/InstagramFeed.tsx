import React, { useState, useRef, useEffect } from "react";
import { Instagram, ChevronLeft, ChevronRight, Heart, MessageCircle, ExternalLink } from "lucide-react";
import { CONFIG } from "../config";

interface InstagramPost {
  id: string;
  imageUrl: string;
  likes: string;
  comments: string;
  tag: string;
  title: string;
  caption: string;
}

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "post1",
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600",
    likes: "1.242",
    comments: "84",
    tag: "Passeio Saudável",
    title: "O Puxão na Guia Revela Ansiedade, não Dominância.",
    caption: "Corrigir o cão com trancos ou enforcadores não resolve a raiz psicológica do estresse da rua. Entenda os sinais silenciosos de desconforto emocional."
  },
  {
    id: "post2",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600",
    likes: "948",
    comments: "49",
    tag: "Comportamento",
    title: "Seu cão late muito na chegada das visitas?",
    caption: "Isso raramente é 'alegria exagerada' ou 'agressão'. Entenda como a falta de clareza espacial gera insegurança e rituais ansiosos de recepção."
  },
  {
    id: "post3",
    imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600",
    likes: "2.112",
    comments: "153",
    tag: "Psicologia Canina",
    title: "Humanizar não é sinônimo de Amar.",
    caption: "Quando tratamos cães como bebês soberanos, privamos eles de serem cães. O afeto real reside no respeito à biologia e necessidades da espécie."
  },
  {
    id: "post4",
    imageUrl: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=600",
    likes: "1.589",
    comments: "92",
    tag: "Enriquecimento",
    title: "O perigo do tédio em ambientes urbanos.",
    caption: "Cães que destroem sofás ou lambem as patas compulsivamente estão pedindo ajuda. Descubra como a arquitetura ambiental muda a mente do animal."
  },
  {
    id: "post5",
    imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=600",
    likes: "1.025",
    comments: "61",
    tag: "Vínculo Real",
    title: "Os pilares da confiança e cooperação do cão.",
    caption: "Como obter um cão que escuta você por admiração genuína, abandonando obediência mecânica baseada em medo ou guloseimas de suborno."
  }
];

export const InstagramFeed: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? INSTAGRAM_POSTS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === INSTAGRAM_POSTS.length - 1 ? 0 : prev + 1));
  };

  // Drag simulation / Touch slide support
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setIsDragging(false);
  };

  return (
    <section className="py-24 bg-charcoal relative overflow-hidden border-t border-white/5" id="instagram-feed-section">
      <div className="absolute top-0 right-1/4 w-96 h-96 border border-rose-brand/5 rounded-full blur-3xl bg-rose-brand/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10" id="instagram-feed-container">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16 text-center reveal" id="instagram-header-block">
          <span className="font-sans text-xs uppercase tracking-widest font-bold text-rose-brand mb-3 inline-block">
            CONTEÚDO DIÁRIO E ENSINAMENTOS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] text-ivory font-bold leading-tight mb-4" id="instagram-title">
            Educação Canina no Instagram
          </h2>
          <p className="font-sans text-base text-sand/80 max-w-xl mx-auto" id="instagram-subtitle">
            Acompanhe insights psicológicos práticos, cortes de consultorias e reflexões ricas compartilhadas diariamente para transformar sua conduta.
          </p>
        </div>

        {/* Carousel Window */}
        <div 
          className="relative max-w-lg md:max-w-4xl mx-auto px-2 reveal delay-100"
          id="instagram-carousel-wrapper"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Controls - Premium overlay circles */}
          <button
            onClick={handlePrev}
            className="absolute left-[-15px] sm:left-[-30px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-ivory hover:text-rose-brand hover:border-rose-brand/30 transition-all duration-300 shadow-lg active:scale-95"
            aria-label="Anterior"
            id="instagram-btn-prev"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-[-15px] sm:right-[-30px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-ivory hover:text-rose-brand hover:border-rose-brand/30 transition-all duration-300 shadow-lg active:scale-95"
            aria-label="Próximo"
            id="instagram-btn-next"
          >
            <ChevronRight size={20} />
          </button>

          {/* Posts View Area */}
          <div className="overflow-hidden py-4 px-1" id="instagram-slides-view">
            <div 
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{ transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 24}px))` }}
              ref={carouselRef}
              id="instagram-carousel-moving-track"
            >
              {INSTAGRAM_POSTS.map((post) => (
                <div 
                  key={post.id}
                  className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 bg-plum-deep/50 border border-white/10 rounded-xl overflow-hidden shadow-soft group flex flex-col justify-between"
                  id={`instagram-post-card-${post.id}`}
                >
                  {/* Post Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-black/40">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      id={`instagram-post-img-${post.id}`}
                    />
                    
                    {/* Hover Overlay with Stats (Standard Insta visual cue) */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-ivory font-sans font-bold text-sm">
                      <span className="flex items-center gap-1.5"><Heart size={18} className="fill-rose-brand text-rose-brand" /> {post.likes}</span>
                      <span className="flex items-center gap-1.5"><MessageCircle size={18} className="fill-white text-white" /> {post.comments}</span>
                    </div>

                    {/* Tag label */}
                    <span className="absolute top-4 left-4 bg-[#141414]/90 backdrop-blur-sm border border-white/10 text-rose-brand text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                      {post.tag}
                    </span>
                  </div>

                  {/* Post Caption Body */}
                  <div className="p-6 text-left flex-1 flex flex-col justify-between">
                    <div>
                      {/* Interactive Author Line resembles Instagram App */}
                      <div className="flex items-center gap-2 mb-3.5">
                        <div className="w-5 h-5 bg-gradient-clay rounded-full flex items-center justify-center text-[8px] font-bold text-charcoal">EC</div>
                        <span className="text-[11px] uppercase tracking-wider text-sand-deep font-semibold">@erico.educacaorelacional</span>
                      </div>
                      
                      <h3 className="font-serif text-lg text-ivory font-bold leading-snug mb-2 group-hover:text-rose-brand transition-colors duration-300">
                        {post.title}
                      </h3>
                      
                      <p className="font-sans text-xs text-sand/80 leading-relaxed font-light line-clamp-3">
                        {post.caption}
                      </p>
                    </div>

                    {/* Link interaction */}
                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-sand-deep font-mono tracking-tighter">Clique para ver post</span>
                      <a 
                        href={CONFIG.INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-peach hover:text-peach/80 transition-colors inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest"
                      >
                        Instagram <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6" id="instagram-dots">
            {INSTAGRAM_POSTS.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-350 ${currentIndex === idx ? "w-6 bg-rose-brand" : "w-1.5 bg-white/20"}`}
                aria-label={`Ir para slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Global Redirect Banner CTA */}
        <div className="mt-16 text-center reveal delay-200" id="instagram-redirect-block">
          <a
            href={CONFIG.INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-white/10 hover:border-rose-brand/30 bg-plum-deep/40 hover:bg-plum-deep px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest text-ivory hover:text-rose-brand shadow-soft transition-all duration-300"
            id="instagram-global-cta-button"
          >
            <Instagram size={16} /> Acompanhar @erico.educacaorelacional no Instagram
          </a>
        </div>
      </div>
    </section>
  );
};
