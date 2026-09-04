import test from "node:test";
import assert from "node:assert/strict";
import { buildTrace, niceYTicks } from "./trace.js";

// Hand-written stand-in for the Strava monthly series: oldest first, no gaps,
// zero months present. Small enough that every expected coordinate below can
// be worked out by hand.
const SERIES = [
  { month: "2024-01", km: 0, runs: 0 },
  { month: "2024-02", km: 20, runs: 4 },
  { month: "2024-03", km: 40, runs: 9 },
  { month: "2024-04", km: 15, runs: 3 },
];
const BOX = { w: 300, padTop: 10, innerH: 100, yMax: 40 };

// Every number in a path string, so tests can assert on coordinates rather
// than on the exact shape of the `d` grammar.
const coords = (d) => (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);

test("emits one moveto and n-1 curve segments", () => {
  const { d } = buildTrace(SERIES, BOX);
  assert.equal(d.match(/M/g).length, 1);
  assert.ok(d.startsWith("M "));
  assert.equal(d.match(/C/g).length, SERIES.length - 1);
});

test("no coordinate in the path is NaN", () => {
  const { d } = buildTrace(SERIES, BOX);
  assert.ok(!d.includes("NaN"), d);
  assert.ok(coords(d).every(Number.isFinite), d);
});

test("y maps km onto the plot box", () => {
  const { at } = buildTrace(SERIES, BOX);
  // peak month sits on the top edge, a zero month on the baseline
  assert.equal(at("2024-03").y, BOX.padTop);
  assert.equal(at("2024-01").y, BOX.padTop + BOX.innerH);
  // and a middling month lands proportionally between them
  assert.equal(at("2024-02").y, 60);
});

test("x spans the full width", () => {
  const { pts } = buildTrace(SERIES, BOX);
  assert.equal(pts.length, SERIES.length);
  assert.equal(pts[0].x, 0);
  assert.equal(pts.at(-1).x, BOX.w);
});

test("a horizontal plot inset keeps an animated endpoint halo inside the viewBox", () => {
  const box = { ...BOX, padX: 24 };
  const { pts } = buildTrace(SERIES, box);
  const endpointHalo = 20;

  assert.equal(pts[0].x, box.padX);
  assert.ok(pts.at(-1).x + endpointHalo <= box.w);
});

test("at() looks up a month and carries its source datum", () => {
  const { at } = buildTrace(SERIES, BOX);
  assert.equal(at("2024-04").runs, 3);
  assert.equal(at("2024-04").km, 15);
  assert.equal(at("2023-12"), undefined);
});

test("coordinates are rounded to 2dp", () => {
  // 7 points across 100px puts the spacing at 16.666… — full float precision
  // would otherwise reach the path string.
  const series = Array.from({ length: 7 }, (_, i) => ({
    month: `2024-0${i + 1}`,
    km: i * 3,
    runs: i,
  }));
  const { d } = buildTrace(series, { w: 100, padTop: 0, innerH: 70, yMax: 18 });
  const decimals = (n) => (String(n).split(".")[1] ?? "").length;
  assert.ok(coords(d).every((n) => decimals(n) <= 2), d);
  assert.ok(d.includes("16.67"), d);
});

test("empty series produces an empty path", () => {
  const { d, pts, at } = buildTrace([], BOX);
  assert.equal(d, "");
  assert.deepEqual(pts, []);
  assert.equal(at("2024-01"), undefined);
});

test("single-month series plots one point at x=0 with no curve", () => {
  const { d, pts } = buildTrace([{ month: "2024-01", km: 20, runs: 4 }], BOX);
  assert.equal(pts.length, 1);
  assert.equal(pts[0].x, 0); // not NaN from dividing by n-1
  assert.equal(pts[0].y, 60);
  assert.equal(d, "M 0 60");
  assert.ok(!d.includes("C"));
});

test("an all-zero series flatlines on the baseline instead of going NaN", () => {
  const series = SERIES.map((d) => ({ ...d, km: 0, runs: 0 }));
  const { d, pts } = buildTrace(series, { ...BOX, yMax: 0 });
  assert.ok(!d.includes("NaN"), d);
  assert.ok(pts.every((p) => p.y === BOX.padTop + BOX.innerH));
});

test("a non-finite km is treated as a zero month, not a lost path", () => {
  const series = SERIES.map((d, i) => (i === 1 ? { ...d, km: NaN } : d));
  const { d, at } = buildTrace(series, BOX);
  assert.ok(!d.includes("NaN"), d);
  assert.equal(at("2024-02").y, BOX.padTop + BOX.innerH);
});

test("niceYTicks returns at most 5 ticks ending on a round number", () => {
  assert.deepEqual(niceYTicks(0), [0]);
  assert.deepEqual(niceYTicks(1), [0, 5]);
  assert.deepEqual(niceYTicks(12.5), [0, 5, 10, 15]);
  assert.deepEqual(niceYTicks(20), [0, 5, 10, 15, 20]);
  assert.deepEqual(niceYTicks(21), [0, 10, 20, 30]);
  assert.deepEqual(niceYTicks(45), [0, 15, 30, 45]);
  assert.deepEqual(niceYTicks(100), [0, 25, 50, 75, 100]);
});

test("niceYTicks covers the peak up to 400km, then falls back", () => {
  for (let peak = 1; peak <= 400; peak++) {
    const ticks = niceYTicks(peak);
    assert.ok(ticks.at(-1) >= peak, `peak ${peak} → ${ticks}`);
    assert.ok(ticks.length <= 5, `peak ${peak} → ${ticks}`);
    assert.equal(ticks[0], 0);
  }
  // Documented rather than endorsed: past the last step the fallback returns
  // an axis that does not reach the peak, so the line would clip.
  assert.deepEqual(niceYTicks(401), [0, 50, 100]);
});
