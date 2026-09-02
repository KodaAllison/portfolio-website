import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import SiteFooter from "../components/SiteFooter";
import projects from "../../data/projects.json";

export default function ProjectsPage() {
  const active = projects.filter((project) => project.status !== "archived");
  const archive = projects.filter((project) => project.status === "archived");

  return (
    <main className="min-h-screen">
      <Navbar />

      <header className="border-b border-line px-5 pb-space-7 pt-[88px] md:px-[72px] md:pb-14 md:pt-28">
        <p className="font-mono text-mono-xs uppercase tracking-[0.14em] text-ink-muted">Projects</p>
        <h1 className="mt-space-4 font-display text-display-l uppercase text-ink">
          Things I built<span className="text-accent">.</span>
        </h1>
        <p className="mt-space-5 max-w-2xl text-body-l text-ink-lead">
          {projects.length} projects, newest first. Each one says what it is, what was actually
          hard, and where to read the code.
        </p>
        <div className="mt-space-7 flex flex-wrap gap-space-6 border-t border-line pt-space-4 font-mono text-mono-s text-ink-muted">
          <span>all · {projects.length}</span>
          <span>live · {projects.filter((project) => project.status === "live").length}</span>
          <span>featured · {projects.filter((project) => project.status === "featured").length}</span>
          <span>archived · {archive.length}</span>
        </div>
      </header>

      <section className="px-5 pt-[76px] md:px-[72px]">
        <h2 className="mb-space-5 font-display text-heading-l text-ink">Selected work</h2>
        <ProjectCard project={projects[0]} featured />
        <div className="grid gap-x-12 md:grid-cols-2">
          {active.slice(1).map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </section>

      {archive.length ? (
        <section className="px-5 pt-[76px] md:px-[72px]">
          <div className="mb-space-5 flex items-baseline justify-between border-b border-line pb-space-4">
            <h2 className="font-display text-heading-l text-ink">Archive</h2>
            <span className="font-mono text-mono-xs text-ink-muted">still up, no longer maintained</span>
          </div>
          {archive.map((project) => (
            <article key={project.id} className="grid gap-space-3 border-b border-line-subtle py-space-5 md:grid-cols-[220px_1fr_auto] md:items-baseline">
              <h3 className="font-display text-heading-s text-ink">{project.title}</h3>
              <p className="text-body-m text-ink-secondary">{project.tagline}</p>
              {project.gitUrl ? (
                <a href={project.gitUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-mono-s text-accent hover:text-accent-hover">source →</a>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}

      <SiteFooter />
    </main>
  );
}
