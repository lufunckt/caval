import React, { useState } from "react";
import { Download, CheckCircle, Loader2 } from "lucide-react";

export const EmailCaptureForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setStatus("success");
        setDownloadUrl(data.downloadUrl);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-forest/10 border border-forest/20 p-6 rounded-lg text-center animate-fade-in">
        <CheckCircle className="mx-auto text-forest mb-3" size={32} />
        <h4 className="font-serif text-lg font-bold text-ivory mb-2">E-book Liberado!</h4>
        <p className="text-sm text-sand mb-4">Seu e-mail foi registrado com sucesso.</p>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-forest/90 transition"
        >
          <Download size={14} />
          Baixar E-book Agora
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fade-in">
      <input
        type="email"
        placeholder="Seu melhor e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 bg-[#1f1725]/30 border border-plum-brand/15 text-ivory rounded-sm focus:outline-none focus:border-forest"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="group inline-flex items-center justify-center gap-2.5 uppercase font-sans text-xs font-bold tracking-widest bg-gradient-clay text-charcoal px-8 py-4 rounded-sm shadow-warm hover:bg-terracotta hover:text-ivory transition-all duration-300 disabled:opacity-50"
      >
        {status === "loading" ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>
            Quero baixar agora
            <Download size={14} />
          </>
        )}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 text-center">Ocorreu um erro, tente novamente.</p>
      )}
    </form>
  );
};
