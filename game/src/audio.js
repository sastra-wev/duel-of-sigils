// audio.js — every sound in Duel of Sigils is synthesised with WebAudio at the
// moment it is needed: no audio files, nothing to load, nothing fetched. One
// shared AudioContext, created lazily on the first user gesture (browsers
// refuse sound before one). The mute toggle lives here so every caller can
// stay ignorant of it. Each foe family gets its own voice — a hit on bark is
// not a hit on glass — and the boss gets two: a crown of bright metal, and
// the lower thing underneath it.

let ctx = null;
let muted = false;

function ensureContext() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

// One oscillator blip with a quick decay envelope.
function tone(freq, dur, type = 'sine', gain = 0.12, when = 0, slideTo = null) {
  const ac = ensureContext();
  if (!ac || muted) return;
  const t0 = ac.currentTime + when;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  amp.gain.setValueAtTime(gain, t0);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(amp).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

// A short filtered noise burst, for hits and shuffles.
function noise(dur, gain = 0.1, when = 0, freq = 900) {
  const ac = ensureContext();
  if (!ac || muted) return;
  const t0 = ac.currentTime + when;
  const len = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buffer = ac.createBuffer(1, len, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = freq;
  const amp = ac.createGain();
  amp.gain.setValueAtTime(gain, t0);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filter).connect(amp).connect(ac.destination);
  src.start(t0);
}

export const sfx = {
  click() { tone(660, 0.06, 'triangle', 0.06); },
  draw() { noise(0.08, 0.05, 0, 2400); },
  playAttack() { noise(0.14, 0.14, 0, 700); tone(180, 0.16, 'sawtooth', 0.07, 0, 70); },
  playSkill() { tone(520, 0.14, 'sine', 0.1, 0, 780); },
  playHex() { tone(320, 0.22, 'sine', 0.1, 0, 160); },
  hit() { noise(0.1, 0.16, 0, 500); },
  blocked() { tone(240, 0.1, 'square', 0.06); noise(0.06, 0.06, 0, 1800); },
  hurt() { tone(140, 0.2, 'sawtooth', 0.1, 0, 60); },
  heal() { tone(440, 0.12, 'sine', 0.08); tone(660, 0.16, 'sine', 0.08, 0.08); },
  thornsHit() { tone(880, 0.07, 'square', 0.05); tone(1174, 0.09, 'square', 0.04, 0.05); },
  burn() { noise(0.22, 0.09, 0, 3000); tone(196, 0.24, 'sawtooth', 0.05, 0, 98); },
  strength() { tone(262, 0.12, 'triangle', 0.09); tone(392, 0.16, 'triangle', 0.09, 0.09); },
  relic() { [659, 784, 988, 1319].forEach((f, i) => tone(f, 0.18, 'sine', 0.08, i * 0.07)); },
  elite() { tone(110, 0.3, 'sawtooth', 0.1, 0, 55); tone(220, 0.2, 'square', 0.05, 0.05); },
  // The crown breaks: bright metal snapping, then the low thing underneath.
  phaseShift() {
    tone(1568, 0.1, 'square', 0.07);
    tone(1175, 0.14, 'square', 0.06, 0.08);
    noise(0.3, 0.12, 0.1, 900);
    tone(73, 0.7, 'sawtooth', 0.13, 0.18, 49);
    tone(110, 0.5, 'triangle', 0.1, 0.24, 73);
  },
  foeDown() { tone(392, 0.14, 'triangle', 0.12); tone(523, 0.14, 'triangle', 0.12, 0.12); tone(659, 0.22, 'triangle', 0.12, 0.24); },
  draft() { tone(523, 0.1, 'sine', 0.09); tone(784, 0.18, 'sine', 0.09, 0.09); },
  win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.24, 'triangle', 0.11, i * 0.13)); },
  lose() { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.28, 'triangle', 0.1, i * 0.16)); },
};
