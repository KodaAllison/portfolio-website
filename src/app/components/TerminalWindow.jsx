import React from "react";

/**
 * <TerminalWindow>
 * macOS-style window with traffic lights and a file-path title in the header.
 *
 * Props:
 *   title       — file path / label shown centered in the header (e.g. "currently.jsx")
 *   subtitle    — optional right-aligned label (e.g. "80x34")
 *   glow        — when true, applies a subtle terminal-teal glow to the window
 *   bodyClass   — class overrides for the body container (default: "p-6")
 *   className   — class overrides for the outer wrapper
 *   trafficLights — show traffic lights (default true)
 *   children    — body content
 */
const TerminalWindow = ({
  title,
  subtitle,
  glow = false,
  bodyClass = "p-6",
  className = "",
  trafficLights = true,
  children,
}) => {
  return (
    <div
      className={[
        "terminal-shadow overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low",
        glow ? "shadow-glow" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between border-b border-outline-variant bg-terminal-header px-4 py-2">
        <div className="flex items-center gap-2">
          {trafficLights && (
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-400/50" aria-hidden />
              <span className="h-3 w-3 rounded-full bg-yellow-400/50" aria-hidden />
              <span className="h-3 w-3 rounded-full bg-green-400/50" aria-hidden />
            </div>
          )}
        </div>
        {title ? (
          <span className="font-mono text-[10px] tracking-wider text-on-surface-variant">
            {title}
          </span>
        ) : null}
        <span className="font-mono text-[10px] text-outline">
          {subtitle ?? ""}
        </span>
      </div>
      <div className={`font-mono text-on-surface ${bodyClass}`}>{children}</div>
    </div>
  );
};

export default TerminalWindow;
