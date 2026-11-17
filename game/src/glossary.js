// glossary.js — the words behind the help overlay: how a run works and what
// every status means, written for a first-time player standing at the table
// for the first time. render.js draws this data; the title screen and the
// battle topbar both open it, so no mechanic in the game is ever a mystery
// the UI refuses to explain.

export const HOW_TO_PLAY = [
  'Each turn you get 3 Energy and draw 2 cards. Click a card to play it; its Energy cost is the gold coin on its corner.',
  'The banner above the foe shows its next move — the exact move, with the exact numbers. Plan around it: block the blow you can see, or kill before it lands.',
  'When you are done, click End Turn (or press Space). The foe plays the move it telegraphed, statuses tick down, and a new move is telegraphed.',
  'Win a duel and choose ONE reward: draft 1 of 3 new sigils, temper a sigil you own into a stronger form, take the relic on offer, or mend 10 HP.',
  'Your HP and your deck carry from duel to duel. Clear all six rungs — the last is the Sigil Sovereign, a two-phase boss — to win the run. Fall once and the run ends.',
];

export const GLOSSARY = [
  {
    term: 'Block', glyph: 'shield',
    text: 'Absorbs damage before your HP does. Your Block falls at the start of your next turn; a foe\u2019s Block lasts until you break through it.',
  },
  {
    term: 'Vulnerable', glyph: 'eye',
    text: 'The marked fighter takes +50% damage from attacks. Lasts the number of turns shown, ticking down at the end of each round.',
  },
  {
    term: 'Weak', glyph: 'moon',
    text: 'The marked fighter\u2019s attacks deal 25% less damage. On a foe it blunts the blow you can see coming; on you, it blunts yours.',
  },
  {
    term: 'Thorns', glyph: 'thorn',
    text: 'A fighter with Thorns answers back: whoever strikes them takes that much damage, every hit, for the rest of the duel.',
  },
  {
    term: 'Burn', glyph: 'wisp',
    text: 'At the start of its turn the branded foe takes the Burn damage, ignoring Block. Lasts the number of turns on the brand.',
  },
  {
    term: 'Strength', glyph: 'herald',
    text: 'Every attack the strengthened fighter plays deals +1 damage per point. Yours comes from the Rallying Sigil; a foe\u2019s is shown as +N damage.',
  },
  {
    term: 'Elite', glyph: 'sovereign',
    text: 'A crowned foe on the fifth rung: a quarter more HP, and its blows bite +1 harder from the first turn. The banner and its crown say so.',
  },
  {
    term: 'The Crown Breaks', glyph: 'sovereign',
    text: 'At half strength the Sigil Sovereign enters phase two: your hexes on it wash off, it gains Strength, and a harder set of moves is telegraphed. A new duel inside the duel.',
  },
  {
    term: 'Relic', glyph: 'heart',
    text: 'A passive rule won in the draft. It is never drawn or discarded, works in every later duel, and each relic can be taken only once per run.',
  },
  {
    term: 'Temper', glyph: 'hammer',
    text: 'A draft choice that hones one sigil already in your deck into its tempered form — more damage, more Block, longer hexes — for the rest of the run.',
  },
];
