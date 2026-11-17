// shots.js — staged states for the entry screenshots (?shot=title|battle|draft|end).
// Each stage builds a REAL state of the real game (a genuine battle object, a
// genuine draft) and lets the normal renderers draw it, so a screenshot is the
// game itself at a chosen moment, never a mock-up. A fixed seed keeps the
// staged battle identical on every load.

import { createBattle } from './battle.js';
import { createRun } from './run.js';
import { enemyAt, enemyByName, makeElite } from './enemies.js';

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The fifth rung: an Elite Mirror Warden, crowned and hardened, the player
// mid-run with a drafted deck, a relic on the wrist and a real choice of
// cards in hand — the whole game in one frame.
export function stagedBattle() {
  const rng = mulberry32(20261116);
  const run = createRun();
  run.rung = 4;
  run.duelsWon = 4;
  run.hp = 27;
  run.deck = [...run.deck, 'heavy', 'hexmark', 'bramble'];
  run.relics = ['thorncrown'];
  const battle = createBattle({
    deckIds: run.deck, foeDef: makeElite(enemyByName('Mirror Warden')),
    rng, playerHp: 27, relics: run.relics,
  });
  battle.turn = 3;
  battle.foe.hp = 31;
  battle.foe.block = 8;
  battle.foe.intent = enemyByName('Mirror Warden').intents[0]; // Mirror edge, 8
  battle.player.energy = 2;
  battle.player.block = 5;
  battle.player.thorns = 1;
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
    run, choices: ['bulwark', 'executioner', 'soulburn'], foeName: enemyAt(1).name,
    upgrade: { from: 'strike', to: 'strike_plus' }, relic: 'whetstone', canHeal: true,
  };
}

export function stagedEnd() {
  const run = createRun();
  run.rung = 6;
  run.duelsWon = 6;
  run.draftsTaken = 5;
  run.hp = 18;
  run.deck = [...run.deck, 'heavy', 'hexmark', 'bulwark', 'executioner', 'lastlight'];
  run.relics = ['whetstone', 'emberheart'];
  run.stats = { damageDealt: 268, cardsPlayed: 52, turns: 33, blocked: 71 };
  run.foesBeaten = ['Hollow Imp', 'Ash Hound', 'Gloom Scribe', 'Thorn Revenant', 'Elite Mirror Warden', 'The Sigil Sovereign'];
  return { run, cleared: true };
}
