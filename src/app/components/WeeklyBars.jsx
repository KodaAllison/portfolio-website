export default function WeeklyBars({ data = [] }) {
  if (!data.length) return null;

  const peak = Math.max(...data.map((week) => week.km), 1);

  return (
    <div className="flex h-full items-end gap-space-2 border-b border-line pb-space-5" role="img" aria-label="Weekly running distance for the last eight weeks">
      {data.map((week, index) => (
        <div key={week.label} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-space-2">
          <span className="text-center font-mono text-[10px] text-ink-muted">{week.km}</span>
          <span
            className={index === data.length - 1 ? "min-h-1 bg-accent" : "min-h-1 bg-line-strong"}
            style={{ height: `${Math.max(3, (week.km / peak) * 100)}%` }}
            aria-hidden="true"
          />
          <span className={`truncate text-center font-mono text-[9px] ${index === data.length - 1 ? "text-accent" : "text-ink-muted"}`}>
            {week.label.split(" ")[0]}
          </span>
        </div>
      ))}
    </div>
  );
}
