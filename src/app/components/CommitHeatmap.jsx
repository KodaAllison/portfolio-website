"use client";
import React, { useMemo } from "react";

/**
 * <CommitHeatmap>
 * Square-tile activity grid (GitHub/Strava style).
 *
 * Props:
 *   data       — optional array of intensity values 0..4 (length should equal columns*rows). If omitted, a deterministic seeded pattern is generated.
 *   columns    — grid columns (default 8)
 *   rows       — grid rows (default 6) — only used when generating a default pattern
 *   seed       — seed for deterministic placeholder generation (default 42)
 *   showLegend — render the "Less / [tiles] / More" legend below (default true)
 *   className  — outer class overrides
 *
 * Intensity → color (matches the Stitch design):
 *   0 → bg-surface-container-high (empty)
 *   1 → bg-cyan/40
 *   2 → bg-cyan
 *   3 → bg-terminal-dim
 *   4 → bg-terminal
 */
const TILE_COLORS = [
  "bg-surface-container-high",
  "bg-cyan/40",
  "bg-cyan",
  "bg-terminal-dim",
  "bg-terminal",
];

// tiny seeded PRNG so server and client agree
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CommitHeatmap = ({
  data,
  columns = 8,
  rows = 6,
  seed = 42,
  showLegend = true,
  className = "",
}) => {
  const tiles = useMemo(() => {
    if (data && data.length > 0) return data;
    const rand = mulberry32(seed);
    const total = columns * rows;
    return Array.from({ length: total }, () => Math.floor(rand() * 5));
  }, [data, columns, rows, seed]);

  return (
    <div className={className}>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {tiles.map((v, i) => (
          <div
            key={i}
            className={`aspect-square w-full rounded-sm ${
              TILE_COLORS[Math.max(0, Math.min(4, v))]
            }`}
            aria-hidden
          />
        ))}
      </div>

      {showLegend && (
        <div className="mt-4 flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-widest text-outline">
          <span>Less</span>
          <div className="flex gap-1">
            {TILE_COLORS.map((c, i) => (
              <span key={i} className={`h-2 w-2 ${c}`} aria-hidden />
            ))}
          </div>
          <span>More</span>
        </div>
      )}
    </div>
  );
};

export default CommitHeatmap;
