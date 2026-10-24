import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppContext } from "./app-context";
import { Navbar } from "./components/navbar";
import { SubmitDialog } from "./components/submit-dialog";
import { translate, type TranslationKey } from "./i18n";
import type { Language, ThemeChoice } from "./types";

const supportedLanguages: Language[] = ["en", "pt", "es", "fr"];

function initialLanguage(): Language {
  const saved = localStorage.getItem("leonida-language");
  if (supportedLanguages.includes(saved as Language)) return saved as Language;

  for (const locale of navigator.languages?.length
    ? navigator.languages
    : [navigator.language]) {
    const language = locale.toLowerCase().split("-")[0] as Language;
    if (supportedLanguages.includes(language)) return language;
  }

  return "en";
}

export function App() {
  const [theme, setThemeState] = useState<ThemeChoice>(
    () => (localStorage.getItem("leonida-theme") as ThemeChoice) || "system",
  );
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [submitOpen, setSubmitOpen] = useState(false);
  const submitTrigger = useRef<HTMLElement | null>(null);

  const t = useCallback(
    (key: TranslationKey) => translate(language, key),
    [language],
  );
  const setTheme = useCallback((value: ThemeChoice) => {
    localStorage.setItem("leonida-theme", value);
    setThemeState(value);
  }, []);
  const setLanguage = useCallback((value: Language) => {
    localStorage.setItem("leonida-language", value);
    setLanguageState(value);
  }, []);
  const openSubmit = useCallback(() => {
    submitTrigger.current = document.activeElement as HTMLElement;
    setSubmitOpen(true);
  }, []);
  const closeSubmit = useCallback(() => {
    setSubmitOpen(false);
    requestAnimationFrame(() => submitTrigger.current?.focus());
  }, []);

  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved =
        theme === "system" ? (media.matches ? "dark" : "light") : theme;
      document.documentElement.dataset.theme = resolved;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", resolved === "dark" ? "#171522" : "#F5F1EA");
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const context = useMemo(
    () => ({ language, setLanguage, theme, setTheme, t }),
    [language, setLanguage, setTheme, t, theme],
  );

  return (
    <AppContext.Provider value={context}>
      <div className="flex h-dvh min-h-0 flex-col bg-(--bg)">
        <Navbar
          theme={theme}
          setTheme={setTheme}
          language={language}
          setLanguage={setLanguage}
          t={t}
          onSubmit={openSubmit}
        />
        <main className="relative min-h-0 flex-1">
          <Outlet />
        </main>
        <SubmitDialog open={submitOpen} onClose={closeSubmit} t={t} />
      </div>
    </AppContext.Provider>
  );
}
