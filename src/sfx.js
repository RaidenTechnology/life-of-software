// Tiny WebAudio synth — zero asset files, zero AI. All sounds are ours.
// Usage: Sfx.blip(), Sfx.pickup(), Sfx.hit(), Sfx.win()

const Sfx = {
  ctx: null,

  // Browsers block audio until the first user gesture; call this on first pointerdown.
  unlock() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  tone(freq, dur, type = 'square', vol = 0.15, slideTo = null) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  },

  blip()   { this.tone(440, 0.08, 'square', 0.12); },
  pickup() { this.tone(660, 0.12, 'square', 0.12, 1320); },
  hit()    { this.tone(220, 0.2, 'sawtooth', 0.18, 55); },
  type()   { this.tone(880, 0.03, 'square', 0.05); },
  wrong()  { this.tone(160, 0.15, 'sawtooth', 0.15, 80); },
  tick()   { this.tone(990, 0.05, 'square', 0.08); },
  hint()   { this.tone(523, 0.08, 'sine', 0.12, 1046); },
  win()    {
    this.tone(523, 0.1);
    setTimeout(() => this.tone(659, 0.1), 100);
    setTimeout(() => this.tone(784, 0.2), 200);
  }
};
