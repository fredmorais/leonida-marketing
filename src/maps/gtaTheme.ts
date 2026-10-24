import type { Map as MapLibreMap } from 'maplibre-gl'

export type MapTheme = 'light' | 'dark'

export const openFreeMapStyle = (theme: MapTheme) =>
  `https://tiles.openfreemap.org/styles/${theme === 'dark' ? 'dark' : 'positron'}`

const palettes = {
  light: {
    background: '#f6efe7', land: '#f2e9df', residential: '#eee2da',
    water: '#9edce0', waterLine: '#72c8cf', park: '#bfd9b5', wood: '#b2cfab',
    building: '#d9ccc5', minorRoad: '#fbf6f0', majorRoad: '#fffaf5',
    roadCase: '#d5c6c1', motorway: '#e766a8', motorwayCase: '#c8498c',
    rail: '#9b85b1', boundary: '#ae91bd', label: '#665e6c',
    secondaryLabel: '#817886', halo: '#fffaf4',
  },
  dark: {
    background: '#171522', land: '#1c1927', residential: '#211d2c',
    water: '#153541', waterLine: '#255565', park: '#26392f', wood: '#2b4034',
    building: '#302b3a', minorRoad: '#393442', majorRoad: '#4b4454',
    roadCase: '#12101a', motorway: '#b94582', motorwayCase: '#6c2854',
    rail: '#745c8e', boundary: '#654b7b', label: '#c6becb',
    secondaryLabel: '#938b9a', halo: '#171522',
  },
} as const

export function applyGtaTheme(map: MapLibreMap, theme: MapTheme) {
  const color = palettes[theme]
  const setPaint = (id: string, property: string, value: unknown) => {
    try { map.setPaintProperty(id, property as never, value as never) } catch { /* unsupported on this layer */ }
  }
  const setLayout = (id: string, property: string, value: unknown) => {
    try { map.setLayoutProperty(id, property as never, value as never) } catch { /* unsupported on this layer */ }
  }

  for (const layer of map.getStyle().layers ?? []) {
    const id = layer.id.toLowerCase()

    if (layer.type === 'background') setPaint(layer.id, 'background-color', color.background)

    if (layer.type === 'fill' || layer.type === 'fill-extrusion') {
      const fill = /water|ocean|river|lake/.test(id) ? color.water
        : /wood|forest/.test(id) ? color.wood
          : /park|grass|garden|pitch|cemetery/.test(id) ? color.park
            : /residential/.test(id) ? color.residential
              : /building/.test(id) ? color.building : color.land
      setPaint(layer.id, layer.type === 'fill' ? 'fill-color' : 'fill-extrusion-color', fill)
      if (layer.type === 'fill') {
        setPaint(layer.id, 'fill-opacity', /building/.test(id) ? 0.68 : /residential/.test(id) ? 0.5 : 1)
        setPaint(layer.id, 'fill-outline-color', fill)
      }
    }

    if (layer.type === 'line') {
      if (/highway_path|road_pier/.test(id)) {
        setLayout(layer.id, 'visibility', 'none')
        continue
      }
      if (/waterway/.test(id)) {
        setPaint(layer.id, 'line-color', color.waterLine)
        setPaint(layer.id, 'line-opacity', 0.7)
      } else if (/motorway/.test(id)) {
        setPaint(layer.id, 'line-color', /casing/.test(id) ? color.motorwayCase : color.motorway)
        setPaint(layer.id, 'line-opacity', theme === 'dark' ? 0.82 : 0.72)
      } else if (/highway_major/.test(id)) {
        setPaint(layer.id, 'line-color', /casing/.test(id) ? color.roadCase : color.majorRoad)
        setPaint(layer.id, 'line-opacity', ['interpolate', ['linear'], ['zoom'], 10, 0.35, 13, 0.72, 16, 0.9])
      } else if (/highway_minor/.test(id)) {
        setPaint(layer.id, 'line-color', color.minorRoad)
        setPaint(layer.id, 'line-opacity', ['interpolate', ['linear'], ['zoom'], 11, 0.06, 13, 0.22, 15, 0.5, 17, 0.68])
      } else if (/railway|transit/.test(id)) {
        setPaint(layer.id, 'line-color', color.rail)
        setPaint(layer.id, 'line-opacity', /dashline/.test(id) ? 0.32 : 0.5)
      } else {
        setPaint(layer.id, 'line-color', color.boundary)
        setPaint(layer.id, 'line-opacity', /boundary_3|disputed/.test(id) ? 0.22 : 0.4)
      }
    }

    if (layer.type === 'symbol') {
      if (/highway-name-path|highway-name-minor/.test(id)) {
        setLayout(layer.id, 'visibility', 'none')
        continue
      }
      const secondary = /water|airport|village|other|shield|road_shield/.test(id)
      setPaint(layer.id, 'text-color', secondary ? color.secondaryLabel : color.label)
      setPaint(layer.id, 'text-halo-color', color.halo)
      setPaint(layer.id, 'text-halo-width', theme === 'dark' ? 1.1 : 1.4)
      setPaint(layer.id, 'text-halo-blur', 0.3)
      setPaint(layer.id, 'text-opacity', secondary ? 0.72 : 0.92)
      if (/highway-name-major/.test(id)) setPaint(layer.id, 'text-opacity', ['interpolate', ['linear'], ['zoom'], 12, 0.35, 14, 0.75])
    }
  }
}
