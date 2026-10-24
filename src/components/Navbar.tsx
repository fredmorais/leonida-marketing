import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import type { Language, ThemeChoice } from '../types'
import type { TranslationKey } from '../i18n'
import logoUrl from '../assets/logo.png'
import logoDarkUrl from '../assets/logo-dark.png'
import { Icon } from './icons'

type Props = { theme: ThemeChoice; setTheme: (value: ThemeChoice) => void; language: Language; setLanguage: (value: Language) => void; t: (key: TranslationKey) => string; onSubmit: () => void }

const releaseDate = new Date(2026, 10, 19, 0, 0, 0)

function Countdown({ t }: { t: (key: TranslationKey) => string }) {
  const remaining = () => Math.max(0, releaseDate.getTime() - Date.now())
  const [milliseconds, setMilliseconds] = useState(remaining)
  useEffect(() => {
    const timer = window.setInterval(() => setMilliseconds(remaining()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const days = Math.floor(milliseconds / 86_400_000)
  const hours = Math.floor(milliseconds / 3_600_000) % 24
  const minutes = Math.floor(milliseconds / 60_000) % 60
  const seconds = Math.floor(milliseconds / 1000) % 60
  const clock = `${days}d ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  return <div className="release-countdown" aria-label={`${t('countdown')}: ${clock}`}><strong>{clock}</strong></div>
}

export function Navbar({ theme, setTheme, language, setLanguage, t, onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  useEffect(() => { setOpen(false); setSettingsOpen(false) }, [location.pathname])
  useEffect(() => {
    if (!settingsOpen) return
    const handler = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === 'Escape') setSettingsOpen(false)
      if (event instanceof MouseEvent && settingsRef.current && !settingsRef.current.contains(event.target as Node)) setSettingsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', handler)
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('keydown', handler) }
  }, [settingsOpen])
  useEffect(() => {
    if (!open) return
    menuRef.current?.querySelector<HTMLElement>('a,button,select')?.focus()
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); buttonRef.current?.focus() }
      if (event.key === 'Tab' && menuRef.current) {
        const focusable = [...menuRef.current.querySelectorAll<HTMLElement>('a,button,select')]
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const themeChoices: ThemeChoice[] = ['system', 'light', 'dark']
  const languageLabels: Record<Language, string> = {
    en: 'English',
    pt: 'Português',
    es: 'Español (AI)',
    fr: 'Français (AI)',
  }
  const navLinks = <>
    <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{t('map')}</NavLink>
    <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{t('about')}</NavLink>
  </>
  const settings = <>
    <div className="nav-choice" role="group" aria-label={t('theme')}>
      <span className="choice-label">{t('theme')}</span>
      <div className="choice-options">{themeChoices.map(value => <button key={value} type="button" className={theme === value ? 'active' : ''} aria-pressed={theme === value} onClick={() => setTheme(value)}>{t(value)}</button>)}</div>
    </div>
    <div className="nav-choice">
      <span className="choice-label">{t('language')}</span>
      <div className="select-wrap language-select"><select aria-label={t('language')} value={language} onChange={event => setLanguage(event.target.value as Language)}>{(Object.keys(languageLabels) as Language[]).map(value => <option key={value} value={value}>{languageLabels[value]}</option>)}</select></div>
    </div>
  </>
  const submitButton = <button className="submit-button icon-submit-button" aria-label={t('submit')} title={t('submit')} onClick={() => { setOpen(false); setSettingsOpen(false); onSubmit() }}><Icon name="plus" /></button>

  return <header className="navbar">
    <Link to="/" className="logo" aria-label="Leonida Marketing home"><img className="logo-light" src={logoUrl} alt="Leonida Marketing" /><img className="logo-dark" src={logoDarkUrl} alt="" aria-hidden="true" /></Link>
    <nav className="desktop-nav" aria-label="Main navigation">{navLinks}<Countdown t={t}/><div ref={settingsRef} className="desktop-settings"><button type="button" className="icon-button settings-button" aria-label={t('settings')} aria-expanded={settingsOpen} onClick={() => setSettingsOpen(value => !value)}><Icon name="settings" /></button>{settingsOpen && <div className="settings-popover">{settings}</div>}</div>{submitButton}</nav>
    <div className="mobile-countdown"><Countdown t={t}/></div>
    <button ref={buttonRef} className="icon-button menu-button" aria-label={t('menu')} aria-expanded={open} onClick={() => setOpen(v => !v)}><Icon name={open ? 'close' : 'menu'} /></button>
    {open && <><button className="menu-backdrop" aria-label={t('close')} onClick={() => { setOpen(false); buttonRef.current?.focus() }} /><div ref={menuRef} className="mobile-menu" aria-label="Mobile navigation">{navLinks}{settings}{submitButton}</div></>}
  </header>
}
