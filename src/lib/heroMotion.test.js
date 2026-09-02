import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const component = readFileSync(new URL("../app/components/HeroTrace.jsx", import.meta.url), "utf8");

function milliseconds(value) {
  if (value.endsWith("ms")) return Number.parseFloat(value);
  if (value.endsWith("s")) return Number.parseFloat(value) * 1000;
  throw new Error(`Unsupported animation time: ${value}`);
}

function cssToken(name) {
  return css.match(new RegExp(`${name}:\\s*([\\d.]+m?s)`))?.[1];
}

test("the trace uses a non-wrapping clip reveal with a hidden HTML fallback", () => {
  assert.match(component, /<clipPath id=\{clipId\}>/);
  assert.match(component, /className="hero-trace-reveal"/);
  assert.match(component, /transform="scale\(0 1\)"/);
  assert.match(component, /clipPath=\{`url\(#\$\{clipId\}\)`\}/);
  assert.doesNotMatch(component, /pathLength=/);
  assert.doesNotMatch(css, /stroke-dasharray|stroke-dashoffset/);
});

test("the hero intentionally limits the Strava history to two years", () => {
  assert.match(component, /const HERO_MONTHS = 24/);
  assert.match(component, /const visibleSeries = series\.slice\(-HERO_MONTHS\)/);
  assert.match(component, /MONTHLY KM · \{visibleSeries\.length\} MONTHS · STRAVA/);
});

test("the current-point reveal cannot start before the trace finishes drawing", () => {
  const drawDuration = milliseconds(cssToken("--draw-hero"));
  const drawDelay = milliseconds(
    cssToken("--draw-hero-delay")
      ?? css.match(/\.hero-trace-line\s*\{[\s\S]*?animation:[^;]*?([\d.]+m?s)\s+forwards/)?.[1],
  );
  const revealDelay = milliseconds(
    cssToken("--reveal-hero-endpoint")
      ?? component.match(/className="hero-endpoint"[\s\S]*?animationDelay:\s*"([\d.]+m?s)"/)?.[1],
  );

  assert.ok(
    revealDelay >= drawDuration + drawDelay,
    `endpoint starts at ${revealDelay}ms; trace finishes at ${drawDuration + drawDelay}ms`,
  );
});

test("one clipped trace stays visible when the draw finishes", () => {
  const drawDuration = milliseconds(cssToken("--draw-hero"));
  const drawDelay = milliseconds(cssToken("--draw-hero-delay"));
  const endpointDelay = milliseconds(cssToken("--reveal-hero-endpoint"));

  assert.doesNotMatch(component, /hero-trace-final/);
  assert.match(css, /@keyframes hero-draw\s*\{[\s\S]*?to\s*\{[\s\S]*?transform:\s*scaleX\(1\)/);
  assert.ok(
    drawDuration + drawDelay <= endpointDelay,
    `endpoint appears at ${endpointDelay}ms before the clipped trace finishes at ${drawDuration + drawDelay}ms`,
  );
});
