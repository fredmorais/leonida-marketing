import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { CityMap } from './components/CityMap'
import { MarketingDetails } from './components/MarketingDetails'
import { SubmitDialog } from './components/SubmitDialog'
import { AboutPage } from './components/AboutPage'
import { PrivacyPage } from './components/PrivacyPage'
import { TermsPage } from './components/TermsPage'
import { cityById, routeToCity } from './data/cities'
import { marketingActions } from './data/actions'
import { translate, type TranslationKey } from './i18n'
import type { Language, ThemeChoice } from './types'

const supportedLanguages: Language[] = ['en', 'pt', 'es', 'fr']

function initialLanguage(): Language {
  const saved = localStorage.getItem('leonida-language')
  if (supportedLanguages.includes(saved as Language)) return saved as Language

  for (const locale of navigator.languages?.length ? navigator.languages : [navigator.language]) {
    const language = locale.toLowerCase().split('-')[0] as Language
    if (supportedLanguages.includes(language)) return language
  }

  return 'en'
}

export function App() {
  const location = useLocation(), navigate = useNavigate(), [theme, setThemeState] = useState<ThemeChoice>(() => (localStorage.getItem('leonida-theme') as ThemeChoice) || 'system')
  const [language, setLanguageState] = useState<Language>(initialLanguage)
  const [submitOpen, setSubmitOpen] = useState(false)
  const submitTrigger = useRef<HTMLElement | null>(null)
  const actionId = location.pathname.startsWith('/action/') ? decodeURIComponent(location.pathname.slice('/action/'.length)) : null
  const selectedAction = actionId ? marketingActions.find(action => action.id === actionId) : undefined
  const selected = selectedAction?.id ?? null
  const cityId = selectedAction?.city ?? routeToCity(location.pathname), city = cityById[cityId]
  const isMapRoute = Object.values(cityById).some(candidate => candidate.route === location.pathname) || Boolean(selectedAction)
  const actions = useMemo(() => marketingActions.filter(action => action.city === cityId), [cityId])
  const t = useCallback((key: TranslationKey) => translate(language, key), [language])
  const setTheme = (value: ThemeChoice) => { localStorage.setItem('leonida-theme', value); setThemeState(value) }
  const setLanguage = (value: Language) => { localStorage.setItem('leonida-language', value); setLanguageState(value) }
  const openSubmit = () => { submitTrigger.current = document.activeElement as HTMLElement; setSubmitOpen(true) }
  const closeSubmit = () => { setSubmitOpen(false); requestAnimationFrame(() => submitTrigger.current?.focus()) }
  const selectAction = useCallback((id: string) => navigate(`/action/${encodeURIComponent(id)}`), [navigate])
  const closeDetails = useCallback(() => {
    const pinId = selected
    navigate(city.route)
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-pin-id="${pinId}"]`)?.focus())
  }, [selected, city.route, navigate])
  useEffect(() => {
    if (!selected) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') closeDetails() }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [selected, closeDetails])
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)')
    const apply = () => { const resolved = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme; document.documentElement.dataset.theme = resolved; document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#171522' : '#F5F1EA') }
    apply(); media.addEventListener('change', apply); return () => media.removeEventListener('change', apply)
  }, [theme])
  useEffect(() => { document.documentElement.lang = language }, [language])

  const mapPage = <div className="relative flex h-full min-h-0 min-w-0"><CityMap key={`${cityId}-${language}`} city={city} actions={actions} selectedId={selected} onSelect={selectAction} t={t}/>{selectedAction && <MarketingDetails action={selectedAction} onClose={closeDetails} t={t}/>}</div>
  return <div className="flex h-dvh min-h-0 flex-col bg-[var(--bg)]"><Navbar theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} t={t} onSubmit={openSubmit}/>
    <div className="relative min-h-0 flex-1"><Routes><Route path="/about" element={<AboutPage t={t}/>}/><Route path="/privacy" element={<PrivacyPage t={t}/>}/><Route path="/terms" element={<TermsPage t={t}/>}/><Route path="*" element={isMapRoute ? mapPage : <Navigate to="/" replace/>}/></Routes></div>
    <SubmitDialog open={submitOpen} onClose={closeSubmit} t={t}/>
  </div>
}
