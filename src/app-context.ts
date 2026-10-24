import { createContext, useContext } from "react";
import type { TranslationKey } from "./i18n";
import type { Language, ThemeChoice } from "./types";

export type AppContextValue = {
  language: Language;
  setLanguage: (value: Language) => void;
  theme: ThemeChoice;
  setTheme: (value: ThemeChoice) => void;
  t: (key: TranslationKey) => string;
};

export const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used inside App");
  return context;
}
