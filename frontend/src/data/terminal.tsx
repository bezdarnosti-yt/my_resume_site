/* ============================================
   Terminal command output blocks
   ============================================ */
import type { ReactNode } from "react";
import type { Lang } from "../hooks/useLang";

export type Block =
  | { type: "plain"; text: string }
  | { type: "muted"; text: string }
  | { type: "accent"; text: string }
  | { type: "warn"; text: string }
  | { type: "link"; text: string; href: string }
  | { type: "table"; rows: [string, string][] };

export interface TerminalLocale {
  welcome: Block[];
  commands: Record<string, Block[]>;
  notFound: (cmd: string) => Block[];
}

const RU: TerminalLocale = {
  welcome: [
    { type: "plain", text: "Last login: Mon Apr 27 11:24:08 on ttys001" },
    { type: "muted", text: "Введите 'help' для списка команд или 'about' чтобы начать." },
  ],
  commands: {
    help: [
      { type: "accent", text: "Доступные команды:" },
      {
        type: "table",
        rows: [
          ["about", "короткая справка обо мне"],
          ["skills", "технологический стек"],
          ["stack", "pip freeze резюме"],
          ["contact", "способы связи"],
          ["github", "открыть GitHub профиль"],
          ["theme", "переключить тему"],
          ["lang", "переключить язык"],
          ["clear", "очистить экран"],
        ],
      },
    ],
    about: [
      { type: "plain", text: "> Денис Сорокин · Python Backend Developer" },
      { type: "plain", text: "> 1+ лет опыта · Челябинск · UTC+5" },
      { type: "plain", text: "" },
      { type: "plain", text: "Проектирую API и микросервисы на FastAPI и Flask." },
      { type: "muted", text: "// набери `skills` чтобы увидеть стек" },
    ],
    skills: [
      { type: "accent", text: "# Backend" },
      { type: "plain", text: "  FastAPI · Flask · SQLAlchemy 2.0 · pydantic v2" },
      { type: "accent", text: "# Data" },
      { type: "plain", text: "  PostgreSQL · Redis · Kafka" },
      { type: "accent", text: "# Infra" },
      { type: "plain", text: "  Docker · Git · GitHub Actions · Linux" },
    ],
    stack: [
      { type: "plain", text: "$ pip freeze" },
      { type: "plain", text: "fastapi==0.115.0" },
      { type: "plain", text: "pydantic==2.9.2" },
      { type: "plain", text: "sqlalchemy==2.0.35" },
      { type: "plain", text: "redis==5.1.1" },
      { type: "plain", text: "aiokafka==0.12.0" },
    ],
    contact: [
      { type: "accent", text: "$ ./contact.sh" },
      { type: "link", text: "github.com/bezdarnosti-yt", href: "https://github.com/bezdarnosti-yt" },
      { type: "plain", text: "Telegram: @bezdarnosti8" },
      { type: "plain", text: "E-mail:   r403prod@gmail.com" },
    ],
    github: [
      { type: "accent", text: "Открываю GitHub в новой вкладке…" },
      { type: "link", text: "https://github.com/bezdarnosti-yt", href: "https://github.com/bezdarnosti-yt" },
    ],
  },
  notFound: (cmd) => [
    { type: "warn", text: `command not found: ${cmd}` },
    { type: "muted", text: "введите 'help' для списка команд" },
  ],
};

const EN: TerminalLocale = {
  welcome: [
    { type: "plain", text: "Last login: Mon Apr 27 11:24:08 on ttys001" },
    { type: "muted", text: "Type 'help' to list commands, or 'about' to get started." },
  ],
  commands: {
    help: [
      { type: "accent", text: "Available commands:" },
      {
        type: "table",
        rows: [
          ["about", "short bio"],
          ["skills", "tech stack"],
          ["stack", "pip freeze of my resume"],
          ["contact", "how to reach me"],
          ["github", "open GitHub profile"],
          ["theme", "toggle theme"],
          ["lang", "switch language"],
          ["clear", "clear the screen"],
        ],
      },
    ],
    about: [
      { type: "plain", text: "> Denis Sorokin · Python Backend Developer" },
      { type: "plain", text: "> 1+ years · Chelyabinsk · UTC+5" },
      { type: "plain", text: "" },
      { type: "plain", text: "I design APIs and microservices with FastAPI and Flask." },
      { type: "muted", text: "// type `skills` to see my stack" },
    ],
    skills: [
      { type: "accent", text: "# Backend" },
      { type: "plain", text: "  FastAPI · Flask · SQLAlchemy 2.0 · pydantic v2" },
      { type: "accent", text: "# Data" },
      { type: "plain", text: "  PostgreSQL · Redis · Kafka" },
      { type: "accent", text: "# Infra" },
      { type: "plain", text: "  Docker · Git · GitHub Actions · Linux" },
    ],
    stack: [
      { type: "plain", text: "$ pip freeze" },
      { type: "plain", text: "fastapi==0.115.0" },
      { type: "plain", text: "pydantic==2.9.2" },
      { type: "plain", text: "sqlalchemy==2.0.35" },
      { type: "plain", text: "redis==5.1.1" },
      { type: "plain", text: "aiokafka==0.12.0" },
    ],
    contact: [
      { type: "accent", text: "$ ./contact.sh" },
      { type: "link", text: "github.com/bezdarnosti-yt", href: "https://github.com/bezdarnosti-yt" },
      { type: "plain", text: "Telegram: @bezdarnosti8" },
      { type: "plain", text: "E-mail:   r403prod@gmail.com" },
    ],
    github: [
      { type: "accent", text: "Opening GitHub in a new tab…" },
      { type: "link", text: "https://github.com/bezdarnosti-yt", href: "https://github.com/bezdarnosti-yt" },
    ],
  },
  notFound: (cmd) => [
    { type: "warn", text: `command not found: ${cmd}` },
    { type: "muted", text: "type 'help' to list commands" },
  ],
};

export const TERMINAL: Record<Lang, TerminalLocale> = { ru: RU, en: EN };

export const TERMINAL_CMDS = [
  "about", "skills", "stack", "contact", "github",
  "theme", "lang", "help", "clear",
];

/* Render a list of blocks as React nodes. */
export function renderBlocks(blocks: Block[]): ReactNode[] {
  return blocks.map((b, i) => {
    switch (b.type) {
      case "plain":
        return <div key={i}>{b.text || "\u00A0"}</div>;
      case "muted":
        return <div key={i} className="muted">{b.text}</div>;
      case "accent":
        return <div key={i} className="accent">{b.text}</div>;
      case "warn":
        return <div key={i} className="warn">{b.text}</div>;
      case "link":
        return (
          <div key={i}>
            <a className="link" href={b.href} target="_blank" rel="noopener noreferrer">
              {b.text}
            </a>
          </div>
        );
      case "table":
        return (
          <table key={i}>
            <tbody>
              {b.rows.map(([k, v], j) => (
                <tr key={j}>
                  <td>{k}</td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  });
}
