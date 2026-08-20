// Single source of truth for the canonical site URL, shared by layout
// metadata, sitemap.js, and robots.js.
//
// kodaallison.dev (about.json "domain") doesn't resolve yet — until DNS
// exists, canonical/OG/sitemap URLs must use the address that actually serves
// the site, or crawlers get pointed at a dead domain. Switch back to
// `https://${about.domain}` once the domain is live.
export const siteUrl = "https://koda-allison-portfolio.vercel.app";
