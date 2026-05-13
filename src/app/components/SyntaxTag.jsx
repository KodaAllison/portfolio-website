import React from "react";

/**
 * <SyntaxTag>
 * Terminal-flag style pill: --typescript, [react], etc.
 *
 * Props:
 *   variant — "flag" (default) renders `--label`, "bracket" renders `[label]`, "raw" renders the label as-is
 *   color   — "terminal" | "cyan" | "signal" | "muted" (default)
 *   children — the label text
 */
const COLORS = {
  terminal: "border-terminal/30 text-terminal hover:border-terminal",
  cyan: "border-cyan/30 text-cyan hover:border-cyan",
  signal: "border-signal/30 text-signal hover:border-signal",
  muted:
    "border-outline-variant text-on-surface-variant hover:border-outline",
};

const SyntaxTag = ({ variant = "flag", color = "muted", children, className = "" }) => {
  const label =
    variant === "flag"
      ? `--${children}`
      : variant === "bracket"
      ? `[${children}]`
      : children;

  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-1 border bg-surface-container/60",
        "font-mono text-[11px] tracking-wide rounded-sm transition-colors cursor-default",
        COLORS[color] ?? COLORS.muted,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </span>
  );
};

export default SyntaxTag;
