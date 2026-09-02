/** @type {import('tailwindcss').Config} */

// Every value here resolves to a custom property defined in src/app/globals.css,
// which is the single source of truth (and the only thing the globe canvas can
// read at runtime). Nothing in this file restates a hex — if you find yourself
// wanting to, the value belongs on the token sheet first.
//
// Naming: the token sheet's names are kept wherever Tailwind's own grammar
// allows it. Two are renamed to avoid colliding with utilities Tailwind already
// owns, and the mapping is one-to-one:
//
//   --border*       ->  line        (border-line, border-line-subtle, bg-line)
//   --text-*        ->  ink         (text-ink, text-ink-lead, text-ink-muted)
//
// `line` is also the grid-seam colour: seams are a 1px gap over a bg-line
// background, never per-cell borders.
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: {
          DEFAULT: "var(--surface)",
          sunken: "var(--surface-sunken)",
        },
        line: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
        ink: {
          DEFAULT: "var(--text-primary)",
          lead: "var(--text-lead)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          dim: "var(--accent-dim)",
        },
        heat: {
          0: "var(--heat-0)",
          1: "var(--heat-1)",
          2: "var(--heat-2)",
          3: "var(--heat-3)",
          4: "var(--heat-4)",
        },

        // DEPRECATED — Terminal OS palette. Retained only so the not-yet-
        // rebuilt sections keep rendering on trunk; deleted with the
        // terminal-era components (Koder ticket t_mtk6uycb_6831c). Do not
        // reach for these in new work.
        background: "#020617",
        "surface-container-lowest": "#0a0f14",
        "surface-container-low": "#171c21",
        "surface-container": "#1b2025",
        "surface-container-high": "#252a30",
        "surface-container-highest": "#30353b",
        "surface-bright": "#353a3f",
        "terminal-header": "#1e293b",
        terminal: "#00ffc2",
        "terminal-dim": "#00e1ab",
        signal: "#ffe600",
        cyan: "#22d3ee",
        "on-surface": "#dee3ea",
        "on-surface-variant": "#b9cbc1",
        outline: "#83958c",
        "outline-variant": "#3a4a43",
      },

      // Three families, three jobs — see the note in globals.css.
      fontFamily: {
        display: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-ibm-plex-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },

      // Size comes from the custom property so one class is correct at every
      // width. Weight and line height are fixed per step. Letter-spacing is not
      // on the token table; the values below are read off the artboard markup,
      // which tracks tighter the larger the type gets — 96px at -0.045em down
      // to -0.02em for every heading step. heading-s is the only one the
      // artboards never set; it follows its neighbours.
      fontSize: {
        "display-xl": ["var(--display-xl)", { lineHeight: "0.95", fontWeight: "700", letterSpacing: "-0.045em" }],
        "display-l": ["var(--display-l)", { lineHeight: "1.02", fontWeight: "700", letterSpacing: "-0.04em" }],
        "display-m": ["var(--display-m)", { lineHeight: "1.0", fontWeight: "700", letterSpacing: "-0.03em" }],
        "heading-l": ["var(--heading-l)", { lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.02em" }],
        "heading-m": ["var(--heading-m)", { lineHeight: "1.15", fontWeight: "700", letterSpacing: "-0.02em" }],
        "heading-s": ["var(--heading-s)", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.02em" }],
        "body-l": ["var(--body-l)", { lineHeight: "1.55", fontWeight: "400" }],
        "body-m": ["var(--body-m)", { lineHeight: "1.6", fontWeight: "400" }],
        "mono-m": ["var(--mono-m)", { lineHeight: "1.7", fontWeight: "400" }],
        "mono-s": ["var(--mono-s)", { lineHeight: "1.8", fontWeight: "400" }],
        "mono-xs": ["var(--mono-xs)", { lineHeight: "1.7", fontWeight: "400" }],
      },

      // Deliberately NOT keyed 1-7: Tailwind's default scale already owns those
      // keys, and quietly redefining them would move every p-4 and gap-6 in the
      // sections that have not been rebuilt yet. These are additive, so the
      // step reads at the call site (p-space-6, gap-space-2).
      spacing: {
        "space-1": "4px",   // icon gaps
        "space-2": "8px",   // tag gaps, tight stacks
        "space-3": "12px",  // button gaps
        "space-4": "18px",  // label to value
        "space-5": "24px",  // inside a card
        "space-6": "32px",  // card padding
        "space-7": "44px",  // between sub-blocks

        // DEPRECATED — the old layout scale, still load-bearing for the 35
        // call sites in the sections that have not been rebuilt yet (removing
        // them silently drops every page's padding and max width, which
        // renders but looks broken). Out with the terminal-era components.
        // Note max-w-container-max works because Tailwind 3.4's maxWidth
        // scale spreads theme('spacing').
        gutter: "24px",
        "margin-desktop": "48px",
        "margin-mobile": "20px",
        "container-max": "1440px",
      },

      transitionDuration: {
        hover: "150ms",
        reveal: "400ms",
        spine: "280ms",
      },
      transitionTimingFunction: {
        hero: "cubic-bezier(0.65, 0, 0.35, 1)",
        spine: "cubic-bezier(0.34, 1.4, 0.64, 1)",
      },
    },

    // Radius is 0 everywhere: no rounded corners, no pills, no rounded cards.
    // Overriding rather than extending means a stray `rounded-lg` left behind
    // by the old build renders square instead of quietly surviving the rebuild.
    //
    // `full` is the one exception and is not a loophole: the chosen direction
    // uses it only for 9-10px dots (the headline full stop, the live-strip
    // status dots), which are circles rather than rounded boxes. Every boxy
    // radius in the canvas — 3, 4, 6 and 8px — belongs to the Direction C
    // "Terminal, grown up" artboard, which was not the direction taken.
    borderRadius: {
      none: "0",
      DEFAULT: "0",
      sm: "0",
      md: "0",
      lg: "0",
      xl: "0",
      "2xl": "0",
      "3xl": "0",
      full: "9999px",
    },
  },
  plugins: [],
};
