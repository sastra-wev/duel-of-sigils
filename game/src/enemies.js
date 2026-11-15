// enemies.js — the gauntlet: six foes of rising strength, each a name, a sigil
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
];

export function enemyAt(index) {
  const foe = ENEMIES[index];
  if (!foe) throw new Error(`no enemy at rung ${index}`);
  return foe;
}

export function gauntletLength() {
  return ENEMIES.length;
}
