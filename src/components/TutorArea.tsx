import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSupabase, UserProfile } from "../context/SupabaseCtx";
import { supabase } from "../lib/supabase";
import { 
  KeyRound, 
  User, 
  Calendar, 
  Plus, 
  CheckCircle, 
  BookOpen, 
  Sparkles, 
  LogOut, 
  AlertCircle, 
  FileText, 
  Download, 
  Smile, 
  Frown, 
  Zap, 
  CheckSquare,
  ChevronRight,
  MessageCircle,
  HelpCircle,
  Award,
  Trophy,
  Flame,
  MessageSquare,
  Users,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Send,
  Image,
  ThumbsUp,
  ExternalLink,
  Laptop,
  Clock,
  Search,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG } from "../config";

interface FeedPost {
  id: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: any;
  category: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: any;
  isAdmin: boolean;
}

export const TutorArea: React.FC = () => {
  const { 
    user, 
    userProfile, 
    isAuthLoading, 
    loginWithGoogle, 
    logout,
    updateXpAndProgress 
  } = useSupabase();

  const [activeTab, setActiveTab] = useState<"perfil" | "clinica" | "estudos" | "comunidade">("perfil");
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Real-time listeners for Community Feed and Direct Chat
  useEffect(() => {
    if (!user) return;

    // Fetch Feed
    const fetchFeed = async () => {
      const { data } = await supabase
        .from('feed_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setFeedPosts(data as any);
    };

    // Listen for changes
    const feedSubscription = supabase
      .channel('feed_posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feed_posts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setFeedPosts(prev => [payload.new as any, ...prev]);
        }
      })
      .subscribe();

    fetchFeed();

    // Fetch Chat
    const fetchChat = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });
      if (data) setChatMessages(data as any);
    };

    const chatSubscription = supabase
      .channel('chat_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        setChatMessages(prev => [...prev, payload.new as any]);
      })
      .subscribe();

    fetchChat();

    return () => {
      feedSubscription.unsubscribe();
      chatSubscription.unsubscribe();
    };
  }, [user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !user || !userProfile) return;

    try {
      await supabase.from('chat_messages').insert({
        sender: userProfile.name,
        text: chatInput,
        is_admin: userProfile.is_authorized,
        user_id: user.id
      });
      setChatInput("");
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  // Mocked Clinical content for the portal logic
  const clinicalEvolution = [
    { title: "Segurança de Base", value: 85, color: "bg-forest", icon: <CheckCircle size={14} /> },
    { title: "Comunicação Não-Verbal", value: 72, color: "bg-peach", icon: <MessageSquare size={14} /> },
    { title: "Tolerância a Frustração", value: 45, color: "bg-rose-brand", icon: <Zap size={14} /> },
    { title: "Passeio Nobre", value: 60, color: "bg-plum-brand", icon: <Users size={14} /> },
  ];

  const badges = [
    { id: "foco-absoluto", label: "Foco Absoluto", icon: "👁️", desc: "Primeiro contato visual voluntário na rua" },
    { id: "passeio-nobre", label: "Passeio Nobre", icon: "🦮", desc: "15 minutos de guia relaxada" },
    { id: "tutor-guardiao", label: "Tutor Guardião", icon: "🛡️", desc: "Proteção emocional em ambiente hostil" },
  ];

  // Teleconsulta simulator states
  const [inActiveCall, setInActiveCall] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callMode, setCallMode] = useState<"simulated" | "real">("simulated");
  const [callChatMessages, setCallChatMessages] = useState<{author: string, text: string}[]>([
    { author: "Érico", text: "Olá! Já estou te vendo por aqui. Como foi a semana com o Max?" }
  ]);
  const [callChatInput, setCallChatInput] = useState("");

  useEffect(() => {
    let interval: any;
    if (inActiveCall) {
      interval = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [inActiveCall]);

  const formatCallTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendCallChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callChatInput.trim()) return;
    setCallChatMessages(prev => [...prev, { author: userProfile?.name || "Tutor", text: callChatInput }]);
    setCallChatInput("");

    // Simulate AI response
    setTimeout(() => {
      setCallChatMessages(prev => [...prev, { author: "Érico", text: "Ótima observação. Vamos focar nisso no exercício prático de agora." }]);
    }, 1500);
  };

  if (isAuthLoading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-peach border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sand-deep font-mono text-xs uppercase tracking-widest">Sincronizando prontuários...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 px-6 max-w-xl mx-auto text-center" id="tutor-auth-required">
        <div className="w-20 h-20 bg-plum-deep/40 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
          <KeyRound size={32} className="text-peach" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-ivory mb-4">Acesso Exclusivo para Alunos</h2>
        <p className="text-sm text-sand-deep leading-relaxed mb-8">
          Este é um espaço clínico dedicado ao acompanhamento dos tutores em processo de Educação Relacional. Se você já é aluno, faça seu login para acessar seu prontuário, evolução e comunidade.
        </p>
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white text-charcoal py-4 rounded-lg font-sans text-xs font-bold uppercase tracking-widest hover:bg-ivory transition-all shadow-lift cursor-pointer active:scale-95"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          <span>Entrar com Google</span>
        </button>
      </div>
    );
  }

  // --- LOGGED IN UI ---
  const tutorProfile = userProfile || {
    name: user.user_metadata?.full_name || "Tutor",
    dog_name: "Seu Cão",
    dog_breed: "Não Informada",
    dog_age: "Não Informada",
    xp_points: 0,
    consult_progress: 0,
    streak_count: 0,
    unlocked_badges: [],
    next_consult: "A agendar",
    focus_area: "Iniciando jornada"
  } as UserProfile;

  return (
    <section className="py-12 px-4 sm:px-6 bg-charcoal/30 min-h-screen" id="portal-logged-view">
      <div className="max-w-6xl mx-auto">
        
        {/* MOBILE HEADER */}
        <div className="lg:hidden flex items-center justify-between mb-8 bg-black/40 p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-clay flex items-center justify-center text-charcoal font-bold text-sm">
              {tutorProfile.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-white text-sm font-bold leading-none">{tutorProfile.name}</h3>
              <p className="text-peach text-[10px] font-mono uppercase mt-1">{tutorProfile.dog_name}</p>
            </div>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
            <Sparkles size={20} className={isMenuOpen ? "text-peach" : ""} />
          </button>
        </div>

        {/* TOP STATUS BAR (DESKTOP) */}
        <div className="hidden lg:grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-8 bg-black/40 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-clay flex items-center justify-center text-charcoal font-bold text-2xl border-4 border-black/20">
                {tutorProfile.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-serif text-2xl text-ivory font-bold">{tutorProfile.name} <span className="text-peach">&</span> {tutorProfile.dog_name}</h2>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-[10px] font-mono text-sand/60 uppercase tracking-widest">{tutorProfile.dog_breed} • {tutorProfile.dog_age}</span>
                  <div className="h-1 w-1 rounded-full bg-white/20" />
                  <span className="text-[10px] font-mono text-forest uppercase tracking-widest font-bold">Vínculo em Construção</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <span className="block text-[10px] font-mono text-sand/50 uppercase">XP Relacional</span>
                <span className="text-xl font-bold text-ivory">{tutorProfile.xp_points}</span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] font-mono text-sand/50 uppercase">Ofensiva</span>
                <span className="text-xl font-bold text-peach flex items-center gap-1.5 justify-center">
                  <Flame size={16} fill="currentColor" /> {tutorProfile.streak_count}
                </span>
              </div>
              <button onClick={logout} className="p-3 bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 rounded-full transition-colors group cursor-pointer">
                <LogOut size={18} />
              </button>
            </div>
          </div>

          <div className="col-span-4 bg-gradient-to-br from-plum-deep to-charcoal border border-plum-brand/20 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calendar size={60} />
            </div>
            <span className="text-[9px] font-mono text-peach uppercase tracking-widest font-bold">Próxima Consulta</span>
            <h4 className="text-ivory font-serif text-lg mt-1 font-bold">{tutorProfile.next_consult}</h4>
            <p className="text-[10px] text-sand/60 mt-2 font-sans leading-tight">Prepare os vídeos da semana para análise clínica.</p>
            <button className="mt-4 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-2 hover:gap-3 transition-all cursor-pointer">
              Ver Preparação <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 pb-2" id="portal-tabs">
          {[
            { id: "perfil", label: "Prontuário", icon: <User size={14} /> },
            { id: "clinica", label: "Sala Clínica", icon: <Video size={14} /> },
            { id: "estudos", label: "Biblioteca", icon: <BookOpen size={14} /> },
            { id: "comunidade", label: "Alcateia", icon: <Users size={14} /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? "bg-ivory text-charcoal border-transparent shadow-warm"
                    : "bg-black/20 text-sand/60 border-white/5 hover:border-white/10"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENT AREA */}
        <AnimatePresence mode="wait">
          {activeTab === "perfil" && (
            <motion.div
              key="perfil-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* LEFT: EVOLUTION AND FOCUS */}
              <div className="lg:col-span-8 space-y-8">

                {/* CORE PROGRESS CARD */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-forest/5 rounded-full blur-[80px] pointer-events-none" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                      <span className="text-[10px] font-mono text-forest uppercase tracking-widest font-bold">Foco Terapêutico Atual</span>
                      <h3 className="font-serif text-2xl text-ivory font-bold mt-1">{tutorProfile.focus_area}</h3>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-3xl font-serif font-bold text-white">{tutorProfile.consult_progress}%</span>
                        <div className="w-12 h-12 rounded-full border-4 border-forest/20 border-t-forest flex items-center justify-center">
                          <Trophy size={16} className="text-forest" />
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-sand/40 uppercase tracking-widest">Evolução do Protocolo</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {clinicalEvolution.map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-sand">
                          <span className="flex items-center gap-2">{item.icon} {item.title}</span>
                          <span className="text-ivory font-mono">{item.value}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className={`h-full ${item.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HISTORIC SESSIONS */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-sand/60 px-2 flex items-center gap-2">
                    <Clock size={12} /> Diário de Bordo & Notas Clínicas
                  </h4>

                  {[
                    { date: "15 Mai", type: "Consulta", title: "Ajuste de Expectativa & Reatividade", desc: "Observada melhora drástica na resposta ao som do interfone.", xp: "+50" },
                    { date: "12 Mai", type: "Prática", title: "Treino de Relaxamento em Guia", desc: "Max conseguiu manter o ócio por 4 minutos em ambiente externo.", xp: "+30" },
                    { date: "08 Mai", type: "Módulo", title: "Concluído: Biologia do Comportamento", desc: "Tutor demonstrou plena compreensão da pirâmide de necessidades.", xp: "+100" },
                  ].map((session, i) => (
                    <div key={i} className="bg-black/20 border border-white/5 p-5 rounded-xl hover:bg-black/30 transition-all group">
                      <div className="flex gap-5">
                        <div className="text-center shrink-0 border-r border-white/5 pr-5">
                          <span className="block text-[10px] font-mono text-sand/40 uppercase">{session.date.split(" ")[1]}</span>
                          <span className="text-xl font-serif font-bold text-ivory">{session.date.split(" ")[0]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-mono text-peach uppercase font-bold tracking-widest">{session.type}</span>
                            <span className="text-[10px] font-mono text-forest font-bold">{session.xp} XP</span>
                          </div>
                          <h5 className="text-sm font-bold text-white group-hover:text-ivory transition-colors">{session.title}</h5>
                          <p className="text-xs text-sand-deep/80 mt-1 leading-relaxed">{session.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: BADGES AND SIDEBAR */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-sand/60 mb-6 flex items-center gap-2">
                    <Award size={14} className="text-peach" /> Distintivos Conquistados
                  </h4>
                  <div className="space-y-4">
                    {badges.map((badge) => {
                      const isUnlocked = tutorProfile.unlocked_badges.includes(badge.id);
                      return (
                        <div key={badge.id} className={`flex items-start gap-4 p-3 rounded-lg border transition-all ${
                          isUnlocked ? "bg-peach/5 border-peach/20" : "bg-black/20 border-white/5 grayscale opacity-40"
                        }`}>
                          <div className="text-2xl pt-1">{badge.icon}</div>
                          <div>
                            <h5 className="text-xs font-bold text-ivory">{badge.label}</h5>
                            <p className="text-[10px] text-sand-deep mt-0.5 leading-snug">{badge.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 border border-plum-brand/20 bg-plum-deep/10 rounded-2xl text-center">
                  <div className="w-12 h-12 bg-plum-brand/20 rounded-full flex items-center justify-center mx-auto mb-4 text-peach">
                    <HelpCircle size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-ivory mb-2">Dúvida Urgente?</h4>
                  <p className="text-[11px] text-sand-deep leading-relaxed mb-4">A Alcateia está ativa! Mande sua dúvida na comunidade ou fale direto no chat.</p>
                  <button onClick={() => setActiveTab("comunidade")} className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-sans text-[10px] font-bold uppercase tracking-widest text-white transition-all cursor-pointer">
                    Abrir Alcateia
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "clinica" && (
            <motion.div
              key="clinica-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-5xl mx-auto"
            >
              <AnimatePresence mode="wait">
                {!inActiveCall ? (
                  <motion.div
                    key="pre-call"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="bg-black/40 border border-white/5 rounded-3xl p-10 text-center relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-forest via-peach to-rose-brand" />

                    <div className="mb-8">
                      <div className="w-20 h-20 bg-peach/10 rounded-full flex items-center justify-center mx-auto mb-6 text-peach relative">
                        <Video size={32} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-forest rounded-full border-2 border-[#160E1A] animate-pulse" />
                      </div>
                      <h2 className="font-serif text-3xl font-bold text-ivory mb-3">Sala Virtual de Teleconsulta</h2>
                      <p className="text-sand-deep text-sm max-w-lg mx-auto leading-relaxed">
                        Inicie sua sessão de orientação clínica em tempo real com Érico Cavalheiro. Prepare sua guia, petiscos e posicione a câmera onde o cão tenha espaço de movimento.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-10">
                      <button
                        onClick={() => { setCallMode("simulated"); setInActiveCall(true); }}
                        className="flex flex-col items-center gap-3 p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group cursor-pointer"
                      >
                        <Laptop className="text-sand/40 group-hover:text-peach transition-colors" size={24} />
                        <div>
                          <span className="block text-xs font-bold text-white uppercase tracking-wider">Sala Privativa</span>
                          <span className="text-[10px] text-sand/40">Conexão Peer-to-Peer</span>
                        </div>
                      </button>
                      <button
                        onClick={() => { setCallMode("real"); setInActiveCall(true); }}
                        className="flex flex-col items-center gap-3 p-6 bg-forest/10 hover:bg-forest/20 border border-forest/20 rounded-2xl transition-all group cursor-pointer"
                      >
                        <Users className="text-forest" size={24} />
                        <div>
                          <span className="block text-xs font-bold text-forest uppercase tracking-wider">Entrar no Jitsi</span>
                          <span className="text-[10px] text-forest/60">Backup de Alta Estabilidade</span>
                        </div>
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-6 text-[11px] font-mono text-sand/40 uppercase tracking-[0.2em]">
                      <span className="flex items-center gap-2"><CheckCircle size={12} className="text-forest" /> Criptografia Ponta-a-Ponta</span>
                      <span className="flex items-center gap-2"><CheckCircle size={12} className="text-forest" /> Gravação Clínica Ativa</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="active-call"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6"
                  >
                    {/* TOP BAR CALL */}
                    <div className="bg-[#0f0913] border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">Sessão em Andamento</span>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <span className="text-xs font-mono text-peach font-bold">{formatCallTime(callDuration)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-sand/40 uppercase hidden sm:block">Conexão Estável (42ms)</span>
                        <button onClick={() => setInActiveCall(false)} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase rounded-lg transition-colors cursor-pointer">
                          Encerrar
                        </button>
                      </div>
                    </div>

                    {/* MAIN VIDEO GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      
                      {/* MAIN FEED */}
                      <div className="lg:col-span-3 aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
                        {callMode === "real" ? (
                          <iframe
                            src={`https://meet.jit.si/EricoCavalheiro_EducacaoRelacional_${tutorProfile.name.replace(/\s+/g, '_')}#userInfo.displayName="${tutorProfile.name}"&interfaceConfig.DISABLE_DOMINANT_SPEAKER_INDICATOR=true&config.prejoinPageEnabled=false`}
                            allow="camera; microphone; fullscreen; display-capture; autoplay"
                            className="w-full h-full border-0"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center relative">
                            {/* Simulator UI */}
                            <div className="absolute inset-0 bg-[#1a0f21]">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                              {/* Big Erico Video Simulator */}
                              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-24 h-24 bg-gradient-clay rounded-full animate-pulse flex items-center justify-center mb-4 border-2 border-white/25">
                                  <span className="text-2xl">🐶</span>
                                </div>
                                <h4 className="font-serif text-lg font-bold text-white">Érico Cavalheiro</h4>
                                <p className="text-[10px] text-peach mt-1 font-mono uppercase tracking-widest">Consultor Titular</p>
                              </div>
                            </div>

                            {/* Participant Label */}
                            <div className="absolute bottom-6 left-6 p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-peach/20 flex items-center justify-center text-peach font-bold text-xs">E</div>
                              <div>
                                <span className="block text-[10px] font-bold text-white leading-none">Érico Cavalheiro</span>
                                <span className="text-[8px] text-sand/60">Estúdio Educacional</span>
                              </div>
                            </div>

                            {/* Self View (Small) */}
                            <div className="absolute bottom-6 right-6 w-36 aspect-video bg-charcoal rounded-xl border border-white/20 overflow-hidden shadow-2xl">
                              {isCamOn ? (
                                <div className="w-full h-full bg-forest/10 flex items-center justify-center">
                                  <div className="text-center">
                                    <span className="block text-[9px] font-bold text-white uppercase">{tutorProfile.name}</span>
                                    <span className="text-[7px] text-forest">● {tutorProfile.dog_name} Ativo</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full h-full bg-black flex items-center justify-center">
                                  <VideoOff size={16} className="text-white/20" />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CALL CHAT */}
                      <div className="lg:col-span-1 bg-black/40 border border-white/5 rounded-3xl p-5 flex flex-col h-full min-h-[400px]">
                        <h4 className="text-[10px] font-bold text-sand/60 uppercase tracking-widest mb-4 border-b border-white/5 pb-3 flex items-center gap-2">
                          <MessageSquare size={12} /> Chat da Sessão
                        </h4>

                        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar mb-4 pr-1">
                          {callChatMessages.map((msg, i) => (
                            <div key={i} className={`p-3 rounded-xl text-[11px] leading-relaxed ${
                              msg.author === "Érico" ? "bg-plum-deep/40 text-sand" : "bg-white/5 text-ivory border border-white/5"
                            }`}>
                              <strong className={`block text-[9px] uppercase tracking-wider mb-1 ${
                                msg.author === "Érico" ? "text-peach" : "text-white/40"
                              } font-mono`}>{msg.author}</strong>
                              {msg.text}
                            </div>
                          ))}
                        </div>

                        <form onSubmit={handleSendCallChat} className="flex gap-2">
                          <input
                            type="text"
                            value={callChatInput}
                            onChange={(e) => setCallChatInput(e.target.value)}
                            placeholder="Escreva..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white outline-none focus:border-peach/30 transition-all"
                          />
                          <button className="p-3 bg-peach text-charcoal rounded-lg hover:brightness-110 transition-all cursor-pointer">
                            <Send size={14} />
                          </button>
                        </form>
                      </div>

                    </div>

                    {/* CONTROLS BAR */}
                    <div className="flex items-center justify-center gap-4 bg-black/20 p-6 rounded-3xl border border-white/5">
                      <button
                        onClick={() => setIsMicOn(!isMicOn)}
                        className={`p-4 rounded-full transition-all cursor-pointer ${
                          isMicOn ? "bg-white/5 text-white hover:bg-white/10" : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                      </button>
                      <button
                        onClick={() => setIsCamOn(!isCamOn)}
                        className={`p-4 rounded-full transition-all cursor-pointer ${
                          isCamOn ? "bg-white/5 text-white hover:bg-white/10" : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {isCamOn ? <Video size={20} /> : <VideoOff size={20} />}
                      </button>
                      <div className="w-[1px] h-10 bg-white/10 mx-2" />
                      <button className="px-8 py-4 bg-white text-charcoal rounded-full text-xs font-bold uppercase tracking-widest hover:bg-ivory transition-all cursor-pointer">
                        Compartilhar Tela de Treino
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === "estudos" && (
            <motion.div
              key="estudos-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                { title: "Módulo 1: Biologia do Comportamento", time: "2h 40min", progress: 100, icon: "🧠" },
                { title: "Módulo 2: O Olhar do Educador", time: "3h 15min", progress: 65, icon: "👁️" },
                { title: "Módulo 3: Prática Relacional", time: "4h 20min", progress: 12, icon: "🦮" },
                { title: "Extra: Ansiedade de Separação", time: "55min", progress: 0, icon: "🏠" },
                { title: "Extra: Socialização Reversa", time: "1h 10min", progress: 0, icon: "🐕" },
              ].map((course, i) => (
                <div key={i} className="bg-black/40 border border-white/5 rounded-2xl p-6 group hover:border-plum-brand/30 transition-all cursor-pointer">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{course.icon}</div>
                  <h4 className="text-ivory font-serif text-lg font-bold mb-2 group-hover:text-peach transition-colors">{course.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-sand/40 uppercase mb-4">
                    <span>{course.time}</span>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <span>Videoaula</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold text-sand/60">
                      <span>PROGRESSO</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-forest transition-all duration-1000" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "comunidade" && (
            <motion.div
              key="comunidade-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* FEED (8 cols) */}
              <div className="lg:col-span-8 space-y-6">

                {/* CREATE POST MOCK */}
                <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-clay flex items-center justify-center text-charcoal font-bold text-sm shrink-0">
                      {tutorProfile.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <textarea
                        placeholder="Compartilhe uma vitória relacional da semana..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-peach/30 transition-all resize-none h-24"
                      />
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <div className="flex gap-2">
                          <button className="p-2.5 text-sand/40 hover:text-white transition-colors"><Image size={18} /></button>
                          <button className="p-2.5 text-sand/40 hover:text-white transition-colors"><Video size={18} /></button>
                        </div>
                        <button className="px-6 py-2 bg-peach text-charcoal rounded-lg text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer">
                          Publicar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FEED POSTS */}
                {feedPosts.length === 0 ? (
                  <div className="space-y-6">
                    {[
                      { author: "Beatriz M.", pet: "Luna (Golden)", content: "Hoje conseguimos o primeiro passeio sem nenhuma tensão na guia perto de outros cães! O método de ancoragem relacional mudou tudo.", likes: 24, comments: 5, avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
                      { author: "Camila R.", pet: "Bento (SRD)", content: "Max, as dicas sobre o enriquecimento ambiental para cães reativos foram ótimas. Bento dormiu a tarde toda depois do exercício olfativo.", likes: 18, comments: 2, avatar: "https://randomuser.me/api/portraits/women/32.jpg" },
                    ].map((post, i) => (
                      <div key={i} className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full border border-white/10" />
                              <div>
                                <h5 className="text-sm font-bold text-white leading-none">{post.author}</h5>
                                <span className="text-[10px] text-peach font-mono uppercase mt-1 inline-block">{post.pet}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-sand/30 uppercase">Há 4 horas</span>
                          </div>
                          <p className="text-sm text-sand-deep leading-relaxed mb-6">{post.content}</p>
                          <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                            <button className="flex items-center gap-2 text-xs text-sand/40 hover:text-peach transition-colors"><ThumbsUp size={14} /> {post.likes}</button>
                            <button className="flex items-center gap-2 text-xs text-sand/40 hover:text-white transition-colors"><MessageCircle size={14} /> {post.comments}</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  feedPosts.map((post) => (
                    <div key={post.id} className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-peach/20 flex items-center justify-center text-peach font-bold">{post.author.charAt(0)}</div>
                            <div>
                              <h5 className="text-sm font-bold text-white leading-none">{post.author}</h5>
                              <span className="text-[10px] text-peach font-mono uppercase mt-1 inline-block">{post.authorRole}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-sand-deep leading-relaxed mb-6">{post.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* SIDEBAR (4 cols) */}
              <div className="lg:col-span-4 space-y-8">

                {/* DIRECT CHAT ALCATEIA */}
                <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[500px]">
                  <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                    <h4 className="text-[11px] font-bold text-ivory uppercase tracking-widest flex items-center gap-2">
                      <Zap size={14} className="text-peach" /> Chat em Tempo Real
                    </h4>
                    <span className="flex items-center gap-1.5 text-[9px] font-mono text-forest uppercase font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" /> 12 On
                    </span>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-4">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`max-w-[85%] ${msg.sender === userProfile?.name ? "ml-auto" : ""}`}>
                        <div className={`p-3 rounded-2xl text-[11px] leading-relaxed ${
                          msg.sender === userProfile?.name
                            ? "bg-ivory text-charcoal rounded-tr-none"
                            : "bg-white/5 text-sand border border-white/5 rounded-tl-none"
                        }`}>
                          {msg.sender !== userProfile?.name && <strong className="block text-[9px] uppercase tracking-wider mb-1 opacity-60">{msg.sender}</strong>}
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-4 bg-black/20 border-t border-white/10 flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Mande um oi..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white outline-none focus:border-peach/30 transition-all"
                    />
                    <button className="p-3 bg-peach text-charcoal rounded-lg hover:brightness-110 transition-all cursor-pointer">
                      <Send size={14} />
                    </button>
                  </form>
                </div>

                <div className="bg-forest/10 border border-forest/20 p-6 rounded-2xl">
                  <h4 className="text-sm font-bold text-forest mb-2">Desafio da Semana</h4>
                  <p className="text-[11px] text-ivory/80 leading-relaxed mb-4">"Registre o momento em que seu cão escolhe relaxar sem você pedir. A autonomia é a chave da segurança."</p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-[#160E1A] bg-forest/30" />)}
                      <span className="pl-4 text-[9px] font-bold text-forest uppercase">+8 participaram</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
