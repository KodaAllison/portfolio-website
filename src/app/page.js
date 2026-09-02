import Link from "next/link";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LiveStrip from "./components/LiveStrip";
import Timeline from "./components/Timeline";
import CommitHeatmap from "./components/CommitHeatmap";
import ProjectCard from "./components/ProjectCard";
import SectionHeading from "./components/SectionHeading";
import SiteFooter from "./components/SiteFooter";
import TravelGlobe from "./components/TravelGlobe";
import Bookshelf from "./components/Bookshelf";
import about from "../data/about.json";
import projects from "../data/projects.json";
import timeline from "../data/timeline.json";
import { fetchStravaData } from "../lib/strava";
import { fetchGitHubData, relativeTime } from "../lib/github";
import { fetchHoliTrackrStats } from "../lib/holitrackr";

function Metric({ value, label }) {
  return (
    <div>
      <p className="font-display text-display-m tabular-nums text-ink">{value}</p>
      <p className="mt-space-2 font-mono text-mono-xs uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </p>
    </div>
  );
}

function DataRoute({ label, route, note }) {
  return (
    <div className="border-b border-line-subtle py-space-4 last:border-0">
      <p className="font-mono text-mono-xs uppercase tracking-[0.14em] text-ink-muted">{label}</p>
      <p className="mt-space-2 font-mono text-mono-m text-ink">
        {route.map((part, index) => (
          <span key={part}>
            {index > 0 ? <span className="text-accent"> → </span> : null}
            {part}
          </span>
        ))}
      </p>
      <p className="mt-space-1 font-mono text-mono-xs text-ink-secondary">{note}</p>
    </div>
  );
}

export default async function Home() {
  const [stravaResult, githubResult, travelResult] = await Promise.allSettled([
    fetchStravaData(),
    fetchGitHubData(),
    fetchHoliTrackrStats(),
  ]);
  const strava = stravaResult.status === "fulfilled" ? stravaResult.value : undefined;
  const github = githubResult.status === "fulfilled" ? githubResult.value : undefined;
  const liveTravel = travelResult.status === "fulfilled" ? travelResult.value : undefined;
  const fallbackCountries = about.travel?.countries ?? [];
  const travel = liveTravel
    ? { ...liveTravel, source: "live" }
    : fallbackCountries.length
      ? {
          countries: fallbackCountries,
          countryCount: fallbackCountries.length,
          continentCount: new Set(fallbackCountries.map((country) => country.continent)).size,
          generatedAt: about.travel.generatedAt,
          source: "snapshot",
        }
      : undefined;

  const sources = [
    strava?.generated_at && { name: "strava", age: relativeTime(strava.generated_at) },
    github?.last_commit_at && { name: "github", age: relativeTime(github.last_commit_at) },
    liveTravel?.generatedAt && { name: "holitrackr", age: relativeTime(liveTravel.generatedAt) },
  ].filter(Boolean);
  const travelProject = projects.find((project) => project.id === "holitrackr");

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero series={strava?.monthly_km} records={strava?.personal_records} />
      <LiveStrip sources={sources} />

      <section className="px-5 pt-[76px] md:px-[72px]">
        <SectionHeading title="Experience" link="/CV.pdf" label="full history" />

        <article className="-mx-5 bg-surface px-5 py-space-6 md:-mx-[72px] md:px-[72px] md:py-space-7">
          <div className="flex flex-wrap items-baseline justify-between gap-space-3 font-mono text-mono-xs">
            <span className="uppercase tracking-[0.14em] text-accent">Now · since Sep 2025</span>
            <span className="text-ink-muted">Glasgow</span>
          </div>
          <h3 className="mt-space-3 font-display text-heading-m text-ink">
            Technical graduate — Virgin Money
          </h3>
          <div className="mt-space-4 grid gap-space-6 md:grid-cols-[1.4fr_1fr] md:gap-12">
            <p className="max-w-3xl text-body-m text-ink-secondary">
              Building an internal repo-health dashboard in TypeScript and Deno—the tool teams use
              to see where their tech debt actually is and decide what to triage first. It is the
              first time my code has had colleagues as users rather than markers.
            </p>
            <dl className="space-y-space-2 border-l border-line pl-space-6 font-mono text-mono-m text-ink-secondary">
              <div><dt className="inline text-ink-muted">stack </dt><dd className="inline"><span className="text-accent">→</span> typescript · deno</dd></div>
              <div><dt className="inline text-ink-muted">users </dt><dd className="inline"><span className="text-accent">→</span> engineering teams</dd></div>
              <div><dt className="inline text-ink-muted">scheme </dt><dd className="inline"><span className="text-accent">→</span> two-year programme</dd></div>
            </dl>
          </div>
        </article>

        <Timeline entries={timeline.slice(1)} showCurrent={false} />
      </section>

      <section className="px-5 pt-[76px] md:px-[72px]">
        <SectionHeading title="Personal projects" link="/projects" label={`all ${projects.length}`} />
        <ProjectCard project={projects[0]} featured />
        <div className="grid gap-x-12 md:grid-cols-2">
          {projects.slice(1, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="px-5 pt-[76px] md:px-[72px]">
        <SectionHeading title="Away from the keyboard" />
        <div className={`grid border-y border-line ${travel ? "md:grid-cols-[1.4fr_1fr] md:divide-x md:divide-line" : ""}`}>
          {travel ? (
            <article className="py-space-6 md:pr-space-6">
              <p className="font-mono text-mono-xs uppercase tracking-[0.14em] text-ink-muted">
                {travel.source === "live"
                  ? "Travel · live from HoliTrackr"
                  : `Travel · snapshot ${relativeTime(travel.generatedAt)}`}
              </p>
              <div className="mt-space-4 grid items-center gap-space-6 sm:grid-cols-[minmax(0,1fr)_150px]">
                <TravelGlobe countries={travel.countries} />
                <div>
                  <Metric value={travel.countryCount} label="countries" />
                  <div className="mt-space-6"><Metric value={travel.continentCount} label="continents" /></div>
                  <p className="mt-space-6 font-mono text-mono-s text-ink-secondary"><span className="text-ink-muted">home →</span> Glasgow</p>
                  {travelProject?.previewUrl ? (
                    <Link href={travelProject.previewUrl} target="_blank" rel="noopener noreferrer" className="mt-space-2 inline-block font-mono text-mono-s text-accent hover:text-accent-hover">open the map →</Link>
                  ) : null}
                </div>
              </div>
            </article>
          ) : null}
          <article className={travel ? "border-t border-line py-space-6 md:border-0 md:pl-space-6" : "py-space-6"}>
            <p className="font-mono text-mono-xs uppercase tracking-[0.14em] text-ink-muted">Reading</p>
            <div className="mt-space-4"><Bookshelf current={about.currently.reading} /></div>
          </article>
        </div>
        <article className="flex flex-col gap-space-5 border-b border-line py-space-5 md:flex-row md:items-center">
            <p className="font-mono text-mono-xs uppercase tracking-[0.14em] text-ink-muted md:w-32">Running</p>
            <p className="font-display text-heading-s text-ink">{about.currently.training}</p>
            {strava ? (
              <div className="grid grid-cols-2 gap-space-6 md:ml-auto">
                <Metric value={`${strava.weekly_km} km`} label="this week" />
                <Metric value={`${strava.ytd_km} km`} label="this year" />
              </div>
            ) : null}
            <Link href="/run" className="font-mono text-mono-s text-accent hover:text-accent-hover">
              the full log →
            </Link>
        </article>
      </section>

      {github ? (
        <section className="px-5 pt-[76px] md:px-[72px]">
          <SectionHeading title="Recent commits" />
          <div className="grid gap-space-6 border-y border-line py-space-6 md:grid-cols-[280px_1fr] md:items-end">
            <div className="grid grid-cols-2 gap-space-6">
              <Metric value={github.commits_30d} label="commits · 30d" />
              <Metric value={`${github.longest_streak}d`} label="longest streak" />
            </div>
            <CommitHeatmap columns={12} rows={4} data={github.heatmap} />
          </div>
        </section>
      ) : null}

      <section className="px-5 pt-[76px] md:px-[72px]">
        <SectionHeading title="Colophon" />
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
          <div className="border-t border-line">
            <DataRoute label="Running" route={["strava", "cloudflare worker", "KV", "this page"]} note="my worker · 3-hourly cron" />
            <DataRoute label="Commits" route={["github api", "48-day window", "contribution data"]} note="commits API, not the events feed" />
            <DataRoute label="Travel" route={["holitrackr", "public stats", "country geometry", "canvas"]} note="read-only owner snapshot · one-hour edge cache" />
          </div>
          <div className="border-t border-line pt-space-4">
            <p className="font-mono text-mono-xs uppercase tracking-[0.14em] text-ink-muted">This site</p>
            <p className="mt-space-4 font-mono text-mono-m leading-loose text-ink-secondary">
              <span className="text-ink">next 16</span> · react · tailwind<br />
              <span className="text-ink">vercel</span> · server components<br />
              <span className="text-ink">cloudflare</span> workers + KV
            </p>
            <Link href={about.links.repo.href} target="_blank" rel="noopener noreferrer" className="mt-space-5 inline-block font-mono text-mono-m text-accent hover:text-accent-hover">
              read the source →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
