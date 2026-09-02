import { buildTrace, niceYTicks } from "../../lib/trace";
import {
  HERO_BOX,
  HERO_BASELINE,
  HERO_BOX_COMPACT,
  HERO_COMPACT_VIEW_H,
  HERO_COMPACT_BASELINE,
  LABEL_FONT_SIZE,
  fmtKm,
  layoutHeroLabels,
  monthLabel,
} from "../../lib/heroLabels";

/* The hero chart: 31-ish months of running distance, drawn from the Strava
   Worker's monthly_km series.

   Deliberately a server component with no "use client". The draw-on is
   stroke-dashoffset, the annotation stagger is animation-delay and the endpoint
   is a CSS-timed dot — none of that needs JavaScript, and keeping it out means the
   trace ships inside the HTML: no layout shift, no flash of an empty hero, and
   it still renders with JS disabled. It is also almost certainly part of the
   LCP, so it must not wait on a bundle. */

// The plot box and every label position live in lib/heroLabels, so the rule
// that no two labels overlap can be tested against the same numbers that
// render here rather than against a copy of them.
const { w: W } = HERO_BOX;
const VIEW_H = 306; // matches the artboard; the below tier baselines at 296.4

function TraceLine({ d }) {
  const stroke = {
    d,
    fill: "none",
    stroke: "var(--text-primary)",
    strokeOpacity: "0.92",
    strokeWidth: "2",
    vectorEffect: "non-scaling-stroke",
    strokeLinejoin: "round",
    strokeLinecap: "round",
  };

  return (
    <>
      {/* Chromium can leave the tail of a pathLength-normalised dash unpainted
          even at dashoffset 0. This undashed layer takes over once the draw
          finishes, so the persistent line always reaches its endpoint. */}
      <path className="hero-trace-final" {...stroke} />
      <path className="hero-trace-line" pathLength="1" {...stroke} />
    </>
  );
}

/* The phone chart: the line, its full stop, and nothing else.

   Rendered alongside the full chart rather than instead of it, with CSS
   choosing between them. The component is server-rendered and cannot know the
   viewport, and the two charts have genuinely different geometry — a media
   query cannot reshape a viewBox. Both carry the same aria-label, and since the
   hidden one is display:none it is ignored by assistive tech, so exactly one is
   ever exposed. */
function CompactTrace({ series, yMax, label }) {
  const { d, pts } = buildTrace(series, { ...HERO_BOX_COMPACT, yMax });
  const last = pts[pts.length - 1];

  return (
    <svg
      viewBox={`0 0 ${HERO_BOX_COMPACT.w} ${HERO_COMPACT_VIEW_H}`}
      className="block w-full md:hidden"
      role="img"
      aria-label={label}
    >
      <line
        x1="0"
        y1={HERO_COMPACT_BASELINE}
        x2={HERO_BOX_COMPACT.w}
        y2={HERO_COMPACT_BASELINE}
        stroke="var(--border)"
        strokeWidth="1"
      />
      <TraceLine d={d} />
      <circle className="hero-pulse" cx={last.x} cy={last.y} r="4.5" fill="none" stroke="var(--accent)" aria-hidden="true" />
      <circle
        className="hero-endpoint"
        cx={last.x}
        cy={last.y}
        r="4.5"
        fill="var(--accent)"
      />
    </svg>
  );
}

export default function HeroTrace({ series }) {
  /* No data, no chart. The design sheet is explicit that a module which cannot
     get its data does not render: no placeholder value, no zero it did not
     measure, no empty frame, no error text. The hero is the one structural
     exception that needs a degraded state at all, and its degraded state is
     simply absence — the headline rises to fill the space. */
  if (!Array.isArray(series) || series.length === 0) return null;

  const peak = series.reduce((a, b) => (b.km > a.km ? b : a));

  // yMax comes from the same nice-tick logic WeeklyLine uses rather than a
  // constant, so an unusually big month cannot clip off the top of the chart.
  const ticks = niceYTicks(peak.km);
  const yMax = ticks[ticks.length - 1];

  const { d, pts } = buildTrace(series, { ...HERO_BOX, yMax });

  const last = pts[pts.length - 1];
  const labels = layoutHeroLabels({ pts, peak });

  const label = `Monthly running distance, ${monthLabel(series[0].month)} to ${monthLabel(
    last.month
  )}. Highest month ${monthLabel(peak.month)} at ${fmtKm(peak.km)}.`;

  return (
    <>
      <CompactTrace series={series} yMax={yMax} label={label} />
    <svg
      viewBox={`0 0 ${W} ${VIEW_H}`}
      className="hero-chart hidden w-full md:block"
      role="img"
      aria-label={label}
    >
      <text x="0" y="14" className="fill-ink-muted font-mono" fontSize="10" letterSpacing="1.4">
        MONTHLY KM · {series.length} MONTHS · STRAVA
      </text>

      <line
        x1="0"
        y1={HERO_BASELINE}
        x2={W}
        y2={HERO_BASELINE}
        stroke="var(--border)"
        strokeWidth="1"
      />

      {/* pathLength normalises the dash units to 1, so the draw-on keyframe is
          correct regardless of how long the real path turns out to be. */}
      <TraceLine d={d} />

      {labels.map(({ month, tier, x, textAnchor, lines, point, leader }) => (
        <g
          key={month}
          className="hero-marker"
          style={{ animationDelay: tier === "above" ? "1.9s" : "1.5s" }}
        >
          <line
            x1={leader.x}
            y1={leader.y1}
            x2={leader.x}
            y2={leader.y2}
            stroke="var(--accent)"
            strokeWidth="1"
          />
          <circle cx={point.x} cy={point.y} r="3.8" fill="var(--accent)" />
          {lines.map(({ text, y }) => (
            <text
              key={text}
              x={x}
              y={y}
              textAnchor={textAnchor}
              className="fill-accent font-mono"
              fontSize={LABEL_FONT_SIZE}
            >
              {text}
            </text>
          ))}
        </g>
      ))}

      <text x="0" y={HERO_BASELINE + 12} className="fill-ink-muted font-mono" fontSize="10">
        {monthLabel(series[0].month).toUpperCase()}
      </text>
      <text
        x={W}
        y={HERO_BASELINE + 12}
        textAnchor="end"
        className="fill-ink-muted font-mono"
        fontSize="10"
      >
        {monthLabel(last.month).toUpperCase()}
      </text>

      {/* The trace's full stop: the artboard's 10px amber dot, which sits on
          the final point rather than in the headline. It arrives just after
          the line settles and then holds — the one element allowed to draw
          the eye to "now". */}
      {/* The artboard pulses this with an expanding box-shadow ring, which does
          not apply to SVG shapes — so the ring is a real concentric circle that
          animates its radius instead. It is the only looping animation in the
          design, and it starts only after the line has finished drawing. */}
      <circle
        className="hero-pulse"
        cx={last.x}
        cy={last.y}
        r="5"
        fill="none"
        stroke="var(--accent)"
        aria-hidden="true"
      />
      <circle
        className="hero-endpoint"
        cx={last.x}
        cy={last.y}
        r="5"
        fill="var(--accent)"
      />

      <text
        className="hero-current-label hero-marker fill-ink font-mono"
        x={W}
        y={last.y - 20}
        textAnchor="end"
        fontSize="11"
      >
        {monthLabel(last.month)} · {fmtKm(last.km)}
      </text>
    </svg>
    </>
  );
}
