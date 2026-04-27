/* ============================================
   Terminal — interactive shell component
   ============================================ */
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { TERMINAL, TERMINAL_CMDS, renderBlocks } from "../data/terminal";
import type { Lang } from "../hooks/useLang";
import type { Theme } from "../hooks/useTheme";

interface Props {
  lang: Lang;
  theme: Theme;
  onToggleTheme: () => void;
  onToggleLang: () => void;
}

interface Entry {
  kind: "input" | "output";
  value?: string;
  content?: ReactNode;
}

const SUGGESTIONS = ["about", "skills", "stack", "contact", "github", "help"];

export function Terminal({ lang, theme, onToggleTheme, onToggleLang }: Props) {
  const data = TERMINAL[lang];
  const [history, setHistory] = useState<Entry[]>(() => [
    { kind: "output", content: renderBlocks(data.welcome) },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // re-init on language change
  useEffect(() => {
    setHistory([{ kind: "output", content: renderBlocks(TERMINAL[lang].welcome) }]);
  }, [lang]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  const focus = () => inputRef.current?.focus();

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const next: Entry[] = [...history, { kind: "input", value: raw }];

    if (!cmd) {
      setHistory(next);
      return;
    }

    setCmdHistory((p) => [...p, raw]);
    setHIdx(-1);

    if (cmd === "clear" || cmd === "cls") {
      setHistory([]);
      return;
    }

    if (cmd === "theme") {
      onToggleTheme();
      next.push({
        kind: "output",
        content: <div className="accent">→ theme: {theme === "dark" ? "light" : "dark"}</div>,
      });
      setHistory(next);
      return;
    }

    if (cmd === "lang") {
      const newLang = lang === "ru" ? "en" : "ru";
      next.push({
        kind: "output",
        content: <div className="accent">→ language: {newLang.toUpperCase()}</div>,
      });
      setHistory(next);
      setTimeout(onToggleLang, 100);
      return;
    }

    if (cmd === "github") {
      window.open("https://github.com/bezdarnosti-yt", "_blank", "noopener");
    }

    const blocks = data.commands[cmd];
    next.push({
      kind: "output",
      content: blocks ? renderBlocks(blocks) : renderBlocks(data.notFound(cmd)),
    });
    setHistory(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const ni = hIdx < 0 ? cmdHistory.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(ni);
      setInput(cmdHistory[ni]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIdx < 0) return;
      const ni = hIdx + 1;
      if (ni >= cmdHistory.length) {
        setHIdx(-1);
        setInput("");
      } else {
        setHIdx(ni);
        setInput(cmdHistory[ni]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const matches = TERMINAL_CMDS.filter((c) => c.startsWith(input.toLowerCase()));
      if (matches.length === 1) setInput(matches[0]);
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <div className="terminal" onClick={focus}>
      <div className="terminal-head">
        <div className="traffic"><span /><span /><span /></div>
        <span className="title">denis@resume — zsh — 80×24</span>
      </div>
      <div className="terminal-body" ref={bodyRef}>
        {history.map((entry, i) =>
          entry.kind === "input" ? (
            <div key={i} className="terminal-line">
              <Prompt />
              <span style={{ color: "var(--fg-0)" }}>{entry.value}</span>
            </div>
          ) : (
            <div key={i} className="terminal-output">{entry.content}</div>
          )
        )}
        <div className="terminal-line">
          <Prompt />
          <input
            ref={inputRef}
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoFocus
            aria-label="terminal input"
          />
        </div>
        <div className="terminal-suggestions">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              className="suggestion-chip"
              onClick={(e) => {
                e.stopPropagation();
                runCommand(s);
                focus();
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Prompt() {
  return (
    <span className="terminal-prompt">
      <span className="user">denis</span>
      <span className="at">@</span>
      <span className="host">resume</span>
      <span className="sep">:</span>
      <span className="path">~</span>
      <span className="sep">$</span>
    </span>
  );
}
