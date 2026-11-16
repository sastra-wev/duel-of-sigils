// cards.js — every card in Duel of Sigils: the starter deck and the draft pool.
// A card is data only; battle.js interprets the effect fields. `kind` drives the
// card's colour band and its sound. Text is written for a player who has never
// seen the game: cost, effect and any status are spelled out on the card face.

export const CARD_DEFS = {
  strike: {
    name: 'Strike Sigil', cost: 1, kind: 'attack', glyph: 'sword',
    text: 'Deal 6 damage.',
    effects: { damage: 6 },
  },
  guard: {
    name: 'Guard Sigil', cost: 1, kind: 'skill', glyph: 'shield',
    text: 'Gain 5 Block. Block absorbs damage until your next turn.',
    effects: { block: 5 },
  },
  spark: {
    name: 'Spark Sigil', cost: 0, kind: 'attack', glyph: 'spark',
    text: 'Deal 3 damage.',
    effects: { damage: 3 },
  },
  mend: {
    name: 'Mend Sigil', cost: 2, kind: 'skill', glyph: 'leaf',
    text: 'Restore 4 HP.',
    effects: { heal: 4 },
  },
  heavy: {
    name: 'Heavy Sigil', cost: 2, kind: 'attack', glyph: 'hammer',
    text: 'Deal 12 damage.',
    effects: { damage: 12 },
  },
  siphon: {
    name: 'Siphon Sigil', cost: 1, kind: 'attack', glyph: 'drop',
    text: 'Deal 4 damage and restore 3 HP.',
    effects: { damage: 4, heal: 3 },
  },
  bulwark: {
    name: 'Bulwark Sigil', cost: 2, kind: 'skill', glyph: 'wall',
    text: 'Gain 11 Block.',
    effects: { block: 11 },
  },
  hexmark: {
    name: 'Hex Mark', cost: 1, kind: 'hex', glyph: 'eye',
    text: 'The foe becomes Vulnerable for 2 turns: it takes +50% damage.',
    effects: { vulnerable: 2 },
  },
  dulling: {
    name: 'Dulling Rune', cost: 1, kind: 'hex', glyph: 'moon',
    text: 'The foe becomes Weak for 2 turns: its attacks deal 25% less.',
    effects: { weak: 2 },
  },
  surge: {
    name: 'Surge Sigil', cost: 0, kind: 'skill', glyph: 'bolt',
    text: 'Gain 1 Energy and draw 1 card.',
    effects: { energy: 1, draw: 1 },
  },
  twinfang: {
    name: 'Twin Fang', cost: 1, kind: 'attack', glyph: 'fangs',
    text: 'Deal 3 damage twice. Each hit must chew through Block separately.',
    effects: { damage: 3, hits: 2 },
  },
  emberbrand: {
    name: 'Ember Brand', cost: 2, kind: 'attack', glyph: 'flame',
    text: 'Deal 5 damage and make the foe Vulnerable for 1 turn.',
    effects: { damage: 5, vulnerable: 1 },
  },
  stoneskin: {
    name: 'Stone Skin', cost: 1, kind: 'skill', glyph: 'stone',
    text: 'Gain 7 Block and draw 1 card.',
    effects: { block: 7, draw: 1 },
  },
  lastlight: {
    name: 'Last Light', cost: 3, kind: 'attack', glyph: 'sun',
    text: 'Deal 15 damage.',
    effects: { damage: 15 },
  },
  // Tempered versions: the same sigil, honed after a victory. They only ever
  // enter a deck through the draft's "temper" choice, never the card draft.
  strike_plus: {
    name: 'Tempered Strike', cost: 1, kind: 'attack', glyph: 'sword',
    text: 'Deal 9 damage.',
    effects: { damage: 9 },
  },
  guard_plus: {
    name: 'Tempered Guard', cost: 1, kind: 'skill', glyph: 'shield',
    text: 'Gain 8 Block. Block absorbs damage until your next turn.',
    effects: { block: 8 },
  },
};

// One temper per draft: a starter sigil in the deck is honed into its
// tempered form. Strike is honed first; Guard if no Strike remains.
export const UPGRADE_MAP = { strike: 'strike_plus', guard: 'guard_plus' };

// The deck every run starts with: ten cards, no choices made yet.
export const STARTER_DECK = [
  'strike', 'strike', 'strike', 'strike',
  'guard', 'guard', 'guard',
  'spark', 'spark',
  'mend',
];

// Cards that can appear in the post-duel draft (three are offered, one is kept).
export const DRAFT_POOL = [
  'heavy', 'siphon', 'bulwark', 'hexmark', 'dulling',
  'surge', 'twinfang', 'emberbrand', 'stoneskin', 'lastlight',
];

export function cardDef(id) {
  const def = CARD_DEFS[id];
  if (!def) throw new Error(`unknown card id: ${id}`);
  return def;
}
