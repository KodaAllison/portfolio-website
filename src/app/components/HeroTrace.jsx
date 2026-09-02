import { buildTrace, niceYTicks } from "../../lib/trace";

/* The hero chart: 31-ish months of running distance, drawn from the Strava
   Worker's monthly_km series.

   Deliberately a server component with no "use client". The draw-on is
   stroke-dashoffset, the annotation stagger is animation-delay and the endpoint
   is a static dot — none of that needs JavaScript, and keeping it out means the
   trace ships inside the HTML: no layout shift, no flash of an empty hero, and
   it still renders with JS disabled. It is also almost certainly part of the
   LCP, so it must not wait on a bundle. */

// The plot box, in the artboard's own coordinate space. These are not taste:
// solving the artboard's plotted points (130.6 km at y=69.4, 9.5 km at y=248.4)
// against yMax=150 gives innerH=221.72 and padTop=40.72, which puts the zero
// line at y=262.44 — the artboard's axis rule sits at 262.
const W = 1296;
const PAD_TOP = 40.72;
const INNER_H = 221.72;
const BASELINE = PAD_TOP + INNER_H;
const VIEW_H = 300; // room for the below-axis label tier

// Milestones are a fixed, hand-written list because a career event genuinely is
// editorial — but only the *text* is written here. Every position, every
// number, and the superlative itself come from the series at render time.
//
// `tier` is the horizontal band the label hangs in. Nothing is ever placed on
// the trace itself: labels go above the plot, just under the axis, or below
// that. Label collision happened twice while designing this chart.
const MILESTONES = [
  { month: "2025-07", tier: "below", text: "graduated, first class" },
  { month: "2025-09", tier: "above", text: "started at virgin money" },
];

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// "2025-09" -> "sep 2025". Kept local and total: the series is the only source
// of month strings, and it is always YYYY-MM.
function monthLabel(month) {
  const [y, m] = month.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

const fmtKm = (km) => `${km.toFixed(1)} km`;

/* A milestone earns an annotation only if its height on the curve carries
   meaning. A career date has no y-value of its own, so any height we give it is
   invented — unless the series independently puts that month at an extreme.
   Two qualify today: the all-time peak, and a trough at 30th of 31 months.

   Anything that lands mid-range is decoration, and belongs in the timeline
   further down the page, where dates do not need heights. */
function qualifies(point, sorted) {
  const n = sorted.length;
  if (n === 0) return false;
  if (point.km === sorted[n - 1].km) return true; // the peak
  const troughBand = Math.max(2, Math.ceil(n * 0.1));
  return sorted.indexOf(point) < troughBand;
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

  const { d, pts, at } = buildTrace(series, { w: W, padTop: PAD_TOP, innerH: INNER_H, yMax });

  const sorted = [...pts].sort((a, b) => a.km - b.km);
  const last = pts[pts.length - 1];

  const annotations = MILESTONES.map((m) => ({ ...m, pt: at(m.month) }))
    .filter(({ pt }) => pt && qualifies(pt, sorted))
    .map((m) => {
      /* The superlative is attached only while it actually holds. Hardcoding
         "the biggest month in the log" would mean that on the day it stops
         being true, the site starts lying — which on a page whose whole claim
         is that every number is fetched, not typed, is the worst bug available. */
      const isPeak = m.pt.month === peak.month;
      return {
        ...m,
        lines: isPeak
          ? [`${monthLabel(m.month)} · ${m.text}`, `${fmtKm(m.pt.km)} — the biggest month in the log`]
          : [`${monthLabel(m.month)} · ${m.text} · ${fmtKm(m.pt.km)}`],
      };
    });

  return (
    <svg
      viewBox={`0 0 ${W} ${VIEW_H}`}
      className="block w-full"
      role="img"
      aria-label={`Monthly running distance, ${monthLabel(series[0].month)} to ${monthLabel(
        last.month
      )}. Highest month ${monthLabel(peak.month)} at ${fmtKm(peak.km)}.`}
    >
      <text x="0" y="14" className="fill-ink-muted font-mono" fontSize="10" letterSpacing="1.4">
        MONTHLY KM · {series.length} MONTHS · STRAVA
      </text>

      <line x1="0" y1={BASELINE} x2={W} y2={BASELINE} stroke="var(--border)" strokeWidth="1" />

      {/* pathLength normalises the dash units to 1, so the draw-on keyframe is
          correct regardless of how long the real path turns out to be. */}
      <path
        className="hero-trace-line"
        d={d}
        pathLength="1"
        fill="none"
        stroke="var(--text-primary)"
        strokeOpacity="0.92"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {annotations.map(({ month, tier, lines, pt }) => {
        const above = tier === "above";
        // The leader runs from just off the curve out to its tier, so the label
        // never sits on the line it is annotating.
        const y1 = above ? pt.y - 6 : pt.y + 6;
        const y2 = above ? pt.y - 31 : pt.y + 36;
        const textY = above ? y2 - 22 : y2 + 12;
        return (
          <g key={month} className="hero-marker" style={{ animationDelay: above ? "1.9s" : "1.5s" }}>
            <line x1={pt.x} y1={y1} x2={pt.x} y2={y2} stroke="var(--accent)" strokeWidth="1" />
            <circle cx={pt.x} cy={pt.y} r="3.8" fill="var(--accent)" />
            {lines.map((line, i) => (
              <text
                key={line}
                x={above ? pt.x + 9 : pt.x - 9}
                y={textY + i * 15}
                textAnchor={above ? "start" : "end"}
                className="fill-accent font-mono"
                fontSize="11"
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}

      <text x="0" y={BASELINE + 12} className="fill-ink-muted font-mono" fontSize="10">
        {monthLabel(series[0].month).toUpperCase()}
      </text>
      <text x={W} y={BASELINE + 12} textAnchor="end" className="fill-ink-muted font-mono" fontSize="10">
        {monthLabel(last.month).toUpperCase()}
      </text>

      {/* The trace's full stop: the artboard's 10px amber dot, which sits on
          the final point rather than in the headline. It arrives with the line
          and then holds — the one element allowed to draw the eye to "now". */}
      <circle
        className="hero-endpoint"
        cx={last.x}
        cy={last.y}
        r="5"
        fill="var(--accent)"
        style={{ animationDelay: "2.6s" }}
      />

      <text
        className="hero-marker fill-ink font-mono"
        style={{ animationDelay: "2.6s" }}
        x={W}
        y={last.y - 20}
        textAnchor="end"
        fontSize="11"
      >
        {monthLabel(last.month)} · {fmtKm(last.km)}
      </text>
    </svg>
  );
}
