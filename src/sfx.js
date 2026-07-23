// Tiny WebAudio synth — zero asset files, zero AI. All sounds are ours.
// Sfx.blip() etc for effects; Sfx.startMusic(bpm) runs a procedural
// chiptune loop (Am-F-C-G, bass + arpeggio) whose tempo rises per stage.

const Sfx = {
  ctx: null,
  muted: localStorage.getItem('los_muted') === '1',
  master: (() => {
    const v = parseFloat(localStorage.getItem('los_vol'));
    return isNaN(v) ? 1 : Math.min(1, Math.max(0, v));
  })(),
  music: null,

  setMuted(m) {
    this.muted = m;
    try { localStorage.setItem('los_muted', m ? '1' : '0'); } catch (e) {}
  },

  setVolume(v) {
    this.master = Math.min(1, Math.max(0, v));
    try { localStorage.setItem('los_vol', String(this.master)); } catch (e) {}
  },

  // Browsers block audio until the first user gesture; call this on first pointerdown.
  unlock() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  noteAt(freq, t, dur, type = 'square', vol = 0.1) {
    if (this.muted || this.master <= 0) return;
    if (!this.ctx || this.ctx.state !== 'running') return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol * this.master, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  },

  tone(freq, dur, type = 'square', vol = 0.15, slideTo = null) {
    if (this.muted || this.master <= 0) return;
    if (!this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    gain.gain.setValueAtTime(vol * this.master, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  },

  // --- procedural chiptune loop ---

  freq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  },

  playStep(step, t, spb) {
    const chords = [45, 41, 48, 43];               // A2 F2 C3 G2
    const root = chords[Math.floor(step / 8) % 4];
    if (step % 2 === 0) this.noteAt(this.freq(root), t, spb * 0.9, 'square', 0.040);
    const arp = [12, 15, 19, 24];
    this.noteAt(this.freq(root + arp[step % 4]), t, spb * 0.55, 'triangle', 0.050);
    if (step % 8 === 4) this.noteAt(this.freq(root + 27), t, spb * 0.4, 'square', 0.022);
  },

  startMusic(bpm = 96) {
    if (this.music) { this.music.bpm = bpm; return; }
    this.unlock();
    if (!this.ctx) return;
    const m = { bpm, step: 0, next: this.ctx.currentTime + 0.1, timer: null };
    m.timer = setInterval(() => {
      if (!this.ctx || this.ctx.state !== 'running') return;
      if (m.next < this.ctx.currentTime) m.next = this.ctx.currentTime + 0.05;
      const spb = 60 / (m.bpm * 2);                // 8th notes
      while (m.next < this.ctx.currentTime + 0.15) {
        this.playStep(m.step, m.next, spb);
        m.next += spb;
        m.step = (m.step + 1) % 32;
      }
    }, 50);
    this.music = m;
  },

  setMusicTempo(bpm) {
    if (this.music) this.music.bpm = bpm;
  },

  stopMusic() {
    if (this.music) {
      clearInterval(this.music.timer);
      this.music = null;
    }
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
