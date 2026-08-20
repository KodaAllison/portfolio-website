import { unstable_cache } from "next/cache";

const USERNAME = "KodaAllison";
const API = "https://api.github.com";
const WINDOW_DAYS = 48; // heatmap is 12×4 tiles, one day each

function headers() {
  return {
    Accept: "application/vnd.github.v3+json",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  };
}

// Exported so callers can format at render time — the cached blob stores raw
// timestamps, otherwise the "Xd ago" string freezes for the cache lifetime.
export function relativeTime(isoString) {
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

async function gh(path) {
  const res = await fetch(`${API}${path}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`github ${path} failed: ${res.status}`);
  return res.json();
}

async function _fetchGitHubData() {
  const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000);
  const sinceIso = since.toISOString();

  // This used to read the events feed, but GitHub delays or drops PushEvents
  // unpredictably and PR-button merges never emit one at all — the live site
  // showed "last commit 19d ago" on a day with six pushes. The commits API is
  // the source of truth: every non-fork repo pushed within the window, commits
  // I authored on its default branch. Branch-only work appears once merged.
  const repos = await gh(`/users/${USERNAME}/repos?sort=pushed&per_page=30`);
  const active = repos.filter((r) => !r.fork && new Date(r.pushed_at) >= since);

  const perRepo = await Promise.all(
    active.map((r) =>
      gh(
        `/repos/${r.full_name}/commits?author=${USERNAME}&since=${sinceIso}&per_page=100`
      ).catch(() => []) // empty repos 409; one bad repo shouldn't sink the rest
    )
  );
  const commits = perRepo.flat();

  // date → commit count, plus the newest author timestamp
  const dayMap = new Map();
  let last_commit_at = null;
  for (const c of commits) {
    const date = c.commit?.author?.date;
    if (!date) continue;
    const key = date.slice(0, 10);
    dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
    if (!last_commit_at || date > last_commit_at) last_commit_at = date;
  }

  const now = new Date();

  // commits in last 30 days
  const cutoff = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const commits_30d = [...dayMap.entries()]
    .filter(([k]) => new Date(k) >= cutoff)
    .reduce((sum, [, n]) => sum + n, 0);

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

  return { commits_30d, last_commit_at, longest_streak, heatmap };
}

export const fetchGitHubData = unstable_cache(
  _fetchGitHubData,
  ["github-activity"],
  { revalidate: 3600 }
);
