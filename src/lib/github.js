import { unstable_cache } from "next/cache";

const USERNAME = "KodaAllison";
const API = "https://api.github.com";

function headers() {
  return {
    Accept: "application/vnd.github.v3+json",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  };
}

function relativeTime(isoString) {
  const hours = Math.floor((Date.now() - new Date(isoString)) / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function toIntensity(count) {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 7) return 3;
  return 4;
}

async function _fetchGitHubData() {
  // 3 pages × 100 events covers 30+ days for typical activity
  const pages = await Promise.all(
    [1, 2, 3].map((page) =>
      fetch(`${API}/users/${USERNAME}/events?per_page=100&page=${page}`, {
        headers: headers(),
        cache: "no-store",
      }).then((r) => (r.ok ? r.json() : []))
    )
  );

  const pushEvents = pages.flat().filter((e) => e.type === "PushEvent");

  // date → commit count
  const dayMap = new Map();
  for (const event of pushEvents) {
    const key = new Date(event.created_at).toISOString().slice(0, 10);
    // `commits` array requires auth; `size`/`distinct_size` are authenticated fallbacks;
    // fall back to 1 so push events still register without a token
    const count = event.payload?.commits?.length
      ?? event.payload?.size
      ?? event.payload?.distinct_size
      ?? 1;
    dayMap.set(key, (dayMap.get(key) ?? 0) + count);
  }

  const now = new Date();

  // commits in last 30 days
  const cutoff = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const commits_30d = [...dayMap.entries()]
    .filter(([k]) => new Date(k) >= cutoff)
    .reduce((sum, [, n]) => sum + n, 0);

  // last commit as relative string
  const last_commit = pushEvents.length > 0
    ? relativeTime(pushEvents[0].created_at)
    : "n/a";

  // longest consecutive-day streak within the fetched window
  const activeDays = [...dayMap.keys()].filter((k) => dayMap.get(k) > 0).sort();
  let longest_streak = activeDays.length > 0 ? 1 : 0;
  let run = 1;
  for (let i = 1; i < activeDays.length; i++) {
    const gap = Math.round(
      (new Date(activeDays[i]) - new Date(activeDays[i - 1])) / 86_400_000
    );
    run = gap === 1 ? run + 1 : 1;
    if (run > longest_streak) longest_streak = run;
  }

  // 48-tile heatmap (12 cols × 4 rows), oldest → newest
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  const heatmap = Array.from({ length: 48 }, (_, i) => {
    const d = new Date(todayStart);
    d.setUTCDate(d.getUTCDate() - (47 - i));
    return toIntensity(dayMap.get(d.toISOString().slice(0, 10)) ?? 0);
  });

  return { commits_30d, last_commit, longest_streak, heatmap };
}

export const fetchGitHubData = unstable_cache(
  _fetchGitHubData,
  ["github-activity"],
  { revalidate: 3600 }
);
