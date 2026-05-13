import React from "react";

/**
 * <StatusBar>
 * tmux-style horizontal bar. Used by the top nav and contextual footers.
 *
 * Props:
 *   left      — node rendered at left
 *   center    — optional node rendered centered (hidden on small screens)
 *   right     — node rendered at right
 *   sticky    — when "top" or "bottom" applies fixed positioning with backdrop blur
 *   className — extra classes for the outer wrapper
 *
 * Children may be passed instead of left/center/right for raw layouts.
 */
const StatusBar = ({
  left,
  center,
  right,
  sticky,
  className = "",
  children,
}) => {
  const positionClass =
    sticky === "top"
      ? "fixed top-0 left-0 right-0 z-50 border-b"
      : sticky === "bottom"
      ? "fixed bottom-0 left-0 right-0 z-40 border-t"
      : "border-b";

  return (
    <div
      className={[
        positionClass,
        "border-outline-variant bg-background/80 backdrop-blur-md",
        "px-margin-mobile md:px-margin-desktop",
        "h-12 flex items-center",
        "font-mono text-label-sm text-on-surface-variant",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children ? (
        children
      ) : (
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-3">{left}</div>
          {center ? (
            <div className="hidden md:flex items-center gap-6">{center}</div>
          ) : null}
          <div className="flex items-center gap-4">{right}</div>
        </div>
      )}
    </div>
  );
};

export default StatusBar;
