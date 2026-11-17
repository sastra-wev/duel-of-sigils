// relics.js — the passives offered in the post-duel draft beside the cards,
// the temper and the mend. A relic is a rule that follows you for the rest
// of the run: it is never drawn, never discarded, and each one can be taken
// only once. battle.js reads the combat relics when a duel starts; run.js
// reads the Ember Heart when a duel is won. The draft offers one relic at a
// time, so the choice is always "this rule, or a card, or the heal".

export const RELIC_DEFS = {
  whetstone: {
    name: 'Whetstone Charm', glyph: 'stone',
    text: 'Your attacks deal +1 damage in every duel.',
  },
  bulwarkcharm: {
    name: 'Bulwark Charm', glyph: 'wall',
    text: 'Begin every duel with 6 Block already raised.',
  },
  thorncrown: {
    name: 'Thorn Crown', glyph: 'thorn',
    text: 'Begin every duel with Thorns 1: a foe that strikes you takes 1 damage back.',
  },
  hourglass: {
    name: 'Thief\u2019s Hourglass', glyph: 'hourglass',
    text: 'Draw 2 extra cards on the first turn of every duel.',
  },
  goldenweb: {
    name: 'Golden Web', glyph: 'sun',
    text: 'Gain +1 Energy on the first turn of every duel.',
  },
  emberheart: {
    name: 'Ember Heart', glyph: 'heart',
    text: 'After every duel you win, restore 3 more HP.',
  },
};

export const RELIC_IDS = Object.keys(RELIC_DEFS);

export function relicDef(id) {
  const def = RELIC_DEFS[id];
  if (!def) throw new Error(`unknown relic id: ${id}`);
  return def;
}

// Does the run already carry this relic? battle.js asks by id for each rule.
export function hasRelic(relics, id) {
  return Array.isArray(relics) && relics.includes(id);
}

// One relic the run does not own yet, drawn with the run's rng — or null
// when the collection is complete and the draft should offer no relic.
export function relicOffer(rng, owned) {
  const missing = RELIC_IDS.filter((id) => !owned.includes(id));
  if (missing.length === 0) return null;
  return missing[Math.floor(rng() * missing.length)];
}
