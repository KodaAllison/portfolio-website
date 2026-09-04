import { unstable_cache } from "next/cache";
import { fetchWithTimeout } from "./fetch.js";

const USERNAME = "KodaAllison";
const API = "https://api.github.com";
const WINDOW_DAYS = 48; // heatmap is 12×4 tiles, one day each
const MS_PER_DAY = 86_400_000;

function headers({ authenticated = true } = {}) {
  return {
    Accept: "application/vnd.github.v3+json",
    ...(authenticated && process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  };
}

// Exported so callers can format at render time — the cached blob stores raw
// timestamps, otherwise the "Xd ago" string freezes for the cache lifetime.
// (Render-time only ticks because the home route renders per request; the
// Strava no-store fetch is what opts it in.)
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
  let res = await fetchWithTimeout(`${API}${path}`, {
    headers: headers(),
    cache: "no-store",
  });

  // A stale local token must not make public portfolio data less available
  // than GitHub's anonymous API. Retry only rejected credentials; rate limits
  // and server failures still fail the complete module rather than returning a
  // partial heatmap.
  if (res.status === 401 && process.env.GITHUB_TOKEN) {
    res = await fetchWithTimeout(`${API}${path}`, {
      headers: headers({ authenticated: false }),
      cache: "no-store",
    });
  }

  if (!res.ok) {
    const err = new Error(`github ${path} failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function _fetchGitHubData() {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  // Fetch window = exactly the heatmap's tiles: today plus the 47 days before.
  const since = new Date(todayStart.getTime() - (WINDOW_DAYS - 1) * MS_PER_DAY);
  const sinceIso = since.toISOString();

  // This used to read the events feed, but GitHub delays or drops PushEvents
  // unpredictably and PR-button merges never emit one at all — the live site
  // showed "last commit 19d ago" on a day with six pushes. The commits API is
  // the source of truth: every non-fork repo pushed within the window, commits
  // I authored on its default branch. Branch-only work appears once merged.
  // Known ceilings, fine for a personal account: 30 repos, 100 commits per
  // repo in the window, owned repos only (org contributions don't appear).
  const repos = await gh(`/users/${USERNAME}/repos?sort=pushed&per_page=30`);
  const active = repos.filter((r) => !r.fork && new Date(r.pushed_at) >= since);

  const perRepo = await Promise.all(
    active.map((r) =>
      gh(
        `/repos/${r.full_name}/commits?author=${USERNAME}&since=${sinceIso}&per_page=100`
      ).catch((err) => {
        if (err.status === 409) return []; // empty repo — safe to skip
        // Anything else (rate limit, auth) must fail the whole run: caching a
        // silently half-empty blob for an hour is worse than the page fallback.
        throw err;
      })
    )
  );
  const commits = perRepo.flat();

  // date → commit count, plus the newest timestamp. Committer date, not author
  // date: a squash commit inherits the author date from when the work was
  // written, which would re-stale "last commit" right after a merge.
  const dayMap = new Map();
  let last_commit_at = null;
  for (const c of commits) {
    const date = c.commit?.committer?.date;
    if (!date) continue;
    const key = date.slice(0, 10);
    dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
    if (!last_commit_at || date > last_commit_at) last_commit_at = date;
  }

  // commits in last 30 days
  const cutoff = new Date(now - 30 * MS_PER_DAY);
  const commits_30d = [...dayMap.entries()]
    .filter(([k]) => new Date(k) >= cutoff)
    .reduce((sum, [, n]) => sum + n, 0);

  // longest consecutive-day streak within the fetched window
  const activeDays = [...dayMap.keys()].filter((k) => dayMap.get(k) > 0).sort();
  let longest_streak = activeDays.length > 0 ? 1 : 0;
  let run = 1;
  for (let i = 1; i < activeDays.length; i++) {
    const gap = Math.round(
      (new Date(activeDays[i]) - new Date(activeDays[i - 1])) / MS_PER_DAY
    );
    run = gap === 1 ? run + 1 : 1;
    if (run > longest_streak) longest_streak = run;
  }

  // heatmap tiles (12 cols × 4 rows), oldest → newest
  const heatmap = Array.from({ length: WINDOW_DAYS }, (_, i) => {
    const d = new Date(todayStart);
    d.setUTCDate(d.getUTCDate() - (WINDOW_DAYS - 1 - i));
    return toIntensity(dayMap.get(d.toISOString().slice(0, 10)) ?? 0);
  });

  return { commits_30d, last_commit_at, longest_streak, heatmap };
}

export const fetchGitHubData = unstable_cache(
  _fetchGitHubData,
  ["github-activity"],
  { revalidate: 3600 }
);
