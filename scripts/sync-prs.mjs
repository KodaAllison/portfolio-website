#!/usr/bin/env node
// scripts/sync-prs.mjs
//
// Walks Strava activity history newest → oldest, fetches detailed data for
// each run, and collects best_efforts where pr_rank === 1 (Strava's current
// all-time PR marker). Stops as soon as all four target distances are found.
// Updates src/data/run.json only if something changed.
//
// Required env vars:
//   STRAVA_CLIENT_ID
//   STRAVA_CLIENT_SECRET
//   STRAVA_REFRESH_TOKEN
//
// Run locally:
//   node --env-file=.env.local scripts/sync-prs.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dir = dirname(fileURLToPath(import.meta.url));
const RUN_JSON = join(__dir, "../src/data/run.json");
const API = "https://www.strava.com/api/v3";

// Maps Strava best_effort names (lowercase) → run.json distance labels
const DISTANCE_MAP = {
  "5k":            "5K",
  "10k":           "10K",
  "half-marathon": "Half",
  "marathon":      "Marathon",
};

const TARGETS = new Set(Object.values(DISTANCE_MAP));

const LOOKBACK_DAYS = 90;

// Minimum activity distance (metres) needed to contain each PR target.
// Used to skip detail fetches for runs that are too short to matter.
const MIN_DIST = { "5K": 4800, "10K": 9800, "Half": 20800, "Marathon": 41800 };

// Tracks remaining 15-min quota from Strava response headers
let rateLimitRemaining = 95;

// ── Strava API ────────────────────────────────────────────────────────────────

async function getAccessToken() {
  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id:     process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type:    "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
  const { access_token } = await res.json();
  return access_token;
}

async function apiFetch(path, token) {
  if (rateLimitRemaining < 15) {
    console.log(`  [rate] Only ${rateLimitRemaining} requests left — pausing 60s...`);
    await new Promise((r) => setTimeout(r, 60_000));
  }
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const usage = res.headers.get("X-RateLimit-Usage");
  const limit = res.headers.get("X-RateLimit-Limit");
  if (usage && limit) {
    const used = parseInt(usage.split(",")[0], 10);
    const max  = parseInt(limit.split(",")[0], 10);
    rateLimitRemaining = max - used;
  }
  if (res.status === 429) throw new Error("Strava rate limit hit — try again in 15 minutes");
  if (!res.ok) {
    console.warn(`  [warn] ${path} returned ${res.status} — skipping`);
    return null;
  }
  return res.json();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function secondsToTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${m}:${String(sec).padStart(2, "0")}`;
}

async function fetchDetailsBatch(ids, token, batchSize = 5) {
  const results = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    if (i > 0) await new Promise((r) => setTimeout(r, 1000));
    const batch = await Promise.all(
      ids.slice(i, i + batchSize).map((id) =>
        apiFetch(`/activities/${id}`, token).catch(() => null)
      )
    );
    results.push(...batch);
  }
  return results;
}

// ── Core: walk activity history and collect PRs ───────────────────────────────

async function findAllPRs(token) {
  const found = {};           // label → { time, date, note }
  const remaining = new Set(TARGETS);
  const MAX_PAGES = 15;       // 15 × 200 = 3 000 activities — generous safety cap

  const after = Math.floor((Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000) / 1000);

  for (let page = 1; page <= MAX_PAGES && remaining.size > 0; page++) {
    const activities = await apiFetch(
      `/athlete/activities?per_page=200&page=${page}&after=${after}`,
      token
    );
    if (!activities || activities.length === 0) break;

    const minDist = Math.min(...[...remaining].map((l) => MIN_DIST[l]));
    const runs = activities.filter(
      (a) => (a.type === "Run" || a.sport_type === "Run") && a.distance >= minDist
    );
    const totalRuns = activities.filter((a) => a.type === "Run" || a.sport_type === "Run").length;
    console.log(`  Page ${page}: ${activities.length} activities, ${totalRuns} runs, ${runs.length} long enough to check`);

    const details = await fetchDetailsBatch(runs.map((r) => r.id), token);

    for (const detail of details) {
      if (!detail?.best_efforts) continue;

      for (const effort of detail.best_efforts) {
        const label = DISTANCE_MAP[effort.name?.toLowerCase()];
        if (!label || !remaining.has(label) || effort.pr_rank !== 1) continue;

        found[label] = {
          time: secondsToTime(effort.elapsed_time),
          date: effort.start_date.slice(0, 10),
          note: detail.name ?? "",
        };
        remaining.delete(label);
        console.log(`  ✓ ${label}: ${found[label].time}  (${found[label].date})`);
      }

      if (remaining.size === 0) break;
    }

    if (activities.length < 200) break; // reached the end of history
  }

  if (remaining.size > 0) {
    console.log(
      `  No API PR found for: ${[...remaining].join(", ")} — keeping existing values`
    );
  }

  return found;
}

// ── Merge into run.json ───────────────────────────────────────────────────────

function merge(runData, found) {
  const ORDER = ["5K", "10K", "Half", "Marathon"];
  let changed = false;

  const updated = runData.personal_records.map((existing) => {
    const pr = found[existing.distance];
    if (!pr) return existing;

    // Same time and date — preserve the curated note, nothing to write
    if (pr.time === existing.time && pr.date === existing.date) return existing;

    console.log(
      `  ~ ${existing.distance}: ${existing.time} (${existing.date})` +
      ` → ${pr.time} (${pr.date})`
    );
    changed = true;
    return {
      distance: existing.distance,
      time:     pr.time,
      date:     pr.date,
      note:     pr.note || existing.note,
    };
  });

  updated.sort((a, b) => ORDER.indexOf(a.distance) - ORDER.indexOf(b.distance));

  // Keep marathon_pb in sync with the Marathon personal_record
  const marathon = updated.find((r) => r.distance === "Marathon");
  const marathon_pb = marathon?.time ?? runData.marathon_pb;
  if (marathon_pb !== runData.marathon_pb) {
    console.log(`  ~ marathon_pb: ${runData.marathon_pb} → ${marathon_pb}`);
    changed = true;
  }

  return { updated: { ...runData, marathon_pb, personal_records: updated }, changed };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== sync-prs.mjs ===");

  const missing = ["STRAVA_CLIENT_ID", "STRAVA_CLIENT_SECRET", "STRAVA_REFRESH_TOKEN"]
    .filter((k) => !process.env[k]);
  if (missing.length) throw new Error(`Missing env vars: ${missing.join(", ")}`);

  console.log("Getting access token...");
  const token = await getAccessToken();

  console.log("Searching activity history for PRs...");
  const found = await findAllPRs(token);

  const runData = JSON.parse(readFileSync(RUN_JSON, "utf8"));
  const { updated, changed } = merge(runData, found);

  if (!changed) {
    console.log("No changes — run.json is already up to date.");
    return;
  }

  writeFileSync(RUN_JSON, JSON.stringify(updated, null, 2) + "\n", "utf8");
  console.log("run.json updated.");
  console.log("=== done ===");
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  process.exit(1);
});
