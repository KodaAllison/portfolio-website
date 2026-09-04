const FINISHED_SPINES = [
  "h-[210px] w-[42px]",
  "h-[226px] w-[38px]",
  "h-[218px] w-[46px]",
  "h-[204px] w-[40px]",
];

function Spine({ book, current = false, shape }) {
  return (
    <a
      href={book.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${book.title}${book.author ? ` by ${book.author}` : ""}${current ? ", currently reading" : ", finished"}`}
      className={`bookshelf-spine flex shrink-0 items-center justify-center overflow-hidden border font-mono text-mono-xs ${shape} ${
        current
          ? "bookshelf-spine-current border-accent bg-accent-wash text-accent hover:text-accent-hover"
          : "border-line bg-surface-sunken text-ink-secondary hover:border-line-strong hover:text-ink"
      }`}
    >
      <span className="max-h-full px-space-2 py-space-3 [writing-mode:vertical-rl]">
        {book.title}
      </span>
    </a>
  );
}

export default function Bookshelf({ shelf }) {
  const count = shelf.finished.length + (shelf.current ? 1 : 0);
  const beforeCurrent = shelf.current ? shelf.finished.slice(0, 3) : shelf.finished;
  const afterCurrent = shelf.current ? shelf.finished.slice(3) : [];

  return (
    <figure aria-label={`Literal bookshelf with ${count} book${count === 1 ? "" : "s"}`}>
      <div className="flex min-h-[260px] items-end gap-space-2 px-space-1">
        {beforeCurrent.map((book, index) => (
          <Spine key={book.id} book={book} shape={FINISHED_SPINES[index % FINISHED_SPINES.length]} />
        ))}
        {shelf.current ? (
          <Spine book={shelf.current} current shape="h-[240px] w-[44px]" />
        ) : null}
        {afterCurrent.map((book, index) => (
          <Spine
            key={book.id}
            book={book}
            shape={FINISHED_SPINES[(index + 3) % FINISHED_SPINES.length]}
          />
        ))}
      </div>
      <div className="h-0.5 bg-line" aria-hidden="true" />
      <figcaption className="mt-space-3 flex flex-wrap items-baseline gap-x-space-4 gap-y-space-2 font-mono text-mono-xs text-ink-secondary">
        {shelf.current ? (
          <span>
            <span className="text-ink-muted">now →</span> {shelf.current.title}
            {shelf.current.author ? `, ${shelf.current.author}` : ""}
          </span>
        ) : null}
        <a
          href={shelf.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent-hover"
        >
          finished shelf → literal.club
        </a>
      </figcaption>
    </figure>
  );
}
