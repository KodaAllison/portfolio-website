const BOOKS = [
  { title: "Red Rising", height: 210, width: 42, state: "read" },
  { title: "Golden Son", height: 226, width: 38, state: "read" },
  { title: "Morning Star", height: 218, width: 46, state: "read" },
  { title: "Iron Gold", height: 240, width: 44, state: "current" },
  { title: "Dark Age", height: 204, width: 40, state: "next" },
];

export default function Bookshelf() {
  return (
    <div aria-label="Red Rising series reading shelf: three finished, Iron Gold in progress, Dark Age next">
      <div className="flex h-[260px] items-end justify-center gap-space-2 px-space-1">
        {BOOKS.map((book) => (
          <div
            key={book.title}
            className={`book-spine flex shrink-0 items-center justify-center border ${book.state === "current" ? "book-spine-current border-accent bg-heat-1 text-accent" : "border-line bg-surface text-ink-secondary"}`}
            style={{ height: `${book.height}px`, width: `${book.width}px` }}
            title={`${book.title} · ${book.state}`}
          >
            <span className="[writing-mode:vertical-rl] font-mono text-mono-s">{book.title}</span>
          </div>
        ))}
      </div>
      <div className="h-0.5 bg-line" aria-hidden="true" />
      <div className="mt-space-3 flex justify-between gap-space-3 font-mono text-mono-xs text-ink-muted">
        <span>3 read</span><span className="text-accent">reading · Iron Gold</span><span>1 next</span>
      </div>
    </div>
  );
}
