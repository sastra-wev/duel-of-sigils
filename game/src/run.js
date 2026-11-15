// run.js — one run of the gauntlet: the deck you carry, the HP you keep
// between duels, the rung you have reached, and the draft that follows each
// victory. Winning a duel restores a little HP and offers three cards, of
// which exactly one joins the deck — the run is a series of those choices,
// so two runs with the same wins can arrive at the boss with different decks.

import { STARTER_DECK, DRAFT_POOL } from './cards.js';
import { PLAYER_MAX_HP } from './battle.js';
import { gauntletLength } from './enemies.js';

export const HEAL_AFTER_WIN = 6;

export function createRun() {
  return {
    deck: [...STARTER_DECK],
    hp: PLAYER_MAX_HP,
    rung: 0,
    duelsWon: 0,
    draftsTaken: 0,
  };
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
