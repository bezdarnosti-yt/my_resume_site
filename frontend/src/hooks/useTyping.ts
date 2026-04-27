/* ============================================
   useTyping — looping typewriter effect
   ============================================ */
import { useEffect, useState } from "react";

interface Options {
  typeMs?: number;
  holdMs?: number;
  eraseMs?: number;
}

export function useTyping(words: string[], opts: Options = {}): string {
  const { typeMs = 60, holdMs = 1800, eraseMs = 30 } = opts;
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "erasing">("typing");

  useEffect(() => {
    if (words.length === 0) return;
    const word = words[wordIdx % words.length];

    if (phase === "typing") {
      if (text.length < word.length) {
        const t = setTimeout(() => setText(word.slice(0, text.length + 1)), typeMs);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("erasing"), holdMs);
      return () => clearTimeout(t);
    }

    if (text.length > 0) {
      const t = setTimeout(() => setText(text.slice(0, -1)), eraseMs);
      return () => clearTimeout(t);
    }
    setWordIdx((w) => w + 1);
    setPhase("typing");
  }, [text, phase, wordIdx, words, typeMs, holdMs, eraseMs]);

  return text;
}
