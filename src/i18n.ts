import en from "./locales/en";
import es from "./locales/es";
import fr from "./locales/fr";
import pt from "./locales/pt";
import type { Language } from "./types";

type LocaleValue = string | { [key: string]: LocaleValue };
const locales: Record<Language, LocaleValue> = { en, pt, es, fr };

function lookup(locale: LocaleValue, key: string): string | undefined {
  let value: LocaleValue | undefined = locale;
  for (const part of key.split(".")) {
    if (!value || typeof value === "string") return undefined;
    value = value[part];
  }
  return typeof value === "string" ? value : undefined;
}

export type TranslationKey = string;
export type Translator = (key: TranslationKey) => string;

export function translate(language: Language, key: TranslationKey) {
  return lookup(locales[language], key) ?? lookup(en, key) ?? key;
}
