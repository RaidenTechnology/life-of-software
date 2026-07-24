// GameScene — the core loop: a text panel in the middle, a countdown at the
// top, the battle strip in between. Type the current language's patterns
// before the clock hits zero; every correct word = a sword hit, score, time
// and credits. Clearing the road raises the STAGE. Monsters drop loot by
// chance (more at higher stages, +20% during festivals): sword (credit
// multiplier), armor (death save), potion (time), scroll (free hints),
// treasure (credits). Items live in a persistent BAG with a salvage option,
// and a daily SHOP sells four rotating items for credits.

const HINT_COST = 20;
const FESTIVAL_HINT_COST = 10;
const CREDIT_PER_WORD = 5;
const CREDIT_MAX = 100;
const START_TIME = 75;
const LEVELUP_TIME_BONUS = 10;
const PERFECT_TIME_BONUS = 5;     // clearing a level with zero wrong patterns
const PERFECT_CREDIT = 10;
const BOSS_WIN_TIME = 25;        // clock floor after clearing a boss (fresh stage)
const MAX_TYPED = 24;
const FESTIVAL_CHANCE = 0.35;
const FESTIVAL_TIME = 20;
const FESTIVAL_CREDIT = 15;
const FESTIVAL_TIME_BONUS = 2;
const ENEMY_STRIKE_EVERY = 10;   // seconds between the front monster's hits

const STAGES = [
  { name: 'VERY EASY', mult: 1.0 },
  { name: 'EASY',      mult: 1.4 },
  { name: 'MEDIUM',    mult: 1.8 },
  { name: 'HARD',      mult: 2.3 },
  { name: 'VERY HARD', mult: 2.8 },
  { name: 'SURVIVAL',  mult: 3.5 }
];

class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init(data) {
    this.daily = !!(data && data.daily);
    // resume from the furthest section cleared (checkpoint). Never for daily —
    // the daily is a fixed seeded challenge and always starts fresh.
    this.resumeRun = !!(data && data.resume) && !this.daily;
    if (this.daily) {
      const day = new Date().toISOString().slice(0, 10);
      let s = 0;
      for (const ch of day) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
      this.rand = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
    } else {
      this.rand = Math.random;
    }
  }

  pickFrom(arr) {
    return arr[Math.floor(this.rand() * arr.length)];
  }

  // In-place Fisher-Yates using this.rand (seeded for the daily). The old
  // sort(() => this.rand() - 0.5) idiom is a biased, non-uniform shuffle — the
  // comparator isn't a consistent ordering — so festival language pools weren't
  // drawn uniformly, and under the seeded daily RNG the bias was deterministic.
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.rand() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  create() {
    this.score = 0;          // per-level score — drives the level target/progress bar, resets each level
    this.runScore = 0;       // cumulative run score — the honest headline number, never resets mid-run
    this.credits = 0;
    this.wordsTyped = 0;
    this.langIndex = 0;
    this.stageIndex = 0;
    this.survivalLap = 0;
    // resume position from the checkpoint (furthest section cleared). Score,
    // clock and per-level state stay fresh — only the road position is restored.
    if (this.resumeRun) {
      let ck = null;
      try { ck = JSON.parse(localStorage.getItem('los_ckpt') || 'null'); } catch (e) {}
      if (ck) {
        this.stageIndex = Math.min(ck.stageIndex || 0, STAGES.length - 1);
        this.survivalLap = Math.max(0, ck.lap || 0);
        this.langIndex = Math.min(ck.langIndex || 0, LANGUAGES.length - 1);
      }
    }
    this.timeLeft = START_TIME;
    this.typed = '';
    this.found = new Set();
    this.recent = [];
    this.paused = false;
    this.over = false;
    this.dying = false;
    this.transitioning = false;
    this.festival = null;
    this.bossMode = null;
    this.lastTickSecond = -1;
    this.strikeTimer = 0;
    this._shaking = false;
    this._timerLow = false;   // tracks the big timer's low-time recolor state
    this._lastShownSec = -1;  // last integer second painted to the timer text
    // refreshLangHud runs on EVERY correct word; these gate the expensive battle
    // re-stage / re-tier so it fires only when the value actually changes (see
    // refreshLangHud). -1 forces the first real call through.
    this._hudStage = -1;
    this._hudTier = -1;
    this._comboTier = 1;      // last combo score-multiplier tier reached (juice)
    this.levelMistakes = 0;   // wrong patterns in the CURRENT normal level (perfect-clear bonus)

    // combo + run stats
    this.combo = 0;
    this.maxCombo = 0;
    this.elapsed = 0;
    this.submitsTotal = 0;
    this.submitsOk = 0;
    this.lootCount = 0;

    // loot state
    this.inventory = Items.load();
    this.hintTokens = 0;
    this.creditMult = 1;
    this.multWords = 0;
    this.deathSave = 0;
    this.menuOpen = null;
    this.menuC = null;
    this.menuClock = null;
    this.menuClockBar = null;
    this._hintClear = null;   // pending hintText auto-clear timer (see buyHint)

    const cx = this.scale.width / 2;

    // full-screen Blender atmosphere behind everything, swapped per stage in
    // refreshLangHud(). Dark + themed so HUD/editor stay readable. Start on a
    // guaranteed-present texture and route every swap through applySceneBg so a
    // missing PNG (flaky itch CDN / cache miss) degrades to the plain dark editor
    // background instead of Phaser's green __MISSING fill — the same graceful
    // degradation every other sprite gets (see Battle.spawnBoss).
    this.sceneBg = this.add.image(cx, this.scale.height / 2, 'pixel').setDepth(-1000);
    this.applySceneBg(Battle.TYPES[0]);

    const status = UI.chrome(this, 'life_of_software — Raiden IDE');
    status.left.setText('type + ENTER · TAB bag · ESC pause · HINT = ' + HINT_COST +
      ' credits (' + FESTIVAL_HINT_COST + ' at festivals)');
    // keep the right status handle + its base label: update() appends a live
    // WPM readout to it once per second (a typing game should show your speed).
    this.statusRight = status.right;
    this._statusBase = this.daily
      ? 'DAILY CHALLENGE — ' + new Date().toISOString().slice(0, 10)
      : 'GMTK 2026 — Count Down';
    this.statusRight.setText(this._statusBase);

    // chiptune loop; tempo rises with the stage
    Sfx.startMusic(94);
    this.events.once('shutdown', () => Sfx.stopMusic());

    this.timerText = this.add.text(cx, 95, String(START_TIME), {
      fontFamily: 'monospace', fontSize: '60px', color: IDE.text, fontStyle: 'bold'
    }).setOrigin(0.5);

    // HUD: score + stage + bag/shop (left), language + progress (right)
    this.scoreText = this.add.text(16, 40, 'SCORE 0', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.text
    });
    // live PB target: the run-total SCORE to beat, so the now-rankable number
    // has an in-run goal. Normal mode only — dailies load the shared bag and
    // rank on a separate per-day key, so they don't chase the global best.
    this.bestScore = 0;
    try {
      const b = JSON.parse(localStorage.getItem('los_best') || 'null');
      if (b && b.score) this.bestScore = b.score;
    } catch (e) {}
    this.beatBest = false;
    this.pbText = this.add.text(180, 50, '', {
      fontFamily: 'monospace', fontSize: '13px', color: IDE.dim
    }).setOrigin(0, 0.5);
    this.refreshPB();
    this.stageText = this.add.text(16, 66, '', {
      fontFamily: 'monospace', fontSize: '14px', color: '#dcdcaa'
    });
    this.bagBtn = this.add.text(16, 92, '', {
      fontFamily: 'monospace', fontSize: '15px', color: IDE.keyword
    }).setInteractive({ useHandCursor: true }).setDepth(9);
    this.bagBtn.on('pointerover', () => this.bagBtn.setColor(IDE.white));
    this.bagBtn.on('pointerout', () => this.bagBtn.setColor(IDE.keyword));
    this.bagBtn.on('pointerdown', () => this.toggleMenu('bag'));
    this.shopBtn = this.add.text(130, 92, '[ SHOP ]', {
      fontFamily: 'monospace', fontSize: '15px', color: IDE.keyword
    }).setInteractive({ useHandCursor: true }).setDepth(9);
    this.shopBtn.on('pointerover', () => this.shopBtn.setColor(IDE.white));
    this.shopBtn.on('pointerout', () => this.shopBtn.setColor(IDE.keyword));
    this.shopBtn.on('pointerdown', () => this.toggleMenu('shop'));

    this.langText = this.add.text(this.scale.width - 16, 44, '', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.text, fontStyle: 'bold'
    }).setOrigin(1, 0);
    this.langBadge = null;
    this._badgeKey = null;
    this.progressTrack = this.add.rectangle(this.scale.width - 16, 76, 180, 6, IDE.border).setOrigin(1, 0.5);
    this.progressFill = this.add.rectangle(this.scale.width - 196, 76, 0, 6, IDE.statusbar).setOrigin(0, 0.5);
    this.comboText = this.add.text(this.scale.width - 16, 96, '', {
      fontFamily: 'monospace', fontSize: '15px', color: '#dcdcaa', fontStyle: 'bold'
    }).setOrigin(1, 0);
    // the run's best combo, surfaced live under the current-combo readout (the
    // End screen already reports it, but during a run you never saw your record
    // build). Persistent — it survives level-ups, bosses and festivals, unlike
    // comboText which blanks whenever the live combo drops below 2.
    this.bestComboText = this.add.text(this.scale.width - 16, 118, '', {
      fontFamily: 'monospace', fontSize: '12px', color: '#dcdcaa'
    }).setOrigin(1, 0);
    this._shownBestCombo = 0;

    // battle strip: hero vs monsters, between the countdown and the panel
    this.battle = new Battle(this, 195);

    // input panel: one editor line, with a line-number gutter
    const panelW = 620, panelH = 74, panelY = 350;
    this.panel = this.add.rectangle(cx, panelY, panelW, panelH, IDE.panel)
      .setStrokeStyle(2, IDE.border);
    this.add.rectangle(cx - panelW / 2 + 24, panelY, 48, panelH - 4, 0x2a2a2b);
    this.add.text(cx - panelW / 2 + 24, panelY, '1', {
      fontFamily: 'monospace', fontSize: '22px', color: '#858585'
    }).setOrigin(0.5);
    this.inputText = this.add.text(cx - panelW / 2 + 64, panelY, '', {
      fontFamily: 'monospace', fontSize: '30px', color: IDE.text
    }).setOrigin(0, 0.5);
    this.cursor = this.add.rectangle(this.inputText.x + 2, panelY, 3, 36, 0xaeafad);
    this.tweens.add({ targets: this.cursor, alpha: 0, duration: 400, yoyo: true, repeat: -1 });

    // one reusable burst emitter for the correct-word pop — explode() from here
    // each word instead of creating + destroying an emitter (and a delayedCall)
    // on every keystroke-that-lands.
    this.burstFx = this.add.particles(cx, panelY, 'pixel', {
      speed: { min: 80, max: 200 }, lifespan: 400, quantity: 14,
      scale: { start: 1.5, end: 0 }, tint: IDE.greenHex, emitting: false
    });

    // credits + hint + active effects — top-right corner of the input panel
    const panelRight = cx + panelW / 2, panelTop = panelY - panelH / 2;
    this.creditText = this.add.text(panelRight, panelTop - 22, '', {
      fontFamily: 'monospace', fontSize: '16px', color: IDE.text
    }).setOrigin(1, 0.5);
    this.hintBtn = this.add.text(panelRight, panelTop - 44, '', {
      fontFamily: 'monospace', fontSize: '16px', color: IDE.keyword
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    this.hintBtn.on('pointerover', () => this.hintBtn.setColor(IDE.white));
    this.hintBtn.on('pointerout', () => this.hintBtn.setColor(IDE.keyword));
    this.hintBtn.on('pointerdown', () => this.buyHint());
    this.effectText = this.add.text(panelRight, panelTop - 66, '', {
      fontFamily: 'monospace', fontSize: '13px', color: '#dcdcaa'
    }).setOrigin(1, 0.5);

    this.hintText = this.add.text(cx, panelY + 62, '', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.stringy
    }).setOrigin(0.5);
    this.feedbackText = this.add.text(cx, panelY + 92, '', {
      fontFamily: 'monospace', fontSize: '15px', color: IDE.dim
    }).setOrigin(0.5);
    this.recentText = this.add.text(cx, this.scale.height - 44, '', {
      fontFamily: 'monospace', fontSize: '14px', color: IDE.comment
    }).setOrigin(0.5);

    // ESC/pause overlay — a Blender-rendered retro IDE window (pause_panel)
    // over a dim, with PAUSED + resume hint drawn on top. Toggled in togglePause().
    const pcy = this.scale.height / 2;
    const pDim = this.add.rectangle(cx, pcy, this.scale.width, this.scale.height, 0x0a0a0f, 0.66);
    // guard the Blender window PNG: if it failed to load, drop it and let the dim
    // + PAUSED text carry the overlay rather than showing a green __MISSING box.
    const pPanel = this.textures.exists('pause_panel') ? this.add.image(cx, pcy, 'pause_panel') : null;
    const pTitle = this.add.text(cx, pcy - 18, 'PAUSED', {
      fontFamily: 'monospace', fontSize: '46px', color: IDE.white, fontStyle: 'bold'
    }).setOrigin(0.5);
    const pHint = this.add.text(cx, pcy + 40,
      'ESC to resume   ·   Q to quit to the menu', {
        fontFamily: 'monospace', fontSize: '14px', color: IDE.comment
      }).setOrigin(0.5);
    this.pauseUI = this.add.container(0, 0, [pDim, pPanel, pTitle, pHint].filter(Boolean))
      .setDepth(50).setVisible(false);

    // silent low-time warning: a red edge frame that intensifies as the clock
    // runs out, so the countdown tension reads even with sound muted. A full-
    // screen rect with a thick stroke shows only as an inner border band, so it
    // never covers the play area — one always-on object, alpha driven per frame.
    this.warnFrame = this.add.rectangle(cx, this.scale.height / 2,
      this.scale.width, this.scale.height, 0xff2233, 0)
      .setStrokeStyle(64, 0xff2233).setDepth(8).setAlpha(0);

    // reusable ring of floating "+N / +Ns" popups. floatText() fires on every
    // landed word — the fastest UI churn in the game — and used to add + destroy
    // a Text each time. Preallocate a small pool and recycle round-robin instead;
    // built last so they sit above the panel/HUD (below the depth-8 warn frame,
    // matching the old on-demand ordering). 6 covers realistic overlap at 900ms.
    this._floatPool = [];
    this._floatIdx = 0;
    for (let i = 0; i < 6; i++) {
      this._floatPool.push(this.add.text(0, 0, '', {
        fontFamily: 'monospace', fontSize: '22px', color: IDE.comment, fontStyle: 'bold'
      }).setOrigin(0.5).setAlpha(0));
    }

    // capture TAB so the bag shortcut (see onKey) never tab-moves focus out of
    // the game canvas / itch iframe onto browser chrome.
    this.input.keyboard.addCapture('TAB');
    this.input.keyboard.on('keydown', (e) => this.onKey(e));

    this.refreshLangHud();
    this.refreshCredits();
    this.refreshBag();

    // a nudge for first-time players; the first correct word clears it. Use a
    // word from the CURRENT language — hardcoding "body" (HTML) was wrong when
    // resuming a run at CSS/JS/etc. from a checkpoint.
    const sample = this.lang.words[0];
    this.hintText.setText('// try typing "' + sample + '" then ENTER — every word buys time!');
  }

  get lang() {
    return LANGUAGES[this.langIndex];
  }

  get activeLang() {
    if (this.bossMode) return this.bossMode.lang;
    return this.festival ? this.festival.lang : this.lang;
  }

  get activeFound() {
    if (!this.festival) return this.found;
    // the sw festival pools many languages and highlights them in turn; dedupe
    // per highlighted language so a keyword valid in two of them (return, class,
    // if…) isn't wrongly rejected as "already typed" when the other comes up.
    // growth stays on the shared set: pickGrowthRound guarantees unique words.
    if (this.festival.type === 'sw') return this.festival.usedByLang.get(this.activeLang.name);
    return this.festival.used;
  }

  get hintCost() {
    return this.festival ? FESTIVAL_HINT_COST : HINT_COST;
  }

  targetScore() {
    const mult = STAGES[this.stageIndex].mult + this.survivalLap * 0.5;
    return Math.round(this.lang.target * mult / 10) * 10;
  }

  fmtC(c) {
    return String(parseFloat(c.toFixed(2)));
  }

  gainCredits(base) {
    this.credits = Math.min(CREDIT_MAX, this.credits + base * this.creditMult);
  }

  // Run-total score: the HUD SCORE and the End headline. this.score still tracks
  // per-level progress toward the target (and resets each level); runScore keeps
  // climbing across levels, bosses and festivals so the number you finish on is
  // the whole run, not the last half-cleared level.
  addScore(points) {
    this.runScore += points;
    this.scoreText.setText('SCORE ' + this.runScore);
    if (!this.beatBest && !this.daily && this.bestScore > 0 &&
        this.runScore > this.bestScore) {
      this.beatBest = true;
      this.refreshPB();
      this.tweens.add({ targets: this.pbText, scale: 1.4, duration: 200, yoyo: true });
      this.floatText('NEW RECORD!');
      Sfx.win();
    }
  }

  refreshPB() {
    if (!this.pbText) return;
    if (this.daily || this.bestScore <= 0) { this.pbText.setText(''); return; }
    this.pbText.setText(this.beatBest ? '★ RECORD ★' : 'PB ' + this.bestScore)
      .setColor(this.beatBest ? '#ff9800' : IDE.dim);
  }

  onKey(e) {
    if (this.over || this.dying) return;
    // TAB toggles the BAG mid-run. This is a keyboard game and every plain letter
    // collides with word input, so Tab — captured in create() so it can't shift
    // focus out of the itch iframe — is the one free key. toggleMenu() self-guards
    // (paused/transition/festival) and closes the bag if it's already open, and
    // from the shop it swaps straight to the bag.
    if (e.key === 'Tab') { this.toggleMenu('bag'); return; }
    if (this.menuOpen) {
      if (e.key === 'Escape') this.closeMenu();
      return;
    }
    if (this.transitioning) return;
    if (e.key === 'Escape') { this.togglePause(); return; }
    if (this.paused) {
      // from the pause screen you can bail out to the main menu (to try the
      // daily, start fresh, etc.) — otherwise a run only ends by dying. The
      // furthest section reached is already checkpointed on each clear.
      if (e.key === 'q' || e.key === 'Q') this.quitToMenu();
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'Enter') {
      this.submit();
    } else if (e.key === 'Backspace') {
      this.typed = this.typed.slice(0, -1);
      this.refreshInput();
    } else if (e.key.length === 1 && !/\s/.test(e.key) && this.typed.length < MAX_TYPED) {
      this.typed += e.key.toLowerCase();
      Sfx.type();
      this.refreshInput();
    }
  }

  submit() {
    const w = this.typed.trim();
    this.typed = '';
    this.refreshInput();
    if (!w) return;
    this.submitsTotal++;

    if (this.festival && this.festival.type === 'growth') {
      this.growthSubmit(w);
      return;
    }

    if (this.activeFound.has(w)) {
      this.feedback('"' + w + '" already typed', IDE.dim);
      Sfx.blip();
      return;
    }
    if (!this.activeLang.words.includes(w)) {
      // a wrong word breaks the combo — if it was a real streak (>=5, the first
      // score-multiplier tier), say so in the same red line so the cost of the
      // miss reads. No balance change; combo already reset to 0 on any wrong word.
      const tail = this.combo >= 5 ? ' — combo ×' + this.combo + ' lost!' : '';
      this.feedback('"' + w + '" is not a ' + this.activeLang.name + ' pattern' + tail, IDE.error);
      // only count against the perfect-clear bonus during real level play — boss
      // fights and festivals are interstitials, not the language level being cleared.
      if (!this.bossMode && !this.festival) this.levelMistakes++;
      this.combo = 0;
      this.refreshCombo();
      Sfx.wrong();
      this.shakePanel();
      return;
    }

    this.activeFound.add(w);
    this.wordsTyped++;
    this.submitsOk++;
    this.combo++;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    this.refreshCombo(true);
    const pos = this.celebrate();

    if (this.bossMode) {
      const m = this.comboMult();
      const bonus = (1.5 + 0.25 * w.length) * this.bossMode.lang.timeMult;
      this.timeLeft += bonus;
      this.addScore(w.length * 15 * m);   // boss hits are worth more than a plain word
      this.gainCredits(CREDIT_PER_WORD);
      this.tickMult();
      this.refreshCredits();
      this.floatText('BOSS HIT!' + (m > 1 ? ' ×' + m : '') + '  +' + bonus.toFixed(1) + 's');
      this.maybeDrop(pos);
      this.bossMode.hp--;
      this.refreshLangHud();
      if (this.bossMode.hp <= 0) this.beatBoss();
      return;
    }

    if (this.festival) {
      const m = this.comboMult();
      this.festival.count++;
      this.addScore(w.length * 10 * m);
      this.gainCredits(FESTIVAL_CREDIT);
      this.timeLeft += FESTIVAL_TIME_BONUS;
      this.tickMult();
      this.refreshCredits();
      this.floatText((m > 1 ? '×' + m + '  ' : '') + '+' + FESTIVAL_CREDIT +
        ' credits  +' + FESTIVAL_TIME_BONUS + 's');
      this.maybeDrop(pos);
      this.pickFestivalLang();
      return;
    }

    const m = this.comboMult();
    const points = w.length * 10 * m;
    const bonus = (1.5 + 0.25 * w.length) * this.lang.timeMult;
    this.score += points;
    this.addScore(points);
    this.timeLeft += bonus;
    this.gainCredits(CREDIT_PER_WORD);
    this.tickMult();

    this.refreshCredits();
    this.pushRecent(w);
    this.floatText('+' + points + (m > 1 ? ' (×' + m + ')' : '') +
      '  +' + bonus.toFixed(1) + 's');
    if (this.wordsTyped === 1) {
      this.feedback('nice! reach the target score to clear the level', IDE.comment);
    }
    this.maybeDrop(pos);

    if (this.score >= this.targetScore()) {
      this.levelUp();
    } else {
      this.refreshLangHud();
    }
  }

  growthSubmit(w) {
    const f = this.festival;
    const ok = w === f.lang.name.toLowerCase() || w === f.lang.abbr.toLowerCase();
    if (!ok) {
      const tail = this.combo >= 5 ? ' — combo ×' + this.combo + ' lost!' : '';
      this.feedback('"' + f.word + '" is not a ' + w.toUpperCase() + ' pattern' + tail, IDE.error);
      this.combo = 0;
      this.refreshCombo();
      Sfx.wrong();
      this.shakePanel();
      return;
    }
    f.count++;
    this.wordsTyped++;
    this.submitsOk++;
    this.combo++;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    this.refreshCombo(true);
    const pos = this.celebrate();
    const i = f.pool.indexOf(f.lang);
    this.tweens.add({ targets: f.badges[i], scale: 1.4, duration: 150, yoyo: true });
    const m = this.comboMult();
    this.addScore(f.word.length * 10 * m);
    this.gainCredits(FESTIVAL_CREDIT);
    this.timeLeft += FESTIVAL_TIME_BONUS;
    this.tickMult();
    this.refreshCredits();
    this.floatText((m > 1 ? '×' + m + '  ' : '') + '+' + FESTIVAL_CREDIT +
      ' credits  +' + FESTIVAL_TIME_BONUS + 's');
    this.maybeDrop(pos);
    this.pickGrowthRound();
  }

  // sword multiplier runs out word by word
  tickMult() {
    if (this.multWords > 0) {
      this.multWords--;
      if (this.multWords === 0) {
        this.creditMult = 1;
        this.feedback('sword effect expired', IDE.dim);
      }
    }
  }

  celebrate() {
    this.hintText.setText('');
    this.flashPanel(IDE.greenHex);
    Sfx.pickup();
    this.burstFx.explode(14);
    if (this.bossMode) return this.battle.bossHit();
    return this.festival ? null : this.battle.attack();
  }

  // combo score-multiplier tier, shared by the COMBO readout and every scoring
  // path so what the readout advertises ("score ×N") is exactly what lands —
  // in normal mode, boss fights AND festivals alike (it used to apply to the
  // normal path only, so the multiplier the boss/festival readout promised was
  // never actually paid out).
  comboMult() {
    return this.combo >= 15 ? 3 : this.combo >= 5 ? 2 : 1;
  }

  // surface the run's best combo once it's worth showing. Self-gates on change
  // so it doesn't re-raster the glyph texture on every word (setText re-renders).
  refreshBestCombo() {
    if (this.maxCombo < 2 || this.maxCombo === this._shownBestCombo) return;
    this._shownBestCombo = this.maxCombo;
    this.bestComboText.setText('BEST COMBO ' + this.maxCombo);
  }

  refreshCombo(pulse) {
    this.refreshBestCombo();
    if (this.combo < 2) { this.comboText.setText(''); this._comboTier = 1; return; }
    const m = this.comboMult();
    this.comboText.setText('COMBO ' + this.combo + (m > 1 ? ' · score ×' + m : ''))
      .setColor(m >= 3 ? '#ff9800' : m >= 2 ? '#dcdcaa' : '#a0d0a0');
    // Crossing INTO a new score-multiplier tier (×2 at 5, ×3 at 15) is the moment
    // the combo starts paying off — mark it with a bigger springy pop + a bright
    // rising chirp so the payoff is felt, not just recolored. Plain pulses keep
    // the small nudge. Only fires on the word that crosses the line.
    const milestone = pulse && m > this._comboTier;
    this._comboTier = m;
    if (pulse) {
      this.comboText.setScale(milestone ? 1.7 : 1.25);
      this.tweens.add({
        targets: this.comboText, scale: 1,
        duration: milestone ? 280 : 150, ease: milestone ? 'Back.easeOut' : 'Linear'
      });
      if (milestone) Sfx.pickup();
    }
  }

  // --- loot ---

  maybeDrop(pos) {
    const chance = Items.dropChance(this.stageIndex, !!this.festival);
    if (this.rand() >= chance) return;
    const item = Items.roll(this.rand);
    this.lootCount++;
    if (pos) {
      this.battle.dropLoot(pos, item, 40, 100, () => this.addItem(item, false));
    } else {
      this.addItem(item, true);
    }
  }

  addItem(item, announce) {
    if (this.inventory.length >= INV_MAX) {
      const v = RARITIES[item.r].salvage;
      this.credits = Math.min(CREDIT_MAX, this.credits + v);
      this.refreshCredits();
      this.feedback('bag full — ' + Items.name(item) + ' salvaged +' + this.fmtC(v), RARITIES[item.r].color);
      return;
    }
    this.inventory.push(item);
    Items.save(this.inventory);
    this.refreshBag();
    if (announce) this.feedback('LOOT: ' + Items.name(item), RARITIES[item.r].color);
    Sfx.hint();
  }

  useItem(i) {
    const item = this.inventory[i];
    if (!item) return;
    const T = ITEM_TYPES[item.t], r = item.r;
    if (T.key === 'sword') {
      this.creditMult = T.mult(r);
      this.multWords = T.multWords[r];
    } else if (T.key === 'armor') {
      this.deathSave = Math.max(this.deathSave, T.save[r]);
    } else if (T.key === 'potion') {
      this.timeLeft += T.time[r];
    } else if (T.key === 'scroll') {
      this.hintTokens += T.hints[r];
    } else if (T.key === 'treasure') {
      this.credits = Math.min(CREDIT_MAX, this.credits + T.credits[r]);
    }
    this.inventory.splice(i, 1);
    Items.save(this.inventory);
    this.refreshBag();
    this.refreshCredits();
    this.feedback('used ' + Items.name(item) + ' — ' + Items.desc(item), RARITIES[r].color);
    Sfx.win();
  }

  salvageItem(i) {
    const item = this.inventory[i];
    if (!item) return;
    const v = RARITIES[item.r].salvage;
    this.credits = Math.min(CREDIT_MAX, this.credits + v);
    this.inventory.splice(i, 1);
    Items.save(this.inventory);
    this.refreshBag();
    this.refreshCredits();
    this.feedback('salvaged ' + Items.name(item) + ' +' + this.fmtC(v) + ' credits', RARITIES[item.r].color);
    Sfx.blip();
  }

  // --- bag & shop panels (game freezes while open) ---

  toggleMenu(which) {
    // Festivals run their own short timer and swap the whole prompt UI; keep the
    // bag/shop out of them. Everywhere else the menu is allowed — but the main
    // countdown keeps ticking while it's open (see update), so it is no longer a
    // free pause on a game whose theme is the countdown.
    if (this.over || this.dying || this.transitioning || this.paused || this.festival) return;
    if (this.menuOpen === which) return this.closeMenu();
    this.closeMenu();
    if (which === 'bag') this.openBag(-1); else this.openShop();
  }

  closeMenu() {
    if (this.menuC) this.menuC.destroy();
    this.menuC = null;
    this.menuClock = null;
    this.menuClockBar = null;
    this.menuOpen = null;
  }

  menuShell(title, note) {
    const cx = this.scale.width / 2, cy = this.scale.height / 2;
    // depth 40: above the settings gear/panel (depth 31, mounted by UI.chrome)
    // so the modal's dim covers them — otherwise the gear stayed clickable and
    // its panel opened on top of the bag/shop window. Still below the pause
    // overlay (depth 50). The dim also swallows clicks aimed at the gear beneath.
    const c = this.add.container(0, 0).setDepth(40);
    const dim = this.add.rectangle(cx, cy, this.scale.width, this.scale.height, 0x000000, 0.7)
      .setInteractive();
    dim.on('pointerdown', () => this.closeMenu());
    c.add(dim);
    const win = this.add.rectangle(cx, cy, 720, 430, IDE.panel).setStrokeStyle(2, IDE.border)
      .setInteractive();
    c.add(win);
    c.add(this.add.text(cx, cy - 190, title, {
      fontFamily: 'monospace', fontSize: '22px', color: IDE.white, fontStyle: 'bold'
    }).setOrigin(0.5));
    c.add(this.add.text(cx, cy - 164, note, {
      fontFamily: 'monospace', fontSize: '13px', color: IDE.dim
    }).setOrigin(0.5));
    const close = this.add.text(cx + 340, cy - 195, '[X]', {
      fontFamily: 'monospace', fontSize: '18px', color: IDE.error
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    close.on('pointerdown', () => this.closeMenu());
    c.add(close);
    // the countdown does NOT stop for the menu — show it here so the cost of
    // browsing is honest (update() keeps this in sync each frame)
    const mcs = Math.ceil(this.timeLeft);
    this.menuClock = this.add.text(cx - 340, cy - 195,
      '⏱ CLOCK RUNNING · ' + mcs + 's', {
        fontFamily: 'monospace', fontSize: '13px',
        color: mcs <= 10 ? IDE.error : '#dcdcaa', fontStyle: 'bold'
      }).setOrigin(0, 0.5);
    c.add(this.menuClock);
    // a thin draining bar under the text — reads the clock's fall at a glance
    // while shopping, without having to parse the number. Full width ≈ a fresh
    // START_TIME clock; update() shrinks it per frame and recolors it sub-10s.
    const barW = 150;
    c.add(this.add.rectangle(cx - 340, cy - 180, barW, 5, IDE.border).setOrigin(0, 0.5));
    this.menuClockBar = this.add.rectangle(cx - 340, cy - 180,
      barW * Phaser.Math.Clamp(this.timeLeft / START_TIME, 0, 1), 5,
      mcs <= 10 ? 0xf44747 : 0xdcdcaa).setOrigin(0, 0.5);
    this.menuClockBar._fullW = barW;
    c.add(this.menuClockBar);
    this.menuC = c;
    return c;
  }

  openBag(selected) {
    this.menuOpen = 'bag';
    const cx = this.scale.width / 2, cy = this.scale.height / 2;
    const c = this.menuShell('INVENTORY  (' + this.inventory.length + '/' + INV_MAX + ')',
      'click an item, then USE it or SALVAGE it for credits · ESC closes');

    const cols = 6, size = 78;
    const x0 = cx - (cols - 1) * size / 2;
    for (let i = 0; i < INV_MAX; i++) {
      const x = x0 + (i % cols) * size, y = cy - 108 + Math.floor(i / cols) * size;
      const item = this.inventory[i];
      const slot = this.add.rectangle(x, y, 64, 64, 0x1c1c1d)
        .setStrokeStyle(2, item ? RARITIES[item.r].tint : IDE.border);
      c.add(slot);
      if (item) {
        if (i === selected) slot.setStrokeStyle(3, 0xffffff);
        c.add(this.add.image(x, y - 6, ITEM_TYPES[item.t].tex).setScale(1.6));
        c.add(this.add.text(x, y + 22, RARITIES[item.r].name.slice(0, 4), {
          fontFamily: 'monospace', fontSize: '10px', color: RARITIES[item.r].color
        }).setOrigin(0.5));
        slot.setInteractive({ useHandCursor: true });
        slot.on('pointerdown', () => { this.closeMenu(); this.openBag(i); });
      }
    }

    const item = this.inventory[selected];
    if (item) {
      c.add(this.add.text(cx - 330, cy + 78, Items.name(item), {
        fontFamily: 'monospace', fontSize: '18px', color: RARITIES[item.r].color, fontStyle: 'bold'
      }).setOrigin(0, 0.5));
      c.add(this.add.text(cx - 330, cy + 104, Items.desc(item), {
        fontFamily: 'monospace', fontSize: '14px', color: IDE.text
      }).setOrigin(0, 0.5));
      const use = this.add.text(cx + 120, cy + 90, '[ USE ]', {
        fontFamily: 'monospace', fontSize: '18px', color: IDE.comment, fontStyle: 'bold'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      use.on('pointerdown', () => { this.useItem(selected); this.closeMenu(); this.openBag(-1); });
      c.add(use);
      const salv = this.add.text(cx + 260, cy + 90, '[ SALVAGE +' + this.fmtC(RARITIES[item.r].salvage) + ' ]', {
        fontFamily: 'monospace', fontSize: '16px', color: IDE.stringy
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      salv.on('pointerdown', () => { this.salvageItem(selected); this.closeMenu(); this.openBag(-1); });
      c.add(salv);
    } else if (this.inventory.length === 0) {
      c.add(this.add.text(cx, cy + 90, 'no items yet — monsters drop loot when slain', {
        fontFamily: 'monospace', fontSize: '14px', color: IDE.dim
      }).setOrigin(0.5));
    }
    c.add(this.add.text(cx - 330, cy + 160, 'CREDITS ' + this.fmtC(this.credits) + '/' + CREDIT_MAX, {
      fontFamily: 'monospace', fontSize: '15px', color: IDE.text
    }).setOrigin(0, 0.5));
  }

  openShop() {
    this.menuOpen = 'shop';
    const cx = this.scale.width / 2, cy = this.scale.height / 2;
    const stock = Items.shopStock();
    const c = this.menuShell('SHOP — ' + stock.day, 'new stock every day · bought items go to your bag · ESC closes');

    // A full bag auto-salvages incoming loot for a fraction of its value — fine
    // for a random drop, but a paid purchase would then charge full price and
    // hand back only the salvage crumbs. Block BUY when the bag is full instead.
    const full = this.inventory.length >= INV_MAX;

    stock.items.forEach((item, i) => {
      const x = cx - 255 + i * 170, y = cy - 40;
      const sold = stock.sold.includes(i);
      const card = this.add.rectangle(x, y, 150, 190, 0x1c1c1d)
        .setStrokeStyle(2, sold ? IDE.border : RARITIES[item.r].tint);
      c.add(card);
      c.add(this.add.image(x, y - 60, ITEM_TYPES[item.t].tex).setScale(2).setAlpha(sold ? 0.3 : 1));
      c.add(this.add.text(x, y - 24, RARITIES[item.r].name, {
        fontFamily: 'monospace', fontSize: '13px', color: RARITIES[item.r].color, fontStyle: 'bold'
      }).setOrigin(0.5).setAlpha(sold ? 0.4 : 1));
      c.add(this.add.text(x, y - 6, ITEM_TYPES[item.t].label, {
        fontFamily: 'monospace', fontSize: '14px', color: IDE.text
      }).setOrigin(0.5).setAlpha(sold ? 0.4 : 1));
      c.add(this.add.text(x, y + 30, ITEM_TYPES[item.t].desc(item.r), {
        fontFamily: 'monospace', fontSize: '11px', color: IDE.dim,
        align: 'center', wordWrap: { width: 136 }
      }).setOrigin(0.5).setAlpha(sold ? 0.4 : 1));
      const price = RARITIES[item.r].price;
      const afford = this.credits >= price;
      const btn = this.add.text(x, y + 74,
        sold ? 'SOLD' : (full ? 'BAG FULL' : '[ BUY ' + price + ' ]'), {
          fontFamily: 'monospace', fontSize: '15px', fontStyle: 'bold',
          color: sold ? IDE.dim : (full || !afford ? IDE.error : IDE.comment)
        }).setOrigin(0.5);
      if (!sold && !full && afford) {
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => {
          this.credits -= price;
          Items.markSold(stock, i);
          this.addItem(item, true);
          this.refreshCredits();
          this.closeMenu();
          this.openShop();
        });
      }
      c.add(btn);
    });
    c.add(this.add.text(cx, cy + 160, 'CREDITS ' + this.fmtC(this.credits) + '/' + CREDIT_MAX, {
      fontFamily: 'monospace', fontSize: '15px', color: IDE.text
    }).setOrigin(0.5));
  }

  // --- level flow ---

  // Persist the furthest section reached so a later run can resume from it.
  // Monotonic: never moves the checkpoint backward. Skipped for daily runs and
  // for the post-final index (langIndex === LANGUAGES.length, i.e. boss pending).
  saveCheckpoint() {
    if (this.daily) return;
    if (this.langIndex >= LANGUAGES.length) return;
    const p = (this.stageIndex + this.survivalLap) * LANGUAGES.length + this.langIndex;
    let prev = null;
    try { prev = JSON.parse(localStorage.getItem('los_ckpt') || 'null'); } catch (e) {}
    if (prev && (prev.p || 0) >= p) return;
    try {
      localStorage.setItem('los_ckpt', JSON.stringify({
        p, stageIndex: this.stageIndex, lap: this.survivalLap, langIndex: this.langIndex
      }));
    } catch (e) {}
  }

  levelUp() {
    const fromIdx = this.langIndex;
    // Perfect clear: no wrong patterns typed this level. Reward the precision
    // (the whole game is a typing test) with extra time/score/credits on top of
    // the normal level bonus. perfectScore rises with the stage/lap so it stays
    // meaningful as targets grow. Reset the counter for the next level.
    const perfect = this.levelMistakes === 0;
    const perfectScore = perfect ? 50 + (this.stageIndex + this.survivalLap) * 25 : 0;
    this.levelMistakes = 0;
    this.langIndex++;
    this.saveCheckpoint();   // clearing a language (e.g. HTML -> CSS) is a checkpoint
    this.score = 0;   // per-level progress resets; the HUD keeps showing runScore
    this.found.clear();
    this.recent = [];
    this.recentText.setText('');
    this.hintText.setText('');
    this.feedbackText.setText('');
    this.timeLeft += LEVELUP_TIME_BONUS;
    if (perfect) {
      this.timeLeft += PERFECT_TIME_BONUS;
      this.addScore(perfectScore);
      this.gainCredits(PERFECT_CREDIT);
      this.refreshCredits();
    }
    this.strikeTimer = 0;
    this.cameras.main.shake(250, 0.006);
    Sfx.win();
    this.transitioning = true;
    this.battle.ulti(() => this.afterUlti(fromIdx, perfect, perfectScore));
  }

  afterUlti(fromIdx, perfect, perfectScore) {
    if (this.langIndex >= LANGUAGES.length) {
      // the level that fills the road (bonus already banked in levelUp) goes
      // straight to the boss — flash the perfect callout over the live field.
      if (perfect) this.floatText('PERFECT LEVEL!  +' + perfectScore);
      this.startBoss();
      return;
    }
    this.showPath(fromIdx, () => {
      this.transitioning = false;
      this.refreshLangHud();
      if (this.rand() < FESTIVAL_CHANCE) {
        this.startFestival(this.rand() < 0.5 ? 'sw' : 'growth');
      }
    }, perfect, perfectScore);
  }

  // --- boss fight at the end of every stage ---

  startBoss() {
    this.transitioning = false;
    const hp = 12 + this.stageIndex * 3;
    this.bossMode = { hp, max: hp, lang: this.pickFrom(LANGUAGES) };
    this.found.clear();
    this.timeLeft += 10;
    this.strikeTimer = 0;
    this.battle.spawnBoss();
    this.refreshLangHud();
    this.feedback('BOSS FIGHT! type ' + this.bossMode.lang.name + ' patterns!', IDE.error);
    this.cameras.main.shake(200, 0.005);
    Sfx.hit();
  }

  beatBoss() {
    this.transitioning = true;
    this.bossMode = null;
    this.langIndex = 0;
    this.levelMistakes = 0;   // the fresh stage's first level starts clean
    this.found.clear();   // boss words must not carry into the fresh level
    // Cushion the victory: a boss can be beaten with ~1s left, and the next
    // stage restarts at langIndex 0 with higher targets and a new monster — so
    // without a floor you're dumped into a harder stage at near-death, an
    // instant, unfair-feeling loss. Give at least BOSS_WIN_TIME to settle in.
    if (this.timeLeft < BOSS_WIN_TIME) this.timeLeft = BOSS_WIN_TIME;
    if (this.stageIndex < STAGES.length - 1) this.stageIndex++;
    else this.survivalLap++;
    this.saveCheckpoint();   // reaching a new stage is a checkpoint
    this.cameras.main.shake(350, 0.01);
    Sfx.win();
    this.battle.bossDie(() => {
      this.showStage(() => {
        this.transitioning = false;
        this.battle.clearBoss();
        this.refreshLangHud();
      });
    });
  }

  showPath(fromIdx, done, perfect, perfectScore) {
    const cx = this.scale.width / 2, cy = 250;
    const spacing = 230;

    const overlay = this.add.container(0, 0).setDepth(20).setAlpha(0);
    overlay.add(this.add.rectangle(cx, this.scale.height / 2,
      this.scale.width, this.scale.height, IDE.bg, 0.93));
    overlay.add(this.add.text(cx, 120, '// level cleared ✓ — the language road', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.comment
    }).setOrigin(0.5));
    // perfect-clear banner on the (fully visible) level-clear screen — the
    // numeric bonus is already banked in levelUp; this is the celebration.
    if (perfect) {
      const pf = this.add.text(cx, 152,
        '★ PERFECT LEVEL — no mistakes!  +' + perfectScore + ' pts · +' +
        PERFECT_TIME_BONUS + 's · +' + PERFECT_CREDIT + ' credits', {
          fontFamily: 'monospace', fontSize: '15px', color: '#dcdcaa', fontStyle: 'bold'
        }).setOrigin(0.5);
      overlay.add(pf);
      this.tweens.add({ targets: pf, scale: 1.12, duration: 450, yoyo: true, repeat: -1 });
    }

    const strip = this.add.container(cx, cy);
    overlay.add(strip);

    const mkNode = (idx, x, alpha) => {
      const lang = LANGUAGES[idx];
      const node = this.add.container(x, 0).setAlpha(alpha);
      const color = Phaser.Display.Color.HexStringToColor(lang.color).color;
      const box = this.add.rectangle(0, 0, 170, 64, IDE.panel).setStrokeStyle(2, color);
      node.add(box);
      node.add(this.add.text(0, -14, 'LEVEL ' + (idx + 1), {
        fontFamily: 'monospace', fontSize: '12px', color: IDE.dim
      }).setOrigin(0.5));
      node.add(this.add.text(0, 8, lang.name, {
        fontFamily: 'monospace', fontSize: '18px', color: lang.color, fontStyle: 'bold'
      }).setOrigin(0.5));
      node.add(UI.badge(this, 0, 66, lang, 20));
      node.box = box;
      strip.add(node);
      return node;
    };

    const prev = fromIdx > 0 ? mkNode(fromIdx - 1, -spacing, 0.55) : null;
    if (prev) prev.box.setStrokeStyle(2, IDE.greenHex);
    const cur = mkNode(fromIdx, 0, 1);
    cur.box.setStrokeStyle(3, 0xffffff);
    const next = mkNode(fromIdx + 1, spacing, 0.45);

    this.tweens.add({ targets: overlay, alpha: 1, duration: 400 });

    this.time.delayedCall(1000, () => {
      cur.box.setStrokeStyle(3, IDE.greenHex);
      cur.add(this.add.text(70, -24, '✓', {
        fontFamily: 'monospace', fontSize: '22px', color: IDE.comment, fontStyle: 'bold'
      }).setOrigin(0.5));
      Sfx.pickup();
    });

    this.time.delayedCall(2200, () => {
      const incoming = fromIdx + 2 < LANGUAGES.length
        ? mkNode(fromIdx + 2, spacing * 2, 0) : null;
      const slide = { x: '-=' + spacing, duration: 1000, ease: 'Cubic.easeInOut' };
      this.tweens.add({ targets: [cur, next], ...slide });
      if (prev) this.tweens.add({ targets: prev, ...slide, alpha: 0 });
      if (incoming) this.tweens.add({ targets: incoming, ...slide, alpha: 0.45 });
      this.tweens.add({ targets: cur, alpha: 0.55, duration: 1000 });
      this.tweens.add({
        targets: next, alpha: 1, duration: 1000,
        onComplete: () => {
          next.box.setStrokeStyle(3, 0xffffff);
          this.tweens.add({ targets: next, scale: 1.08, duration: 150, yoyo: true });
          Sfx.hint();
        }
      });
    });

    this.time.delayedCall(4600, () => {
      this.tweens.add({
        targets: overlay, alpha: 0, duration: 400,
        onComplete: () => { overlay.destroy(); done(); }
      });
    });
  }

  showStage(done) {
    const cx = this.scale.width / 2, cy = this.scale.height / 2;
    const stage = STAGES[this.stageIndex];

    const overlay = this.add.container(0, 0).setDepth(20).setAlpha(0);
    overlay.add(this.add.rectangle(cx, cy, this.scale.width, this.scale.height, IDE.bg, 0.95));
    overlay.add(this.add.text(cx, cy - 80, '// all ' + LANGUAGES.length + ' languages cleared ✓', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.comment
    }).setOrigin(0.5));
    const title = this.survivalLap > 0
      ? 'SURVIVAL — LAP ' + (this.survivalLap + 1)
      : 'STAGE: ' + stage.name;
    overlay.add(this.add.text(cx, cy - 20, title, {
      fontFamily: 'monospace', fontSize: '44px', color: '#dcdcaa', fontStyle: 'bold'
    }).setOrigin(0.5));
    overlay.add(this.add.text(cx, cy + 40, 'targets rise — good luck!', {
      fontFamily: 'monospace', fontSize: '16px', color: IDE.dim
    }).setOrigin(0.5));

    this.tweens.add({ targets: overlay, alpha: 1, duration: 400 });
    Sfx.win();
    this.time.delayedCall(3200, () => {
      this.tweens.add({
        targets: overlay, alpha: 0, duration: 400,
        onComplete: () => { overlay.destroy(); done(); }
      });
    });
  }

  // --- festivals ---

  startFestival(type) {
    const cx = this.scale.width / 2;
    const pool = this.shuffle(LANGUAGES.slice()).slice(0, 6);

    const c = this.add.container(0, 0).setDepth(5).setAlpha(0);
    c.add(this.add.text(cx, 150,
      type === 'sw' ? '★ SOFTWARE FESTIVAL ★' : '★ GROWTH FESTIVAL ★', {
        fontFamily: 'monospace', fontSize: '22px', color: '#dcdcaa', fontStyle: 'bold'
      }).setOrigin(0.5));
    const spacing = 56, x0 = cx - (pool.length - 1) * spacing / 2;
    const badges = pool.map((lang, i) => {
      const b = UI.badge(this, x0 + i * spacing, 198, lang, 18);
      c.add(b);
      return b;
    });
    const prompt = this.add.text(cx, 234, '', {
      fontFamily: 'monospace', fontSize: '16px', color: IDE.text, fontStyle: 'bold'
    }).setOrigin(0.5);
    c.add(prompt);
    // the main clock keeps draining under the festival now (see update) — this
    // in-banner readout warns that, and shows how long the round itself lasts.
    const clock = this.add.text(cx, 262, '', {
      fontFamily: 'monospace', fontSize: '13px', color: IDE.error, fontStyle: 'bold'
    }).setOrigin(0.5);
    c.add(clock);
    this.tweens.add({ targets: c, alpha: 1, duration: 300 });

    this.festival = {
      type, pool, badges, prompt, clock, container: c,
      lang: null, word: null, used: new Set(),
      usedByLang: new Map(pool.map(l => [l.name, new Set()])),
      // the growth festival's typedColor() matches what you type against every
      // pooled language's name/abbr; the pool is fixed for the round, so build
      // the lookup once here instead of flatMap-ing a fresh array each keystroke.
      names: pool.flatMap(l => [l.name.toLowerCase(), l.abbr.toLowerCase()]),
      timeLeft: FESTIVAL_TIME, count: 0, clockSec: -1
    };

    this.battle.setVisible(false);
    this.langText.setText(type === 'sw' ? 'SOFTWARE FESTIVAL' : 'GROWTH FESTIVAL')
      .setColor('#dcdcaa');
    if (this.langBadge) { this.langBadge.destroy(); this.langBadge = null; this._badgeKey = null; }
    this.progressFill.width = 0;
    this.typed = '';
    this.refreshInput();
    this.refreshCredits();
    if (type === 'sw') this.pickFestivalLang(); else this.pickGrowthRound();
    Sfx.win();
  }

  pickFestivalLang() {
    const f = this.festival;
    const i = Math.floor(this.rand() * f.pool.length);
    f.lang = f.pool[i];
    f.badges.forEach((b, j) => {
      this.tweens.add({
        targets: b, scale: j === i ? 1.35 : 1, alpha: j === i ? 1 : 0.4, duration: 200
      });
    });
    f.prompt.setText('type a ' + f.lang.name + ' pattern!').setColor(f.lang.color);
    this.refreshInput();
  }

  pickGrowthRound() {
    const f = this.festival;
    let lang = null, word = null, guard = 0;
    while (!word && ++guard < 25) {
      lang = this.pickFrom(f.pool);
      const unique = lang.words.filter(w =>
        !f.used.has(w) && f.pool.every(o => o === lang || !o.words.includes(w)));
      if (unique.length) word = this.pickFrom(unique);
    }
    if (!word) { this.endFestival(); return; }
    f.lang = lang;
    f.word = word;
    f.used.add(word);
    f.badges.forEach(b => {
      this.tweens.add({ targets: b, scale: 1, alpha: 1, duration: 200 });
    });
    f.prompt.setText('"' + word + '" → type its language!').setColor(IDE.stringy);
    this.refreshInput();
  }

  // silent=true when the festival is torn down because the main clock ran out
  // (see update's death path): skip the celebratory summary + jingle, just
  // restore the battle strip for the killing blow.
  endFestival(silent) {
    const f = this.festival;
    this.festival = null;
    this.battle.setVisible(true);
    this.tweens.add({
      targets: f.container, alpha: 0, duration: 300,
      onComplete: () => f.container.destroy()
    });
    this.strikeTimer = 0;
    this.typed = '';
    this.refreshInput();
    this.refreshLangHud();
    this.refreshCredits();
    if (silent) return;
    this.feedback('festival over — ' + f.count + ' answers, +' +
      (f.count * FESTIVAL_CREDIT) + ' credits', '#dcdcaa');
    Sfx.hint();
  }

  // --- hints ---

  buyHint() {
    if (this.paused || this.over || this.dying || this.transitioning || this.menuOpen) return;
    const free = this.hintTokens > 0;
    const cost = free ? 0 : this.hintCost;
    if (this.credits < cost) {
      this.feedback('not enough credits (' + cost + ' needed)', IDE.error);
      Sfx.wrong();
      return;
    }

    let w;
    if (this.festival && this.festival.type === 'growth') {
      w = this.festival.lang.name.toLowerCase();
    } else {
      const remaining = this.activeLang.words.filter(x => !this.activeFound.has(x));
      if (remaining.length === 0) return;
      w = Phaser.Utils.Array.GetRandom(remaining);
    }

    if (free) this.hintTokens--; else this.credits -= cost;
    this.refreshCredits();
    const shown = Math.ceil(w.length / 2);
    const masked = (w.slice(0, shown) + '_'.repeat(w.length - shown)).split('').join(' ');
    this.hintText.setText('// hint: ' + masked);
    this.typed = w.slice(0, shown);
    this.refreshInput();
    Sfx.hint();
    // one auto-clear at a time: buying a second hint within 6s used to leave the
    // first hint's timer pending, and it would blank the *newer* hint early when
    // it fired (same stacked-timer class as the feedback/shake fixes). Cancel the
    // previous clear before scheduling this one.
    if (this._hintClear) this._hintClear.remove(false);
    this._hintClear = this.time.delayedCall(6000, () => this.hintText.setText(''));
  }

  finish(win) {
    if (this.over) return;
    this.over = true;
    this.closeMenu();
    if (win) Sfx.win(); else Sfx.hit();
    // floor the divisor at 15s: a fast death (e.g. ~3s) must not post an absurd
    // headline wpm that the daily/PB then surface. Only clamps sub-15s runs.
    const minutes = Math.max(this.elapsed / 60, 15 / 60);
    this.scene.start('End', {
      score: this.runScore,
      words: this.wordsTyped,
      langIndex: Math.min(this.langIndex, LANGUAGES.length - 1),
      stage: STAGES[this.stageIndex].name,
      stageIndex: this.stageIndex,
      lap: this.survivalLap,
      win: win,
      wpm: Math.round(this.wordsTyped / minutes),
      acc: this.submitsTotal ? Math.round(100 * this.submitsOk / this.submitsTotal) : 100,
      maxCombo: this.maxCombo,
      loot: this.lootCount,
      daily: this.daily
    });
  }

  // --- UI helpers ---

  typedColor() {
    if (!this.typed) return IDE.text;
    const f = this.festival;
    if (f && f.type === 'growth') {
      const names = f.names;   // precomputed once at startFestival (fixed pool)
      if (names.includes(this.typed)) return IDE.keyword;
      if (names.some(n => n.startsWith(this.typed))) return IDE.text;
      return IDE.error;
    }
    if (this.activeLang.words.includes(this.typed)) {
      return this.activeFound.has(this.typed) ? IDE.dim : IDE.keyword;
    }
    if (this.activeLang.words.some(w => w.startsWith(this.typed))) return IDE.text;
    return IDE.error;
  }

  refreshInput() {
    this.inputText.setText(this.typed).setColor(this.typedColor());
    this.cursor.x = this.inputText.x + this.inputText.width + 4;
  }

  // Point the full-screen backdrop at this stage's scene_ PNG, but never render
  // Phaser's green __MISSING texture if that PNG failed to load: hide the layer
  // and let the dark editor background (config backgroundColor) show through.
  // Battle.makeTextures code-draws the battle-strip bg_ textures as a fallback,
  // but the full-screen scene_ atmosphere has none — so guard it at point of use.
  applySceneBg(type) {
    if (!this.sceneBg) return;
    const key = 'scene_' + type;
    if (this.textures.exists(key)) this.sceneBg.setTexture(key).setVisible(true);
    else this.sceneBg.setVisible(false);
  }

  refreshLangHud() {
    Sfx.setMusicTempo(94 + this.stageIndex * 8 + this.survivalLap * 4);
    if (this.bossMode) {
      this.langText.setText('BOSS · ' + this.bossMode.lang.name).setColor(IDE.error);
      // surface how many un-typed patterns remain: boss words dedupe into
      // this.found, so a player with the HP bar alone can't see a starving pool
      // coming and just eats "already typed" rejections with the clock draining.
      const left = this.bossMode.lang.words.length - this.found.size;
      this.stageText.setText('defeat the boss! HP ' + this.bossMode.hp + '/' + this.bossMode.max +
        ' · ' + left + ' patterns left');
      this.progressFill.width = 180 * Math.max(0, this.bossMode.hp / this.bossMode.max);
      this.progressFill.fillColor = 0xf44747;
      this.updateLangBadge('boss:' + this.bossMode.lang.name, this.bossMode.lang);
      return;
    }
    this.langText.setText('LEVEL ' + (this.langIndex + 1) + '/' + LANGUAGES.length + ' · ' + this.lang.name)
      .setColor(this.lang.color);
    this.stageText.setText('STAGE ' + STAGES[this.stageIndex].name +
      (this.survivalLap > 0 ? ' · LAP ' + (this.survivalLap + 1) : '') +
      ' · target ' + this.targetScore());
    this.progressFill.width = 180 * Math.min(1, this.score / this.targetScore());
    this.progressFill.fillColor = Phaser.Display.Color.HexStringToColor(this.lang.color).color;
    // Battle re-stage / re-tier only when the value changes. This method runs on
    // every correct word, and setStage() re-textures the backdrop + hero + all
    // five monsters AND destroys+recreates the demon fire-fountain emitters — so
    // the Survival fountains used to visibly reset on every keystroke, plus a
    // pile of no-op texture swaps each word on every stage. Gate both like the
    // language badge (updateLangBadge) already does.
    if (this.battle) {
      const tier = Math.floor(this.langIndex / 5);
      if (tier !== this._hudTier) { this.battle.setTier(tier); this._hudTier = tier; }
      if (this.stageIndex !== this._hudStage) {
        this.battle.setStage(this.stageIndex);
        this.applySceneBg(Battle.TYPES[this.stageIndex]);
        this._hudStage = this.stageIndex;
      }
    }
    this.updateLangBadge('lvl:' + this.langIndex, this.lang);
  }

  // The language badge is identical within a level/boss, but refreshLangHud
  // runs on every correct word — recreating a 3-object container each keystroke
  // just churns GameObjects. Rebuild only when the shown language changes; the
  // key encodes level index / boss lang so a new level or boss forces a redraw.
  updateLangBadge(key, lang) {
    if (this._badgeKey === key && this.langBadge) return;
    if (this.langBadge) this.langBadge.destroy();
    this.langBadge = UI.badge(this,
      this.scale.width - 30 - this.langText.width, 54, lang, 13);
    this._badgeKey = key;
  }

  refreshCredits() {
    this.creditText.setText('CREDITS ' + this.fmtC(this.credits) + '/' + CREDIT_MAX);
    this.hintBtn.setText(this.hintTokens > 0
      ? '[ HINT FREE ×' + this.hintTokens + ' ]'
      : '[ HINT -' + this.hintCost + ' ]');
    this.hintBtn.setAlpha(this.hintTokens > 0 || this.credits >= this.hintCost ? 1 : 0.4);
    const fx = [];
    if (this.multWords > 0) fx.push('×' + this.creditMult + ' credits (' + this.multWords + 'w)');
    if (this.deathSave > 0) fx.push('SAVE ' + this.deathSave + 's');
    this.effectText.setText(fx.join('  ·  '));
  }

  refreshBag() {
    this.bagBtn.setText('[ BAG ' + this.inventory.length + '/' + INV_MAX + ' ]');
    // Keep SHOP just past BAG's real rendered width. The fixed x=130 collides
    // with a two-digit bag count ('[ BAG 12/12 ]' reaches ~x=133), so anchor it
    // to bagBtn.width instead — robust to the count and to INV_MAX changes.
    if (this.shopBtn) this.shopBtn.x = this.bagBtn.x + this.bagBtn.width + 14;
  }

  pushRecent(w) {
    this.recent.push(w);
    if (this.recent.length > 8) this.recent.shift();
    this.recentText.setText('// ' + this.recent.join('  '));
  }

  feedback(msg, color) {
    // one fade at a time: rapid feedback (e.g. a wrong-word streak) would
    // otherwise stack alpha tweens on this shared label — an older one firing
    // mid-message fades the newest text out early. Kill any in-flight fade first.
    this.tweens.killTweensOf(this.feedbackText);
    this.feedbackText.setText(msg).setColor(color).setAlpha(1);
    this.tweens.add({ targets: this.feedbackText, alpha: 0, delay: 1500, duration: 500 });
  }

  floatText(msg) {
    // recycle the next pooled popup instead of spawning a new Text per word.
    // Kill any in-flight tween on it first (a still-rising one from a fast streak)
    // so the reset position/alpha takes cleanly.
    const t = this._floatPool[this._floatIdx];
    this._floatIdx = (this._floatIdx + 1) % this._floatPool.length;
    this.tweens.killTweensOf(t);
    t.setText(msg).setPosition(this.panel.x, this.panel.y - 50).setAlpha(1);
    this.tweens.add({ targets: t, y: t.y - 40, alpha: 0, duration: 900 });
  }

  flashPanel(color) {
    this.panel.setStrokeStyle(2, color);
    this.time.delayedCall(250, () => {
      if (!this.over) this.panel.setStrokeStyle(2, IDE.border);
    });
  }

  shakePanel() {
    this.panel.setStrokeStyle(2, 0xf44747);
    this.time.delayedCall(250, () => {
      if (!this.over) this.panel.setStrokeStyle(2, IDE.border);
    });
    // The shake is a relative '+=6' yoyo. A second one started before the first
    // finishes captures its start mid-offset and yoyos back to THAT, leaving a
    // permanent x-drift on the panel/input/cursor after a fast wrong-word streak.
    // One shake at a time — the in-flight one is already all the feedback needed.
    if (this._shaking) return;
    this._shaking = true;
    this.tweens.add({
      targets: [this.panel, this.inputText, this.cursor],
      x: '+=6', duration: 40, yoyo: true, repeat: 3,
      onComplete: () => { this._shaking = false; }
    });
  }

  togglePause() {
    if (this.over || this.transitioning || this.menuOpen) return;
    this.paused = !this.paused;
    this.pauseUI.setVisible(this.paused);
    this.time.paused = this.paused;
    this.tweens.timeScale = this.paused ? 0 : 1;
    // the chiptune is a raw setInterval, not a scene timer, so freeze/thaw it
    // explicitly — otherwise it plays on through the pause.
    if (this.paused) Sfx.pauseMusic(); else Sfx.resumeMusic();
  }

  // Bail from a paused run back to the main menu. The scene shutdown handler
  // stops the (paused) music; the checkpoint of the furthest section reached is
  // already persisted on each level/stage clear, so CONTINUE still works.
  quitToMenu() {
    // We are leaving a PAUSED run: togglePause() set this.time.paused = true.
    // Phaser reuses the scene's Clock across restarts, and Clock.start() (which
    // fires on every restart) re-registers its listeners but never clears
    // `paused` — only the constructor does, on first boot. Left true, the NEXT
    // GameScene run keeps every this.time.delayedCall frozen: the level-up/boss
    // transition completion callbacks (battle.ulti), the hint auto-clear, the
    // panel flash/shake resets — the first level-up would soft-lock. Clear it on
    // the way out. (TweenManager.start() DOES reset timeScale, so tweens recover
    // on their own; reset it too for symmetry — harmless.)
    this.time.paused = false;
    this.tweens.timeScale = 1;
    Sfx.blip();
    this.scene.start('Menu');
  }

  update(_, delta) {
    if (this.paused || this.over || this.transitioning || this.dying) return;
    this.elapsed += delta / 1000;

    // the bag/shop no longer freezes the countdown — but it can't open during a
    // festival, and while it's up the field is covered, so hold the cosmetic
    // strikes (they'd play out of sight and desync) and mirror the clock in-menu.
    const inMenu = !!this.menuOpen;

    // A festival is a bounded bonus ROUND, not a free pause. Its own short timer
    // decides when it ends, but the main countdown keeps draining underneath
    // (the big timer below shows it with the usual low-time warnings), so the
    // +2s/answer is now a real race to offset the drain instead of pure upside —
    // and you can die mid-festival if you stall. Its own remaining time and a
    // "clock runs" warning sit in the banner.
    if (this.festival) {
      this.festival.timeLeft -= delta / 1000;
      if (this.festival.timeLeft <= 0) { this.endFestival(); return; }
      // Text.setText re-rasters the glyph texture on every call, but the shown
      // integer only steps once per second — so skip the ~59/60 frames where the
      // ceil second is unchanged (same gate the big timer / in-menu clock use).
      const fs = Math.ceil(this.festival.timeLeft);
      if (fs !== this.festival.clockSec) {
        this.festival.clockSec = fs;
        this.festival.clock.setText('⏱ clock runs — festival ends in ' + fs + 's');
      }
    }

    // every few seconds the front monster lands a (non-lethal) hit — but hold
    // these while the field is covered (behind a menu, or under the festival
    // banner where the battle strip is hidden), so they don't play out of sight
    // and desync the strike-state machine.
    const holdStrikes = inMenu || !!this.festival;
    if (!holdStrikes) {
      this.strikeTimer += delta / 1000;
      if (this.strikeTimer >= (this.bossMode ? 6 : ENEMY_STRIKE_EVERY)) {
        this.strikeTimer = 0;
        this.battle.enemyStrike(false);
      }
    }

    this.timeLeft -= delta / 1000;
    if (this.timeLeft <= 0) {
      // armor's death save gets one chance before the monsters do
      if (this.deathSave > 0) {
        this.timeLeft = this.deathSave;
        this.deathSave = 0;
        if (inMenu) this.closeMenu();
        this.refreshCredits();
        this.feedback('your ARMOR saved you! +' + Math.ceil(this.timeLeft) + 's', '#dcdcaa');
        this.flashPanel(0xdcdcaa);
        Sfx.win();
        return;
      }
      if (inMenu) this.closeMenu();
      // the festival can no longer hide death: tear its banner down (quietly)
      // so the battle strip is back on screen for the killing blow.
      if (this.festival) this.endFestival(true);
      this.timeLeft = 0;
      this.timerText.setText('0');
      this.dying = true;
      this.cameras.main.shake(300, 0.01);
      this.cameras.main.flash(400, 140, 30, 30);
      Sfx.hit();
      this.battle.defeat(() => this.finish(false));
      return;
    }

    const s = Math.ceil(this.timeLeft);
    // setText re-renders the glyph texture on every call, but the shown integer
    // only changes once per second — so skip the ~59/60 frames where it's
    // unchanged (same reasoning as the low-time recolor gate below). The
    // per-frame scale pulse still runs while low; setScale only transforms, it
    // doesn't re-raster the text.
    if (s !== this._lastShownSec) {
      this._lastShownSec = s;
      this.timerText.setText(String(s));
      // live WPM in the status bar — refreshed once/sec, same 15s-floor divisor
      // as the end-screen headline so a fast early run can't post an absurd rate.
      if (this.wordsTyped > 0 && this.elapsed > 2) {
        const wpm = Math.round(this.wordsTyped / Math.max(this.elapsed / 60, 15 / 60));
        this.statusRight.setText(this._statusBase + ' · ' + wpm + ' wpm');
      }
      if (inMenu && this.menuClock) {
        this.menuClock.setText('⏱ CLOCK RUNNING · ' + s + 's')
          .setColor(s <= 10 ? IDE.error : '#dcdcaa');
        // recolor the bar with the text (once/sec) — rect fillColor, no re-raster
        if (this.menuClockBar) this.menuClockBar.fillColor = s <= 10 ? 0xf44747 : 0xdcdcaa;
      }
    }
    // shrink the in-menu clock bar every frame (transform only — cheap) so the
    // drain reads smoothly, even though the text number only steps once a second.
    if (inMenu && this.menuClockBar) {
      this.menuClockBar.width = this.menuClockBar._fullW *
        Phaser.Math.Clamp(this.timeLeft / START_TIME, 0, 1);
    }
    // Phaser's Text.setColor re-renders the glyph texture on every call, even
    // when the color is unchanged — so recolor the big timer only when it
    // crosses the 10s line, not 60x/second for the whole (mostly >10s) run.
    const low = s <= 10;
    if (low !== this._timerLow) {
      this._timerLow = low;
      this.timerText.setColor(low ? IDE.error : IDE.text);
      // Leaving the low zone (level-up / boss / potion refilled the clock) also
      // clears the tick memory: otherwise, if the last tick before the refill
      // fired at s=10 and the clock drains back to exactly 10, s === lastTickSecond
      // and that re-entry second's tick is silently swallowed. Reset so the first
      // second back under 10 always ticks.
      if (!low) { this.timerText.setScale(1); this.warnFrame.setAlpha(0); this.lastTickSecond = -1; }
    }
    if (low) {
      this.timerText.setScale(1 + (this.timeLeft % 1) * 0.15);
      // edge frame ramps 0→1 over the last 10s, pulsing faster as it tightens
      const intensity = Phaser.Math.Clamp((10 - this.timeLeft) / 10, 0, 1);
      const pulse = 0.7 + 0.3 * Math.sin(this.time.now / (70 + s * 12));
      this.warnFrame.setAlpha(intensity * 0.55 * pulse);
      if (s !== this.lastTickSecond) {
        this.lastTickSecond = s;
        Sfx.tick();
      }
    }
  }
}
