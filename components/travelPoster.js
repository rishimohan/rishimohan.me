import { forwardRef, useMemo } from "react";
import { geoNaturalEarth1, geoContains } from "d3-geo";
import { feature } from "topojson-client";
import landTopo from "world-atlas/land-110m.json";
import data from "data/flights.json";

// System font stack so the exported PNG looks the same as the preview
export const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&display=swap";
const FONT =
  "'Bricolage Grotesque', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Helvetica Neue', Arial, sans-serif";

const COLORS = {
  bg: "#07080b",
  land: "#30343f",
  text: "#f5f5f7",
  muted: "#8a8d96",
  faint: "#3a3d46",
  flightA: "#ff8a3d",
  flightB: "#ff4f8b",
  train: "#38d6ff",
};

export const FORMATS = {
  portrait: {
    label: "Portrait · 1080×1350",
    short: "Portrait",
    w: 1080,
    h: 1350,
    map: [0, 230, 1080, 930],
  },
  landscape: {
    label: "Landscape · 1200×630",
    short: "Landscape",
    w: 1200,
    h: 630,
    map: [430, 30, 1200, 600],
  },
};

const land = feature(landTopo, landTopo.objects.land);

const journeys = [
  ...data.flights.map((f) => ({ ...f, mode: "flight" })),
  ...(data.trains || []).map((t) => ({
    ...t,
    mode: "train",
    airline: t.operator,
  })),
];
export const YEARS = [...new Set(journeys.map((j) => j.year))].sort();

const place = (j, code) =>
  (j.mode === "flight" ? data.airports : data.stations)[code];
const km = (n) => Math.round(n).toLocaleString("en-US");

function stats(list) {
  const routes = {};
  const cities = new Set();
  const countries = new Set();
  list.forEach((j) => {
    const a = place(j, j.from);
    const b = place(j, j.to);
    cities.add(a.city).add(b.city);
    countries.add(a.country).add(b.country);
    const k = [a.city, b.city].sort().join(" ⇄ ");
    routes[k] = (routes[k] || 0) + 1;
  });
  const topRoute = Object.entries(routes).sort((x, y) => y[1] - x[1])[0];
  const flights = list.filter((j) => j.mode === "flight");
  const longest = flights.sort((a, b) => b.distanceKm - a.distanceKm)[0];
  const byYear = {};
  list.forEach((j) => (byYear[j.year] = (byYear[j.year] || 0) + 1));
  const busiest = Object.entries(byYear).sort((a, b) => b[1] - a[1])[0];
  return {
    flights: flights.length,
    trains: list.length - flights.length,
    distance: list.reduce((s, j) => s + j.distanceKm, 0),
    cities: cities.size,
    countries: countries.size,
    topRoute,
    longest: longest && {
      label: `${place(longest, longest.from).city} → ${
        place(longest, longest.to).city
      }`,
      km: longest.distanceKm,
    },
    busiest,
  };
}

function useMap(list, box) {
  return useMemo(() => {
    const [x0, y0, x1, y1] = box;
    // Frame the whole travel history so every year shares the same map
    const projection = geoNaturalEarth1().fitExtent(
      [
        [x0 + 40, y0 + 70],
        [x1 - 40, y1 - 50],
      ],
      {
        type: "MultiPoint",
        coordinates: journeys.flatMap((j) =>
          [j.from, j.to].map((c) => [place(j, c).lng, place(j, c).lat])
        ),
      }
    );

    const dots = [];
    const step = 9;
    for (let x = x0 + step / 2; x < x1; x += step) {
      for (let y = y0 + step / 2; y < y1; y += step) {
        const ll = projection.invert([x, y]);
        if (ll && geoContains(land, ll)) dots.push([x, y]);
      }
    }

    const xy = (j, c) => projection([place(j, c).lng, place(j, c).lat]);
    const routes = {};
    const visits = {};
    list.forEach((j) => {
      const k = `${j.mode}:${[j.from, j.to].sort().join("-")}`;
      routes[k] = routes[k] || { j, count: 0 };
      routes[k].count++;
      [j.from, j.to].forEach((c) => {
        const vk = `${j.mode}:${c}`;
        visits[vk] = visits[vk] || {
          p: xy(j, c),
          mode: j.mode,
          n: 0,
          city: place(j, c).city,
        };
        visits[vk].n++;
      });
    });

    const arcs = Object.entries(routes).map(([k, { j, count }]) => {
      const [ax, ay] = xy(j, j.from);
      const [bx, by] = xy(j, j.to);
      const dx = bx - ax;
      const dy = by - ay;
      const len = Math.hypot(dx, dy) || 1;
      const bend = Math.min(len * (j.mode === "flight" ? 0.25 : 0.08), 110);
      const sign = ax < bx ? -1 : 1;
      const cx = (ax + bx) / 2 + (sign * -dy * bend) / len;
      const cy = (ay + by) / 2 + (sign * dx * bend) / len;
      return {
        key: k,
        mode: j.mode,
        count,
        d: `M${ax},${ay} Q${cx},${cy} ${bx},${by}`,
        from: [ax, ay],
        to: [bx, by],
      };
    });

    return { dots, arcs, visits: Object.values(visits) };
  }, [list, box]);
}

function Stat({ x, y, value, unit, label, size = 64 }) {
  const labelSize = Math.max(Math.min(Math.round(size * 0.3), 26), 15);
  return (
    <g>
      <text
        x={x}
        y={y}
        fill={COLORS.text}
        fontSize={size}
        fontWeight={700}
        letterSpacing={-size * 0.035}
      >
        {value}
        {unit && (
          <tspan
            fontSize={size * 0.36}
            fontWeight={600}
            fill={COLORS.muted}
            dx={size * 0.08}
            letterSpacing={0}
          >
            {unit}
          </tspan>
        )}
      </text>
      <text
        x={x}
        y={y + size * 0.28 + labelSize + 4}
        fill={COLORS.muted}
        fontSize={labelSize}
        fontWeight={500}
      >
        {label}
      </text>
    </g>
  );
}

function Fact({ x, y, label, value, width }) {
  return (
    <g>
      <text
        x={x}
        y={y}
        fill={COLORS.muted}
        fontSize={18}
        fontWeight={600}
        letterSpacing={1.5}
      >
        {label.toUpperCase()}
      </text>
      <text
        x={x}
        y={y + 34}
        fill={COLORS.text}
        fontSize={26}
        fontWeight={600}
        textLength={undefined}
      >
        {value.length > width ? value.slice(0, width - 1) + "…" : value}
      </text>
    </g>
  );
}

const TravelPoster = forwardRef(function TravelPoster(
  { year, format = "portrait" },
  ref
) {
  const f = FORMATS[format];
  const list = useMemo(
    () => (year ? journeys.filter((j) => j.year === year) : journeys),
    [year]
  );
  const s = useMemo(() => stats([...list]), [list]);
  const { dots, arcs, visits } = useMap(list, f.map);
  const title = year ? String(year) : "All time";
  const subtitle = year
    ? "My year in travel"
    : `My travels · ${YEARS[0]}–${YEARS[YEARS.length - 1]}`;
  const topCities = [...visits]
    .sort((a, b) => b.n - a.n)
    .reduce((acc, v) => {
      if (acc.length >= 5 || acc.some((o) => o.city === v.city)) return acc;
      const clear = acc.every(
        (o) => Math.abs(o.p[0] - v.p[0]) > 110 || Math.abs(o.p[1] - v.p[1]) > 30
      );
      return clear ? [...acc, v] : acc;
    }, []);

  const portrait = format === "portrait";
  const pad = portrait ? 72 : 56;

  const hero = {
    value: km(s.distance),
    unit: "km",
    label: `${(s.distance / 40075).toFixed(1)}× around the Earth`,
  };
  const row = [
    { value: s.flights, label: s.flights === 1 ? "flight" : "flights" },
    { value: s.trains, label: s.trains === 1 ? "train ride" : "train rides" },
    { value: s.countries, label: s.countries === 1 ? "country" : "countries" },
  ];

  const facts = [
    s.topRoute && {
      label: "Top route",
      value: `${s.topRoute[0]} ×${s.topRoute[1]}`,
    },
    s.longest && {
      label: "Longest flight",
      value: `${s.longest.label} · ${km(s.longest.km)} km`,
    },
    !year &&
      s.busiest && {
        label: "Busiest year",
        value: `${s.busiest[0]} · ${s.busiest[1]} journeys`,
      },
    { label: "Cities", value: `${s.cities} visited` },
  ].filter(Boolean);

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${f.w} ${f.h}`}
      width={f.w}
      height={f.h}
      fontFamily={FONT}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <linearGradient id="tp-flight" x1="0" x2="1">
          <stop offset="0" stopColor={COLORS.flightA} />
          <stop offset="1" stopColor={COLORS.flightB} />
        </linearGradient>
        <radialGradient
          id="tp-vignette"
          cx="50%"
          cy={portrait ? "45%" : "50%"}
          r="75%"
        >
          <stop offset="0" stopColor="#0d0f15" />
          <stop offset="1" stopColor={COLORS.bg} />
        </radialGradient>
        <linearGradient
          id="tp-fade"
          x1="0"
          y1="0"
          x2={format === "portrait" ? 0 : 1}
          y2={format === "portrait" ? 1 : 0}
        >
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.18" stopColor="#fff" />
          <stop offset="0.8" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="tp-land-mask" maskUnits="userSpaceOnUse">
          <rect
            x={f.map[0]}
            y={f.map[1]}
            width={f.map[2] - f.map[0]}
            height={f.map[3] - f.map[1]}
            fill="url(#tp-fade)"
          />
        </mask>
        <filter id="tp-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="tp-glow-sm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        {arcs
          .filter((a) => a.mode === "flight")
          .map((a) => (
            <linearGradient
              key={a.key}
              id={`g-${a.key.replace(/[^a-z0-9]/gi, "")}`}
              gradientUnits="userSpaceOnUse"
              x1={a.from[0]}
              y1={a.from[1]}
              x2={a.to[0]}
              y2={a.to[1]}
            >
              <stop offset="0" stopColor={COLORS.flightA} />
              <stop offset="1" stopColor={COLORS.flightB} />
            </linearGradient>
          ))}
      </defs>

      <rect width={f.w} height={f.h} fill="url(#tp-vignette)" />

      <g fill={COLORS.land} mask="url(#tp-land-mask)">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.8} />
        ))}
      </g>

      {/* Glow layer, then crisp strokes on top */}
      <g
        fill="none"
        strokeLinecap="round"
        filter="url(#tp-glow)"
        opacity={0.55}
      >
        {arcs.map((a) => (
          <path
            key={a.key}
            d={a.d}
            stroke={
              a.mode === "flight"
                ? `url(#g-${a.key.replace(/[^a-z0-9]/gi, "")})`
                : COLORS.train
            }
            strokeWidth={Math.min(2 + a.count * 0.6, 6)}
          />
        ))}
      </g>
      <g fill="none" strokeLinecap="round">
        {arcs.map((a) => (
          <path
            key={a.key}
            d={a.d}
            stroke={
              a.mode === "flight"
                ? `url(#g-${a.key.replace(/[^a-z0-9]/gi, "")})`
                : COLORS.train
            }
            strokeWidth={Math.min(1 + a.count * 0.3, 3.2)}
            strokeDasharray={a.mode === "train" ? "5 4" : undefined}
            opacity={0.95}
          />
        ))}
      </g>

      <g>
        {visits.map((v) => {
          const r = Math.min(2.4 + Math.sqrt(v.n) * 0.8, 6.5);
          const color = v.mode === "flight" ? COLORS.flightA : COLORS.train;
          return (
            <g key={`${v.mode}-${v.city}-${v.p[0]}`}>
              {v.n >= 6 && (
                <circle
                  cx={v.p[0]}
                  cy={v.p[1]}
                  r={r * 2.6}
                  fill={color}
                  opacity={0.35}
                  filter="url(#tp-glow-sm)"
                />
              )}
              <circle
                cx={v.p[0]}
                cy={v.p[1]}
                r={r}
                fill="#fff"
                stroke={color}
                strokeWidth={2}
              />
            </g>
          );
        })}
      </g>

      <g>
        {topCities.map((v) => (
          <text
            key={v.city}
            x={Math.min(Math.max(v.p[0], pad + 50), f.w - pad - 50)}
            y={v.p[1] - 16}
            textAnchor="middle"
            fill={COLORS.text}
            fontSize={20}
            fontWeight={600}
            stroke={COLORS.bg}
            strokeWidth={5}
            paintOrder="stroke"
          >
            {v.city}
          </text>
        ))}
      </g>

      {portrait ? (
        <>
          <text
            x={pad}
            y={pad + 18}
            fill={COLORS.muted}
            fontSize={22}
            fontWeight={600}
            letterSpacing={3}
          >
            RISHI MOHAN
          </text>
          <text
            x={pad}
            y={pad + 150}
            fill={COLORS.text}
            fontSize={140}
            fontWeight={800}
            letterSpacing={-5}
          >
            {title}
          </text>
          <text
            x={pad}
            y={pad + 200}
            fill={COLORS.muted}
            fontSize={30}
            fontWeight={500}
          >
            {subtitle}
          </text>

          <Stat x={pad} y={1020} size={110} {...hero} />
          {row.map((st, i) => (
            <Stat key={i} x={pad + i * 320} y={1170} size={72} {...st} />
          ))}

          <line
            x1={pad}
            x2={f.w - pad}
            y1={1245}
            y2={1245}
            stroke={COLORS.faint}
          />
          {facts.slice(0, 2).map((fact, i) => (
            <Fact key={i} x={pad + i * 480} y={1280} width={30} {...fact} />
          ))}
        </>
      ) : (
        <>
          <text
            x={pad}
            y={pad + 12}
            fill={COLORS.muted}
            fontSize={16}
            fontWeight={600}
            letterSpacing={2.5}
          >
            RISHI MOHAN
          </text>
          <text
            x={pad}
            y={pad + 110}
            fill={COLORS.text}
            fontSize={96}
            fontWeight={800}
            letterSpacing={-3}
          >
            {title}
          </text>
          <text
            x={pad}
            y={pad + 148}
            fill={COLORS.muted}
            fontSize={22}
            fontWeight={500}
          >
            {subtitle}
          </text>
          <Stat x={pad} y={318} size={66} {...hero} />
          {row.map((st, i) => (
            <Stat key={i} x={pad + i * 120} y={445} size={46} {...st} />
          ))}
          {facts.slice(0, 1).map((fact, i) => (
            <Fact key={i} x={pad} y={540} width={30} {...fact} />
          ))}
        </>
      )}

      <g>
        <circle
          cx={f.w - pad - (portrait ? 330 : 280)}
          cy={pad + (portrait ? 11 : 7)}
          r={6}
          fill={COLORS.flightA}
        />
        <text
          x={f.w - pad - (portrait ? 316 : 268)}
          y={pad + (portrait ? 18 : 12)}
          fill={COLORS.muted}
          fontSize={portrait ? 20 : 15}
          fontWeight={500}
        >
          Flights
        </text>
        <circle
          cx={f.w - pad - (portrait ? 222 : 196)}
          cy={pad + (portrait ? 11 : 7)}
          r={6}
          fill={COLORS.train}
        />
        <text
          x={f.w - pad - (portrait ? 208 : 184)}
          y={pad + (portrait ? 18 : 12)}
          fill={COLORS.muted}
          fontSize={portrait ? 20 : 15}
          fontWeight={500}
        >
          Trains
        </text>
        <text
          x={f.w - pad}
          y={pad + (portrait ? 18 : 12)}
          textAnchor="end"
          fill={COLORS.text}
          fontSize={portrait ? 20 : 15}
          fontWeight={600}
        >
          rishimohan.me
        </text>
      </g>
    </svg>
  );
});

export default TravelPoster;
