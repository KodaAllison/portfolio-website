"use client";

import { useEffect, useState } from "react";

export default function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="flex w-full items-center justify-between gap-space-5 border-y border-line py-space-5 text-left transition-colors duration-hover hover:border-line-strong"
    >
      <span className="break-all font-display text-heading-m text-ink">{email}</span>
      <span className="shrink-0 font-mono text-mono-s text-accent">
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}
