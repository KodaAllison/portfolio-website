import { unstable_cache } from "next/cache";

const API = "https://www.strava.com/api/v3";

async function getAccessToken() {
  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Strava token refresh failed: ${res.status}`);
  const { access_token } = await res.json();
  return access_token;
}

function paceString(movingTimeSec, distanceM) {
  const secPerKm = movingTimeSec / (distanceM / 1000);
  const mins = Math.floor(secPerKm / 60);
  const secs = Math.round(secPerKm % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function classifyRun(activity) {
  if (activity.workout_type === 2) return "long";
  if (activity.workout_type === 3) return "tempo";
  if (activity.distance >= 15000) return "long";
  const paceSecPerKm = activity.moving_time / (activity.distance / 1000);
  if (paceSecPerKm < 270) return "tempo"; // faster than 4:30/km
  return "easy";
}

// Returns the Monday of the ISO week containing `date`, as a UTC midnight Date.
function isoWeekMonday(date) {
  const d = new Date(date);
  const day = (d.getUTCDay() + 6) % 7; // 0=Mon
  d.setUTCDate(d.getUTCDate() - day);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function _fetchStravaData() {
  const token = await getAccessToken();

  // 112 days covers 16 full weeks
  const windowStart = Math.floor((Date.now() - 112 * 24 * 60 * 60 * 1000) / 1000);

  const [athleteRes, activitiesRes] = await Promise.all([
    fetch(`${API}/athlete`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
    fetch(`${API}/athlete/activities?per_page=200&after=${windowStart}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
  ]);

  if (!athleteRes.ok) throw new Error(`Strava athlete fetch failed: ${athleteRes.status}`);
  if (!activitiesRes.ok) throw new Error(`Strava activities fetch failed: ${activitiesRes.status}`);

  const athlete = await athleteRes.json();
  const allActivities = await activitiesRes.json();

  const statsRes = await fetch(`${API}/athletes/${athlete.id}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!statsRes.ok) throw new Error(`Strava stats fetch failed: ${statsRes.status}`);
  const stats = await statsRes.json();

  const runs = allActivities.filter(
    (a) => a.type === "Run" || a.sport_type === "Run"
  );

  // ── Current week (Mon–Sun) ────────────────────────────────────────────────
  const now = new Date();
  const weekStart = isoWeekMonday(now);
  const weekly_km =
    Math.round(
      runs
        .filter((a) => new Date(a.start_date) >= weekStart)
        .reduce((sum, a) => sum + a.distance / 1000, 0) * 10
    ) / 10;

  // ── YTD + all-time from athlete stats ────────────────────────────────────
  const ytd_km = Math.round((stats.ytd_run_totals?.distance ?? 0) / 1000);
  const ytd_runs = stats.ytd_run_totals?.count ?? 0;
  const all_time = {
    runs: stats.all_run_totals?.count ?? 0,
    km: Math.round((stats.all_run_totals?.distance ?? 0) / 1000),
    elevation_m: Math.round(stats.all_run_totals?.elevation_gain ?? 0),
  };

  // ── Recent activity log — newest first, up to 8 ──────────────────────────
  const recent_activity = [...runs]
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
    .slice(0, 8)
    .map((a) => ({
      date: a.start_date.slice(0, 10),
      distance_km: Math.round((a.distance / 1000) * 10) / 10,
      pace: paceString(a.moving_time, a.distance),
      type: classifyRun(a),
      elev_m: Math.round(a.total_elevation_gain),
      hr: a.has_heartrate ? Math.round(a.average_heartrate) : null,
    }));

  // ── Weekly training load — last 16 weeks, oldest first ───────────────────
  const weekMap = new Map(); // key: monday ISO string → km total
  for (const run of runs) {
    const mon = isoWeekMonday(run.start_date).toISOString().slice(0, 10);
    weekMap.set(mon, (weekMap.get(mon) ?? 0) + run.distance / 1000);
  }

  // Build a 16-slot array aligned to complete weeks
  const thisWeekMon = isoWeekMonday(now);
  const weekly_bars = Array.from({ length: 16 }, (_, i) => {
    const mon = new Date(thisWeekMon);
    mon.setUTCDate(mon.getUTCDate() - (15 - i) * 7);
    const key = mon.toISOString().slice(0, 10);
    const label = mon.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    const km = Math.round((weekMap.get(key) ?? 0) * 10) / 10;
    return { label, km };
  });

  // avg km over the 15 completed weeks (excludes the current in-progress week)
  const completedWeeks = weekly_bars.slice(0, -1);
  const avg_weekly_km =
    Math.round(
      (completedWeeks.reduce((sum, w) => sum + w.km, 0) / completedWeeks.length) * 10
    ) / 10;

  // ── Streak / rest / longest — from the 112-day window ────────────────────
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const dayKm = new Array(112).fill(0);
  for (const run of runs) {
    const runDay = new Date(run.start_date);
    runDay.setUTCHours(0, 0, 0, 0);
    const daysAgo = Math.round((todayStart - runDay) / (24 * 60 * 60 * 1000));
    const idx = 111 - daysAgo;
    if (idx >= 0 && idx < 112) dayKm[idx] += run.distance / 1000;
  }

  let streak = 0;
  let i = 111;
  if (dayKm[i] === 0) i--;
  while (i >= 0 && dayKm[i] > 0) { streak++; i--; }

  const rest_days = dayKm.filter((km) => km === 0).length;
  const longest_km = Math.max(...dayKm).toFixed(1);

  return {
    weekly_km,
    avg_weekly_km,
    ytd_km,
    ytd_runs,
    all_time,
    recent_activity,
    weekly_bars,
    streak,
    rest_days,
    longest_km,
  };
}

export const fetchStravaData = unstable_cache(
  _fetchStravaData,
  ["strava-run-data"],
  { revalidate: 3600 }
);
