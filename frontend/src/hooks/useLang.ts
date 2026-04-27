/* ============================================
   useLang — persisted RU/EN switch
   ============================================ */
import { useCallback, useEffect, useState } from "react";

export type Lang = "ru" | "en";

const KEY = "resume-lang";

export function useLang(): [Lang, (l: Lang) => void, () => void] {
  const [lang, setLangRaw] = useState<Lang>(() => {
    const stored = localStorage.getItem(KEY);
    if (stored === "ru" || stored === "en") return stored;
    return navigator.language?.startsWith("ru") ? "ru" : "en";
  });

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(KEY, l);
    setLangRaw(l);
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "ru" ? "en" : "ru");
  }, [lang, setLang]);

  return [lang, setLang, toggle];
}
