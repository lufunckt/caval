import React, { useState, useEffect, useRef, useMemo } from "react";
import { useFirebase } from "../context/FirebaseCtx";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";
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
  X,
  Camera,
  Heart,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TrainingLog {
  id: string;
  date: string;
  emotion: "focado" | "calmo" | "ansioso" | "disperso";
  notes: string;
}

interface ForumPost {
  id: string;
  author: string;
  dog: string;
  time: string;
  content: string;
  avatarLetter: string;
  likes: number;
  hasLiked?: boolean;
  comments: { author: string; text: string }[];
}

interface DogPhotoPost {
  id: string;
  author: string;
  dog: string;
  time: string;
  caption: string;
  imageUrl: string;
  avatarLetter: string;
  likes: number;
  hasLiked?: boolean;
  comments: { author: string; text: string }[];
  createdAt?: any;
}

interface ChatMessage {
  id: string;
  sender: "tutor" | "erico";
  text: string;
  time: string;
}

export const TutorArea: React.FC = () => {
  const { 
    user, 
    userProfile, 
    isAuthLoading, 
    loginWithGoogle, 
    logout: googleLogout, 
    createProfile, 
    updateXpAndProgress 
  } = useFirebase();

  const isEricoAdmin = !!user && user.email === "ericocavalheiro.psico@gmail.com";
  const isRealDb = !!user && (!!userProfile || isEricoAdmin);

  const [accessCode, setAccessCode] = useState("");
  const [isLocalLoggedIn, setIsLocalLoggedIn] = useState(false);
  const isLoggedIn = user ? (isEricoAdmin ? true : !!userProfile) : isLocalLoggedIn;

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<"progresso" | "comunidade" | "teleatendimento" | "admin">("progresso");
  const [communityMobileTab, setCommunityMobileTab] = useState<"chat" | "forum">("chat");
  const [progressoMobileTab, setProgressoMobileTab] = useState<"checklist" | "diario">("diario");
  
  // Real database lists
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [allTutors, setAllTutors] = useState<any[]>([]);
  const [selectedTutorProfile, setSelectedTutorProfile] = useState<any>(null);
  const activeTutorUid = isEricoAdmin ? selectedTutorId : (user?.uid || null);

  // Onboard
  const [onboardName, setOnboardName] = useState("");
  const [onboardDogName, setOnboardDogName] = useState("");
  const [onboardDogBreed, setOnboardDogBreed] = useState("");
  const [onboardDogAge, setOnboardDogAge] = useState("");

  // Admin Profile Editor (Érico Cavalheiro view)
  const [adminFocusArea, setAdminFocusArea] = useState("");
  const [adminNextConsult, setAdminNextConsult] = useState("");
  const [adminConsultProgress, setAdminConsultProgress] = useState(65);
  const [adminXpPoints, setAdminXpPoints] = useState(380);
  const [adminStreakCount, setAdminStreakCount] = useState(5);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState("");

  // Sync onboardName when user changes
  useEffect(() => {
    if (user && user.displayName) {
      setOnboardName(user.displayName);
    }
  }, [user]);

  // Sync admin states when Selected Tutor Profile loads or changes
  useEffect(() => {
    if (selectedTutorProfile) {
      setAdminFocusArea(selectedTutorProfile.focusArea || "");
      setAdminNextConsult(selectedTutorProfile.nextConsult || "");
      setAdminConsultProgress(selectedTutorProfile.consultProgress || 65);
      setAdminXpPoints(selectedTutorProfile.xpPoints || 380);
      setAdminStreakCount(selectedTutorProfile.streakCount || 5);
    }
  }, [selectedTutorProfile]);

  const handleSaveAdminData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTutorId) return;
    try {
      await updateDoc(doc(db, "users", selectedTutorId), {
        focusArea: adminFocusArea,
        nextConsult: adminNextConsult,
        consultProgress: Number(adminConsultProgress),
        xpPoints: Number(adminXpPoints),
        streakCount: Number(adminStreakCount),
        updatedAt: serverTimestamp()
      });
      setAdminSuccessMsg("Dados clínicos atualizados no prontuário remoto com sucesso!");
      setTimeout(() => setAdminSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Erro ao salvar dados clínicos", err);
    }
  };

  // Custom interactive data
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [newEmotion, setNewEmotion] = useState<"focado" | "calmo" | "ansioso" | "disperso">("calmo");
  const [newNotes, setNewNotes] = useState("");
  const [logSuccess, setLogSuccess] = useState(false);

  // Daily guidelines state (interactive checklist)
  const [dailyTasks, setDailyTasks] = useState([
    { id: "task1", text: "Alimentação estruturada (trabalhar a ração como recompensa)", done: false },
    { id: "task2", text: "Exercício de limite de guias / Treino de caixa (10 minutos)", done: false },
    { id: "task3", text: "Treino de desbaste e autocontrole nas portas", done: false },
    { id: "task4", text: "Passeio estruturado com farejamento sob controle", done: false },
  ]);

  // Gamification stats
  const [streakCountState, setStreakCount] = useState(5);
  const [xpPointsState, setXpPoints] = useState(380);
  const [unlockedBadgesState, setUnlockedBadges] = useState(["foco-absoluto", "passeio-nobre", "tutor-guardiao"]);

  // Profile data
  const [tutorProfileState, setTutorProfile] = useState({
    name: "Rodrigo Cavalheiro",
    dogName: "Max",
    dogBreed: "Beagle (Filhote)",
    dogAge: "8 meses",
    focusArea: "Engajamento Relacional & Tolerância a Frustração",
    nextConsult: "28 de Maio de 2026, às 14h (Vídeo-Chamada Individual)",
    consultProgress: 65,
  });

  const currentProfile = isEricoAdmin 
    ? (selectedTutorProfile || {
        name: "Nenhum Aluno Ativo",
        dogName: "Nenhum",
        dogBreed: "",
        dogAge: "",
        focusArea: "Selecione um tutor no painel clínico no topo",
        nextConsult: "A agendar pelo WhatsApp com Érico",
        consultProgress: 65
      })
    : (isRealDb && userProfile ? userProfile : tutorProfileState);

  const currentXp = isRealDb ? (isEricoAdmin ? (selectedTutorProfile?.xpPoints || 0) : (userProfile?.xpPoints || 0)) : xpPointsState;
  const currentStreak = isRealDb ? (isEricoAdmin ? (selectedTutorProfile?.streakCount || 0) : (userProfile?.streakCount || 0)) : streakCountState;
  const currentBadges = isRealDb ? (isEricoAdmin ? (selectedTutorProfile?.unlockedBadges || []) : (userProfile?.unlockedBadges || [])) : unlockedBadgesState;

  const streakCount = currentStreak;
  const xpPoints = currentXp;
  const unlockedBadges = currentBadges;
  const tutorProfile = currentProfile;

  // Closed Community / Forum Simulator State
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    {
      id: "post-1",
      author: "Mariana Silva",
      dog: "Luna (Border Collie)",
      time: "Há 2 horas",
      content: "Pessoal, ontem apliquei o treino do limite de guias na hora do almoço. A Luna chorou um pouco no início, mas depois de 5 minutos ela deitou calmamente na passadeira e dormiu enquanto eu almoçava! Uma grande vitória de descompressão pra nós.",
      avatarLetter: "M",
      likes: 8,
      comments: [
        { author: "Carlos & Thor (Golden)", text: "Incrível, Mariana! Aqui o Thor demorou quase uma semana para entender esse limite. Persista!" },
        { author: "Érico Cavalheiro", text: "Excelente ajuste de limites passive-ativos, Mariana! Isso reduz a ansiedade de antecipação. Parabéns pela paciência." }
      ]
    },
    {
      id: "post-2",
      author: "Carlos Mendonça",
      dog: "Thor (Golden Retriever)",
      time: "Há 1 dia",
      content: "Alguém enfrentando dificuldades com o Thor puxando no início do passeio? Quando coloco a peitoral ele fica extremamente focado na porta. O limite de limiar de porta ajudou um pouco, mas aceito sugestões praticadas.",
      avatarLetter: "C",
      likes: 4,
      comments: [
        { author: "Rodrigo Cavalheiro", text: "O Max fazia igual! O segredo é fazer o ritual de por a guia e sentar no sofá por 5 minutos até ele relaxar antes de sequer girar a chave." }
      ]
    }
  ]);
  const [newPostContent, setNewPostContent] = useState("");
  const [forumSearchQuery, setForumSearchQuery] = useState("");

  // Forum sub-tabs: discussions or photos
  const [forumSubTab, setForumSubTab] = useState<"discussao" | "fotos">("discussao");

  // In-memory inputs for quick-replies (keyed by post/photo id)
  const [forumCommentInput, setForumCommentInput] = useState<{ [postId: string]: string }>({});
  const [photoCommentInput, setPhotoCommentInput] = useState<{ [photoId: string]: string }>({});

  // Dog photo sharing feed states
  const [dogPhotos, setDogPhotos] = useState<DogPhotoPost[]>([
    {
      id: "photo-1",
      author: "Mariana Silva",
      dog: "Luna (Border Collie)",
      time: "Há 1 hora",
      caption: "Luna relaxadíssima na passadeira após o nosso treino de desbaste de estímulos! 🧘‍♀️🐾 Foco e exaustão mental positiva.",
      imageUrl: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&q=80&w=600",
      avatarLetter: "M",
      likes: 12,
      comments: [
        { author: "Carlos & Thor (Golden)", text: "Ela parece uma estátua! Que exemplo incrível de autocontrole assistido!" },
        { author: "Érico Cavalheiro", text: "Excelente aplicação do ócio passivo estruturado, Mariana. A curvatura do pescoço relaxada mostra que ela não está tesa." }
      ]
    },
    {
      id: "photo-2",
      author: "Rodrigo Cavalheiro",
      dog: "Max (Pastor Alemão)",
      time: "Há 4 horas",
      caption: "Treino do tapete funcionando perfeitamente hoje. Max deitou-se voluntariamente diante de mim enquanto durou o almoço de domingo! 💖🍖",
      imageUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=600",
      avatarLetter: "R",
      likes: 9,
      comments: [
        { author: "Mariana & Luna (Border)", text: "Parabéns, Rodrigo! Ele é lindo! Que carinha de focado." }
      ]
    },
    {
      id: "photo-3",
      author: "Carlos Mendonça",
      dog: "Thor (Golden Retriever)",
      time: "Há 1 dia",
      caption: "Nossos rituais de desativação pré-passeio deram certo! Thor esperando com tranquilidade absoluta eu amarrar o tênis. 🐕🦺",
      imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600",
      avatarLetter: "C",
      likes: 15,
      comments: []
    }
  ]);

  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [newPhotoCaption, setNewPhotoCaption] = useState("");
  const [photoSourceMode, setPhotoSourceMode] = useState<"preset" | "upload" | "url">("preset");
  const [selectedPresetUrl, setSelectedPresetUrl] = useState("https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=600");
  const [photoUploadBase64, setPhotoUploadBase64] = useState("");
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");

  const PRESET_DOG_PHOTOS = [
    { id: "relax", url: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=600", label: "Feliz e calmo" },
    { id: "focus", url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=600", label: "Foco no tutor" },
    { id: "sleep", url: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=600", label: "Tapete relaxado" },
    { id: "play", url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600", label: "Brinquedo cognitivo" },
    { id: "outside", url: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=600", label: "Limiar externo" }
  ];

  const profileToUse = isRealDb ? userProfile : tutorProfile;

  const filteredDogPhotos = useMemo(() => {
    if (!forumSearchQuery.trim()) return dogPhotos;
    const queryLower = forumSearchQuery.toLowerCase().trim();
    return dogPhotos.filter(photo =>
      photo.caption.toLowerCase().includes(queryLower) ||
      photo.author.toLowerCase().includes(queryLower) ||
      photo.dog.toLowerCase().includes(queryLower) ||
      (photo.comments && photo.comments.some(comment =>
        comment.author.toLowerCase().includes(queryLower) ||
        comment.text.toLowerCase().includes(queryLower)
      ))
    );
  }, [dogPhotos, forumSearchQuery]);

  const filteredForumPosts = useMemo(() => {
    if (!forumSearchQuery.trim()) return forumPosts;
    const queryLower = forumSearchQuery.toLowerCase().trim();
    return forumPosts.filter(post => 
      post.content.toLowerCase().includes(queryLower) ||
      post.author.toLowerCase().includes(queryLower) ||
      post.dog.toLowerCase().includes(queryLower) ||
      post.comments.some(comment => 
        comment.author.toLowerCase().includes(queryLower) ||
        comment.text.toLowerCase().includes(queryLower)
      )
    );
  }, [forumPosts, forumSearchQuery]);

  // Clinical Consultation Chat Simulator State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "m1", sender: "erico", text: "Olá Rodrigo! Como estão os treinos diários de desbaste e limite de guia com o Max?", time: "Ontem às 10:15" },
    { id: "m2", sender: "tutor", text: "Olá Érico! Tenho notado que ele está bem mais focado nos treinos internos, mas quando saímos na rua ele se distrai muito fácil com outros cães passando.", time: "Ontem às 11:30" },
    { id: "m3", sender: "erico", text: "Entendo perfeitamente. Lembre-se de aumentar a distância em relação ao gatilho externo. Treine primeiro o foco em ruas completamente desertas antes de expô-lo ao movimento geral.", time: "Ontem às 11:45" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isEricoTyping, setIsEricoTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Teleconsulta / Active Videocall State
  const [inActiveCall, setInActiveCall] = useState(false);
  const [callMode, setCallMode] = useState<"simulado" | "real">("simulado");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callChatMessages, setCallChatMessages] = useState<{ author: string; text: string }[]>([
    { author: "Érico Cavalheiro", text: "Conexão de áudio estabelecida perfeitamente" },
    { author: "Rodrigo Cavalheiro", text: "Olá Érico, estou ouvindo bem!" }
  ]);
  const [callChatInput, setCallChatInput] = useState("");

  // Valid credentials codes
  const VALID_CODES = ["VINCOLO2026", "VIPCLIENT", "TUTOR55"];

  // Real Database Subscriptions
  useEffect(() => {
    if (!isEricoAdmin) return;
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const list = snap.docs.map(d => d.data());
      setAllTutors(list);
      // Automatically select first tutor if none selected
      if (list.length > 0 && !selectedTutorId) {
        setSelectedTutorId(list[0].uid);
      }
    });
    return () => unsub();
  }, [isEricoAdmin]);

  useEffect(() => {
    if (!isEricoAdmin || !selectedTutorId) {
      setSelectedTutorProfile(null);
      return;
    }
    const unsub = onSnapshot(doc(db, "users", selectedTutorId), (snap) => {
      if (snap.exists()) {
        setSelectedTutorProfile(snap.data());
      }
    });
    return () => unsub();
  }, [isEricoAdmin, selectedTutorId]);

  useEffect(() => {
    if (!isRealDb || !activeTutorUid) return;
    const q = query(collection(db, "users", activeTutorUid, "logs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setLogs(snap.docs.map(d => d.data() as TrainingLog));
    }, (err) => {
      console.error("Error fetching logs", err);
    });
    return () => unsub();
  }, [isRealDb, activeTutorUid]);

  useEffect(() => {
    if (!isRealDb || !activeTutorUid) return;
    const q = query(collection(db, "users", activeTutorUid, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setChatMessages(snap.docs.map(d => d.data() as ChatMessage));
    }, (err) => {
      console.error("Error fetching chats", err);
    });
    return () => unsub();
  }, [isRealDb, activeTutorUid]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "forum_posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setForumPosts(snap.docs.map(d => d.data() as ForumPost));
      }
    }, (err) => {
      console.error("Error fetching forum", err);
    });

    const photosQ = query(collection(db, "dog_photos"), orderBy("createdAt", "desc"));
    const unsubPhotos = onSnapshot(photosQ, (snap) => {
      if (!snap.empty) {
        setDogPhotos(snap.docs.map(d => d.data() as DogPhotoPost));
      }
    }, (err) => {
      console.error("Error fetching dog photos", err);
    });

    return () => {
      unsub();
      unsubPhotos();
    };
  }, [user]);

  useEffect(() => {
    // Local session simulation fallback (if not signed in with Google)
    if (user) return;
    const session = localStorage.getItem("erico_tutor_logged");
    if (session === "true") {
      setIsLocalLoggedIn(true);
    }

    // Load custom logs from local
    const savedLogs = localStorage.getItem("erico_tutor_logs");
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    } else {
      const initialLogs: TrainingLog[] = [
        {
          id: "log-seed-1",
          date: "22/05/2026",
          emotion: "focado",
          notes: "O Max respondeu perfeitamente ao treino do tapete hoje! Ficou deitado enquanto eu abria a porta da sala por 30 segundos. Evolução nítida no autocontrole."
        },
        {
          id: "log-seed-2",
          date: "19/05/2026",
          emotion: "ansioso",
          notes: "No início do passeio ele puxou bastante querendo ir até outro cão. Respirei fundo, apliquei o limite de guia e esperei ele acalmar para voltar a andar."
        }
      ];
      setLogs(initialLogs);
      localStorage.setItem("erico_tutor_logs", JSON.stringify(initialLogs));
    }
  }, [user, isLocalLoggedIn]);

  // Audio/timer call triggers
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (inActiveCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [inActiveCall]);

  // Chat scroll sync
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isEricoTyping]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = accessCode.trim().toUpperCase();

    if (!cleanCode) {
      setErrorMsg("Por favor, informe seu código de tutor.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      if (VALID_CODES.includes(cleanCode)) {
        setIsLocalLoggedIn(true);
        localStorage.setItem("erico_tutor_logged", "true");
        setAccessCode("");
      } else {
        setErrorMsg("Código inválido. Fale com o Érico se esqueceu seu código.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setErrorMsg("");
    setTimeout(() => {
      setIsLocalLoggedIn(true);
      localStorage.setItem("erico_tutor_logged", "true");
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = async () => {
    if (user) {
      await googleLogout();
    } else {
      setIsLocalLoggedIn(false);
      localStorage.removeItem("erico_tutor_logged");
    }
  };

  // Toggle tasks and update XP/progress
  const toggleTask = async (id: string) => {
    let isAdded = false;
    setDailyTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, done: !t.done } : t);
      isAdded = updated.find(u => u.id === id)?.done || false;
      return updated;
    });

    const xpToChg = isAdded ? 25 : -25;
    if (isRealDb) {
      await updateXpAndProgress(xpToChg, isAdded ? 2 : -2);
    } else {
      setXpPoints(prev => Math.max(0, prev + xpToChg));
      setTutorProfile(p => ({ ...p, consultProgress: Math.max(65, Math.min(100, p.consultProgress + (isAdded ? 2 : -2))) }));
    }
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotes.trim()) return;

    const todayDate = new Date().toLocaleDateString("pt-BR");
    
    if (isRealDb && activeTutorUid) {
      const logId = "log-" + Date.now();
      const newEntry = {
        id: logId,
        userId: activeTutorUid,
        date: todayDate,
        emotion: newEmotion,
        notes: newNotes.trim(),
        createdAt: serverTimestamp()
      };
      try {
        await setDoc(doc(db, "users", activeTutorUid, "logs", logId), newEntry);
        setNewNotes("");
        setLogSuccess(true);
        await updateXpAndProgress(50, 2);
        setTimeout(() => setLogSuccess(false), 3000);
      } catch (err) {
        console.error("Error saving log to Firestore", err);
      }
    } else {
      const newEntry: TrainingLog = {
        id: "log-" + Date.now(),
        date: todayDate,
        emotion: newEmotion,
        notes: newNotes.trim()
      };
      const updated = [newEntry, ...logs];
      setLogs(updated);
      localStorage.setItem("erico_tutor_logs", JSON.stringify(updated));
      setNewNotes("");
      setLogSuccess(true);
      setXpPoints(p => p + 50);
      if (streakCount < 7) {
        setStreakCount(s => s + 1);
      }
      setTimeout(() => setLogSuccess(false), 3000);
    }
  };

  // Submit Community timeline post
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const profileToUse = isRealDb ? userProfile : tutorProfile;
    if (!profileToUse) return;

    if (isRealDb && user) {
      const postId = "post-" + Date.now();
      const newPost = {
        id: postId,
        author: profileToUse.name,
        dog: `${profileToUse.dogName} (${profileToUse.dogBreed})`,
        time: "Agora mesmo",
        content: newPostContent.trim(),
        avatarLetter: profileToUse.name.charAt(0).toUpperCase(),
        likes: 0,
        createdAt: serverTimestamp()
      };
      try {
        await setDoc(doc(db, "forum_posts", postId), newPost);
        setNewPostContent("");
        await updateXpAndProgress(40, 1);
      } catch (err) {
        console.error("Error creating forum post on firestore", err);
      }
    } else {
      const newPost: ForumPost = {
        id: "post-" + Date.now(),
        author: profileToUse.name,
        dog: `${profileToUse.dogName} (${profileToUse.dogBreed})`,
        time: "Agora mesmo",
        content: newPostContent.trim(),
        avatarLetter: profileToUse.name.charAt(0).toUpperCase(),
        likes: 0,
        comments: []
      };
      setForumPosts([newPost, ...forumPosts]);
      setNewPostContent("");
      setXpPoints(p => p + 40);
    }
  };

  const handleLikePost = async (id: string) => {
    let updatedLikes = 0;
    setForumPosts(prev => 
      prev.map(p => {
        if (p.id === id) {
          const freshHasLiked = !p.hasLiked;
          updatedLikes = freshHasLiked ? p.likes + 1 : Math.max(0, p.likes - 1);
          return {
            ...p,
            hasLiked: freshHasLiked,
            likes: updatedLikes
          };
        }
        return p;
      })
    );

    if (user) {
      try {
        await updateDoc(doc(db, "forum_posts", id), {
          likes: updatedLikes
        });
      } catch (err) {
        console.error("Error updating likes on Firestore", err);
      }
    }
  };

  const handlePhotoUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPhotoUploadBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhotoPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoCaption.trim()) return;

    const profileToUse = isRealDb ? userProfile : tutorProfile;
    if (!profileToUse) return;

    let finalImageUrl = selectedPresetUrl;
    if (photoSourceMode === "upload" && photoUploadBase64) {
      finalImageUrl = photoUploadBase64;
    } else if (photoSourceMode === "url" && customPhotoUrl.trim()) {
      finalImageUrl = customPhotoUrl.trim();
    }

    const photoId = "photo-" + Date.now();
    const newPhotoPost: DogPhotoPost = {
      id: photoId,
      author: profileToUse.name,
      dog: `${profileToUse.dogName} (${profileToUse.dogBreed})`,
      time: "Agora mesmo",
      caption: newPhotoCaption.trim(),
      imageUrl: finalImageUrl,
      avatarLetter: profileToUse.name.charAt(0).toUpperCase(),
      likes: 0,
      comments: []
    };

    if (isRealDb && user) {
      try {
        const firebasePostObj = {
          ...newPhotoPost,
          id: photoId,
          createdAt: serverTimestamp()
        };
        await setDoc(doc(db, "dog_photos", photoId), firebasePostObj);
        await updateXpAndProgress(50, 1); // +50 XP for sharing a photo
      } catch (err) {
        console.error("Error creating dog photo post on firestore", err);
      }
    } else {
      setDogPhotos(prev => [newPhotoPost, ...prev]);
      setXpPoints(p => p + 50); // +50 XP locally
    }

    // Reset fields
    setNewPhotoCaption("");
    setPhotoUploadBase64("");
    setCustomPhotoUrl("");
    setShowPhotoForm(false);
  };

  const handleLikePhotoPost = async (id: string) => {
    let updatedLikes = 0;
    setDogPhotos(prev =>
      prev.map(p => {
        if (p.id === id) {
          const freshHasLiked = !p.hasLiked;
          updatedLikes = freshHasLiked ? p.likes + 1 : Math.max(0, p.likes - 1);
          return {
            ...p,
            hasLiked: freshHasLiked,
            likes: updatedLikes
          };
        }
        return p;
      })
    );

    if (user) {
      try {
        await updateDoc(doc(db, "dog_photos", id), {
          likes: updatedLikes
        });
      } catch (err) {
        console.error("Error updating photo likes on Firestore", err);
      }
    }
  };

  const handleAddComment = async (postId: string, type: "forum" | "photo", commentText: string) => {
    if (!commentText.trim()) return;
    const profileToUse = isRealDb ? userProfile : tutorProfile;
    if (!profileToUse) return;

    const authorName = profileToUse.name;
    const newComment = { author: authorName, text: commentText.trim() };

    if (type === "forum") {
      let updatedComments: { author: string; text: string }[] = [];
      setForumPosts(prev =>
        prev.map(p => {
          if (p.id === postId) {
            updatedComments = [...p.comments, newComment];
            return { ...p, comments: updatedComments };
          }
          return p;
        })
      );
      // Clear input
      setForumCommentInput(prev => ({ ...prev, [postId]: "" }));

      if (user) {
        try {
          await updateDoc(doc(db, "forum_posts", postId), {
            comments: updatedComments
          });
        } catch (err) {
          console.error("Error saving forum comment to Firestore", err);
        }
      }
    } else {
      let updatedComments: { author: string; text: string }[] = [];
      setDogPhotos(prev =>
        prev.map(p => {
          if (p.id === postId) {
            updatedComments = [...(p.comments || []), newComment];
            return { ...p, comments: updatedComments };
          }
          return p;
        })
      );
      // Clear input
      setPhotoCommentInput(prev => ({ ...prev, [postId]: "" }));

      if (user) {
        try {
          await updateDoc(doc(db, "dog_photos", postId), {
            comments: updatedComments
          });
        } catch (err) {
          console.error("Error saving photo comment to Firestore", err);
        }
      }
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (isRealDb && activeTutorUid) {
      const currentMsgText = chatInput.trim();
      const msgId = "msg-" + Date.now();
      const newMsg = {
        id: msgId,
        sender: isEricoAdmin ? "erico" : "tutor",
        text: currentMsgText,
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        createdAt: serverTimestamp()
      };
      setChatInput("");
      try {
        await setDoc(doc(db, "users", activeTutorUid, "messages", msgId), newMsg);
        if (!isEricoAdmin) {
          setIsEricoTyping(true);
          setTimeout(async () => {
            let replyText = "Excelente feedback! Continue mantendo a clareza. Vou analisar esses dados clínicos na nossa próxima sessão digital.";
            const lowerText = currentMsgText.toLowerCase();
            if (lowerText.includes("puxa") || lowerText.includes("guia") || lowerText.includes("passeio")) {
              replyText = "O passeio estruturado exige que o cão aprenda que o tensionamento da guia é um sinal de parada definitiva. Nunca ande se a guia estiver esticada, ok?";
            } else if (lowerText.includes("ansioso") || lowerText.includes("inquieto") || lowerText.includes("chora")) {
              replyText = "O cão está demonstrando intolerância à frustração. Pratique o treino de tapete passivo por 10 minutos diários enquanto você faz tarefas pela casa.";
            } else if (lowerText.includes("limite") || lowerText.includes("comida") || lowerText.includes("porta")) {
              replyText = "Manter o controle sobre limiares ou passagens é a base do respeito mútuo. Ele só atravessa sob sua expressa liberação relacional. Excelente trabalho!";
            }
            const replyId = "reply-" + Date.now();
            await setDoc(doc(db, "users", activeTutorUid, "messages", replyId), {
              id: replyId,
              sender: "erico",
              text: replyText,
              time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
              createdAt: serverTimestamp()
            });
            setIsEricoTyping(false);
            await updateXpAndProgress(15, 0);
          }, 2000);
        }
      } catch (err) {
        console.error("Error sending message to Firestore", err);
      }
      return;
    }

    const currentMsgText = chatInput.trim();
    const newMsg: ChatMessage = {
      id: "chat-msg-" + Date.now(),
      sender: "tutor",
      text: currentMsgText,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput("");
    setIsEricoTyping(true);

    // Wise, context-aware psyco-educational automatic replies from Érico Cavalheiro
    setTimeout(() => {
      let replyText = "Excelente feedback, Rodrigo! Continue mantendo a clareza e reforçando positivamente nos momentos de calma. Vou analisar esses dados clínicos na nossa próxima sessão digital.";
      
      const lowerText = currentMsgText.toLowerCase();
      if (lowerText.includes("puxa") || lowerText.includes("guia") || lowerText.includes("passeio")) {
        replyText = "Interessante você trazer isso. O passeio estruturado exige que o Max aprenda que o tensionamento da guia é um sinal de parada absoluta. Nunca ande se a guia estiver esticada, ok? Mantenha sua postura relaxada.";
      } else if (lowerText.includes("ansioso") || lowerText.includes("inquieto") || lowerText.includes("chora")) {
        replyText = "Max está demonstrando intolerância à frustração. Pratique o treino de tapete passivo por 5 a 10 minutos diários enquanto você faz tarefas triviais pela casa. Ele precisa decifrar o ócio.";
      } else if (lowerText.includes("limite") || lowerText.includes("comida") || lowerText.includes("porta")) {
        replyText = "Manter o controle sobre gatilhos de passagem (limiares de porta) é a base do respeito mútuo. Ele só atravessa as portas sob sua liberação clínica. Ótimo trabalho!";
      }

      const ericoMsg: ChatMessage = {
        id: "chat-reply-" + Date.now(),
        sender: "erico",
        text: replyText,
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      };

      setChatMessages(prev => [...prev, ericoMsg]);
      setIsEricoTyping(false);
      setXpPoints(p => p + 15); // Reward conversational clinical interaction
    }, 2000);
  };

  // Submit inactive videocall chat msg
  const handleSendCallChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callChatInput.trim()) return;

    const newChatMsg = { author: tutorProfile.name, text: callChatInput.trim() };
    setCallChatMessages(prev => [...prev, newChatMsg]);
    setCallChatInput("");

    // Érico responds inside live call chat
    setTimeout(() => {
      setCallChatMessages(prev => [...prev, {
        author: "Érico Cavalheiro",
        text: "Acabei de compartilhar slides clínicos na tela, Rodrigo. Dê uma olhada no gráfico de limites."
      }]);
    }, 1200);
  };

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const completedTasksCount = dailyTasks.filter(t => t.done).length;
  const taskProgressPct = Math.round((completedTasksCount / dailyTasks.length) * 100);

  if (isAuthLoading) {
    return (
      <section id="tutor-area-portal-loading" className="py-12 px-6 bg-charcoal min-h-[85vh] flex items-center justify-center relative text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-plum-brand/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="space-y-4 relative z-10 max-w-md mx-auto">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 border-4 border-plum-brand/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-peach border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="font-serif text-lg text-ivory font-medium">Sincronizando com a nuvem...</p>
          <p className="font-sans text-xs text-sand-deep tracking-wider uppercase">Carregando dados clínicos do tutor e prontuário</p>
        </div>
      </section>
    );
  }

  return (
    <section id="tutor-area-portal" className="py-12 px-6 bg-charcoal min-h-[85vh] relative text-left">
      {/* Background radial soft light overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-plum-brand/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10" id="tutor-portal-wrapper">
        
        <AnimatePresence mode="wait">
          {user && !userProfile && !isEricoAdmin ? (
            /* =========================================================
               1.1 TUTOR PROFILE ONBOARDING (Authenticated with Google, no Firestore profile yet)
               ========================================================= */
            <motion.div
              key="onboard-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto bg-plum-deep/35 border border-plum-brand/25 rounded-2xl p-8 md:p-10 shadow-lift text-center"
              id="tutor-onboard-card"
            >
              <div className="inline-flex items-center justify-center p-3.5 rounded-full bg-forest/15 text-forest mb-6" id="onboard-icon-box">
                <Sparkles size={26} className="stroke-[1.75]" />
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ivory tracking-tight mb-2">
                Ative seu Vínculo
              </h2>
              <p className="font-sans text-xs text-sand/85 leading-relaxed mb-6">
                Olá, <strong>{user.displayName || "tutor"}</strong>! Você se autenticou com sucesso. Agora, preencha os dados do seu cão para criar seu prontuário digital e ativar seu copiloto clínico.
              </p>

              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!onboardName.trim() || !onboardDogName.trim() || !onboardDogBreed.trim() || !onboardDogAge.trim()) {
                  setErrorMsg("Por favor, preencha todos os campos do seu cão.");
                  return;
                }
                setIsLoading(true);
                try {
                  await createProfile(onboardName.trim(), onboardDogName.trim(), onboardDogBreed.trim(), onboardDogAge.trim());
                  setErrorMsg("");
                } catch (err) {
                  setErrorMsg("Erro ao criar perfil no banco de dados. Tente novamente.");
                } finally {
                  setIsLoading(false);
                }
              }} className="space-y-4 text-left" noValidate>
                <div>
                  <label htmlFor="onboard-name-input" className="block text-[10px] font-sans font-bold uppercase tracking-wider text-sand-deep mb-1.5">
                    Seu Nome Completo
                  </label>
                  <input
                    type="text"
                    id="onboard-name-input"
                    value={onboardName}
                    onChange={(e) => setOnboardName(e.target.value)}
                    placeholder="Ex: Rodrigo Cavalheiro"
                    required
                    disabled={isLoading}
                    className="w-full h-11 px-4 bg-charcoal/70 border border-plum-brand/30 text-ivory text-sm rounded-sm placeholder:text-sand-deep/40 focus:outline-none focus:border-peach transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="onboard-dogname-input" className="block text-[10px] font-sans font-bold uppercase tracking-wider text-sand-deep mb-1.5">
                      Nome do Cão
                    </label>
                    <input
                      type="text"
                      id="onboard-dogname-input"
                      value={onboardDogName}
                      onChange={(e) => setOnboardDogName(e.target.value)}
                      placeholder="Ex: Max"
                      required
                      disabled={isLoading}
                      className="w-full h-11 px-4 bg-charcoal/70 border border-plum-brand/30 text-ivory text-sm rounded-sm placeholder:text-sand-deep/40 focus:outline-none focus:border-peach transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="onboard-dogbreed-input" className="block text-[10px] font-sans font-bold uppercase tracking-wider text-sand-deep mb-1.5">
                      Raça do Cão
                    </label>
                    <input
                      type="text"
                      id="onboard-dogbreed-input"
                      value={onboardDogBreed}
                      onChange={(e) => setOnboardDogBreed(e.target.value)}
                      placeholder="Ex: Beagle"
                      required
                      disabled={isLoading}
                      className="w-full h-11 px-4 bg-charcoal/70 border border-plum-brand/30 text-ivory text-sm rounded-sm placeholder:text-sand-deep/40 focus:outline-none focus:border-peach transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="onboard-dogage-input" className="block text-[10px] font-sans font-bold uppercase tracking-wider text-sand-deep mb-1.5">
                    Idade do Cão (ex: 8 meses, 3 anos)
                  </label>
                  <input
                    type="text"
                    id="onboard-dogage-input"
                    value={onboardDogAge}
                    onChange={(e) => setOnboardDogAge(e.target.value)}
                    placeholder="Ex: 8 meses (Filhote)"
                    required
                    disabled={isLoading}
                    className="w-full h-11 px-4 bg-charcoal/70 border border-plum-brand/30 text-ivory text-sm rounded-sm placeholder:text-sand-deep/40 focus:outline-none focus:border-peach transition-colors"
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-1.5 text-rose-brand text-xs font-sans" id="onboard-error">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-forest hover:bg-forest/90 active:scale-[0.99] transition-all text-white font-sans text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-soft mt-3"
                  id="submit-onboard-profile"
                >
                  {isLoading ? "Criando Prontuário..." : "Ativar Meu Perfil Co-piloto ✔"}
                </button>

                <button
                  type="button"
                  onClick={googleLogout}
                  className="w-full text-center text-xs text-sand-deep hover:text-ivory mt-4 underline cursor-pointer"
                >
                  Sair da minha conta Google ({user.email})
                </button>
              </form>
            </motion.div>
          ) : (user && userProfile && !userProfile.isAuthorized && !isEricoAdmin) ? (
            /* =========================================================
               1.2 PENDING AUTHORIZATION SPLASH SCREEN (Authenticated, has profile, but not yet approved)
               ========================================================= */
            <motion.div
              key="pending-auth-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto bg-plum-deep/35 border border-plum-brand/25 rounded-2xl p-8 md:p-10 shadow-lift text-center"
              id="tutor-pending-auth-card"
            >
              <div className="inline-flex items-center justify-center p-3.5 rounded-full bg-peach/10 text-peach mb-6" id="pending-icon-box">
                <Clock size={26} className="stroke-[1.75] animate-pulse" />
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ivory tracking-tight mb-2">
                Aguardando Liberação
              </h2>
              <p className="font-sans text-xs text-sand/85 leading-relaxed mb-6">
                Olá, <strong>{userProfile.name}</strong>! Prontuário para o cão <strong>{userProfile.dogName}</strong> criado com sucesso.
              </p>
              
              <div className="bg-charcoal/40 border border-plum-brand/20 rounded-lg p-4 text-left text-xs text-sand-deep space-y-2 mb-6 text-slate-300">
                <p>
                  Para garantir a segurança, privacidade e controle clínico da consultoria de Érico Cavalheiro, o acesso ao portal é restrito e liberado manualmente.
                </p>
                <form action="" className="hidden" /> {/* Keep empty compliant shell */}
                <p className="font-semibold text-peach">
                  Por favor, aguarde enquanto Érico ativa o seu cadastro. Esta tela irá atualizar automaticamente assim que ele autorizar seu acesso remoto!
                </p>
              </div>

              <a
                href={`https://wa.me/5555997240369?text=Ol%C3%A1%20%C3%89rico!%20Acabei%20de%20fazer%20meu%20cadastro%20na%20%C3%81rea%20do%20Tutor,%20poderia%20dar%20uma%20olhada%20e%20liberar%20meu%20acesso%20por%20favor?`}
                target="_blank"
                rel="noreferrer"
                className="w-full h-12 bg-ivory text-charcoal hover:bg-neutral-200 active:scale-[0.99] transition-all font-sans text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-soft"
                id="whatsapp-request-auth"
              >
                Solicitar Liberação via WhatsApp
              </a>

              <button
                type="button"
                onClick={googleLogout}
                aria-label={`Sair da conta Google atual (${user.email})`}
                className="w-full text-center text-xs text-sand-deep hover:text-ivory mt-4 underline cursor-pointer"
              >
                Sair da minha conta Google ({user.email})
              </button>
            </motion.div>
          ) : !isLoggedIn ? (
            /* =========================================================
               1. LOGIN ACCESS SPLASH SCREEN (Not Authenticated)
               ========================================================= */
            <motion.div
              key="login-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto bg-plum-deep/35 border border-plum-brand/25 rounded-2xl p-8 md:p-10 shadow-lift text-center"
              id="tutor-credentials-card"
            >
              <div className="inline-flex items-center justify-center p-3.5 rounded-full bg-peach/10 text-peach mb-6" id="login-icon-box">
                <KeyRound size={26} className="stroke-[1.75]" />
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ivory tracking-tight mb-2">
                Área do Tutor
              </h2>
              <p className="font-sans text-xs text-sand/85 leading-relaxed mb-6">
                Acesse o ambiente interativo de consultoria clínica de Érico Cavalheiro. Acompanhe progresso, participe do fórum e inicie teleatendimentos seguros.
              </p>

              {/* Secure Google Login button */}
              <div className="mb-6 space-y-4">
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  aria-label="Registrar-se ou fazer login de forma rápida usando sua Conta do Google"
                  className="w-full h-12 bg-[#4285F4] hover:bg-[#357AE8] text-white font-sans text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2.5 cursor-pointer shadow-md transition-all active:scale-[0.99]"
                  id="google-login-button"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Entrar com o Google (Recomendado)</span>
                </button>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px bg-plum-brand/20 grow" />
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-sand-deep whitespace-nowrap">ou usar acesso demonstrativo</span>
                  <div className="h-px bg-plum-brand/20 grow" />
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left" noValidate>
                <div>
                  <label htmlFor="access-code-input" className="block text-[10px] font-sans font-bold uppercase tracking-wider text-sand-deep mb-2">
                    Código de Acesso do Tutor
                  </label>
                  <input
                    type="text"
                    id="access-code-input"
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      if (errorMsg) setErrorMsg("");
                    }}
                    placeholder="DIGITE: VINCOLO2026"
                    disabled={isLoading}
                    className="w-full h-12 px-4 bg-charcoal/70 border border-plum-brand/30 text-ivory text-sm rounded-sm font-mono placeholder:text-sand-deep/40 focus:outline-none focus:border-peach transition-colors uppercase"
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-1.5 text-rose-brand text-xs font-sans" id="login-error">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  aria-label="Validar código de acesso e entrar"
                  className="w-full h-12 bg-[#efe7e7] hover:bg-[#eae0e0] active:scale-[0.99] transition-all text-[#160E1A] font-sans text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-soft"
                  id="submit-access-code"
                >
                  {isLoading ? "Validando..." : "Entrar com Código Físico"}
                </button>
              </form>

              <div className="w-full h-px bg-plum-brand/15 my-6" />

              <div className="text-center">
                <p className="text-[10px] text-sand-deep font-sans mb-3 text-left">
                  🔑 <strong>Acesso Rápido:</strong> Utilize o código <code className="text-peach font-mono font-bold bg-charcoal/80 px-1 py-0.5 rounded">VINCOLO2026</code> ou clique no atalho de demonstração abaixo:
                </p>
                <button
                  onClick={handleDemoLogin}
                  aria-label="Experimentar a plataforma através de um perfil de demonstração de Rodrigo e o cão Max"
                  className="text-xs font-sans font-bold text-forest hover:text-forest/80 underline cursor-pointer"
                  id="access-demo-tutor"
                >
                  Entrar como Rodrigo e Max (Demonstração VIP) →
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-1.5 p-3 rounded bg-plum-deep/20 text-[10px] font-sans text-sand-deep leading-relaxed text-left border border-white/5">
                <HelpCircle size={14} className="text-peach shrink-0" />
                <span>Exclusivo para tutores cadastrados nas consultorias individuais ou mentoria avançada.</span>
              </div>
            </motion.div>
          ) : (
            /* =========================================================
               2. MAIN BACKOFFICE TUTOR PORTAL DASHBOARD (Authenticated)
               ========================================================= */
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
              id="tutor-dashboard-container"
            >
              
              {/* Premium Top Navigation Bar */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-plum-brand/15 pb-6" id="dashboard-header-bar">
                {isEricoAdmin ? (
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-sans font-bold tracking-widest text-peach uppercase flex items-center gap-1 bg-[#efe4d0]/10 px-2 py-0.5 rounded">
                        <Sparkles size={11} className="text-peach" /> PSICÓLOGO CLÍNICO MASTER
                      </span>
                      <span className="text-[10px] font-sans font-bold text-forest bg-forest/15 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        🔑 Acesso Seguro Autorizado
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ivory mt-2">
                      Painel Clínico de Érico Cavalheiro
                    </h2>
                    <p className="font-sans text-xs text-sand-deep">
                      Gerencie prontuários, acompanhe treinos, altere focos de adestramento e interaja com os tutores.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 md:gap-4 text-left w-full md:w-auto" id="tutor-welcome-profile-chip">
                    {/* Compact circular avatar representing tutor and dog */}
                    <div className="w-12 h-12 rounded-full bg-gradient-clay flex-shrink-0 flex items-center justify-center text-charcoal font-black text-sm relative border border-peach/30 shadow-inner">
                      <span>{tutorProfile.name ? tutorProfile.name.charAt(0).toUpperCase() : "T"}</span>
                      {/* Mini dog face emoji float */}
                      <span className="absolute -bottom-1 -right-1 text-xs bg-charcoal border border-plum-brand/20 rounded-full w-5 h-5 flex items-center justify-center pointer-events-none select-none">🐶</span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                        <span className="text-[9px] sm:text-[10px] font-sans font-bold tracking-widest text-[#d5ab70] uppercase flex items-center gap-1 bg-[#efe4d0]/10 px-2 py-0.5 rounded">
                          <Sparkles size={10} className="text-[#d5ab70]" /> CLIENTE VIP ({user ? "Nuvem" : "Local"})
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-sans font-bold text-forest bg-forest/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Flame size={10} className="text-orange-400 animate-pulse" /> {streakCount} Dias!
                        </span>
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-ivory mt-1 leading-tight">
                        Portal de {tutorProfile.name.split(" ")[0]}
                      </h2>
                      <p className="font-sans text-[11px] sm:text-xs text-sand-deep leading-relaxed mt-0.5">
                        Consultoria Relacional • Aluno: <strong className="text-forest">{tutorProfile.dogName}</strong> ({tutorProfile.dogBreed || "Sem raça"}).
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-sand-deep uppercase font-bold block">Pontuação Relacional</span>
                    <span className="text-sm font-sans font-bold text-peach flex items-center justify-end gap-1">
                      <Trophy size={14} /> {xpPoints} XP
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="px-3.5 py-2 border border-plum-brand/25 hover:border-rose-brand/40 text-sand hover:text-rose-brand rounded-sm text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    id="logout-tutor-btn"
                  >
                    <LogOut size={12} />
                    <span>Sair</span>
                  </button>
                </div>
              </div>

              {/* =========================================================
                 [ADMIN MASTER ROW] Tutor dropdown selector & clinical status updater
                 ========================================================= */}
              {isEricoAdmin && (
                <div className="bg-plum-deep/45 border border-plum-brand/25 rounded-xl p-5 md:p-6 shadow-lift text-left space-y-4" id="clinical-admin-board">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div>
                      <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-peach flex items-center gap-1.5">
                        📂 Seletor de Prontuário Digital
                      </h3>
                      <p className="text-[11px] text-sand-deep leading-relaxed">
                        Escolha um de seus tutores ativos para carregar os logs de treino, chat clínico e progresso dele.
                      </p>
                    </div>

                    <div className="w-full md:w-72">
                      <select
                        id="tutor-selector-dropdown"
                        value={selectedTutorId || ""}
                        onChange={(e) => setSelectedTutorId(e.target.value)}
                        className="w-full h-10 px-3 bg-charcoal/80 border border-plum-brand/30 text-ivory text-xs rounded focus:outline-none focus:border-peach transition-colors"
                      >
                        {allTutors.length === 0 ? (
                          <option value="">Nenhum aluno cadastrado no banco</option>
                        ) : (
                           allTutors.map((tut) => (
                             <option key={tut.uid} value={tut.uid}>
                               {tut.name} ({tut.dogName}){!tut.isAuthorized ? " ⚠️ (Pendente)" : ""}
                             </option>
                           ))
                        )}
                      </select>
                    </div>
                  </div>

                  {selectedTutorProfile ? (
                    <div className="space-y-4">
                      {/* Interactive Real-Time Authorization Toggle Controller */}
                      <div className="p-4 bg-plum-deep/45 border border-plum-brand/25 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                        <div className="space-y-1">
                          <span className={`${selectedTutorProfile.isAuthorized ? "text-forest bg-forest/10" : "text-peach bg-peach/10"} text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1.5 w-fit`}>
                            {selectedTutorProfile.isAuthorized ? "✔️ ACESSO AUTORIZADO" : "⚠️ ACESSO PENDENTE"}
                          </span>
                          <p className="text-xs text-sand/90">
                            {selectedTutorProfile.isAuthorized 
                              ? `Este tutor (${selectedTutorProfile.name}) está com permissão total para acessar o portal.` 
                              : `Este tutor está pendente de autorização. Aprove para liberar o acesso remoto dele.`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await updateDoc(doc(db, "users", selectedTutorId), {
                                isAuthorized: !selectedTutorProfile.isAuthorized,
                                updatedAt: serverTimestamp()
                              });
                              setAdminSuccessMsg(`Acesso de ${selectedTutorProfile.name} ${selectedTutorProfile.isAuthorized ? "REVOGADO" : "AUTORIZADO COM SUCESSO"}!`);
                              setTimeout(() => setAdminSuccessMsg(""), 4000);
                            } catch (err) {
                              console.error("Erro ao alterar autorizacao:", err);
                            }
                          }}
                          className={`shrink-0 h-9 px-4 rounded font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow active:scale-[0.98] ${
                            selectedTutorProfile.isAuthorized 
                              ? "bg-rose-950/40 text-rose-300 border border-rose-800/30 hover:bg-rose-900/50" 
                              : "bg-forest text-white hover:bg-forest/90"
                          }`}
                        >
                          {selectedTutorProfile.isAuthorized ? "Revogar Acesso 🔒" : "Autorizar Acesso 🔓"}
                        </button>
                      </div>

                      <form onSubmit={handleSaveAdminData} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-4">
                          <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-sand-deep mb-1.5">
                            Foco Clínico de Treinamento
                          </label>
                          <input
                            type="text"
                            value={adminFocusArea}
                            onChange={(e) => setAdminFocusArea(e.target.value)}
                            className="w-full h-9 px-3 bg-charcoal/50 border border-plum-brand/25 text-ivory text-xs rounded focus:outline-none focus:border-peach transition-colors"
                            placeholder="Ex: Passeio Estruturado e Controle de Portas"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-sand-deep mb-1.5">
                            Data da Próxima Consulta
                          </label>
                          <input
                            type="text"
                            value={adminNextConsult}
                            onChange={(e) => setAdminNextConsult(e.target.value)}
                            className="w-full h-9 px-3 bg-charcoal/50 border border-plum-brand/25 text-ivory text-xs rounded focus:outline-none focus:border-peach transition-colors"
                            placeholder="Ex: Sexta-feira, 29/05 às 14h"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-sand-deep mb-1.5">
                            Nível de Conexão ({adminConsultProgress}%)
                          </label>
                          <div className="flex items-center gap-1.5 h-9">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={adminConsultProgress}
                              onChange={(e) => setAdminConsultProgress(Number(e.target.value))}
                              className="w-full accent-forest cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-1.5">
                          <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-sand-deep mb-1.5">
                            XP ({adminXpPoints})
                          </label>
                          <input
                            type="number"
                            value={adminXpPoints}
                            onChange={(e) => setAdminXpPoints(Number(e.target.value))}
                            className="w-full h-9 px-2 bg-charcoal/50 border border-plum-brand/25 text-ivory text-xs rounded focus:outline-none focus:border-peach transition-colors font-mono"
                          />
                        </div>

                        <div className="md:col-span-1.5 flex flex-col gap-2">
                          <button
                            type="submit"
                            className="w-full h-9 bg-forest hover:bg-forest/90 active:scale-[0.98] text-white font-sans text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            Salvar ✔
                          </button>
                        </div>
                      </form>
                      {adminSuccessMsg && (
                        <div className="p-2 bg-forest/15 border border-forest/30 text-forest rounded text-xs text-center font-sans">
                          {adminSuccessMsg}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-charcoal/30 rounded border border-white/5">
                      <p className="text-xs text-sand-deep italic">Nenhum tutor selecionado para carregar os logs de treino.</p>
                    </div>
                  )}
                </div>
              )}


              {/* =========================================================
                 DASHBOARD NAVIGATION INTERACTIVE SUB-TABS (Resolves original clutter)
                 ========================================================= */}
              <div role="tablist" aria-label="Abas de recursos do painel de controle" className="bg-plum-deep/30 rounded-lg p-1 border border-plum-brand/15 max-w-lg mx-auto grid grid-cols-3 gap-1 text-center" id="dashboard-sub-tabs">
                <button
                  role="tab"
                  aria-selected={dashboardTab === "progresso"}
                  aria-label="Exibir aba de progresso, checklists e diário de treinos"
                  onClick={() => setDashboardTab("progresso")}
                  className={`py-2 px-1 xs:px-2 sm:px-3 rounded text-[9px] xs:text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 sm:gap-1.5 focus:outline-none cursor-pointer ${
                    dashboardTab === "progresso" 
                      ? "bg-[#efe7e7] text-[#160E1A] font-black" 
                      : "text-sand hover:text-ivory bg-transparent hover:bg-white/5"
                  }`}
                  id="tab-progresso-trigger"
                >
                  <CheckSquare size={12} className="shrink-0" />
                  <span>Progresso</span>
                </button>
                
                <button
                  role="tab"
                  aria-selected={dashboardTab === "comunidade"}
                  aria-label="Exibir aba da comunidade, fórum de discussões e chat de relatos"
                  onClick={() => setDashboardTab("comunidade")}
                  className={`py-2 px-1 xs:px-2 sm:px-3 rounded text-[9px] xs:text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 sm:gap-1.5 focus:outline-none cursor-pointer ${
                    dashboardTab === "comunidade" 
                      ? "bg-[#efe7e7] text-[#160E1A] font-black" 
                      : "text-sand hover:text-ivory bg-transparent hover:bg-white/5"
                  }`}
                  id="tab-comunidade-trigger"
                >
                  <Users size={12} className="shrink-0" />
                  <span>Comunidade</span>
                </button>
                
                <button
                  role="tab"
                  aria-selected={dashboardTab === "teleatendimento"}
                  aria-label="Exibir aba de teleatendimento clínico ou sala de reuniões virtual"
                  onClick={() => setDashboardTab("teleatendimento")}
                  className={`py-2 px-1 xs:px-2 sm:px-3 rounded text-[9px] xs:text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 sm:gap-1.5 focus:outline-none cursor-pointer ${
                    dashboardTab === "teleatendimento" 
                      ? "bg-[#efe7e7] text-[#160E1A] font-black animation-pulse" 
                      : "text-sand hover:text-ivory bg-transparent hover:bg-white/5"
                  }`}
                  id="tab-tele-trigger"
                >
                  <Video size={12} className={`shrink-0 ${dashboardTab === "teleatendimento" ? "text-rose-brand" : ""}`} />
                  <span className="relative">
                    Virtual Room
                    <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                  </span>
                </button>
              </div>


              <AnimatePresence mode="wait">
                {/* =========================================================
                   SUB-VIEW 1: PROGRESSED TASKS & GAMIFIED ACHIEVEMENTS
                   ========================================================= */}
                {dashboardTab === "progresso" && (
                  <motion.div
                    key="progresso-subtab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Mobile-only Segmented Switcher for Progresso */}
                    <div className="flex lg:hidden bg-[#efe7e7]/5 p-1 rounded-lg border border-plum-brand/20 text-xs w-full select-none mb-2" id="progresso-mobile-switcher">
                      <button
                        type="button"
                        onClick={() => setProgressoMobileTab("diario")}
                        className={`flex-1 py-2.5 rounded-md font-sans text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          progressoMobileTab === "diario"
                            ? "bg-[#efe7e7] text-[#160E1A] shadow-sm font-black"
                            : "text-sand hover:text-ivory bg-transparent"
                        }`}
                      >
                        <FileText size={13} className={progressoMobileTab === "diario" ? "text-[#160E1A]" : "text-peach"} />
                        <span>Diário & Evolução</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProgressoMobileTab("checklist")}
                        className={`flex-1 py-2.5 rounded-md font-sans text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
                          progressoMobileTab === "checklist"
                            ? "bg-[#efe7e7] text-[#160E1A] shadow-sm font-black"
                            : "text-sand hover:text-ivory bg-transparent"
                        }`}
                      >
                        <CheckSquare size={13} className={progressoMobileTab === "checklist" ? "text-[#160E1A]" : "text-peach"} />
                        <span>Exercícios & Prêmios</span>
                        {completedTasksCount < dailyTasks.length && (
                          <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left" id="sub-progresso-view">
                      
                      {/* LEFT 5 COLUMNS: Profile, Streak details, and Gamified achievements */}
                      <div className={`lg:col-span-5 ${progressoMobileTab === "checklist" ? "block" : "hidden lg:block"} space-y-6`}>
                      
                      {/* Interactive consistency tracker card */}
                      <div className="bg-plum-deep/30 border border-plum-brand/20 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-forest/5 blur-2xl rounded-full pointer-events-none" />
                        
                        <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-peach mb-4 flex items-center gap-1.5">
                          <Trophy size={14} /> Alinhamento de Vínculo
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center text-[11px] uppercase font-bold text-sand-deep mb-2.5">
                              <span>Nível de Conexão com o Max</span>
                              <span className="text-forest font-mono">{tutorProfile.consultProgress}%</span>
                            </div>
                            <div className="w-full h-3 bg-charcoal/80 rounded-full overflow-hidden border border-plum-brand/15 p-[2px]">
                              <div 
                                className="h-full bg-gradient-to-r from-forest/60 via-forest to-emerald-400 rounded-full transition-all duration-500"
                                style={{ width: `${tutorProfile.consultProgress}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-sand-deep/75 mt-2 leading-relaxed italic">
                              Meta sugerida pelo Érico: atingir <strong>90% de estabilidade</strong> para liberar saídas de alta complexidade em parques urbanos.
                            </p>
                          </div>

                          <div className="w-full h-px bg-plum-brand/15 my-3" />

                          {/* Gamification Streak Info Dashboard */}
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="bg-charcoal/50 p-3 rounded border border-plum-brand/10">
                              <span className="text-[9px] block text-sand-deep font-bold uppercase leading-tight">Streak de Conexão</span>
                              <span className="text-lg font-sans font-extrabold text-[#efe4d0] mt-1 block flex items-center justify-center gap-1">
                                <Flame size={14} className="text-orange-400 animate-pulse" /> {streakCount} dias
                              </span>
                            </div>
                            <div className="bg-charcoal/50 p-3 rounded border border-plum-brand/10">
                              <span className="text-[9px] block text-sand-deep font-bold uppercase leading-tight">XP de Treino</span>
                              <span className="text-lg font-sans font-extrabold text-peach mt-1 block">
                                {xpPoints} pts
                              </span>
                            </div>
                            <div className="bg-charcoal/50 p-3 rounded border border-plum-brand/10">
                              <span className="text-[9px] block text-sand-deep font-bold uppercase leading-tight">Nível do Tutor</span>
                              <span className="text-lg font-sans font-extrabold text-[#d5ab70] mt-1 block">
                                Lvl 4
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Daily Checklist Protocol with stats feedback */}
                      <div className="bg-plum-deep/30 border border-plum-brand/20 rounded-xl p-6" id="checklist-gamified">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-peach flex items-center gap-1.5">
                            <CheckSquare size={13} /> Protocolo Técnico de Hoje
                          </h3>
                          <span className="text-[10px] font-sans font-bold text-forest bg-forest/10 px-2 py-0.5 rounded">
                            {completedTasksCount}/{dailyTasks.length} feitos
                          </span>
                        </div>
                        
                        <p className="text-[11px] text-sand-deep leading-relaxed mb-4">
                          Pratique esses exercícios comportamentais e clique para pontuar <strong>+25 XP</strong> na consistência do Max:
                        </p>

                        <div className="space-y-2.5">
                          {dailyTasks.map((task) => (
                            <button
                              key={task.id}
                              onClick={() => toggleTask(task.id)}
                              className={`w-full p-3 font-sans text-xs text-left rounded border transition-all duration-200 flex items-start gap-2.5 focus:outline-none cursor-pointer ${
                                task.done 
                                  ? "bg-forest/15 border-forest/30 text-sand line-through" 
                                  : "bg-charcoal/40 border-plum-brand/15 text-ivory hover:border-plum-brand/40 hover:bg-charcoal/70"
                              }`}
                            >
                              <span className={`mt-0.5 p-0.5 rounded shrink-0 ${task.done ? "bg-forest text-[#160E1A]" : "border border-sand-deep/40 text-transparent"}`}>
                                <CheckCircle size={10} className="stroke-[3]" />
                              </span>
                              <span>{task.text}</span>
                            </button>
                          ))}
                        </div>

                        {/* Motivational Reward Notification on 100% completion */}
                        {taskProgressPct === 100 && (
                          <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mt-4 p-3 rounded border border-green-500/30 bg-green-950/20 text-center"
                          >
                            <span className="text-xs font-serif font-black text-white flex items-center justify-center gap-1">
                              🎉 SUPREMO DE HOJE ATINGIDO!
                            </span>
                            <p className="text-[10px] text-sand-deep mt-0.5">Rodrigo garantiu consistência. O Max agradece por não ser humanizado e sim respeitado!</p>
                          </motion.div>
                        )}
                      </div>

                      {/* Medalhas & Conquistas Desbloqueáveis (Ultimate Motivation) */}
                      <div className="bg-plum-deep/30 border border-plum-brand/20 rounded-xl p-6">
                        <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-peach mb-4 flex items-center gap-1.5">
                          <Award size={14} /> Medalhas Comportamentais do Max
                        </h3>
                        <p className="text-[11px] text-sand-deep leading-relaxed mb-5">
                          Medalhas de mérito canino desbloqueadas com base no cumprimento do plano relacional:
                        </p>

                        <div className="grid grid-cols-2 gap-3" id="badges-grid">
                          {[
                            { 
                              id: "foco-absoluto", 
                              title: "Foco Absoluto", 
                              desc: "Manter contato visual sob gatilhos por 30 segundos", 
                              emoji: "🛡️", 
                              status: "unlocked", 
                              color: "border-[#d5ab70] bg-[#d5ab70]/10 text-[#efe4d0]" 
                            },
                            { 
                              id: "passeio-nobre", 
                              title: "Passeio Nobre", 
                              desc: "Passeio sem tensionar a guia por 10 min", 
                              emoji: "👣", 
                              status: "unlocked", 
                              color: "border-forest/30 bg-forest/10 text-emerald-300" 
                            },
                            { 
                              id: "tutor-guardiao", 
                              title: "Tutor Guardião", 
                              desc: "Completar o guia de tarefas por 5 dias seguidos", 
                              emoji: "🤝", 
                              status: "unlocked", 
                              color: "border-peach/30 bg-peach/10 text-peach" 
                            },
                            { 
                              id: "tapete-zen", 
                              title: "Sombra Serena", 
                              desc: "Ficar calmo no ócio durante visitas na sala (Bloqueado)", 
                              emoji: "💤", 
                              status: "locked", 
                              color: "border-plum-brand/10 bg-black/10 text-sand-deep/40 opacity-55" 
                            },
                          ].map((b) => (
                            <div 
                              key={b.id} 
                              className={`p-3.5 rounded border flex flex-col items-center justify-between text-center transition-all duration-300 relative ${b.color}`}
                            >
                              {b.status === "unlocked" && (
                                <span className="absolute top-1 right-1 text-[8px] bg-forest text-[#160E1A] font-extrabold uppercase px-1 rounded scale-90">LIVE</span>
                              )}
                              <span className="text-2xl mt-1 block">{b.emoji}</span>
                              <h4 className="font-serif text-[11px] font-bold mt-2 leading-tight block">{b.title}</h4>
                              <p className="text-[9px] text-sand-deep/90 mt-1 leading-snug">{b.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* RIGHT 7 COLUMNS: Simulated Daily Training Journal Logs */}
                    <div className={`lg:col-span-7 ${progressoMobileTab === "diario" ? "block" : "hidden lg:block"} space-y-6`}>
                      
                      {/* Form to submit daily log */}
                      <div className="bg-plum-deep/30 border border-plum-brand/20 rounded-xl p-6" id="journal-input-form">
                        <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-peach mb-3 flex items-center gap-1.5">
                          <FileText size={14} /> Novo Registro de Clínicas Relacionais
                        </h3>
                        <p className="text-[11px] text-sand-deep mb-5 leading-relaxed">
                          Escreva diariamente os comportamentos do Max. Érico revisará suas anotações para ajustar remotamente os protocolos ativos.
                        </p>

                        <form onSubmit={handleAddLog} className="space-y-4">
                          <div>
                            <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-sand-deep mb-2">
                              Qual é o estado emocional predominante do Max hoje?
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {[
                                { id: "calmo", label: "Calmo & Relaxado", icon: <Smile size={13} className="text-forest" /> },
                                { id: "focado", label: "Focado & Conectado", icon: <Zap size={13} className="text-peach" /> },
                                { id: "ansioso", label: "Ansioso / Inquieto", icon: <Frown size={13} className="text-rose-brand" /> },
                                { id: "disperso", label: "Disperso / Distraído", icon: <HelpCircle size={13} className="text-sand-deep" /> },
                              ].map((emo) => (
                                <button
                                  type="button"
                                  key={emo.id}
                                  onClick={() => setNewEmotion(emo.id as any)}
                                  className={`p-2 rounded text-xs font-medium font-sans flex items-center justify-center gap-1.5 transition-all focus:outline-none cursor-pointer border ${
                                    newEmotion === emo.id
                                      ? "bg-[#efe7e7] text-[#160E1A] border-transparent font-bold"
                                      : "bg-charcoal/50 border-plum-brand/15 text-sand hover:bg-charcoal/80"
                                  }`}
                                >
                                  {emo.icon}
                                  <span>{emo.label.split(" ")[0]}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label htmlFor="log-text-box" className="block text-[10px] font-sans font-bold uppercase tracking-wider text-sand-deep mb-2">
                              Anote em detalhes (observações, gatilhos, desinflamação comportamental)
                            </label>
                            <textarea
                              id="log-text-box"
                              rows={3}
                              value={newNotes}
                              onChange={(e) => setNewNotes(e.target.value)}
                              placeholder="Ex: Treinei desbaste de porta e Max sentou sem chorar. Porém latiu na janela para o motoboy..."
                              required
                              className="w-full p-4 bg-charcoal/60 border border-plum-brand/20 text-ivory text-xs rounded-sm placeholder:text-sand-deep/45 focus:outline-none focus:border-peach transition-colors"
                            />
                          </div>

                          <div className="flex justify-between items-center gap-2 flex-wrap">
                            <button
                              type="submit"
                              className="px-5 h-11 bg-gradient-clay text-[#160E1A] font-sans text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 hover:scale-[1.01] transition-all cursor-pointer shadow-soft"
                              id="add-journal-log-submit"
                            >
                              <Plus size={14} />
                              <span>Salvar Diário de Treino (+50 XP)</span>
                            </button>

                            <AnimatePresence>
                              {logSuccess && (
                                <motion.span 
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0 }}
                                  className="text-xs font-sans font-bold text-forest flex items-center gap-1"
                                  id="log-feedback-flash"
                                >
                                  <CheckCircle size={12} /> Salvo localmente!
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                        </form>
                      </div>

                      {/* Log History timeline list */}
                      <div className="bg-plum-deep/30 border border-plum-brand/20 rounded-xl p-6">
                        <h4 className="font-serif text-sm font-bold text-ivory mb-4">
                          Histórico de Treinos e Feedbacks Clínicos ({logs.length})
                        </h4>

                        <div className="space-y-4 max-h-[350px] overflow-y-auto no-scrollbar pr-1">
                          {logs.map((log) => {
                            let emoBadge = "bg-forest/10 border-forest/20 text-forest";
                            let emoText = "Calmo";

                            if (log.emotion === "focado") {
                              emoBadge = "bg-peach/10 border-peach/20 text-peach";
                              emoText = "Focado";
                            } else if (log.emotion === "ansioso") {
                              emoBadge = "bg-rose-brand/10 border-rose-brand/20 text-rose-brand";
                              emoText = "Ansioso";
                            } else if (log.emotion === "disperso") {
                              emoBadge = "bg-purple-400/10 border-purple-400/20 text-purple-300";
                              emoText = "Disperso";
                            }

                            return (
                              <div key={log.id} className="p-4 bg-charcoal/60 border border-plum-brand/15 rounded text-left relative hover:border-plum-brand/35 transition-colors">
                                <div className="flex justify-between items-center mb-2.5">
                                  <span className="text-[10px] font-mono text-sand-deep font-semibold">{log.date}</span>
                                  <span className={`text-[9px] font-sans tracking-widest font-bold uppercase px-1.5 py-0.5 rounded border ${emoBadge}`}>
                                    {emoText}
                                  </span>
                                </div>
                                <p className="font-sans text-xs text-sand/95 leading-relaxed whitespace-pre-wrap">
                                  {log.notes}
                                </p>
                                
                                <div className="mt-3.5 pt-3 border-t border-white/5 bg-plum-deep/20 p-2.5 rounded flex items-start gap-1.5">
                                  <div className="w-5 h-5 bg-gradient-clay rounded-full flex items-center justify-center text-[7px] text-[#160E1A] font-bold shrink-0">EC</div>
                                  <div>
                                    <span className="text-[9px] text-[#efe4d0] block font-bold leading-none">Análise de Érico Cavalheiro:</span>
                                    <span className="text-[10px] text-sand/85 leading-relaxed block italic mt-1">
                                      {log.emotion === "ansioso" 
                                        ? "Rodrigo, foque bem nos rituais de desativação pré-passeio. Não ande com o Max enquanto o batimento dele estiver disparado."
                                        : "Excelente evolução no relaxamento e previsibilidade. Aumente o tempo de ócio passivo no próximo ciclo."}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
                )}


                {/* =========================================================
                   SUB-VIEW 2: CLINICAL CHAT WITH ÉRICO & Noble Closed FORUM
                   ========================================================= */}
                {dashboardTab === "comunidade" && (
                  <motion.div
                    key="comunidade-subtab"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Mobile-only Segmented Switcher for Comunidade */}
                    <div className="flex lg:hidden bg-[#efe7e7]/5 p-1 rounded-lg border border-plum-brand/20 text-xs w-full select-none" id="comunidade-mobile-switcher">
                      <button
                        type="button"
                        onClick={() => setCommunityMobileTab("chat")}
                        className={`flex-1 py-2.5 rounded-md font-sans text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          communityMobileTab === "chat"
                            ? "bg-[#efe7e7] text-[#160E1A] shadow-sm font-black"
                            : "text-sand hover:text-ivory bg-transparent"
                        }`}
                      >
                        <MessageSquare size={13} className={communityMobileTab === "chat" ? "text-[#160E1A]" : "text-peach"} />
                        <span>Chat Clínico</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCommunityMobileTab("forum")}
                        className={`flex-1 py-2.5 rounded-md font-sans text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
                          communityMobileTab === "forum"
                            ? "bg-[#efe7e7] text-[#160E1A] shadow-sm font-black"
                            : "text-sand hover:text-ivory bg-transparent"
                        }`}
                      >
                        <Users size={13} className={communityMobileTab === "forum" ? "text-[#160E1A]" : "text-peach"} />
                        <span>Fórum & Galeria</span>
                        <span className="absolute -top-1.5 -right-1.5 bg-rose-brand text-white text-[7px] scale-90 px-1 py-0.5 rounded-full font-sans font-extrabold tracking-tight">
                          NOVO
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch" id="sub-comunidade-view">
                      
                      {/* LEFT 6 COLUMNS: Direct CLINICAL CHAT for immediate video / protocol queries */}
                      <div className={`lg:col-span-6 ${communityMobileTab === "chat" ? "flex" : "hidden lg:flex"} flex-col justify-between border border-plum-brand/20 bg-plum-deep/30 rounded-xl p-5 md:p-6 p-6 relative`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-peach/5 blur-xl rounded-full pointer-events-none" />
                      
                      <div>
                        {/* Header Chat Bio */}
                        <div className="flex items-center gap-3 border-b border-plum-brand/15 pb-4 mb-4">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-clay rounded-full flex items-center justify-center text-xs text-[#160E1A] font-bold">
                              EC
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-charcoal" />
                          </div>
                          <div className="text-left">
                            <span className="text-[9px] font-mono tracking-widest text-[#d5ab70] font-bold uppercase leading-none block">DIRETOR CANINO</span>
                            <h4 className="font-serif text-sm font-bold text-ivory">Suporte Clínico com Érico</h4>
                            <p className="text-[9px] text-[#8eec20] leading-none mt-1">● Online (simulado - responde inteligente)</p>
                          </div>
                        </div>

                        {/* Message Box */}
                        <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar mb-4 py-2" id="clinical-chat-history">
                          {chatMessages.map((msg) => {
                            const isErico = msg.sender === "erico";
                            return (
                              <div 
                                key={msg.id} 
                                className={`flex ${isErico ? "justify-start" : "justify-end"}`}
                              >
                                <div className={`max-w-[85%] rounded-lg p-3 text-left ${
                                  isErico 
                                    ? "bg-charcoal/80 text-sand border border-plum-brand/10 rounded-tl-none" 
                                    : "bg-forest/10 border border-forest/20 text-ivory rounded-tr-none"
                                }`}>
                                  <p className="font-sans text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                  <span className="text-[8px] text-sand-deep/60 block text-right mt-1.5 font-mono">{msg.time}</span>
                                </div>
                              </div>
                            );
                          })}

                          {isEricoTyping && (
                            <div className="flex justify-start">
                              <div className="bg-charcoal/80 border border-plum-brand/10 rounded-lg p-3 rounded-tl-none flex items-center gap-2">
                                <span className="text-[10px] font-sans text-sand-deep italic animate-pulse">Érico está analisando sua conduta...</span>
                                <span className="w-1.5 h-1.5 bg-peach rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 bg-peach rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 bg-peach rounded-full animate-bounce" style={{ animationDelay: "3000ms" }} />
                              </div>
                            </div>
                          )}
                          <div ref={chatBottomRef} />
                        </div>
                      </div>

                      {/* Chat Input form */}
                      <form onSubmit={handleSendChatMessage} className="flex gap-2 border-t border-plum-brand/15 pt-4">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Pergunte sobre passeios, estresse ou limites do Max..."
                          disabled={isEricoTyping}
                          className="flex-1 h-10 px-3 bg-charcoal/60 border border-plum-brand/20 text-xs text-ivory rounded-sm focus:outline-none focus:border-peach"
                        />
                        <button
                          type="submit"
                          disabled={isEricoTyping || !chatInput.trim()}
                          className="w-10 h-10 bg-[#efe7e7] hover:bg-[#eae0e0] disabled:opacity-40 text-[#160E1A] flex items-center justify-center rounded-sm transition-colors cursor-pointer"
                        >
                          <Send size={14} className="text-[#160E1A]" />
                        </button>
                      </form>

                    </div>


                    {/* RIGHT 6 COLUMNS: CLOSED PRIVATE TUTORS FORUM COMMUNITY with tabs */}
                    <div className={`lg:col-span-6 ${communityMobileTab === "forum" ? "flex" : "hidden lg:flex"} flex-col justify-between border border-plum-brand/20 bg-plum-deep/30 rounded-xl p-5 md:p-6 text-left relative`} id="community-tab-container">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#efe7e7]/5 blur-lg rounded-full pointer-events-none" />
                      
                      <div className="flex-1 flex flex-col min-h-0">
                        {/* Tab header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-plum-brand/15 pb-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Users size={18} className="text-peach animate-pulse" />
                            <div>
                              <h4 className="font-serif text-sm font-bold text-ivory">Fórum & Galeria</h4>
                              <p className="text-[10px] text-sand-deep">Discussões privadas e fotos de evolução canina.</p>
                            </div>
                          </div>
                          
                          {/* Segment Selector tabs */}
                          <div className="flex bg-charcoal/50 p-0.5 rounded border border-plum-brand/25 text-[10px] self-start sm:self-auto shrink-0 select-none">
                            <button
                              type="button"
                              onClick={() => { setForumSubTab("discussao"); }}
                              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 font-bold cursor-pointer font-sans ${
                                forumSubTab === "discussao"
                                  ? "bg-gradient-clay text-[#160E1A] shadow-sm"
                                  : "text-sand-deep hover:text-ivory"
                              }`}
                            >
                              <span>💬 Feed</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => { setForumSubTab("fotos"); }}
                              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 font-bold cursor-pointer font-sans relative ${
                                forumSubTab === "fotos"
                                  ? "bg-gradient-clay text-[#160E1A] shadow-sm"
                                  : "text-sand-deep hover:text-ivory"
                              }`}
                            >
                              <span>📸 Galeria</span>
                              <span className="absolute -top-1.5 -right-1.5 bg-rose-brand text-white text-[7px] scale-90 px-1 py-0.5 rounded-full font-sans font-extrabold tracking-tight">
                                NOVO
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-4 relative">
                          <input
                            type="text"
                            value={forumSearchQuery}
                            onChange={(e) => setForumSearchQuery(e.target.value)}
                            placeholder={forumSubTab === "discussao" ? "Buscar no fórum por palavra-chave..." : "Buscar fotos por cão ou legenda..."}
                            className="w-full h-10 pl-9 pr-8 bg-charcoal/40 border border-plum-brand/20 text-xs text-ivory rounded focus:outline-none focus:border-peach transition-all placeholder:text-sand-deep/60"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-deep/70 pointer-events-none">
                            <Search size={14} />
                          </div>
                          {forumSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setForumSearchQuery("")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-deep/75 hover:text-ivory transition-colors cursor-pointer"
                              title="Limpar busca"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>

                        {/* ======================= SUB-TAB: DISCUSSÃO ======================= */}
                        {forumSubTab === "discussao" && (
                          <div className="flex-1 flex flex-col min-h-0" id="forum-discussions-tab-content">
                            {/* Submit post form */}
                            <form onSubmit={handleAddPost} className="mb-4 bg-charcoal/50 p-3 rounded border border-plum-brand/15 space-y-2.5">
                              <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder="Compartilhe uma vitória ou dúvida de treino hoje com outros tutores..."
                                rows={2}
                                className="w-full bg-transparent text-xs text-ivory placeholder:text-sand-deep/65 border-none p-1 focus:outline-none focus:ring-0 no-scrollbar resize-none"
                              />
                              <div className="flex justify-between items-center bg-charcoal/20 pt-1">
                                <span className="text-[9px] text-[#efe4d0]/60 font-sans">Garanta respeito e foco no comportamento natural.</span>
                                <button
                                  type="submit"
                                  disabled={!newPostContent.trim()}
                                  className="px-3.5 py-1.5 bg-gradient-clay text-[#160E1A] font-sans text-[10px] font-bold uppercase tracking-wider rounded-sm hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
                                >
                                  Publicar no Fórum (+40 XP)
                                </button>
                              </div>
                            </form>

                            {/* Private forum timeline feeds */}
                            <div className="space-y-4 max-h-[220px] overflow-y-auto no-scrollbar pr-1 flex-1">
                              {filteredForumPosts.length === 0 ? (
                                <div className="p-6 text-center text-xs text-sand-deep border border-dashed border-plum-brand/20 bg-charcoal/10 rounded-lg">
                                  <p className="font-medium text-sand mb-1">Nenhum post encontrado</p>
                                  <p className="text-[10px] opacity-75">Tente usar outros termos de busca para achar publicações.</p>
                                </div>
                              ) : (
                                filteredForumPosts.map((post) => (
                                  <div key={post.id} className="p-3.5 bg-charcoal/40 rounded border border-plum-brand/10 space-y-2.5 hover:border-plum-brand/20 transition-all">
                                    {/* Post Author stats */}
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-plum-brand/35 text-ivory flex items-center justify-center font-bold text-xs uppercase border border-plum-brand/10">
                                          {post.avatarLetter}
                                        </div>
                                        <div>
                                          <h5 className="font-sans text-[11px] font-bold text-ivory leading-none">{post.author}</h5>
                                          <span className="text-[9px] text-forest block mt-1">Cão: {post.dog}</span>
                                        </div>
                                      </div>
                                      <span className="text-[9px] text-sand-deep font-mono">{post.time}</span>
                                    </div>

                                    <p className="font-sans text-xs text-sand leading-relaxed whitespace-pre-wrap">{post.content}</p>

                                    {/* Actions and Comments listing */}
                                    <div className="flex items-center justify-between border-t border-plum-brand/5 pt-2.5">
                                      <button 
                                        onClick={() => handleLikePost(post.id)}
                                        className={`flex items-center gap-1 text-[10px] font-sans ${post.hasLiked ? "text-rose-brand font-bold" : "text-sand-deep hover:text-rose-brand"} transition-colors cursor-pointer`}
                                        type="button"
                                      >
                                        <ThumbsUp size={11} className={post.hasLiked ? "fill-rose-brand text-rose-brand animate-ping-once" : ""} />
                                        <span>{post.likes} Apoio{post.likes !== 1 ? "s" : ""}</span>
                                      </button>
                                      <span className="text-[10px] text-sand-deep font-sans">{post.comments ? post.comments.length : 0} respostas</span>
                                    </div>

                                    {/* Comments Block with Inline Post commenting form */}
                                    <div className="bg-plum-deep/20 p-2.5 rounded-lg text-[10px] space-y-2 border border-white/5">
                                      {post.comments && post.comments.length > 0 && (
                                        <div className="space-y-2 max-h-[120px] overflow-y-auto no-scrollbar pr-1">
                                          {post.comments.map((comment, cIndex) => (
                                            <div key={cIndex} className="text-left leading-normal border-b border-plum-brand/5 last:border-b-0 pb-1.5 last:pb-0">
                                              <strong className="text-[#efe4d0] block text-[9px] font-sans">{comment.author}:</strong>
                                              <span className="text-sand/90 font-sans">{comment.text}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      
                                      {/* Quick Reply Form */}
                                      <form
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                          const text = forumCommentInput[post.id] || "";
                                          handleAddComment(post.id, "forum", text);
                                        }}
                                        className="flex gap-1.5 pt-1.5 border-t border-plum-brand/5 mt-1"
                                      >
                                        <input
                                          type="text"
                                          value={forumCommentInput[post.id] || ""}
                                          onChange={(e) => setForumCommentInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                                          placeholder="Responder com uma palavra de apoio ou conselho..."
                                          className="flex-1 h-7 bg-charcoal/50 border border-plum-brand/15 text-[10px] text-ivory placeholder:text-sand-deep/40 px-2.5 rounded focus:outline-none focus:border-peach/60 transition-colors"
                                        />
                                        <button 
                                          type="submit"
                                          disabled={!(forumCommentInput[post.id]?.trim())}
                                          className="px-3 h-7 bg-plum-brand/20 hover:bg-plum-brand/40 text-peach rounded-sm text-[9px] font-sans font-bold uppercase transition-all duration-150 disabled:opacity-40"
                                        >
                                          Enviar
                                        </button>
                                      </form>
                                    </div>

                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}

                        {/* ======================= SUB-TAB: GALERIA DE FOTOS ======================= */}
                        {forumSubTab === "fotos" && (
                          <div className="flex-1 flex flex-col min-h-0" id="forum-photos-tab-content">
                            
                            {/* Toggle Photo Uploader Button */}
                            <div className="flex justify-between items-center mb-4 text-left">
                              <span className="text-[10px] text-sand border-l-2 border-peach pl-2 font-mono uppercase tracking-wider font-bold">Mural de Fotos VIP</span>
                              <button
                                type="button"
                                onClick={() => setShowPhotoForm(!showPhotoForm)}
                                className="px-3 py-1 bg-peach/10 hover:bg-peach/25 text-peach rounded text-[10px] font-sans font-bold flex items-center gap-1 transition-all cursor-pointer"
                              >
                                {showPhotoForm ? (
                                  <>
                                    <X size={11} />
                                    <span>Fechar Painel</span>
                                  </>
                                ) : (
                                  <>
                                    <Camera size={11} />
                                    <span>Compartilhar Foto (+50 XP)</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Photo Post Form */}
                            <AnimatePresence>
                              {showPhotoForm && (
                                <motion.form
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  onSubmit={handleAddPhotoPost}
                                  className="mb-4 bg-charcoal/50 p-3 rounded border border-peach/20 space-y-3.5 overflow-hidden text-xs text-left"
                                >
                                  <div>
                                    <label className="block text-[10px] text-sand-deep font-sans mb-1 uppercase font-bold tracking-wider">Legenda / Relato de Sucesso</label>
                                    <textarea
                                      value={newPhotoCaption}
                                      onChange={(e) => setNewPhotoCaption(e.target.value)}
                                      placeholder="Ex: Luna relaxando na passadeira hoje no treino..."
                                      rows={2}
                                      className="w-full bg-charcoal/60 border border-plum-brand/20 rounded p-1.5 text-xs text-ivory placeholder:text-sand-deep/50 focus:outline-none focus:border-peach resize-none"
                                      required
                                    />
                                  </div>

                                  {/* Source Toggle selector */}
                                  <div>
                                    <span className="block text-[10px] text-sand-deep font-sans mb-1.5 uppercase font-bold tracking-wider">Foto do Dog</span>
                                    <div className="grid grid-cols-3 gap-2 bg-charcoal/30 p-1 rounded border border-plum-brand/10">
                                      <button
                                        type="button"
                                        onClick={() => setPhotoSourceMode("preset")}
                                        className={`py-1 text-center text-[9px] rounded font-bold cursor-pointer transition-all ${photoSourceMode === "preset" ? "bg-plum-brand text-ivory" : "text-sand-deep hover:text-sand"}`}
                                      >
                                        Imagens Modelos
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setPhotoSourceMode("upload")}
                                        className={`py-1 text-center text-[9px] rounded font-bold cursor-pointer transition-all ${photoSourceMode === "upload" ? "bg-plum-brand text-ivory" : "text-sand-deep hover:text-sand"}`}
                                      >
                                        Upload Arquivo
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setPhotoSourceMode("url")}
                                        className={`py-1 text-center text-[9px] rounded font-bold cursor-pointer transition-all ${photoSourceMode === "url" ? "bg-plum-brand text-ivory" : "text-sand-deep hover:text-sand"}`}
                                      >
                                        Link Web (URL)
                                      </button>
                                    </div>
                                  </div>

                                  {/* Render inputs according to chosen Mode */}
                                  {photoSourceMode === "preset" && (
                                    <div className="space-y-1.5">
                                      <span className="text-[9px] text-sand-deep block">Escolha uma imagem temática de alta resolução:</span>
                                      <div className="flex gap-2.5 overflow-x-auto py-1 no-scrollbar justify-start">
                                        {PRESET_DOG_PHOTOS.map((preset) => (
                                          <button
                                            key={preset.id}
                                            type="button"
                                            onClick={() => setSelectedPresetUrl(preset.url)}
                                            className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${selectedPresetUrl === preset.url ? "border-peach scale-[1.05] shadow" : "border-plum-brand/20 opacity-60 hover:opacity-100"}`}
                                            title={preset.label}
                                          >
                                            <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {photoSourceMode === "upload" && (
                                    <div className="space-y-1.5">
                                      <span className="text-[9px] text-sand-deep block">Suba a foto real do seu pet:</span>
                                      <label htmlFor="upload-img-input" className="flex flex-col items-center justify-center p-4 bg-charcoal/60 border border-dashed border-plum-brand/35 rounded-lg cursor-pointer hover:border-peach hover:bg-charcoal/80 transition-all text-center">
                                        <Upload size={18} className="text-peach mb-1 animate-pulse" />
                                        <span className="text-[10px] text-ivory font-bold block">Escolher Arquivo</span>
                                        <span className="text-[8px] text-sand-deep">Formatos aceitos: JPG, PNG</span>
                                        <input
                                          id="upload-img-input"
                                          type="file"
                                          accept="image/*"
                                          onChange={handlePhotoUploadChange}
                                          className="hidden"
                                        />
                                      </label>
                                      {photoUploadBase64 && (
                                        <div className="text-[9px] text-[#efe4d0] flex items-center gap-1 bg-forest/10 px-2 py-1 border border-forest/20 rounded">
                                          <span>✓ Foto carregada com sucesso!</span>
                                          <button type="button" onClick={() => setPhotoUploadBase64("")} className="text-rose-brand font-bold underline ml-auto">Remover</button>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {photoSourceMode === "url" && (
                                    <div>
                                      <label className="block text-[10px] text-sand-deep font-sans mb-1">Cole a URL pública da imagem:</label>
                                      <input
                                        type="url"
                                        value={customPhotoUrl}
                                        onChange={(e) => setCustomPhotoUrl(e.target.value)}
                                        placeholder="Ex: https://site.com/minha-foto.jpg"
                                        className="w-full bg-charcoal/60 border border-plum-brand/20 rounded p-1.5 text-xs text-ivory focus:outline-none focus:border-peach"
                                      />
                                    </div>
                                  )}

                                  {/* File Preview */}
                                  <div className="p-2 border border-white/5 bg-plum-deep/20 rounded-md">
                                    <span className="text-[9px] text-sand-deep block mb-1">Visualização do Post:</span>
                                    <div className="flex gap-2.5 items-center">
                                      <div className="w-14 h-14 rounded overflow-hidden shrink-0 border border-plum-brand/20 bg-charcoal">
                                        <img
                                          src={
                                            photoSourceMode === "upload"
                                              ? (photoUploadBase64 || "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=40")
                                              : (photoSourceMode === "url" ? customPhotoUrl : selectedPresetUrl)
                                          }
                                          alt="Dog Preview"
                                          className="w-full h-full object-cover"
                                          referrerPolicy="no-referrer"
                                        />
                                      </div>
                                      <div>
                                        <p className="font-bold text-ivory text-[10px] leading-tight">Postado sob: {profileToUse.name}</p>
                                        <p className="text-[9px] text-sand opacity-80 italic max-w-[200px] truncate">{newPhotoCaption || "Deixe uma legenda..."}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <button
                                    type="submit"
                                    disabled={!newPhotoCaption.trim() || (photoSourceMode === "upload" && !photoUploadBase64) || (photoSourceMode === "url" && !customPhotoUrl.trim())}
                                    className="w-full py-2 bg-gradient-clay text-[#160E1A] font-sans text-xs font-bold uppercase tracking-wider rounded-sm hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
                                  >
                                    Publicar Foto (+50 XP)
                                  </button>

                                </motion.form>
                              )}
                            </AnimatePresence>

                            {/* Feed de Fotos */}
                            <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pr-1 flex-1 text-left">
                              {filteredDogPhotos.length === 0 ? (
                                <div className="p-6 text-center text-xs text-sand-deep border border-dashed border-plum-brand/20 bg-charcoal/10 rounded-lg">
                                  <p className="font-medium text-sand mb-1">Nenhuma foto encontrada</p>
                                  <p className="text-[10px] opacity-75">Seja o primeiro a compartilhar uma foto fofa do seu pet!</p>
                                </div>
                              ) : (
                                filteredDogPhotos.map((photo) => (
                                  <div key={photo.id} className="p-3 bg-charcoal/40 rounded-lg border border-plum-brand/10 space-y-3 hover:border-peach/20 transition-all">
                                    
                                    {/* Author Info */}
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-peach/25 text-peach flex items-center justify-center font-bold text-xs uppercase border border-peach/5 text-center">
                                          {photo.avatarLetter}
                                        </div>
                                        <div>
                                          <h5 className="font-sans text-[11px] font-bold text-ivory leading-none">{photo.author}</h5>
                                          <span className="text-[9px] text-[#efe4d0]/65 block mt-0.5">Pet: <span className="font-semibold text-peach">{photo.dog}</span></span>
                                        </div>
                                      </div>
                                      <span className="text-[9px] text-sand-deep font-mono">{photo.time}</span>
                                    </div>

                                    {/* Visual Representation */}
                                    <div className="relative rounded overflow-hidden shadow-soft border border-white/5 bg-black/20">
                                      <img
                                        src={photo.imageUrl}
                                        alt={photo.caption}
                                        className="w-full max-h-48 object-cover hover:scale-[1.01] transition-all duration-300"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="absolute top-2 left-2 bg-charcoal/85 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] text-peach font-bold font-mono tracking-wider border border-white/5 select-none uppercase">
                                        🐾 Galeria Canina
                                      </div>
                                    </div>

                                    {/* Caption text */}
                                    <p className="font-sans text-xs text-sand leading-relaxed">{photo.caption}</p>

                                    {/* Likes interaction bar */}
                                    <div className="flex items-center justify-between border-t border-plum-brand/5 pt-2">
                                      <button 
                                        onClick={() => handleLikePhotoPost(photo.id)}
                                        className={`flex items-center gap-1.5 text-[10px] font-sans ${photo.hasLiked ? "text-rose-brand font-bold" : "text-sand-deep hover:text-rose-brand"} transition-colors cursor-pointer`}
                                        type="button"
                                      >
                                        <Heart size={12} className={photo.hasLiked ? "fill-rose-brand text-rose-brand animate-pulse" : ""} />
                                        <span>Gostar ({photo.likes})</span>
                                      </button>
                                      
                                      <span className="text-[10px] text-sand-deep font-sans flex items-center gap-1">
                                        <MessageCircle size={10} />
                                        <span>{photo.comments ? photo.comments.length : 0} comentários</span>
                                      </span>
                                    </div>

                                    {/* Photo Comment section list and input form */}
                                    <div className="bg-plum-deep/20 p-2.5 rounded-lg text-[10px] space-y-2 border border-white/5">
                                      {photo.comments && photo.comments.length > 0 && (
                                        <div className="space-y-1.5 max-h-[100px] overflow-y-auto no-scrollbar pr-1">
                                          {photo.comments.map((comment, cIndex) => (
                                            <div key={cIndex} className="text-left leading-normal border-b border-plum-brand/5 last:border-b-0 pb-1.5 last:pb-0">
                                              <strong className="text-peach block text-[9px] font-sans">{comment.author}:</strong>
                                              <span className="text-sand/90 font-sans">{comment.text}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      
                                      {/* Photo commenting form */}
                                      <form
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                          const text = photoCommentInput[photo.id] || "";
                                          handleAddComment(photo.id, "photo", text);
                                        }}
                                        className="flex gap-1.5 pt-1.5 border-t border-plum-brand/5 mt-1"
                                      >
                                        <input
                                          type="text"
                                          value={photoCommentInput[photo.id] || ""}
                                          onChange={(e) => setPhotoCommentInput(prev => ({ ...prev, [photo.id]: e.target.value }))}
                                          placeholder="Elogiar conduta ou tirar dúvidas..."
                                          className="flex-1 h-7 bg-charcoal/50 border border-plum-brand/15 text-[10px] text-ivory placeholder:text-sand-deep/40 px-2.5 rounded focus:outline-none focus:border-peach/60 transition-colors"
                                        />
                                        <button 
                                          type="submit"
                                          disabled={!(photoCommentInput[photo.id]?.trim())}
                                          className="px-3 h-7 bg-plum-brand/20 hover:bg-plum-brand/40 text-[#efe4d0] rounded-sm text-[9px] font-sans font-bold uppercase transition-all duration-150 disabled:opacity-40"
                                        >
                                          Comentar
                                        </button>
                                      </form>
                                    </div>

                                  </div>
                                ))
                              )}
                            </div>

                          </div>
                        )}

                      </div>

                      {/* Community Guidelines */}
                      <div className="mt-4 p-3 rounded bg-plum-deep/20 border border-white/5 flex items-center gap-2 text-[9px] text-sand-deep font-sans">
                        <Sparkles size={11} className="text-[#d5ab70] shrink-0" />
                        <span>Fórum moderado tecnicamente. Publicações geram união sem lógicas de adestramento punitivo.</span>
                      </div>

                    </div>

                  </div>
                </motion.div>
                )}


                {/* =========================================================
                   SUB-VIEW 3: TELECONSULTA / REMOTE VIDEOCALL SIMULATOR
                   ========================================================= */}
                {dashboardTab === "teleatendimento" && (
                  <motion.div
                    key="teleconsulta-subtab"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl mx-auto space-y-6 text-left"
                    id="sub-teleatendimento-view"
                  >
                    {!inActiveCall ? (
                      /* Awaiting meeting state */
                      <div className="bg-plum-deep/30 border border-plum-brand/20 rounded-xl p-8 text-center max-w-xl mx-auto space-y-6">
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-rose-brand/10 text-rose-brand">
                          <Laptop size={32} className="stroke-[1.5]" />
                        </div>

                        <div>
                          <span className="text-[10px] font-mono tracking-widest text-peach font-bold uppercase block mb-1">TELECONSULTA INTEGRADA</span>
                          <h3 className="font-serif text-2xl font-bold text-ivory">Sala de Teleatendimento do Max</h3>
                          <p className="font-sans text-xs text-sand-deep max-w-sm mx-auto mt-2 leading-relaxed">
                            Aulas teóricas de desensibilização e suporte emergencial em tempo real através de nossa sala de vídeo integrada e criptografada.
                          </p>
                        </div>

                        {/* Meeting Schedule Details Card */}
                        <div className="bg-charcoal/60 border border-plum-brand/15 p-5 rounded-lg text-left max-w-md mx-auto space-y-3.5">
                          <div className="flex items-center justify-between border-b border-plum-brand/10 pb-2">
                            <span className="text-xs text-sand-deep font-sans">Organizador técnico:</span>
                            <span className="text-xs text-ivory font-bold font-sans">Érico Cavalheiro</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-plum-brand/10 pb-2">
                            <span className="text-xs text-sand-deep font-sans">Formato:</span>
                            <span className="text-xs text-forest font-bold font-sans">Vídeo-Mentoria Individual</span>
                          </div>
                          <div className="flex items-start gap-2.5 text-xs text-sand">
                            <Calendar size={15} className="text-peach shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-ivory uppercase text-[10px] block text-peach">Data da Próxima Sessão Virtual:</span>
                              <span className="font-semibold block text-[11px] mt-0.5">{tutorProfile.nextConsult}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 max-w-md mx-auto">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              onClick={() => {
                                setCallMode("simulado");
                                setInActiveCall(true);
                              }}
                              className="px-4 py-3 bg-charcoal/80 text-sand border border-plum-brand/30 hover:border-peach hover:text-ivory transition-all font-sans text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-soft"
                              id="trigger-call-simulation"
                            >
                              <Video size={13} />
                              <span>Sala Demonstrativa</span>
                            </button>

                            <button
                              onClick={() => {
                                setCallMode("real");
                                setInActiveCall(true);
                              }}
                              className="px-4 py-3 bg-gradient-clay text-[#160E1A] hover:scale-[1.01] active:scale-[0.99] transition-all font-sans text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-lift font-black"
                              id="trigger-call-real"
                            >
                              <Sparkles size={13} className="text-[#160E1A] stroke-[2.5]" />
                              <span>Sessão Real Jitsi</span>
                            </button>
                          </div>
                          
                          <p className="text-[10px] text-sand-deep italic text-center max-w-xs mx-auto leading-relaxed">
                            💡 **Garantia de Custo Zero:** A sala real utiliza Jitsi Meet (canal criptografado, privado e 100% gratuito integrado para microfone e vídeo).
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Immersive Active Simulated videocall layout */
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-black/95 rounded-2xl border border-[#4a2e55] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[500px]"
                        id="active-call-grid"
                      >
                        
                        {/* LEFT 9 COLUMNS: Main video output stream block */}
                        <div className="lg:col-span-9 flex flex-col justify-between p-6 relative bg-gradient-to-b from-[#160d1b] to-black">
                          
                          {/* Call metadata header */}
                          <div className="flex justify-between items-center z-13 relative">
                            <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded border border-white/10">
                              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                              <span className="text-[10px] font-mono tracking-wider font-bold text-white uppercase">SALA AO VIVO</span>
                            </div>

                            <span className="text-xs font-mono text-white/80 bg-black/60 px-3 py-1.5 rounded border border-white/5">
                              Tempo Decorrido: <strong className="text-peach">{formatCallTime(callDuration)}</strong>
                            </span>
                          </div>

                          {/* HIGH FIDELITY MOCK ACTIVE VIDEO WINDOW DISPLAY */}
                          <div className="my-6 max-w-2xl mx-auto w-full aspect-video rounded-lg overflow-hidden border border-white/10 relative shadow-2xl bg-[#000]">
                            {callMode === "real" ? (
                              <iframe
                                src={`https://meet.jit.si/EricoCavalheiro_EducacaoRelacional_${tutorProfile.name.replace(/\s+/g, '_')}#userInfo.displayName="${tutorProfile.name}"&interfaceConfig.DISABLE_DOMINANT_SPEAKER_INDICATOR=true&config.prejoinPageEnabled=false`}
                                allow="camera; microphone; fullscreen; display-capture; autoplay"
                                className="w-full h-full border-0"
                                title="Sala de Vídeo Real Jitsi Meet"
                              />
                            ) : isCamOn ? (
                              <div className="w-full h-full relative" id="simulated-erico-video-stream">
                                {/* Visual representation of studio background with placeholder graphics */}
                                <div className="absolute inset-0 bg-[#2d1a3a] flex flex-col items-center justify-center p-4 text-center">
                                  {/* Wave simulator design representation of live camera */}
                                  <div className="w-24 h-24 bg-gradient-clay rounded-full animate-pulse flex items-center justify-center mb-4 border-2 border-white/25">
                                    <span className="text-2xl">🐶</span>
                                  </div>
                                  <h4 className="font-serif text-lg font-bold text-white leading-none">Érico Cavalheiro</h4>
                                  <p className="text-[10px] text-[#efe4d0]/75 mt-1.5 font-sans">Dando orientações clínicas com o Golden Retriever de demonstração no estúdio</p>
                                  
                                  {/* Absolute float of customer camera inside active feed */}
                                  <div className="absolute bottom-4 right-4 w-28 h-20 bg-charcoal rounded border border-white/20 overflow-hidden flex items-center justify-center text-center">
                                    <div className="text-[10px] text-white/90">
                                      <span className="block font-bold">Rodrigo (Você)</span>
                                      <span className="text-[8px] text-[#8eec20]">● Max do ócio</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-[#111] flex items-center justify-center text-center" id="cam-disabled-black">
                                <VideoOff size={36} className="text-white/20 mb-2" />
                                <span className="text-xs font-sans text-white/50 block">Sua câmera está temporariamente suspensa por você</span>
                              </div>
                            )}

                            {/* Floating participant label tags */}
                            <span className="absolute top-4 left-4 text-[9px] font-mono uppercase bg-black/65 px-2 py-1 text-white/95 rounded border border-white/10 pointer-events-none">
                              {callMode === "real" ? "Sala Jitsi Criptografada Ativa" : "Parceria Relacional • Sala Virtual Segura"}
                            </span>
                          </div>

                          {/* Controls bar bottom */}
                          <div className="flex items-center justify-center gap-4 z-10 relative">
                            {/* Mic toggle */}
                            <button
                              onClick={() => {
                                setIsMicOn(!isMicOn);
                                setCallChatMessages(prev => [...prev, { author: "Sistema", text: `Você ${!isMicOn ? 'ativou' : 'desativou'} seu microfone.` }]);
                              }}
                              className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                                isMicOn 
                                  ? "bg-white/10 hover:bg-white/20 text-white border-white/10" 
                                  : "bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30"
                              }`}
                              title={isMicOn ? "Mutar Microfone" : "Ativar Microfone"}
                            >
                              {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
                            </button>

                            {/* Camera toggle */}
                            <button
                              onClick={() => {
                                setIsCamOn(!isCamOn);
                                setCallChatMessages(prev => [...prev, { author: "Sistema", text: `Você ${!isCamOn ? 'ligou' : 'desligou'} sua câmera.` }]);
                              }}
                              className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                                isCamOn 
                                  ? "bg-white/10 hover:bg-white/20 text-white border-white/10" 
                                  : "bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30"
                              }`}
                              title={isCamOn ? "Desativar Câmera" : "Ativar Câmera"}
                            >
                              {isCamOn ? <Video size={16} /> : <VideoOff size={16} />}
                            </button>

                            {/* Share files button */}
                            <button
                              onClick={() => {
                                setCallChatMessages(prev => [
                                  ...prev,
                                  { author: "Sistema", text: "Compartilhamento de tela iniciado. Enviando fluxo do vídeo do seu pet para Érico analisar..." },
                                  { author: "Érico", text: "Recebi a transmissão do vídeo! Muito interessante ver a alteração de postura dele no início..." }
                                ]);
                              }}
                              className="px-4 h-11 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full font-sans text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Compartilhar Vídeo do Pet
                            </button>

                            {/* Disconnect red call button */}
                            <button
                              onClick={() => setInActiveCall(false)}
                              className="px-5 h-11 bg-red-600 hover:bg-red-500 text-white rounded-full font-sans text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-lift"
                              id="disconnect-call-simulation"
                            >
                              Desconectar Sala
                            </button>
                          </div>

                        </div>

                        {/* RIGHT 3 COLUMNS: Micro chat within active teleconsulta session */}
                        <div className="lg:col-span-3 bg-charcoal/90 border-l border-white/5 p-4 flex flex-col justify-between text-left">
                          <div>
                            <h4 className="font-serif text-xs font-bold text-white border-b border-white/10 pb-2 mb-3">
                              Chat da Videoconferência
                            </h4>

                            <div className="space-y-2.5 max-h-[300px] overflow-y-auto no-scrollbar py-1">
                              {callChatMessages.map((msg, index) => (
                                <div key={index} className="text-[10px] leading-relaxed">
                                  <strong className="text-peach block">{msg.author}:</strong>
                                  <span className="text-white/80 block">{msg.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <form onSubmit={handleSendCallChat} className="flex gap-1 border-t border-white/5 pt-3 mt-3">
                            <input
                              type="text"
                              value={callChatInput}
                              onChange={(e) => setCallChatInput(e.target.value)}
                              placeholder="Fale com Érico aqui..."
                              className="flex-1 bg-black/60 border border-white/10 text-[11px] p-2 text-white outline-none rounded-sm"
                            />
                            <button
                              type="submit"
                              className="bg-white/15 hover:bg-white/25 text-white text-[10px] uppercase font-bold px-2 rounded-sm cursor-pointer"
                            >
                              Send
                            </button>
                          </form>
                        </div>

                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
