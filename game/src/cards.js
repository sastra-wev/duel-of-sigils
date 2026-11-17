// cards.js — every card in Duel of Sigils: the starter deck, the draft pool
// and the tempered forms a sigil can be honed into. A card is data only;
// battle.js interprets the effect fields. `kind` drives the card's colour
// band and its sound. Text is written for a player who has never seen the
// game: cost, effect and any status are spelled out on the card face.
//
// Effect fields battle.js understands: damage (per hit), hits, block, heal,
// energy, draw, vulnerable / weak (turns on the foe), burn (damage the foe
// takes at the start of its own turn, for that many turns), strength (your
// attacks deal +1 each for the rest of the duel, per point), thorns (foes
// that strike you take that much damage back), selfDamage (HP you pay),
// bonusVsVulnerable (extra damage on this card's hits while the foe is
// Vulnerable). The synergies are deliberate: hexes feed Executioner, Block
// feeds Bramble Ward and the Aegis, Strength feeds every cheap hit twice
// over on Twin Fang, and Burn ticks while you hide behind Block.

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
  // --- V3 cards: each one leans on a system another card builds. ---
  bramble: {
    name: 'Bramble Ward', cost: 1, kind: 'skill', glyph: 'thorn',
    text: 'Gain 4 Block and Thorns 2 for the duel: foes that strike you take 2 damage back.',
    effects: { block: 4, thorns: 2 },
  },
  rally: {
    name: 'Rallying Sigil', cost: 1, kind: 'skill', glyph: 'herald',
    text: 'Gain Strength 1: every attack you play deals +1 damage, for the rest of the duel.',
    effects: { strength: 1 },
  },
  bloodprice: {
    name: 'Blood Price', cost: 1, kind: 'attack', glyph: 'drop',
    text: 'Deal 10 damage, and pay 2 HP. Power, at a price.',
    effects: { damage: 10, selfDamage: 2 },
  },
  executioner: {
    name: 'Executioner Sigil', cost: 2, kind: 'attack', glyph: 'sword',
    text: 'Deal 7 damage — and 7 more while the foe is Vulnerable.',
    effects: { damage: 7, bonusVsVulnerable: 7 },
  },
  kindle: {
    name: 'Kindle Sigil', cost: 1, kind: 'skill', glyph: 'flame',
    text: 'Draw 2 cards.',
    effects: { draw: 2 },
  },
  soulburn: {
    name: 'Soul Burn', cost: 2, kind: 'hex', glyph: 'wisp',
    text: 'Brand the foe with Burn: 4 damage at the start of its next 3 turns, ignoring Block.',
    effects: { burn: 4, burnTurns: 3 },
  },
  secondwind: {
    name: 'Second Wind', cost: 2, kind: 'skill', glyph: 'leaf',
    text: 'Restore 6 HP and draw 1 card.',
    effects: { heal: 6, draw: 1 },
  },
  aegis: {
    name: 'Aegis Sigil', cost: 2, kind: 'skill', glyph: 'warden',
    text: 'Gain 9 Block and Thorns 1 for the duel: foes that strike you take 1 damage back.',
    effects: { block: 9, thorns: 1 },
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
  heavy_plus: {
    name: 'Tempered Heavy', cost: 2, kind: 'attack', glyph: 'hammer',
    text: 'Deal 16 damage.',
    effects: { damage: 16 },
  },
  siphon_plus: {
    name: 'Tempered Siphon', cost: 1, kind: 'attack', glyph: 'drop',
    text: 'Deal 6 damage and restore 4 HP.',
    effects: { damage: 6, heal: 4 },
  },
  bulwark_plus: {
    name: 'Tempered Bulwark', cost: 2, kind: 'skill', glyph: 'wall',
    text: 'Gain 15 Block.',
    effects: { block: 15 },
  },
  hexmark_plus: {
    name: 'Tempered Hex Mark', cost: 1, kind: 'hex', glyph: 'eye',
    text: 'The foe becomes Vulnerable for 3 turns: it takes +50% damage.',
    effects: { vulnerable: 3 },
  },
  twinfang_plus: {
    name: 'Tempered Twin Fang', cost: 1, kind: 'attack', glyph: 'fangs',
    text: 'Deal 4 damage twice. Each hit must chew through Block separately.',
    effects: { damage: 4, hits: 2 },
  },
};

// One temper per draft: a sigil in the deck is honed into its tempered form.
// run.js offers the first honable sigil in the deck, so what you drafted
// early is what you can hone — the choice stays in the player's hands.
export const UPGRADE_MAP = {
  strike: 'strike_plus',
  guard: 'guard_plus',
  heavy: 'heavy_plus',
  siphon: 'siphon_plus',
  bulwark: 'bulwark_plus',
  hexmark: 'hexmark_plus',
  twinfang: 'twinfang_plus',
};

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
  'bramble', 'rally', 'bloodprice', 'executioner', 'kindle',
  'soulburn', 'secondwind', 'aegis',
];

export function cardDef(id) {
  const def = CARD_DEFS[id];
  if (!def) throw new Error(`unknown card id: ${id}`);
  return def;
}
