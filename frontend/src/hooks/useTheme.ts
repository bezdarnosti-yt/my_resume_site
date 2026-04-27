/* ============================================
   useTheme — persisted dark/light theme
   ============================================ */
import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const KEY = "resume-theme";

export function useTheme(): [Theme, (t: Theme) => void, () => void] {
  const [theme, setThemeRaw] = useState<Theme>(() => {
    const stored = localStorage.getItem(KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    localStorage.setItem(KEY, t);
    setThemeRaw(t);
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return [theme, setTheme, toggle];
}
