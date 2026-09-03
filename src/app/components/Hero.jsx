import Link from "next/link";
import HeroTrace from "./HeroTrace";
import about from "../../data/about.json";

/* The homepage hero: the trace on top, the headline bottom-anchored under it.

   When the trace has no data it renders nothing and the headline simply rises
   into the space — the degraded state the design sheet asks for. There is no
   empty frame and no error text, so this component needs no branch of its own. */
export default function Hero({ series, records }) {
  const hasChart = Array.isArray(series) && series.length > 0;

  return (
    /* The artboard's hero is a fixed 660px band with the headline pinned to its
       bottom edge. That height is only correct while there is a chart to fill
       it: the design's failed state is "graph removed, headline rises", and a
       fixed height would leave the headline stranded at the bottom of an empty
       band instead. So the minimum height is conditional and the headline is
       pushed down by mt-auto, which pins it when there is room and lets it rise
       when there is not. */
    <header className={`flex flex-col border-b border-line ${hasChart ? "md:min-h-[660px]" : ""}`}>
      <div className="px-5 pt-space-5 md:px-[72px] md:pt-[44px]">
        <HeroTrace series={series} records={records} />
      </div>

      <div className="mt-auto px-5 pb-space-5 pt-space-6 md:px-[72px]">
        {/* Two weights of the same line: the claim solid, the promise outlined.
            Not animated — this is the LCP text, and fading it in would delay
            LCP by exactly the length of the fade in exchange for nothing. */}
        <h1 className="font-display text-display-xl uppercase text-ink">
          <span className="block">I build things </span>
          <span className="block text-accent [-webkit-text-fill-color:transparent] [-webkit-text-stroke:1.5px_var(--accent)]">
            and keep them running
          </span>
        </h1>

        <div className="flex flex-col gap-space-5 pt-space-5 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[620px] font-sans text-body-l text-ink-lead">
            <span className="font-medium capitalize text-ink">{about.name}</span> — {about.title} at
            Virgin Money. {about.education.result} {about.education.degree}, based in{" "}
            <span className="capitalize">{about.location.city}</span>.
          </p>

          <div className="flex shrink-0 gap-space-3">
            <Link
              href="/projects"
              className="bg-accent px-space-5 py-space-3 font-mono text-mono-m font-medium text-bg transition-colors duration-hover hover:bg-accent-hover"
            >
              See the work
            </Link>
            <a
              href="/CV.pdf"
              className="border border-line px-space-5 py-space-3 font-mono text-mono-m text-ink transition-colors duration-hover hover:border-line-strong"
            >
              Download CV
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
