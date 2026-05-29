// Live running stats now come from strava-worker — a separate Cloudflare Worker
// that fetches Strava on a weekly cron and caches the computed blob in KV. This
// module is just a thin client for that Worker's /data endpoint: no Strava
// secrets live in the portfolio anymore, and the page never waits on Strava's
// (slow, rate-limited) API at render time.
//
// The returned shape is identical to what this file used to compute itself, so
// callers (page.js, run/page.js) need no changes.
const STRAVA_DATA_URL =
  process.env.STRAVA_DATA_URL ??
  "https://strava-data.strava-data.workers.dev/data";

export async function fetchStravaData() {
  // `next: { revalidate }` is Next.js's native fetch cache — it bounds how often
  // we re-hit the Worker. The Worker only recomputes weekly, so hourly here just
  // caps page staleness; it's cheaper and simpler than wrapping in unstable_cache.
  const res = await fetch(STRAVA_DATA_URL, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`strava-worker /data failed: ${res.status}`);
  return res.json();
}
