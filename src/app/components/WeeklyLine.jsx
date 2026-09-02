import { niceYTicks } from "../../lib/trace";

const WIDTH = 1000;
const HEIGHT = 260;
const PAD = { top: 18, right: 8, bottom: 28, left: 48 };

export default function WeeklyLine({ data = [] }) {
  if (data.length < 2) return null;

  const peak = Math.max(...data.map((week) => week.km), 1);
  const ticks = niceYTicks(peak);
  const max = ticks.at(-1);
  const chartWidth = WIDTH - PAD.left - PAD.right;
  const chartHeight = HEIGHT - PAD.top - PAD.bottom;
  const points = data.map((week, index) => ({
    ...week,
    x: PAD.left + (index / (data.length - 1)) * chartWidth,
    y: PAD.top + (1 - week.km / max) * chartHeight,
  }));
  const path = points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-full w-full" role="img" aria-label="Weekly running distance line chart">
      {ticks.map((tick) => {
        const y = PAD.top + (1 - tick / max) * chartHeight;
        return (
          <g key={tick}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} stroke="var(--border-subtle)" strokeDasharray={tick ? "2 6" : undefined} />
            <text x={PAD.left - 10} y={y + 4} textAnchor="end" fontSize="11" fontFamily="var(--font-jetbrains-mono)" fill="var(--text-muted)">{tick}</text>
          </g>
        );
      })}
      <path d={path} fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinejoin="round" />
      {points.map((point, index) => (
        <g key={`${point.label}-${index}`}>
          <circle cx={point.x} cy={point.y} r={index === points.length - 1 ? 5 : 2.5} fill={index === points.length - 1 ? "var(--accent)" : "var(--text-primary)"} />
          {(index % 4 === 0 || index === points.length - 1) ? (
            <text x={point.x} y={HEIGHT - 4} textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"} fontSize="11" fontFamily="var(--font-jetbrains-mono)" fill={index === points.length - 1 ? "var(--accent)" : "var(--text-muted)"}>{point.label}</text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}
