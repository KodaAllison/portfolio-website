function readingDetails(value) {
  const [title, ...authorParts] = value.split(" - ");
  return {
    title: title.trim(),
    author: authorParts.join(" — ").trim(),
  };
}

export default function Bookshelf({ current }) {
  const book = readingDetails(current);

  return (
    <figure aria-label={`Currently reading ${book.title}${book.author ? ` by ${book.author}` : ""}`}>
      <div className="grid min-h-[260px] grid-cols-[1fr_52px] border border-line bg-surface-sunken">
        <div className="flex flex-col justify-between p-space-6">
          <p className="font-mono text-mono-xs uppercase tracking-[0.14em] text-accent">
            Reading now
          </p>
          <div>
            <p className="font-display text-heading-l text-ink">{book.title}</p>
            {book.author ? (
              <p className="mt-space-2 font-mono text-mono-s text-ink-muted">{book.author}</p>
            ) : null}
          </div>
          <p className="font-mono text-mono-xs text-ink-muted">current shelf · manually maintained</p>
        </div>
        <div className="flex items-center justify-center border-l border-accent bg-surface text-accent">
          <span className="[writing-mode:vertical-rl] font-mono text-mono-s">{book.title}</span>
        </div>
      </div>
      <div className="h-0.5 bg-line" aria-hidden="true" />
    </figure>
  );
}
