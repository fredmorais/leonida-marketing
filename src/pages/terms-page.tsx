import { useAppContext } from "../app-context";
import { PageLayout } from "../components/page-layout";

export function TermsPage() {
  const { t } = useAppContext();
  return (
    <PageLayout legal eyebrow={<>LEONIDA MARKETING / {t("lastUpdated")}</>} title={t("termsTitle")}>
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
        <p className="border-t border-(--border) pt-5.5 text-sm!">{t("termsChanges")}</p>
    </PageLayout>
  );
}
