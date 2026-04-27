import { useState, type FormEvent } from "react";
import { api, ApiError } from "../api/client";
import { I18N } from "../data/i18n";
import type { Lang } from "../hooks/useLang";
import { Icon } from "./icons";

interface Props {
  lang: Lang;
}

type Status = "idle" | "sending" | "ok" | "error";

export function Contact({ lang }: Props) {
  const t = I18N[lang];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await api.contact({ name, email, message });
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof ApiError ? `HTTP ${err.status}` : "network error");
    }
  };

  return (
    <div className="contact">
      <div>
        <div className="section-label">{t.sections.contact.label}</div>
        <h2 className="contact-title">{t.contactCard.title}</h2>
        <p className="contact-desc">{t.contactCard.desc}</p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          <input
            className="contact-input"
            placeholder={lang === "ru" ? "Ваше имя" : "Your name"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
          />
          <input
            className="contact-input"
            type="email"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            className="contact-input"
            rows={4}
            placeholder={lang === "ru" ? "Сообщение…" : "Your message…"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={10}
          />
          <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
            <Icon.Mail />
            {status === "sending"
              ? lang === "ru" ? "Отправка…" : "Sending…"
              : lang === "ru" ? "Отправить" : "Send"}
          </button>
          {status === "ok" && (
            <div style={{ color: "var(--accent)", fontSize: 13 }}>
              ✓ {lang === "ru" ? "Сообщение отправлено!" : "Message sent!"}
            </div>
          )}
          {status === "error" && (
            <div style={{ color: "var(--keyword)", fontSize: 13 }}>
              ✗ {errorMsg} — {lang === "ru" ? "напишите напрямую" : "please reach out directly"}
            </div>
          )}
        </form>
      </div>

      <div className="contact-links">
        <a className="contact-link" href="https://github.com/bezdarnosti-yt" target="_blank" rel="noopener noreferrer">
          <span className="icon"><Icon.Github /></span>
          <span className="meta">
            <span className="meta-label">GitHub</span>
            <span className="meta-val">github.com/bezdarnosti-yt</span>
          </span>
          <span className="arrow"><Icon.ArrowRight /></span>
        </a>
        <a className="contact-link" href="https://t.me/bezdarnosti8" target="_blank" rel="noopener noreferrer">
          <span className="icon"><Icon.Telegram /></span>
          <span className="meta">
            <span className="meta-label">Telegram</span>
            <span className="meta-val">@bezdarnosti8</span>
          </span>
          <span className="arrow"><Icon.ArrowRight /></span>
        </a>
        <a className="contact-link" href="mailto:r403prod@gmail.com">
          <span className="icon"><Icon.Mail /></span>
          <span className="meta">
            <span className="meta-label">E-mail</span>
            <span className="meta-val">r403prod@gmail.com</span>
          </span>
          <span className="arrow"><Icon.ArrowRight /></span>
        </a>
      </div>
    </div>
  );
}
