import { useEffect, useState } from 'react'
import type { MarketingAction } from '../types'
import type { TranslationKey } from '../i18n'
import { Icon } from './icons'

export function MarketingDetails({ action, onClose, t }: { action: MarketingAction; onClose: () => void; t: (key: TranslationKey) => string }) {
  const [embedTheme, setEmbedTheme] = useState<'light' | 'dark'>(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

  useEffect(() => {
    const root = document.documentElement
    const syncTheme = () => setEmbedTheme(root.dataset.theme === 'dark' ? 'dark' : 'light')
    syncTheme()
    const observer = new MutationObserver(syncTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.querySelectorAll('script[data-reddit-embed-script]').forEach(script => script.remove())
    const script = document.createElement('script')
    script.src = 'https://embed.reddit.com/widgets.js'
    script.async = true
    script.dataset.redditEmbedScript = action.id
    script.charset = 'UTF-8'
    document.body.appendChild(script)
    return () => script.remove()
  }, [action.id, embedTheme])

  const title = t(`actions.${action.id}`)
  return <aside className="details" aria-label={title}>
    <div className="details-top">
      <button className="back-button mobile-only" onClick={onClose}><Icon name="back"/> {t('back')}</button>
      <button className="icon-button details-close desktop-only" onClick={onClose} aria-label={t('close')}><Icon name="close"/></button>
      <p className="eyebrow">{t(`cities.${action.city}`)}</p><h1>{title}</h1>
    </div>
    <div className="details-body">
      <div className="sources" key={`${action.id}-${embedTheme}`}>{action.sources.map((source, index) => {
        const community = source.url.match(/\/r\/([^/]+)/)?.[1] ?? 'reddit'
        return <blockquote className="reddit-embed-bq" data-embed-height="500" data-embed-theme={embedTheme} key={`${source.url}-${index}`}>
          <a href={source.url}>{title}</a><br/>
          in <a href={`https://www.reddit.com/r/${community}/`}>{community}</a>
        </blockquote>
      })}</div>
    </div>
  </aside>
}
