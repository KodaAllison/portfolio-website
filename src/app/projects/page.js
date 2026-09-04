import Navbar from "../components/Navbar";
import CommitHeatmap from "../components/CommitHeatmap";
import ProjectCard from "../components/ProjectCard";
import SiteFooter from "../components/SiteFooter";
import projects from "../../data/projects.json";
import { fetchGitHubData, relativeTime } from "../../lib/github";

export default async function ProjectsPage() {
  const active = projects.filter((project) => project.status !== "archived");
  const archive = projects.filter((project) => project.status === "archived");
  let github;

  try {
    github = await fetchGitHubData();
  } catch {
    github = undefined;
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <header className="border-b border-line px-5 pb-space-7 pt-space-5 md:px-[72px] md:pb-14 md:pt-28">
        <div className={`grid gap-space-7 ${github ? "lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:items-end lg:gap-16" : ""}`}>
          <div>
            <p className="font-mono text-mono-xs text-ink-muted">Projects</p>
            <h1 className="mt-space-4 font-display text-display-l uppercase text-ink">
              Things I built<span className="text-accent">.</span>
            </h1>
            <p className="mt-space-5 max-w-2xl text-body-l text-ink-lead">
              {projects.length} projects, newest first. Each one says what it is, what was actually
              hard, and where to read the code.
            </p>
          </div>

          {github ? (
            <aside className="border-y border-line py-space-4" aria-label="Recent GitHub activity">
              <div className="mb-space-3 flex items-baseline justify-between gap-space-4 font-mono text-mono-xs text-ink-muted">
                <span>GitHub activity</span>
                {github.last_commit_at ? <span>{relativeTime(github.last_commit_at)}</span> : null}
              </div>
              <CommitHeatmap data={github.heatmap} columns={12} />
              <div className="mt-space-3 flex justify-between gap-space-5 border-t border-line-subtle pt-space-3 font-mono text-mono-xs text-ink-muted">
                <span><strong className="font-normal text-ink">{github.commits_30d}</strong> commits · 30d</span>
                <span><strong className="font-normal text-ink">{github.longest_streak}d</strong> longest streak</span>
              </div>
            </aside>
          ) : null}
        </div>
      </header>

      <section className="px-5 pt-space-7 md:px-[72px] md:pt-[76px]">
        <h2 className="mb-space-5 font-display text-heading-l text-ink">Selected work</h2>
        <ProjectCard project={projects[0]} featured />
        <div className="grid gap-x-12 md:grid-cols-2">
          {active.slice(1).map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </section>

      {archive.length ? (
        <section className="px-5 pt-space-7 md:px-[72px] md:pt-[76px]">
          <div className="mb-space-5 flex flex-col gap-space-2 border-b border-line pb-space-4 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="font-display text-heading-l text-ink">Archive</h2>
            <span className="font-mono text-mono-xs text-ink-muted">still up, no longer maintained</span>
          </div>
          {archive.map((project) => (
            <article key={project.id} className="grid gap-space-3 border-b border-line-subtle py-space-5 md:grid-cols-[220px_1fr_auto] md:items-baseline">
              <h3 className="font-display text-heading-s text-ink">{project.title}</h3>
              <p className="text-body-m text-ink-secondary">{project.tagline}</p>
              {project.gitUrl ? (
                <a href={project.gitUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-mono-s text-accent hover:text-accent-hover">View source</a>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}

      <SiteFooter />
    </main>
  );
}
