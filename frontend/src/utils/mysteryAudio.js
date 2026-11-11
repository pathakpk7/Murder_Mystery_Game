// Web Audio API Sound Synthesizer for Project Vritara Interactive Landing
// Zero external assets needed, pure deterministic synthesized sound effects

let audioCtx = null;
let isMuted = false;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleMute() {
  isMuted = !isMuted;
  return isMuted;
}

export function getIsMuted() {
  return isMuted;
}

// Cord pull mechanical chain rattle
export function playCordPullSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Chain links click
  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200 + i * 300 + Math.random() * 200, now + i * 0.04);
    gain.gain.setValueAtTime(0.08, now + i * 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.04);
    osc.stop(now + i * 0.04 + 0.07);
  }
}

// Light switch heavy metallic snap + electrical lamp filament hum
export function playLightSwitchSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Mechanical switch snap (sharp click)
  const oscClick = ctx.createOscillator();
  const gainClick = ctx.createGain();
  oscClick.type = 'square';
  oscClick.frequency.setValueAtTime(320, now);
  oscClick.frequency.exponentialRampToValueAtTime(60, now + 0.08);
  gainClick.gain.setValueAtTime(0.3, now);
  gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
  oscClick.connect(gainClick);
  gainClick.connect(ctx.destination);
  oscClick.start(now);
  oscClick.stop(now + 0.1);

  // Filament surge hum
  const oscHum = ctx.createOscillator();
  const gainHum = ctx.createGain();
  oscHum.type = 'sawtooth';
  oscHum.frequency.setValueAtTime(110, now + 0.02);
  gainHum.gain.setValueAtTime(0.001, now + 0.02);
  gainHum.gain.linearRampToValueAtTime(0.12, now + 0.06);
  gainHum.gain.exponentialRampToValueAtTime(0.005, now + 0.9);
  gainHum.gain.linearRampToValueAtTime(0.0001, now + 1.2);
  oscHum.connect(gainHum);
  gainHum.connect(ctx.destination);
  oscHum.start(now + 0.02);
  oscHum.stop(now + 1.2);
}

// Magnifying Glass pick up / search resonance
export function playMagnifierPickupSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);

  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.35);
}

// Secret clue inspected / focused
export function playClueFoundSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc2.type = 'triangle';
  osc1.frequency.setValueAtTime(587.33, now); // D5
  osc2.frequency.setValueAtTime(880, now + 0.08); // A5

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now + 0.08);
  osc1.stop(now + 0.5);
  osc2.stop(now + 0.5);
}

// Heavy Industrial Red Button Press
export function playRedButtonPressSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Heavy mechanical clunk
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);
  gain.gain.setValueAtTime(0.45, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.25);

  // Electrical relay engage
  const oscRelay = ctx.createOscillator();
  const gainRelay = ctx.createGain();
  oscRelay.type = 'square';
  oscRelay.frequency.setValueAtTime(600, now + 0.05);
  oscRelay.frequency.setValueAtTime(300, now + 0.12);
  gainRelay.gain.setValueAtTime(0.12, now + 0.05);
  gainRelay.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  oscRelay.connect(gainRelay);
  gainRelay.connect(ctx.destination);
  oscRelay.start(now + 0.05);
  oscRelay.stop(now + 0.35);
}

// Dramatic Door Unlock / Room Breach
export function playRoomEnterBreachSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Deep cinema sub-bass rumble
  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(90, now);
  subOsc.frequency.exponentialRampToValueAtTime(35, now + 1.2);
  subGain.gain.setValueAtTime(0.5, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
  subOsc.connect(subGain);
  subGain.connect(ctx.destination);
  subOsc.start(now);
  subOsc.stop(now + 1.7);

  // High metallic resonant whoosh
  const metalOsc = ctx.createOscillator();
  const metalGain = ctx.createGain();
  metalOsc.type = 'sawtooth';
  metalOsc.frequency.setValueAtTime(320, now + 0.2);
  metalOsc.frequency.exponentialRampToValueAtTime(780, now + 0.9);
  metalGain.gain.setValueAtTime(0.001, now + 0.2);
  metalGain.gain.linearRampToValueAtTime(0.15, now + 0.5);
  metalGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
  metalOsc.connect(metalGain);
  metalGain.connect(ctx.destination);
  metalOsc.start(now + 0.2);
  metalOsc.stop(now + 1.4);
}
