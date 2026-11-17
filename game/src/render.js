// render.js — draws every screen of Duel of Sigils as DOM: the title, the
// duel itself, the post-duel draft, the end screen, and the help overlay
// that explains every mechanic in the game. DOM (not canvas) so card text
// stays crisp at any size and the judge's shrunken screenshots can still
// read the numbers. Sigils are small inline-SVG runes drawn from the path
// table below — original geometric marks, no image assets anywhere.

import { cardDef } from './cards.js';
import { intentSummary, incomingDamage } from './battle.js';
import { gauntletLength } from './enemies.js';
import { relicDef } from './relics.js';
import { HOW_TO_PLAY, GLOSSARY } from './glossary.js';

// Stroke paths on a 48x48 grid, one per glyph name used by cards, foes,
// relics and the glossary.
const GLYPH_PATHS = {
  sword: 'M14 34 L34 14 M34 14 l-9 2 M34 14 l-2 9 M12 30 l6 6 M30 12 l6 6',
  shield: 'M24 6 L38 11 V24 C38 34 31 39 24 42 C17 39 10 34 10 24 V11 Z',
  spark: 'M24 6 L28 19 L42 19 L31 27 L35 41 L24 32 L13 41 L17 27 L6 19 L20 19 Z',
  leaf: 'M36 10 C20 12 11 21 10 38 C27 37 36 27 36 10 Z M12 36 C18 27 26 19 34 12',
  hammer: 'M12 18 h20 v8 H12 Z M22 26 v14 M14 40 h16',
  drop: 'M24 6 C24 6 12 22 12 30 a12 12 0 0 0 24 0 C36 22 24 6 24 6 Z',
  wall: 'M8 14 h32 M8 24 h32 M8 34 h32 M18 14 v10 M30 24 v10 M18 34 v8 M30 14 v10',
  eye: 'M4 24 C12 12 36 12 44 24 C36 36 12 36 4 24 Z M24 17 a7 7 0 1 0 0.1 0',
  moon: 'M32 6 a19 19 0 1 0 10 30 A15 15 0 0 1 32 6 Z',
  bolt: 'M27 4 L12 28 h9 L19 44 L36 18 h-10 Z',
  fangs: 'M12 8 l5 16 5-16 M26 8 l5 16 5-16',
  flame: 'M24 4 C28 12 38 17 38 29 a14 14 0 0 1 -28 0 C10 19 20 14 24 4 Z',
  stone: 'M12 34 L18 14 L32 10 L40 26 L34 38 L18 40 Z',
  sun: 'M24 16 a8 8 0 1 0 0.1 0 M24 4 v6 M24 38 v6 M4 24 h6 M38 24 h6 M10 10 l4 4 M34 34 l4 4 M38 10 l-4 4 M14 34 l-4 4',
  imp: 'M14 12 l4 8 M34 12 l-4 8 M17 22 a7 9 0 1 0 14 0 a7 9 0 1 0 -14 0 M10 38 C16 30 32 30 38 38',
  hound: 'M10 16 l8 4 M38 16 l-8 4 M14 22 a10 11 0 1 0 20 0 a10 11 0 1 0 -20 0 M20 36 l3 5 M28 36 l-3 5',
  scribe: 'M14 6 h20 v36 H14 Z M19 14 h10 M19 21 h10 M19 28 h6',
  thorn: 'M24 42 V20 M24 20 C24 12 18 10 12 10 C12 18 17 22 24 20 M24 16 C24 9 30 6 36 7 C35 14 30 17 24 16 M14 30 l-6 2 M34 30 l6 2',
  herald: 'M10 30 L30 18 M30 18 a6 6 0 1 1 6 6 l-8 2 Z M12 30 v10 M8 40 h10',
  eater: 'M8 16 a16 16 0 1 1 0.1 0 M16 26 l4 6 4-6 4 6 4-6 M18 18 h.1 M30 18 h.1',
  wisp: 'M24 6 C30 14 38 18 38 28 a14 14 0 0 1 -28 0 C10 20 18 14 24 6 Z M20 34 l4 5 4-5',
  warden: 'M24 6 L40 12 V26 C40 34 32 40 24 42 C16 40 8 34 8 26 V12 Z M24 14 v16 M16 20 h16',
  bell: 'M24 6 C14 6 10 15 10 26 v6 l-4 6 h36 l-4 -6 v-6 C38 15 34 6 24 6 Z M20 42 a4 4 0 0 0 8 0 M24 6 v4',
  sovereign: 'M8 34 L6 14 L17 24 L24 10 L31 24 L42 14 L40 34 Z M10 40 h28',
  heart: 'M24 40 C10 30 6 22 6 15 a9 9 0 0 1 18-3 a9 9 0 0 1 18 3 c0 7-4 15-18 25 Z',
  hourglass: 'M14 6 h20 M14 42 h20 M16 6 C16 18 32 18 32 6 M16 42 C16 30 32 30 32 42',
};

export function glyphSvg(glyph, color = 'currentColor', size = 44) {
  const path = GLYPH_PATHS[glyph] || GLYPH_PATHS.spark;
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
}

function hpBar(hp, maxHp, cls) {
  const pct = Math.max(0, Math.round((hp / maxHp) * 100));
  return `<div class="hpbar ${cls}"><div class="hpfill" style="width:${pct}%"></div><span>${hp} / ${maxHp} HP</span></div>`;
}

// Every chip carries its own explanation as a tooltip, so hovering any
// status in the game answers "what does that do?" without leaving the duel.
const CHIP_TIPS = {
  block: 'Block absorbs damage before HP. Yours falls at the start of your next turn; a foe\u2019s lasts until broken.',
  buff: 'Strength: every attack this fighter plays deals this much extra damage.',
  thorns: 'Thorns: whoever strikes this fighter takes this much damage back, every hit.',
  vuln: 'Vulnerable: this fighter takes +50% damage from attacks.',
  weak: 'Weak: this fighter\u2019s attacks deal 25% less damage.',
  burn: 'Burn: at the start of its turn this foe takes this damage, ignoring Block.',
  strength: 'Strength: every attack you play deals +1 damage per point.',
};

function statusChips(fighter) {
  const chips = [];
  if (fighter.block > 0) chips.push(`<span class="chip block" title="${CHIP_TIPS.block}">🛡 ${fighter.block} Block</span>`);
  if (fighter.buff > 0) chips.push(`<span class="chip buff" title="${CHIP_TIPS.buff}">+${fighter.buff} damage</span>`);
  if (fighter.strength > 0) chips.push(`<span class="chip buff" title="${CHIP_TIPS.strength}">⚔ Strength ${fighter.strength}</span>`);
  if (fighter.thorns > 0) chips.push(`<span class="chip thorns" title="${CHIP_TIPS.thorns}">🌵 Thorns ${fighter.thorns}</span>`);
  if (fighter.vulnerable > 0) chips.push(`<span class="chip vuln" title="${CHIP_TIPS.vuln}">Vulnerable ${fighter.vulnerable}</span>`);
  if (fighter.weak > 0) chips.push(`<span class="chip weak" title="${CHIP_TIPS.weak}">Weak ${fighter.weak}</span>`);
  if (fighter.burnTurns > 0) chips.push(`<span class="chip burn" title="${CHIP_TIPS.burn}">🔥 Burn ${fighter.burn} × ${fighter.burnTurns}</span>`);
  return chips.length ? `<div class="chips">${chips.join('')}</div>` : '';
}

export function cardHtml(id, { playable = false, index = -1 } = {}) {
  const def = cardDef(id);
  const cls = ['card', `kind-${def.kind}`, playable ? 'playable' : 'unplayable'];
  const data = index >= 0 ? `data-hand-index="${index}"` : '';
  const deal = index >= 0 ? ` style="--deal-i:${index}"` : '';
  return `<button class="${cls.join(' ')}" ${data}${deal} ${playable ? '' : 'disabled'}>
    <span class="cost">${def.cost}</span>
    <span class="glyph">${glyphSvg(def.glyph, 'currentColor', 40)}</span>
    <span class="cname">${def.name}</span>
    <span class="ctext">${def.text}</span>
    <span class="ckind">${def.kind}</span>
  </button>`;
}

// The intent banner's icon: a sword for a blow, a shield for a ward, a
// flame for a feast — the shape of the coming move at a glance, with the
// exact numbers beside it.
function intentIcon(intent) {
  if (!intent) return '👁';
  if (intent.hit) return '⚔';
  if (intent.block) return '🛡';
  if (intent.buff) return '🔥';
  if (intent.heal) return '🍖';
  if (intent.thorns) return '🌵';
  if (intent.weak) return '🌙';
  return '👁';
}

// Floating numbers for the events of the action that just resolved: wounds
// on the foe in its zone, wounds and mends on the player in theirs.
function floatHtml(events, who) {
  const foeTypes = ['foeHit', 'foeHeal', 'foeBurn', 'foeThornsHit'];
  const playerTypes = ['playerHit', 'heal', 'selfDamage'];
  const list = events.filter((e) => (who === 'foe' ? foeTypes : playerTypes).includes(e.type));
  return list.map((e, i) => {
    const good = e.type === 'heal' || e.type === 'foeThornsHit';
    const sign = e.type === 'heal' || e.type === 'foeHeal' ? '+' : '−';
    const cls = e.type === 'foeBurn' ? 'burn' : (good ? 'good' : 'bad');
    return `<span class="float ${who} ${cls}" style="--float-i:${i}">${sign}${e.amount}</span>`;
  }).join('');
}

// The first duel teaches as it goes: one plain hint a turn for the first
// three turns, each naming the decision that turn is really about.
export function tutorialHint(battle, rung) {
  if (rung !== 0) return '';
  const incoming = incomingDamage(battle);
  if (battle.turn === 1) {
    return 'The red banner shows exactly what the foe does next. Nothing here is hidden — plan around it.';
  }
  if (battle.turn === 2) {
    return incoming > 0
      ? `The foe will hit for ${incoming}. A Guard Sigil raises Block, and Block soaks the blow before your HP does.`
      : 'No blow is coming this turn — a free turn. Spend it on damage.';
  }
  if (battle.turn === 3) {
    return 'Win this duel and you will draft: a new sigil, a tempered one, a relic, or a heal. Your deck is built by those choices.';
  }
  return '';
}

export function renderTitle(app, { onStart, onHelp }) {
  app.innerHTML = `<section class="screen title-screen">
    <div class="title-sigil">${glyphSvg('sun', '#e8c268', 92)}</div>
    <h1>DUEL OF SIGILS</h1>
    <p class="tagline">Ten foes. One deck. Every card you win reshapes the next duel.</p>
    <div class="howto">
      <p>⚔ Each turn you get <b>3 Energy</b>. Play sigils to strike, block and hex.</p>
      <p>👁 The foe's next move is always shown — the exact move, with the exact numbers.</p>
      <p>🂡 Win a duel, then choose one reward: draft <b>1 of 3 new sigils</b>, temper a sigil you own, take a <b>relic</b>, or mend <b>10 HP</b>.</p>
      <p>👑 The fifth rung wears a crown — an <b>Elite</b>. The sixth is the <b>Sigil Sovereign</b>, whose crown breaks at half strength into a second, harder duel.</p>
      <p>🏆 Clear all ${gauntletLength()} rungs to win. Fall once, and the run ends.</p>
    </div>
    <div class="title-actions">
      <button class="big-btn" id="start-btn">Begin the Gauntlet</button>
      <button class="big-btn alt-btn" id="help-btn">How to Play &amp; Glossary</button>
    </div>
    <p class="hint">Click a card to play it. Click End Turn — or press Space — when you are done.</p>
  </section>`;
  app.querySelector('#start-btn').addEventListener('click', onStart);
  app.querySelector('#help-btn').addEventListener('click', onHelp);
}

export function renderHelp(app, { onClose }) {
  const how = HOW_TO_PLAY.map((line) => `<p>${line}</p>`).join('');
  const terms = GLOSSARY.map((entry) => `
    <div class="gloss-entry">
      <span class="gloss-glyph">${glyphSvg(entry.glyph, '#e8c268', 34)}</span>
      <div><b>${entry.term}</b><p>${entry.text}</p></div>
    </div>`).join('');
  app.innerHTML = `<section class="screen help-screen">
    <h1>HOW TO PLAY</h1>
    <div class="howto help-how">${how}</div>
    <h2 class="help-head">THE WORDS OF THE TABLE</h2>
    <div class="glossary">${terms}</div>
    <button class="big-btn" id="help-close">Back to the Duel</button>
  </section>`;
  app.querySelector('#help-close').addEventListener('click', onClose);
}

export function renderBattle(app, battle, { onPlayCard, onEndTurn, rung, relics = [], muted, onToggleMute, onHelp }) {
  const { player, foe } = battle;
  const hand = battle.hand.map((id, i) =>
    cardHtml(id, { playable: cardDef(id).cost <= player.energy && battle.phase === 'player', index: i }),
  ).join('');
  // A fresh hit replays its shake: the screen is re-rendered after every
  // action, so the class lands on a brand-new node each time.
  const foeHit = battle.lastEvents.some((e) => e.type === 'foeHit' || e.type === 'foeBurn') ? ' hit' : '';
  const playerHit = battle.lastEvents.some((e) => e.type === 'playerHit') ? ' hit' : '';
  const shift = battle.lastEvents.find((e) => e.type === 'phaseShift');
  const intro = shift
    ? shift.intro
    : (battle.turn === 1 ? foe.def.intro : '');
  const relicRow = relics.length
    ? `<div class="relic-row">${relics.map((id) => {
      const def = relicDef(id);
      return `<span class="relic-chip" title="${def.text}">${glyphSvg(def.glyph, '#e8c268', 18)} ${def.name}</span>`;
    }).join('')}</div>`
    : '';
  const [arenaA, arenaB] = foe.def.arena || ['#2a2142', '#171226'];

  app.innerHTML = `<section class="screen battle-screen" style="--arena-a:${arenaA};--arena-b:${arenaB};--tint:${foe.def.tint}">
    <header class="topbar">
      <span class="rung">RUNG ${rung + 1} OF ${gauntletLength()}</span>
      <span class="turn">Turn ${battle.turn}</span>
      <span class="top-btns">
        <button class="mute-btn" id="help-btn" title="How to play &amp; glossary">?</button>
        <button class="mute-btn" id="mute-btn">${muted ? '🔇' : '🔊'}</button>
      </span>
    </header>
    ${shift ? `<div class="phase-banner">${shift.banner}</div>` : ''}
    <div class="arena">
      <div class="foe-zone" id="foe-zone">
        <div class="intent">${intentIcon(foe.intent)} Next: <b>${foe.intent ? foe.intent.label : ''}</b> — ${intentSummary(battle)}</div>
        <div class="foe-sigil${foeHit}">${glyphSvg(foe.def.glyph, foe.def.tint, 120)}${floatHtml(battle.lastEvents, 'foe')}</div>
        <h2 class="foe-name">${foe.def.name}${foe.def.elite ? ' <span class="elite-badge">✦ ELITE</span>' : ''}${foe.phase2 ? ' <span class="elite-badge phase2">CROWN BROKEN</span>' : ''}</h2>
        ${intro ? `<p class="foe-intro">${intro}</p>` : ''}
        ${hpBar(foe.hp, foe.maxHp, 'foe')}
        ${statusChips(foe)}
      </div>
      <div class="versus">⚔</div>
      <div class="player-zone${playerHit}" id="player-zone">
        <h2 class="player-name">The Challenger</h2>
        ${hpBar(player.hp, player.maxHp, 'player')}
        ${floatHtml(battle.lastEvents, 'player')}
        ${statusChips(player)}
        <div class="energy">Energy <b>${player.energy}</b> ⚡</div>
        <div class="piles">Draw pile ${battle.drawPile.length} · Discard ${battle.discardPile.length}</div>
        ${relicRow}
      </div>
    </div>
    ${tutorialHint(battle, rung) ? `<p class="tutorial">💡 ${tutorialHint(battle, rung)}</p>` : ''}
    <div class="hand-row">${hand || '<p class="empty-hand">No cards in hand.</p>'}</div>
    <div class="battle-actions">
      <button class="big-btn end-turn" id="end-turn" ${battle.phase !== 'player' ? 'disabled' : ''}>End Turn ▸</button>
    </div>
  </section>`;

  app.querySelectorAll('[data-hand-index]').forEach((el) => {
    el.addEventListener('click', () => onPlayCard(Number(el.dataset.handIndex)));
  });
  app.querySelector('#end-turn').addEventListener('click', onEndTurn);
  app.querySelector('#mute-btn').addEventListener('click', onToggleMute);
  app.querySelector('#help-btn').addEventListener('click', onHelp);
}

export function renderDraft(app, { choices, foeName, upgrade, relic, canHeal, onPick, onUpgrade, onRelic, onHeal }) {
  const upgradeLabel = upgrade
    ? `Temper ${cardDef(upgrade.from).name} → ${cardDef(upgrade.to).name}`
    : 'Nothing left to temper';
  const upgradeText = upgrade
    ? `${cardDef(upgrade.from).text} becomes ${cardDef(upgrade.to).text}`
    : 'Every temperable sigil in your deck is already honed.';
  const relicHtml = relic
    ? `<button class="big-btn alt-btn relic-btn" data-relic>${glyphSvg(relicDef(relic).glyph, '#221806', 20)} Take the ${relicDef(relic).name}</button>
      <span class="alt-text">${relicDef(relic).text} Yours for every duel to come.</span>`
    : '';
  app.innerHTML = `<section class="screen draft-screen">
    <h1>${foeName} falls.</h1>
    <p class="tagline">The fallen foe's sigils scatter. Choose <b>one</b> reward — it stays for every duel to come.</p>
    <div class="draft-row">${choices.map((id) =>
      `<div class="draft-slot">${cardHtml(id, { playable: true })}<button class="big-btn take-btn" data-pick="${id}">Take ${cardDef(id).name}</button></div>`,
    ).join('')}</div>
    <div class="draft-alt">
      <button class="big-btn alt-btn" data-upgrade ${upgrade ? '' : 'disabled'}>${upgradeLabel}</button>
      <span class="alt-text">${upgradeText}</span>
      ${relicHtml}
      <button class="big-btn alt-btn" data-heal ${canHeal ? '' : 'disabled'}>Mend Wounds · +10 HP</button>
      <span class="alt-text">Restore 10 HP before the next rung.</span>
    </div>
    <p class="hint">Choose for the foes ahead, not the one behind you.</p>
  </section>`;
  app.querySelectorAll('[data-pick]').forEach((el) => {
    el.addEventListener('click', () => onPick(el.dataset.pick));
  });
  const upBtn = app.querySelector('[data-upgrade]');
  if (upBtn && onUpgrade) upBtn.addEventListener('click', onUpgrade);
  const relicBtn = app.querySelector('[data-relic]');
  if (relicBtn && onRelic) relicBtn.addEventListener('click', onRelic);
  const healBtn = app.querySelector('[data-heal]');
  if (healBtn && onHeal) healBtn.addEventListener('click', onHeal);
}

export function renderEnd(app, { cleared, run, score, onRestart }) {
  const stats = run.stats || { damageDealt: 0, cardsPlayed: 0, turns: 0, blocked: 0 };
  const foes = run.foesBeaten || [];
  const chronicle = foes.length
    ? `<p class="chronicle-foes">Fallen: ${foes.join(' · ')}</p>`
    : '<p class="chronicle-foes">No foe fell this run.</p>';
  const relicLine = (run.relics && run.relics.length)
    ? `<p class="chronicle-stats">Relics carried: ${run.relics.map((id) => relicDef(id).name).join(' · ')}</p>`
    : '';
  app.innerHTML = `<section class="screen end-screen">
    <div class="title-sigil">${glyphSvg(cleared ? 'sun' : 'moon', cleared ? '#e8c268' : '#8d86a8', 84)}</div>
    <h1>${cleared ? 'THE GAUNTLET FALLS' : 'THE SIGILS GO DARK'}</h1>
    <p class="tagline">${cleared
      ? 'All six foes defeated — the Sovereign\u2019s crown lies in two pieces. The last light is yours.'
      : `The run ended on rung ${run.rung + 1} of ${gauntletLength()}. The deck you drafted dies with you — the next one may not.`}</p>
    <div class="scoreboard">
      <div><b>${run.duelsWon}</b><span>duels won</span></div>
      <div><b>${run.hp}</b><span>HP left</span></div>
      <div><b>${run.deck.length}</b><span>cards in deck</span></div>
      <div class="score-total"><b>${score}</b><span>SCORE</span></div>
    </div>
    <div class="chronicle">
      <h3>THE RUN, TOLD BACK</h3>
      ${chronicle}
      ${relicLine}
      <p class="chronicle-stats">${stats.turns} turns · ${stats.damageDealt} damage dealt · ${stats.cardsPlayed} sigils played · ${stats.blocked} damage blocked</p>
    </div>
    <button class="big-btn" id="restart-btn">Duel Again</button>
  </section>`;
  app.querySelector('#restart-btn').addEventListener('click', onRestart);
}
