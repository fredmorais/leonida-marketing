import type { TranslationKey } from '../i18n'
export function AboutPage({ t }: { t: (key: TranslationKey) => string }) {
  const translationNote = t('aboutTranslationNote')
  return <main className="page-shell">
    <article className="page-post">
      <p className="eyebrow">LEONIDA MARKETING / 2026</p>
      <h1 className="page-title">{t('aboutTitle')}</h1>
      <p>{t('aboutBody1')}</p>
      <p>{t('aboutBody2')}</p>
      <p>{t('aboutSourceBefore')} <a href="https://github.com/fredmorais/leonida-marketing" target="_blank" rel="noreferrer">GitHub</a>. {t('aboutSourceAfter')}</p>
      <p>{t('aboutAiBefore')} <a href="https://fredmorais.dev/blog/creating-leonida-marketing" target="_blank" rel="noreferrer">{t('aboutAiLink')}</a>.</p>
      {translationNote && <p className="translation-note">{translationNote}</p>}
      <p>{t('aboutDisclaimer')}</p>
    </article>
  </main>
}
