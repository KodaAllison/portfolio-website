import React from "react";

// Conventional-commit prefixes double as the colour key: `release` is the
// milestone (graduation), `init` the first entry, `feat` everything since.
// `chore` is the work that ran alongside it all — dim, so the build log leads.
const TYPE_COLOR = {
  init: "text-outline",
  chore: "text-outline",
  feat: "text-terminal",
  release: "text-signal",
};

// `HEAD -> main` reads as current, everything else (tags, remotes) is decoration.
const refColor = (ref) =>
  ref.startsWith("HEAD") ? "text-cyan" : ref.startsWith("tag:") ? "text-signal" : "text-outline";

const CommitRow = ({ entry, isLast }) => (
  <li className="flex gap-3">
    {/* --graph gutter: node + the line running down to the next commit */}
    <div className="flex flex-col items-center" aria-hidden>
      <span className={`text-[13px] leading-relaxed ${TYPE_COLOR[entry.type] ?? "text-terminal"}`}>
        *
      </span>
      {!isLast && <span className="w-px flex-1 bg-outline-variant" />}
    </div>

    <div className={`min-w-0 flex-1 ${isLast ? "" : "pb-5"}`}>
      <div className="flex flex-wrap items-baseline gap-x-2 text-[13px] leading-relaxed">
        <span className="text-outline">{entry.hash}</span>

        {entry.refs?.length > 0 && (
          <span className="text-outline">
            (
            {entry.refs.map((ref, i) => (
              <React.Fragment key={ref}>
                <span className={refColor(ref)}>{ref}</span>
                {i < entry.refs.length - 1 && <span className="text-outline">, </span>}
              </React.Fragment>
            ))}
            )
          </span>
        )}

        <span className={TYPE_COLOR[entry.type] ?? "text-terminal"}>{entry.type}:</span>
        <span className="text-on-surface">{entry.message}</span>
      </div>

      <div className="mt-1 flex flex-wrap items-baseline gap-x-3 text-[11px] text-outline">
        {/* `until` only on the roles nothing else closes off — the rest are
            either still running or ended by the commit above them. */}
        <span>{entry.until ? `${entry.date} → ${entry.until}` : entry.date}</span>
        <span className="min-w-0 text-on-surface-variant">{entry.body}</span>
      </div>
    </div>
  </li>
);

/**
 * <Timeline>
 * Renders timeline.json as `git log --graph` output: one commit per milestone,
 * newest first, with the graph gutter drawn as a node + connecting line.
 *
 * Props:
 *   entries — array from src/data/timeline.json
 */
const Timeline = ({ entries }) => (
  <ol reversed className="text-[13px]">
    {entries.map((entry, i) => (
      <CommitRow key={entry.hash} entry={entry} isLast={i === entries.length - 1} />
    ))}
  </ol>
);

export default Timeline;
