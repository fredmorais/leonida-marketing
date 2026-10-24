import { useAppContext } from "../app-context";
import { PageLayout } from "../components/page-layout";

export function AboutPage() {
  const { t } = useAppContext();
  const translationNote = t("aboutTranslationNote");
  return (
    <PageLayout eyebrow="LEONIDA MARKETING / 2026" title={t("aboutTitle")}>
        <p>{t("aboutBody1")}</p>
        <p>{t("aboutBody2")}</p>
        <p>
          {t("aboutSourceBefore")}{" "}
          <a
            href="https://github.com/fredmorais/leonida-marketing"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          . {t("aboutSourceAfter")}
        </p>
        <p>
          {t("aboutAiBefore")}{" "}
          <a
            href="https://fredmorais.dev/blog/creating-leonida-marketing"
            target="_blank"
            rel="noreferrer"
          >
            {t("aboutAiLink")}
          </a>
          .
        </p>
        {translationNote && (
          <p className="rounded-r-[10px] border-l-3 border-(--purple) bg-[color-mix(in_srgb,var(--purple)_7%,transparent)] px-3.75 py-3.25 text-sm!">{translationNote}</p>
        )}
        <p>{t("aboutDisclaimer")}</p>
    </PageLayout>
  );
}
