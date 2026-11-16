// enemies.js — the gauntlet: nine foes of rising strength, each a name, a sigil
// glyph, hit points and a small table of intents. An intent is what the foe
// will do on its turn, shown to the player in advance so every player turn is
// a real decision: spend the turn killing, blocking, or setting up.
//
// Intent fields: hit (damage, before the Weak discount), hits (strikes),
// block (the foe gains Block), buff (the foe's later hits grow), thorns (the
// foe reflects damage for the rest of the duel), heal (the foe restores HP),
// weak (the player becomes Weak). `when` gates an intent on the foe's state.

export const ENEMIES = [
  {
    name: 'Hollow Imp', glyph: 'imp', hp: 24, tint: '#8fd0a0',
    intro: 'A small thing of smoke and spite. It telegraphs everything it does.',
    intents: [
      { label: 'Strike', hit: 5 },
      { label: 'Strike', hit: 5 },
      { label: 'Heavy blow', hit: 8 },
      { label: 'Ward self', block: 6 },
    ],
  },
  {
    name: 'Ash Hound', glyph: 'hound', hp: 32, tint: '#e0a35e',
    intro: 'It bites twice when it bites at all, and its growl makes the bites worse.',
    intents: [
      { label: 'Bite', hit: 7 },
      { label: 'Double bite', hit: 4, hits: 2 },
      { label: 'Growl', buff: 2 },
      { label: 'Bite', hit: 7 },
    ],
  },
  {
    name: 'Gloom Scribe', glyph: 'scribe', hp: 38, tint: '#9aa7e8',
    intro: 'It writes your name in a book of endings, and dulls your sigils as it writes.',
    intents: [
      { label: 'Ink lash', hit: 8 },
      { label: 'Dulling script', weak: 2 },
      { label: 'Ward self', block: 8 },
      { label: 'Ink lash', hit: 8 },
    ],
  },
  {
    name: 'Thorn Revenant', glyph: 'thorn', hp: 46, tint: '#7fc97f',
    intro: 'Every wound you open in its bark answers back. Hit it in big bites, not small ones.',
    intents: [
      { label: 'Branch slam', hit: 9 },
      { label: 'Grow thorns', thorns: 2 },
      { label: 'Ward self', block: 10 },
      { label: 'Branch slam', hit: 9 },
    ],
  },
  {
    name: 'The Pale Herald', glyph: 'herald', hp: 55, tint: '#e8e4da',
    intro: 'Below half strength its trumpet sounds, and every blow lands harder.',
    intents: [
      { label: 'Pale lance', hit: 11 },
      { label: 'Chill touch', hit: 6, weak: 1 },
      { label: 'Ward self', block: 12 },
      { label: 'Enrage', buff: 3, when: (foe) => foe.buff < 3 && foe.hp <= foe.maxHp / 2 },
    ],
  },
  {
    name: 'Sigil Eater', glyph: 'eater', hp: 70, tint: '#e87a7a',
    intro: 'It has eaten a hundred duelists\u2019 sigils. It means to eat yours, and to heal on what it swallows.',
    intents: [
      { label: 'Devouring bite', hit: 13 },
      { label: 'Twin maw', hit: 8, hits: 2 },
      { label: 'Feast', heal: 6 },
      { label: 'Ward self', block: 14 },
    ],
  },
  // V2 foes: they never appear as the boss, only as shuffled mid-gauntlet
  // rungs, so no two runs climb the same ladder.
  {
    name: 'Cinder Wisp', glyph: 'wisp', hp: 30, tint: '#e88a4a',
    intro: 'It burns bright and burns out — its flare hurts most when you let it build.',
    intents: [
      { label: 'Ember spit', hit: 6 },
      { label: 'Flare', hit: 10, when: (foe) => foe.hp <= foe.maxHp / 2 },
      { label: 'Kindle', buff: 2 },
      { label: 'Ember spit', hit: 6 },
    ],
  },
  {
    name: 'Mirror Warden', glyph: 'warden', hp: 44, tint: '#a8b8d8',
    intro: 'It answers every blow with a harder shell. Break the mirror in one big hit.',
    intents: [
      { label: 'Mirror edge', hit: 8 },
      { label: 'Harden', block: 12 },
      { label: 'Reflective ward', block: 8, thorns: 1 },
      { label: 'Mirror edge', hit: 8 },
    ],
  },
  {
    name: 'Grave Bell', glyph: 'bell', hp: 40, tint: '#c9b8e8',
    intro: 'Each toll dulls your sigils and steadies its own. Silence it before the third ring.',
    intents: [
      { label: 'Toll', hit: 5, weak: 1 },
      { label: 'Heavy toll', hit: 10, when: (foe) => foe.hp <= foe.maxHp / 2 },
      { label: 'Mend the crack', heal: 8 },
      { label: 'Iron ward', block: 8 },
    ],
  },
];

export const BOSS_NAME = 'Sigil Eater';
export const OPENER_NAME = 'Hollow Imp';
export const GAUNTLET_RUNGS = 6;

// One run's gauntlet: the Hollow Imp always opens (the easy first lesson),
// the Sigil Eater always closes, and the four middle rungs are four of the
// six remaining foes, shuffled — so no two runs climb the same ladder, but
// the difficulty curve never inverts. With no rng the classic order is kept,
// so staged screenshots stay stable.
export function buildGauntlet(rng) {
  const boss = ENEMIES.find((foe) => foe.name === BOSS_NAME);
  const opener = ENEMIES.find((foe) => foe.name === OPENER_NAME);
  const rest = ENEMIES.filter((foe) => foe.name !== BOSS_NAME && foe.name !== OPENER_NAME);
  if (!rng) return [opener, ...rest.slice(0, GAUNTLET_RUNGS - 2), boss];
  const pile = [...rest];
  for (let i = pile.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pile[i], pile[j]] = [pile[j], pile[i]];
  }
  return [opener, ...pile.slice(0, GAUNTLET_RUNGS - 2), boss];
}

export function enemyAt(index) {
  const foe = ENEMIES[index];
  if (!foe) throw new Error(`no enemy at rung ${index}`);
  return foe;
}

export function gauntletLength() {
  return GAUNTLET_RUNGS;
}
