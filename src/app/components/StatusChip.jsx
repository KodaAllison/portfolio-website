import React from "react";

/**
 * <StatusChip>
 * Leading-dot status pill: • ONLINE, • IN PROGRESS, etc.
 *
 * Props:
 *   color   — "terminal" (default, green/teal) | "cyan" | "signal" | "error"
 *   pulse   — when true, the leading dot pulses
 *   glow    — when true, the dot has a glow halo
 *   children — label text (will be uppercased)
 */
const COLOR_MAP = {
  terminal: { dot: "bg-terminal", text: "text-terminal", glow: "shadow-[0_0_8px_#00ffc2]" },
  cyan: { dot: "bg-cyan", text: "text-cyan", glow: "shadow-[0_0_8px_#22d3ee]" },
  signal: { dot: "bg-signal", text: "text-signal", glow: "shadow-[0_0_8px_#ffe600]" },
  error: { dot: "bg-red-400", text: "text-red-400", glow: "shadow-[0_0_8px_#f87171]" },
};

const StatusChip = ({
  color = "terminal",
  pulse = false,
  glow = false,
  children,
  className = "",
}) => {
  const c = COLOR_MAP[color] ?? COLOR_MAP.terminal;
  return (
    <span
      className={[
        "inline-flex items-center gap-2 px-2.5 py-1",
        "border border-outline-variant bg-surface-container/60",
        "font-mono text-[11px] uppercase tracking-widest font-bold",
        c.text,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={[
          "h-2 w-2 rounded-full",
          c.dot,
          pulse ? "animate-pulse" : "",
          glow ? c.glow : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden
      />
      {children}
    </span>
  );
};

export default StatusChip;
