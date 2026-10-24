export type CityId = 'miami' | 'new-york' | 'chicago' | 'los-angeles' | 'paris'
export type ThemeChoice = 'system' | 'light' | 'dark'
export type Language = 'en' | 'pt' | 'es' | 'fr'
export type Source = {
  platform: 'reddit' | 'instagram' | 'tiktok'; url: string
}
export type MarketingAction = {
  id: string; city: CityId; title?: string
  latitude: number; longitude: number
  sources: Source[]; icon: string; zoom?: number
}
export type CityConfig = {
  id: CityId; name?: string; route: string
  bounds: [number, number, number, number]
  center: [number, number]
  defaultZoom: number; minZoom: number; maxZoom: number
}
