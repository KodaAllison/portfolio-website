import { monthLabel } from "../../lib/date";

/* The experience timeline, as a date rail.

   This replaces a `git log --graph` rendering of the same data. The commit
   vocabulary — hashes, refs, conventional-commit prefixes — was decoration
   standing in for structure; the rail gets its structure from alignment
   instead, so the dates read as a column and the entries as a column.

   Milestones that could not earn an annotation on the hero chart live here.
   A career date has no height on a distance curve, but on a rail it does not
   need one — that is the whole reason this section exists. */

// The rail is the one genuinely continuous scroll mapping on the page, so it
// is a CSS scroll timeline rather than an observer. It is fully drawn unless
// the browser can actually drive it — see the .rail rules in globals.css.
function Rail() {
  return (
    <div aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line">
      <div className="rail h-full w-full bg-line-strong" />
    </div>
  );
}

function when(entry) {
  if (entry.until) return `${monthLabel(entry.date)} → ${monthLabel(entry.until)}`;
  return monthLabel(entry.date);
}

function Row({ entry, current }) {
  return (
    <li className="relative grid gap-space-2 pb-space-7 md:grid-cols-[190px_minmax(0,1fr)] md:gap-space-6">
      <div className="font-mono text-mono-s md:pl-space-5">
        {/* "Now" is a claim about the present, so it is only made for an entry
            the data says has not ended. */}
        {current ? (
          <span className="text-accent">Now · since {monthLabel(entry.date)}</span>
        ) : (
          <span className="text-ink-muted">{when(entry)}</span>
        )}
        {entry.location && <div className="mt-1 text-ink-muted">{entry.location}</div>}
      </div>

      <div className="min-w-0 md:pl-space-5">
        {/* Rendered exactly as the data has it. CSS `capitalize` was tried and
            is wrong here: it title-cases every word, which turns "bsc computer
            science" into "Bsc Computer Science" and "joined virgin money as
            technical graduate" into "...As Technical Graduate". The entries are
            lowercase because they were written for a terminal-styled build; the
            new design sets them in sentence case, which is a copy change rather
            than something CSS can do correctly. */}
        <h3 className="font-display text-heading-s text-ink">{entry.message}</h3>
        {entry.body && (
          <p className="mt-space-2 max-w-[620px] font-sans text-body-m text-ink-secondary">
            {entry.body}
          </p>
        )}

        {/* Optional label → value pairs, rendered only when the data carries
            them. Absent today; the Experience copy pass fills them in. */}
        {entry.meta && (
          <dl className="mt-space-4 grid gap-space-2 font-mono text-mono-s md:grid-cols-[110px_minmax(0,1fr)]">
            {Object.entries(entry.meta).map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-ink-muted">{k}</dt>
                <dd className="m-0 text-ink-secondary">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </li>
  );
}

export default function Timeline({ entries = [], showCurrent = true }) {
  if (entries.length === 0) return null;

  return (
    <div className="relative">
      <Rail />
      <ol className="m-0 list-none p-0">
        {entries.map((entry, i) => (
          <Row
            key={entry.hash ?? `${entry.date}-${entry.message}`}
            entry={entry}
            // Only the newest entry can be current, and only if nothing closed
            // it off.
            current={showCurrent && i === 0 && !entry.until}
          />
        ))}
      </ol>
    </div>
  );
}
