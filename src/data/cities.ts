import cityData from './cities.yaml'
import type { CityConfig, CityId } from '../types'

export const cities = cityData as CityConfig[]
export const cityById = Object.fromEntries(cities.map(city => [city.id, city])) as Record<CityId, CityConfig>
export const routeToCity = (path: string) => cities.find(city => city.route === path)?.id ?? 'miami'
