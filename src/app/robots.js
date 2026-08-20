import { siteUrl } from "../lib/site";

// Served at /robots.txt.
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
