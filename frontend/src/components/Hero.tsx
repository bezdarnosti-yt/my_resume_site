/* ============================================
   Hero section
   ============================================ */
import { I18N } from "../data/i18n";
import type { Lang } from "../hooks/useLang";
import { useTyping } from "../hooks/useTyping";
import { Icon } from "./icons";

interface Props {
  lang: Lang;
  onContact: () => void;
  onDownload: () => void;
}

export function Hero({ lang, onContact, onDownload }: Props) {
  const t = I18N[lang].hero;
  const sys = I18N[lang].sysInfo;
  const typed = useTyping(t.typedRoles);

  return (
    <section className="hero" id="about">
      <div className="container hero-inner">
        <div>
          <div className="hero-greeting">{t.greeting}</div>
          <h1>{t.name}</h1>
          <div className="hero-role">
            <span className="typed">{typed || "\u00A0"}</span>
          </div>
          <p className="hero-bio">{t.bio}</p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={onContact}>
              <Icon.Mail /> {t.ctaPrimary}
            </button>
            <button className="btn" onClick={onDownload}>
              <Icon.Download /> {t.ctaSecondary}
            </button>
            <a className="btn btn-ghost" href="https://github.com/bezdarnosti-yt" target="_blank" rel="noopener noreferrer">
              <Icon.Github /> GitHub
            </a>
          </div>
          <div className="hero-meta">
            {t.metaItems.map((m, i) => (
              <div className="hero-meta-item" key={i}>
                {m.dot && <span className="dot-green" />}
                {m.text}
              </div>
            ))}
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-head">
            <div className="traffic"><span /><span /><span /></div>
            <span className="hero-card-title">{sys.title}</span>
          </div>
          <div className="hero-card-body">
            <div className="kv">
              {sys.rows.map(([k, v], i) => (
                <div key={i} style={{ display: "contents" }}>
                  <div className="k">{k}</div>
                  <div className="v" dangerouslySetInnerHTML={{ __html: v }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
