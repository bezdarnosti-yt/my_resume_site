/* ============================================
   App shell — top bar + sections
   ============================================ */
import { ApiExplorer } from "./components/ApiExplorer";
import { CodePlayground } from "./components/CodePlayground";
import { Contact } from "./components/Contact";
import { Hero } from "./components/Hero";
import { Icon } from "./components/icons";
import { SkillsGrid } from "./components/SkillsGrid";
import { Terminal } from "./components/Terminal";
import { I18N } from "./data/i18n";
import { useLang } from "./hooks/useLang";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const [theme, , toggleTheme] = useTheme();
  const [lang, , toggleLang] = useLang();

  const t = I18N[lang];

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const onDownload = () => {
    window.open('/resume.pdf');
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-dot" />
            <span>denis@resume:~$</span>
          </div>
          <nav className="nav">
            <button className="nav-link" onClick={() => goTo("about")}>
              <span className="num">01.</span>{t.nav.about}
            </button>
            <button className="nav-link" onClick={() => goTo("terminal")}>
              <span className="num">02.</span>terminal
            </button>
            <button className="nav-link" onClick={() => goTo("skills")}>
              <span className="num">03.</span>{t.nav.skills}
            </button>
            <button className="nav-link" onClick={() => goTo("api")}>
              <span className="num">04.</span>{t.nav.api}
            </button>
            <button className="nav-link" onClick={() => goTo("code")}>
              <span className="num">05.</span>{t.nav.code}
            </button>
            <button className="nav-link" onClick={() => goTo("contact")}>
              <span className="num">06.</span>{t.nav.contact}
            </button>
          </nav>
          <div className="topbar-actions">
            <button className="icon-btn lang-btn" onClick={toggleLang} title="switch language">
              {lang === "ru" ? "RU" : "EN"}
            </button>
            <button className="icon-btn" onClick={toggleTheme} title="toggle theme">
              {theme === "dark" ? <Icon.Sun /> : <Icon.Moon />}
            </button>
            <button className="btn btn-primary" onClick={onDownload}>
              <Icon.Download /> PDF
            </button>
          </div>
        </div>
      </header>

      <Hero lang={lang} onContact={() => goTo("contact")} onDownload={onDownload} />

      <section id="terminal">
        <div className="container">
          <div className="section-label">{t.sections.terminal.label}</div>
          <h2 className="section-title">{t.sections.terminal.title}</h2>
          <p className="section-desc">{t.sections.terminal.desc}</p>
          <Terminal lang={lang} theme={theme} onToggleTheme={toggleTheme} onToggleLang={toggleLang} />
        </div>
      </section>

      <section id="skills">
        <div className="container">
          <div className="section-label">{t.sections.skills.label}</div>
          <h2 className="section-title">{t.sections.skills.title}</h2>
          <p className="section-desc">{t.sections.skills.desc}</p>
          <SkillsGrid lang={lang} />
        </div>
      </section>

      <section id="api">
        <div className="container">
          <div className="section-label">{t.sections.api.label}</div>
          <h2 className="section-title">{t.sections.api.title}</h2>
          <p className="section-desc">{t.sections.api.desc}</p>
          <ApiExplorer lang={lang} />
        </div>
      </section>

      <section id="code">
        <div className="container">
          <div className="section-label">{t.sections.code.label}</div>
          <h2 className="section-title">{t.sections.code.title}</h2>
          <p className="section-desc">{t.sections.code.desc}</p>
          <CodePlayground lang={lang} />
        </div>
      </section>

      <section id="contact">
        <div className="container">
          <Contact lang={lang} />
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <span className="accent">$</span> echo "© 2026 Denis Sorokin · {t.footer}"
        </div>
      </footer>
    </>
  );
}
