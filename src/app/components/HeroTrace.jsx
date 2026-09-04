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

/* The hero chart: the latest two years of running distance, drawn from the
   Strava Worker's monthly_km series.

   Deliberately a server component with no "use client". An animated clip reveals
   the line, the annotation stagger is animation-delay and the endpoint is a
   CSS-timed dot — none of that needs JavaScript, and keeping it out means the
   trace ships inside the HTML with no layout shift. It is also almost certainly
   part of the LCP, so it must not wait on a bundle. */

// The plot box and every label position live in lib/heroLabels, so the rule
// that no two labels overlap can be tested against the same numbers that
// render here rather than against a copy of them.
const { w: W } = HERO_BOX;
const VIEW_H = 306; // matches the artboard; the below tier baselines at 296.4
const HERO_MONTHS = 24;

function TraceLine({ d, clipId, width, height }) {
  return (
    <>
      <defs>
        <clipPath id={clipId}>
          {/* The SVG transform attribute hides the trace before CSS arrives.
              CSS owns the animated transform once the stylesheet is ready. */}
          <rect
            className="hero-trace-reveal"
            width={width}
            height={height}
            transform="scale(0 1)"
          />
        </clipPath>
      </defs>
      <path
        className="hero-trace-line"
        d={d}
        clipPath={`url(#${clipId})`}
        fill="none"
        stroke="var(--text-primary)"
        strokeOpacity="0.92"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </>
  );
}

/* The phone chart: a compact running log rather than an unexplained squiggle.

   Rendered alongside the full chart rather than instead of it, with CSS
   choosing between them. The component is server-rendered and cannot know the
   viewport, and the two charts have genuinely different geometry — a media
   query cannot reshape a viewBox. The visible caption gives the trace its
   measure, timeframe and source; the axis labels then make its direction clear
   without importing the desktop chart's dense event annotations. */
function CompactTrace({ series, yMax, label }) {
  const { d, pts } = buildTrace(series, { ...HERO_BOX_COMPACT, yMax });
  const last = pts[pts.length - 1];

  return (
    <figure className="hero-compact-trace md:hidden">
      <figcaption className="flex items-end justify-between font-mono">
        <span>
          <span className="block text-[11px] text-ink">Monthly distance</span>
          <span className="mt-1 block text-[10px] text-ink-muted">
            {series.length} months · Strava
          </span>
        </span>
        <span className="text-right">
          <span className="block text-[12px] font-medium text-ink">{fmtKm(last.km)}</span>
          <span className="mt-1 block text-[10px] text-ink-muted">
            {monthLabel(last.month)}
          </span>
        </span>
      </figcaption>

      <svg
        viewBox={`0 0 ${HERO_BOX_COMPACT.w} ${HERO_COMPACT_VIEW_H}`}
        className="mt-3 block w-full"
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
        <TraceLine
          d={d}
          clipId="hero-trace-clip-compact"
          width={HERO_BOX_COMPACT.w}
          height={HERO_COMPACT_VIEW_H}
        />
        <circle
          className="hero-pulse"
          cx={last.x}
          cy={last.y}
          r="4.5"
          fill="none"
          stroke="var(--accent)"
          aria-hidden="true"
        />
        <circle
          className="hero-endpoint"
          cx={last.x}
          cy={last.y}
          r="4.5"
          fill="var(--accent)"
        />

        <text
          x="0"
          y={HERO_COMPACT_BASELINE + 16}
          className="fill-ink-muted font-mono"
          fontSize="9"
        >
          {monthLabel(series[0].month).toUpperCase()}
        </text>
        <text
          x={HERO_BOX_COMPACT.w}
          y={HERO_COMPACT_BASELINE + 16}
          textAnchor="end"
          className="fill-ink-muted font-mono"
          fontSize="9"
        >
          NOW
        </text>
      </svg>
    </figure>
  );
}

export default function HeroTrace({ series, records }) {
  /* No data, no chart. The design sheet is explicit that a module which cannot
     get its data does not render: no placeholder value, no zero it did not
     measure, no empty frame, no error text. The hero is the one structural
     exception that needs a degraded state at all, and its degraded state is
     simply absence — the headline rises to fill the space. */
  if (!Array.isArray(series) || series.length === 0) return null;

  const visibleSeries = series.slice(-HERO_MONTHS);
  const peak = visibleSeries.reduce((a, b) => (b.km > a.km ? b : a));

  // yMax comes from the same nice-tick logic WeeklyLine uses rather than a
  // constant, so an unusually big month cannot clip off the top of the chart.
  const ticks = niceYTicks(peak.km);
  const yMax = ticks[ticks.length - 1];

  const { d, pts } = buildTrace(visibleSeries, { ...HERO_BOX, yMax });

  const last = pts[pts.length - 1];
  const labels = layoutHeroLabels({ pts, records });
  const raceSummary = labels
    .filter(({ kind }) => kind === "race")
    .map(({ lines }) => lines[0].text)
    .join("; ");

  const chartSummary = `Monthly running distance, ${monthLabel(visibleSeries[0].month)} to ${monthLabel(
    last.month
  )}. Highest month ${monthLabel(peak.month)} at ${fmtKm(peak.km)}.`;
  const label = raceSummary ? `${chartSummary} Personal bests: ${raceSummary}.` : chartSummary;

  return (
    <>
      <CompactTrace series={visibleSeries} yMax={yMax} label={label} />
    <svg
      viewBox={`0 0 ${W} ${VIEW_H}`}
      className="hero-chart hidden w-full md:block"
      role="img"
      aria-label={label}
    >
      <text x="0" y="14" className="fill-ink-muted font-mono" fontSize="10" letterSpacing="1.4">
        MONTHLY KM · {visibleSeries.length} MONTHS · STRAVA
      </text>

      <line
        x1="0"
        y1={HERO_BASELINE}
        x2={W}
        y2={HERO_BASELINE}
        stroke="var(--border)"
        strokeWidth="1"
      />

      <TraceLine d={d} clipId="hero-trace-clip-wide" width={W} height={VIEW_H} />

      {labels.map(({ month, tier, kind, color, x, textAnchor, lines, marker, leader }) => (
        <g
          key={`${kind}-${month}`}
          className={`hero-marker hero-marker-${kind}`}
          style={{
            animationDelay:
              tier === "above"
                ? "1.9s"
                : tier === "below"
                  ? "1.5s"
                  : `${Math.round(900 + (marker.x / W) * 1900)}ms`,
          }}
        >
          {leader ? (
            <line
              x1={leader.x}
              y1={leader.y1}
              x2={leader.x}
              y2={leader.y2}
              stroke={color}
              strokeWidth="1"
            />
          ) : null}
          {marker.shape === "diamond" ? (
            <rect
              x={marker.x - 3}
              y={marker.y - 3}
              width="6"
              height="6"
              fill={color}
              transform={`rotate(45 ${marker.x} ${marker.y})`}
            />
          ) : (
            <circle cx={marker.x} cy={marker.y} r="3.8" fill={color} />
          )}
          {lines.map(({ text, y }) => (
            <text
              key={text}
              x={x}
              y={y}
              textAnchor={textAnchor}
              className="font-mono"
              fontSize={LABEL_FONT_SIZE}
              fill={color}
            >
              {text}
            </text>
          ))}
        </g>
      ))}

      <text x="0" y={HERO_BASELINE + 12} className="fill-ink-muted font-mono" fontSize="10">
        {monthLabel(visibleSeries[0].month).toUpperCase()}
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
