# duel-of-sigils

[![make.fun · best-game-01](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![rank](https://make.fun/badge/best-game-01/sastra-wev/duel-of-sigils/rank.svg)](https://make.fun/bounty/best-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![reward](https://make.fun/badge/best-game-01/sastra-wev/duel-of-sigils/reward.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)

**Duel of Sigils** is a turn-based card-duelling gauntlet for the browser. Eight foes wait in the tower — a Hollow Imp, an Ash Hound, a Gloom Scribe, a Thorn Revenant, the Pale Herald, a Cinder Wisp, a Mirror Warden, and the Sigil Eater — and each run climbs six rungs against five of them, shuffled, with the Sigil Eater always waiting at the top.

Each turn you draw sigils and spend 3 Energy to play them: strikes, blocks, heals and hexes. The foe's next move is always telegraphed, so every turn is a decision — kill now, block the blow you can see coming, or set up a Vulnerable foe for a bigger hit. Win a duel and choose one reward: draft one of three new cards into your deck, temper a sigil you already own into its stronger form, or mend 10 HP. The deck you arrive at the boss with is the deck your choices built. Fall once and the run ends; your score is duels won, the HP you kept, and the drafts you took.

Everything is original: the foes, the sigil glyphs (inline SVG runes), the parchment-and-gold art direction, and every sound, which is synthesised live with WebAudio — there are no asset files and no network requests. Static files only, no build step, no library: the whole game is hand-written ES modules.

## Run it

```sh
node serve.ts            # then open http://localhost:8902
```

Or serve the `game/` folder with any static file server and open `game/index.html`.

## Play

- Click a card to play it (its Energy cost is the gold coin on its corner).
- Click **End Turn** — or press Space — when you are done; the foe then plays the move it telegraphed.
- After each victory, choose one reward: draft a new sigil, temper one you own, or mend 10 HP.
- Staged scenes for screenshots: `?shot=title|battle|draft|end`, and `?seed=N` fixes the shuffle.

## Structure

- `game/src/cards.js` — every card as data: cost, kind, text, effects.
- `game/src/enemies.js` — the six foes and their telegraphed intent tables.
- `game/src/battle.js` — the duel engine: energy, Block, Vulnerable, Weak, thorns, intents.
- `game/src/run.js` — the gauntlet: the carried deck, HP between duels, the draft, the score.
- `game/src/render.js` — all screens as DOM, including the sigil glyph paths.
- `game/src/audio.js` — the WebAudio synth sounds.
- `game/src/shots.js` — seeded staging for the screenshots.
- `game/src/main.js` — the screen flow that wires it together.
- `main.ts` — the entry program: copies `game/` and `screenshots/` to the output and writes `dossier.json` with the vendored make.fun library.
