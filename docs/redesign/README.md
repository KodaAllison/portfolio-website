# The 2026 rebuild — working notes

This is the handbook for the redesign of kodaallison.dev. It exists so that a
session which knows nothing about this work can pick up a ticket and not undo a
decision that was made for a reason.

Read this, then `docs/redesign/artboards/README.md`, then the ticket you were given.

---

## 1. Where things live

| What | Where |
| --- | --- |
| Design source of truth | `docs/redesign/artboards/` |
| Design tokens | `src/app/globals.css` — CSS custom properties |
| Tailwind → token mapping | `tailwind.config.js` — never restates a hex |
| Chart geometry (pure, tested) | `src/lib/trace.js`, `src/lib/heroLabels.js` |
| Tests | `src/lib/*.test.js`, run with `npm test` |
| Board | Koder, project `portfolio-website` (see §6) |

Work happens on **`trunk/portfolio-overhaul`**, a long-lived integration branch.
It has an open draft PR into `main`, so `main` is never left mid-rebuild. Small
foundation commits land on trunk directly; larger pieces should branch off it.

---

## 2. The three rules that are not style preferences

Most of the review comments on this work have come back to one of these. They
are load-bearing.

### Never render a number the site did not fetch

The page's own claim, printed under the hero, is *"every number on this page is
fetched, not typed."* That makes honesty a functional requirement, not a nicety.

From the data-states artboard: **a module that cannot get its data does not
render.** It never shows a placeholder value, a zero it did not measure, a joke,
or a "live" label over stale data. Order of preference when a fetch fails:

1. serve the last good cached value with an honest age label
2. collapse the module and reflow the layout
3. only if it is structural to the page, use a designed degraded state

The site used to render `"rip gps"` and `"n/a"` under a `SYNCED` badge. That is
the specific bug the sheet was written to prevent.

Consequences you will meet in the code:
- `LiveStrip` lists only sources that actually answered this render.
- The hero chart renders `null` with no data, and the headline rises. It is the
  one module structural enough to need a designed degraded state.
- Race markers are absent from the hero because no race *list* exists in the
  data — only a marathon PB. They were not invented.

### Derive chart claims, never hardcode them

The hero's accessible chart summary names the highest month only after deriving
it from the live series. Hardcode that claim and the day it stops being true the
site starts lying — the worst available bug on a page making the claim above.

The same reasoning governs which milestones get annotated at all: a career date
has no height on a distance curve, so one is annotated **only if the series
independently puts that month at an extreme**. Anything mid-range goes in the
timeline, where dates do not need heights.

### Never hide content behind a feature that might not exist

Everything is visible in the base stylesheet. Content only ever starts hidden
inside a query that has already *proven* support:

- `@supports (animation-timeline: view())` for the scroll-linked rail
- `@media (scripting: enabled)` for `Reveal`

Get this backwards and an unsupported browser — or one where the JS simply
failed — shows a blank page. Every failure path must lose an *animation*, never
the content. `Reveal` also reveals outright if `IntersectionObserver` is
missing, for the same reason.

> Note: an inline script stamping a `.js` class onto `<html>` before paint was
> tried first. It works, but it makes the server's markup and the client's
> disagree by construction, which React reports as a hydration mismatch —
> `suppressHydrationWarning` did **not** silence it on the root element. Use the
> media query. Do not reintroduce the script.

---

## 3. The token system

`src/app/globals.css` holds every value as a custom property; `tailwind.config.js`
maps utilities onto those properties and never writes a hex of its own.

Tokens live in CSS rather than only in the Tailwind config for two reasons: the
travel globe renders to a `<canvas>` and has to read its colours back with
`getComputedStyle` (a Tailwind class cannot help it), and it keeps one
grep-able list of what the site is allowed to use.

Two token families are renamed where Tailwind's grammar already owns the word.
The mapping is one-to-one:

| Token sheet | Tailwind | Example |
| --- | --- | --- |
| `--border`, `--border-subtle`, `--border-strong` | `line` | `border-line`, `bg-line` |
| `--text-primary`, `--text-lead`, … | `ink` | `text-ink`, `text-ink-muted` |

Things that will bite you:

- **Spacing is `space-1`…`space-7`, not `1`…`7`.** Keying them `1`–`7` would
  redefine Tailwind's default scale and silently move every `p-4` and `gap-6` in
  the not-yet-rebuilt sections.
- **Type sizes carry their mobile value in a `max-width: 767px` query**, so one
  class (`text-display-xl`) is correct at every width. 767px is the site's only
  mobile boundary — use it, don't invent a second one.
- **Radius is 0 everywhere except `rounded-full`**, which the design uses only
  for 9–10px dots. See the warning in `artboards/README.md`.
- **There is one accent.** Amber means live, interactive or current — never
  decoration. No second hue, no red-for-error: status is carried by text, not by
  colour alone.
- **Three families, three jobs.** Space Grotesk is display and numerals, IBM
  Plex Sans is prose, JetBrains Mono is data, labels and links. Never set a
  paragraph in mono.

### Deprecated tokens

`tailwind.config.js` still carries the old Terminal OS palette and the old
layout scale (`gutter`, `margin-mobile`, `margin-desktop`, `container-max`),
both marked `DEPRECATED`. They exist **only** so trunk renders at every commit
while sections are rebuilt one at a time. Do not use them in new work. They come
out with the terminal-era components (ticket `t_mtk6uycb_6831c`), at which point
this grep should be empty:

```bash
grep -rnE "text-terminal|bg-background|on-surface|outline-variant|margin-mobile|container-max" src/
```

---

## 4. The hero, in detail

The most-worked part of the rebuild, and the part with the most non-obvious
decisions.

**It ships no client JavaScript.** The draw-on is `stroke-dashoffset`, the label
stagger is `animation-delay`, the endpoint is a scale-in. The path carries
`pathLength="1"`, which normalises the dash units so one keyframe draws a path
of any real length. Keeping JS out means the trace is in the HTML: no layout
shift, no flash of an empty hero, and it renders with JS disabled — which
matters because it is part of the LCP. **Do not make it a client component.**

**Do not animate the `<h1>`.** It is almost certainly the LCP element; fading it
in delays LCP by exactly the length of the fade in exchange for nothing.

**The plot box is solved, not eyeballed.** From the artboard's own plotted
points — 130.6 km at y=69.4 and 9.5 km at y=248.4 against `yMax` 150 —
`innerH = 221.72` and `padTop = 40.72`, which puts the zero line at 262.44
against the artboard's axis rule at 262. `yMax` comes from `niceYTicks`, never a
constant, so an unusually big month cannot clip off the top.

**Label tiers are fixed bands.** A tier is a horizontal band the leader line
stretches to reach — *not* an offset from the annotated point. This was
originally offsets, which coupled a label's height to the ratio of its km to
`yMax` and let it walk out of the viewBox: a peak landing exactly on a tick
(100 km against `yMax` 100) put the top line at y=-12, and a 0 km month — which
the Worker emits explicitly — put the bottom one at y=310 in a 306 viewBox.
`src/lib/heroLabels.test.js` locks this; both tests were confirmed to fail
against the old behaviour rather than passing vacuously.

**The phone gets a different chart, not a scaled one.** An SVG scales with its
viewBox, so the desktop box at 390px is a 3.7× reduction that would render 11px
labels at ~3px. `CompactTrace` has its own box (`HERO_BOX_COMPACT`, solved from
the mobile artboard the same way) and no labels at all. Both charts render and
CSS picks one — a server component cannot know the viewport, and a media query
cannot reshape a viewBox. They share one `aria-label`; the hidden one is
`display:none` and so ignored by assistive tech, leaving exactly one exposed.

**The 660px band is conditional.** The artboard hero is 660px with the headline
pinned to the bottom, but that height is only correct while there is a chart to
fill it — the failed state is "headline rises", and a fixed height would strand
the headline at the bottom of an empty band.

---

## 5. Verifying your work

```bash
npm run lint
npm test
npm run build
```

All three must exit 0.

> **Read the real exit code.** `npm run lint | tail -20` reports *tail's* exit
> code, so a failing lint looks like a pass. This mistake was actually made
> during this work and hid 14 pre-existing errors for several commits. Use
> `npm run lint; echo "exit: $?"`, or redirect to a file.

`npm test` uses the Node built-in runner (`node --test`) — **no test framework
is installed and none should be**. The whole plan rests on refusing dependencies
that are not earning their place; the site's claim is that it was built
carefully, and a 40 KB animation library for four effects would contradict it.
The only runtime dependency the redesign adds is `d3-geo`, for the globe, lazily.

To see a change in the browser, `.claude/launch.json` defines a `portfolio-dev`
server on port 3000.

**Screenshots taken immediately after a navigation are often stale** — they can
capture the previous render or a mid-animation frame. This wasted time more than
once. Assert against the DOM (`getBoundingClientRect`, computed styles) when you
need a fact, and use screenshots for judgement rather than for measurement.

---

## 6. Working the board

Tickets live on Koder under project `portfolio-website` (and `strava-worker`).
Use the `koder-ticket` skill. `backlog` → `todo` → `doing` → `review` (PR up) →
`done` (merged, shipped). One ticket per distinct piece of work.

When you finish, move the ticket to `review`, not `done`.

---

## 7. Status

**Done:** design tokens · hero trace (desktop + mobile, annotations, pulse) ·
live strip · timeline as a date rail · scroll motion primitives · nav rebuild ·
repo lint green.

**Blocked:** the hero renders its degraded state — no chart — until the Strava
Worker serves `monthly_km`. That is `strava-worker` PR #3, which is open and
awaiting review and deploy. Nothing in this repo can unblock it.

**Next, roughly in order:** delete the terminal-era components once nothing
imports them · rebuild the homepage sections below the timeline · the travel
globe on canvas with `d3-geo` · restyle `WeeklyLine` and `/running` · Projects
and Contact pages · a full mobile pass.

Check the board rather than trusting this list — it is accurate as of the last
commit that touched this file, and nothing keeps it honest automatically.
