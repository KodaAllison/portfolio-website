/* The rule under the hero: every number on this page is fetched, not typed.

   That claim is only worth making if the strip is honest about the cases where
   it is not true, so a source appears here ONLY when it actually answered this
   render. A source that failed is omitted entirely rather than shown as "n/a"
   or, worse, left under a "live" label with a stale value behind it — which is
   the specific bug the design's data-states sheet was written to prevent.

   If nothing answered, the strip does not render at all. */
export default function LiveStrip({ sources = [] }) {
  const live = sources.filter((source) => source && source.status);
  if (live.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-space-6 gap-y-space-2 border-b border-line px-5 py-space-3 font-mono text-mono-xs text-ink-muted md:px-[72px]">
      <span className="text-mono-xs text-accent">Live data</span>
      <span>live metrics on this page are fetched, not typed</span>
      <span className="ml-auto flex flex-wrap justify-end gap-x-space-6 gap-y-space-2">
        {live.map(({ name, status }) => (
          <span key={name}>
            {name} <span className="text-ink-secondary">{status}</span>
          </span>
        ))}
      </span>
    </div>
  );
}
