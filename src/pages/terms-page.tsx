import { useAppContext } from "../app-context";

export function TermsPage() {
  const { t } = useAppContext();
  return (
    <main className="page-shell">
      <article className="page-post legal-post">
        <p className="eyebrow">LEONIDA MARKETING / {t("lastUpdated")}</p>
        <h1 className="page-title">{t("termsTitle")}</h1>
        <p>{t("termsIntro")}</p>
        <h2>{t("termsAccuracyTitle")}</h2>
        <p>{t("termsAccuracyBody")}</p>
        <h2>{t("termsThirdPartyTitle")}</h2>
        <p>{t("termsThirdPartyBody")}</p>
        <h2>{t("termsSubmissionsTitle")}</h2>
        <p>{t("termsSubmissionsBody")}</p>
        <h2>{t("termsLicenseTitle")}</h2>
        <p>
          {t("termsLicenseBody")}{" "}
          <a
            href="https://github.com/fredmorais/leonida-marketing/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
          >
            AGPL-3.0
          </a>
          .
        </p>
        <h2>{t("termsDisclaimerTitle")}</h2>
        <p>{t("termsDisclaimerBody")}</p>
        <p className="legal-note">{t("termsChanges")}</p>
      </article>
    </main>
  );
}
