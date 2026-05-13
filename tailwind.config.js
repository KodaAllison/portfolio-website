/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Terminal OS palette
        background: "#020617", // slate-950 — canvas (matches Stitch render)
        surface: "#0f1419",
        "surface-container-lowest": "#0a0f14",
        "surface-container-low": "#171c21",
        "surface-container": "#1b2025",
        "surface-container-high": "#252a30",
        "surface-container-highest": "#30353b",
        "surface-bright": "#353a3f",
        "terminal-header": "#1e293b",

        // Brand accents
        terminal: "#00ffc2", // primary teal — actions, active state
        "terminal-dim": "#00e1ab",
        signal: "#ffe600", // secondary yellow — warnings, highlights
        cyan: "#22d3ee", // tertiary cyan — links, variables (matches Stitch render)

        // Foreground
        "on-surface": "#dee3ea",
        "on-surface-variant": "#b9cbc1",
        outline: "#83958c",
        "outline-variant": "#3a4a43",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "headline-lg": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-mobile": ["40px", { lineHeight: "1.1", fontWeight: "700" }],
        "headline-md": ["32px", { lineHeight: "1.2", fontWeight: "600" }],
        "code-display": ["48px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["15px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-md": ["13px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "1.4", fontWeight: "500" }],
      },
      spacing: {
        gutter: "24px",
        "margin-desktop": "48px",
        "margin-mobile": "20px",
        "container-max": "1440px",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 255, 194, 0.15)",
        "glow-lg": "0 0 40px rgba(0, 255, 194, 0.25)",
        terminal: "0 20px 50px -12px rgba(0, 0, 0, 0.5)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        grid: "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
        "grid-lg": "48px 48px",
      },
    },
  },
  plugins: [],
};
