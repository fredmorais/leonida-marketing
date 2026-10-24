import { useCallback, useEffect, useMemo } from 'react'
import { Navigate, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CityMap } from '../components/city-map'
import { MarketingDetails } from '../components/marketing-details'
import { useAppContext } from '../app-context'
import { marketingActions } from '../data/actions'
import { cityById, routeToCity } from '../data/cities'

export function MapPage() {
  const { actionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { language, t } = useAppContext()
  const selectedAction = actionId
    ? marketingActions.find(action => action.id === actionId)
    : undefined
  const cityId = selectedAction?.city ?? routeToCity(location.pathname)
  const city = cityById[cityId]
  const actions = useMemo(
    () => marketingActions.filter(action => action.city === cityId),
    [cityId],
  )

  const selectAction = useCallback(
    (id: string) => navigate(`/action/${encodeURIComponent(id)}`),
    [navigate],
  )

  const closeDetails = useCallback(() => {
    const pinId = selectedAction?.id
    navigate(city.route)
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(`[data-pin-id="${pinId}"]`)?.focus(),
    )
  }, [city.route, navigate, selectedAction?.id])

  useEffect(() => {
    if (!selectedAction) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDetails()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [closeDetails, selectedAction])

  if (actionId && !selectedAction) return <Navigate to="/" replace />

  return <div className="relative flex h-full min-h-0 min-w-0">
    <CityMap
      key={`${cityId}-${language}`}
      city={city}
      actions={actions}
      selectedId={selectedAction?.id ?? null}
      onSelect={selectAction}
      t={t}
    />
    {selectedAction && (
      <MarketingDetails action={selectedAction} onClose={closeDetails} t={t} />
    )}
    <Outlet />
  </div>
}
