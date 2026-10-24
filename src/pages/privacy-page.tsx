import { useAppContext } from '../app-context'

export function PrivacyPage() {
  const { t } = useAppContext()
  return <main className="page-shell"><article className="page-post legal-post">
    <p className="eyebrow">LEONIDA MARKETING / {t('lastUpdated')}</p><h1 className="page-title">{t('privacyTitle')}</h1><p>{t('privacyIntro')}</p>
    <h2>{t('privacyCloudflareTitle')}</h2><p>{t('privacyCloudflareBody')}</p>
    <h2>{t('privacyRedditTitle')}</h2><p>{t('privacyRedditBody')} <a href="https://redditinc.com/policies/privacy-policy" target="_blank" rel="noreferrer">{t('redditPrivacy')}</a>.</p>
    <h2>{t('privacyTallyTitle')}</h2><p>{t('privacyTallyBody')} <a href="https://tally.so/help/privacy-policy" target="_blank" rel="noreferrer">{t('tallyPrivacy')}</a>.</p>
    <h2>{t('privacyStorageTitle')}</h2><p>{t('privacyStorageBody')}</p>
    <h2>{t('privacyRightsTitle')}</h2><p>{t('privacyRightsBody')} <a href="https://github.com/fredmorais/leonida-marketing/issues" target="_blank" rel="noreferrer">GitHub</a>.</p>
    <p className="legal-note">{t('privacyChanges')}</p>
  </article></main>
}
