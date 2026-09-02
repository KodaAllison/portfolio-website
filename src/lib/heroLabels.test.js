import test from "node:test";
import assert from "node:assert/strict";
import { buildTrace, niceYTicks } from "./trace.js";
import {
  HERO_BASELINE,
  HERO_BOX,
  LABEL_FONT_SIZE,
  layoutHeroLabels,
} from "./heroLabels.js";

/* Hero labels are drawn, never measured: the SVG is server-rendered and there
   is no layout pass to push a label out of the way of its neighbour. Collisions
   are therefore a data bug, not a CSS bug — twice while this chart was being
   designed a change to the series slid one label under another. These tests are
   the tripwire for the third time.

   Two things make the rule checkable without a browser. Labels are JetBrains
   Mono, which is monospaced at exactly 0.6em, so a label's width is arithmetic
   on its character count. And layoutHeroLabels is the only source of label
   positions — HeroTrace renders what it returns and adds nothing — so measuring
   its output measures the chart. */

const ADVANCE = 0.6; // JetBrains Mono advance width, in ems
const MIN_GAP = 8; // px of clear air required between two boxes in a tier

// A label's ink box. `end`-anchored text runs leftward from its x and
// `start`-anchored text runs rightward, so the anchor decides which side of x
// the width is spent — get this backwards and two labels that overlap look
// like they clear each other by their combined width.
function box(label) {
  const width = Math.max(...label.lines.map((l) => l.text.length)) * LABEL_FONT_SIZE * ADVANCE;
  if (label.textAnchor === "end") return { left: label.x - width, right: label.x };
  if (label.textAnchor === "middle") return { left: label.x - width / 2, right: label.x + width / 2 };
  return { left: label.x, right: label.x + width };
}

// The rule, applied per tier: sort by left edge, and every box must start more
// than MIN_GAP after the previous one ends. Returns the offending pair rather
// than a boolean so a failure names the two labels that hit.
function firstOverlap(labels) {
  const tiers = new Set(labels.map((l) => l.tier));
  for (const tier of tiers) {
    const boxes = labels
      .filter((l) => l.tier === tier)
      .map((l) => ({ ...box(l), text: l.lines[0].text }))
      .sort((a, b) => a.left - b.left);
    for (let i = 1; i < boxes.length; i++) {
      if (boxes[i].left - boxes[i - 1].right <= MIN_GAP) {
        return { tier, a: boxes[i - 1], b: boxes[i] };
      }
    }
  }
  return null;
}

/* SYNTHETIC DATA — these are not Koda's Strava figures and must not be quoted
   as such. What matters is the shape: 31 months from 2024-02 to 2026-08, with
   2025-09 the series maximum and 2025-07 the minimum, which is what makes both
   hand-written milestones qualify for an annotation and puts a real label in
   each of the two tiers that exist today. The peak is the artboard's 130.6 km
   so the geometry under test is the geometry that ships. */
const KM = [
  42.0, 58.3, 61.7, 55.2, 70.4, 66.8, 49.1, 52.6, 74.3, 80.5, 63.9, 47.2, // 2024-02 .. 2025-01
  59.8, 71.6, 88.4, 76.9, 34.5, 9.5, 45.7, 130.6, 112.3, 98.6, 84.1, 90.7, // 2025-02 .. 2026-01
  77.5, 69.2, 95.4, 103.8, 88.9, 72.1, 66.4, // 2026-02 .. 2026-08
];

const SERIES = KM.map((km, i) => {
  const month = 1 + i; // 2024-02 is month index 1 of 2024
  return { month: `${2024 + Math.floor(month / 12)}-${String((month % 12) + 1).padStart(2, "0")}`, km };
});

const RACE_RECORDS = [
  { distance: "5K", time: "23:06", date: "2026-08-22", note: "Bellahouston 10k" },
  { distance: "10K", time: "48:55", date: "2026-08-22", note: "Bellahouston 10k" },
  { distance: "Half", time: "1:55:06", date: "2025-11-16", note: "Alton Towers Half" },
  { distance: "Marathon", time: "4:11:11", date: "2025-03-16", note: "Barcelona Marathon" },
];

function layout(series = SERIES, records = []) {
  const peak = series.reduce((a, b) => (b.km > a.km ? b : a));
  const ticks = niceYTicks(peak.km);
  const { pts } = buildTrace(series, { ...HERO_BOX, yMax: ticks[ticks.length - 1] });
  return layoutHeroLabels({ pts, peak, records });
}

const synthetic = (tier, x, textAnchor, ...texts) => ({
  tier,
  x,
  textAnchor,
  lines: texts.map((text) => ({ text, y: 0 })),
});

test("the fixture is the series the rest of these tests assume", () => {
  assert.equal(SERIES.length, 31);
  assert.equal(SERIES[0].month, "2024-02");
  assert.equal(SERIES.at(-1).month, "2026-08");
  const sorted = [...SERIES].sort((a, b) => a.km - b.km);
  assert.equal(sorted.at(-1).month, "2025-09"); // the peak milestone
  assert.equal(sorted[0].month, "2025-07"); // the trough milestone
});

test("both milestones qualify, one per tier", () => {
  const labels = layout();
  assert.deepEqual(
    labels.map((l) => [l.month, l.tier]),
    [
      ["2025-07", "below"],
      ["2025-09", "above"],
    ]
  );
  // The peak carries its superlative on a second line; the trough does not.
  assert.equal(labels.find((l) => l.month === "2025-09").lines.length, 2);
  const graduation = labels.find((l) => l.month === "2025-07");
  assert.equal(graduation.lines.length, 1);
  assert.equal(graduation.lines[0].text, "jul 2025 · graduated, first class");
});

test("race PBs use blue trace markers without duplicating an event split", () => {
  // The component passes the latest 24 months into the label layout. Using the
  // same window here keeps the collision geometry identical to the hero.
  const races = layout(SERIES.slice(-24), RACE_RECORDS).filter((label) => label.kind === "race");

  assert.deepEqual(
    races.map((label) => [label.month, label.lines[0].text]),
    [
      ["2025-03", "barcelona marathon · 4:11:11 pb"],
      ["2025-11", "alton towers half · 1:55:06 pb"],
      ["2026-08", "bellahouston 10k · 48:55 pb"],
    ],
  );
  assert.ok(races.every((label) => label.color === "var(--race)"));
  assert.ok(races.every((label) => label.tier === "race"));
  assert.ok(races.every((label) => label.marker.shape === "diamond"));
  assert.ok(races.every((label) => label.marker.y === label.point.y));
  assert.ok(races.every((label) => label.leader === null));
  assert.equal(firstOverlap(races), null);
});

test("no two labels overlap within a tier", () => {
  const hit = firstOverlap(layout(SERIES.slice(-24), RACE_RECORDS));
  assert.equal(hit, null, hit && `${hit.tier}: "${hit.a.text}" collides with "${hit.b.text}"`);
});

test("no label is drawn inside the plot band", () => {
  // The invariant that actually protects the trace. Measured on the ink, not
  // the baseline: a label clears the band only if its ascenders and descenders
  // clear it too.
  for (const { month, lines } of layout(SERIES.slice(-24), RACE_RECORDS)) {
    for (const { text, y } of lines) {
      const top = y - LABEL_FONT_SIZE;
      const bottom = y + LABEL_FONT_SIZE * 0.3;
      assert.ok(
        bottom < HERO_BOX.padTop || top > HERO_BASELINE,
        `${month} label "${text}" sits in the plot band at y=${y}`
      );
    }
  }
});

test("no label runs off the artboard", () => {
  for (const label of layout(SERIES.slice(-24), RACE_RECORDS)) {
    const { left, right } = box(label);
    assert.ok(left >= 0, `"${label.lines[0].text}" starts at ${left}`);
    assert.ok(right <= HERO_BOX.w, `"${label.lines[0].text}" ends at ${right}`);
  }
});

/* The real labels clear today, so they would also pass if the checker were
   broken. These build collisions by hand to prove it is not. */

test("the checker rejects two labels that collide in one tier", () => {
  const hit = firstOverlap([
    synthetic("above", 100, "start", "0123456789"), // 66px wide: 100 -> 166
    synthetic("above", 170, "start", "0123456789"), // starts 4px later
  ]);
  assert.ok(hit, "a 4px gap should have been reported as a collision");
  assert.equal(hit.tier, "above");
});

test("MIN_GAP is a floor, not a target", () => {
  const pair = (x) => [synthetic("axis", 100, "start", "0123456789"), synthetic("axis", x, "start", "x")];
  assert.ok(firstOverlap(pair(174)), "exactly 8px of clearance is not enough");
  assert.equal(firstOverlap(pair(174.5)), null);
});

test("box edges follow the anchor, not the x", () => {
  // These two would look 40px apart if `end` were measured rightward. It is
  // not: the first runs leftward from 600 and the second rightward from 560,
  // so they share 40px of the same line.
  const hit = firstOverlap([
    synthetic("below", 600, "end", "0123456789"), // 534 -> 600
    synthetic("below", 560, "start", "0123456789"), // 560 -> 626
  ]);
  assert.ok(hit, "an end-anchored box must extend left of its x");
});

test("tiers are checked independently", () => {
  // The same two boxes, one per band: on different lines they cannot collide.
  assert.equal(
    firstOverlap([
      synthetic("above", 100, "start", "0123456789"),
      synthetic("below", 170, "start", "0123456789"),
    ]),
    null
  );
});

test("a multi-line label is as wide as its longest line", () => {
  const wide = synthetic("above", 0, "start", "ab", "0123456789");
  assert.equal(box(wide).right, 10 * LABEL_FONT_SIZE * ADVANCE);
});

/* Tiers are fixed bands, and this is the test that keeps them that way.

   They were briefly offsets from the annotated point, which coupled the
   label's height to the ratio of its km to the nice-tick yMax and let it walk
   out of the viewBox entirely. Both directions were reachable with ordinary
   data rather than contrived data: a peak landing exactly on a tick (100 km
   against yMax 100) put the top line at y=-12, and the below tier was already
   clipping descenders at the real 9.5 km trough, with a 0 km month — which the
   Worker emits explicitly rather than omitting — putting it at y=310.

   So the assertion is about the viewBox, not about neighbours: whatever the
   data does, every line stays inside it. */
const VIEW_H = 306;

function seriesWith(peakKm, troughKm) {
  const out = [];
  for (let i = 0; i < 31; i++) {
    const m = 1 + i;
    const year = 2024 + Math.floor(m / 12);
    const month = (m % 12) + 1;
    out.push({ month: `${year}-${String(month).padStart(2, "0")}`, km: 20 + (i % 5), runs: 3 });
  }
  // The two months layoutHeroLabels knows about.
  out.find((d) => d.month === "2025-09").km = peakKm;
  out.find((d) => d.month === "2025-07").km = troughKm;
  return out;
}

function labelsFor(peakKm, troughKm) {
  const series = seriesWith(peakKm, troughKm);
  const peakDatum = series.reduce((a, b) => (b.km > a.km ? b : a));
  const ticks = niceYTicks(peakDatum.km);
  const { pts } = buildTrace(series, { ...HERO_BOX, yMax: ticks[ticks.length - 1] });
  return layoutHeroLabels({ pts, peak: pts.find((p) => p.month === peakDatum.month) });
}

test("no label escapes the viewBox, whatever the data does", () => {
  // [peak, trough] — the middle two are the cases that used to clip.
  for (const [peak, trough] of [
    [130.6, 9.5], // today
    [100, 9.5], // peak exactly on a tick: top line was y=-12
    [100, 0], // a zero month: bottom line was y=310
    [11, 0], // a very quiet year
    [75, 2.6],
  ]) {
    for (const label of labelsFor(peak, trough)) {
      for (const { y } of label.lines) {
        assert.ok(
          y >= 12 && y <= VIEW_H - 6,
          `peak=${peak} trough=${trough}: line at y=${y} is outside the viewBox`
        );
      }
    }
  }
});

test("a tier's band does not move when the data does", () => {
  const a = labelsFor(130.6, 9.5);
  const b = labelsFor(100, 0);
  for (const tier of ["above", "below"]) {
    const first = (ls) => ls.find((l) => l.tier === tier)?.lines[0].y;
    assert.equal(first(a), first(b), `${tier} tier moved with the data`);
  }
});
