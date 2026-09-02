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

test("an undashed final trace replaces the draw layer before the endpoint appears", () => {
  const drawDuration = milliseconds(cssToken("--draw-hero"));
  const drawDelay = milliseconds(cssToken("--draw-hero-delay"));
  const finalTraceDelay = milliseconds(cssToken("--reveal-hero-trace"));
  const endpointDelay = milliseconds(cssToken("--reveal-hero-endpoint"));

  assert.match(component, /className="hero-trace-final"/);
  assert.ok(
    finalTraceDelay >= drawDuration + drawDelay,
    `final trace appears at ${finalTraceDelay}ms; draw finishes at ${drawDuration + drawDelay}ms`,
  );
  assert.ok(
    finalTraceDelay <= endpointDelay,
    `endpoint appears at ${endpointDelay}ms before the final trace at ${finalTraceDelay}ms`,
  );
});
