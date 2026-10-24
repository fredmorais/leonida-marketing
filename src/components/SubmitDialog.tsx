import { useEffect, useRef } from 'react'
import type { TranslationKey } from '../i18n'
import { Icon } from './icons'

declare global {
  interface Window { Tally?: { loadEmbeds: () => void } }
}

const tallyEmbedUrl = 'https://tally.so/embed/yXPaKx?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1'

export function SubmitDialog({ open, onClose, t }: { open: boolean; onClose: () => void; t: (key: TranslationKey) => string }) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => { if (open) dialog.current?.showModal(); else dialog.current?.close() }, [open])
  useEffect(() => {
    const element = dialog.current
    const cancel = (event: Event) => { event.preventDefault(); onClose() }
    element?.addEventListener('cancel', cancel)
    return () => element?.removeEventListener('cancel', cancel)
  }, [onClose])
  useEffect(() => {
    if (!open) return
    if (window.Tally) { window.Tally.loadEmbeds(); return }
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://tally.so/widgets/embed.js"]')
    if (existing) { existing.addEventListener('load', () => window.Tally?.loadEmbeds(), { once: true }); return }
    const script = document.createElement('script')
    script.src = 'https://tally.so/widgets/embed.js'
    script.async = true
    script.onload = () => window.Tally?.loadEmbeds()
    document.body.appendChild(script)
  }, [open])

  return <dialog ref={dialog} className="submit-dialog" onClick={event => { if (event.target === dialog.current) onClose() }}>
    <div className="dialog-panel tally-dialog-panel">
      <button className="icon-button dialog-close" onClick={onClose} aria-label={t('close')}><Icon name="close"/></button>
      <p className="eyebrow">{t('submit')}</p>
      <h1>{t('submitTitle')}</h1>
      <p className="dialog-help">{t('submitHelp')}</p>
      <iframe
        className="tally-embed"
        data-tally-src={tallyEmbedUrl}
        loading="lazy"
        width="100%"
        height="220"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title={t('submitTitle')}
      />
    </div>
  </dialog>
}
