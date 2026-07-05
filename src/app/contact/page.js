"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
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
import StatusChip from "../components/StatusChip";
import SyntaxTag from "../components/SyntaxTag";

import social from "../../data/social-links.json";

// ---------------------------------------------------------------------------
// <PromptInput>
// A terminal-prompt styled field. Renders a `~ $` prefix, a transparent input,
// and a bottom border that lights up on focus. Optional `multiline` swaps the
// input for a textarea. The blinking cursor sits at the end of the value while
// the field is focused (or always-on for the active field).
// ---------------------------------------------------------------------------
function PromptInput({
  id,
  name,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  type = "text",
  placeholder,
  required = false,
  multiline = false,
  rows = 4,
  focused = false,
  promptColor = "text-terminal",
  caretColor = "bg-terminal",
}) {
  const InputTag = multiline ? "textarea" : "input";

  return (
    <label htmlFor={id} className="group block">
      {/* label as a code comment */}
      <div className="mb-2 flex items-center justify-between font-mono text-label-sm uppercase tracking-widest">
        <span className="text-on-surface-variant">
          <span className="text-cyan">// </span>
          {label}
          {required && <span className="ml-1 text-signal">*</span>}
        </span>
        <span
          className={[
            "font-mono text-[10px] tracking-widest transition-opacity",
            focused ? "opacity-100 text-terminal" : "opacity-30 text-outline",
          ].join(" ")}
        >
          {focused ? "INSERT" : "NORMAL"}
        </span>
      </div>

      <div
        className={[
          "relative flex items-start gap-3 border-b px-1 pb-2 transition-colors",
          focused
            ? "border-terminal/80"
            : "border-outline-variant group-hover:border-outline",
        ].join(" ")}
      >
        <span
          className={[
            "shrink-0 select-none font-mono text-body-md leading-7 tracking-wider",
            promptColor,
          ].join(" ")}
          aria-hidden
        >
          ~&nbsp;$
        </span>

        <div className="relative flex-1">
          <InputTag
            id={id}
            name={name}
            type={multiline ? undefined : type}
            required={required}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            rows={multiline ? rows : undefined}
            className={[
              "block w-full resize-none bg-transparent font-mono text-body-md leading-7",
              "text-on-surface placeholder:text-outline/70 caret-transparent",
              "focus:outline-none",
            ].join(" ")}
          />

          {/* fake blinking caret that follows the end of the value */}
          {focused && (
            <span
              className="pointer-events-none absolute -bottom-[2px] left-0 flex items-end"
              aria-hidden
            >
              <span className="invisible whitespace-pre font-mono text-body-md leading-7">
                {value || placeholder || " "}
              </span>
              <span
                className={[
                  "ml-[1px] inline-block h-5 w-2 animate-pulse",
                  caretColor,
                ].join(" ")}
              />
            </span>
          )}
        </div>
      </div>
    </label>
  );
}

// ---------------------------------------------------------------------------
// <LogLine>
// One row of the transmission log. Renders a timestamp, a [TAG] color, and
// the message.
// ---------------------------------------------------------------------------
function LogLine({ time, tag, tagColor = "text-terminal", children }) {
  return (
    <div className="flex gap-3 font-mono text-label-sm leading-relaxed">
      <span className="shrink-0 text-outline">{time}</span>
      <span className={`shrink-0 ${tagColor}`}>[{tag}]</span>
      <span className="text-on-surface-variant">{children}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Build the log based on the form state — the right column "responds" to the
// user as they fill out the form.
// ---------------------------------------------------------------------------
function useTransmissionLog({ status, hasEmail, hasSubject, hasMessage }) {
  return useMemo(() => {
    const lines = [
      {
        time: "00:00",
        tag: "SYS",
        color: "text-terminal",
        body: (
          <>
            mail_client.sh started ·{" "}
            <span className="text-terminal">resend</span> ready
          </>
        ),
      },
      {
        time: "00:01",
        tag: "NET",
        color: "text-cyan",
        body: (
          <>
            POST <span className="text-cyan">/api/send</span> handshake ok
          </>
        ),
      },
      {
        time: "00:02",
        tag: hasEmail ? "OK" : "WAIT",
        color: hasEmail ? "text-terminal" : "text-outline",
        body: hasEmail ? (
          <>
            sender resolved ·{" "}
            <span className="text-on-surface">{"<reply-to>"}</span> captured
          </>
        ) : (
          <>awaiting sender address...</>
        ),
      },
      {
        time: "00:03",
        tag: hasSubject ? "OK" : "WAIT",
        color: hasSubject ? "text-terminal" : "text-outline",
        body: hasSubject ? (
          <>subject line indexed</>
        ) : (
          <>awaiting subject header...</>
        ),
      },
      {
        time: "00:04",
        tag: hasMessage ? "OK" : "WAIT",
        color: hasMessage ? "text-terminal" : "text-outline",
        body: hasMessage ? (
          <>message body buffered</>
        ) : (
          <>awaiting message body...</>
        ),
      },
    ];

    if (status === "sending") {
      lines.push({
        time: "00:05",
        tag: "TX",
        color: "text-signal",
        body: <>transmitting payload to resend gateway...</>,
      });
    } else if (status === "success") {
      lines.push({
        time: "00:05",
        tag: "TX",
        color: "text-signal",
        body: <>payload transmitted (200 ok)</>,
      });
      lines.push({
        time: "00:06",
        tag: "RX",
        color: "text-terminal",
        body: <>inbox confirmed — reply window: 24h</>,
      });
    } else if (status === "error") {
      lines.push({
        time: "00:05",
        tag: "ERR",
        color: "text-red-400",
        body: <>transmission failed · retry recommended</>,
      });
    }

    return lines;
  }, [status, hasEmail, hasSubject, hasMessage]);
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
  const [form, setForm] = useState({ email: "", subject: "", message: "" });
  const [focused, setFocused] = useState(null); // "email" | "subject" | "message" | null
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef(null);

  const log = useTransmissionLog({
    status,
    hasEmail: form.email.trim().length > 0,
    hasSubject: form.subject.trim().length > 0,
    hasMessage: form.message.trim().length > 0,
  });

  const onField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        let detail = `HTTP ${response.status}`;
        try {
          const data = await response.json();
          if (data?.error) detail = data.error;
        } catch {
          /* ignore body parse errors */
        }
        setErrorMsg(detail);
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg(err?.message ?? "network error");
      setStatus("error");
    }
  };

  const resetForm = () => {
    setForm({ email: "", subject: "", message: "" });
    setStatus("idle");
    setErrorMsg("");
    setFocused(null);
  };

  const retry = () => {
    setStatus("idle");
    setErrorMsg("");
    // submit the existing values again on next click
    requestAnimationFrame(() => {
      formRef.current?.requestSubmit();
    });
  };

  const isSending = status === "sending";
  const isSuccess = status === "success";

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <section className="mx-auto w-full max-w-container-max px-margin-mobile pb-20 pt-24 md:px-margin-desktop">
        {/* route stamp */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="font-mono text-label-md text-cyan">/* 04 · contact */</span>
          <span className="text-outline">•</span>
          <span className="font-mono text-label-sm text-on-surface-variant">mail_client.sh — stable v3</span>
        </div>

        <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tighter md:text-7xl">
          <span className="block text-on-surface">say</span>
          <span className="block text-terminal">hello.</span>
        </h1>
        <p className="mt-6 max-w-xl font-mono text-body-md leading-relaxed text-on-surface-variant">
          <span className="text-cyan">// </span>
          a real form, piped straight into resend. write me about work, runs,
          or anything in between.
        </p>

        {/* ============================================================== */}
        {/* HERO: mail_client.sh — the form lives inside the terminal       */}
        {/* ============================================================== */}
        <div className="mt-10">
          <TerminalWindow
            title="mail_client.sh"
            subtitle="UTF-8 · LF"
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

            {/* status row */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {status === "idle" && (
                <StatusChip color="terminal" pulse glow>
                  server ready
                </StatusChip>
              )}
              {status === "sending" && (
                <StatusChip color="signal" pulse glow>
                  transmitting
                </StatusChip>
              )}
              {status === "success" && (
                <StatusChip color="terminal" pulse glow>
                  message sent
                </StatusChip>
              )}
              {status === "error" && (
                <StatusChip color="error" pulse>
                  transmission failed
                </StatusChip>
              )}
              <SyntaxTag variant="raw" color="muted">
                est. ping: 24ms
              </SyntaxTag>
              <SyntaxTag variant="raw" color="muted">
                region: eu-west
              </SyntaxTag>
            </div>

            <hr className="my-8 border-outline-variant" />

            {/* ----------------------------------------------------------- */}
            {/* FORM or SUCCESS pane                                        */}
            {/* ----------------------------------------------------------- */}
            {isSuccess ? (
              <div className="grid grid-cols-1 gap-6 py-6">
                <div className="space-y-2 font-mono text-body-md">
                  <div>
                    <span className="text-terminal">$</span>{" "}
                    <span className="text-signal">./send.sh</span>{" "}
                    <span className="text-cyan">--submit</span>
                  </div>
                  <div className="text-on-surface-variant">
                    {"> "}message routed via resend
                  </div>
                  <div className="text-on-surface-variant">
                    {"> "}reply window: within 24h
                  </div>
                  <div>
                    <span className="text-terminal">$</span>{" "}
                    <span className="text-on-surface">exit 0</span>
                  </div>
                  <div>
                    <span className="text-terminal">$</span>{" "}
                    <span className="blink-cursor" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="group inline-flex w-fit items-center gap-3 border border-outline-variant bg-surface-container/60 px-5 py-3 font-mono text-label-md text-on-surface-variant transition-colors hover:border-terminal hover:text-terminal"
                >
                  <span className="text-terminal">$</span>
                  <span>./send.sh</span>
                  <span className="text-cyan">--again</span>
                  <span className="translate-x-0 text-outline transition-transform group-hover:translate-x-1 group-hover:text-terminal">
                    →
                  </span>
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-7"
                noValidate={false}
              >
                <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                  <PromptInput
                    id="email"
                    name="email"
                    type="email"
                    label="reply-to"
                    placeholder="you@somewhere.dev"
                    required
                    value={form.email}
                    onChange={onField("email")}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    focused={focused === "email"}
                    promptColor="text-cyan"
                    caretColor="bg-cyan"
                  />
                  <PromptInput
                    id="subject"
                    name="subject"
                    label="subject"
                    placeholder="re: let's build something"
                    required
                    value={form.subject}
                    onChange={onField("subject")}
                    onFocus={() => setFocused("subject")}
                    onBlur={() => setFocused(null)}
                    focused={focused === "subject"}
                    promptColor="text-signal"
                    caretColor="bg-signal"
                  />
                </div>

                <div>
                  <PromptInput
                    id="message"
                    name="message"
                    label="message"
                    placeholder="start typing... markdown is fine."
                    required
                    multiline
                    rows={6}
                    value={form.message}
                    onChange={onField("message")}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    focused={focused === "message" || form.message.length > 0}
                  />
                  <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-outline">
                    <span>// shift+enter for newline</span>
                    <span>
                      <span className="text-on-surface-variant">
                        {form.message.length}
                      </span>{" "}
                      bytes
                    </span>
                  </div>
                </div>

                {status === "error" && errorMsg && (
                  <div className="border border-red-400/40 bg-red-400/5 px-4 py-3 font-mono text-label-sm text-red-400">
                    <span className="font-bold">stderr:</span> {errorMsg}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSending}
                    className={[
                      "group inline-flex items-center gap-3 border px-5 py-3 font-mono text-label-md transition-all",
                      isSending
                        ? "cursor-not-allowed border-signal/40 bg-signal/5 text-signal"
                        : "border-terminal/40 bg-terminal/5 text-terminal hover:border-terminal hover:bg-terminal/10 hover:shadow-glow",
                    ].join(" ")}
                  >
                    <span
                      className={
                        isSending ? "text-signal" : "text-terminal"
                      }
                    >
                      $
                    </span>
                    <span>./send.sh</span>
                    <span className="text-cyan">--submit</span>
                    {isSending ? (
                      <span className="ml-1 inline-flex items-center gap-1 text-signal">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal [animation-delay:240ms]" />
                      </span>
                    ) : (
                      <span className="translate-x-0 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    )}
                  </button>

                  {status === "error" && (
                    <button
                      type="button"
                      onClick={retry}
                      className="inline-flex items-center gap-2 border border-outline-variant px-4 py-3 font-mono text-label-md text-on-surface-variant transition-colors hover:border-signal hover:text-signal"
                    >
                      <span>$</span>
                      <span>./retry.sh</span>
                    </button>
                  )}

                  <span className="font-mono text-label-sm text-outline">
                    <span className="text-cyan">// </span>
                    your reply-to is only used to respond. nothing stored,
                    nothing tracked.
                  </span>
                </div>
              </form>
            )}
          </TerminalWindow>
        </div>

        {/* ============================================================== */}
        {/* SECONDARY GRID: socials + transmission log                      */}
        {/* ============================================================== */}
        <div className="mt-12 grid grid-cols-1 gap-gutter lg:grid-cols-12">
          {/* socials bento */}
          <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:col-span-7">
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
                    if forms aren't your thing —{" "}
                    <span className="text-signal">
                      {social.email.label}
                    </span>
                  </p>
                </div>
              </div>
              <SyntaxTag variant="bracket" color="signal">
                mailto
              </SyntaxTag>
            </Link>
          </div>

          {/* transmission log */}
          <div className="lg:col-span-5">
            <TerminalWindow
              title="transmission_info.log"
              subtitle="live"
              bodyClass="p-0"
              className="h-full"
            >
              <div className="flex items-center gap-3 border-b border-outline-variant px-4 py-2">
                <StatusChip
                  color={status === "error" ? "error" : "terminal"}
                  pulse
                >
                  {status === "idle" && "ready"}
                  {status === "sending" && "tx"}
                  {status === "success" && "delivered"}
                  {status === "error" && "failed"}
                </StatusChip>
                <span className="font-mono text-label-sm tracking-widest text-on-surface-variant">
                  session_id: 0xC0DA
                </span>
              </div>

              <div className="space-y-2 p-4">
                {log.map((line, i) => (
                  <LogLine
                    key={`${line.time}-${i}`}
                    time={line.time}
                    tag={line.tag}
                    tagColor={line.color}
                  >
                    {line.body}
                  </LogLine>
                ))}

                {/* live prompt at the bottom */}
                <div className="flex items-center gap-2 pt-3 font-mono text-label-sm">
                  <span className="text-terminal">$</span>
                  <span className="h-3 w-2 animate-pulse bg-terminal" />
                </div>
              </div>

              <div className="border-t border-outline-variant px-4 py-3">
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
        </div>

        {/* tiny footer crumb */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant pt-4 font-mono text-label-sm text-outline">
          <div className="flex items-center gap-3">
            <span className="text-terminal">●</span>
            <span>powered by resend · POST /api/send</span>
          </div>
          <div className="flex items-center gap-3">
            <span>UTF-8</span>
            <span>·</span>
            <span>LF</span>
            <span>·</span>
            <span className="text-signal">ZSH</span>
          </div>
        </div>
      </section>
    </main>
  );
}
