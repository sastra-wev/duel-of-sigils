# duel-of-sigils

[![make.fun · best-game-01](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![rank](https://make.fun/badge/best-game-01/sastra-wev/duel-of-sigils/rank.svg)](https://make.fun/bounty/best-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![reward](https://make.fun/badge/best-game-01/sastra-wev/duel-of-sigils/reward.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)

**Duel of Sigils** is a turn-based card-duelling gauntlet for the browser. Ten foes wait in the tower — a Hollow Imp, an Ash Hound, a Cinder Wisp, a Gloom Scribe, a Grave Bell, a Mirror Warden, a Thorn Revenant, the Pale Herald, a Sigil Eater, and the Sigil Sovereign — and each run climbs six rungs against them: the Imp always opens, two early and two late foes are shuffled in from their bands so the difficulty curve never inverts, the fifth rung fights as a crowned **Elite**, and the Sovereign always closes the run.

Each turn you draw sigils and spend 3 Energy to play them: strikes, blocks, heals and hexes. The foe's next move is always telegraphed with its exact numbers, so every turn is a decision — kill now, block the blow you can see coming, or set up a Vulnerable foe for a bigger hit. The systems lean on each other: Hex Marks feed the Executioner, Block feeds Bramble Ward and the Aegis, the Rallying Sigil's Strength lifts every cheap hit, and Soul Burn ticks through Block while you hide behind it. The Sovereign is a two-phase boss: at half strength its crown breaks, your hexes wash off, and a harder table of moves is telegraphed for the second duel inside the duel.

Win a duel and choose one reward from four: draft one of three new cards into your deck, temper a sigil you already own into its stronger form, take the **relic** on offer — a passive rule (a whetstone's +1 damage, a thorn crown, an ember heart) that follows you for the rest of the run — or mend 10 HP. The deck and relics you arrive at the boss with are the ones your choices built. Fall once and the run ends; your score is duels won, the HP you kept, and the drafts you took — and the end screen tells the run back: every foe that fell, the relics you carried, and the damage, turns and blocks behind the score.

A first duel teaches as it goes, with one plain hint a turn; a How to Play & Glossary overlay — open from the title or from any duel — explains every status in the game, and every status chip carries its own tooltip. Blows land with floating damage numbers, particle sparks in the foe's own colours, hit-shake, and an arena that takes each foe's palette. Everything is original: the foes, the sigil glyphs (inline SVG runes), the parchment-and-gold art direction, and every sound, which is synthesised live with WebAudio — there are no asset files and no network requests. Static files only, no build step, no library: the whole game is hand-written ES modules.

## Run it

```sh
node serve.ts            # then open http://localhost:8902
```

Or serve the `game/` folder with any static file server and open `game/index.html`.

## Play

- Click a card to play it (its Energy cost is the gold coin on its corner).
- Click **End Turn** — or press Space — when you are done; the foe then plays the move it telegraphed.
- After each victory, choose one reward: draft a new sigil, temper one you own, take the relic, or mend 10 HP.
- Press **?** at any time for the rules and the glossary of statuses.
- Staged scenes for screenshots: `?shot=title|battle|draft|end`, and `?seed=N` fixes the shuffle.

## Structure

- `game/src/cards.js` — every card as data: cost, kind, text, effects, and the synergies between them.
- `game/src/enemies.js` — the ten foes in three bands, their telegraphed intent tables, the Elite crowning and the boss's second phase.
- `game/src/battle.js` — the duel engine: energy, Block, Vulnerable, Weak, Thorns, Burn, Strength, intents, and the crown breaking.
- `game/src/run.js` — the gauntlet: the carried deck, relics and HP between duels, the four-way draft, the score.
- `game/src/relics.js` — the six passive relics the draft can offer.
- `game/src/glossary.js` — the words of the help overlay: how a run works and what every status means.
- `game/src/render.js` — all screens as DOM, including the sigil glyph paths, intent banner, tooltips and tutorial hints.
- `game/src/effects.js` — the particle sparks that fly when a blow lands.
- `game/src/audio.js` — the WebAudio synth sounds, one voice per foe family.
- `game/src/shots.js` — seeded staging for the screenshots.
- `game/src/main.js` — the screen flow that wires it together.
- `main.ts` — the entry program: copies `game/` and `screenshots/` to the output and writes `dossier.json` with the vendored make.fun library.
