// Tiny WebAudio synth — zero asset files, zero AI. All sounds are ours.
// Sfx.blip() etc for effects; Sfx.startMusic(bpm) runs a procedural chiptune
// loop (bass + arpeggio) whose tempo rises per stage and whose MUSICAL IDENTITY
// (key, progression, arp shape, waveforms) is swapped per language through
// setMusicProfile, per boss through setBossMode and ducked by setTension.
// Everything is scheduled on the AudioContext clock and mixed through one
// master bus, because the layers now stack (music + arp + typing + tick +
// heartbeat) and summing five raw oscillators straight into destination clips.

// Read a persisted setting without ever letting a throwing localStorage crash
// module load: a sandboxed itch.io iframe or a private window can throw on ANY
// access, and since this object is built at eval time, an unguarded read here
// would leave Sfx undefined and black-screen the whole game (every scene calls
// Sfx.*). Mirrors the try/catch reads used everywhere else (items.js, EndScene).
const readStore = (key) => {
  try { return localStorage.getItem(key); } catch (e) { return null; }
};

// The sound of the game before per-language profiles existed: Am-F-C-G with a
// square bass and a triangle arpeggio. Any language without profile data, and
// any profile field that is missing or garbage, falls back to exactly this — so
// "no data" always sounds like the shipped default rather than like a bug.
const DEFAULT_PROFILE = {
  root: 45,                     // A2 — MIDI note of chord 1
  steps: [0, -4, 3, -2],        // -> 45 41 48 43 = A2 F2 C3 G2
  arp: [12, 15, 19, 24],        // minor triad + octave over each chord
  bass: 'square',
  lead: 'triangle',
  bpm: 96
};

// Boss identity: same tonic, then a semitone neighbour and a tritone. Those two
// moves are the cheapest "something is wrong" signal in tonal music, and the
// sawtooth bass + b5 in the arp keep it from sounding like a happy key change.
const BOSS_PROFILE = {
  root: 45,
  steps: [0, 1, -6, -1],        // A2 Bb2 Eb2 Ab2
  arp: [12, 15, 18, 22],        // root, m3, b5, m7 — a diminished-ish climb
  bass: 'sawtooth',
  lead: 'square',
  bpm: 120
};

const OSC_TYPES = ['sine', 'square', 'sawtooth', 'triangle'];

const Sfx = {
  ctx: null,
  muted: readStore('los_muted') === '1',
  master: (() => {
    const v = parseFloat(readStore('los_vol'));
    return isNaN(v) ? 1 : Math.min(1, Math.max(0, v));
  })(),
  music: null,

  // Master bus nodes, built lazily in unlock() (see bus()).
  masterGain: null,
  musicGain: null,
  noiseBuf: null,

  // Musical state. profile is what playStep reads right now; preBossProfile
  // parks the language profile while a boss fight borrows the loop.
  profile: DEFAULT_PROFILE,
  preBossProfile: null,
  boss: false,
  tension: 0,

  // ONE registry for every interval this file owns. A raw setInterval already
  // bit this repo once: Phaser's scene pause only halts scene timers, so the
  // music kept playing under the ESC menu. Anything timer-driven added later
  // (percussion, heartbeat) must live here so pauseMusic can kill all of it.
  timers: { music: null, heart: null },

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
    this.bus();
  },

  // masterGain -> compressor -> destination, plus a musicGain tap in front of
  // it that setTension ducks. Built on demand and cached: every voice asks for
  // it, so this must be a cheap property read after the first call. Wrapped in
  // try/catch because a missing node constructor must degrade to "straight to
  // destination", never to a thrown exception on the first keystroke.
  bus() {
    if (!this.ctx) return null;
    if (this.masterGain) return this.masterGain;
    try {
      const g = this.ctx.createGain();
      g.gain.value = 1;
      if (this.ctx.createDynamicsCompressor) {
        const comp = this.ctx.createDynamicsCompressor();
        // Gentle glue, not pumping: catch the peaks when a deprecation notice
        // lands on top of music + typing, leave normal play untouched.
        if (comp.threshold) comp.threshold.value = -16;
        if (comp.knee) comp.knee.value = 14;
        if (comp.ratio) comp.ratio.value = 6;
        if (comp.attack) comp.attack.value = 0.004;
        if (comp.release) comp.release.value = 0.20;
        g.connect(comp);
        comp.connect(this.ctx.destination);
      } else {
        g.connect(this.ctx.destination);
      }
      const mg = this.ctx.createGain();
      mg.gain.value = 1;
      mg.connect(g);
      this.masterGain = g;
      this.musicGain = mg;
      return g;
    } catch (e) {
      return null;
    }
  },

  // Bus for the loop only, so tension can duck the bed without ducking the
  // player's own keystrokes (ducking feedback would feel like input lag).
  musicBus() {
    this.bus();
    return this.musicGain || this.masterGain || (this.ctx && this.ctx.destination) || null;
  },

  noteAt(freq, t, dur, type = 'square', vol = 0.1, dest = null) {
    if (this.muted || this.master <= 0) return;
    if (!this.ctx || this.ctx.state !== 'running') return;
    // A NaN/negative frequency throws in Chrome and takes the whole run with
    // it; bad profile data must go quiet, not fatal.
    if (!isFinite(freq) || freq <= 0) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol * this.master, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(dest || this.bus() || this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  },

  tone(freq, dur, type = 'square', vol = 0.15, slideTo = null) {
    if (this.muted || this.master <= 0) return;
    if (!this.ctx || this.ctx.state !== 'running') return;
    if (!isFinite(freq) || freq <= 0) return;
    if (slideTo != null && (!isFinite(slideTo) || slideTo <= 0)) slideTo = null;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    gain.gain.setValueAtTime(vol * this.master, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(this.bus() || this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  },

  // --- noise percussion ---------------------------------------------------

  // One second of white noise, generated once and replayed at different rates.
  // An oscillator "kick" alone is thin; the transient is what sells a drum.
  noise() {
    if (!this.ctx || !this.ctx.createBuffer) return null;
    if (this.noiseBuf) return this.noiseBuf;
    try {
      const sr = this.ctx.sampleRate || 44100;
      const buf = this.ctx.createBuffer(1, Math.floor(sr * 0.5), sr);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      this.noiseBuf = buf;
      return buf;
    } catch (e) {
      return null;
    }
  },

  // A single noise burst at absolute time t. rate < 1 darkens it (kick body),
  // rate > 1 brightens it (hat). dest lets percussion ride the ducked bed.
  noiseAt(t, dur, vol = 0.1, rate = 1, dest = null) {
    if (this.muted || this.master <= 0) return;
    if (!this.ctx || this.ctx.state !== 'running') return;
    const buf = this.noise();
    if (!buf) return;
    const src = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    src.buffer = buf;
    if (src.playbackRate) src.playbackRate.setValueAtTime(rate, t);
    gain.gain.setValueAtTime(vol * this.master, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(gain).connect(dest || this.bus() || this.ctx.destination);
    src.start(t);
    src.stop(t + dur);
  },

  // --- procedural chiptune loop -------------------------------------------

  freq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  },

  // Sanitise anything languages.js hands us. Every field is optional and every
  // number is clamped: a typo like root: 4500 would otherwise schedule an
  // inaudible ultrasonic loop that reads as "the music broke".
  normProfile(p) {
    if (!p || typeof p !== 'object') return DEFAULT_PROFILE;
    const num = (v, lo, hi, fb) => {
      const n = Number(v);
      return isFinite(n) ? Math.min(hi, Math.max(lo, Math.round(n))) : fb;
    };
    const four = (a, fb) => {
      if (!Array.isArray(a) || !a.length) return fb.slice();
      const out = [];
      for (let i = 0; i < 4; i++) out.push(num(a[i % a.length], -24, 36, fb[i]));
      return out;
    };
    const osc = (v, fb) => (OSC_TYPES.indexOf(v) >= 0 ? v : fb);
    return {
      root: num(p.root, 33, 57, DEFAULT_PROFILE.root),
      steps: four(p.steps, DEFAULT_PROFILE.steps),
      arp: four(p.arp, DEFAULT_PROFILE.arp),
      bass: osc(p.bass, DEFAULT_PROFILE.bass),
      lead: osc(p.lead, DEFAULT_PROFILE.lead),
      // Tempo is only a hint we carry for the caller; the HUD drives the real
      // tempo through setMusicTempo, so applying it here would fight the lead.
      bpm: num(p.bpm, 40, 220, DEFAULT_PROFILE.bpm)
    };
  },

  // Swap the loop's identity WITHOUT restarting it: m.step and m.next are left
  // alone, so the next scheduled 8th note simply arrives in the new key. A
  // stop/start here would leave an audible hole every time the language changes.
  setMusicProfile(profile) {
    const p = this.normProfile(profile);
    // During a boss fight the loop is on loan; park the new language profile so
    // setBossMode(false) restores the language we are actually playing now.
    if (this.boss) this.preBossProfile = p;
    else this.profile = p;
    return p;
  },

  playStep(step, t, spb) {
    const p = this.profile || DEFAULT_PROFILE;
    const root = p.root + p.steps[Math.floor(step / 8) % 4];
    const out = this.musicBus();
    if (step % 2 === 0) this.noteAt(this.freq(root), t, spb * 0.9, p.bass, 0.040, out);
    this.noteAt(this.freq(root + p.arp[step % 4]), t, spb * 0.55, p.lead, 0.050, out);
    if (step % 8 === 4) this.noteAt(this.freq(root + 27), t, spb * 0.4, p.bass, 0.022, out);
    if (this.boss) this.bossPercussion(step, t, spb, out);
  },

  // Drums live inside playStep instead of on their own interval: they are then
  // sample-locked to the bass, they inherit pause/resume for free, and there is
  // one less timer that can outlive the scene. The offbeat hat is a 16th, which
  // is what gives boss fights their "faster" feel without touching the BPM.
  bossPercussion(step, t, spb, out) {
    if (step % 4 === 0) {
      this.noteAt(120, t, spb * 0.5, 'sine', 0.14, out);
      this.noiseAt(t, 0.03, 0.06, 0.6, out);
    }
    if (step % 8 === 4) this.noiseAt(t, 0.12, 0.09, 1.0, out);
    this.noiseAt(t + spb * 0.5, 0.02, 0.025, 2.4, out);
  },

  // one scheduler tick: queue any 8th-notes due in the next lookahead window
  musicTick(m) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    if (m.next < this.ctx.currentTime) m.next = this.ctx.currentTime + 0.05;
    const spb = 60 / (m.bpm * 2);                // 8th notes
    while (m.next < this.ctx.currentTime + 0.15) {
      this.playStep(m.step, m.next, spb);
      m.next += spb;
      m.step = (m.step + 1) % 32;
    }
  },

  // --- timer registry ------------------------------------------------------

  every(name, ms, fn) {
    this.stopTimer(name);
    this.timers[name] = setInterval(fn, ms);
    return this.timers[name];
  },

  stopTimer(name) {
    if (this.timers[name]) {
      clearInterval(this.timers[name]);
      this.timers[name] = null;
    }
  },

  stopAllTimers() {
    for (const name in this.timers) this.stopTimer(name);
  },

  startMusic(bpm = 96) {
    if (this.music) { this.music.bpm = bpm; return; }
    this.unlock();
    if (!this.ctx) return;
    const m = { bpm, step: 0, next: this.ctx.currentTime + 0.1, timer: null };
    m.timer = this.every('music', 50, () => this.musicTick(m));
    this.music = m;
  },

  setMusicTempo(bpm) {
    if (this.music) this.music.bpm = bpm;
  },

  // Freeze the loop for an ESC pause. The intervals are raw timers, so they kept
  // playing through Phaser's scene pause (which only halts scene timers/tweens).
  // Keep the music object (step/bpm) and the tension level so resume picks both
  // the melody and the heartbeat back up in place.
  pauseMusic() {
    this.stopAllTimers();
    if (this.music) this.music.timer = null;
  },

  resumeMusic() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    // Restore exactly what was running: the heartbeat only if tension is still on.
    if (this.tension > 0 && !this.timers.heart) this.startHeartbeat();
    const m = this.music;
    if (!m || m.timer) return;
    m.next = this.ctx.currentTime + 0.05;   // don't dump the whole paused gap at once
    m.timer = this.every('music', 50, () => this.musicTick(m));
  },

  stopMusic() {
    if (this.boss) this.setBossMode(false);
    this.setTension(0);
    this.stopAllTimers();
    this.music = null;
  },

  // --- boss + tension ------------------------------------------------------

  // Boss fights borrow the running loop rather than starting a second one, so
  // the transition is a key change on the next 8th note, not a restart.
  setBossMode(on) {
    const want = !!on;
    if (want === this.boss) return;
    this.boss = want;
    if (want) {
      this.preBossProfile = this.profile;
      this.profile = BOSS_PROFILE;
    } else {
      this.profile = this.preBossProfile || DEFAULT_PROFILE;
      this.preBossProfile = null;
    }
  },

  // level 0..1, driven by the run clock. Called every frame, so it quantises to
  // 0.2 and no-ops unless the bucket actually changed — otherwise we would tear
  // down and rebuild the heartbeat interval 60 times a second.
  setTension(level) {
    let l = Number(level);
    if (!isFinite(l)) l = 0;
    l = Math.min(1, Math.max(0, l));
    const q = Math.round(l * 5) / 5;
    if (q === this.tension) return;
    this.tension = q;
    // Duck the bed so the heartbeat and the countdown tick have room. Ramped,
    // never stepped: an instant gain jump on a running loop is an audible click.
    const g = this.musicBus() === this.musicGain ? this.musicGain : null;
    if (g && this.ctx && this.ctx.state === 'running') {
      try {
        g.gain.cancelScheduledValues(this.ctx.currentTime);
        g.gain.setTargetAtTime(1 - 0.35 * q, this.ctx.currentTime, 0.10);
      } catch (e) {}
    }
    if (q === 0) this.stopTimer('heart');
    else this.startHeartbeat();
  },

  startHeartbeat() {
    if (!this.ctx || this.tension <= 0) return;
    // 620ms at the first flicker of tension down to ~320ms at zero seconds —
    // a resting pulse accelerating into a panic one.
    const ms = Math.round(620 - 300 * this.tension);
    this.every('heart', ms, () => this.heartbeat());
  },

  // lub-dub: two sub-bass thumps, the second quieter and a beat behind. Felt
  // more than heard, which is why it sits under the music instead of over it.
  heartbeat() {
    if (this.muted || this.master <= 0) return;
    if (!this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    const v = 0.10 + 0.10 * this.tension;
    this.noteAt(58, t, 0.13, 'sine', v);
    this.noteAt(52, t + 0.16, 0.11, 'sine', v * 0.65);
  },

  // --- deprecation voice ---------------------------------------------------
  // The mechanic the game is named for was silent. These four cues are the only
  // sounds allowed to be louder than the music, because missing one costs a
  // pattern for the whole level. All of them schedule on the audio clock rather
  // than through setTimeout, so nothing survives a scene pause as a stray timer.

  // A notice just appeared: a short descending minor figure, doubled with a
  // detuned saw so it cuts through a full mix. Down = something is being taken.
  deprecationNotice() {
    if (this.muted || this.master <= 0) return;
    if (!this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    const fig = [81, 77, 74];                  // A5 F5 D5 — a falling minor shape
    for (let i = 0; i < fig.length; i++) {
      const at = t + i * 0.075;
      const dur = i === fig.length - 1 ? 0.20 : 0.09;
      this.noteAt(this.freq(fig[i]), at, dur, 'square', 0.14);
      this.noteAt(this.freq(fig[i] - 12) * 1.005, at, dur, 'sawtooth', 0.05);
    }
  },

  // Called repeatedly while a notice counts down. msLeft ~6000 -> 0; the pitch
  // rises and an octave layer joins at the end so the last two seconds read as
  // "now". Deliberately quiet: this fires many times per notice.
  deprecationTick(msLeft) {
    const ms = isFinite(msLeft) ? Math.max(0, Math.min(6000, msLeft)) : 6000;
    const p = 1 - ms / 6000;                   // 0 = fresh notice, 1 = out of time
    const f = 520 + p * 620;
    this.tone(f, 0.025, 'square', 0.045 + 0.02 * p);
    if (p > 0.75 && this.ctx && this.ctx.state === 'running') {
      this.noteAt(f * 2, this.ctx.currentTime, 0.02, 'square', 0.02);
    }
  },

  // The notice expired. A dead low thud sliding further down, with a noise
  // body — a loss, not a buzzer (wrong() already owns the buzzer).
  deprecationLost() {
    if (this.muted || this.master <= 0) return;
    if (!this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    this.tone(96, 0.55, 'triangle', 0.20, 26);
    this.noteAt(72, t + 0.02, 0.40, 'sine', 0.14);
    this.noiseAt(t, 0.18, 0.05, 0.35);
  },

  // Typed in time — the pattern pays double. Deliberately the mirror image of
  // deprecationLost: rising, bright, short. Distinct from win(), which is the
  // slower three-note fanfare at the end of a level.
  rescued() {
    if (this.muted || this.master <= 0) return;
    if (!this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    const fig = [76, 83, 88];                  // E5 B5 E6 — an opening-out fifth
    for (let i = 0; i < fig.length; i++) {
      const at = t + i * 0.065;
      const dur = i === fig.length - 1 ? 0.24 : 0.08;
      this.noteAt(this.freq(fig[i]), at, dur, 'triangle', 0.14);
      this.noteAt(this.freq(fig[i] + 12), at, dur * 0.6, 'square', 0.045);
    }
  },

  // --- one-shots -----------------------------------------------------------

  blip()   { this.tone(440, 0.08, 'square', 0.12); },
  pickup() { this.tone(660, 0.12, 'square', 0.12, 1320); },
  hit()    { this.tone(220, 0.2, 'sawtooth', 0.18, 55); },
  type()   { this.tone(880, 0.03, 'square', 0.05); },
  back()   { this.tone(300, 0.03, 'square', 0.045); },
  wrong()  { this.tone(160, 0.15, 'sawtooth', 0.15, 80); },

  // The typing click, but climbing a major-pentatonic ladder with the combo —
  // the single biggest "feels good to type" trick in the genre, and free here.
  // A pure function of the argument, so the pitch resets the instant the combo
  // does, with no state to forget to clear. The climb caps at two octaves (a
  // 60-combo would otherwise be a dog whistle) and the level drops slightly as
  // it rises, because high squares read as much louder than low ones.
  typeCombo(combo) {
    const n = isFinite(combo) ? Math.max(0, Math.floor(combo)) : 0;
    const deg = [0, 2, 4, 7, 9];
    const semis = Math.min(24, deg[n % 5] + 12 * Math.floor(n / 5));
    this.tone(this.freq(72 + semis), 0.03, 'square', 0.05 - 0.012 * (semis / 24));
  },

  // Low-time tick. Pass the whole seconds left (0..10) and the pitch climbs as the
  // clock tightens — a rising countdown beep is the classic "Count Down" tension
  // cue, and it's the theme of the whole game. No arg → the old flat 990Hz.
  tick(sec) {
    const f = sec == null ? 990 : 900 + (10 - Math.max(0, Math.min(10, sec))) * 45;
    this.tone(f, 0.05, 'square', 0.08);
  },
  hint()   { this.tone(523, 0.08, 'sine', 0.12, 1046); },
  win()    {
    this.tone(523, 0.1);
    setTimeout(() => this.tone(659, 0.1), 100);
    setTimeout(() => this.tone(784, 0.2), 200);
  }
};
