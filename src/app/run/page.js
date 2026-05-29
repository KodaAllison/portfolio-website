import Navbar from "../components/Navbar";
import TerminalWindow from "../components/TerminalWindow";
import StatusChip from "../components/StatusChip";
import SyntaxTag from "../components/SyntaxTag";
import WeeklyLine from "../components/WeeklyLine";
import runData from "../../data/run.json";
import { fetchStravaData } from "@/lib/strava";

export const metadata = { title: "Run | Koda Allison" };

// ──────────────────────────────────────────────────────────────────────────────
// helpers — pure, server-rendered
// ──────────────────────────────────────────────────────────────────────────────

// parse "h:mm:ss" or "mm:ss" → seconds
function timeToSeconds(t) {
  const parts = t.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(t) || 0;
}

// pretty-print a goal time: strip a trailing ":00" so 1:45:00 → 1:45, 4:00:00 → 4:00 (mm:ss unchanged)
function prettyGoal(t) {
  const parts = t.split(":");
  if (parts.length === 3 && parts[2] === "00") return `${parts[0]}:${parts[1]}`;
  return t;
}

// per-distance accent (literal class strings so Tailwind keeps them)
const PR_ACCENT = {
  terminal: { text: "text-terminal", bg: "bg-terminal" },
  signal: { text: "text-signal", bg: "bg-signal" },
  cyan: { text: "text-cyan", bg: "bg-cyan" },
};

const TYPE_COLOR = { long: "terminal", tempo: "signal", easy: "cyan" };

function hrZoneColor(hr) {
  if (!hr) return "text-outline";
  if (hr < 140) return "text-[#ffd0d0]";
  if (hr < 160) return "text-[#ff7878]";
  return "text-[#ff0000]";
}

// ──────────────────────────────────────────────────────────────────────────────

export default async function RunPage() {
  // training_state + next_race are manual config and stay in run.json. Everything
  // Strava-derived (live stats AND personal records) now comes from the Worker;
  // run.json's personal_records is only a fallback if the Worker is unreachable.
  const { training_state, next_race } = runData;

  let weekly_km = 0;
  let avg_weekly_km = 0;
  let ytd_km = 0;
  let ytd_runs = 0;
  const year = new Date().getFullYear();
  let all_time = { runs: 0, km: 0, elevation_m: 0 };
  let recent_activity = [];
  let weekly_bars = [];
  let streak = 0;
  let rest_days = 0;
  let longest_km = "0.0";
  let personal_records = runData.personal_records;

  try {
    ({ weekly_km, avg_weekly_km, ytd_km, ytd_runs, all_time, recent_activity, weekly_bars, streak, rest_days, longest_km, personal_records } =
      await fetchStravaData());
  } catch (err) {
    console.error("[run/page] strava-worker fetch failed, showing zeros:", err.message);
  }

  // `goal` is a manual target (aspirational, not Strava data), so it stays in
  // run.json. The Worker supplies the actual time/date/note; merge the goal back
  // on by distance. (?? handles the fallback case where personal_records already
  // came from run.json and thus already carries goal.)
  const goalByDistance = Object.fromEntries(
    runData.personal_records.map((p) => [p.distance, p.goal])
  );
  personal_records = personal_records.map((p) => ({
    ...p,
    goal: p.goal ?? goalByDistance[p.distance],
  }));

  const marathonPr = personal_records.find((p) => p.distance === "Marathon");

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <section className="mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop pt-24 pb-20">
        {/* ── hero ── */}
        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-4">
              <p className="font-mono text-label-md text-cyan">
                {"/* 03 · running.log */"}
              </p>
            </div>

            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tighter md:text-7xl">
              <span className="block text-cyan">const</span>
              <span className="block text-terminal">running.log</span>
              <span className="block italic text-on-surface">// chasing sub-4:00.</span>
            </h1>

            <p className="mt-6 max-w-xl font-mono text-body-md leading-relaxed text-on-surface-variant">
              <span className="text-cyan">// </span>
              live data pulled from Strava API.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <StatusChip color="terminal" pulse glow>training</StatusChip>
              <SyntaxTag color="terminal" variant="raw">{training_state}</SyntaxTag>
              <SyntaxTag color="cyan" variant="raw">{`next → ${next_race}`}</SyntaxTag>
              <SyntaxTag color="signal" variant="flag">strava-live</SyntaxTag>
            </div>
          </div>

          {/* ── hero stats card ── */}
          <div className="lg:col-span-5">
            <TerminalWindow title="stats.json" subtitle="readonly" glow>
              <div className="space-y-4 font-mono text-body-md">
                <div className="text-outline">{"{"}</div>

                <div className="grid grid-cols-[140px_1fr] items-baseline pl-4">
                  <span className="text-on-surface-variant">marathon_pb:</span>
                  <span>
                    <span className="text-terminal">{marathonPr?.time ?? "—"}</span>
                    <span className="text-outline">,</span>
                  </span>
                </div>

                <div className="grid grid-cols-[140px_1fr] items-baseline pl-4">
                  <span className="text-on-surface-variant">this_week_km:</span>
                  <span>
                    <span className="text-cyan">{weekly_km}</span>
                    <span className="text-outline">,</span>
                  </span>
                </div>

                <div className="grid grid-cols-[140px_1fr] items-baseline pl-4">
                  <span className="text-on-surface-variant">avg_weekly_km:</span>
                  <span>
                    <span className="text-cyan">{avg_weekly_km}</span>
                    <span className="text-outline">,</span>
                  </span>
                </div>

                <div className="grid grid-cols-[140px_1fr] items-baseline pl-4">
                  <span className="text-on-surface-variant">this_year_km:</span>
                  <span>
                    <span className="text-signal">{ytd_km}</span>
                    <span className="text-outline">,</span>
                  </span>
                </div>

                <div className="grid grid-cols-[140px_1fr] items-baseline pl-4">
                  <span className="text-on-surface-variant">this_year_runs:</span>
                  <span>
                    <span className="text-terminal">{ytd_runs}</span>
                    <span className="text-outline">,</span>
                  </span>
                </div>

                <div className="grid grid-cols-[140px_1fr] items-baseline pl-4">
                  <span className="text-on-surface-variant">training_block:</span>
                  <span>
                    <span className="text-cyan">{`"${training_state}"`}</span>
                  </span>
                </div>

                <div className="text-outline">{"}"}</div>
              </div>
            </TerminalWindow>
          </div>
        </div>

        {/* ── training load + PR list ── */}
        <div className="mt-10 grid grid-cols-1 gap-gutter lg:grid-cols-12">
          {/* weekly bars */}
          <div className="flex lg:col-span-7">
            <TerminalWindow
              title="training.load"
              subtitle="last 16 weeks"
              className="flex-1 flex flex-col"
              bodyClass="p-6 flex flex-col flex-1"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-headline-md text-on-surface">
                    weekly mileage
                  </h2>
                  <p className="font-mono text-label-sm text-outline">
                    <span className="text-cyan">$</span> strava log{" "}
                    <span className="text-signal">--group=week --window=16w</span>
                  </p>
                </div>
                <StatusChip color="cyan" pulse>synced</StatusChip>
              </div>

              <div className="flex flex-1 flex-col">
                <WeeklyLine data={weekly_bars} className="flex-1" />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-outline-variant pt-4 font-mono text-label-sm text-on-surface-variant">
                <span>
                  streak ={" "}
                  <span className="text-terminal">{streak}</span>
                  <span className="text-outline"> days</span>
                </span>
                <span>
                  rest_days ={" "}
                  <span className="text-cyan">{rest_days}</span>
                </span>
                <span>
                  longest ={" "}
                  <span className="text-signal">{longest_km} km</span>
                </span>
              </div>
            </TerminalWindow>
          </div>

          {/* PR list */}
          <div className="flex lg:col-span-5">
            <TerminalWindow title="personal_records.js" subtitle="pbs[]" glow className="flex-1 flex flex-col" bodyClass="p-6 flex flex-col flex-1">
              <div className="space-y-6 mb-2 ">
                {personal_records.map((pr) => {
                  const goalSec = timeToSeconds(pr.goal);
                  const curSec = timeToSeconds(pr.time);
                  // progress along the journey from a baseline (30% slower than goal) up to the goal
                  const fill = Math.max(
                    0,
                    Math.min(1, (goalSec * 1.3 - curSec) / (goalSec * 0.3)),
                  );
                  const pct = Math.round(fill * 100);
                  const achieved = curSec <= goalSec;
                  const isMarathon = pr.distance === "Marathon";
                  const isHalf = pr.distance === "Half";
                  const accent =
                    achieved || isMarathon
                      ? PR_ACCENT.terminal
                      : isHalf
                      ? PR_ACCENT.signal
                      : PR_ACCENT.cyan;

                  return (
                    <div key={pr.distance}>
                      {/* distance + the PB itself */}
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">
                          {pr.distance}
                        </span>
                        <span className={`text-xl font-bold ${accent.text}`}>
                          {pr.time}
                        </span>
                      </div>

                      {/* where / when this PB was set */}
                      <div className="mt-0.5 text-right text-label-sm text-outline">
                        {pr.note} · {pr.date}
                      </div>

                      {/* progress toward goal */}
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-sm bg-surface-container-high">
                        <div
                          className={`h-full ${accent.bg}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex items-baseline justify-between text-label-sm">
                        <span className="text-outline">
                          goal sub-{prettyGoal(pr.goal)}
                        </span>
                        <span
                          className={
                            achieved ? accent.text : "text-on-surface-variant"
                          }
                        >
                          {achieved ? "done ✓" : `${pct}% there`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
                
              <div className="mt-auto border-t border-outline-variant pt-4 font-mono text-label-sm text-on-surface-variant">
                <span className="text-terminal">$</span>{" "}
                <span className="text-outline">node pbs.js</span>{" "}
                <span className="text-signal">--sort=distance</span>              </div>
            </TerminalWindow>
          </div>
        </div>

        {/* ── recent activity log ── */}
        <div className="mt-10">
          <TerminalWindow title="recent.log" subtitle={`tail -n ${recent_activity.length}`}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-headline-md text-on-surface">
                  recent activity
                </h2>
                <p className="font-mono text-label-sm text-outline">
                  <span className="text-cyan">$</span> strava log{" "}
                  <span className="text-signal">--limit=8</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-label-sm">
                <span className="text-outline">hr:</span>
                <span className="text-[#ffd0d0]">&lt;140 easy</span>
                <span className="text-outline">·</span>
                <span className="text-[#ff7878]">140–160 aerobic</span>
                <span className="text-outline">·</span>
                <span className="text-[#ff0000]">160+ threshold</span>
              </div>
            </div>

            {/* header row */}
            <div className="hidden md:grid md:grid-cols-[96px_72px_80px_52px_72px_88px] lg:grid-cols-[96px_72px_1fr_80px_52px_72px_88px] gap-x-6 border-b border-outline-variant pb-2 font-mono text-label-sm uppercase tracking-widest text-outline">
              <span>date</span>
              <span>dist</span>
              <span className="hidden lg:block">load</span>
              <span>pace</span>
              <span>hr</span>
              <span>elev</span>
              <span>type</span>
            </div>

            <ul className="divide-y divide-outline-variant font-mono text-body-md">
              {recent_activity.map((a) => {
                const longestDist = Math.max(
                  ...recent_activity.map((x) => x.distance_km),
                );
                const distPct = a.distance_km / longestDist;
                const tagColor = TYPE_COLOR[a.type] ?? "muted";
                const distColor =
                  a.type === "long"
                    ? "text-terminal"
                    : a.type === "tempo"
                    ? "text-signal"
                    : "text-cyan";
                const distBgColor =
                  a.type === "long"
                    ? "bg-terminal"
                    : a.type === "tempo"
                    ? "bg-signal"
                    : "bg-cyan";

                return (
                  <li
                    key={a.date}
                    className="grid grid-cols-[90px_52px_64px_1fr] gap-x-3 md:grid-cols-[96px_72px_80px_52px_72px_88px] md:gap-x-6 lg:grid-cols-[96px_72px_1fr_80px_52px_72px_88px] items-center py-3"
                  >
                    <span className="text-outline">{a.date}</span>
                    <span className={distColor}>
                      {a.distance_km.toFixed(1)}
                      <span className="ml-0.5 text-outline">km</span>
                    </span>
                    <span className="hidden lg:block relative h-[3px] w-full bg-outline-variant">
                      <span
                        className={`absolute inset-y-0 left-0 ${distBgColor}`}
                        style={{ width: `${distPct * 100}%` }}
                      />
                    </span>
                    <span className="text-on-surface-variant">
                      {a.pace}
                      <span className="ml-0.5 text-outline">/km</span>
                    </span>
                    <span className={`hidden md:inline ${hrZoneColor(a.hr)}`}>
                      {a.hr ?? "—"}
                    </span>
                    <span className="text-on-surface-variant hidden md:inline">
                      +{a.elev_m}m
                    </span>
                    <span>
                      <SyntaxTag color={tagColor} variant="raw">
                        {a.type}
                      </SyntaxTag>
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* terminal prompt */}
            <div className="mt-6 border-t border-outline-variant pt-4 font-mono text-label-sm text-on-surface-variant">
              <span className="text-terminal">$</span>{" "}
              <span className="text-outline">strava log</span>{" "}
              <span className="text-signal">--follow</span>
              <span className="blink-cursor" />
            </div>
          </TerminalWindow>
        </div>

        {/* ── footer note ── */}
        <p className="mt-12 font-mono text-label-sm text-outline">
          {"// "}data via{" "}
          <span className="text-cyan">strava</span>. refreshed every hour.
          personal records are manually maintained.
        </p>
      </section>
    </main>
  );
}
