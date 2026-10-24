import { Map as MapLibreMap, Marker, setWorkerUrl } from "maplibre-gl";
import { MapPin, Minus, Plus, RotateCcw } from "lucide-react";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { TranslationKey } from "../i18n";
import {
  applyGtaTheme,
  openFreeMapStyle,
  type MapTheme,
} from "../maps/gta-theme";
import type { CityConfig, MarketingAction } from "../types";
import { CitySelector } from "./city-selector";

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

export function CityMap({ city, actions, selectedId, onSelect, t }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerElements = useRef(new Map<string, HTMLButtonElement>());
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
      if (!imageMarker) throw new Error(`Missing marker image: ${action.icon}`);
      const element = document.createElement("button");
      element.type = "button";
      element.className = `map-action-marker image-action-marker${selectedId === action.id ? " selected" : ""}`;
      element.dataset.pinId = action.id;
      element.style.setProperty("--icon-scale", String(action.zoom ?? 1));
      element.setAttribute("aria-label", t(`actions.${action.id}`));
      element.addEventListener("click", () => onSelect(action.id));
      const image = document.createElement("img");
      image.src = imageMarker;
      image.alt = "";
      image.setAttribute("aria-hidden", "true");
      element.append(image);
      markerElements.current.set(action.id, element);
      new Marker({ element, anchor: "center" })
        .setLngLat([action.longitude, action.latitude])
        .addTo(map);
    }

    let collisionFrame = 0;
    const arrangeMarkers = () => {
      cancelAnimationFrame(collisionFrame);
      collisionFrame = requestAnimationFrame(() => {
        const placed: Array<{
          x: number;
          y: number;
          width: number;
          height: number;
        }> = [];
        const orderedActions = [...actions].sort((a, b) =>
          a.id === selectedIdRef.current
            ? -1
            : b.id === selectedIdRef.current
              ? 1
              : 0,
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
          const [offsetX, offsetY] =
            candidates.find(([dx, dy]) => {
              const candidate = {
                x: point.x + dx,
                y: point.y + dy,
                width,
                height,
              };
              return placed.every(
                (existing) =>
                  Math.abs(candidate.x - existing.x) >=
                    (candidate.width + existing.width) / 2 ||
                  Math.abs(candidate.y - existing.y) >=
                    (candidate.height + existing.height) / 2,
              );
            }) ?? candidates[candidates.length - 1];

          element.style.setProperty("--collision-x", `${offsetX}px`);
          element.style.setProperty("--collision-y", `${offsetY}px`);
          placed.push({
            x: point.x + offsetX,
            y: point.y + offsetY,
            width,
            height,
          });
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
    if (!map) return;

    const detailsPadding =
      window.matchMedia("(min-width: 761px)").matches && action
        ? { top: 0, right: 372, bottom: 0, left: 0 }
        : { top: 0, right: 0, bottom: 0, left: 0 };

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
        // Make the camera, bounds, and gesture handling use the visible map
        // column instead of the canvas area hidden behind the details panel.
        padding: detailsPadding,
        zoom: actionZoom,
        duration: 750,
        easing: (progress) => 1 - Math.pow(1 - progress, 3),
        essential: true,
      });
    } else {
      map.easeTo({ padding: detailsPadding, duration: 300 });
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
    <section
      className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-[var(--map-land)]"
      aria-label={`${t(`cities.${city.id}`)} marketing map`}
    >
      <CitySelector activeCity={city.id} t={t} />
      <div ref={containerRef} className="block h-full w-full" />
      {!actions.length && (
        <div className="absolute top-1/2 left-1/2 z-4 w-[min(330px,calc(100%-40px))] -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-[var(--border)] bg-[var(--surface-glass)] p-7 text-center shadow-[var(--shadow)] backdrop-blur-2xl">
          <span className="inline-grid size-12 place-items-center rounded-[15px] bg-[color-mix(in_srgb,var(--pink)_10%,transparent)] text-[var(--pink)]">
            <MapPin size={24} aria-hidden="true" />
          </span>
          <strong className="font-display mt-3 mb-1.25 block text-lg font-bold">
            {t("noSightings")}
          </strong>
          <p className="m-0 text-sm leading-normal text-[var(--muted)]">
            {t("noSightingsBody")}
          </p>
        </div>
      )}
      <div className="absolute bottom-3.5 left-[18px] z-3 rounded-[7px] bg-[var(--surface-glass)] px-2.25 py-1.5 text-[10px] font-bold tracking-[.04em] text-[var(--muted)] backdrop-blur-xl max-[760px]:bottom-[max(10px,env(safe-area-inset-bottom))] max-[760px]:left-3 max-[760px]:max-w-40 [&_a]:text-inherit [&_a]:no-underline [&_a:hover]:underline">
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
      <div
        className="absolute right-5 bottom-5 z-5 flex flex-col overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface-glass)] shadow-[var(--shadow)] backdrop-blur-xl max-[760px]:right-3.5 max-[760px]:bottom-[max(14px,env(safe-area-inset-bottom))] [&_button]:grid [&_button]:h-[42px] [&_button]:w-11 [&_button]:place-items-center [&_button]:border-0 [&_button]:border-b [&_button]:border-[var(--border)] [&_button]:bg-transparent [&_button:hover]:bg-[color-mix(in_srgb,var(--text)_7%,transparent)] [&_button:last-child]:border-0"
        aria-label="Map controls"
      >
        <button
          onClick={() => mapRef.current?.zoomIn()}
          aria-label={t("zoomIn")}
        >
          <Plus size={20} aria-hidden="true" />
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          aria-label={t("zoomOut")}
        >
          <Minus size={20} aria-hidden="true" />
        </button>
        <button onClick={resetMap} aria-label={t("reset")}>
          <RotateCcw size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
