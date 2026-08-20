"use client";

import Link from "next/link";
import { useState } from "react";
// Inline SVGs (formerly react-icons/fa FaGithub + FaLinkedin)
const FaGithub = (props) => (
  <svg viewBox="0 0 496 512" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
  </svg>
);

const FaLinkedin = (props) => (
  <svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
  </svg>
);

import Navbar from "../components/Navbar";
import TerminalWindow from "../components/TerminalWindow";
import SyntaxTag from "../components/SyntaxTag";

import social from "../../data/social-links.json";

// ---------------------------------------------------------------------------
// <CopyField>
// The contact centerpiece. A terminal-styled row that prints the email like a
// shell variable and copies it to the clipboard on click. No backend, no form:
// clicking drops the address in the clipboard and shows a brief [copied]
// confirmation. This is the reliable path — it works for every visitor
// regardless of whether they have a mail client configured.
// ---------------------------------------------------------------------------
function CopyField({ value }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable (old browser / insecure context) — the address
      // is still selectable on screen, so this fails soft.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy email address ${value}`}
      className="group flex w-full items-center justify-between gap-4 border border-outline-variant bg-surface-container/60 px-5 py-4 text-left transition-all hover:border-terminal hover:shadow-glow"
    >
      <span className="flex items-center gap-3 font-mono text-body-md md:text-lg">
        <span className="shrink-0 text-terminal">$</span>
        <span className="select-all text-on-surface">{value}</span>
      </span>
      <span
        className={[
          "shrink-0 font-mono text-label-sm tracking-widest transition-colors",
          copied ? "text-terminal" : "text-outline group-hover:text-terminal",
        ].join(" ")}
      >
        {copied ? "[copied ✓]" : "[copy]"}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// <SocialCard>
// Asymmetric bento link with an icon, a body-md tagline ("--flag --flag"),
// a hover-only [host] tag, and a giant watermark glyph behind it.
// ---------------------------------------------------------------------------
function SocialCard({
  href,
  Icon,
  title,
  tagline,
  hostLabel,
  hoverColor = "terminal",
  className = "",
}) {
  const borderHover = {
    terminal: "hover:border-terminal hover:shadow-glow",
    cyan: "hover:border-cyan hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]",
  }[hoverColor];

  const iconColor = {
    terminal: "text-terminal",
    cyan: "text-cyan",
  }[hoverColor];

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={title}
      className={[
        "group relative flex flex-col justify-between overflow-hidden",
        "border border-outline-variant bg-surface-container/60 p-6 transition-all",
        borderHover,
        className,
      ].join(" ")}
    >
      {/* corner brackets — only visible on hover */}
      <span className="pointer-events-none absolute left-2 top-2 font-mono text-[10px] text-outline opacity-0 transition-opacity group-hover:opacity-100">
        ┌
      </span>
      <span className="pointer-events-none absolute right-2 top-2 font-mono text-[10px] text-outline opacity-0 transition-opacity group-hover:opacity-100">
        ┐
      </span>
      <span className="pointer-events-none absolute bottom-2 left-2 font-mono text-[10px] text-outline opacity-0 transition-opacity group-hover:opacity-100">
        └
      </span>
      <span className="pointer-events-none absolute bottom-2 right-2 font-mono text-[10px] text-outline opacity-0 transition-opacity group-hover:opacity-100">
        ┘
      </span>

      <div className="mb-10 flex items-start justify-between">
        <Icon className={`h-9 w-9 ${iconColor}`} aria-hidden />
        <SyntaxTag variant="bracket" color={hoverColor}>
          {hostLabel}
        </SyntaxTag>
      </div>

      <div>
        <h3 className="font-display text-headline-md font-bold text-on-surface">
          {title}
        </h3>
        <p className="mt-2 font-mono text-body-md text-on-surface-variant">
          {tagline}
        </p>
        <div className="mt-4 flex items-center gap-2 font-mono text-label-sm text-outline group-hover:text-on-surface-variant">
          <span className={iconColor}>$</span>
          <span>open --new-tab</span>
          <span className="translate-x-0 transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>

      {/* giant watermark */}
      <Icon
        className={`pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 opacity-[0.04] transition-opacity group-hover:opacity-[0.08] ${iconColor}`}
        aria-hidden
      />
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <section className="mx-auto w-full max-w-container-max px-margin-mobile pb-20 pt-24 md:px-margin-desktop">
        {/* route stamp */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="font-mono text-label-md text-cyan">/* 04 · contact */</span>
          <span className="text-outline">•</span>
          <span className="font-mono text-label-sm text-on-surface-variant">contact.sh</span>
        </div>

        <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tighter md:text-7xl">
          <span className="block text-on-surface">say</span>
          <span className="block text-terminal">hello.</span>
        </h1>
        <p className="mt-6 max-w-xl font-mono text-body-md leading-relaxed text-on-surface-variant">
          <span className="text-cyan">// </span>
          grab my email below, or find me on the socials. work, runs, or anything
          in between — I read everything.
        </p>

        {/* ============================================================== */}
        {/* HERO: contact.sh — the address lives inside the terminal        */}
        {/* ============================================================== */}
        <div className="mt-10">
          <TerminalWindow
            title="contact.sh"
            glow
            bodyClass="p-6 md:p-10"
          >
            {/* echo line — decorative */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-2xl leading-tight md:text-4xl">
              <span className="text-terminal">$</span>
              <span className="text-signal">echo</span>
              <span className="text-cyan">&quot;hello&quot;</span>
              <span
                className="ml-1 inline-block h-7 w-3 animate-pulse bg-terminal md:h-9 md:w-4"
                aria-hidden
              />
            </div>

            <hr className="my-8 border-outline-variant" />

            {/* copy-email interaction */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 font-mono text-body-md">
                <span className="text-terminal">$</span>
                <span className="text-signal">echo</span>
                <span className="text-cyan">$EMAIL</span>
              </div>

              <CopyField value={social.email.address} />

              <p className="font-mono text-label-sm text-outline">
                <span className="text-cyan">// </span>
                click to copy — nothing stored, nothing tracked. or hit the
                <span className="text-signal"> mailto</span> card below to open
                your mail client.
              </p>
            </div>

            {/* typical response window */}
            <div className="mt-8 border-t border-outline-variant pt-6">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-outline">
                // typical response window
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-label-sm">
                <div className="border border-outline-variant bg-surface-container-low p-2">
                  <div className="text-[10px] uppercase text-outline">
                    weekdays
                  </div>
                  <div className="text-terminal">~24h</div>
                </div>
                <div className="border border-outline-variant bg-surface-container-low p-2">
                  <div className="text-[10px] uppercase text-outline">
                    weekends
                  </div>
                  <div className="text-cyan">~48h</div>
                </div>
                <div className="border border-outline-variant bg-surface-container-low p-2">
                  <div className="text-[10px] uppercase text-outline">
                    timezone
                  </div>
                  <div className="text-signal">GMT</div>
                </div>
              </div>
            </div>
          </TerminalWindow>
        </div>

        {/* ============================================================== */}
        {/* SECONDARY GRID: socials bento                                   */}
        {/* ============================================================== */}
        <div className="mt-12 grid grid-cols-1 gap-gutter sm:grid-cols-2">
          <SocialCard
            href={social.github.url}
            Icon={FaGithub}
            title="source code"
            tagline={social.github.tagline}
            hostLabel={social.github.host}
            hoverColor="terminal"
          />
          <SocialCard
            href={social.linkedin.url}
            Icon={FaLinkedin}
            title="professional"
            tagline={social.linkedin.tagline}
            hostLabel={social.linkedin.host}
            hoverColor="cyan"
          />

          {/* full-width mail card */}
          <Link
            href={`mailto:${social.email.address}`}
            className="group relative col-span-1 flex items-center justify-between overflow-hidden border border-outline-variant bg-surface-container/60 p-6 transition-all hover:border-signal hover:shadow-[0_0_20px_rgba(255,230,0,0.15)] sm:col-span-2"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center border border-signal/40 bg-signal/5 font-mono text-signal">
                @
              </div>
              <div>
                <h3 className="font-display text-headline-md font-bold text-on-surface">
                  direct mail
                </h3>
                <p className="font-mono text-body-md text-on-surface-variant">
                  open your mail client —{" "}
                  <span className="text-signal">{social.email.label}</span>
                </p>
              </div>
            </div>
            <SyntaxTag variant="bracket" color="signal">
              mailto
            </SyntaxTag>
          </Link>
        </div>

        {/* tiny footer crumb */}
        <div className="mt-12 flex items-center gap-3 border-t border-outline-variant pt-4 font-mono text-label-sm text-outline">
          <span className="text-terminal">●</span>
          <span>no forms, no tracking · just say hi</span>
        </div>
      </section>
    </main>
  );
}
