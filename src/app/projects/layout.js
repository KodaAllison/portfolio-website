// page.js is a client component, so route metadata lives in this layout.
export const metadata = {
  title: "Projects | Koda Allison",
  description:
    "Featured and archived projects — an AI lesson generator, a cron-synced Strava Worker, client sites, and more.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsLayout({ children }) {
  return children;
}
