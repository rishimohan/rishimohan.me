import { useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { Airplane, Train } from "@phosphor-icons/react";
import clsx from "clsx";
import world from "world-atlas/countries-110m.json";
import data from "data/flights.json";
import AnchorHeading from "components/anchorHeading";

const WIDTH = 960;
const HEIGHT = 520;
const EARTH_KM = 40075;

const MODES = {
  flight: {
    Icon: Airplane,
    one: "flight",
    many: "flights",
    color: "#f97316",
    text: "text-orange-600 dark:text-orange-400",
    places: data.airports,
  },
  train: {
    Icon: Train,
    one: "train ride",
    many: "train rides",
    color: "#0ea5e9",
    text: "text-sky-600 dark:text-sky-400",
    places: data.stations || {},
  },
};

const journeys = [
  ...data.flights.map((f) => ({ ...f, mode: "flight", by: f.airline })),
  ...(data.trains || []).map((t) => ({ ...t, mode: "train", by: t.operator })),
];
const hasTrains = journeys.some((j) => j.mode === "train");

const place = (mode, code) => MODES[mode].places[code];
const placeKey = (mode, code) => `${mode}:${code}`;
const parseKey = (k) => k.split(":");

const countries = feature(world, world.objects.countries);
const years = [...new Set(journeys.map((j) => j.year))].sort();

const projection = geoNaturalEarth1().fitExtent(
  [
    [40, 50],
    [WIDTH - 40, HEIGHT - 30],
  ],
  {
    type: "MultiPoint",
    coordinates: journeys.flatMap((j) =>
      [j.from, j.to].map((c) => {
        const p = place(j.mode, c);
        return [p.lng, p.lat];
      })
    ),
  }
);
const path = geoPath(projection);
const countryPaths = countries.features.map((c) => path(c));
const xy = (k) => {
  const p = place(...parseKey(k));
  return projection([p.lng, p.lat]);
};
const cityOf = (k) => place(...parseKey(k)).city;

// Flights bow into arcs; trains hug the ground with a slight bend
function curve(a, b, mode) {
  const [x1, y1] = xy(a);
  const [x2, y2] = xy(b);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const bend = Math.min(len * (mode === "flight" ? 0.22 : 0.08), 90);
  const sign = x1 < x2 ? -1 : 1;
  const cx = (x1 + x2) / 2 + (sign * -dy * bend) / len;
  const cy = (y1 + y2) / 2 + (sign * dx * bend) / len;
  return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
}

const km = (n) => Math.round(n).toLocaleString("en-US");
const plural = (n, mode) =>
  `${n} ${n === 1 ? MODES[mode].one : MODES[mode].many}`;

function summarize(list) {
  const routes = {};
  const visits = {};
  const operators = {};
  list.forEach((j) => {
    const a = placeKey(j.mode, j.from);
    const b = placeKey(j.mode, j.to);
    const k = [a, b].sort().join("|");
    routes[k] = routes[k] || {
      key: k,
      a,
      b,
      mode: j.mode,
      count: 0,
      both: false,
    };
    routes[k].count++;
    if (a !== routes[k].a) routes[k].both = true;
    visits[a] = (visits[a] || 0) + 1;
    visits[b] = (visits[b] || 0) + 1;
    if (j.by) operators[j.by] = (operators[j.by] || 0) + 1;
  });
  const byMode = (m) => list.filter((j) => j.mode === m).length;
  return {
    routes: Object.values(routes).sort((x, y) => y.count - x.count),
    visits,
    operators: Object.entries(operators).sort((x, y) => y[1] - x[1]),
    distance: list.reduce((s, j) => s + j.distanceKm, 0),
    flights: byMode("flight"),
    trains: byMode("train"),
    cities: new Set(Object.keys(visits).map(cityOf)).size,
    countries: new Set(
      Object.keys(visits).map((k) => place(...parseKey(k)).country)
    ).size,
  };
}

function ModeIcon({ mode, size = 14 }) {
  const { Icon, text } = MODES[mode];
  return (
    <Icon
      size={size}
      weight="regular"
      className={clsx("shrink-0", text)}
      aria-hidden
    />
  );
}

function Stat({ value, unit, label, mode }) {
  return (
    <div className="px-4 py-3.5 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-1.5 text-2xl font-bold tabular-nums tracking-tight whitespace-nowrap">
        {mode && <ModeIcon mode={mode} size={18} />}
        {value}
        {unit && <span className="text-sm font-medium opacity-50">{unit}</span>}
      </div>
      <div className="text-[13px] opacity-50 mt-0.5 truncate">{label}</div>
    </div>
  );
}

function RankList({ title, items }) {
  const max = items[0]?.count || 1;
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-3">
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map(({ label, count, mode }) => (
          <li key={label} className="text-sm">
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="flex items-center gap-1.5 min-w-0">
                {mode && <ModeIcon mode={mode} />}
                <span className="truncate">{label}</span>
              </span>
              <span className="tabular-nums opacity-50">{count}</span>
            </div>
            <div className="h-1 rounded-full bg-gray-500/10 overflow-hidden">
              <div
                className="h-full rounded-full opacity-70"
                style={{
                  width: `${(count / max) * 100}%`,
                  background: MODES[mode || "flight"].color,
                }}
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
  const [mode, setMode] = useState("all");
  const [hovered, setHovered] = useState(null);

  const inMode = (j) => mode === "all" || j.mode === mode;
  const list = useMemo(
    () => journeys.filter((j) => inMode(j) && (!year || j.year === year)),
    [year, mode]
  );
  const s = useMemo(() => summarize(list), [list]);

  const bars = useMemo(
    () =>
      years.map((y) => {
        const ys = journeys.filter((j) => j.year === y && inMode(j));
        return {
          year: y,
          flight: ys.filter((j) => j.mode === "flight").length,
          train: ys.filter((j) => j.mode === "train").length,
        };
      }),
    [mode]
  );
  const maxBar = Math.max(...bars.map((b) => b.flight + b.train), 1);

  // Label the busiest places once per city, skipping any that would collide
  const labelled = Object.entries(s.visits)
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, [k]) => {
      if (acc.length >= 7 || acc.some((o) => cityOf(o) === cityOf(k)))
        return acc;
      const [x, y] = xy(k);
      const w = cityOf(k).length * 7;
      const clear = acc.every((o) => {
        const [ox, oy] = xy(o);
        return (
          Math.abs(ox - x) > (w + cityOf(o).length * 7) / 2 + 8 ||
          Math.abs(oy - y) > 20
        );
      });
      return clear ? [...acc, k] : acc;
    }, []);

  const log = useMemo(
    () =>
      [...years].reverse().map((y) => ({
        year: y,
        ...summarize(journeys.filter((j) => j.year === y && inMode(j))),
      })),
    [mode]
  );

  const isActive = (r) => !hovered || r.a === hovered || r.b === hovered;
  const animKey = `${mode}-${year || "all"}`;
  const countLabel = (x) =>
    [
      x.flights && plural(x.flights, "flight"),
      x.trains && plural(x.trains, "train"),
    ]
      .filter(Boolean)
      .join(" · ");

  return (
    <section className="w-full mt-16">
      <style>{`
        @keyframes fm-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes fm-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fm-pop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
        .fm-arc { stroke-dasharray: 1; animation: fm-draw 1.1s cubic-bezier(.4,0,.2,1) both; }
        .fm-rail { animation: fm-fade .8s ease-out both; }
        .fm-dot { transform-box: fill-box; transform-origin: center; animation: fm-pop .5s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .fm-arc, .fm-rail, .fm-dot { animation: none; } }
      `}</style>

      <div className="max-w-[620px] mx-auto px-5">
        <div className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ModeIcon mode="flight" size={13} />
          {hasTrains && <ModeIcon mode="train" size={13} />}
          <span className="opacity-60">{years[0]} → today</span>
        </div>
        <AnchorHeading
          id="on-the-move"
          className="mb-3 text-2xl md:text-3xl font-bold"
        >
          On the move
        </AnchorHeading>
        <p className="mb-8 opacity-70 leading-[1.7]">
          Every flight{hasTrains && " and long-distance train"} I've taken since{" "}
          {years[0]}, pieced together from old boarding passes, tickets and
          booking emails.
        </p>

        {hasTrains && (
          <div
            className="inline-flex p-1 mb-5 rounded-xl bg-gray-500/10 text-sm"
            role="tablist"
            aria-label="Filter by mode"
          >
            {[
              ["all", "All"],
              ["flight", "Flights"],
              ["train", "Trains"],
            ].map(([m, label]) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors",
                  mode === m
                    ? "bg-white dark:bg-gray-800 shadow-sm font-medium"
                    : "opacity-60 hover:opacity-100"
                )}
              >
                {m !== "all" && <ModeIcon mode={m} />}
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-500/15 rounded-xl border border-gray-500/15 overflow-hidden mb-8">
          {mode === "all" ? (
            <>
              <Stat mode="flight" value={s.flights} label="flights" />
              <Stat mode="train" value={s.trains} label="train rides" />
            </>
          ) : (
            <>
              <Stat mode={mode} value={list.length} label={MODES[mode].many} />
              <Stat value={s.cities} label="cities" />
            </>
          )}
          <Stat
            value={km(s.distance)}
            unit="km"
            label={`${(s.distance / EARTH_KM).toFixed(1)}× around Earth`}
          />
          <Stat value={s.countries} label="countries" />
        </div>

        {/* Trips per year, doubles as the filter */}
        <div
          className="flex items-end gap-1.5 h-24 mb-1"
          role="tablist"
          aria-label="Filter by year"
        >
          {bars.map((b) => {
            const selected = year === b.year;
            const total = b.flight + b.train;
            return (
              <button
                key={b.year}
                role="tab"
                aria-selected={selected}
                onClick={() => setYear(selected ? null : b.year)}
                className="group flex-1 h-full flex flex-col justify-end items-center gap-1"
                title={`${b.year}: ${b.flight} flights, ${b.train} train rides`}
              >
                <span
                  className={clsx(
                    "text-[11px] tabular-nums transition-opacity",
                    selected
                      ? "opacity-100 font-semibold"
                      : "opacity-0 group-hover:opacity-60"
                  )}
                >
                  {total}
                </span>
                <span
                  className={clsx(
                    "w-full flex flex-col rounded-md overflow-hidden transition-opacity",
                    year && !selected
                      ? "opacity-25 group-hover:opacity-50"
                      : selected
                      ? "opacity-100"
                      : "opacity-60 group-hover:opacity-90"
                  )}
                  style={{
                    height: `${Math.max((total / maxBar) * 64, 4)}px`,
                  }}
                >
                  <span className="bg-sky-500" style={{ flexGrow: b.train }} />
                  <span
                    className="bg-orange-500"
                    style={{ flexGrow: b.flight }}
                  />
                </span>
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
        <div className="flex items-center justify-between gap-3 h-5 mb-2 text-sm">
          {year ? (
            <button
              onClick={() => setYear(null)}
              className="opacity-60 hover:opacity-100 hover:underline truncate"
            >
              Showing {year} · show all years
            </button>
          ) : (
            <span className="opacity-40 truncate">
              Tap a year to filter the map
            </span>
          )}
          {hasTrains && (
            <span className="flex items-center gap-3 text-xs opacity-70 shrink-0">
              <span className="flex items-center gap-1">
                <ModeIcon mode="flight" size={12} /> Flight
              </span>
              <span className="flex items-center gap-1">
                <ModeIcon mode="train" size={12} /> Train
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-5">
        <div className="relative rounded-2xl border border-gray-500/15 bg-gradient-to-b from-gray-50 to-white dark:from-white/[0.04] dark:to-white/[0.01] overflow-hidden">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full h-auto block"
            role="img"
            aria-label="Map of flight and train routes"
          >
            <defs>
              {Object.entries(MODES).map(([m, { color }]) => (
                <radialGradient key={m} id={`fm-glow-${m}`}>
                  <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </radialGradient>
              ))}
            </defs>

            <g className="fill-gray-200/80 dark:fill-white/[0.07] stroke-white dark:stroke-gray-900">
              {countryPaths.map((d, i) => (
                <path key={i} d={d} strokeWidth={0.6} />
              ))}
            </g>

            {/* Trains first so flight arcs sit on top */}
            <g key={animKey} fill="none" strokeLinecap="round">
              {[...s.routes]
                .sort((a, b) =>
                  a.mode === b.mode ? 0 : a.mode === "train" ? -1 : 1
                )
                .map((r, i) => (
                  <path
                    key={r.key}
                    d={curve(r.a, r.b, r.mode)}
                    pathLength={r.mode === "flight" ? 1 : undefined}
                    className={clsx(
                      r.mode === "flight" ? "fm-arc" : "fm-rail",
                      "transition-[stroke-opacity] duration-300"
                    )}
                    stroke={MODES[r.mode].color}
                    strokeDasharray={r.mode === "train" ? "4 3" : undefined}
                    style={{ animationDelay: `${Math.min(i * 15, 700)}ms` }}
                    strokeWidth={Math.min(
                      (r.mode === "train" ? 1.2 : 1) + r.count * 0.3,
                      3.5
                    )}
                    strokeOpacity={isActive(r) ? 0.85 : 0.07}
                  />
                ))}
            </g>

            <g key={`dots-${animKey}`}>
              {Object.entries(s.visits).map(([k, n]) => {
                const [m] = parseKey(k);
                const [x, y] = xy(k);
                const r = Math.min(2.2 + Math.sqrt(n) * 0.8, 6.5);
                return (
                  <g
                    key={k}
                    onMouseEnter={() => setHovered(k)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {n >= 8 && (
                      <circle
                        cx={x}
                        cy={y}
                        r={r * 3.2}
                        fill={`url(#fm-glow-${m})`}
                      />
                    )}
                    <circle cx={x} cy={y} r={12} fill="transparent" />
                    {m === "flight" ? (
                      <circle
                        cx={x}
                        cy={y}
                        r={r}
                        className="fm-dot fill-gray-900 dark:fill-white stroke-white dark:stroke-gray-900"
                        strokeWidth={1.5}
                      />
                    ) : (
                      <rect
                        x={x - r * 0.8}
                        y={y - r * 0.8}
                        width={r * 1.6}
                        height={r * 1.6}
                        rx={1}
                        transform={`rotate(45 ${x} ${y})`}
                        className="fm-dot stroke-white dark:stroke-gray-900"
                        fill={MODES.train.color}
                        strokeWidth={1.2}
                      />
                    )}
                  </g>
                );
              })}
            </g>

            {/* Labels sit on their own layer so dots never cover them */}
            <g className="pointer-events-none">
              {Object.entries(s.visits)
                .filter(([k]) => labelled.includes(k) || hovered === k)
                .map(([k, n]) => {
                  const [x, y] = xy(k);
                  const r = Math.min(2.2 + Math.sqrt(n) * 0.8, 6.5);
                  return (
                    <text
                      key={k}
                      x={x}
                      y={y - r - 6}
                      textAnchor="middle"
                      className={clsx(
                        "text-[12px] font-semibold fill-gray-900 dark:fill-white stroke-white dark:stroke-gray-900",
                        hovered && hovered !== k && "opacity-30"
                      )}
                      strokeWidth={3}
                      paintOrder="stroke"
                    >
                      {cityOf(k)}
                      {hovered === k && ` · ${n}`}
                    </text>
                  );
                })}
            </g>
          </svg>
        </div>
      </div>

      <div className="max-w-[620px] mx-auto px-5 mt-10">
        <div className="grid sm:grid-cols-2 gap-8 mb-14">
          <RankList
            title="Most travelled routes"
            items={s.routes.slice(0, 5).map((r) => ({
              label: `${cityOf(r.a)} ${r.both ? "⇄" : "→"} ${cityOf(r.b)}`,
              count: r.count,
              mode: r.mode,
            }))}
          />
          <RankList
            title={
              mode === "train"
                ? "Railways"
                : mode === "flight" || !hasTrains
                ? "Airlines"
                : "Airlines & railways"
            }
            items={s.operators.slice(0, 5).map(([label, count]) => ({
              label,
              count,
              mode: journeys.find((j) => j.by === label)?.mode,
            }))}
          />
        </div>

        <AnchorHeading
          as="h3"
          id="year-by-year"
          className="mb-6 text-lg font-bold"
        >
          Year by year
        </AnchorHeading>
        <ol className="relative border-l border-gray-500/15 ml-1.5">
          {log
            .filter((y) => y.routes.length)
            .map((y) => (
              <li
                key={y.year}
                className={clsx(
                  "pl-6 pb-8 last:pb-0 relative transition-opacity",
                  year && year !== y.year && "opacity-40"
                )}
              >
                <span className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full bg-gray-400 dark:bg-gray-500 ring-4 ring-white dark:ring-gray-900" />
                <button
                  onClick={() => setYear(year === y.year ? null : y.year)}
                  className="flex flex-wrap items-baseline gap-x-3 mb-3 text-left"
                >
                  <span className="text-lg font-bold tabular-nums">
                    {y.year}
                  </span>
                  <span className="text-sm opacity-50">
                    {countLabel(y)} · {km(y.distance)} km
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
                      <ModeIcon mode={r.mode} size={13} />
                      {cityOf(r.a)}
                      <span className="opacity-40">{r.both ? "⇄" : "→"}</span>
                      {cityOf(r.b)}
                      {r.count > 1 && (
                        <span
                          className={clsx(
                            "text-[11px] tabular-nums font-semibold",
                            MODES[r.mode].text
                          )}
                        >
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
