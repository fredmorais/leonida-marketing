import { useEffect, useState } from 'react'
import type { CityId } from '../types'
import { CityArtwork } from './CityArtwork'

const assetUrls: Partial<Record<CityId, string>> = {
  miami: new URL('../assets/maps/miami.svg', import.meta.url).href,
}

function innerSvg(source: string) {
  return source.replace(/^.*?<svg[^>]*>/s, '').replace(/<\/svg>\s*$/s, '')
}

export function MapAsset({ city, onStatus }: { city: CityId; onStatus?: (real: boolean) => void }) {
  const [markup, setMarkup] = useState<string | null>(null)
  const assetUrl = assetUrls[city]
  useEffect(() => {
    let current = true
    setMarkup(null)
    if (!assetUrl) { onStatus?.(false); return () => { current = false } }
    fetch(assetUrl).then(response => {
      if (!response.ok) throw new Error(`Map asset failed: ${response.status}`)
      return response.text()
    }).then(source => { if (current) { setMarkup(innerSvg(source)); onStatus?.(true) } }).catch(() => { if (current) onStatus?.(false) })
    return () => { current = false }
  }, [city, assetUrl, onStatus])
  if (!assetUrl || !markup) return <CityArtwork city={city} />
  return <g dangerouslySetInnerHTML={{ __html: markup }} />
}
