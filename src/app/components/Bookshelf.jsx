export default function Bookshelf({ book }) {
  return (
    <figure aria-label={`Currently reading ${book.title}${book.author ? ` by ${book.author}` : ""}`}>
      <div className="grid min-h-[260px] grid-cols-[1fr_52px] border border-line bg-surface-sunken">
        <div className="flex flex-col justify-between p-space-6">
          <p className="font-mono text-mono-xs text-accent">
            Reading now
          </p>
          <div>
            <a
              href={book.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-heading-l text-ink hover:text-accent"
            >
              {book.title}
            </a>
            {book.author ? (
              <p className="mt-space-2 font-mono text-mono-s text-ink-muted">{book.author}</p>
            ) : null}
          </div>
          <a
            href={book.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-mono-xs text-ink-muted hover:text-accent"
          >
            current shelf → literal.club
          </a>
        </div>
        <div className="flex items-center justify-center border-l border-accent bg-surface text-accent">
          <span className="[writing-mode:vertical-rl] font-mono text-mono-s">{book.title}</span>
        </div>
      </div>
      <div className="h-0.5 bg-line" aria-hidden="true" />
    </figure>
  );
}
