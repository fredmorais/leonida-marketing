import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { TranslationKey } from '../i18n'

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

  return <dialog ref={dialog} className="submit-dialog h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 text-(--text)" onClick={event => { if (event.target === dialog.current) onClose() }}>
    <div className="absolute top-1/2 left-1/2 max-h-[calc(100%-40px)] w-[min(680px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-(--border) bg-(--surface) p-10 shadow-(--shadow) max-[760px]:inset-0 max-[760px]:h-full max-[760px]:max-h-none max-[760px]:w-full max-[760px]:translate-0 max-[760px]:rounded-none max-[760px]:border-0 max-[760px]:px-5 max-[760px]:pt-7 max-[760px]:pb-[max(30px,env(safe-area-inset-bottom))]">
      <button className="absolute top-[22px] right-[22px] grid size-[42px] place-items-center rounded-xl border border-(--border) bg-(--surface) text-(--text)" onClick={onClose} aria-label={t('close')}><X size={20} aria-hidden="true"/></button>
      <p className="eyebrow">{t('submit')}</p>
      <h1 className="font-display mr-[50px] mb-[15px] text-[30px] leading-[1.08] font-bold tracking-[-.045em]">{t('submitTitle')}</h1>
      <p className="-mt-1 mr-[50px] mb-7 max-w-[460px] leading-[1.55] text-(--muted)">{t('submitHelp')}</p>
      <iframe
        className="block min-h-[220px] w-full border-0 bg-transparent"
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
