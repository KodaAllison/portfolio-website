import { monthLabel } from "./date.js";
// Where each hero annotation's text lands, and what it says.
//
// This is separate from HeroTrace.jsx so the placement rules can be tested
// without a DOM: the component renders exactly what layoutHeroLabels returns,
// so a test against this function is a test against the chart. Every hero
// label is JetBrains Mono at a fixed size, which makes a label's width
// arithmetic (0.6em per character) rather than a measurement — that is what
// makes the no-overlap rule cheap enough to assert on every run.

// The plot box, in the artboard's own coordinate space. These are not taste:
// solving the artboard's plotted points (130.6 km at y=69.4, 9.5 km at y=248.4)
// against yMax=150 gives innerH=221.72 and padTop=40.72, which puts the zero
// line at y=262.44 — the artboard's axis rule sits at 262. The 24px horizontal
// inset contains the 5px endpoint when its pulse expands to 3.8x.
export const HERO_BOX = { w: 1296, padX: 24, padTop: 40.72, innerH: 221.72 };
export const HERO_BASELINE = HERO_BOX.padTop + HERO_BOX.innerH;

// Exported because the width of a label is a function of this: change the font
// size here and the collision test re-measures every label with it.
export const LABEL_FONT_SIZE = 11;
const LINE_HEIGHT = 15;

// Milestones are a fixed, hand-written list because a career event genuinely is
// editorial — but only the *text* is written here. Every position, every
// number, and the superlative itself come from the series at render time.
const MILESTONES = [
  { month: "2025-07", tier: "below", text: "graduated, first class" },
  { month: "2025-09", tier: "above", text: "started at virgin money" },
];

// A 5K split can be the fastest five kilometres inside a 10K event. Rendering
// both records would make one race look like two, so the hero keeps the three
// event distances the user recognises as separate PBs.
const HERO_RACE_DISTANCES = new Set(["10K", "Half", "Marathon"]);

/* A tier is the horizontal band a label hangs in, reached by a leader line off
   the point. No text is placed on the trace itself: labels go above the plot,
   just under the axis rule, or below that. Label collision happened twice while
   this chart was being designed — and a label sitting on the curve it annotates
   is the same failure with a different neighbour.

   Offsets are signed distances from the annotated point: where the leader
   starts and ends, where the first text baseline sits past the leader, and
   which side of the point the text runs off towards.

   The `race` tier is intentionally local: its blue diamond sits on the trace
   at the event month and the matching text tucks just above it. Keeping marker
   and label together removes the need for either a legend or a connector. */
/* A tier is a FIXED horizontal band, and the leader stretches to reach it.

   These were originally offsets from the annotated point, which is subtly
   wrong: the point's height depends on the ratio of its km to the nice-tick
   yMax, so the label moved with the data and could walk straight out of the
   viewBox. Both ends were reachable, not theoretical — a peak that lands
   exactly on a tick (100 km against yMax 100) put the top line at y=-12, and
   the below tier was already clipping its descenders at today's 9.5 km trough,
   with a 0 km month — which the series emits explicitly — landing at y=310.

   Fixed bands make that impossible by construction, and they are what the
   design means by a tier: the label sits in its band, the leader does the
   work of connecting it to whatever height the point happens to be at.

   `textY` is the baseline of the label's first line; `leaderPad` is where the
   leader stops relative to the label so it does not run through the text. */
const TIERS = {
  above: { textY: 16.4, dx: 9, textAnchor: "start", leaderGap: -6, leaderPad: 7 },
  below: { textY: 296.4, dx: -9, textAnchor: "end", leaderGap: 6, leaderPad: -12 },
  race: { dy: -12, dx: 9 },
};


// "2025-09" -> "sep 2025". Kept local and total: the series is the only source
// of month strings, and it is always YYYY-MM.

export const fmtKm = (km) => `${km.toFixed(1)} km`;

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

/**
 * Resolve the milestone list against plotted points into ready-to-draw labels.
 *
 * `pts` is what buildTrace returned — each point carries its month, km and
 * plotted x/y. `peak` is the series maximum, passed in because the caller has
 * already had to find it to pick the y axis.
 *
 * Returns one entry per qualifying milestone: `{ month, tier, x, textAnchor,
 * lines, point, leader }`, where `lines` is `{ text, y }` per rendered line and
 * `x`/`textAnchor` together fix the label's horizontal extent. The caller adds
 * nothing to these numbers — everything a collision could come from is here.
 */
export function layoutHeroLabels({ pts, peak, records = [] }) {
  if (!Array.isArray(pts) || pts.length === 0) return [];

  const sorted = [...pts].sort((a, b) => a.km - b.km);
  const top = peak ?? sorted[sorted.length - 1];

  const milestones = MILESTONES.map((m) => ({ ...m, point: pts.find((p) => p.month === m.month) }))
    .filter(({ point, tier }) => point && TIERS[tier] && qualifies(point, sorted))
    .map(({ month, tier, text, point }) => {
      const t = TIERS[tier];

      /* The superlative is attached only while it actually holds. Hardcoding
         "the biggest month in the log" would mean that on the day it stops
         being true, the site starts lying — which on a page whose whole claim
         is that every number is fetched, not typed, is the worst bug available. */
      const texts =
        point.month === top.month
          ? [`${monthLabel(month)} · ${text}`, `${fmtKm(point.km)} — the biggest month in the log`]
          : [`${monthLabel(month)} · ${text}`];

      const lines = texts.map((line, i) => ({ text: line, y: t.textY + i * LINE_HEIGHT }));

      // The leader spans from just off the curve to just short of the label's
      // nearest edge — for `above` that is below the last line, for `below` it
      // is above the first one.
      const nearestLineY = t.leaderPad > 0 ? lines[lines.length - 1].y : lines[0].y;

      return {
        month,
        tier,
        kind: "milestone",
        color: "var(--accent)",
        point,
        marker: { x: point.x, y: point.y, shape: "circle" },
        textAnchor: t.textAnchor,
        x: point.x + t.dx,
        // The leader runs from just off the curve out to the tier, so the label
        // never sits on the line it is annotating.
        leader: { x: point.x, y1: point.y + t.leaderGap, y2: nearestLineY + t.leaderPad },
        lines,
      };
    });

  const races = (Array.isArray(records) ? records : [])
    .filter(
      ({ distance, time, date, note }) =>
        HERO_RACE_DISTANCES.has(distance)
        && typeof time === "string"
        && typeof date === "string"
        && /^\d{4}-\d{2}-\d{2}$/.test(date)
        && typeof note === "string"
        && note.trim().length > 0,
    )
    .map((record) => ({
      record,
      month: record.date.slice(0, 7),
      point: pts.find((point) => point.month === record.date.slice(0, 7)),
    }))
    .filter(({ point }) => point)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(({ month, point, record }) => {
      const t = TIERS.race;
      const text = `${record.note.trim().toLowerCase()} · ${record.time} pb`;
      const width = text.length * LABEL_FONT_SIZE * 0.6;
      const runsOffRight = point.x + t.dx + width > HERO_BOX.w;
      const textAnchor = runsOffRight ? "end" : "start";
      const x = point.x + (runsOffRight ? -t.dx : t.dx);

      return {
        month,
        tier: "race",
        kind: "race",
        color: "var(--race)",
        point,
        marker: { x: point.x, y: point.y, shape: "diamond" },
        textAnchor,
        x,
        leader: null,
        lines: [{ text, y: point.y + t.dy }],
      };
    });

  return [...milestones, ...races];
}

export { monthLabel };

/* The mobile chart is a different chart, not this one scaled down.

   An SVG scales with its viewBox, so reusing the desktop box at 390px would
   reduce it 3.7x and render its 11px annotations at about 3px. The mobile
   artboard does not attempt that: it has its own box at 1:1 with no labels in
   it at all, because on a phone the trace is decorative and the numbers belong
   in the copy beneath it.

   Solved from that artboard the same way the desktop box was — its plotted
   peak sits at y=40.1 and its axis rule at y=144, which against yMax=150 gives
   innerH=119.33 and padTop=24.67. The 196 tall viewBox is what fixes the
   chart's aspect ratio, and so its rendered height, at any width. */
export const HERO_BOX_COMPACT = { w: 346, padX: 24, padTop: 24.67, innerH: 119.33 };
export const HERO_COMPACT_VIEW_H = 196;
export const HERO_COMPACT_BASELINE = HERO_BOX_COMPACT.padTop + HERO_BOX_COMPACT.innerH;
