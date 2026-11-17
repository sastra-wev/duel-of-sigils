// enemies.js — the gauntlet: ten foes in three bands of rising strength,
// each a name, a sigil glyph, hit points, an arena palette and a small table
// of intents. An intent is what the foe will do on its turn, shown to the
// player in advance so every player turn is a real decision: spend the turn
// killing, blocking, or setting up.
//
// Intent fields: hit (damage, before the Weak discount), hits (strikes),
// block (the foe gains Block), buff (the foe's later hits grow), thorns (the
// foe reflects damage for the rest of the duel), heal (the foe restores HP),
// weak (the player becomes Weak). `when` gates an intent on the foe's state.
//
// The bands keep the difficulty curve honest: the opener is a lesson, two
// early foes teach the statuses, two late foes punish a thin deck, the last
// late foe fights as an Elite, and the Sigil Sovereign — the tenth foe —
// closes every run with a two-phase duel: at half strength its crown
// breaks, its hexes wash off, and a harder table of intents takes over.

export const ENEMIES = [
  {
    name: 'Hollow Imp', glyph: 'imp', hp: 24, tint: '#8fd0a0', band: 'opener',
    arena: ['#22392c', '#101b16'],
    intro: 'A small thing of smoke and spite. It telegraphs everything it does.',
    intents: [
      { label: 'Strike', hit: 5 },
      { label: 'Strike', hit: 5 },
      { label: 'Heavy blow', hit: 8 },
      { label: 'Ward self', block: 6 },
    ],
  },
  {
    name: 'Ash Hound', glyph: 'hound', hp: 32, tint: '#e0a35e', band: 'early',
    arena: ['#3d2a16', '#1c130a'],
    intro: 'It bites twice when it bites at all, and its growl makes the bites worse.',
    intents: [
      { label: 'Bite', hit: 7 },
      { label: 'Double bite', hit: 4, hits: 2 },
      { label: 'Growl', buff: 2 },
      { label: 'Bite', hit: 7 },
    ],
  },
  {
    name: 'Cinder Wisp', glyph: 'wisp', hp: 30, tint: '#e88a4a', band: 'early',
    arena: ['#40200f', '#1e0f06'],
    intro: 'It burns bright and burns out — its flare hurts most when you let it build.',
    intents: [
      { label: 'Ember spit', hit: 6 },
      { label: 'Flare', hit: 10, when: (foe) => foe.hp <= foe.maxHp / 2 },
      { label: 'Kindle', buff: 2 },
      { label: 'Ember spit', hit: 6 },
    ],
  },
  {
    name: 'Gloom Scribe', glyph: 'scribe', hp: 38, tint: '#9aa7e8', band: 'early',
    arena: ['#1e2440', '#0d0f1e'],
    intro: 'It writes your name in a book of endings, and dulls your sigils as it writes.',
    intents: [
      { label: 'Ink lash', hit: 8 },
      { label: 'Dulling script', weak: 2 },
      { label: 'Ward self', block: 8 },
      { label: 'Ink lash', hit: 8 },
    ],
  },
  {
    name: 'Grave Bell', glyph: 'bell', hp: 40, tint: '#c9b8e8', band: 'early',
    arena: ['#2c2140', '#130e20'],
    intro: 'Each toll dulls your sigils and steadies its own. Silence it before the third ring.',
    intents: [
      { label: 'Toll', hit: 5, weak: 1 },
      { label: 'Heavy toll', hit: 10, when: (foe) => foe.hp <= foe.maxHp / 2 },
      { label: 'Mend the crack', heal: 7 },
      { label: 'Iron ward', block: 8 },
    ],
  },
  {
    name: 'Mirror Warden', glyph: 'warden', hp: 44, tint: '#a8b8d8', band: 'late',
    arena: ['#1d2a3d', '#0b1220'],
    intro: 'It answers every blow with a harder shell. Break the mirror in one big hit.',
    intents: [
      { label: 'Mirror edge', hit: 8 },
      { label: 'Harden', block: 9 },
      { label: 'Reflective ward', block: 8, thorns: 1 },
      { label: 'Mirror edge', hit: 8 },
    ],
  },
  {
    name: 'Thorn Revenant', glyph: 'thorn', hp: 46, tint: '#7fc97f', band: 'late',
    arena: ['#1e3319', '#0c170a'],
    intro: 'Every wound you open in its bark answers back. Hit it in big bites, not small ones.',
    intents: [
      { label: 'Branch slam', hit: 9 },
      { label: 'Grow thorns', thorns: 2 },
      { label: 'Ward self', block: 9 },
      { label: 'Branch slam', hit: 9 },
    ],
  },
  {
    name: 'The Pale Herald', glyph: 'herald', hp: 55, tint: '#e8e4da', band: 'late',
    arena: ['#33322c', '#171713'],
    intro: 'Below half strength its trumpet sounds, and every blow lands harder.',
    intents: [
      { label: 'Pale lance', hit: 11 },
      { label: 'Chill touch', hit: 6, weak: 1 },
      { label: 'Ward self', block: 11 },
      { label: 'Enrage', buff: 3, when: (foe) => foe.buff < 3 && foe.hp <= foe.maxHp / 2 },
    ],
  },
  {
    name: 'Sigil Eater', glyph: 'eater', hp: 50, tint: '#e87a7a', band: 'late',
    arena: ['#3d1a1e', '#1c0b0d'],
    intro: 'It has eaten a hundred duelists\u2019 sigils. It means to eat yours, and to heal on what it swallows.',
    intents: [
      { label: 'Devouring bite', hit: 11 },
      { label: 'Twin maw', hit: 7, hits: 2 },
      { label: 'Feast', heal: 5 },
      { label: 'Ward self', block: 10 },
    ],
  },
  {
    name: 'The Sigil Sovereign', glyph: 'sovereign', hp: 56, tint: '#f0d48a', band: 'boss',
    arena: ['#3a2c10', '#191104'],
    intro: 'The first duelist, crowned in stolen sigils. Break the crown at half strength — and face what is underneath.',
    intents: [
      { label: 'Royal lance', hit: 11 },
      { label: 'Edict of frailty', hit: 6, weak: 1 },
      { label: 'Crown ward', block: 10 },
      { label: 'Seize sigils', buff: 2, when: (foe) => foe.buff < 2 },
    ],
    // Phase two: the crown breaks. Hexes wash off, the Sovereign grows
    // stronger, and this harder table replaces the first — telegraphed like
    // everything else, so the second half is a new duel, not a trap.
    phase2: {
      atFraction: 0.5,
      buff: 1,
      banner: 'THE CROWN BREAKS',
      intro: 'The crown shatters. What stands up wears no sigils at all — and hits like it.',
      intents: [
        { label: 'Sovereign\u2019s verdict', hit: 13 },
        { label: 'Twin edict', hit: 7, hits: 2 },
        { label: 'Feast of names', heal: 6 },
        { label: 'Broken ward', block: 9, thorns: 1 },
      ],
    },
  },
];

export const BOSS_NAME = 'The Sigil Sovereign';
export const OPENER_NAME = 'Hollow Imp';
export const GAUNTLET_RUNGS = 6;
export const ELITE_HP_MULT = 1.2;

function foeByName(name) {
  const foe = ENEMIES.find((entry) => entry.name === name);
  if (!foe) throw new Error(`no foe named ${name}`);
  return foe;
}

// An Elite is the same foe, crowned: a quarter more HP, a point of damage
// already in its claws, and an intro that says so. The foe def itself is
// never mutated — the gauntlet carries a crowned copy.
export function makeElite(def) {
  return {
    ...def,
    elite: true,
    hp: Math.round(def.hp * ELITE_HP_MULT),
    startBuff: 1,
    intro: `${def.intro} This one wears a duelist\u2019s crown: more health, and its blows already bite +1 harder.`,
  };
}

function shuffledBand(band, count, rng) {
  const pile = ENEMIES.filter((foe) => foe.band === band);
  for (let i = pile.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pile[i], pile[j]] = [pile[j], pile[i]];
  }
  return pile.slice(0, count);
}

// One run's gauntlet: the Hollow Imp always opens (the easy first lesson),
// two early foes and two late foes are shuffled in from their bands — so no
// two runs climb the same ladder, but the difficulty curve never inverts —
// the last late foe fights as an Elite, and the Sigil Sovereign always
// closes. With no rng the classic order is kept, so staged screenshots
// stay stable.
export function buildGauntlet(rng) {
  const opener = foeByName(OPENER_NAME);
  const boss = foeByName(BOSS_NAME);
  if (!rng) {
    const early = ENEMIES.filter((foe) => foe.band === 'early').slice(0, 2);
    const late = ENEMIES.filter((foe) => foe.band === 'late').slice(0, 2);
    late[1] = makeElite(late[1]);
    return [opener, ...early, ...late, boss];
  }
  const early = shuffledBand('early', 2, rng);
  const late = shuffledBand('late', 2, rng);
  late[1] = makeElite(late[1]);
  return [opener, ...early, ...late, boss];
}

export function enemyAt(index) {
  const foe = ENEMIES[index];
  if (!foe) throw new Error(`no enemy at rung ${index}`);
  return foe;
}

export function enemyByName(name) {
  return foeByName(name);
}

export function gauntletLength() {
  return GAUNTLET_RUNGS;
}
