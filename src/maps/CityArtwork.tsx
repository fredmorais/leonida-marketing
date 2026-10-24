import { memo } from 'react'
import type { CityId } from '../types'

const blocks = [
  [100,90,130,75],[270,85,170,80],[485,92,115,65],[645,80,180,85],[870,95,190,70],
  [80,225,180,90],[305,210,120,110],[470,220,180,80],[700,205,130,105],[875,220,210,85],
  [95,380,115,100],[255,365,190,80],[495,370,110,105],[660,360,180,110],[900,370,155,90],
  [80,535,175,95],[300,515,140,120],[490,540,180,80],[720,520,120,110],[890,530,195,90],
  [130,675,120,70],[300,660,190,75],[545,665,120,70],[735,675,170,65],[950,660,110,75],
]

const gridRoads = [150, 280, 460, 620, 850, 1040]

function BaseGrid() {
  return <>
    <g className="buildings">{blocks.map(([x,y,w,h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx="7" />)}</g>
    <g className="road-casings">
      {gridRoads.map((x, i) => <path key={`v${i}`} d={`M${x} -50 C${x+(i%2?70:-45)} 220 ${x-35} 510 ${x+20} 850`} />)}
      {[175,335,495,645].map((y, i) => <path key={`h${i}`} d={`M-50 ${y} C260 ${y+(i%2?35:-20)} 770 ${y-25} 1250 ${y+10}`} />)}
      <path className="arterial" d="M-30 730 C240 590 390 490 610 310 S970 80 1240 15" />
    </g>
    <g className="road-interiors">
      {gridRoads.map((x, i) => <path key={`v${i}`} d={`M${x} -50 C${x+(i%2?70:-45)} 220 ${x-35} 510 ${x+20} 850`} />)}
      {[175,335,495,645].map((y, i) => <path key={`h${i}`} d={`M-50 ${y} C260 ${y+(i%2?35:-20)} 770 ${y-25} 1250 ${y+10}`} />)}
      <path className="arterial" d="M-30 730 C240 590 390 490 610 310 S970 80 1240 15" />
    </g>
  </>
}

const cityDetails: Record<CityId, React.ReactNode> = {
  miami: <>
    <g className="water"><path d="M880 -20h340v840H1020c-75-105-45-202 20-275-90-98-89-197-20-292-86-92-88-182-140-273z"/><path d="M350 800c30-160 90-240 175-280 36 74 25 174-20 280z" /></g>
    <g className="parks"><path d="M125 245h150v95H125z"/><path d="M670 535q105-55 170 30l-25 95H675z"/></g>
    <g className="labels"><text x="455" y="245">WYNWOOD</text><text x="690" y="515">DOWNTOWN</text><text x="960" y="180">BISCAYNE BAY</text></g>
  </>,
  'new-york': <>
    <g className="water"><path d="M0 0h165l120 800H0zM1010 0h190v800H895q100-210 65-430t50-370z"/><path d="M600 0h75l-10 280-65 110-45-100z"/></g>
    <g className="parks"><rect x="430" y="80" width="165" height="205" rx="45"/><path d="M690 545l150-30 65 130-180 50z"/></g>
    <g className="labels"><text x="440" y="190">CENTRAL PARK</text><text x="410" y="430">MANHATTAN</text><text x="735" y="610">BROOKLYN</text></g>
  </>,
  chicago: <>
    <g className="water"><path d="M930 -20h290v840H1060q-105-180-35-350-85-260-95-490z"/><path d="M560 -20h65l-25 340 45 180-40 320h-48l25-315-50-185z"/></g>
    <g className="parks"><rect x="765" y="460" width="155" height="220" rx="18"/><rect x="115" y="105" width="150" height="105" rx="18"/></g>
    <g className="labels"><text x="610" y="390">THE LOOP</text><text x="740" y="170">NEAR NORTH</text><text x="1000" y="190">LAKE MICHIGAN</text></g>
  </>,
  'los-angeles': <>
    <g className="parks"><path d="M80 80h250v170H80z"/><path d="M825 500h260v170H825z"/></g>
    <g className="labels"><text x="570" y="350">HOLLYWOOD</text><text x="820" y="590">LOS ANGELES</text></g>
  </>,
  paris: <>
    <g className="water"><path d="M-20 475q250-120 450-5t390-5q190-115 400-15v85q-200-90-390 20t-420 0Q210 455-20 570z"/></g>
    <g className="parks"><path d="M190 90h210v120H180z"/><path d="M735 535h250v130H750z"/><circle cx="600" cy="295" r="65"/></g>
    <g className="labels"><text x="545" y="290">CENTRE</text><text x="415" y="520">LA SEINE</text><text x="890" y="390">BAGNOLET</text></g>
  </>,
}

export const CityArtwork = memo(function CityArtwork({ city }: { city: CityId }) {
  return <>
    <g className="land"><rect width="1200" height="800"/></g>
    <BaseGrid />
    {cityDetails[city]}
  </>
})
