import Link from "next/link";

export default function SectionHeading({ title, link, label }) {
  return (
    <div className="mb-space-5 flex flex-wrap items-baseline justify-between gap-space-3">
      <h2 className="font-display text-heading-l text-ink">{title}</h2>
      {link ? (
        <Link
          href={link}
          className="font-mono text-mono-s text-ink-muted transition-colors duration-hover hover:text-accent"
        >
          {label} →
        </Link>
      ) : null}
    </div>
  );
}
