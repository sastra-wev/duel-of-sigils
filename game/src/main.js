// main.js — boots Duel of Sigils and runs its screen flow:
// title -> battle -> (draft -> battle ...) -> end. It owns the run state and
// the current battle, translates clicks into battle.js calls, plays the
// matching sound for what happened, and hands every finished state to
// render.js. With ?shot=<screen> it stages that screen for screenshots.

import { createBattle, playCard, endTurn } from './battle.js';
import { createRun, draftChoices, applyDraft, recordWin, recordLoss, runCleared, finalScore } from './run.js';
import { enemyAt } from './enemies.js';
import { renderTitle, renderBattle, renderDraft, renderEnd } from './render.js';
import { sfx, setMuted, isMuted } from './audio.js';
import { mulberry32, stagedBattle, stagedDraft, stagedEnd } from './shots.js';

const app = document.getElementById('app');
const params = new URLSearchParams(location.search);
const seed = params.has('seed') ? Number(params.get('seed')) : (Date.now() % 2147483647);
const rng = mulberry32(seed);

let run = createRun();
let battle = null;

function showBattle() {
  renderBattle(app, battle, {
    rung: run.rung,
    muted: isMuted(),
    onToggleMute: () => { setMuted(!isMuted()); sfx.click(); showBattle(); },
    onPlayCard: (index) => {
      const before = battle.lastEvents;
      if (!playCard(battle, index)) { sfx.click(); return; }
      const ev = battle.lastEvents;
      if (ev.some((e) => e.type === 'played' && e.kind === 'attack')) sfx.playAttack();
      if (ev.some((e) => e.type === 'played' && e.kind === 'skill')) sfx.playSkill();
      if (ev.some((e) => e.type === 'played' && e.kind === 'hex')) sfx.playHex();
      if (ev.some((e) => e.type === 'foeHit')) sfx.hit();
      if (ev.some((e) => e.type === 'foeBlocked')) sfx.blocked();
      if (ev.some((e) => e.type === 'heal')) sfx.heal();
      if (ev.some((e) => e.type === 'thorns')) sfx.hurt();
      void before;
      if (battle.phase === 'won') return winDuel();
      if (battle.phase === 'lost') return loseRun();
      showBattle();
    },
    onEndTurn: () => {
      endTurn(battle);
      const ev = battle.lastEvents;
      if (ev.some((e) => e.type === 'playerHit')) sfx.hurt();
      if (ev.some((e) => e.type === 'playerBlocked')) sfx.blocked();
      if (battle.phase === 'lost') return loseRun();
      sfx.draw();
      showBattle();
    },
  });
  app.dataset.ready = '1';
}

function startDuel() {
  battle = createBattle({
    deckIds: run.deck, foeDef: enemyAt(run.rung), rng, playerHp: run.hp,
  });
  sfx.draw();
  showBattle();
}

function winDuel() {
  const foeName = battle.foe.def.name;
  recordWin(run, battle.player.hp);
  if (runCleared(run)) {
    sfx.win();
    return showEnd(true);
  }
  sfx.foeDown();
  const choices = draftChoices(rng);
  renderDraft(app, {
    choices, foeName,
    onPick: (id) => {
      applyDraft(run, id);
      sfx.draft();
      startDuel();
    },
  });
  app.dataset.ready = '1';
}

function loseRun() {
  recordLoss(run, battle.player.hp);
  sfx.lose();
  showEnd(false);
}

function showEnd(cleared) {
  renderEnd(app, {
    cleared, run, score: finalScore(run),
    onRestart: () => { run = createRun(); sfx.click(); startDuel(); },
  });
  app.dataset.ready = '1';
}

function showTitle() {
  renderTitle(app, {
    onStart: () => { run = createRun(); sfx.draft(); startDuel(); },
  });
  app.dataset.ready = '1';
}

// Screenshot staging: ?shot=title|battle|draft|end renders that screen from a
// real, fixed state. Anything else starts the game normally.
const shot = params.get('shot');
if (shot === 'battle') {
  const staged = stagedBattle();
  run = staged.run;
  battle = staged.battle;
  showBattle();
} else if (shot === 'draft') {
  const staged = stagedDraft();
  run = staged.run;
  renderDraft(app, {
    choices: staged.choices, foeName: staged.foeName,
    onPick: () => {},
  });
  app.dataset.ready = '1';
} else if (shot === 'end') {
  const staged = stagedEnd();
  run = staged.run;
  renderEnd(app, { cleared: true, run, score: finalScore(run), onRestart: () => {} });
  app.dataset.ready = '1';
} else {
  showTitle();
}
