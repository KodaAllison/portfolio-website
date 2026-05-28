"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import TerminalWindow from "../components/TerminalWindow";
import StatusChip from "../components/StatusChip";
import SyntaxTag from "../components/SyntaxTag";
import projects from "../../data/projects.json";

const FILTERS = [
  { id: "all", label: "all" },
  { id: "featured", label: "featured" },
  { id: "live", label: "live" },
  { id: "archived", label: "archived" },
];

const STATUS_COLOR = {
  featured: "signal",
  live: "terminal",
  archived: "muted",
};

const TAG_VARIANTS = [
  { variant: "flag", color: "terminal" },
  { variant: "flag", color: "cyan" },
  { variant: "flag", color: "signal" },
  { variant: "flag", color: "muted" },
];

function ProjectListRow({ project, active, onSelect, index }) {
  const status = project.status;
  const statusColor = STATUS_COLOR[status] ?? "muted";

  return (
    <button
      type="button"
      onClick={() => onSelect(project.id)}
      className={[
        "group block w-full text-left -mx-6 px-6 py-3 transition-colors",
        "border-l-2",
        active
          ? "border-cyan bg-surface-container/40"
          : "border-transparent hover:bg-surface-container/30",
      ].join(" ")}
      aria-pressed={active}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-baseline gap-3 font-mono text-sm">
          <span className="text-outline">{project.permissions}</span>
          <span
            className={[
              "truncate font-bold",
              active ? "text-cyan" : "text-terminal",
            ].join(" ")}
          >
            {project.file}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
          {status === "featured" ? (
            <span className="flex items-center gap-1 text-signal">
              <span aria-hidden>{"★"}</span>
              <span>{project.stars}</span>
            </span>
          ) : status === "live" ? (
            <span className="flex items-center gap-1 text-terminal">
              <span className="h-1.5 w-1.5 rounded-full bg-terminal animate-pulse" aria-hidden />
              <span>live</span>
            </span>
          ) : (
            <span className="text-outline">archived</span>
          )}
          <span className="ml-1 text-outline text-[10px] normal-case tracking-normal">
            {project.size}
          </span>
        </div>
      </div>
      <div className="mt-1 ml-[100px] font-mono text-xs text-on-surface-variant group-hover:text-on-surface transition-colors">
        {project.tagline}
      </div>
    </button>
  );
}

function PreviewBrowser({ project }) {
  return (
    <div className="w-full overflow-hidden rounded border border-outline-variant bg-surface-container-lowest">
      <div className="flex items-center gap-2 border-b border-outline-variant bg-surface-container px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-outline-variant" />
          <span className="h-2 w-2 rounded-full bg-outline-variant" />
          <span className="h-2 w-2 rounded-full bg-outline-variant" />
        </span>
        <span className="mx-3 flex-1 truncate rounded-sm bg-surface-container-high px-2 py-0.5 font-mono text-[10px] text-on-surface-variant">
          {project.previewUrl
            ? project.previewUrl.replace(/^https?:\/\//, "")
            : project.gitUrl
            ? project.gitUrl.replace(/^https?:\/\//, "")
            : `localhost:3000/${project.slug}`}
        </span>
      </div>
      <div className="relative aspect-video w-full overflow-hidden bg-background">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 1024px) 100vw, 640px"
            className="object-cover opacity-90"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-grid bg-grid-lg">
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest text-outline">
                no preview asset
              </div>
              <div className="mt-2 font-display text-2xl font-bold tracking-tighter text-terminal">
                {project.title}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [selectedId, setSelectedId] = useState(projects[0]?.id);
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((p) => p.status === filter);
  }, [filter]);

  const selected =
    projects.find((p) => p.id === selectedId) ?? filtered[0] ?? projects[0];

  // Counters for the filter row
  const counts = useMemo(() => {
    const c = { all: projects.length, featured: 0, live: 0, archived: 0 };
    for (const p of projects) {
      if (c[p.status] !== undefined) c[p.status] += 1;
    }
    return c;
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <section className="mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop pt-24 pb-16">
        {/* Hero */}
        <div className="mb-12">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="font-mono text-label-md text-cyan">
              /* 02 · projects */
            </span>
            <span className="text-outline">•</span>
            <StatusChip color="terminal" pulse>
              {projects.length} files indexed
            </StatusChip>
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tighter md:text-7xl">
            <span className="text-signal">~/</span>
            <span className="text-terminal">projects</span>
            <span className="ml-2 text-cyan blink-cursor" />
          </h1>

          <p className="mt-6 max-w-xl font-mono text-body-md leading-relaxed text-on-surface-variant">
            <span className="text-cyan">// </span>
            five files, five different ways of asking{" "}
            <span className="text-on-surface">&ldquo;could I build this?&rdquo;</span>
          </p>
        </div>

        {/* Filter row — terminal flags */}
        <div className="mb-6 flex flex-wrap items-center gap-3 border-y border-outline-variant py-3">
          <span className="font-mono text-label-sm text-outline">
            $ ls --filter=
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              const color =
                f.id === "featured"
                  ? "signal"
                  : f.id === "live"
                  ? "terminal"
                  : f.id === "archived"
                  ? "muted"
                  : "cyan";
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={[
                    "font-mono text-[11px] tracking-wide rounded-sm border px-2.5 py-1 transition-colors",
                    active
                      ? color === "signal"
                        ? "border-signal text-signal bg-surface-container"
                        : color === "terminal"
                        ? "border-terminal text-terminal bg-surface-container"
                        : color === "muted"
                        ? "border-outline text-on-surface bg-surface-container"
                        : "border-cyan text-cyan bg-surface-container"
                      : "border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  --{f.label}
                  <span className="ml-1.5 text-outline">[{counts[f.id]}]</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-pane terminal layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: file list */}
          <div className="lg:col-span-5">
            <TerminalWindow
              title="~/koda/projects — zsh"
              subtitle="80x34"
              bodyClass="p-6"
            >
              <div className="mb-5 font-mono text-sm">
                <span className="text-cyan">koda@nuc</span>{" "}
                <span className="text-on-surface">~/projects</span>{" "}
                <span className="text-signal">$</span>{" "}
                <span className="text-terminal">ls -la --sort=stars</span>
                <div className="mt-1 text-xs text-outline">
                  total {filtered.length} · selected: 1
                </div>
              </div>

              <div className="space-y-1">
                {filtered.length === 0 ? (
                  <div className="px-2 py-6 text-center font-mono text-xs text-outline">
                    no files match --{filter}
                  </div>
                ) : (
                  filtered.map((p, i) => (
                    <ProjectListRow
                      key={p.id}
                      project={p}
                      index={i}
                      active={p.id === selected?.id}
                      onSelect={setSelectedId}
                    />
                  ))
                )}
              </div>

              <div className="mt-8 font-mono text-sm">
                <span className="text-cyan">koda@nuc</span>{" "}
                <span className="text-on-surface">~/projects</span>{" "}
                <span className="text-signal">$</span>{" "}
                <span className="text-cyan blink-cursor" />
              </div>
            </TerminalWindow>
          </div>

          {/* Right: preview */}
          <div className="lg:col-span-7">
            {selected ? (
              <div className="flex h-full flex-col gap-6">
                <TerminalWindow
                  title={
                    <span>
                      preview ·{" "}
                      <span className="text-cyan">{selected.file}</span>
                    </span>
                  }
                  subtitle={selected.previewUrl || selected.gitUrl ? "open ↗" : "local"}
                  glow
                  bodyClass="p-6 md:p-8"
                  className="flex flex-col"
                >
                  {/* Header row */}
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-mono text-label-sm text-outline">
                        {selected.path}
                      </div>
                      <h2 className="mt-1 font-display text-headline-md font-bold tracking-tighter text-on-surface">
                        {selected.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {selected.status === "featured" ? (
                        <StatusChip color="signal" glow>featured</StatusChip>
                      ) : selected.status === "live" ? (
                        <StatusChip color="terminal" pulse>live</StatusChip>
                      ) : (
                        <span className="inline-flex items-center gap-2 border border-outline-variant bg-surface-container/60 px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-outline">
                          archived
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Preview browser */}
                  <PreviewBrowser project={selected} />

                  {/* Description */}
                  <p className="mt-6 font-mono text-body-md leading-relaxed text-on-surface-variant">
                    <span className="text-cyan">// </span>
                    {selected.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {selected.tags.map((t, i) => {
                      const fallback = TAG_VARIANTS[i % TAG_VARIANTS.length];
                      return (
                        <SyntaxTag
                          key={`${selected.id}-${t.label}-${i}`}
                          variant={t.variant ?? fallback.variant}
                          color={t.color ?? fallback.color}
                        >
                          {t.label}
                        </SyntaxTag>
                      );
                    })}
                  </div>

                  {/* Action row */}
                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-outline-variant pt-5">
                    {selected.previewUrl ? (
                      <Link
                        href={selected.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 border border-terminal/60 bg-terminal/10 px-3 py-1.5 font-mono text-[12px] font-bold uppercase tracking-widest text-terminal transition-colors hover:bg-terminal hover:text-background"
                      >
                        <span aria-hidden>{"▶"}</span>
                        run preview
                        <span className="text-[10px] text-outline group-hover:text-background/70">
                          ↗
                        </span>
                      </Link>
                    ) : null}
                    {selected.gitUrl ? (
                      <Link
                        href={selected.gitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-outline-variant bg-surface-container px-3 py-1.5 font-mono text-[12px] font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:border-cyan hover:text-cyan"
                      >
                        <span aria-hidden>{"◎"}</span>
                        view source
                        <span className="text-[10px] text-outline">↗</span>
                      </Link>
                    ) : null}
                    {!selected.previewUrl && !selected.gitUrl ? (
                      <span className="font-mono text-label-sm text-outline">
                        // no public links
                      </span>
                    ) : null}
                    <span className="ml-auto font-mono text-label-sm text-outline">
                      {selected.size} · {selected.permissions}
                    </span>
                  </div>
                </TerminalWindow>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer breadcrumb */}
        <div className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-outline-variant pt-5 font-mono text-label-sm text-outline">
          <span className="text-cyan">/* eof */</span>
          <span>{filtered.length} of {projects.length} files shown</span>
          <span>•</span>
          <span>
            filter: <span className="text-on-surface-variant">--{filter}</span>
          </span>
          <span className="ml-auto">
            <Link
              href="/contact"
              className="text-on-surface-variant transition-colors hover:text-terminal"
            >
              build something together → /contact
            </Link>
          </span>
        </div>
      </section>
    </main>
  );
}
