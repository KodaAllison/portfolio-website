/* The rule under the hero: every number on this page is fetched, not typed.

   That claim is only worth making if the strip is honest about the cases where
   it is not true, so a source appears here ONLY when it actually answered this
   render. A source that failed is omitted entirely rather than shown as "n/a"
   or, worse, left under a "live" label with a stale value behind it — which is
   the specific bug the design's data-states sheet was written to prevent.

   If nothing answered, the strip does not render at all. */
export default function LiveStrip({ sources = [] }) {
  const live = sources.filter((s) => s && s.age);
  if (live.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-space-6 gap-y-space-2 border-b border-line px-5 py-space-3 font-mono text-mono-xs text-ink-muted md:px-[72px]">
      <span className="text-[10px] uppercase tracking-[0.14em] text-accent">Live</span>
      <span>every number on this page is fetched, not typed</span>
      {live.map(({ name, age }, i) => (
        <span key={name} className={i === 0 ? "md:ml-auto" : undefined}>
          {name} <span className="text-ink-secondary">{age}</span>
        </span>
      ))}
    </div>
  );
}
