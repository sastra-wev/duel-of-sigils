// shots.js — staged states for the entry screenshots (?shot=title|battle|draft|end).
// Each stage builds a REAL state of the real game (a genuine battle object, a
// genuine draft) and lets the normal renderers draw it, so a screenshot is the
// game itself at a chosen moment, never a mock-up. A fixed seed keeps the
// staged battle identical on every load.

import { createBattle } from './battle.js';
import { createRun } from './run.js';
import { enemyAt } from './enemies.js';

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A duel against the Gloom Scribe, a few turns in: the foe is bloodied and
// about to lash out, the player holds a real choice of cards and 2 energy.
export function stagedBattle() {
  const rng = mulberry32(20261116);
  const run = createRun();
  run.rung = 2;
  run.duelsWon = 2;
  run.hp = 27;
  run.deck = [...run.deck, 'heavy', 'hexmark'];
  const battle = createBattle({
    deckIds: run.deck, foeDef: enemyAt(2), rng, playerHp: 27,
  });
  battle.turn = 3;
  battle.foe.hp = 19;
  battle.foe.intent = enemyAt(2).intents[0]; // Ink lash, 8
  battle.player.energy = 2;
  battle.player.block = 5;
  battle.hand = ['heavy', 'guard', 'hexmark', 'spark'];
  battle.lastEvents = [{ type: 'foeHit', amount: 9 }];
  return { run, battle };
}

export function stagedDraft() {
  const run = createRun();
  run.rung = 2;
  run.duelsWon = 2;
  run.hp = 31;
  return {
    run, choices: ['bulwark', 'siphon', 'twinfang'], foeName: enemyAt(1).name,
    upgrade: { from: 'strike', to: 'strike_plus' }, canHeal: true,
  };
}

export function stagedEnd() {
  const run = createRun();
  run.rung = 6;
  run.duelsWon = 6;
  run.draftsTaken = 5;
  run.hp = 18;
  run.deck = [...run.deck, 'heavy', 'hexmark', 'bulwark', 'siphon', 'lastlight'];
  run.stats = { damageDealt: 214, cardsPlayed: 47, turns: 29, blocked: 63 };
  run.foesBeaten = ['Hollow Imp', 'Ash Hound', 'Gloom Scribe', 'Thorn Revenant', 'The Pale Herald', 'Sigil Eater'];
  return { run, cleared: true };
}
