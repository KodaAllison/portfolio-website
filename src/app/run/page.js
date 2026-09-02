import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import WeeklyLine from "../components/WeeklyLine";
import WeeklyBars from "../components/WeeklyBars";
import runData from "../../data/run.json";
import { fetchStravaData } from "@/lib/strava";

export const metadata = {
  title: "Running | Koda Allison",
  description: "Koda Allison's running log, with live mileage and personal records from Strava.",
  alternates: { canonical: "/run" },
};

function timeToSeconds(time) {
  const parts = time.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return parts[0] * 60 + parts[1];
}

function goalLabel(time) {
  return time.endsWith(":00") ? time.slice(0, -3) : time;
}

function Stat({ label, value }) {
  return (
    <div className="border-t border-line pt-space-4">
      <dt className="font-mono text-mono-xs uppercase tracking-[0.14em] text-ink-muted">{label}</dt>
      <dd className="mt-space-2 font-display text-display-m tabular-nums text-ink">{value}</dd>
    </div>
  );
}

export default async function RunPage() {
  let strava;
  try {
    strava = await fetchStravaData();
  } catch {
    strava = undefined;
  }

  const goals = Object.fromEntries(runData.personal_records.map((record) => [record.distance, record.goal]));
  const records = (strava?.personal_records ?? []).map((record) => ({
    ...record,
    goal: record.goal ?? goals[record.distance],
  }));
  const marathon = records.find((record) => record.distance === "Marathon");

  return (
    <main className="min-h-screen">
      <Navbar />

      <header className="border-b border-line px-5 pb-space-7 pt-[88px] md:px-[72px] md:pb-14 md:pt-28">
        <p className="font-mono text-mono-xs uppercase tracking-[0.14em] text-accent">Running · via Strava</p>
        <h1 className="mt-space-4 font-display text-display-l uppercase text-ink">
          Chasing sub-4:00<span className="text-accent">.</span>
        </h1>
        <p className="mt-space-5 max-w-2xl text-body-l text-ink-lead">
          Marathon #3 · next up {runData.next_race.replaceAll(".", " ")} · current block: {runData.training_state}
        </p>
      </header>

      {strava ? (
        <>
          <section className="px-5 pt-[76px] md:px-[72px]">
            <dl className="grid grid-cols-2 gap-x-space-6 gap-y-space-7 md:grid-cols-4">
              {marathon ? <Stat label="Marathon PB" value={marathon.time} /> : null}
              <Stat label="This week" value={`${strava.weekly_km} km`} />
              <Stat label="This year" value={`${strava.ytd_km} km`} />
              <Stat label="Runs this year" value={strava.ytd_runs} />
            </dl>
          </section>

          {strava.weekly_bars?.length > 1 ? (
            <section className="px-5 pt-[76px] md:px-[72px]">
              <div className="mb-space-5 flex items-baseline justify-between gap-space-3">
                <h2 className="font-display text-heading-l text-ink">Weekly mileage</h2>
                <span className="font-mono text-mono-xs text-ink-muted">last {strava.weekly_bars.length} weeks</span>
              </div>
              <div className="h-[340px] border-y border-line py-space-5">
                <div className="h-full md:hidden"><WeeklyBars data={strava.weekly_bars.slice(-8)} /></div>
                <div className="hidden h-full md:block"><WeeklyLine data={strava.weekly_bars} /></div>
              </div>
            </section>
          ) : null}

          {records.length ? (
            <section className="px-5 pt-[76px] md:px-[72px]">
              <div className="mb-space-5 flex items-baseline justify-between gap-space-3">
                <h2 className="font-display text-heading-l text-ink">Personal records</h2>
                <span className="font-mono text-mono-xs text-ink-muted">progress to goal</span>
              </div>
              <div className="grid border-t border-line md:grid-cols-2">
                {records.map((record) => {
                  const current = timeToSeconds(record.time);
                  const target = timeToSeconds(record.goal);
                  const progress = Math.max(0, Math.min(100, Math.round(((target * 1.3 - current) / (target * 0.3)) * 100)));
                  return (
                    <article key={record.distance} className="border-b border-line-subtle py-space-5 md:odd:pr-space-6 md:even:border-l md:even:border-line md:even:pl-space-6">
                      <div className="flex items-baseline justify-between gap-space-4">
                        <h3 className="font-mono text-mono-xs uppercase tracking-[0.14em] text-ink-muted">{record.distance}</h3>
                        <p className="font-display text-heading-m tabular-nums text-ink">{record.time}</p>
                      </div>
                      <div className="mt-space-4 h-1 bg-surface">
                        <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="mt-space-2 flex justify-between gap-space-4 font-mono text-mono-xs text-ink-muted">
                        <span>goal sub-{goalLabel(record.goal)}</span>
                        <span>{progress}%</span>
                      </div>
                      <p className="mt-space-3 text-body-m text-ink-secondary">{record.note} · {record.date}</p>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {strava.recent_activity?.length ? (
            <section className="px-5 pt-[76px] md:px-[72px]">
              <div className="mb-space-5 flex items-baseline justify-between gap-space-3">
                <h2 className="font-display text-heading-l text-ink">Recent activity</h2>
                <span className="font-mono text-mono-xs text-ink-muted">last {strava.recent_activity.length} runs</span>
              </div>
              <div className="hidden overflow-x-auto border-t border-line md:block">
                <div className="min-w-[680px]">
                  <div className="grid grid-cols-[120px_1fr_100px_110px_90px] gap-space-5 border-b border-line py-space-3 font-mono text-mono-xs uppercase tracking-[0.14em] text-ink-muted">
                    <span>Date</span><span>Run</span><span>Dist</span><span>Pace</span><span>Type</span>
                  </div>
                  <ol>
                    {strava.recent_activity.map((activity) => (
                      <li key={`${activity.date}-${activity.name ?? activity.distance_km}`} className="grid grid-cols-[120px_1fr_100px_110px_90px] gap-space-5 border-b border-line-subtle py-space-4 text-body-m">
                        <span className="font-mono text-mono-s text-ink-muted">{activity.date}</span>
                        <span className="text-ink">{activity.name ?? "Run"}</span>
                        <span className="font-mono text-mono-s text-ink">{activity.distance_km.toFixed(1)} km</span>
                        <span className="font-mono text-mono-s text-ink-secondary">{activity.pace} /km</span>
                        <span className="font-mono text-mono-s text-accent">{activity.type ?? "run"}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <ol className="border-t border-line md:hidden">
                {strava.recent_activity.map((activity) => (
                  <li key={`mobile-${activity.date}-${activity.distance_km}`} className="border-b border-line-subtle py-space-4">
                    <div className="flex items-baseline justify-between gap-space-4">
                      <span className="font-mono text-mono-xs text-ink-muted">{activity.date}</span>
                      <span className="font-mono text-mono-xs text-accent">{activity.type ?? "run"}</span>
                    </div>
                    <div className="mt-space-2 flex items-baseline justify-between gap-space-4">
                      <span className="font-display text-heading-s text-ink">{activity.name ?? "Run"}</span>
                      <span className="font-mono text-mono-m text-ink">{activity.distance_km.toFixed(1)} km</span>
                    </div>
                    <p className="mt-space-1 font-mono text-mono-xs text-ink-secondary">{activity.pace} /km</p>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </>
      ) : (
        <section className="px-5 pt-[76px] md:px-[72px]">
          <div className="border-y border-line py-space-6">
            <p className="font-display text-heading-m text-ink">The live log is between syncs.</p>
            <p className="mt-space-2 max-w-xl text-body-m text-ink-secondary">
              The Strava worker did not answer this request, so this page is not substituting old records or zeroes.
            </p>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
