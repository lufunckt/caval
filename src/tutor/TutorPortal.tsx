import React, { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "../lib/local-data";
import { localRequest } from "../lib/local-client";
import { AccountAction } from "./AccountAction";
const sendEmailVerification = (_user: unknown) => localRequest("/api/auth/verification-email", {});
import {
  Home,
  Users,
  MessageCircle,
  Video,
  PawPrint,
  LogOut,
  Camera,
  Download,
  Heart,
  Send,
  Calendar,
  BookOpen,
  LockKeyhole,
  Settings,
  Mic,
  X,
  LoaderCircle,
  Check,
  Menu,
} from "lucide-react";
import { useAuth, UserProfile } from "../context/AuthCtx";
import { db } from "../lib/local-data";
import { CONFIG } from "../config";
import { tutorApi, compressPhoto } from "./api";
import {
  Tab,
  Topic,
  TOPICS,
  Post,
  Comment,
  Message,
  Consultation,
  Log,
  isEducator,
} from "./types";
import "./tutor.css";

function useRecords<T>(
  path: string | null,
  field = "createdAt",
  direction: "asc" | "desc" = "desc",
  max = 50,
) {
  const [rows, setRows] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!!path);
  useEffect(() => {
    setRows([]);
    setError("");
    setLoading(!!path);
    if (!path) return;
    return onSnapshot(
      query(collection(db, path), orderBy(field, direction), limit(max)),
      (snap) => {
        setRows(snap.docs.map((d) => ({ ...d.data(), id: d.id })) as T[]);
        setLoading(false);
      },
      () => {
        setError(
          "Não foi possível carregar. Verifique sua conexão ou tente novamente.",
        );
        setLoading(false);
      },
    );
  }, [path, field, direction, max]);
  return { rows, error, loading };
}
const errorText = (e: any) => {
  const code = e?.code || "";
  if (code.includes("email-already-in-use"))
    return "Este e-mail já tem uma conta. Use Entrar ou recupere a senha.";
  if (code.includes("invalid-credential") || code.includes("wrong-password"))
    return "Confira seu e-mail e sua senha.";
  if (code.includes("weak-password"))
    return "Use uma senha com pelo menos 12 caracteres.";
  if (code.includes("permission-denied"))
    return "Você não tem permissão para esta ação. Confirme seu e-mail e tente novamente.";
  if (code.includes("popup-closed"))
    return "O login foi fechado. Você pode tentar novamente.";
  return e?.message || "Não foi possível concluir. Tente novamente.";
};
const dateLabel = (n: number) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(n));
function Notice({
  children,
  bad = false,
}: {
  children: React.ReactNode;
  bad?: boolean;
}) {
  return children ? (
    <p
      role={bad ? "alert" : "status"}
      className={`tp-notice ${bad ? "tp-error" : ""}`}
    >
      {children}
    </p>
  ) : null;
}
function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="tp-empty">
      <PawPrint aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
function Avatar({
  image,
  name = "Cão",
  large = false,
}: {
  image?: string;
  name?: string;
  large?: boolean;
}) {
  return (
    <span className={`tp-avatar ${large ? "tp-avatar-lg" : ""}`}>
      {image ? (
        <img src={image} alt={`Avatar de ${name}`} />
      ) : (
        <PawPrint aria-label="Avatar padrão" />
      )}
    </span>
  );
}
function PublicAvatar({ uid, name }: { uid: string; name: string }) {
  const [image, setImage] = useState("");
  useEffect(() => {
    if (!uid) return;
    return onSnapshot(
      doc(db, "tutor_public_profiles", uid),
      (snap) => setImage(snap.data()?.avatar || ""),
      () => setImage(""),
    );
  }, [uid]);
  return <Avatar image={image} name={name} />;
}
function Brand() {
  return (
    <a className="tp-brand" href="/area-do-tutor">
      <span className="tp-brand-icon">
        <PawPrint />
      </span>
      <span>
        ÁREA DO
        <br />
        <strong>TUTOR</strong>
      </span>
    </a>
  );
}
function AuthScreen() {
  const { loginWithEmail, registerWithEmail, resetPassword } =
    useAuth();
  const [mode, setMode] = useState<"signup" | "login" | "reset">("signup");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const action = async (work: () => Promise<void>) => {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      await work();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim();
    const password = String(f.get("password") || "");
    action(async () => {
      if (mode === "reset") {
        await resetPassword(email);
        setNotice(
          "Se houver uma conta com este e-mail, você receberá as instruções de recuperação.",
        );
      } else if (mode === "login") await loginWithEmail(email, password);
      else
        await registerWithEmail(String(f.get("name")).trim(), email, password);
    });
  };
  return (
    <div className="tp-auth">
      <section className="tp-auth-story">
        <Brand />
        <span className="tp-eyebrow">
          Érico Cavalheiro · Educação relacional
        </span>
        <h1>
          Seu lugar,
          <br />
          junto do
          <br />
          <em>seu cão.</em>
        </h1>
        <p>
          Uma comunidade para observar, aprender e compartilhar a vida com quem
          caminha ao seu lado.
        </p>
        <img
          className="tp-mascot"
          src="/tutor/biscoito.webp"
          alt="Biscoito, o cão ilustrado da Área do Tutor"
        />
        <div className="tp-features">
          <span>
            <Users /> Comunidade aberta
          </span>
          <span>
            <PawPrint /> Perfil do seu cão
          </span>
          <span>
            <Video /> Consultas online
          </span>
        </div>
      </section>
      <section className="tp-auth-form tp-paper">
        <span className="tp-tag">Cadastro básico gratuito</span>
        <h2>
          {mode === "signup"
            ? "Chega mais."
            : mode === "login"
              ? "Bom te ver de novo."
              : "Recuperar acesso"}
        </h2>
        <p>
          {mode === "signup"
            ? "Comece pelo vínculo. O resto, construímos juntos."
            : "Seu espaço continua aqui."}
        </p>
        <form onSubmit={submit}>
          {mode === "signup" && (
            <label>
              Seu nome
              <input name="name" autoComplete="name" required maxLength={120} />
            </label>
          )}
          <label>
            E-mail
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
          {mode !== "reset" && (
            <label>
              Senha
              <input
                name="password"
                aria-label="Senha"
                type="password"
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                required
                minLength={mode === "signup" ? 12 : 1}
                maxLength={128}
              />
              <small>
                {mode === "signup" ? "Use pelo menos 12 caracteres." : ""}
              </small>
            </label>
          )}
          {mode === "signup" && (
            <p className="tp-small">
              Seu perfil privado e as informações de acompanhamento ficam
              separados das publicações que você compartilhar na comunidade.
            </p>
          )}
          <Notice bad>{error}</Notice>
          <Notice>{notice}</Notice>
          <button className="tp-primary" disabled={busy}>
            {busy
              ? "Aguarde…"
              : mode === "signup"
                ? "Criar conta gratuita"
                : mode === "login"
                  ? "Entrar"
                  : "Enviar instruções"}
          </button>
        </form>

        <button
          className="tp-text-button"
          disabled={busy}
          onClick={() => {
            setMode(mode === "signup" ? "login" : "signup");
            setError("");
            setNotice("");
          }}
        >
          {mode === "signup" ? "Já tenho conta" : "Quero criar uma conta"}
        </button>
        {mode === "login" && (
          <button
            className="tp-text-button"
            onClick={() => {
              setMode("reset");
              setError("");
            }}
          >
            Esqueci minha senha
          </button>
        )}
        <a className="tp-back" href="/">
          Voltar ao site do Érico
        </a>
      </section>
    </div>
  );
}
function Onboarding() {
  const { user, createProfile, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await createProfile(
        String(f.get("name")),
        String(f.get("dogName")),
        String(f.get("breed")),
        String(f.get("age")),
      );
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="tp-onboarding tp-paper">
      <Brand />
      <span className="tp-eyebrow">Primeiro, vocês.</span>
      <h1>Vamos conhecer seu cão?</h1>
      <p>Crie o perfil de vocês. A foto e o avatar podem vir depois.</p>
      <form onSubmit={submit}>
        <label>
          Seu nome
          <input
            name="name"
            defaultValue={user?.displayName || ""}
            required
            maxLength={120}
            autoComplete="name"
          />
        </label>
        <label>
          Nome do cão
          <input name="dogName" required maxLength={80} />
        </label>
        <div className="tp-two">
          <label>
            Raça ou mistura
            <input name="breed" placeholder="Opcional" maxLength={80} />
          </label>
          <label>
            Idade aproximada
            <input name="age" placeholder="Opcional" maxLength={40} />
          </label>
        </div>
        <Notice bad>{error}</Notice>
        <button className="tp-primary" disabled={busy}>
          {busy ? "Salvando…" : "Entrar na Área do Tutor"}
        </button>
      </form>
      <button className="tp-text-button" onClick={logout}>
        Sair desta conta
      </button>
    </div>
  );
}
function DogProfile({ profile }: { profile: UserProfile }) {
  const [photo, setPhoto] = useState(profile.dogPhoto || "");
  const [avatar, setAvatar] = useState(profile.dogAvatar || "");
  const [busy, setBusy] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, "users", profile.uid), {
        dogName: String(f.get("dogName")).trim(),
        dogBreed: String(f.get("breed")).trim() || "Não informado",
        dogAge: String(f.get("age")).trim() || "Não informado",
        dogPhoto: photo,
        dogAvatar: avatar,
        updatedAt: serverTimestamp(),
      });
      const selectedImage = avatar || photo;
      const publicAvatar = selectedImage
        ? await compressPhoto(await (await fetch(selectedImage)).blob(), 160)
        : "";
      batch.set(doc(db, "tutor_public_profiles", profile.uid), {
        uid: profile.uid,
        avatar: publicAvatar,
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
      setNotice(
        "Perfil salvo. O avatar também aparecerá nos seus próximos comentários.",
      );
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  const upload = async (file?: File) => {
    if (!file) return;
    setError("");
    setNotice("");
    try {
      setPhoto(await compressPhoto(file));
      setNotice("Foto preparada. Salve o perfil para confirmar.");
    } catch (e) {
      setError(errorText(e));
    }
  };
  const generate = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await tutorApi("avatar", { photo, consent });
      const blob = await (await fetch(result.image)).blob();
      setAvatar(await compressPhoto(blob));
      setNotice("Seu avatar está pronto. Salve o perfil para usá-lo.");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <header className="tp-page-heading">
        <span className="tp-eyebrow">Uma história só de vocês</span>
        <h1>Meu cão</h1>
        <p>Foto, identidade e os pequenos detalhes que tornam seu cão único.</p>
      </header>
      <section className="tp-paper tp-profile">
        <div className="tp-profile-art">
          <Avatar image={avatar || photo} name={profile.dogName} large />
          <h2>{profile.dogName}</h2>
          <span className="tp-tag">
            {avatar ? "Avatar ilustrado" : "Seu companheiro de jornada"}
          </span>
          {photo && (
            <img
              className="tp-source-photo"
              src={photo}
              alt="Foto original do seu cão"
            />
          )}
        </div>
        <form onSubmit={save}>
          <label>
            Nome do cão
            <input
              name="dogName"
              defaultValue={profile.dogName}
              required
              maxLength={80}
            />
          </label>
          <div className="tp-two">
            <label>
              Raça ou mistura
              <input
                name="breed"
                defaultValue={profile.dogBreed}
                maxLength={80}
              />
            </label>
            <label>
              Idade
              <input name="age" defaultValue={profile.dogAge} maxLength={40} />
            </label>
          </div>
          <label className="tp-upload">
            <Camera /> Enviar foto do cão
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy}
              onChange={(e) => {
                upload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <small>JPG, PNG ou WebP · até 10 MB</small>
          </label>
          <label className="tp-checkbox">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            Autorizo enviar esta foto ao serviço de IA do Google para criar o
            avatar. Use uma foto apenas do cão.
          </label>
          <button
            type="button"
            className="tp-secondary"
            disabled={!photo || !consent || busy}
            onClick={generate}
          >
            {busy ? "Preparando…" : "Transformar em desenho de papel"}
          </button>
          <p className="tp-small">
            Uma geração por mês no acesso gratuito. Se a geração não funcionar,
            você pode continuar com sua foto.
          </p>
          {avatar && (
            <div className="tp-actions">
              <a
                className="tp-secondary"
                href={avatar}
                download={`${profile.dogName}-avatar.jpg`}
              >
                <Download /> Salvar imagem
              </a>
              <button
                type="button"
                className="tp-text-button"
                onClick={() => setAvatar("")}
              >
                Usar minha foto
              </button>
            </div>
          )}
          <Notice bad>{error}</Notice>
          <Notice>{notice}</Notice>
          <button className="tp-primary" disabled={busy}>
            Salvar perfil
          </button>
        </form>
      </section>
    </>
  );
}
function PostCard({
  post,
  profile,
  admin,
  reportError,
}: {
  post: Post;
  profile: UserProfile;
  admin: boolean;
  reportError: (s: string) => void;
}) {
  const { rows: comments, error } = useRecords<Comment>(
    `forum_posts/${post.id}/comments`,
    "createdAt",
    "asc",
  );
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [pending, setPending] = useState(false);
  const [expanded, setExpanded] = useState(false);
  useEffect(
    () =>
      onSnapshot(
        collection(db, "forum_posts", post.id, "likes"),
        (snap) => {
          setLikes(snap.size);
          setLiked(snap.docs.some((d) => d.id === profile.uid));
        },
        () => reportError("Não foi possível carregar as curtidas."),
      ),
    [post.id, profile.uid],
  );
  const like = async () => {
    setPending(true);
    try {
      const ref = doc(db, "forum_posts", post.id, "likes", profile.uid);
      if (liked) await deleteDoc(ref);
      else
        await setDoc(ref, { uid: profile.uid, createdAt: serverTimestamp() });
    } catch (e) {
      reportError(errorText(e));
    } finally {
      setPending(false);
    }
  };
  const comment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const text = String(new FormData(form).get("text")).trim();
    if (!text) return;
    setPending(true);
    try {
      await addDoc(collection(db, "forum_posts", post.id, "comments"), {
        authorId: profile.uid,
        author: profile.name,
        text,
        createdAt: serverTimestamp(),
      });
      form.reset();
    } catch (e) {
      reportError(errorText(e));
    } finally {
      setPending(false);
    }
  };
  return (
    <article className="tp-paper tp-post">
      <div className="tp-post-author">
        <PublicAvatar uid={post.authorId} name={post.dog} />
        <div>
          <strong>{post.author}</strong>
          <small>com {post.dog}</small>
        </div>
        <span className="tp-tag">{TOPICS[post.topic] || "Comunidade"}</span>
      </div>
      <p className="tp-user-text">{post.content}</p>
      <div className="tp-post-actions">
        <button disabled={pending} aria-pressed={liked} onClick={like}>
          <Heart fill={liked ? "currentColor" : "none"} /> {likes}{" "}
          {likes === 1 ? "curtida" : "curtidas"}
        </button>
        <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
          <MessageCircle /> {comments.length} comentários
        </button>
        {(admin || post.authorId === profile.uid) && (
          <button
            disabled={pending}
            onClick={async () => {
              if (!window.confirm("Excluir esta publicação?")) return;
              try {
                await deleteDoc(doc(db, "forum_posts", post.id));
              } catch (e) {
                reportError(errorText(e));
              }
            }}
          >
            Excluir
          </button>
        )}
      </div>
      {expanded && (
        <div className="tp-comments">
          <Notice bad>{error}</Notice>
          {comments.map((c) => (
            <p key={c.id}>
              <strong>{c.author}</strong>
              <span className="tp-user-text">{c.text}</span>
            </p>
          ))}
          <form className="tp-inline-form" onSubmit={comment}>
            <input
              name="text"
              aria-label="Seu comentário"
              placeholder="Compartilhe uma ideia…"
              required
              maxLength={1500}
            />
            <button
              className="tp-icon-button"
              disabled={pending}
              aria-label="Enviar comentário"
            >
              <Send />
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
function Community({
  profile,
  admin,
}: {
  profile: UserProfile;
  admin: boolean;
}) {
  const { rows, error, loading } = useRecords<Post>("forum_posts");
  const [topic, setTopic] = useState("todos");
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  async function publish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const content = String(f.get("content")).trim();
    if (!content) return;
    setBusy(true);
    setFailure("");
    try {
      const ref = doc(collection(db, "forum_posts"));
      await setDoc(ref, {
        id: ref.id,
        authorId: profile.uid,
        author: profile.name,
        dog: profile.dogName,
        content,
        topic: f.get("topic"),
        likes: 0,
        createdAt: serverTimestamp(),
      });
      form.reset();
    } catch (e) {
      setFailure(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <header className="tp-page-heading">
        <span className="tp-eyebrow">Aprender também é compartilhar</span>
        <h1>Comunidade</h1>
        <p>
          Conquistas pequenas, perguntas reais e outras famílias caminhando
          junto.
        </p>
      </header>
      <div className="tp-community-layout">
        <div>
          <form className="tp-paper tp-composer" onSubmit={publish}>
            <div className="tp-post-author">
              <Avatar
                image={profile.dogAvatar || profile.dogPhoto}
                name={profile.dogName}
              />
              <strong>Como foi o dia de vocês?</strong>
            </div>
            <label className="tp-sr-only" htmlFor="post-content">
              Sua publicação
            </label>
            <textarea
              id="post-content"
              name="content"
              placeholder="Conte uma descoberta, uma dúvida ou uma conquista…"
              required
              maxLength={3000}
              rows={3}
            />
            <div className="tp-actions">
              <label>
                Assunto
                <select name="topic">
                  {Object.entries(TOPICS).map(([id, name]) => (
                    <option value={id} key={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <button className="tp-primary" disabled={busy}>
                {busy ? "Publicando…" : "Publicar"}
              </button>
            </div>
          </form>
          <Notice bad>{error || failure}</Notice>
          <div className="tp-chips" aria-label="Filtrar publicações">
            {[["todos", "Todos"], ...Object.entries(TOPICS)].map(
              ([id, name]) => (
                <button
                  aria-pressed={topic === id}
                  key={id}
                  onClick={() => setTopic(id)}
                >
                  {name}
                </button>
              ),
            )}
          </div>
          {loading ? (
            <p role="status">Carregando publicações…</p>
          ) : rows.filter((p) => topic === "todos" || p.topic === topic)
              .length === 0 ? (
            <Empty>
              Esta conversa pode começar por você. Compartilhe o dia de vocês.
            </Empty>
          ) : (
            rows
              .filter((p) => topic === "todos" || p.topic === topic)
              .map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  profile={profile}
                  admin={admin}
                  reportError={setFailure}
                />
              ))
          )}
        </div>
        <aside className="tp-paper tp-community-note">
          <Users />
          <h2>Uma comunidade com cuidado.</h2>
          <p>
            Compartilhe experiências com respeito. Evite publicar dados pessoais
            de outras pessoas.
          </p>
          <p>
            As trocas entre tutores não substituem uma avaliação individual. O
            Érico participa conforme sua disponibilidade.
          </p>
          <a href={CONFIG.WHATSAPP_URL} target="_blank" rel="noreferrer">
            Conhecer o acompanhamento
          </a>
        </aside>
      </div>
    </>
  );
}
function Conversations({
  profile,
  admin,
}: {
  profile: UserProfile;
  admin: boolean;
}) {
  const [channel, setChannel] = useState<string>("passeios");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const privateChat = channel === "privado";
  const permitted = !privateChat || profile.isAuthorized || admin;
  const path = permitted
    ? privateChat
      ? `users/${profile.uid}/messages`
      : `tutor_rooms/${channel}/messages`
    : null;
  const {
    rows,
    error: loadError,
    loading,
  } = useRecords<Message>(path, "createdAt", "desc", 100);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [rows.length]);
  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const text = String(new FormData(form).get("text")).trim();
    if (!text || !path) return;
    setBusy(true);
    setError("");
    try {
      const ref = doc(collection(db, path));
      await setDoc(ref, {
        id: ref.id,
        authorId: profile.uid,
        author: profile.name,
        text,
        ...(privateChat ? { sender: admin ? "erico" : "tutor" } : {}),
        createdAt: serverTimestamp(),
      });
      form.reset();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <header className="tp-page-heading">
        <span className="tp-eyebrow">Conversas que aproximam</span>
        <h1>Conversas</h1>
        <p>
          Fóruns abertos para trocar experiências sobre a rotina com seu cão.
        </p>
      </header>
      <div className="tp-chat-layout">
        <aside className="tp-paper tp-channel-list">
          <h2>Fóruns da comunidade</h2>
          {Object.entries(TOPICS).map(([id, name]) => (
            <button
              key={id}
              aria-pressed={id === channel}
              onClick={() => setChannel(id)}
            >
              <MessageCircle />
              {name}
            </button>
          ))}
          <hr />
          <button
            aria-pressed={privateChat}
            onClick={() => setChannel("privado")}
          >
            <LockKeyhole /> Individual com Érico
          </button>
          <small>Exclusivo para quem está em tutoria.</small>
        </aside>
        <section className="tp-paper tp-chat">
          <h2>
            {privateChat ? "Conversa individual" : TOPICS[channel as Topic]}
          </h2>
          {!permitted ? (
            <div className="tp-empty">
              <LockKeyhole />
              <h3>Um espaço só para vocês.</h3>
              <p>
                A conversa individual faz parte do acompanhamento com Érico.
              </p>
              <a
                className="tp-primary"
                href={CONFIG.WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
              >
                Conhecer a tutoria
              </a>
            </div>
          ) : (
            <>
              <div
                className="tp-chat-messages"
                role="log"
                aria-label="Mensagens da conversa"
              >
                {loading ? (
                  <p>Carregando conversa…</p>
                ) : !rows.length ? (
                  <Empty>A conversa começa aqui. Qual a sua dúvida?</Empty>
                ) : (
                  [...rows].reverse().map((m) => (
                    <div
                      key={m.id}
                      className={`tp-message ${m.authorId === profile.uid ? "tp-message-mine" : ""}`}
                    >
                      <strong>
                        {m.author || (m.sender === "erico" ? "Érico" : "Tutor")}
                      </strong>
                      <p className="tp-user-text">{m.text}</p>
                    </div>
                  ))
                )}
                <div ref={end} />
              </div>
              <Notice bad>{loadError || error}</Notice>
              <form className="tp-inline-form" onSubmit={send}>
                <input
                  name="text"
                  required
                  maxLength={4000}
                  placeholder="Escreva sua mensagem…"
                  aria-label="Mensagem"
                  autoComplete="off"
                />
                <button
                  className="tp-primary"
                  disabled={busy}
                  aria-label="Enviar mensagem"
                >
                  <Send />
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </>
  );
}
function ConsultationRoom({
  consultation,
  close,
}: {
  consultation: Consultation;
  close: () => void;
}) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  const ref = useRef<HTMLVideoElement>(null);
  const currentStream = useRef<MediaStream | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      currentStream.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  const test = async () => {
    setError("");
    try {
      currentStream.current?.getTracks().forEach((t) => t.stop());
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      if (!mounted.current) {
        media.getTracks().forEach((t) => t.stop());
        return;
      }
      currentStream.current = media;
      setStream(media);
    } catch {
      setStream(null);
      setError(
        "Não conseguimos acessar câmera e microfone. Confira as permissões do navegador.",
      );
    }
  };
  const join = async () => {
    setBusy(true);
    setError("");
    try {
      const data = await tutorApi(`consultations/${consultation.id}/join`, {});
      currentStream.current?.getTracks().forEach((t) => t.stop());
      setStream(null);
      setUrl(data.url);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="tp-paper tp-call">
      <div className="tp-section-top">
        <div>
          <span className="tp-eyebrow">Consulta online</span>
          <h2>{url ? "Seu encontro com Érico" : "Tudo pronto?"}</h2>
        </div>
        <button className="tp-secondary" onClick={close}>
          <X />
          {url ? "Fechar sala" : "Voltar"}
        </button>
      </div>
      <p>
        {dateLabel(consultation.startsAt)} · {consultation.duration} minutos
      </p>
      {url ? (
        <iframe
          title="Sala de consulta online com Érico"
          src={url}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          referrerPolicy="no-referrer"
          allowFullScreen
        />
      ) : (
        <>
          <div className="tp-video-preview">
            {stream ? (
              <video autoPlay muted playsInline ref={ref} />
            ) : (
              <div>
                <Camera />
                <p>Teste sua câmera e seu microfone antes de entrar.</p>
              </div>
            )}
          </div>
          <div className="tp-actions">
            <button className="tp-secondary" onClick={test}>
              <Camera />
              Testar câmera e microfone
            </button>
            {stream && (
              <span className="tp-tag">
                <Check /> Equipamentos disponíveis
              </span>
            )}
          </div>
          <p className="tp-small">
            O teste usa a imagem e o áudio apenas neste aparelho. A sala abre 15
            minutos antes do horário marcado. Mostre o cão sem forçar situações.
          </p>
          <Notice bad>{error}</Notice>
          <button className="tp-primary" onClick={join} disabled={busy}>
            {busy ? "Abrindo sala…" : "Entrar na consulta"}
          </button>
        </>
      )}
      <p className="tp-small">Gravação automática desativada.</p>
    </section>
  );
}
function Consultations({ uid }: { uid: string }) {
  const { rows, loading, error } = useRecords<Consultation>(
    `users/${uid}/consultations`,
    "startsAt",
    "desc",
  );
  const [selected, setSelected] = useState<Consultation | null>(null);
  if (selected)
    return (
      <ConsultationRoom
        consultation={selected}
        close={() => setSelected(null)}
      />
    );
  const next = rows
    .filter((c) => c.status === "scheduled")
    .sort((a, b) => a.startsAt - b.startsAt);
  return (
    <>
      <header className="tp-page-heading">
        <span className="tp-eyebrow">Perto de vocês, de onde estiverem</span>
        <h1>Consultas online</h1>
        <p>
          Seus encontros com Érico e o que vocês construíram em cada conversa.
        </p>
      </header>
      <Notice bad>{error}</Notice>
      {loading ? (
        <p role="status">Carregando consultas…</p>
      ) : !next.length ? (
        <section className="tp-paper tp-consult-empty">
          <Video />
          <h2>Vamos conversar sobre seu cão?</h2>
          <p>
            Você ainda não tem uma consulta agendada. Fale com Érico para
            combinar o melhor horário.
          </p>
          <a
            className="tp-primary"
            href={CONFIG.WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
          >
            Agendar com Érico
          </a>
        </section>
      ) : (
        next.map((c) => (
          <article className="tp-paper tp-consult" key={c.id}>
            <Calendar />
            <div>
              <span className="tp-tag">Consulta agendada</span>
              <h2>{dateLabel(c.startsAt)}</h2>
              <p>Érico Cavalheiro · {c.duration} minutos</p>
            </div>
            <button className="tp-primary" onClick={() => setSelected(c)}>
              Preparar minha consulta
            </button>
          </article>
        ))
      )}
      <h2 className="tp-subheading">Depois do encontro</h2>
      {rows.filter((c) => c.status === "completed").length === 0 ? (
        <Empty>
          Os resumos e as atividades aparecerão aqui depois das suas consultas.
        </Empty>
      ) : (
        rows
          .filter((c) => c.status === "completed")
          .map((c) => (
            <details className="tp-paper tp-summary" key={c.id}>
              <summary>Orientações de {dateLabel(c.startsAt)}</summary>
              <h3>Resumo da consulta</h3>
              <p className="tp-user-text">
                {c.summary || "Érico ainda está preparando o resumo."}
              </p>
              <h3>Atividades combinadas</h3>
              <p className="tp-user-text">
                {c.activities || "Nenhuma atividade publicada."}
              </p>
              <h3>Materiais de apoio</h3>
              <p className="tp-user-text">
                {c.materials || "Nenhum material publicado."}
              </p>
            </details>
          ))
      )}
    </>
  );
}
function Journal({ profile }: { profile: UserProfile }) {
  const { rows, error } = useRecords<Log>(`users/${profile.uid}/logs`);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const notes = String(f.get("notes")).trim();
    if (!notes) return;
    setBusy(true);
    setFailure("");
    try {
      const ref = doc(collection(db, "users", profile.uid, "logs"));
      await setDoc(ref, {
        id: ref.id,
        userId: profile.uid,
        date: new Date().toISOString().slice(0, 10),
        emotion: f.get("emotion"),
        notes,
        createdAt: serverTimestamp(),
      });
      form.reset();
    } catch (e) {
      setFailure(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="tp-paper tp-journal">
      <div className="tp-section-top">
        <div>
          <span className="tp-eyebrow">Pequenas observações contam</span>
          <h2>Diário de {profile.dogName}</h2>
        </div>
        <BookOpen />
      </div>
      <p className="tp-small">
        Suas anotações são privadas. Érico também pode acessá-las para
        acompanhar vocês.
      </p>
      <form onSubmit={save}>
        <label>
          Como você percebeu seu cão hoje?
          <select name="emotion">
            <option value="calmo">Calmo</option>
            <option value="focado">Focado</option>
            <option value="ansioso">Ansioso</option>
            <option value="disperso">Disperso</option>
          </select>
        </label>
        <label>
          O que chamou sua atenção?
          <textarea
            name="notes"
            required
            maxLength={5000}
            rows={3}
            placeholder="Um contexto, uma reação, uma pequena mudança…"
          />
        </label>
        <button className="tp-primary" disabled={busy}>
          {busy ? "Salvando…" : "Guardar no diário"}
        </button>
      </form>
      <Notice bad>{error || failure}</Notice>
      <div className="tp-log-list">
        {rows.slice(0, 5).map((l) => (
          <article key={l.id}>
            <strong>
              {l.date.split("-").reverse().join("/")} · {l.emotion}
            </strong>
            <p className="tp-user-text">{l.notes}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
function AdminPanel() {
  const { user } = useAuth();
  const { rows: tutors, error } = useRecords<UserProfile>("users");
  const [uid, setUid] = useState("");
  const [failure, setFailure] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const selected = tutors.find((t) => t.uid === uid);
  const { rows: consultations } = useRecords<Consultation>(
    uid ? `users/${uid}/consultations` : null,
    "startsAt",
  );
  const { rows: messages, error: chatError } = useRecords<Message>(
    uid ? `users/${uid}/messages` : null,
    "createdAt",
    "asc",
  );
  const { rows: logs, error: logError } = useRecords<Log>(
    uid ? `users/${uid}/logs` : null,
  );
  const run = async (f: () => Promise<unknown>) => {
    setBusy(true);
    setFailure("");
    setNotice("");
    try {
      await f();
      setNotice("Alterações salvas.");
    } catch (e) {
      setFailure(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <header className="tp-page-heading">
        <span className="tp-eyebrow">Painel do educador</span>
        <h1>Acompanhar tutores</h1>
        <p>
          Agende encontros, publique orientações e gerencie o acesso individual.
        </p>
      </header>
      <Notice bad>{error || failure || chatError || logError}</Notice>
      <Notice>{notice}</Notice>
      <label>
        Tutor
        <select value={uid} onChange={(e) => setUid(e.target.value)}>
          <option value="">Selecione um tutor</option>
          {tutors.map((t) => (
            <option key={t.uid} value={t.uid}>
              {t.name} · {t.dogName}
            </option>
          ))}
        </select>
      </label>
      {selected && (
        <>
          <section className="tp-paper tp-admin-block">
            <h2>
              {selected.name} e {selected.dogName}
            </h2>
            <p>Comunidade e fóruns disponíveis no cadastro básico.</p>
            <button
              disabled={busy}
              className="tp-secondary"
              onClick={() =>
                run(() =>
                  updateDoc(doc(db, "users", uid), {
                    isAuthorized: !selected.isAuthorized,
                    updatedAt: serverTimestamp(),
                  }),
                )
              }
            >
              {selected.isAuthorized
                ? "Desativar tutoria individual"
                : "Ativar tutoria individual"}
            </button>
            <h3>Agendar consulta</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const startsAt = new Date(String(f.get("date"))).getTime();
                run(() =>
                  tutorApi("consultations", {
                    tutorId: uid,
                    startsAt,
                    duration: Number(f.get("duration")),
                  }),
                );
              }}
            >
              <p className="tp-small">
                O horário abaixo usa o fuso do seu dispositivo.
              </p>
              <div className="tp-two">
                <label>
                  Data e horário
                  <input type="datetime-local" name="date" required />
                </label>
                <label>
                  Duração (minutos)
                  <input
                    type="number"
                    name="duration"
                    min="15"
                    max="120"
                    step="15"
                    defaultValue={60}
                    required
                  />
                </label>
              </div>
              <button className="tp-primary" disabled={busy}>
                Agendar encontro
              </button>
            </form>
          </section>
          {consultations.map((c) => (
            <section className="tp-paper tp-admin-block" key={c.id}>
              <h3>
                {dateLabel(c.startsAt)} ·{" "}
                {c.status === "scheduled"
                  ? "Agendada"
                  : c.status === "completed"
                    ? "Concluída"
                    : "Cancelada"}
              </h3>
              {c.status === "scheduled" && (
                <button
                  className="tp-secondary"
                  disabled={busy}
                  onClick={() =>
                    run(async () => {
                      const result = await tutorApi(
                        `consultations/${c.id}/join`,
                        { tutorId: uid },
                      );
                      window.location.assign(result.url);
                    })
                  }
                >
                  Abrir sala como Érico
                </button>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  run(() =>
                    tutorApi(`consultations/${c.id}/update`, {
                      tutorId: uid,
                      summary: f.get("summary"),
                      activities: f.get("activities"),
                      materials: f.get("materials"),
                      status: f.get("status"),
                    }),
                  );
                }}
              >
                <label>
                  Resumo
                  <textarea
                    name="summary"
                    defaultValue={c.summary}
                    maxLength={6000}
                  />
                </label>
                <label>
                  Atividades
                  <textarea
                    name="activities"
                    defaultValue={c.activities}
                    maxLength={6000}
                  />
                </label>
                <label>
                  Materiais
                  <textarea
                    name="materials"
                    defaultValue={c.materials}
                    maxLength={6000}
                  />
                </label>
                <label>
                  Status
                  <select name="status" defaultValue={c.status}>
                    <option value="scheduled">Agendada</option>
                    <option value="completed">Concluída</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </label>
                <button disabled={busy} className="tp-primary">
                  Salvar orientações
                </button>
              </form>
            </section>
          ))}
          <section className="tp-paper tp-admin-block">
            <h2>Diário de {selected.dogName}</h2>
            {!logs.length ? (
              <p>Ainda não há anotações.</p>
            ) : (
              logs.map((l) => (
                <p className="tp-user-text" key={l.id}>
                  <strong>
                    {l.date} · {l.emotion}
                  </strong>
                  <br />
                  {l.notes}
                </p>
              ))
            )}
          </section>
          {selected.isAuthorized && (
            <section className="tp-paper tp-admin-block">
              <h2>Conversa individual</h2>
              {messages.map((m) => (
                <p className="tp-user-text" key={m.id}>
                  <strong>{m.author || m.sender}</strong>
                  <br />
                  {m.text}
                </p>
              ))}
              <form
                className="tp-inline-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const text = String(new FormData(form).get("text")).trim();
                  if (!text) return;
                  run(async () => {
                    const ref = doc(collection(db, "users", uid, "messages"));
                    await setDoc(ref, {
                      id: ref.id,
                      sender: "erico",
                      authorId: user!.uid,
                      author: "Érico Cavalheiro",
                      text,
                      createdAt: serverTimestamp(),
                    });
                    form.reset();
                  });
                }}
              >
                <input
                  name="text"
                  maxLength={4000}
                  required
                  aria-label="Mensagem ao tutor"
                />
                <button className="tp-primary" disabled={busy}>
                  Enviar
                </button>
              </form>
            </section>
          )}
        </>
      )}
    </>
  );
}
export function TutorPortal() {
  useEffect(() => {
    const previous = document.title;
    document.title = "Área do Tutor | Érico Cavalheiro";
    return () => {
      document.title = previous;
    };
  }, []);
  const { user, userProfile, isAuthLoading, profileError, logout } =
    useAuth();
  const [tab, setTab] = useState<Tab>("inicio");
  const [menu, setMenu] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const admin = isEducator(user);
  const accountAction = new URLSearchParams(location.search).get("acao") || "";
  if (["configurar", "verificar", "redefinir"].includes(accountAction)) return <AccountAction action={accountAction} />;
  if (isAuthLoading)
    return (
      <div className="tp-root">
        <div className="tp-loading" role="status">
          <LoaderCircle /> Preparando seu espaço…
        </div>
      </div>
    );
  if (profileError)
    return (
      <div className="tp-root">
        <div className="tp-onboarding tp-paper">
          <Notice bad>{profileError}</Notice>
          <button
            className="tp-primary"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
          <button className="tp-text-button" onClick={logout}>
            Sair
          </button>
        </div>
      </div>
    );
  if (!user)
    return (
      <div className="tp-root">
        <AuthScreen />
      </div>
    );
  if (!userProfile)
    return (
      <div className="tp-root">
        <Onboarding />
      </div>
    );
  const nav: [Tab, string, typeof Home][] = [
    ["inicio", "Início", Home],
    ["comunidade", "Comunidade", Users],
    ["conversas", "Conversas", MessageCircle],
    ["consultas", "Consultas", Video],
    ["cao", "Meu cão", PawPrint],
    ...(admin
      ? [["admin", "Painel do Érico", Settings] as [Tab, string, typeof Home]]
      : []),
  ];
  const change = (id: Tab) => {
    setTab(id);
    setMenu(false);
    setError("");
    setNotice("");
    window.scrollTo({ top: 0 });
  };
  return (
    <div className="tp-root">
      <div className="tp-shell">
        <aside className={`tp-sidebar ${menu ? "tp-sidebar-open" : ""}`}>
          <Brand />
          <p className="tp-sidebar-caption">
            Antes do comando,
            <br />
            existe relação.
          </p>
          <nav aria-label="Área do Tutor">
            {nav.map(([id, name, Icon]) => (
              <button
                key={id}
                onClick={() => change(id)}
                aria-current={tab === id ? "page" : undefined}
              >
                <Icon />
                {name}
              </button>
            ))}
          </nav>
          <div className="tp-sidebar-bottom">
            <a href="/">Site do Érico</a>
            <button
              onClick={() => logout().catch((e) => setError(errorText(e)))}
            >
              <LogOut /> Sair da conta
            </button>
          </div>
        </aside>
        <div className="tp-main">
          <header className="tp-topbar">
            <button
              className="tp-menu"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-label="Abrir menu"
            >
              <Menu />
            </button>
            <span>
              Érico Cavalheiro{" "}
              <span className="tp-topbar-muted">/ Área do Tutor</span>
            </span>
            <span className="tp-user-chip">
              <Avatar
                image={userProfile.dogAvatar || userProfile.dogPhoto}
                name={userProfile.dogName}
              />
              {userProfile.name.split(" ")[0]}
            </span>
          </header>
          <main id="tutor-main" className="tp-content">
            <Notice bad>{error}</Notice>
            <Notice>{notice}</Notice>
            {!user.emailVerified && (
              <div className="tp-verification">
                <strong>
                  Confirme seu e-mail para participar da comunidade.
                </strong>
                <p>Você já pode completar o perfil do seu cão.</p>
                <div className="tp-actions">
                  <button
                    onClick={async () => {
                      try {
                        await sendEmailVerification(user);
                        setNotice(
                          "Enviamos um novo link de confirmação para seu e-mail.",
                        );
                      } catch (e) {
                        setError(errorText(e));
                      }
                    }}
                  >
                    Reenviar e-mail
                  </button>
                  <button
                    onClick={async () => {
                      await user.reload();
                      
                      window.location.reload();
                    }}
                  >
                    Já confirmei
                  </button>
                </div>
              </div>
            )}
            {tab === "inicio" && (
              <>
                <header className="tp-page-heading">
                  <span className="tp-eyebrow">
                    Um espaço de vínculo e descobertas
                  </span>
                  <h1>
                    Bom te ver,
                    <br />
                    <em>{userProfile.name.split(" ")[0]}!</em>
                  </h1>
                  <p>
                    Você e {userProfile.dogName} têm uma história para
                    construir.
                  </p>
                </header>
                <section className="tp-welcome tp-paper">
                  <div>
                    <span className="tp-tag">
                      {userProfile.isAuthorized
                        ? "Tutoria ativa"
                        : "Acesso gratuito"}
                    </span>
                    <h2>
                      O próximo passo
                      <br />
                      começa na relação.
                    </h2>
                    <p>
                      Observe a rotina. Compartilhe descobertas. Caminhe junto.
                    </p>
                    <button
                      className="tp-primary"
                      onClick={() => change("cao")}
                    >
                      {userProfile.dogPhoto
                        ? "Ver perfil do meu cão"
                        : "Colocar a foto do meu cão"}
                    </button>
                  </div>
                  <img
                    src="/tutor/biscoito.webp"
                    alt="Biscoito em desenho de papel"
                  />
                </section>
                <div className="tp-quick-grid">
                  {[
                    [
                      "comunidade",
                      Users,
                      "Gente que entende.",
                      "Encontre outras famílias e compartilhe experiências.",
                    ],
                    [
                      "conversas",
                      MessageCircle,
                      "Vamos conversar?",
                      "Fóruns sobre os desafios da convivência.",
                    ],
                    [
                      "consultas",
                      Video,
                      "Um encontro com Érico.",
                      "Agenda, sala de vídeo e orientações.",
                    ],
                  ].map(([id, Icon, title, description]: any) => (
                    <button
                      key={id}
                      className="tp-paper tp-quick"
                      onClick={() => change(id)}
                    >
                      <Icon />
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </button>
                  ))}
                </div>
                <div className="tp-home-bottom">
                  <Journal profile={userProfile} />
                  <aside className="tp-paper tp-learning">
                    <BookOpen />
                    <span className="tp-eyebrow">Para começar</span>
                    <h2>Entender vem antes de ensinar.</h2>
                    <p>
                      Conheça a educação relacional e organize suas primeiras
                      observações sobre a rotina do seu cão.
                    </p>
                    <a href="/#metodo">Conhecer o método</a>
                    <a href="/questionario-comportamento-canino">
                      Responder ao questionário
                    </a>
                    <hr />
                    <h3>Quer caminhar com orientação?</h3>
                    <p>
                      A tutoria individual inclui encontros online e
                      acompanhamento com Érico.
                    </p>
                    <a
                      className="tp-secondary"
                      href={CONFIG.WHATSAPP_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Conversar com Érico
                    </a>
                  </aside>
                </div>
              </>
            )}
            {(tab === "comunidade" || tab === "conversas") &&
            !user.emailVerified ? (
              <Empty>
                Abra o e-mail de confirmação para liberar as conversas.
              </Empty>
            ) : (
              <>
                {tab === "comunidade" && (
                  <Community profile={userProfile} admin={admin} />
                )}
                {tab === "conversas" && (
                  <Conversations profile={userProfile} admin={admin} />
                )}
              </>
            )}
            {tab === "consultas" && <Consultations uid={userProfile.uid} />}
            {tab === "cao" && (
              <DogProfile key={userProfile.uid} profile={userProfile} />
            )}
            {tab === "admin" && admin && <AdminPanel />}
          </main>
          <footer className="tp-footer">
            Educação relacional · Érico Cavalheiro{" "}
            <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </footer>
        </div>
      </div>
      <nav className="tp-mobile-nav" aria-label="Navegação rápida">
        {nav
          .filter(([id]) =>
            ["inicio", "comunidade", "consultas", "cao"].includes(id),
          )
          .map(([id, name, Icon]) => (
            <button
              key={id}
              onClick={() => change(id)}
              aria-current={tab === id ? "page" : undefined}
            >
              <Icon />
              {name}
            </button>
          ))}
      </nav>
    </div>
  );
}
