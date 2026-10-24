import { Menu, Plus, Settings2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logoDarkUrl from "../assets/logo-dark.png";
import logoUrl from "../assets/logo.png";
import type { TranslationKey } from "../i18n";
import type { Language, ThemeChoice } from "../types";

type Props = {
  theme: ThemeChoice;
  setTheme: (value: ThemeChoice) => void;
  language: Language;
  setLanguage: (value: Language) => void;
  t: (key: TranslationKey) => string;
  onSubmit: () => void;
};

const releaseDate = new Date(2026, 10, 19, 0, 0, 0);

function Countdown({ t }: { t: (key: TranslationKey) => string }) {
  const remaining = () => Math.max(0, releaseDate.getTime() - Date.now());
  const [milliseconds, setMilliseconds] = useState(remaining);
  useEffect(() => {
    const timer = window.setInterval(() => setMilliseconds(remaining()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const days = Math.floor(milliseconds / 86_400_000);
  const hours = Math.floor(milliseconds / 3_600_000) % 24;
  const minutes = Math.floor(milliseconds / 60_000) % 60;
  const seconds = Math.floor(milliseconds / 1000) % 60;
  const clock = `${days}d ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return (
    <div
      className="flex items-baseline gap-2 whitespace-nowrap rounded-[11px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--pink)_5%,var(--surface))] px-[11px] py-[7px]"
      aria-label={`${t("countdown")}: ${clock}`}
    >
      <strong className="font-display text-[13px] font-bold text-[var(--text)] tabular-nums max-[760px]:text-xs">
        {clock}
      </strong>
    </div>
  );
}

export function Navbar({
  theme,
  setTheme,
  language,
  setLanguage,
  t,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    setSettingsOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === "Escape")
        setSettingsOpen(false);
      if (
        event instanceof MouseEvent &&
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      )
        setSettingsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", handler);
    };
  }, [settingsOpen]);
  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>("a,button,select")?.focus();
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (event.key === "Tab" && menuRef.current) {
        const focusable = [
          ...menuRef.current.querySelectorAll<HTMLElement>("a,button,select"),
        ];
        const first = focusable[0],
          last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const themeChoices: ThemeChoice[] = ["system", "light", "dark"];
  const languageLabels: Record<Language, string> = {
    en: "English",
    pt: "Português",
    es: "Español (AI)",
    fr: "Français (AI)",
  };
  const navLink = (active: boolean) =>
    `rounded-[10px] px-3 py-2.5 text-sm font-semibold no-underline max-[760px]:p-3 ${active ? "bg-[color-mix(in_srgb,var(--text)_6%,transparent)] text-[var(--text)]" : "text-[var(--muted)] hover:bg-[color-mix(in_srgb,var(--text)_6%,transparent)] hover:text-[var(--text)]"}`;
  const iconButton =
    "grid size-[42px] shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]";
  const navLinks = (
    <>
      <NavLink to="/" className={({ isActive }) => navLink(isActive)}>
        {t("map")}
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => navLink(isActive)}>
        {t("about")}
      </NavLink>
    </>
  );
  const settings = (
    <>
      <div
        className="flex items-center gap-2 max-[760px]:justify-between max-[760px]:px-1.5 max-[760px]:py-1.25 max-[760px]:pl-3"
        role="group"
        aria-label={t("theme")}
      >
        <span className="text-[11px] font-bold tracking-[.07em] text-[var(--muted)] uppercase">
          {t("theme")}
        </span>
        <div className="flex rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--text)_3%,var(--surface))] p-[3px]">
          {themeChoices.map((value) => (
            <button
              key={value}
              type="button"
              className={`min-h-[30px] rounded-lg border-0 px-2.5 text-xs font-bold ${theme === value ? "bg-[var(--surface)] text-[var(--text)] shadow-[0_2px_8px_rgba(25,17,34,.12)]" : "bg-transparent text-[var(--muted)] hover:text-[var(--text)]"}`}
              aria-pressed={theme === value}
              onClick={() => setTheme(value)}
            >
              {t(value)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 max-[760px]:justify-between max-[760px]:px-1.5 max-[760px]:py-1.25 max-[760px]:pl-3">
        <span className="text-[11px] font-bold tracking-[.07em] text-[var(--muted)] uppercase">
          {t("language")}
        </span>
        <div>
          <select
            className="select-control min-w-[145px] text-[13px] font-bold"
            aria-label={t("language")}
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
          >
            {(Object.keys(languageLabels) as Language[]).map((value) => (
              <option key={value} value={value}>
                {languageLabels[value]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-4 border-t border-[var(--border)] pt-3">
        {[
          ["/privacy", t("privacy")],
          ["/terms", t("terms")],
        ].map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `text-xs font-bold no-underline ${isActive ? "text-[var(--pink)]" : "text-[var(--muted)] hover:text-[var(--pink)]"}`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </>
  );
  const submitButton = (
    <button
      className="grid size-[42px] shrink-0 place-items-center rounded-xl border-0 bg-gradient-to-br from-[var(--pink-bright)] to-[var(--purple)] p-0 font-bold text-white shadow-[0_6px_20px_rgba(233,24,158,.24)] hover:-translate-y-px hover:brightness-107 max-[760px]:mt-1 max-[760px]:size-12 max-[760px]:min-h-12 max-[760px]:self-end"
      aria-label={t("submit")}
      title={t("submit")}
      onClick={() => {
        setOpen(false);
        setSettingsOpen(false);
        onSubmit();
      }}
    >
      <Plus size={20} aria-hidden="true" />
    </button>
  );

  return (
    <header className="relative z-50 flex h-[72px] shrink-0 items-center border-b border-[var(--border)] bg-[var(--surface)] pr-[max(24px,env(safe-area-inset-right))] pl-[max(24px,env(safe-area-inset-left))] max-[760px]:h-16 max-[760px]:gap-2 max-[760px]:pr-[max(12px,env(safe-area-inset-right))] max-[760px]:pl-[max(12px,env(safe-area-inset-left))]">
      <Link
        to="/"
        className="inline-flex shrink-0 items-center"
        aria-label="Leonida Marketing home"
      >
        <img
          className="h-[46px] w-auto object-contain dark:hidden max-[760px]:h-9"
          src={logoUrl}
          alt="Leonida Marketing"
        />
        <img
          className="hidden h-[46px] w-auto object-contain dark:block max-[760px]:h-9"
          src={logoDarkUrl}
          alt=""
          aria-hidden="true"
        />
      </Link>
      <nav
        className="ml-[34px] flex w-full items-center gap-2.5 max-[760px]:hidden"
        aria-label="Main navigation"
      >
        {navLinks}
        <div className="mr-auto" />
        <Countdown t={t} />
        <div ref={settingsRef} className="relative">
          <button
            type="button"
            className={`${iconButton} ${settingsOpen ? "border-[color-mix(in_srgb,var(--pink)_35%,var(--border))] bg-[color-mix(in_srgb,var(--pink)_7%,var(--surface))] text-[var(--pink)]" : ""}`}
            aria-label={t("settings")}
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((value) => !value)}
          >
            <Settings2 size={20} aria-hidden="true" />
          </button>
          {settingsOpen && (
            <div className="absolute top-[calc(100%+10px)] right-0 z-60 grid w-[310px] gap-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
              {settings}
            </div>
          )}
        </div>
        {submitButton}
      </nav>
      <div className="ml-auto hidden max-[760px]:block">
        <Countdown t={t} />
      </div>
      <button
        ref={buttonRef}
        className={`${iconButton} hidden max-[760px]:grid`}
        aria-label={t("menu")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <X size={20} aria-hidden="true" />
        ) : (
          <Menu size={20} aria-hidden="true" />
        )}
      </button>
      {open && (
        <>
          <button
            className="fixed inset-x-0 top-16 bottom-0 hidden border-0 bg-[rgba(15,12,23,.45)] max-[760px]:block"
            aria-label={t("close")}
            onClick={() => {
              setOpen(false);
              buttonRef.current?.focus();
            }}
          />
          <div
            ref={menuRef}
            className="absolute top-[calc(100%+8px)] right-3 left-3 hidden flex-col gap-2 rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow)] max-[760px]:flex"
            aria-label="Mobile navigation"
          >
            {navLinks}
            {settings}
            {submitButton}
          </div>
        </>
      )}
    </header>
  );
}
