// effects.js — the sparks that fly when a blow lands. render.js rebuilds the
// whole screen after every action, which is perfect for numbers and state
// but wrong for motion: this module layers short-lived particle spans over
// the arena after each render, aimed by the battle events that just
// happened, and lets CSS carry them away. Nothing here touches game state;
// it only reads the event list main.js hands it and the two zone elements.

const PARTICLE_COUNT = 7;

// One burst of sparks inside a zone element, in the foe's own tint or in
// ember red for a wound the player took. Each spark gets a deterministic
// direction from its index (no Math.random: a staged screenshot must look
// the same every load), a short flight, and a self-cleaning timeout.
export function burst(zone, color, seed = 0) {
  if (!zone) return;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const spark = document.createElement('span');
    spark.className = 'particle';
    const angle = ((i * 47 + seed * 31) % 360) * (Math.PI / 180);
    const dist = 44 + ((i * 29 + seed * 13) % 42);
    spark.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    spark.style.setProperty('--dy', `${Math.sin(angle) * dist - 18}px`);
    spark.style.setProperty('--pc', color);
    spark.style.animationDelay = `${(i % 3) * 0.03}s`;
    zone.appendChild(spark);
    setTimeout(() => spark.remove(), 900);
  }
}

// Read the events of the action that just resolved and burst where they
// landed: foe hits spark in the foe's tint, player hits in ember, a Burn
// tick smoulders, and the crown breaking showers the whole foe zone gold.
export function playBattleEvents(battle, foeZone, playerZone) {
  const events = battle.lastEvents || [];
  const tint = battle.foe.def.tint || '#e8c268';
  let seed = battle.turn;
  for (const e of events) {
    if (e.type === 'foeHit') burst(foeZone, tint, seed++);
    if (e.type === 'foeBurn') burst(foeZone, '#e88a4a', seed++);
    if (e.type === 'phaseShift') {
      burst(foeZone, '#f0d48a', seed++);
      burst(foeZone, '#f0d48a', seed + 5);
    }
    if (e.type === 'playerHit') burst(playerZone, '#ff7a66', seed++);
  }
}
