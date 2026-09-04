const TILE_COLORS = ["bg-heat-0", "bg-heat-1", "bg-heat-2", "bg-heat-3", "bg-heat-4"];

export default function CommitHeatmap({ data, columns = 12, showLegend = true, className = "" }) {
  if (!data?.length) return null;

  return (
    <div className={className} aria-label="GitHub commit activity over the last 48 days">
      <div
        className="grid gap-space-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {data.map((intensity, index) => (
          <span
            key={index}
            className={`aspect-square w-full ${TILE_COLORS[Math.max(0, Math.min(4, intensity))]}`}
            aria-hidden="true"
          />
        ))}
      </div>
      {showLegend ? (
        <div className="mt-space-3 flex items-center justify-end gap-space-2 font-mono text-mono-xs text-ink-muted">
          <span>less</span>
          <span className="flex gap-space-1" aria-hidden="true">
            {TILE_COLORS.map((color) => <span key={color} className={`h-2 w-2 ${color}`} />)}
          </span>
          <span>more</span>
        </div>
      ) : null}
    </div>
  );
}
