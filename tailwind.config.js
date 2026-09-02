/** @type {import('tailwindcss').Config} */

// The token sheet is the complete set of legal values. A value that is not in
// here is a design decision, not an implementation one — so once a component is
// on the new system it must not reach for an arbitrary Tailwind value
// (`text-[13.5px]`, `bg-[#e0a355]`). That constraint is the mechanism that stops
// the drift this sheet was built to fix.
const tokens = {
  bg: "#0d0f11", // page background — cold graphite, no green cast
  surface: "#14171a", // raised cards, code cards, the current-role band
  "surface-sunken": "#0a0c0d", // image wells, globe interior
  land: "#262b2f", // globe: unvisited landmass

  border: "#242a2e", // section rules
  "border-subtle": "#1b2023", // dividers inside a group
  "border-strong": "#39424a", // globe edge, emphasis rules

  "text-primary": "#e8e5e0", // headings, key values, the hero trace itself
  "text-lead": "#b6b3ac", // lead paragraph under the h1
  "text-secondary": "#9a978f", // body copy
  "text-muted": "#87847d", // labels, captions, axis text — do not go darker

  // One accent. Amber means live, interactive, or current — never decoration.
  // The previous #3ecf8e was Supabase's brand green exactly, which is a large
  // part of why the old site read as a template.
  accent: "#e0a355",
  "accent-hover": "#f0bd7d",
  "accent-dim": "#6b4d24", // borders on accent-tinted chips
  "accent-wash": "#2a1f10", // accent-tinted fills
};

// Legacy keys from the "Terminal OS" palette, aliased onto the new tokens so
// pages still render while they are rebuilt page by page. Three separate accent
// hues (terminal / signal / cyan) all collapse onto the single accent, which is
// the point of the new system. DELETE these once no component references them.
const deprecated = {
  background: tokens.bg,
  "surface-container-lowest": tokens["surface-sunken"],
  "surface-container-low": tokens.surface,
  "surface-container": tokens.surface,
  "surface-container-high": tokens.border,
  "surface-container-highest": tokens["border-strong"],
  "surface-bright": tokens["border-strong"],
  "terminal-header": tokens.surface,
  terminal: tokens.accent,
  "terminal-dim": tokens.accent,
  signal: tokens.accent,
  cyan: tokens.accent,
  "on-surface": tokens["text-primary"],
  "on-surface-variant": tokens["text-secondary"],
  outline: tokens["text-muted"],
  "outline-variant": tokens.border,
};

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: { ...tokens, ...deprecated },

      fontFamily: {
        display: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-plex-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },

      // 12 steps, and nothing between them. `-m` variants are the mobile sizes
      // from the token sheet; anything without one is the same at both widths.
      fontSize: {
        "display-xl": ["96px", { lineHeight: "0.95", letterSpacing: "-0.045em", fontWeight: "700" }],
        "display-xl-m": ["44px", { lineHeight: "0.98", letterSpacing: "-0.04em", fontWeight: "700" }],
        "display-l": ["84px", { lineHeight: "0.98", letterSpacing: "-0.04em", fontWeight: "700" }],
        "display-l-m": ["40px", { lineHeight: "1.0", letterSpacing: "-0.035em", fontWeight: "700" }],
        "display-m": ["46px", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-m-m": ["34px", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "700" }],
        "heading-l": ["34px", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading-l-m": ["25px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading-m": ["26px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading-m-m": ["21px", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "700" }],
        "heading-s": ["22px", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "700" }],
        "heading-s-m": ["19px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "700" }],
        "body-l": ["18px", { lineHeight: "1.55", fontWeight: "400" }],
        "body-l-m": ["16px", { lineHeight: "1.55", fontWeight: "400" }],
        "body-m": ["15px", { lineHeight: "1.65", fontWeight: "400" }],
        "mono-m": ["13px", { lineHeight: "1.9", fontWeight: "400" }],
        "mono-s": ["12px", { lineHeight: "1.7", fontWeight: "400" }],
        "mono-xs": ["11px", { lineHeight: "1.7", fontWeight: "400" }],
        label: ["10px", { lineHeight: "1.4", letterSpacing: "0.14em", fontWeight: "500" }],
      },

      spacing: {
        gutter: "24px",
        "margin-desktop": "72px", // page padding on the 1440 artboards
        "margin-mobile": "22px",
        "container-max": "1440px",
      },

      // Radius is 0 everywhere. Corners are not a design lever in this system.
      borderRadius: {
        none: "0",
        DEFAULT: "0",
        sm: "0",
        md: "0",
        lg: "0",
        xl: "0",
        full: "9999px", // dots and the status pill only
      },

      // Rules are 1px. There is no 2px border in the system.
      borderWidth: { DEFAULT: "1px" },
    },
  },
  plugins: [],
};
