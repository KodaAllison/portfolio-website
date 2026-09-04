# Redesign artboards

The design source of truth for the 2026 rebuild of kodaallison.dev. These are
the artboards from the *Portfolio Redesign Directions* canvas, exported from
Claude Design and committed here so the design does not live only in a link.

They are plain HTML. Open any of them directly in a browser — no build step, no
tooling. `canvas.json` records each artboard's title, page and position on the
canvas, which is what tells you how they relate to each other.

> The **previous** design lives in `design/` at the repo root. That folder is
> gitignored and always has been, so it is on Koda's machine and not here. Do
> not take values from it.

## What is in here

### page-1 — the chosen direction

| File | Artboard | Size |
| --- | --- | --- |
| `Main.dc.html` | Home | 1440 × 3560 |
| `Mobile.dc.html` | Home — mobile | 390 × 4150 |
| `Projects.dc.html` | Projects | 1440 × 2840 |
| `ProjectsMobile.dc.html` | Projects — mobile | 390 × 3420 |
| `Contact.dc.html` | Contact | 1440 × 1140 |
| `ContactMobile.dc.html` | Contact — mobile | 390 × 1160 |
| `RunPage.dc.html` | Running | 1440 × 2070 |
| `RunMobile.dc.html` | Running — mobile | 390 × 1910 |

### page-2 — the system

| File | Artboard | What it settles |
| --- | --- | --- |
| `Tokens.dc.html` | Design tokens | Every colour, type step, spacing step and motion value the site is allowed to use |
| `States.dc.html` | Data states | What each module does when its fetch fails |
| `Components.dc.html` | Component states | Chips, buttons, links, form fields |

### page-3 — directions not taken

| File | Artboard |
| --- | --- |
| `TrainingLog.dc.html` | Direction B — Training Log |
| `TerminalGrownUp.dc.html` | Direction C — Terminal, grown up |

**These were rejected.** They are kept because they explain the choice, not
because they are implementable. Reading a value out of them is a bug — for
example, every rounded corner in this whole folder (3px, 4px, 6px, 8px) lives
in `TerminalGrownUp.dc.html`, which is why "radius 0 everywhere" is a rule the
chosen direction can actually keep.

## Two warnings before you take a number out of an artboard

**Distinguish spec from illustration.** Geometry and layout in the artboards are
authoritative. *Content* is not always: the hero in `Main.dc.html` labels two
marathons at 4:13:08 and 4:13:14, while `src/data/run.json` records the real PB
as 4:11:11. At least some figures were placeholders to make the picture read.
Treat prose and numbers as a draft to confirm with Koda; treat positions,
sizes and colours as the spec.

**The chart artboards are pictures of one moment.** `Main.dc.html` has the hero
curve as a literal path with the milestone labels at fixed coordinates. The
implementation derives all of that from live data instead — see
[the handbook](../README.md)`docs/redesign/README.md`. The artboard is how it should *look* with the data it
had, not a set of constants to copy.

## The one rule the token sheet states about itself

> these are the only values. If something needs a value not on this sheet, it is
> a design decision — not an implementation one.

Every token in `Tokens.dc.html` is transcribed into `src/app/globals.css` as a
CSS custom property. If you need a value that is not there, change the sheet
(and this folder) rather than inventing one at a call site.
