// Shared chart geometry: pure functions, no DOM, no fetch. Both the homepage
// hero trace and WeeklyLine render from here so the two charts agree on where
// a given month sits — and so the maths is testable without a browser.

// Coordinates are rounded to 2dp before they reach the path string. The charts
// are a few hundred px wide, so 0.01px is well under a device pixel even at 3x
// DPR; what this actually buys is dropping 17-significant-digit floats
// ("241.93548387096774") out of the server-rendered HTML, which is most of the
// byte weight of a 31-point curve.
const round = (v) => Math.round(v * 100) / 100;

/**
 * Convert a monthly series into a Catmull-Rom curve (tension 0.5) emitted as
 * cubic beziers.
 *
 * `series` is oldest-first, one entry per calendar month with no gaps —
 * `{ month: "YYYY-MM", km, runs }`, zero months present as `km: 0`.
 *
 * Returns `{ d, pts, at }`: the path string, the plotted points (each carrying
 * its source datum), and a lookup by month.
 */
export function buildTrace(series, { w, padTop, innerH, yMax, padX = 0 }) {
  const n = series.length;

  // Nothing to plot. An empty `d` is a valid path that renders nothing, which
  // beats every alternative here — the caller can stay unconditional.
  if (n === 0) return { d: "", pts: [], at: () => undefined };

  // A single point has no span to divide by, and `(0 * w) / 0` is NaN — one
  // NaN anywhere in `d` makes the browser drop the entire path silently. Pin
  // it to the plot's left edge so a padded chart still has a valid point.
  const plotW = Math.max(0, w - padX * 2);
  const x = (i) => (n === 1 ? padX : round(padX + (i * plotW) / (n - 1)));

  // yMax comes from niceYTicks, which returns 0 only when every month is zero
  // (a fresh Strava account). Guarding here turns that into a flat line along
  // the baseline — truthful, and again not a path full of NaN.
  const y = (km) => round(padTop + innerH * (yMax > 0 ? 1 - km / yMax : 1));

  // Non-finite km would poison the path the same way; treat it as a zero month
  // rather than losing the whole trace to one bad upstream value.
  const pts = series.map((d, i) => ({
    ...d,
    x: x(i),
    y: y(Number.isFinite(d.km) ? d.km : 0),
  }));

  // Catmull-Rom through every point, converted to beziers. The endpoints
  // duplicate themselves as their own neighbours so the curve starts and ends
  // without an overshoot.
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i - 1] ?? pts[0];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? pts[n - 1];
    d +=
      ` C ${round(p1.x + (p2.x - p0.x) / 6)} ${round(p1.y + (p2.y - p0.y) / 6)}` +
      ` ${round(p2.x - (p3.x - p1.x) / 6)} ${round(p2.y - (p3.y - p1.y) / 6)}` +
      ` ${p2.x} ${p2.y}`;
  }

  return { d, pts, at: (month) => pts.find((p) => p.month === month) };
}

// Picks an axis that ends on a round number at or above `peak`, using at most
// four gridlines so the chart stays readable at hero size. The last tick is the
// yMax callers should plot against — hardcoding one instead lets an unusually
// big month clip off the top of the chart.
export function niceYTicks(peak) {
  for (const step of [5, 10, 15, 20, 25, 30, 50, 75, 100]) {
    const max = Math.ceil(peak / step) * step;
    if (max / step <= 4) {
      return Array.from({ length: max / step + 1 }, (_, i) => i * step);
    }
  }
  return [0, 50, 100];
}
