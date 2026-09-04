import Link from "next/link";
import about from "../../data/about.json";

const SOCIALS = ["github", "linkedin", "strava"];

export default function SiteFooter() {
  return (
    <footer className="mt-space-7 border-t border-line px-5 py-space-7 md:mt-[88px] md:px-[72px] md:py-12">
      <div className="flex flex-col gap-space-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-heading-m text-ink">Say hello.</p>
          <Link
            href={about.links.email.href}
            className="mt-space-2 inline-block font-mono text-mono-m text-accent transition-colors duration-hover hover:text-accent-hover"
          >
            {about.links.email.label}
          </Link>
        </div>
        <nav aria-label="Social links">
          <ul className="flex flex-wrap gap-space-6 font-mono text-mono-s text-ink-secondary">
            {SOCIALS.map((name) => (
              <li key={name}>
                <Link
                  href={about.links[name].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-hover hover:text-accent"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
