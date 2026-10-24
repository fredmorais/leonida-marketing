import { ChevronLeft, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { TranslationKey } from "../i18n";
import type { MarketingAction } from "../types";

export function MarketingDetails({
  action,
  onClose,
  t,
}: {
  action: MarketingAction;
  onClose: () => void;
  t: (key: TranslationKey) => string;
}) {
  const [embedTheme, setEmbedTheme] = useState<"light" | "dark">(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () =>
      setEmbedTheme(root.dataset.theme === "dark" ? "dark" : "light");
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document
      .querySelectorAll("script[data-reddit-embed-script]")
      .forEach((script) => script.remove());
    const script = document.createElement("script");
    script.src = "https://embed.reddit.com/widgets.js";
    script.async = true;
    script.dataset.redditEmbedScript = action.id;
    script.charset = "UTF-8";
    document.body.appendChild(script);
    return () => script.remove();
  }, [action.id, embedTheme]);

  const title = t(`actions.${action.id}`);
  return (
    <aside
      className="relative z-10 h-full w-[372px] shrink-0 overflow-y-auto border-l border-(--border) bg-(--surface) [scrollbar-width:thin] max-[760px]:absolute max-[760px]:inset-0 max-[760px]:w-full max-[760px]:border-0"
      aria-label={title}
    >
      <div className="relative bg-[linear-gradient(160deg,color-mix(in_srgb,var(--pink)_7%,var(--surface)),var(--surface)_72%)] px-[26px] pt-[30px] pb-3.5 max-[760px]:px-[22px] max-[760px]:pt-[15px] max-[760px]:pb-3">
        <button
          className="mb-[18px] -ml-2 hidden items-center gap-1.25 border-0 bg-transparent p-2 font-bold text-(--muted) max-[760px]:flex"
          onClick={onClose}
        >
          <ChevronLeft size={20} aria-hidden="true" /> {t("back")}
        </button>
        <button
          className="absolute top-[18px] right-[18px] grid size-[42px] place-items-center rounded-xl border border-(--border) bg-(--surface) text-(--text) max-[760px]:hidden"
          onClick={onClose}
          aria-label={t("close")}
        >
          <X size={20} aria-hidden="true" />
        </button>
        <p className="eyebrow">{t(`cities.${action.city}`)}</p>
        <h1 className="font-display mr-[50px] text-[30px] leading-[1.08] font-bold tracking-[-.045em] max-[760px]:mr-0 max-[760px]:text-[29px]">
          {title}
        </h1>
      </div>
      <div className="px-[26px] pt-2.5 pb-9 max-[760px]:px-[22px] max-[760px]:pt-2 max-[760px]:pb-[max(38px,env(safe-area-inset-bottom))]">
        <div
          className="grid min-w-0 gap-2.5 [&_iframe]:mx-auto! [&_iframe]:block [&_iframe]:max-w-full!"
          key={`${action.id}-${embedTheme}`}
        >
          {action.sources.map((source, index) => {
            const community = source.url.match(/\/r\/([^/]+)/)?.[1] ?? "reddit";
            return (
              <blockquote
                className="reddit-embed-bq m-0 border-0 bg-transparent py-3.5 text-[13px] leading-normal [&_a]:text-(--text)"
                data-embed-height="500"
                data-embed-theme={embedTheme}
                key={`${source.url}-${index}`}
              >
                <a href={source.url}>{title}</a>
                <br />
                in{" "}
                <a href={`https://www.reddit.com/r/${community}/`}>
                  {community}
                </a>
              </blockquote>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
