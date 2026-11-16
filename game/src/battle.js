// battle.js — the duel engine: one player, one foe, and the rules that connect
// them. Pure state and transitions; render.js draws whatever this holds and
// main.js feeds it clicks. Every number the player can see is derived here:
// damage after Vulnerable, the Weak discount, Block absorbing hits in order,
// thorns answering attacks. Randomness comes from the seeded rng handed in at
// creation, so a staged screenshot battle is the same battle every time.

import { cardDef } from './cards.js';

export const PLAYER_MAX_HP = 40;
export const BASE_ENERGY = 3;
export const OPENING_HAND = 4;
export const DRAW_PER_TURN = 2;
export const HAND_LIMIT = 8;

function shuffle(ids, rng) {
  const pile = [...ids];
  for (let i = pile.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pile[i], pile[j]] = [pile[j], pile[i]];
  }
  return pile;
}

export function createBattle({ deckIds, foeDef, rng, playerHp }) {
  const battle = {
    rng,
    turn: 0,
    phase: 'player', // 'player' | 'won' | 'lost'
    player: {
      hp: playerHp, maxHp: PLAYER_MAX_HP,
      block: 0, energy: 0, weak: 0,
    },
    foe: {
      def: foeDef, hp: foeDef.hp, maxHp: foeDef.hp,
      block: 0, buff: 0, thorns: 0, vulnerable: 0, weak: 0,
      intent: null,
    },
    drawPile: shuffle(deckIds, rng),
    hand: [],
    discardPile: [],
    log: [],
    lastEvents: [],
  };
  rollIntent(battle);
  startPlayerTurn(battle, true);
  return battle;
}

function drawCards(battle, count) {
  for (let n = 0; n < count; n++) {
    if (battle.drawPile.length === 0) {
      battle.drawPile = shuffle(battle.discardPile, battle.rng);
      battle.discardPile = [];
    }
    if (battle.drawPile.length === 0 || battle.hand.length >= HAND_LIMIT) return;
    battle.hand.push(battle.drawPile.pop());
  }
}

function rollIntent(battle) {
  const table = battle.foe.def.intents.filter(
    (intent) => !intent.when || intent.when(battle.foe),
  );
  const pick = table[Math.floor(battle.rng() * table.length)];
  battle.foe.intent = pick;
}

// What the foe's current intent will actually do, after its buff and the
// player's Weak — the exact numbers the intent banner must show.
export function intentSummary(battle) {
  const { intent, buff } = { intent: battle.foe.intent, buff: battle.foe.buff };
  if (!intent) return '';
  if (intent.hit) {
    const per = intent.hit + buff;
    return intent.hits && intent.hits > 1
      ? `attacks for ${per} × ${intent.hits}`
      : `attacks for ${per}`;
  }
  if (intent.block) {
    const thorns = intent.thorns ? ` and grows thorns (reflects ${intent.thorns})` : '';
    return `gains ${intent.block} Block${thorns}`;
  }
  if (intent.buff) return `grows stronger (+${intent.buff} damage)`;
  if (intent.thorns) return `grows thorns (reflects ${intent.thorns})`;
  if (intent.heal) return `feeds and heals ${intent.heal}`;
  if (intent.weak) return `weakens you for ${intent.weak} turns`;
  return '';
}

function startPlayerTurn(battle, opening = false) {
  battle.turn += 1;
  battle.player.block = 0;
  battle.player.energy = BASE_ENERGY;
  drawCards(battle, opening ? OPENING_HAND : DRAW_PER_TURN);
  battle.lastEvents.push({ type: 'turn', turn: battle.turn });
}

export function canPlay(battle, handIndex) {
  if (battle.phase !== 'player') return false;
  const id = battle.hand[handIndex];
  if (!id) return false;
  return cardDef(id).cost <= battle.player.energy;
}

function dealDamageToFoe(battle, base, events) {
  let amount = base;
  if (battle.foe.vulnerable > 0) amount = Math.floor(amount * 1.5);
  if (battle.player.weak > 0) amount = Math.floor(amount * 0.75);
  let remaining = amount;
  if (battle.foe.block > 0) {
    const absorbed = Math.min(battle.foe.block, remaining);
    battle.foe.block -= absorbed;
    remaining -= absorbed;
    if (absorbed > 0) events.push({ type: 'foeBlocked', amount: absorbed });
  }
  if (remaining > 0) {
    battle.foe.hp = Math.max(0, battle.foe.hp - remaining);
    events.push({ type: 'foeHit', amount: remaining });
  }
  if (battle.foe.thorns > 0 && amount > 0) {
    battle.player.hp = Math.max(0, battle.player.hp - battle.foe.thorns);
    events.push({ type: 'thorns', amount: battle.foe.thorns });
  }
}

export function playCard(battle, handIndex) {
  if (!canPlay(battle, handIndex)) return false;
  const id = battle.hand[handIndex];
  const def = cardDef(id);
  const events = [{ type: 'played', id, kind: def.kind }];
  battle.player.energy -= def.cost;
  battle.hand.splice(handIndex, 1);
  battle.discardPile.push(id);

  const fx = def.effects;
  if (fx.damage) {
    const hits = fx.hits || 1;
    for (let h = 0; h < hits; h++) dealDamageToFoe(battle, fx.damage, events);
  }
  if (fx.block) {
    battle.player.block += fx.block;
    events.push({ type: 'block', amount: fx.block });
  }
  if (fx.heal) {
    const healed = Math.min(battle.player.maxHp - battle.player.hp, fx.heal);
    battle.player.hp += healed;
    if (healed > 0) events.push({ type: 'heal', amount: healed });
  }
  if (fx.vulnerable) {
    battle.foe.vulnerable = Math.max(battle.foe.vulnerable, fx.vulnerable);
    events.push({ type: 'vulnerable', turns: fx.vulnerable });
  }
  if (fx.weak) {
    battle.foe.weak = Math.max(battle.foe.weak, fx.weak);
    events.push({ type: 'weakFoe', turns: fx.weak });
  }
  if (fx.energy) battle.player.energy += fx.energy;
  if (fx.draw) drawCards(battle, fx.draw);

  battle.lastEvents = events;
  if (battle.foe.hp <= 0) battle.phase = 'won';
  else if (battle.player.hp <= 0) battle.phase = 'lost';
  return true;
}

function foeAct(battle, events) {
  const foe = battle.foe;
  const intent = foe.intent;
  if (!intent) return;
  if (intent.hit) {
    const hits = intent.hits || 1;
    for (let h = 0; h < hits; h++) {
      let amount = intent.hit + foe.buff;
      if (foe.weak > 0) amount = Math.floor(amount * 0.75);
      let remaining = amount;
      if (battle.player.block > 0) {
        const absorbed = Math.min(battle.player.block, remaining);
        battle.player.block -= absorbed;
        remaining -= absorbed;
        if (absorbed > 0) events.push({ type: 'playerBlocked', amount: absorbed });
      }
      if (remaining > 0) {
        battle.player.hp = Math.max(0, battle.player.hp - remaining);
        events.push({ type: 'playerHit', amount: remaining });
      }
      if (battle.player.hp <= 0) return;
    }
  }
  if (intent.block) {
    foe.block += intent.block;
    events.push({ type: 'foeBlock', amount: intent.block });
  }
  if (intent.buff) {
    foe.buff += intent.buff;
    events.push({ type: 'foeBuff', amount: intent.buff });
  }
  if (intent.thorns) {
    foe.thorns += intent.thorns;
    events.push({ type: 'foeThorns', amount: intent.thorns });
  }
  if (intent.heal) {
    const healed = Math.min(foe.maxHp - foe.hp, intent.heal);
    foe.hp += healed;
    if (healed > 0) events.push({ type: 'foeHeal', amount: healed });
  }
  if (intent.weak) {
    battle.player.weak = Math.max(battle.player.weak, intent.weak);
    events.push({ type: 'weakPlayer', turns: intent.weak });
  }
}

function tickStatuses(battle) {
  if (battle.foe.vulnerable > 0) battle.foe.vulnerable -= 1;
  if (battle.foe.weak > 0) battle.foe.weak -= 1;
  if (battle.player.weak > 0) battle.player.weak -= 1;
}

export function endTurn(battle) {
  if (battle.phase !== 'player') return;
  const events = [{ type: 'foeAct', label: battle.foe.intent?.label || '' }];
  foeAct(battle, events);
  if (battle.player.hp <= 0) {
    battle.phase = 'lost';
    battle.lastEvents = events;
    return;
  }
  tickStatuses(battle);
  rollIntent(battle);
  battle.lastEvents = events;
  startPlayerTurn(battle);
}
