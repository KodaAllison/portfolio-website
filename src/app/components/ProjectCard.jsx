import Image from "next/image";
import Link from "next/link";

function ProjectLinks({ project }) {
  const links = [
    project.previewUrl && { href: project.previewUrl, label: "live site" },
    project.gitUrl && { href: project.gitUrl, label: "source" },
  ].filter(Boolean);

  if (!links.length) return null;

  return (
    <div className="flex flex-wrap gap-space-5 font-mono text-mono-s">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent transition-colors duration-hover hover:text-accent-hover"
        >
          {label} →
        </Link>
      ))}
    </div>
  );
}

export default function ProjectCard({ project, featured = false }) {
  return (
    <article
      className={`group border-t border-line py-space-6 ${
        featured ? "md:grid md:grid-cols-[1.35fr_1fr] md:gap-12" : ""
      }`}
    >
      <div className="flex flex-col gap-space-3">
        <div className="flex items-center justify-between gap-space-4 font-mono text-mono-xs uppercase tracking-[0.14em]">
          <span className={project.status === "archived" ? "text-ink-muted" : "text-accent"}>
            {project.status}
          </span>
          <span className="text-ink-muted">{project.category}</span>
        </div>
        <h3 className={`${featured ? "text-heading-l" : "text-heading-s"} font-display text-ink`}>
          {project.title}
        </h3>
        <p className="max-w-3xl text-body-m text-ink-secondary">{project.description}</p>
        <ul className="flex flex-wrap gap-x-space-4 gap-y-space-2 font-mono text-mono-xs text-ink-muted">
          {project.tags.slice(0, featured ? 6 : 4).map((tag) => (
            <li key={tag.label}>{tag.label}</li>
          ))}
        </ul>
        <ProjectLinks project={project} />
      </div>

      {featured ? (
        <div className="mt-space-6 flex min-h-56 items-center justify-center border-l border-line bg-surface-sunken p-space-6 md:mt-0">
          {project.image ? (
            <Image
              src={project.image}
              alt=""
              width={520}
              height={320}
              className="max-h-64 w-full object-contain opacity-80 grayscale transition duration-spine group-hover:grayscale-0"
            />
          ) : (
            <div className="w-full font-mono text-mono-s leading-loose text-ink-muted">
              <p>research <span className="text-accent">→</span> working teachers</p>
              <p>build <span className="text-accent">→</span> structured AI output</p>
              <p>evaluate <span className="text-accent">→</span> usefulness</p>
              <p>result <span className="text-accent">→</span> first-class dissertation</p>
            </div>
          )}
        </div>
      ) : null}
    </article>
  );
}
