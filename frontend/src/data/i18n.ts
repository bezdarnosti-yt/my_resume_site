/* ============================================
   i18n strings — UI labels in RU/EN
   ============================================ */
import type { Lang } from "../hooks/useLang";

interface Strings {
  nav: { about: string; skills: string; api: string; code: string; contact: string };
  hero: {
    greeting: string;
    name: string;
    typedRoles: string[];
    bio: string;
    metaItems: { dot?: boolean; text: string }[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  sysInfo: {
    title: string;
    rows: [string, string][];
  };
  sections: {
    terminal: { label: string; title: string; desc: string };
    skills: { label: string; title: string; desc: string };
    api: { label: string; title: string; desc: string };
    code: { label: string; title: string; desc: string };
    contact: { label: string; title: string; desc: string };
  };
  contactCard: { title: string; desc: string };
  footer: string;
}

export const I18N: Record<Lang, Strings> = {
  ru: {
    nav: { about: "about", skills: "skills", api: "api", code: "code", contact: "contact" },
    hero: {
      greeting: "whoami",
      name: "Денис Сорокин",
      typedRoles: [
        "Python Backend Developer",
        "API & микросервисы",
        "FastAPI · Flask · SQLAlchemy",
        "Distributed systems",
      ],
      bio:
        "Проектирую и разрабатываю backend-сервисы на FastAPI и Flask. Работаю с PostgreSQL, Redis, Kafka, пишу типизированный код с pydantic.",
      metaItems: [
        { dot: true, text: "открыт к офферам" },
        { text: "Челябинск, RU · UTC+5" },
        { text: "Remote / Relocate" },
      ],
      ctaPrimary: "Связаться",
      ctaSecondary: "Скачать PDF",
    },
    sysInfo: {
      title: "~/system-info",
      rows: [
        ["os", "human@workstation"],
        ["shell", "/bin/python3.12"],
        ["runtime", "1 год в backend"],
        ["languages", "Python · SQL · TypeScript"],
        ["frameworks", "FastAPI · Flask · React"],
        ["databases", "PostgreSQL · Redis · Kafka"],
        ["tools", "Docker · Git · CI/CD"],
        ["status", '<span class="badge">● доступен</span>'],
      ],
    },
    sections: {
      terminal: { label: "interactive", title: "Терминал", desc: "Введите команду или нажмите подсказку." },
      skills: { label: "tech stack", title: "Скиллы и инструменты", desc: "Технологии, с которыми работаю каждый день." },
      api: { label: "live api", title: "API Explorer", desc: "Резюме как REST API — настоящий FastAPI на бэкенде." },
      code: { label: "real code", title: "Code playground", desc: "Реальные паттерны из моего кода." },
      contact: { label: "connect", title: "Свяжитесь", desc: "Открыт к интересным проектам и хорошим разговорам про Python." },
    },
    contactCard: {
      title: "$ ./connect.sh",
      desc: "Telegram или e-mail — самые быстрые способы связи. Обычно отвечаю в течение нескольких часов.",
    },
    footer: "React + FastAPI",
  },
  en: {
    nav: { about: "about", skills: "skills", api: "api", code: "code", contact: "contact" },
    hero: {
      greeting: "whoami",
      name: "Denis Sorokin",
      typedRoles: [
        "Python Backend Developer",
        "APIs & microservices",
        "FastAPI · Flask · SQLAlchemy",
        "Distributed systems",
      ],
      bio:
        "I design and build reliable backend services with FastAPI and Flask. I work with PostgreSQL, Redis, Kafka, write strongly-typed code with pydantic, and ship it in Docker.",
      metaItems: [
        { dot: true, text: "open to offers" },
        { text: "Chelyabinsk, RU · UTC+5" },
        { text: "Remote / Relocate" },
      ],
      ctaPrimary: "Get in touch",
      ctaSecondary: "Download PDF",
    },
    sysInfo: {
      title: "~/system-info",
      rows: [
        ["os", "human@workstation"],
        ["shell", "/bin/python3.12"],
        ["runtime", "1+ years backend"],
        ["languages", "Python · SQL · TypeScript"],
        ["frameworks", "FastAPI · Flask · React"],
        ["databases", "PostgreSQL · Redis · Kafka"],
        ["tools", "Docker · Git · CI/CD"],
        ["status", '<span class="badge">● available</span>'],
      ],
    },
    sections: {
      terminal: { label: "interactive", title: "Terminal", desc: "Type a command or click a suggestion." },
      skills: { label: "tech stack", title: "Skills & tools", desc: "Tech I work with daily." },
      api: { label: "live api", title: "API Explorer", desc: "My CV as a REST API — backed by a real FastAPI service." },
      code: { label: "real code", title: "Code playground", desc: "Real patterns from my codebase." },
      contact: { label: "connect", title: "Get in touch", desc: "Open to interesting projects and good Python conversations." },
    },
    contactCard: {
      title: "$ ./connect.sh",
      desc: "Telegram or e-mail are the fastest ways to reach me. I usually reply within a few hours.",
    },
    footer: "React + FastAPI",
  },
};
