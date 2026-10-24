import { Map as MapLibreMap, Marker, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { TranslationKey } from "../i18n";
import {
  applyGtaTheme,
  openFreeMapStyle,
  type MapTheme,
} from "../maps/gtaTheme";
import type { CityConfig, MarketingAction } from "../types";
import { CitySelector } from "./CitySelector";
import { Icon } from "./icons";

type Props = {
  city: CityConfig;
  actions: MarketingAction[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  t: (key: TranslationKey) => string;
};

const actionImageModules = import.meta.glob<string>(
  "../assets/actions/**/*.{png,jpg,jpeg,webp,svg}",
  { eager: true, query: "?url", import: "default" },
);

const ACTION_IMAGE_MARKERS = Object.fromEntries(
  Object.entries(actionImageModules).map(([path, url]) => [
    path.replace("../assets/actions/", ""),
    url,
  ]),
) as Record<string, string>;

setWorkerUrl(workerUrl);

function MarketingIcon({
  icon = "billboard",
}: {
  icon?: MarketingAction["icon"];
}) {
  const glyphs = {
    banner: (
      <g className="action-svg banner-svg">
        <path className="arena" d="M-18 2-13-12H13L18 2v10h-36Z" />
        <path className="screen" d="M-13-8H13V4h-26Z" />
        <path className="banner" d="M-10-5H10V1h-20Z" />
        <text x="0" y="-.8">
          VICE
        </text>
        <path className="roof" d="M-15-12h30M-8 8h16" />
      </g>
    ),
    blimp: (
      <g className="action-svg blimp-svg">
        <path className="tail" d="m11-7 6-7 3 2-2 10 4 2-4 2 2 10-3 2-6-7" />
        <path
          className="body"
          d="M-20 0c3-10 18-14 32-9 5 2 8 5 8 9s-3 7-8 9C-2 14-17 10-20 0Z"
        />
        <path className="stripe" d="M-16-5C-7-1 3-1 15-6M-17 1C-7 5 4 5 16 0" />
        <path className="gondola" d="M-4 10H7l-2 5H-2Z" />
        <text x="-4" y="2">
          VICE
        </text>
      </g>
    ),
    billboard: (
      <g className="action-svg billboard-svg">
        <path className="legs" d="M-11 8v8M11 8v8" />
        <rect className="board" x="-18" y="-13" width="36" height="23" rx="3" />
        <circle className="sun" cx="9" cy="-5" r="5" />
        <path className="waves" d="M-14 3c5-5 9 4 14-1s9 3 14-2" />
        <text x="-6" y="-5">
          AD
        </text>
      </g>
    ),
    boat: (
      <g className="action-svg boat-svg">
        <path className="wake" d="M-19 14c6-3 12 3 18 0s12 3 18 0" />
        <path className="hull" d="M-18 4H19l-7 9H-10Z" />
        <path className="deck" d="M-9-3H9l5 7H-12Z" />
        <rect className="ad" x="-7" y="-11" width="15" height="8" rx="1" />
        <text x=".5" y="-5.5">
          V
        </text>
      </g>
    ),
    van: (
      <g className="action-svg van-svg">
        <path className="body" d="M-19-9H5l13 11v10h-37Z" />
        <path className="window" d="M5-6 14 2H5Z" />
        <rect className="news" x="-15" y="-5" width="16" height="10" rx="1" />
        <text x="-7" y="2">
          W
        </text>
        <circle className="wheel" cx="-11" cy="12" r="5" />
        <circle className="wheel" cx="11" cy="12" r="5" />
      </g>
    ),
    "golf-cart": (
      <g className="action-svg cart-svg">
        <path className="roof" d="M-17-13H13l3 4h-36Z" />
        <path className="frame" d="M-14-9v16M10-9l5 16" />
        <path className="body" d="M-20 2H14l6 10h-40Z" />
        <path className="seat" d="M-9-4H5V2H-9Z" />
        <circle className="wheel" cx="-12" cy="12" r="5" />
        <circle className="wheel" cx="12" cy="12" r="5" />
      </g>
    ),
    train: (
      <g className="action-svg train-svg">
        <rect className="train" x="-14" y="-17" width="28" height="31" rx="7" />
        <path className="windshield" d="M-9-11H9v10H-9Z" />
        <path className="stripe" d="M-14 3h28" />
        <circle className="lamp" cx="-7" cy="8" r="2" />
        <circle className="lamp" cx="7" cy="8" r="2" />
        <path className="rails" d="m-9 18 5-5M9 18l-5-5" />
      </g>
    ),
    beach: (
      <g className="action-svg beach-svg">
        <path className="sand" d="M-20 12c8-5 13 4 21 0s13 4 20 0v6h-41Z" />
        <path className="umbrella" d="M-18-2Q0-19 18-2 9-7 0-2q-9-5-18 0Z" />
        <path className="pole" d="M0-2v15" />
        <path className="chair" d="M5 2h10l-3 12H3m2-7h9" />
      </g>
    ),
    plane: (
      <g className="action-svg plane-svg">
        <path className="banner-line" d="M13-6h7" />
        <rect
          className="air-banner"
          x="19"
          y="-12"
          width="20"
          height="12"
          rx="2"
        />
        <text x="29" y="-4">
          919
        </text>
        <path
          className="plane"
          d="m-18 3 12-5 3-13 5 1 2 10 10-2 4 3-13 7-2 10-4 2-3-9-12 3Z"
        />
      </g>
    ),
    car: (
      <g className="action-svg car-svg">
        <path className="body" d="m-20 2 7-12H10l10 12v11h-40Z" />
        <path className="glass" d="m-9-7-5 9H13L8-7Z" />
        <path className="stripe" d="M-19 6h38" />
        <rect
          className="lightbar"
          x="-6"
          y="-14"
          width="12"
          height="4"
          rx="1"
        />
        <circle className="wheel" cx="-12" cy="13" r="5" />
        <circle className="wheel" cx="12" cy="13" r="5" />
      </g>
    ),
    mural: (
      <g className="action-svg mural-svg">
        <rect className="wall" x="-19" y="-15" width="38" height="30" rx="3" />
        <circle className="sun" cx="9" cy="-6" r="7" />
        <path className="paint-one" d="m-17 10 9-15 7 9L5-8l11 18Z" />
        <path className="paint-two" d="M-17-10c7 0 6 8 13 7s8-9 17-8" />
        <path className="brick" d="M-19 7h38M-9 7v8M8 7v8" />
      </g>
    ),
  };
  const glyph = glyphs[icon as keyof typeof glyphs] ?? glyphs.billboard;
  return <g className="marketing-icon">{glyph}</g>;
}

export function CityMap({ city, actions, selectedId, onSelect, t }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerElements = useRef(new Map<string, HTMLButtonElement>());
  const markerRoots = useRef<Root[]>([]);
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;
  const [mapTheme, setMapTheme] = useState<MapTheme>(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const themeRef = useRef(mapTheme);
  const loadedThemeRef = useRef(mapTheme);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () =>
      setMapTheme(root.dataset.theme === "dark" ? "dark" : "light");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const [west, south, east, north] = city.bounds;
    themeRef.current = mapTheme;
    loadedThemeRef.current = mapTheme;
    const map = new MapLibreMap({
      container,
      style: openFreeMapStyle(mapTheme),
      center: city.center,
      zoom: city.defaultZoom,
      minZoom: city.minZoom,
      maxZoom: city.maxZoom,
      maxBounds: [
        [west, south],
        [east, north],
      ],
      attributionControl: false,
      // Keep parent tiles visible while the sharper zoom-level tiles arrive.
      // This avoids the visible hard refresh during action camera animations.
      fadeDuration: 400,
      renderWorldCopies: false,
      dragRotate: false,
      pitchWithRotate: false,
    });
    map.touchZoomRotate.disableRotation();
    map.on("style.load", () => applyGtaTheme(map, themeRef.current));
    mapRef.current = map;

    for (const action of actions) {
      const imageMarker = ACTION_IMAGE_MARKERS[action.icon];
      const element = document.createElement("button");
      element.type = "button";
      element.className = `map-pin map-action-marker${imageMarker ? " image-action-marker" : ""}${selectedId === action.id ? " selected" : ""}`;
      element.dataset.pinId = action.id;
      element.style.setProperty("--icon-scale", String(action.zoom ?? 1));
      element.setAttribute("aria-label", t(`actions.${action.id}`));
      element.addEventListener("click", () => onSelect(action.id));
      const root = createRoot(element);
      root.render(
        imageMarker ? (
          <img src={imageMarker} alt="" aria-hidden="true" />
        ) : (
          <svg viewBox="-29 -28 74 56" aria-hidden="true">
            <circle className="pin-halo" r="27" />
            <MarketingIcon icon={action.icon} />
          </svg>
        ),
      );
      markerRoots.current.push(root);
      markerElements.current.set(action.id, element);
      new Marker({ element, anchor: "center" })
        .setLngLat([action.longitude, action.latitude])
        .addTo(map);
    }

    let collisionFrame = 0;
    const arrangeMarkers = () => {
      cancelAnimationFrame(collisionFrame);
      collisionFrame = requestAnimationFrame(() => {
        const placed: Array<{ x: number; y: number; width: number; height: number }> = [];
        const orderedActions = [...actions].sort((a, b) =>
          a.id === selectedIdRef.current ? -1 : b.id === selectedIdRef.current ? 1 : 0,
        );
        const candidates: Array<[number, number]> = [[0, 0]];
        for (let ring = 1; ring <= 4; ring += 1) {
          for (let step = 0; step < 8; step += 1) {
            const angle = (step * Math.PI) / 4;
            candidates.push([
              Math.cos(angle) * ring * 56,
              Math.sin(angle) * ring * 56,
            ]);
          }
        }

        for (const action of orderedActions) {
          const element = markerElements.current.get(action.id);
          if (!element) continue;
          const point = map.project([action.longitude, action.latitude]);
          const scale = action.zoom ?? 1;
          // Most source PNGs contain generous transparent padding. Use the
          // visible artwork footprint so clustered icons stay near the pin.
          const width = 82 * scale * 0.5 + 6;
          const height = 98 * scale * 0.5 + 6;
          const [offsetX, offsetY] = candidates.find(([dx, dy]) => {
            const candidate = { x: point.x + dx, y: point.y + dy, width, height };
            return placed.every(existing =>
              Math.abs(candidate.x - existing.x) >= (candidate.width + existing.width) / 2 ||
              Math.abs(candidate.y - existing.y) >= (candidate.height + existing.height) / 2,
            );
          }) ?? candidates[candidates.length - 1];

          element.style.setProperty("--collision-x", `${offsetX}px`);
          element.style.setProperty("--collision-y", `${offsetY}px`);
          placed.push({ x: point.x + offsetX, y: point.y + offsetY, width, height });
        }
      });
    };

    map.on("move", arrangeMarkers);
    map.on("resize", arrangeMarkers);
    arrangeMarkers();

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
      arrangeMarkers();
    });
    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(collisionFrame);
      map.off("move", arrangeMarkers);
      map.off("resize", arrangeMarkers);
      markerElements.current.clear();
      for (const root of markerRoots.current) root.unmount();
      markerRoots.current = [];
      mapRef.current = null;
      map.remove();
    };
  }, [actions, city, onSelect]);

  useEffect(() => {
    themeRef.current = mapTheme;
    const map = mapRef.current;
    if (!map || loadedThemeRef.current === mapTheme) return;
    loadedThemeRef.current = mapTheme;
    map.setStyle(openFreeMapStyle(mapTheme));
  }, [mapTheme]);

  useEffect(() => {
    for (const element of markerElements.current.values())
      element.classList.toggle(
        "selected",
        element.dataset.pinId === selectedId,
      );
    const action = actions.find((item) => item.id === selectedId);
    const map = mapRef.current;
    if (action && map) {
      const currentZoom = map.getZoom();
      // Stay within the current integer zoom band. Crossing that boundary
      // makes MapLibre replace every visible tile with the next tile level.
      const actionZoom = Math.min(
        city.maxZoom,
        currentZoom + 0.45,
        Math.floor(currentZoom) + 0.95,
      );
      map.stop();
      map.easeTo({
        center: [action.longitude, action.latitude],
        // Keep the pin centered in the visible part of the map when the
        // desktop details panel covers its right-hand side.
        offset: window.matchMedia("(min-width: 761px)").matches
          ? [-186, 0]
          : [0, 0],
        zoom: actionZoom,
        duration: 750,
        easing: (progress) => 1 - Math.pow(1 - progress, 3),
        essential: true,
      });
    }
  }, [actions, city.maxZoom, selectedId]);

  const resetMap = () =>
    mapRef.current?.easeTo({
      center: city.center,
      zoom: city.defaultZoom,
      bearing: 0,
      pitch: 0,
      duration: 450,
    });

  return (
    <section className="map-stage" aria-label={`${t(`cities.${city.id}`)} marketing map`}>
      <CitySelector activeCity={city.id} t={t} />
      <div ref={containerRef} className="city-map" />
      {!actions.length && (
        <div className="empty-state">
          <span className="empty-icon">
            <Icon name="pin" size={24} />
          </span>
          <strong>{t("noSightings")}</strong>
          <p>{t("noSightingsBody")}</p>
        </div>
      )}
      <div className="map-attribution">
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
        >
          {t("osmAttribution")}
        </a>{" "}
        ·{" "}
        <a href="https://openfreemap.org" target="_blank" rel="noreferrer">
          OpenFreeMap
        </a>{" "}
        · {t("locationsNotice")}
      </div>
      <div className="map-controls" aria-label="Map controls">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          aria-label={t("zoomIn")}
        >
          <Icon name="plus" />
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          aria-label={t("zoomOut")}
        >
          <Icon name="minus" />
        </button>
        <button onClick={resetMap} aria-label={t("reset")}>
          <Icon name="reset" />
        </button>
      </div>
    </section>
  );
}
