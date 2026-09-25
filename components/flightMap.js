import { useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import clsx from "clsx";
import world from "world-atlas/countries-110m.json";
import data from "data/flights.json";

const WIDTH = 960;
const HEIGHT = 520;
const EARTH_KM = 40075;

const countries = feature(world, world.objects.countries);
const years = [...new Set(data.flights.map((f) => f.year))].sort();
const perYear = years.map(
  (y) => data.flights.filter((f) => f.year === y).length
);
const maxPerYear = Math.max(...perYear);

// Fit to every airport once so the frame doesn't jump while filtering
const projection = geoNaturalEarth1().fitExtent(
  [
    [40, 50],
    [WIDTH - 40, HEIGHT - 30],
  ],
  {
    type: "MultiPoint",
    coordinates: Object.values(data.airports).map((a) => [a.lng, a.lat]),
  }
);
const path = geoPath(projection);
const countryPaths = countries.features.map((c) => path(c));
const xy = (code) =>
  projection([data.airports[code].lng, data.airports[code].lat]);
const city = (code) => data.airports[code].city;

// A gentle arc between two points, bowing more for longer hops
function arc(a, b) {
  const [x1, y1] = xy(a);
  const [x2, y2] = xy(b);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const bend = Math.min(Math.hypot(dx, dy) * 0.22, 90);
  const len = Math.hypot(dx, dy) || 1;
  // Always bow "upwards" so paired routes share one curve
  const sign = x1 < x2 ? -1 : 1;
  const cx = (x1 + x2) / 2 + (sign * -dy * bend) / len;
  const cy = (y1 + y2) / 2 + (sign * dx * bend) / len;
  return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
}

const pairKey = (f) => [f.from, f.to].sort().join("-");
const km = (n) => Math.round(n).toLocaleString("en-US");

function summarize(flights) {
  const routes = {};
  const visits = {};
  const airlines = {};
  flights.forEach((f) => {
    const k = pairKey(f);
    routes[k] = routes[k] || {
      key: k,
      a: f.from,
      b: f.to,
      count: 0,
      both: false,
    };
    routes[k].count++;
    if (f.from !== routes[k].a) routes[k].both = true;
    visits[f.from] = (visits[f.from] || 0) + 1;
    visits[f.to] = (visits[f.to] || 0) + 1;
    if (f.airline) airlines[f.airline] = (airlines[f.airline] || 0) + 1;
  });
  const distance = flights.reduce((s, f) => s + f.distanceKm, 0);
  return {
    routes: Object.values(routes).sort((x, y) => y.count - x.count),
    visits,
    airlines: Object.entries(airlines).sort((x, y) => y[1] - x[1]),
    distance,
    countries: new Set(Object.keys(visits).map((c) => data.airports[c].country))
      .size,
  };
}

function Stat({ value, unit, label }) {
  return (
    <div className="px-4 py-3.5 bg-white dark:bg-gray-900">
      <div className="text-2xl font-bold tabular-nums tracking-tight whitespace-nowrap">
        {value}
        {unit && (
          <span className="ml-1 text-sm font-medium opacity-50">{unit}</span>
        )}
      </div>
      <div className="text-[13px] opacity-50 mt-0.5">{label}</div>
    </div>
  );
}

function RankList({ title, items }) {
  const max = items[0]?.[1] || 1;
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-3">
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map(([label, n]) => (
          <li key={label} className="text-sm">
            <div className="flex justify-between gap-3 mb-1">
              <span className="truncate">{label}</span>
              <span className="tabular-nums opacity-50">{n}</span>
            </div>
            <div className="h-1 rounded-full bg-gray-500/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-orange-500/70"
                style={{ width: `${(n / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FlightMap() {
  const [year, setYear] = useState(null);
  const [hovered, setHovered] = useState(null);

  const flights = useMemo(
    () => (year ? data.flights.filter((f) => f.year === year) : data.flights),
    [year]
  );
  const s = useMemo(() => summarize(flights), [flights]);

  // Label the busiest airports, skipping any that would collide with a busier one
  const topAirports = Object.entries(s.visits)
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, [c]) => {
      if (acc.length >= 6) return acc;
      const [x, y] = xy(c);
      const clear = acc.every((o) => {
        const [ox, oy] = xy(o);
        return Math.abs(ox - x) > 70 || Math.abs(oy - y) > 22;
      });
      return clear ? [...acc, c] : acc;
    }, []);

  const log = useMemo(
    () =>
      [...years].reverse().map((y) => {
        const list = data.flights.filter((f) => f.year === y);
        return { year: y, list, ...summarize(list) };
      }),
    []
  );

  const isActive = (r) => !hovered || r.a === hovered || r.b === hovered;

  return (
    <section className="w-full mt-16">
      <style>{`
        @keyframes fm-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes fm-pop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
        .fm-arc { stroke-dasharray: 1; animation: fm-draw 1.1s cubic-bezier(.4,0,.2,1) both; }
        .fm-dot { transform-box: fill-box; transform-origin: center; animation: fm-pop .5s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .fm-arc, .fm-dot { animation: none; } }
      `}</style>

      <div className="max-w-[620px] mx-auto px-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-2">
          Flights · {data.stats.firstYear} → today
        </div>
        <h2 className="mb-3 text-2xl md:text-3xl font-bold">Up in the air</h2>
        <p className="mb-8 opacity-70 leading-[1.7]">
          Every flight I've taken since my first one in {data.stats.firstYear},
          pieced together from old boarding passes and booking emails.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-500/15 rounded-xl border border-gray-500/15 overflow-hidden mb-8">
          <Stat value={flights.length} label="flights" />
          <Stat
            value={km(s.distance)}
            unit="km"
            label={`${(s.distance / EARTH_KM).toFixed(1)}× around Earth`}
          />
          <Stat value={Object.keys(s.visits).length} label="airports" />
          <Stat value={s.countries} label="countries" />
        </div>

        {/* Flights per year, doubles as the filter */}
        <div
          className="flex items-end gap-1.5 h-24 mb-1"
          role="tablist"
          aria-label="Filter by year"
        >
          {years.map((y, i) => {
            const selected = year === y;
            return (
              <button
                key={y}
                role="tab"
                aria-selected={selected}
                onClick={() => setYear(selected ? null : y)}
                className="group flex-1 h-full flex flex-col justify-end items-center gap-1"
                title={`${perYear[i]} flights in ${y}`}
              >
                <span
                  className={clsx(
                    "text-[11px] tabular-nums transition-opacity",
                    selected
                      ? "opacity-100 font-semibold"
                      : "opacity-0 group-hover:opacity-60"
                  )}
                >
                  {perYear[i]}
                </span>
                <span
                  className={clsx(
                    "w-full rounded-md transition-colors",
                    selected
                      ? "bg-orange-500"
                      : year
                      ? "bg-gray-500/15 group-hover:bg-gray-500/30"
                      : "bg-orange-500/40 group-hover:bg-orange-500/70"
                  )}
                  style={{
                    height: `${Math.max((perYear[i] / maxPerYear) * 64, 4)}px`,
                  }}
                />
              </button>
            );
          })}
        </div>
        <div className="flex gap-1.5 mb-5">
          {years.map((y) => (
            <span
              key={y}
              className={clsx(
                "flex-1 text-center text-[11px] tabular-nums",
                year === y ? "font-semibold" : "opacity-50"
              )}
            >
              ’{String(y).slice(2)}
            </span>
          ))}
        </div>
        <div className="h-5 mb-2 text-sm">
          {year ? (
            <button
              onClick={() => setYear(null)}
              className="opacity-60 hover:opacity-100 hover:underline"
            >
              Showing {year} · show all years
            </button>
          ) : (
            <span className="opacity-40">Tap a year to filter the map</span>
          )}
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-5">
        <div className="relative rounded-2xl border border-gray-500/15 bg-gradient-to-b from-gray-50 to-white dark:from-white/[0.04] dark:to-white/[0.01] overflow-hidden">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full h-auto block"
            role="img"
            aria-label="Map of flight routes"
          >
            <defs>
              <radialGradient id="fm-glow">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </radialGradient>
            </defs>

            <g className="fill-gray-200/80 dark:fill-white/[0.07] stroke-white dark:stroke-gray-900">
              {countryPaths.map((d, i) => (
                <path key={i} d={d} strokeWidth={0.6} />
              ))}
            </g>

            <g key={year || "all"} fill="none" strokeLinecap="round">
              {s.routes.map((r, i) => (
                <path
                  key={r.key}
                  d={arc(r.a, r.b)}
                  pathLength={1}
                  className="fm-arc stroke-orange-500 transition-[stroke-opacity] duration-300"
                  style={{ animationDelay: `${Math.min(i * 18, 700)}ms` }}
                  strokeWidth={Math.min(1 + r.count * 0.35, 3.5)}
                  strokeOpacity={isActive(r) ? 0.8 : 0.07}
                />
              ))}
            </g>

            <g key={`dots-${year || "all"}`}>
              {Object.entries(s.visits).map(([code, n]) => {
                const [x, y] = xy(code);
                const r = Math.min(2.2 + Math.sqrt(n) * 0.9, 7);
                const labelled = topAirports.includes(code) || hovered === code;
                return (
                  <g
                    key={code}
                    onMouseEnter={() => setHovered(code)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {n >= 8 && (
                      <circle cx={x} cy={y} r={r * 3.2} fill="url(#fm-glow)" />
                    )}
                    <circle cx={x} cy={y} r={12} fill="transparent" />
                    <circle
                      cx={x}
                      cy={y}
                      r={r}
                      className="fm-dot fill-gray-900 dark:fill-white stroke-white dark:stroke-gray-900"
                      strokeWidth={1.5}
                    />
                    {labelled && (
                      <text
                        x={x}
                        y={y - r - 6}
                        textAnchor="middle"
                        className={clsx(
                          "pointer-events-none text-[12px] font-semibold fill-gray-900 dark:fill-white stroke-white dark:stroke-gray-900",
                          hovered && hovered !== code && "opacity-30"
                        )}
                        strokeWidth={3}
                        paintOrder="stroke"
                      >
                        {city(code)}
                        {hovered === code && ` · ${n}`}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      <div className="max-w-[620px] mx-auto px-5 mt-10">
        <div className="grid sm:grid-cols-2 gap-8 mb-14">
          <RankList
            title="Most flown routes"
            items={s.routes
              .slice(0, 5)
              .map((r) => [
                `${city(r.a)} ${r.both ? "⇄" : "→"} ${city(r.b)}`,
                r.count,
              ])}
          />
          <RankList title="Airlines" items={s.airlines.slice(0, 5)} />
        </div>

        <h3 className="mb-6 text-lg font-bold">Year by year</h3>
        <ol className="relative border-l border-gray-500/15 ml-1.5">
          {log.map((y) => (
            <li
              key={y.year}
              className={clsx(
                "pl-6 pb-8 last:pb-0 relative transition-opacity",
                year && year !== y.year && "opacity-40"
              )}
            >
              <span className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full bg-orange-500 ring-4 ring-white dark:ring-gray-900" />
              <button
                onClick={() => setYear(year === y.year ? null : y.year)}
                className="flex items-baseline gap-3 mb-3 text-left"
              >
                <span className="text-lg font-bold tabular-nums">{y.year}</span>
                <span className="text-sm opacity-50">
                  {y.list.length} {y.list.length === 1 ? "flight" : "flights"} ·{" "}
                  {km(y.distance)} km
                </span>
              </button>
              <div className="flex flex-wrap gap-1.5">
                {y.routes.map((r) => (
                  <span
                    key={r.key}
                    onMouseEnter={() => setHovered(r.a)}
                    onMouseLeave={() => setHovered(null)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-500/15 px-2.5 py-1 text-[13px]"
                  >
                    {city(r.a)}
                    <span className="opacity-40">{r.both ? "⇄" : "→"}</span>
                    {city(r.b)}
                    {r.count > 1 && (
                      <span className="text-[11px] tabular-nums font-semibold text-orange-600 dark:text-orange-400">
                        ×{r.count}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
