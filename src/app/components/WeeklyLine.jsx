"use client";
import { useState, useRef } from "react";

function niceYTicks(peak) {
  for (const step of [5, 10, 15, 20, 25, 30, 50, 75, 100]) {
    const max = Math.ceil(peak / step) * step;
    if (max / step <= 4) {
      return Array.from({ length: max / step + 1 }, (_, i) => i * step);
    }
  }
  return [0, 50, 100];
}

export default function WeeklyLine({ data = [], className = "" }) {
  const [hovered, setHovered] = useState(null);
  const svgRef = useRef(null);

  const W = 600, H = 160;
  const PAD_TOP = 16, PAD_RIGHT = 8, PAD_BOTTOM = 4, PAD_LEFT = 44;

  const n = data.length;
  const lastIdx = n - 1;

  if (n < 2) {
    return (
      <div
        className={`flex items-center justify-center h-36 border-b border-outline-variant font-mono text-label-sm text-outline ${className}`}
      >
        // no data
      </div>
    );
  }

  const peak = Math.max(...data.map((d) => d.km), 1);
  const yTicks = niceYTicks(peak);
  const yMax = yTicks.at(-1);
  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const chartH = H - PAD_TOP - PAD_BOTTOM;

  const xs = data.map((_, i) => PAD_LEFT + (i / (n - 1)) * chartW);
  const ys = data.map((d) => PAD_TOP + (1 - d.km / yMax) * chartH);

  const linePath = xs
    .map((x, i) => {
      if (i === 0) return `M ${x},${ys[i]}`;
      const cpx = (xs[i - 1] + x) / 2;
      return `C ${cpx},${ys[i - 1]} ${cpx},${ys[i]} ${x},${ys[i]}`;
    })
    .join(" ");

  const baseline = PAD_TOP + chartH;
  const areaPath = `${linePath} L ${xs.at(-1)},${baseline} L ${xs[0]},${baseline} Z`;

  // tooltip geometry
  const TIP_W = 72, TIP_H = 30;
  const tip =
    hovered !== null
      ? {
          d: data[hovered],
          cx: xs[hovered],
          cy: ys[hovered],
          tx: Math.min(Math.max(xs[hovered] - TIP_W / 2, PAD_LEFT), W - PAD_RIGHT - TIP_W),
          ty: ys[hovered] - TIP_H - 10 < PAD_TOP ? ys[hovered] + 10 : ys[hovered] - TIP_H - 10,
        }
      : null;

  function handleMouseMove(e) {
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    let nearest = 0, minDist = Infinity;
    xs.forEach((x, i) => {
      const d = Math.abs(x - svgX);
      if (d < minDist) { minDist = d; nearest = i; }
    });
    setHovered(nearest);
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="border-b border-outline-variant">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            <linearGradient id="wl-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* y-axis grid lines + labels */}
          {yTicks.map((v) => {
            const y = PAD_TOP + (1 - v / yMax) * chartH;
            const isBaseline = v === 0;
            return (
              <g key={v}>
                <line
                  x1={PAD_LEFT}
                  x2={W - PAD_RIGHT}
                  y1={y}
                  y2={y}
                  stroke="#3a4a43"
                  strokeWidth={0.75}
                  strokeDasharray={isBaseline ? undefined : "3 3"}
                />
                <text
                  x={PAD_LEFT - 6}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={9}
                  fontFamily="monospace"
                  fill="#83958c"
                >
                  {v}
                </text>
              </g>
            );
          })}

          {/* area + line */}
          <path d={areaPath} fill="url(#wl-fill)" />
          <path d={linePath} stroke="#22d3ee" strokeWidth={1.5} fill="none" />

          {/* hover indicator */}
          {tip && (
            <line
              x1={tip.cx}
              x2={tip.cx}
              y1={PAD_TOP}
              y2={baseline}
              stroke="#3a4a43"
              strokeWidth={1}
              strokeDasharray="3 3"
              pointerEvents="none"
            />
          )}

          {/* dots */}
          {data.map((d, i) => {
            const isCurrent = i === lastIdx;
            const isHov = hovered === i;
            return (
              <circle
                key={i}
                cx={xs[i]}
                cy={ys[i]}
                r={isHov ? 5 : isCurrent ? 4 : 2.5}
                fill={isCurrent ? "#00ffc2" : "#22d3ee"}
                className="cursor-crosshair"
              />
            );
          })}

          {/* tooltip */}
          {tip && (
            <g pointerEvents="none">
              <rect
                x={tip.tx}
                y={tip.ty}
                width={TIP_W}
                height={TIP_H}
                rx={3}
                fill="#1b2025"
                stroke="#3a4a43"
                strokeWidth={0.75}
              />
              <text
                x={tip.tx + TIP_W / 2}
                y={tip.ty + 11}
                textAnchor="middle"
                fontSize={9.5}
                fontFamily="monospace"
                fontWeight="600"
                fill="#00ffc2"
              >
                {tip.d.km} km
              </text>
              <text
                x={tip.tx + TIP_W / 2}
                y={tip.ty + 22}
                textAnchor="middle"
                fontSize={8}
                fontFamily="monospace"
                fill="#83958c"
              >
                {tip.d.label}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* x-axis labels — offset to align with chart area */}
      <div
        className="flex gap-1"
        style={{
          paddingLeft: `${(PAD_LEFT / W) * 100}%`,
          paddingRight: `${(PAD_RIGHT / W) * 100}%`,
        }}
      >
        {data.map((week, i) => {
          const isCurrent = i === lastIdx;
          const show = isCurrent || i % 4 === 0;
          return (
            <div key={week.label} className="flex-1 flex justify-center">
              <span
                className={`font-mono text-[9px] leading-none whitespace-nowrap ${
                  isCurrent ? "text-terminal" : "text-outline"
                }`}
                style={{ visibility: show ? "visible" : "hidden" }}
              >
                {week.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
