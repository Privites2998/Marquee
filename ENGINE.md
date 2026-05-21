# Engine vs Theme

A map of what's reusable engine code vs Broadway-specific theming.
The point of this doc is to make a future fork (Star Wars, classical music,
whatever) a content-and-paint job, not a rewrite.

Every time we add something new, ask: **"would this also work for a Star
Wars suite?"** If not, the thing belongs in a data file or a CSS variable,
not buried inside engine code.

---

## Engine (port as-is)

These files are pure mechanic. No theme strings, no hardcoded content.
A fork should be able to copy these unchanged.

| File | What it does |
|---|---|
| `shared.js` | dayIndex, storage, streak tracking, seeded RNG, share-text helper, page chrome helpers. *Almost* theme-free — see soft-coupling notes below. |
| `games/*/[game].js` | All six game engines (crossword, lyric, connections, actor, showdown, spotlight). Each reads its data file and renders. No theme knowledge. |
| `tools/grid-generator/generator.js` | Backtracking 5×5 solver |
| `tools/grid-generator/solver.py` | Same solver in Python for batch authoring |
| `tools/preview/preview.js` | Validators + iframe preview dashboard |

These can be lifted directly into a Star Wars / etc. fork.

---

## Brand surface (swap when forking)

The visual identity layer. A fork replaces these wholesale.

| File | What's in it |
|---|---|
| `index.html` | Hub title ("Marquee"), subtitle ("Daily Broadway games"), welcome-modal copy, footer text |
| `styles.css` | CSS custom properties at `:root` — currently theatrical (curtain reds, gold bulbs, playbill cream). Plus the `.bulbs` and `.bulbs--chase` motif specific to marquee lights. |

The CSS variables are **semantic-ish** but named after theater:
- `--curtain` / `--curtain-dark` → could be `--brand-deep` in a fork
- `--bulb-on` / `--bulb-off` → could be `--accent-on` / `--accent-dim`
- `--paper` → could be `--surface-light`

Renaming these is a one-pass sed across `styles.css` + game CSS files.
Worth doing at fork time, not before.

The bulb motif (`.bulbs`) is the most distinctly-theatrical visual element.
A Star Wars fork might replace it with a starfield pattern, a scrolling
crawl, or a lightsaber underline.

---

## Content (replace entirely)

Every game's data file is the obvious replace-target. These files have no
engine code — just arrays of puzzles.

| File | Star Wars equivalent |
|---|---|
| `games/crossword/puzzles.js` | Same grids work; just re-clue. Or generate fresh grids with the solver against a Star Wars-vocabulary word list. |
| `games/lyric/puzzles.js` | Reframe as Quote: famous lines + film + speaker. |
| `games/connections/puzzles.js` | New ACTORS DB (Hamill, Fisher, McGregor, Ridley…), new constraint catalog (films, factions, lightsaber color, alive at end of saga). |
| `games/actor/actors.js` | Star Wars actors — Hamill, Pedro Pascal, Diego Luna, etc. Bio + 5 credits. |
| `games/showdown/matchups.js` | Box office, runtimes, character ages, ship lengths. |
| `games/spotlight/categories.js` | Original Trilogy / Prequel Trilogy / The Mandalorian / Droids / Planets / etc. |

Also update `tools/grid-generator/words.js` if you want a vocabulary tilted
toward sci-fi/Star Wars words — most 5-letter words like FORCE, JEDIS,
SITHS, EWOKS, HOTHS, NABOO, YODAS work.

---

## Soft engine coupling (cheap renames at fork time)

These are places where the engine peeks at brand-y strings. Each is a 1-line fix:

| Location | What it says now | Fix |
|---|---|---|
| `shared.js` `shareText()` | `'Marquee · ' + gameName + …` | Parameterize brand name as a constant at top of file |
| `shared.js` `GAMES` array | Descriptions like "5×5 grid. Broadway clues only." | Pure data — just edit |
| `shared.js` `DIFFICULTY_INDEX` | Tied to current Broadway puzzle order | Re-author for new puzzles |
| `index.html` welcome modal copy | Mentions "Broadway puzzles," "clean sweep" | Edit text |
| Each game's `index.html` `<title>` | "Mini Crossword · Marquee" | Edit text |
| Each game's `title:` in `renderGameHeader()` calls | "Mini Crossword", "Lyric", etc. | Game-mechanic names, not theme — usually keep |

The game mechanic names (Crossword, Lyric, Connections, etc.) are
themselves generic. **Spotlight** is the most theatrical — could rename to
"Category" or keep it; it's not specifically Broadway.

---

## How to fork, step by step

When you start the Star Wars version (call it Holocron, Outer Rim, whatever):

1. **Decide repo strategy**: separate repo recommended (own URL, own brand).
   Either fork this repo on GitHub or copy the file tree into a fresh repo.
2. **Rename the brand**: search-and-replace "Marquee" across the codebase
   (HTML titles, `shareText()`, hub copy). Probably ~15 occurrences.
3. **Swap the palette**: edit `:root` CSS variables in `styles.css`. Map old
   semantic colors to new ones (red curtain → black-and-blue, gold bulb →
   saber-blue or saber-red).
4. **Swap the motif**: replace `.bulbs` with whatever your new visual
   shorthand is (starfield? scrolling crawl?). Same `data-` API; same
   selectors used throughout.
5. **Replace data files**: each game's `puzzles.js` (or equivalent) gets
   rewritten. The engines don't change.
6. **Update difficulty index**: `DIFFICULTY_INDEX` in `shared.js` —
   re-author per new puzzle list.
7. **Rewrite the welcome modal** in `index.html`.
8. **Test via preview tool**: `/tools/preview/index.html` will run all the
   structural validators against the new data — catches missing fields.

Estimated time for someone with deep Star Wars knowledge: a long weekend
for v0.5, another week to reach 1.0 parity with Marquee.

---

## What NOT to do prematurely

- Don't extract shared engine code into a separate package now. Premature
  modularization adds friction without payoff until there are 2+ consumers.
- Don't templating-engine-ify the CSS. Variables are enough.
- Don't rename `--bulb-on` to `--accent-on` before forking — the cognitive
  cost of working with abstract names in the only suite you have isn't
  worth it.
- Don't write generic engine docs. This file is the docs.

The principle: **stay coupled until the second consumer arrives, then
decouple at fork time, not before.**
