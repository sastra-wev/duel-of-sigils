// run.js — one run of the gauntlet: the deck you carry, the HP you keep
// between duels, the rung you have reached, and the draft that follows each
// victory. The draft is a three-way choice now: take a new sigil, temper a
// sigil you already own, or mend wounds — the run is a series of those
// choices, so two runs with the same wins can arrive at the boss with
// different decks, different tempered cards and different HP.

import { STARTER_DECK, DRAFT_POOL, UPGRADE_MAP } from './cards.js';
import { PLAYER_MAX_HP } from './battle.js';
import { gauntletLength, buildGauntlet } from './enemies.js';

export const HEAL_AFTER_WIN = 6;
export const HEAL_DRAFT = 10;

export function createRun(rng) {
  return {
    deck: [...STARTER_DECK],
    hp: PLAYER_MAX_HP,
    rung: 0,
    duelsWon: 0,
    draftsTaken: 0,
    gauntlet: buildGauntlet(rng),
    // The run chronicle: every duel's toll, told on the end screen.
    stats: { damageDealt: 0, cardsPlayed: 0, turns: 0, blocked: 0 },
    foesBeaten: [],
  };
}

// Fold one finished duel's counters into the run chronicle. Called on both
// a win and a loss, so a fallen run still tells the whole story.
export function recordBattleStats(run, battle) {
  if (!battle || !battle.stats) return;
  run.stats.damageDealt += battle.stats.damageDealt;
  run.stats.cardsPlayed += battle.stats.cardsPlayed;
  run.stats.turns += battle.stats.turns;
  run.stats.blocked += battle.stats.blocked;
  if (battle.phase === 'won') run.foesBeaten.push(battle.foe.def.name);
}

// Three distinct cards from the draft pool, drawn with the run's rng.
export function draftChoices(rng) {
  const pool = [...DRAFT_POOL];
  const picks = [];
  while (picks.length < 3 && pool.length > 0) {
    const i = Math.floor(rng() * pool.length);
    picks.push(pool.splice(i, 1)[0]);
  }
  return picks;
}

export function applyDraft(run, cardId) {
  run.deck.push(cardId);
  run.draftsTaken += 1;
}

// The temper choice: hone the first upgradeable sigil in the deck into its
// tempered form. Returns the { from, to } pair, or null when nothing in the
// deck can be honed (a deck of only tempered and draft cards).
export function upgradeOption(run) {
  for (const from of Object.keys(UPGRADE_MAP)) {
    if (run.deck.includes(from)) return { from, to: UPGRADE_MAP[from] };
  }
  return null;
}

export function applyUpgrade(run, fromId) {
  const toId = UPGRADE_MAP[fromId];
  const at = run.deck.indexOf(fromId);
  if (!toId || at < 0) return false;
  run.deck[at] = toId;
  run.draftsTaken += 1;
  return true;
}

// The mend choice: restore HP after a victory, capped at the maximum.
export function applyHeal(run) {
  run.hp = Math.min(PLAYER_MAX_HP, run.hp + HEAL_DRAFT);
  run.draftsTaken += 1;
}

// Book-keeping when a duel is won: the rung advances, a little HP returns.
export function recordWin(run, hpLeft) {
  run.duelsWon += 1;
  run.rung += 1;
  run.hp = Math.min(PLAYER_MAX_HP, hpLeft + HEAL_AFTER_WIN);
}

export function recordLoss(run, hpLeft) {
  run.hp = Math.max(0, hpLeft);
}

export function runCleared(run) {
  return run.rung >= gauntletLength();
}

// The score shown on the end screen: duels dominate, surviving HP breaks ties.
export function finalScore(run) {
  return run.duelsWon * 100 + run.hp * 2 + run.draftsTaken * 10;
}
