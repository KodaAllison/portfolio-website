import { siteUrl } from "../lib/site";

// Served at /sitemap.xml. The dynamic pages (/ and /run) change with every
// Strava sync, the static ones only on deploys.
export default function sitemap() {
  return [
    { path: "", changeFrequency: "daily", priority: 1 },
    { path: "/projects", changeFrequency: "monthly", priority: 0.8 },
    { path: "/run", changeFrequency: "daily", priority: 0.7 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  ].map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
