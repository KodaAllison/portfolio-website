import Link from "next/link";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LiveStrip from "./components/LiveStrip";
import TerminalWindow from "./components/TerminalWindow";
import StatusChip from "./components/StatusChip";
import CommitHeatmap from "./components/CommitHeatmap";
import Timeline from "./components/Timeline";
import about from "../data/about.json";
import timeline from "../data/timeline.json";
import { fetchStravaData } from "../lib/strava";
import { fetchGitHubData, relativeTime } from "../lib/github";

/* --- inline atoms (kept local; not shared components) -------------------- */


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
  let ytdKm;
  // The hero series. Left undefined on failure on purpose: HeroTrace renders
  // nothing without it and the headline rises into the space, which is the
  // degraded state the design sheet asks for. Never a placeholder shape.
  let monthlyKm;
  let stravaAge;
  try {
    const strava = await fetchStravaData();
    weeklyKm = strava.weekly_km;
    ytdKm = strava.ytd_km;
    monthlyKm = strava.monthly_km;
    stravaAge = strava.generated_at ? relativeTime(strava.generated_at) : undefined;
  } catch {
    weeklyKm = "rip gps";
    ytdKm = "—";
  }

  let commits_30d = stats.commits_30d;
  let last_commit = "n/a";
  let githubAge;
  let longest_streak = "n/a";
  let heatmap;
  try {
    const gh = await fetchGitHubData();
    commits_30d = gh.commits_30d;
    last_commit = gh.last_commit_at ? relativeTime(gh.last_commit_at) : "n/a";
    githubAge = gh.last_commit_at ? relativeTime(gh.last_commit_at) : undefined;
    longest_streak = `${gh.longest_streak}d`;
    heatmap = gh.heatmap;
  } catch {
    // falls back to about.json value for commit count, heatmap uses seed
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <Hero series={monthlyKm} />

      {/* Only sources that actually answered this render appear here. */}
      <LiveStrip
        sources={[
          { name: "strava", age: stravaAge },
          { name: "github", age: githubAge },
        ]}
      />

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
            label="ytd_km"
            value={ytdKm}
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
          TIMELINE
          ============================================================ */}
      <section className="mx-auto w-full max-w-container-max px-margin-mobile pb-14 md:px-margin-desktop md:pb-20">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
            <span className="text-outline">{"// "}</span>
            timeline
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-outline">
            {timeline.length} commits · {timeline[timeline.length - 1].date.slice(0, 4)} →
            present
          </span>
        </div>

        <TerminalWindow title="~/koda-allison" subtitle="git · main">
          <div className="mb-5 flex items-center gap-2 text-[12px]">
            <span className="text-terminal">$</span>
            <span className="text-on-surface-variant">
              git log --graph --oneline --decorate
            </span>
          </div>

          <Timeline entries={timeline} />
        </TerminalWindow>
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
                {"// get_in_touch.sh"}
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
                {"// links"}
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
            <span>portfolio_os · v3</span>
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
