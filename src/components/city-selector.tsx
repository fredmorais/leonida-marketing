import { NavLink, useNavigate } from "react-router-dom";
import { cities } from "../data/cities";
import type { TranslationKey } from "../i18n";
import type { CityId } from "../types";

export function CitySelector({
  activeCity,
  t,
}: {
  activeCity: CityId;
  t: (key: TranslationKey) => string;
}) {
  const navigate = useNavigate();
  return (
    <div className="absolute top-5.5 left-5.5 z-5 max-[760px]:top-3.5 max-[760px]:left-3.5">
      <div
        className="flex gap-1 rounded-2xl border border-(--border) bg-(--surface-glass) p-1 shadow-(--shadow) backdrop-blur-2xl max-[760px]:hidden"
        aria-label={t("selectCity")}
      >
        {cities.map((city) => (
          <NavLink
            key={city.id}
            to={city.route}
            className={`rounded-[11px] px-3.5 py-2.25 text-[13px] font-bold no-underline ${city.id === activeCity ? "bg-gradient-to-br from-[#d91896] to-(--purple) text-white shadow-[0_5px_16px_rgba(146,85,232,.3)]" : "text-(--muted) hover:text-(--text)"}`}
          >
            {t(`cities.${city.id}`)}
          </NavLink>
        ))}
      </div>
      <label className="hidden max-[760px]:block">
        <span className="sr-only">{t("selectCity")}</span>
        <select
          className="select-control min-h-11 bg-(--surface-glass) font-bold shadow-(--shadow) backdrop-blur-xl"
          value={activeCity}
          onChange={(e) =>
            navigate(cities.find((city) => city.id === e.target.value)!.route)
          }
        >
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {t(`cities.${city.id}`)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
