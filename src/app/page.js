import Link from "next/link";
import Navbar from "./components/Navbar";
import TerminalWindow from "./components/TerminalWindow";
import StatusChip from "./components/StatusChip";
import SyntaxTag from "./components/SyntaxTag";
import CommitHeatmap from "./components/CommitHeatmap";
import about from "../data/about.json";
import { fetchStravaData } from "../lib/strava";
import { fetchGitHubData } from "../lib/github";

/* --- inline atoms (kept local; not shared components) -------------------- */

// One row in the about.json terminal window. Renders `  key: <value>,`
const JsonRow = ({ k, value, depth = 1, valueColor = "text-cyan", trailing = "," }) => (
  <div style={{ paddingLeft: `${depth * 16}px` }} className="leading-relaxed">
    <span className="text-on-surface">{k}</span>
    <span className="text-outline">: </span>
    <span className={valueColor}>{value}</span>
    <span className="text-outline">{trailing}</span>
  </div>
);

// A stat cell for the strip beneath the hero.
const StatCell = ({ label, value, accent = "text-terminal", align = "left" }) => (
  <div
    className={`flex items-baseline gap-2 ${
      align === "right" ? "md:justify-end" : ""
    }`}
  >
    <span className="font-mono text-[10px] uppercase tracking-widest text-outline">
      {label}
    </span>
    <span className="text-outline">=</span>
    <span className={`font-mono text-[13px] font-bold ${accent}`}>{value}</span>
  </div>
);

// A link row in the contact card.
const LinkRow = ({ name, label, href, external = true }) => (
  <li className="group">
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex items-baseline gap-2 font-mono text-[13px] transition-colors"
    >
      <span className="w-20 text-outline">{name}</span>
      <span className="text-outline transition-colors group-hover:text-terminal">
        →
      </span>
      <span className="text-cyan transition-colors group-hover:text-terminal">
        {label}
      </span>
    </Link>
  </li>
);

/* --- page ---------------------------------------------------------------- */

export default async function Home() {
  const { stats, currently, stack, stack_tags, links } = about;

  let weeklyKm;
  try {
    const strava = await fetchStravaData();
    weeklyKm = strava.weekly_km;
  } catch {
    weeklyKm = "rip gps";
  }

  let commits_30d = stats.commits_30d;
  let last_commit = "n/a";
  let longest_streak = "n/a";
  let heatmap;
  try {
    const gh = await fetchGitHubData();
    commits_30d = gh.commits_30d;
    last_commit = gh.last_commit;
    longest_streak = `${gh.longest_streak}d`;
    heatmap = gh.heatmap;
  } catch {
    // falls back to about.json value for commit count, heatmap uses seed
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="mx-auto w-full max-w-container-max px-margin-mobile pt-24 pb-10 md:px-margin-desktop md:pb-16">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
          {/* hero left ----------------------------------------------- */}
          <div className="space-y-8">
            {/* status row */}
            <div className="flex flex-wrap items-center gap-3">
              <StatusChip pulse glow>
                online
              </StatusChip>
              <span className="font-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
                {about.location.city}
              </span>
              <span className="text-outline">•</span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-cyan">
                {about.location.coords}
              </span>
            </div>

            {/* headline */}
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tighter md:text-7xl">
              <span className="block text-terminal">shipping code,</span>
              <span className="block text-cyan">logging miles</span>
            </h1>

            {/* tagline */}
            <p className="max-w-xl font-mono text-body-md leading-relaxed text-on-surface-variant">
              <span className="text-cyan">{"// "}</span>
              First-class CS grad · {about.title} at{" "}
              <a
                href={about.employer.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan hover:text-terminal hover:underline"
              >
                {about.employer.label}
              </a>
              . {about.bio}
            </p>

            {/* stack tags */}
            <div className="flex flex-wrap gap-2">
              {stack_tags.map(({ label, color, variant }) => (
                <SyntaxTag key={label} color={color} variant={variant}>{label}</SyntaxTag>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 bg-terminal px-5 py-3 font-mono text-[13px] font-bold text-background transition-all hover:bg-terminal-dim hover:shadow-glow-lg"
              >
                <span className="opacity-60 group-hover:opacity-100">$</span>
                <span>./hello.sh</span>
              </Link>
            </div>
          </div>

          {/* hero right — about.json terminal ------------------------ */}
          <div className="lg:pl-4">
            <TerminalWindow title="~/about.json" subtitle="json · 24 lines" glow>
              <div className="relative">
                {/* faint line gutter */}
                <div className="text-[13px] leading-relaxed">
                  <div>
                    <span className="text-outline">{"{"}</span>
                  </div>
                  <JsonRow k="&quot;name&quot;" value={`"${about.name}"`} />
                  <JsonRow k="&quot;role&quot;" value={`"${about.role}"`} />
                  <JsonRow
                    k="&quot;employer&quot;"
                    value={`"${about.employer.label}"`}
                  />
                  <JsonRow
                    k="&quot;title&quot;"
                    value={`"${about.title}"`}
                  />
                  <JsonRow
                    k="&quot;location&quot;"
                    value={`"${about.location.city}, ${about.location.country}"`}
                  />
                  <JsonRow
                    k="&quot;degree&quot;"
                    value={`"${about.education.degree}"`}
                  />
                  <JsonRow
                    k="&quot;result&quot;"
                    value={`"${about.education.result}"`}
                    valueColor="text-signal"
                  />
                  <div className="pl-4 leading-relaxed">
                    <span className="text-on-surface">&quot;stack&quot;</span>
                    <span className="text-outline">: [</span>
                  </div>
                  {stack.map((tech, i) => (
                    <div
                      key={tech}
                      className="leading-relaxed"
                      style={{ paddingLeft: "32px" }}
                    >
                      <span className="text-terminal">&quot;{tech}&quot;</span>
                      <span className="text-outline">
                        {i < stack.length - 1 ? "," : ""}
                      </span>
                    </div>
                  ))}
                  <div className="pl-4 leading-relaxed">
                    <span className="text-outline">],</span>
                  </div>
                  <div className="pl-4 leading-relaxed">
                    <span className="text-on-surface">&quot;status&quot;</span>
                    <span className="text-outline">: </span>
                    <span className="text-terminal">&quot;available&quot;</span>
                  </div>
                  <div>
                    <span className="text-outline">{"}"}</span>
                  </div>

                  {/* prompt cursor */}
                  <div className="mt-4 flex items-center gap-2 border-t border-outline-variant pt-3 text-[12px]">
                    <span className="text-terminal">koda@portfolio-os</span>
                    <span className="text-outline">:</span>
                    <span className="text-cyan">~</span>
                    <span className="text-outline">$</span>
                    <span className="blink-cursor" />
                  </div>
                </div>
              </div>
            </TerminalWindow>
          </div>
        </div>
      </section>

      {/* ============================================================
          STATS STRIP
          ============================================================ */}
      <section className="mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-outline-variant py-6 md:flex md:justify-between md:gap-6 md:py-5">
          <StatCell
            label="this_week_km"
            value={weeklyKm}
            accent="text-terminal"
          />
          <StatCell
            label="commits.30d"
            value={commits_30d}
            accent="text-cyan"
          />
          <StatCell
            label="countries.visited"
            value={stats.countries_visited}
            accent="text-terminal"
          />
          <StatCell
            label="coffee.consumed"
            value="∞"
            accent="text-cyan"
          />
        </div>
      </section>

      {/* ============================================================
          CURRENTLY + ACTIVITY
          ============================================================ */}
      <section className="mx-auto w-full max-w-container-max px-margin-mobile pb-14 pt-10 md:px-margin-desktop md:pb-20 md:pt-16">
        {/* section header */}
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
            <span className="text-outline">{"// "}</span>
            currently
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-outline">
            last updated · today
          </span>
        </div>

        <div className="grid gap-gutter md:grid-cols-2">
          {/* currently.jsx ---------------------------------------- */}
          <TerminalWindow title="~/currently.jsx" subtitle="jsx · live">
            <div className="text-[13px] leading-relaxed">
              <div>
                <span className="text-fuchsia-400">function</span>{" "}
                <span className="text-signal">currently</span>
                <span className="text-outline">() {"{"}</span>
              </div>
              <div className="pl-4">
                <span className="text-fuchsia-400">return</span>
                <span className="text-outline"> {"{"}</span>
              </div>

              <div className="pl-8">
                <span className="text-on-surface">shipping</span>
                <span className="text-outline">: </span>
                <span className="text-cyan">&quot;{currently.shipping}&quot;</span>
                <span className="text-outline">,</span>
              </div>
              <div className="pl-8">
                <span className="text-on-surface">training</span>
                <span className="text-outline">: </span>
                <span className="text-cyan">&quot;{currently.training}&quot;</span>
                <span className="text-outline">,</span>
              </div>
              <div className="pl-8">
                <span className="text-on-surface">reading</span>
                <span className="text-outline">: </span>
                <span className="text-cyan">&quot;{currently.reading}&quot;</span>
                <span className="text-outline">,</span>
              </div>
              <div className="pl-8">
                <span className="text-on-surface">learning</span>
                <span className="text-outline">: </span>
                <span className="text-cyan">&quot;{currently.learning}&quot;</span>
                <span className="text-outline">,</span>
              </div>
              <div className="pl-8">
                <span className="text-on-surface">listening</span>
                <span className="text-outline">: </span>
                <span className="text-cyan">&quot;{currently.listening}&quot;</span>
                <span className="text-outline">,</span>
              </div>
              <div className="pl-8">
                <span className="text-on-surface">updated</span>
                <span className="text-outline">: </span>
                <span className="text-fuchsia-400">new</span>{" "}
                <span className="text-signal">Date</span>
                <span className="text-outline">(</span>
                <span className="text-terminal">
                  &quot;
                  {new Date().toISOString().slice(0, 10)}
                  &quot;
                </span>
                <span className="text-outline">)</span>
              </div>

              <div className="pl-4">
                <span className="text-outline">{"};"}</span>
              </div>
              <div>
                <span className="text-outline">{"}"}</span>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-outline-variant pt-3">
                <span className="text-terminal">$</span>
                <span className="text-on-surface-variant">node currently.jsx</span>
                <span className="blink-cursor" />
              </div>
            </div>
          </TerminalWindow>

          {/* activity ---------------------------------------------- */}
          <TerminalWindow title="~/activity.log" subtitle="48 cells · 30d">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <div className="font-display text-3xl font-bold leading-none text-on-surface">
                  {commits_30d}<span className="text-terminal">.</span>
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-outline">
                  commits / 30d
                </div>
              </div>
              <StatusChip color="cyan" pulse>
                live
              </StatusChip>
            </div>

            <CommitHeatmap columns={12} rows={4} seed={108} data={heatmap} />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant pt-3 font-mono text-[10px] uppercase tracking-widest text-outline">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="text-terminal">●</span> last commit · {last_commit}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-signal">★</span> longest streak · {longest_streak}
                </span>
              </div>
            </div>
          </TerminalWindow>
        </div>
      </section>

      {/* ============================================================
          CONTACT CTA
          ============================================================ */}
      <section className="mx-auto w-full max-w-container-max px-margin-mobile pb-14 md:px-margin-desktop md:pb-20">
        <div className="terminal-shadow relative overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
          {/* decorative grid background — pure CSS, no extra component */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,255,194,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,194,0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* glow corner */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -bottom-32 h-80 w-80 rounded-full bg-terminal/10 blur-3xl"
          />

          <div className="relative grid gap-10 p-8 md:grid-cols-[1.5fr_1fr] md:p-12 lg:p-16">
            {/* left — big echo */}
            <div className="min-w-0 space-y-6">
              <div className="font-mono text-[11px] uppercase tracking-widest text-outline">
                // get_in_touch.sh
              </div>
              <h2 className="font-display text-2xl font-extrabold leading-[1.05] tracking-tighter sm:text-4xl md:text-4xl lg:text-6xl">
                <span className="block text-cyan">$ echo &quot;hello&quot;</span>
                <span className="block break-all text-terminal">
                  &gt; {about.links.email.label}
                  <span className="blink-cursor" />
                </span>
              </h2>
              <p className="max-w-md font-mono text-body-md leading-relaxed text-on-surface-variant">
                <span className="text-cyan">{"// "}</span>
                best for: graduate engineering roles, side-project pair-ups, and
                anyone with a long route to share.
              </p>
            </div>

            {/* right — link list */}
            <div className="space-y-5 md:border-l md:border-outline-variant md:pl-10">
              <div className="font-mono text-[10px] uppercase tracking-widest text-outline">
                // links
              </div>
              <ul className="space-y-3">
                <LinkRow
                  name="github"
                  label={links.github.label}
                  href={links.github.href}
                />
                <LinkRow
                  name="linkedin"
                  label={links.linkedin.label}
                  href={links.linkedin.href}
                />
                <LinkRow
                  name="strava"
                  label={links.strava.label}
                  href={links.strava.href}
                />
                <LinkRow
                  name="email"
                  label={links.email.label}
                  href={links.email.href}
                  external={false}
                />
              </ul>

              <div className="pt-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 border border-terminal/40 px-4 py-2 font-mono text-[12px] font-bold uppercase tracking-widest text-terminal transition-all hover:bg-terminal hover:text-background"
                >
                  <span className="opacity-70 group-hover:opacity-100">$</span>
                  open /contact
                  <span className="opacity-70 transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER STATUS BAR
          ============================================================ */}
      <footer className="border-t border-outline-variant bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-container-max flex-col items-start justify-between gap-2 px-margin-mobile py-3 font-mono text-[10px] uppercase tracking-widest text-outline md:flex-row md:items-center md:px-margin-desktop">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-terminal">●</span>
            <span>sys_build · 0x_redesign_v1</span>
            <span className="text-outline-variant">|</span>
            <span>uptime · {stats.uptime}</span>
            <span className="text-outline-variant">|</span>
            <span>portfolio_os</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={links.repo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-terminal transition-colors"
            >
              {links.repo.label}
            </a>
            <span>next-16 · vercel</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
