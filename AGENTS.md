# kodaallison.dev

Personal portfolio. Next.js 16 (App Router, JS not TS), React 18, Tailwind 3.4,
deployed on Vercel. Node 24.

**This repo is mid-rebuild.** Before touching anything under `src/`, read
[`docs/redesign/README.md`](docs/redesign/README.md) — it explains the design
system, the rules that are load-bearing rather than stylistic, and what is
already decided. The design itself is in
[`docs/redesign/artboards/`](docs/redesign/artboards/README.md).

Work happens on `trunk/portfolio-overhaul`, not `main`.

## Commands

```bash
npm run dev     # localhost:3000
npm run lint    # must exit 0
npm test        # node --test — no framework installed, keep it that way
npm run build   # must exit 0
```

Check the real exit code — `npm run lint | tail` reports *tail's* status, so a
failure reads as a pass. Use `npm run lint; echo "exit: $?"`.

## Data

Nothing on this site is typed in by hand if it can be fetched. Live data comes
from two places, both read-only from here:

- `src/lib/strava.js` → a Cloudflare Worker (separate repo, `strava-worker`)
  that caches Strava on a cron. This repo holds no Strava secrets.
- `src/lib/github.js` → the GitHub commits API.

If a fetch fails, **the module does not render**. It never shows a placeholder,
a zero it did not measure, or a "live" label over stale data. This is a design
rule with a written rationale, not a preference — see the redesign doc before
changing any fallback behaviour.

## Conventions

- Comments explain *why*, not *what*. The existing ones are worth matching.
- Design values come from the token sheet (`src/app/globals.css`). If a value
  you need is not there, that is a design decision — raise it, don't invent it.
- Tickets live on the Koder board (project `portfolio-website`), via the
  `koder-ticket` skill. Move to `review` when the PR is up, `done` after merge.
