import Navbar from "../components/Navbar";
import TerminalWindow from "../components/TerminalWindow";
import StatusChip from "../components/StatusChip";
import SyntaxTag from "../components/SyntaxTag";
import CommitHeatmap from "../components/CommitHeatmap";
import runData from "../../data/run.json";

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

// build a fixed-width ascii bar — block-element progress for that terminal feel
function asciiBar(pct, width = 22) {
  const clamped = Math.max(0, Math.min(1, pct));
  const filled = Math.round(clamped * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

const TYPE_COLOR = { long: "terminal", tempo: "signal", easy: "cyan" };

// ──────────────────────────────────────────────────────────────────────────────

export default function RunPage() {
  const {
    marathon_pb,
    weekly_km,
    ytd_km,
    training_state,
    next_race,
    personal_records,
    recent_activity,
  } = runData;

  // normalise PR times against the slowest for a comparative bar
  const prSeconds = personal_records.map((p) => timeToSeconds(p.time));
  const maxPr = Math.max(...prSeconds);

  // weekly target (placeholder) — 80km build week
  const weeklyTarget = 80;
  const weeklyPct = Math.min(1, weekly_km / weeklyTarget);

  // YTD target (placeholder) — 3000km year
  const ytdTarget = 3000;
  const ytdPct = Math.min(1, ytd_km / ytdTarget);

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <section className="mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop pt-24 pb-24">
        {/* ── status bar — comma-separated key=value monospace stats ── */}
        <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-outline-variant pb-6 font-mono text-label-sm">
          <span className="text-on-surface-variant">
            marathon.pb = <span className="text-terminal">{marathon_pb}</span>
          </span>
          <span className="text-outline">·</span>
          <span className="text-on-surface-variant">
            weekly_km = <span className="text-cyan">{weekly_km}</span>
          </span>
          <span className="text-outline">·</span>
          <span className="text-on-surface-variant">
            ytd_km = <span className="text-signal">{ytd_km.toLocaleString()}</span>
          </span>
          <span className="text-outline">·</span>
          <span className="text-on-surface-variant">
            next_race = <span className="text-cyan">&quot;{next_race}&quot;</span>
          </span>
          <span className="ml-auto inline-flex items-center gap-2 text-on-surface-variant">
            <span className="h-2 w-2 rounded-full bg-terminal animate-pulse" aria-hidden />
            <span className="uppercase tracking-widest">live_data_feed</span>
          </span>
        </div>

        {/* ── hero ── */}
        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-label-md text-outline">
              {"/* 02 · running.log */"}
            </p>

            <h1 className="mt-3 font-display text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tighter">
              <span className="block text-cyan">const</span>
              <span className="block text-terminal">running.log</span>
              <span className="block italic text-on-surface">// chasing sub-3:30.</span>
            </h1>

            <p className="mt-6 max-w-xl font-mono text-body-md text-on-surface-variant">
              <span className="text-cyan">// </span>
              splits, blocks, blowups. an honest record of the long road to a
              negative-split marathon. data is{" "}
              <span className="text-signal">placeholder</span> until the strava
              hook ships.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <StatusChip color="terminal" pulse glow>training</StatusChip>
              <SyntaxTag color="terminal" variant="raw">{training_state}</SyntaxTag>
              <SyntaxTag color="cyan" variant="raw">{`next → ${next_race}`}</SyntaxTag>
              <SyntaxTag color="signal" variant="flag">strava-pending</SyntaxTag>
            </div>
          </div>

          {/* ── hero stats card ── */}
          <div className="lg:col-span-5">
            <TerminalWindow title="stats.json" subtitle="readonly" glow>
              <div className="space-y-4 font-mono text-body-md">
                <div className="text-outline">{"{"}</div>

                <div className="grid grid-cols-[110px_1fr] items-baseline pl-4">
                  <span className="text-on-surface-variant">marathon:</span>
                  <span>
                    <span className="text-terminal">{`"${marathon_pb}"`}</span>
                    <span className="text-outline">,</span>
                  </span>
                </div>

                <div className="grid grid-cols-[110px_1fr] items-baseline pl-4">
                  <span className="text-on-surface-variant">weekly_km:</span>
                  <span>
                    <span className="text-cyan">{weekly_km}</span>
                    <span className="text-outline">,</span>
                    <span className="ml-3 text-outline">{`// target ${weeklyTarget}`}</span>
                  </span>
                </div>

                <div className="grid grid-cols-[110px_1fr] items-baseline pl-4">
                  <span className="text-on-surface-variant">ytd_km:</span>
                  <span>
                    <span className="text-signal">{ytd_km}</span>
                    <span className="text-outline">,</span>
                    <span className="ml-3 text-outline">{`// of ${ytdTarget}`}</span>
                  </span>
                </div>

                <div className="grid grid-cols-[110px_1fr] items-baseline pl-4">
                  <span className="text-on-surface-variant">block:</span>
                  <span>
                    <span className="text-cyan">{`"${training_state}"`}</span>
                  </span>
                </div>

                <div className="text-outline">{"}"}</div>

                {/* mini progress bars under the JSON */}
                <div className="mt-6 space-y-3 border-t border-outline-variant pt-5">
                  <div className="flex items-center gap-3 text-label-sm">
                    <span className="w-16 text-outline">weekly</span>
                    <span className="flex-1 tracking-tighter text-terminal">
                      {asciiBar(weeklyPct, 18)}
                    </span>
                    <span className="w-12 text-right text-on-surface-variant">
                      {Math.round(weeklyPct * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-label-sm">
                    <span className="w-16 text-outline">ytd</span>
                    <span className="flex-1 tracking-tighter text-signal">
                      {asciiBar(ytdPct, 18)}
                    </span>
                    <span className="w-12 text-right text-on-surface-variant">
                      {Math.round(ytdPct * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </TerminalWindow>
          </div>
        </div>

        {/* ── activity heatmap + PR list ── */}
        <div className="mt-16 grid grid-cols-1 gap-gutter lg:grid-cols-12">
          {/* heatmap */}
          <div className="lg:col-span-7">
            <TerminalWindow title="activity.heatmap" subtitle="last 48 days">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-headline-md text-on-surface">
                    distance per day
                  </h2>
                  <p className="font-mono text-label-sm text-outline">
                    <span className="text-cyan">$</span> strava heatmap{" "}
                    <span className="text-signal">--window=48d</span>
                  </p>
                </div>
                <StatusChip color="cyan" pulse>synced</StatusChip>
              </div>

              <CommitHeatmap columns={12} rows={4} seed={7} />

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-outline-variant pt-4 font-mono text-label-sm text-on-surface-variant">
                <span>
                  streak ={" "}
                  <span className="text-terminal">12</span>
                  <span className="text-outline"> days</span>
                </span>
                <span>
                  rest_days ={" "}
                  <span className="text-cyan">9</span>
                </span>
                <span>
                  longest ={" "}
                  <span className="text-signal">18.2 km</span>
                </span>
              </div>
            </TerminalWindow>
          </div>

          {/* PR list */}
          <div className="lg:col-span-5">
            <TerminalWindow title="personal_records.js" subtitle="pbs[]" glow>
              <div className="space-y-1 font-mono text-body-md">
                <div>
                  <span className="text-cyan">export const</span>{" "}
                  <span className="text-signal">pbs</span>{" "}
                  <span className="text-outline">=</span> [
                </div>

                {personal_records.map((pr, i) => {
                  const sec = timeToSeconds(pr.time);
                  // shorter time = stronger bar
                  const strength = Math.max(0.25, 1 - (sec / maxPr) * 0.75);
                  const isMarathon = pr.distance === "Marathon";
                  const isHalf = pr.distance === "Half";
                  const barColor = isMarathon
                    ? "text-terminal"
                    : isHalf
                    ? "text-signal"
                    : "text-cyan";

                  return (
                    <div key={pr.distance} className="pl-4">
                      <div className="grid grid-cols-[90px_1fr_auto] items-baseline gap-x-3">
                        <span className="text-on-surface-variant">
                          {pr.distance.toLowerCase()}:
                        </span>
                        <span className={`tracking-tighter ${barColor}`}>
                          {asciiBar(strength, 16)}
                        </span>
                        <span>
                          <span className="text-signal">{`"${pr.time}"`}</span>
                          {i < personal_records.length - 1 ? (
                            <span className="text-outline">,</span>
                          ) : null}
                        </span>
                      </div>
                      <div className="grid grid-cols-[90px_1fr] pl-0">
                        <span />
                        <span className="text-label-sm text-outline">
                          {`// ${pr.note} · ${pr.date}`}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <div>];</div>

                <div className="mt-4 border-t border-outline-variant pt-4 text-label-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-[3px] bg-cyan" aria-hidden />
                    <span className="uppercase tracking-widest text-on-surface-variant">
                      note
                    </span>
                  </div>
                  <p className="mt-2 italic leading-relaxed text-outline">
                    {"// "}sub-3:30 in york is the goal. half PB suggests
                    fitness is there — pacing the long drag from 28k is the
                    open question.
                  </p>
                </div>
              </div>
            </TerminalWindow>
          </div>
        </div>

        {/* ── recent activity log ── */}
        <div className="mt-16">
          <TerminalWindow title="recent.log" subtitle={`tail -n ${recent_activity.length}`}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-headline-md text-on-surface">
                  recent activity
                </h2>
                <p className="font-mono text-label-sm text-outline">
                  <span className="text-cyan">$</span> strava log{" "}
                  <span className="text-signal">--limit=6</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <SyntaxTag color="terminal" variant="bracket">long</SyntaxTag>
                <SyntaxTag color="signal" variant="bracket">tempo</SyntaxTag>
                <SyntaxTag color="cyan" variant="bracket">easy</SyntaxTag>
              </div>
            </div>

            {/* header row */}
            <div className="hidden md:grid grid-cols-[96px_72px_1fr_72px_64px_64px_96px] gap-x-4 border-b border-outline-variant pb-2 font-mono text-label-sm uppercase tracking-widest text-outline">
              <span>date</span>
              <span>dist</span>
              <span>load</span>
              <span>pace</span>
              <span>hr</span>
              <span>elev</span>
              <span className="text-right">type</span>
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

                return (
                  <li
                    key={a.date}
                    className="grid grid-cols-[96px_72px_1fr_72px_64px_64px_96px] items-center gap-x-4 py-3"
                  >
                    <span className="text-outline">{a.date}</span>
                    <span className={distColor}>
                      {a.distance_km.toFixed(1)}
                      <span className="ml-0.5 text-outline">km</span>
                    </span>
                    <span className={`tracking-tighter ${distColor} hidden md:inline`}>
                      {asciiBar(distPct, 20)}
                    </span>
                    <span className="text-on-surface-variant">
                      {a.pace}
                      <span className="ml-0.5 text-outline">/km</span>
                    </span>
                    <span className="text-on-surface-variant hidden md:inline">
                      {a.hr}
                    </span>
                    <span className="text-on-surface-variant hidden md:inline">
                      +{a.elev_m}m
                    </span>
                    <span className="justify-self-end">
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
          {"// "}all numbers above are placeholder. real splits land when the{" "}
          <span className="text-cyan">strava</span> integration ships in a
          follow-up PR.
        </p>
      </section>
    </main>
  );
}
