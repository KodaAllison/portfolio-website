import Link from "next/link";
import Navbar from "../components/Navbar";
import CopyEmail from "../components/CopyEmail";
import SiteFooter from "../components/SiteFooter";
import social from "../../data/social-links.json";
import about from "../../data/about.json";

const elsewhere = [
  { name: "github", handle: social.github.handle, href: social.github.url, note: "code" },
  { name: "linkedin", handle: social.linkedin.handle, href: social.linkedin.url, note: "the formal one" },
  { name: "strava", handle: about.links.strava.label.replace("/", ""), href: about.links.strava.href, note: "the miles" },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <header className="border-b border-line px-5 pb-space-7 pt-[88px] md:px-[72px] md:pb-14 md:pt-28">
        <p className="font-mono text-mono-xs uppercase tracking-[0.14em] text-ink-muted">Contact</p>
        <h1 className="mt-space-4 font-display text-display-l uppercase text-ink">
          Say hello<span className="text-accent">.</span>
        </h1>
        <p className="mt-space-5 max-w-2xl text-body-l text-ink-lead">
          Best for graduate engineering roles, side-project pair-ups, and anyone with a long
          route to share.
        </p>
        <p className="mt-space-2 font-mono text-mono-s text-ink-muted">
          No form, no tracking—the address below is the whole thing.
        </p>
      </header>

      <section className="grid gap-12 px-5 pt-[76px] md:grid-cols-[1.4fr_1fr] md:px-[72px]">
        <div>
          <h2 className="font-mono text-mono-xs uppercase tracking-[0.14em] text-ink-muted">Email</h2>
          <div className="mt-space-4">
            <CopyEmail email={social.email.address} />
          </div>
          <div className="mt-space-5 flex flex-wrap gap-space-3">
            <Link href={`mailto:${social.email.address}`} className="bg-accent px-space-5 py-space-3 font-mono text-mono-m font-medium text-bg transition-colors duration-hover hover:bg-accent-hover">
              Open mail client
            </Link>
            <Link href="/CV.pdf" className="border border-line px-space-5 py-space-3 font-mono text-mono-m text-ink transition-colors duration-hover hover:border-line-strong hover:text-accent">
              Download CV
            </Link>
          </div>
        </div>

        <div>
          <h2 className="font-mono text-mono-xs uppercase tracking-[0.14em] text-ink-muted">Elsewhere</h2>
          <ul className="mt-space-4 border-t border-line">
            {elsewhere.map((item) => (
              <li key={item.name}>
                <Link href={item.href} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[90px_1fr_auto] items-baseline gap-space-3 border-b border-line-subtle py-space-4 font-mono text-mono-s">
                  <span className="text-ink-muted">{item.name}</span>
                  <span className="text-ink">/{item.handle}</span>
                  <span className="text-accent transition-transform duration-hover group-hover:translate-x-1">{item.note} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 pt-[76px] md:px-[72px]">
        <h2 className="mb-space-5 font-display text-heading-l text-ink">Reply times</h2>
        <dl className="grid border-y border-line md:grid-cols-3 md:divide-x md:divide-line">
          <div className="py-space-5 md:pr-space-6"><dt className="font-mono text-mono-xs text-ink-muted">Weekdays</dt><dd className="mt-space-2 font-display text-heading-m text-ink">~24h</dd></div>
          <div className="border-t border-line py-space-5 md:border-0 md:px-space-6"><dt className="font-mono text-mono-xs text-ink-muted">Weekends</dt><dd className="mt-space-2 font-display text-heading-m text-ink">~48h</dd></div>
          <div className="border-t border-line py-space-5 md:border-0 md:pl-space-6"><dt className="font-mono text-mono-xs text-ink-muted">Timezone</dt><dd className="mt-space-2 font-display text-heading-m text-ink">Glasgow · GMT/BST</dd></div>
        </dl>
      </section>

      <SiteFooter />
    </main>
  );
}
