# Portfolio UI and UX Review

**Audited:** 2026-09-03

**Baseline:** `docs/redesign/README.md`, design tokens, and six-pillar standards

**Screenshots:** Captured at desktop and mobile widths before fixes; post-fix recapture was unavailable because the local headless browser stopped writing new files

**Routes:** `/`, `/projects`, `/run`, `/contact`

---

## Pillar Scores

| Pillar | Score | Key finding |
|---|---:|---|
| 1. Copywriting | 3/4 | Specific, candid copy is strong; repeated arrow suffixes and metadata fragments remain. |
| 2. Visuals | 3/4 | The trace-led identity is distinctive, but a few dense data blocks compete with portfolio evidence. |
| 3. Color | 4/4 | A disciplined token palette with accessible contrast and semantic amber usage. |
| 4. Typography | 3/4 | The three-family system is intentional; tracked all-caps micro-labels were overused and were reduced. |
| 5. Spacing | 3/4 | The token rhythm is consistent; some deliberate one-off layout dimensions remain outside the spacing scale. |
| 6. Experience Design | 3/4 | Mobile variants and reduced motion are strong; the menu target and narrow contact rows needed correction. |

**Overall: 19/24**

---

## Top 3 Priority Fixes

1. **Fixed — simplify generated-looking metadata chrome.** Removed the projects count/status strip and replaced decorative project states with plain, useful availability text in `src/app/projects/page.js:50` and `src/app/components/ProjectCard.jsx:37`.
2. **Fixed — make mobile actions reliably tappable.** Increased the menu trigger to 44px, connected it to the controlled region, and made hero actions flexible 44px targets in `src/app/components/Navbar.jsx:85` and `src/app/components/Hero.jsx:44`.
3. **Fixed — reduce tracked all-caps micro-type.** Changed page eyebrows, data labels, card metadata, and compact chart captions to sentence case across the audited routes and shared components.

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)

- **WARNING:** The main copy is unusually concrete for a portfolio: it names actual systems, responsibilities, and outcomes instead of generic claims (`src/app/page.js:94`, `src/data/projects.json`).
- **WARNING:** Arrow suffixes remain on several links and data routes (`src/app/page.js:137`, `src/app/page.js:158`, `src/app/components/SectionHeading.jsx:12`). These are coherent with the data-flow motif but should not spread further.
- Fixed a dashboard-like `all/live/featured/archived` summary that delayed recruiters reaching selected work.

### Pillar 2: Visuals (3/4)

- **WARNING:** The hero trace is a genuine portfolio-specific focal point rather than decorative gradient/card chrome (`src/app/components/HeroTrace.jsx`).
- **WARNING:** GitHub activity is visually dense and precedes the project list on small screens (`src/app/projects/page.js:35`). Consider moving it below the first featured project if recruiter scan testing shows it delays evidence.
- There are no rounded-card grids, pill clouds, generic gradients, or meaningless status icons. Project metadata is now quiet, sentence-case text.

### Pillar 3: Color (4/4)

- **WARNING:** No defect was found, but amber must remain restricted to current/live/interactive meaning. The current implementation follows that rule (`src/app/globals.css:24-53`).
- All hardcoded colors are centralized tokens; components consume semantic Tailwind mappings. Documented contrast ratios range from 4.79:1 for muted copy to 15.26:1 for primary text.
- Heatmap shades form a single purposeful scale shared by running and commit data rather than decorative color scatter.

### Pillar 4: Typography (3/4)

- **WARNING:** Pre-fix captures showed 9-11px, widely tracked uppercase captions reading as generated dashboard chrome. Eyebrows and metric captions are now sentence case; compact chart captions were raised from 9px to 10px (`src/app/components/HeroTrace.jsx:78`).
- The remaining uppercase treatment is concentrated in display headlines and functional data/table labels (`src/app/components/Hero.jsx:30`, `src/app/run/page.js:139`). This is defensible as identity, but should be tested on physical phones for raster sharpness.
- Font roles are consistently separated: Space Grotesk for display/numerals, IBM Plex Sans for prose, JetBrains Mono for data/navigation.

### Pillar 5: Spacing (3/4)

- **WARNING:** Core rhythm consistently uses the documented 4/8/12/18/24/32/44px token scale. Mobile gutters remain 20px and desktop gutters 72px across routes.
- A small set of intentional layout measurements remains arbitrary: 72/76px page geometry, 660px chart hero, 340px running chart, and fixed data-column widths. They are contract-backed, but future changes should promote repeated gutter values to named layout tokens (`src/app/page.js:82`, `src/app/components/Hero.jsx:21`, `src/app/run/page.js:94`).
- Fixed the archive heading so its annotation stacks instead of squeezing at narrow widths (`src/app/projects/page.js:62`).

### Pillar 6: Experience Design (3/4)

- **WARNING:** Post-fix screenshot verification could not be completed; the browser produced pre-fix captures, then failed to write subsequent files. Code, lint, and unit-test verification succeeded.
- Mobile has purpose-built chart and activity layouts rather than scaled desktop tables (`src/app/components/HeroTrace.jsx`, `src/app/run/page.js:137-168`).
- Reduced-motion handling preserves final visible states (`src/app/globals.css:131`, `src/app/globals.css:220`). Global keyboard focus is visible (`src/app/globals.css:126`).
- Fixed the 36px menu trigger to 44px and added `aria-controls`; contact handles now use a non-overflowing two-column grid with breakable text (`src/app/components/Navbar.jsx:85`, `src/app/contact/page.js:54`).
- Data-fetch failures correctly collapse optional modules rather than displaying invented values.

---

## Fixes Made

- Removed repeated “open to work” status text from desktop and mobile navigation.
- Removed the project count/status dashboard strip.
- Reworded project availability metadata and removed decorative arrow suffixes from project actions.
- Increased mobile navigation and hero CTA target sizes.
- Added mobile navigation control semantics.
- Reduced all-caps/tracked labels across home, projects, running, contact, books, live data, cards, and compact trace captions.
- Made contact rows and archive headings robust at narrow widths.

## Remaining Recommendations

- Run a short recruiter scan test: can someone identify role, strongest project, stack, and contact route in 20 seconds on a 375px phone?
- Consider moving GitHub activity below the first featured project on mobile.
- Re-capture post-fix screenshots in a normal browser environment and inspect 320px, 375px, 768px, and 1440px widths.
- Consider self-hosting the three fonts so production builds do not depend on Google Fonts availability at build time.

## Verification

- `npm run lint` — passed.
- `npm test` — passed, 38/38 tests.
- `npm run build` — passed after allowing the build to fetch IBM Plex Sans, JetBrains Mono, and Space Grotesk.
- Pre-fix screenshots are git-ignored under `.planning/ui-reviews/audit-20260903/`.
- Registry audit skipped: no `components.json` / shadcn registry configuration.

## Files Audited

- `docs/redesign/README.md`
- `tailwind.config.js`
- `src/app/globals.css`
- `src/app/layout.js`
- `src/app/page.js`
- `src/app/projects/page.js`
- `src/app/run/page.js`
- `src/app/contact/page.js`
- All files in `src/app/components/`
- Portfolio content in `src/data/`
