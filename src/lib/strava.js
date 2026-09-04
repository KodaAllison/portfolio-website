// Live running stats now come from strava-worker — a separate Cloudflare Worker
// that fetches Strava on a 3-hourly cron and caches the computed blob in KV.
// This module is just a thin client for that Worker's /data endpoint: no Strava
// secrets live in the portfolio anymore, and the page never waits on Strava's
// (slow, rate-limited) API at render time.
//
// The returned shape is identical to what this file used to compute itself, so
// callers (page.js, run/page.js) need no changes.
import { fetchWithTimeout } from "./fetch.js";

const STRAVA_DATA_URL =
  process.env.STRAVA_DATA_URL ??
  "https://strava-data.strava-data.workers.dev/data";

export async function fetchStravaData() {
  // `no-store` opts the consuming pages into per-request rendering. ISR looked
  // cheaper, but on a low-traffic site every cold visit fell back to the HTML
  // prerendered at the last *deploy*, which drifts months stale between pushes.
  // The Worker endpoint is a KV read behind a 5-minute edge cache, so hitting
  // it on every request is fast and always fresh.
  const res = await fetchWithTimeout(STRAVA_DATA_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`strava-worker /data failed: ${res.status}`);
  return res.json();
}
