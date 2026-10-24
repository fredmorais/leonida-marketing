import { NavLink, useNavigate } from 'react-router-dom'
import { cities } from '../data/cities'
import type { CityId } from '../types'
import type { TranslationKey } from '../i18n'

export function CitySelector({ activeCity, t }: { activeCity: CityId; t: (key: TranslationKey) => string }) {
  const navigate = useNavigate()
  return <div className="city-selector">
    <div className="city-pills" aria-label={t('selectCity')}>{cities.map(city => <NavLink key={city.id} to={city.route} className={city.id === activeCity ? 'active' : ''}>{t(`cities.${city.id}`)}</NavLink>)}</div>
    <label className="city-dropdown"><span className="sr-only">{t('selectCity')}</span><select value={activeCity} onChange={e => navigate(cities.find(city => city.id === e.target.value)!.route)}>{cities.map(city => <option key={city.id} value={city.id}>{t(`cities.${city.id}`)}</option>)}</select></label>
  </div>
}
