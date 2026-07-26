// GameScene — the core loop: a text panel in the middle, a countdown at the
// top, the battle strip in between. Type the current language's patterns
// before the clock hits zero; every correct word = a sword hit, score, time
// and credits. Clearing the road raises the STAGE. Monsters drop loot by
// chance (more at higher stages, +20% during festivals): sword (credit
// multiplier), armor (death save), potion (time), scroll (free hints),
// treasure (credits). Items live in a persistent BAG with a salvage option,
// and a daily SHOP sells four rotating items for credits.

const HINT_COST = 20;
// Seconds between hints. The button is the paid, precise assist (you choose the
// moment, you pay for it, you still type the word); ASSIST is the free, rationed
// one. Without a cooldown the paid one made the rationed one pointless.
const HINT_COOLDOWN = 8;
const FESTIVAL_HINT_COST = 10;
const CREDIT_PER_WORD = 5;
// There is no credit ceiling any more. The old CREDIT_MAX = 100 quietly threw
// away everything you earned past it -- and since a single hint costs 20, the
// cap meant a good run spent most of its typing earning money that was deleted
// on arrival. It also made the new expandable bag slots unbuyable at the top
// end. Credits are now a real currency: they accumulate, and the things worth
// saving for decide the ceiling.
const START_TIME = 75;
// how many patterns the post-level code-review card explains. Five is what fits
// the panel at a readable size, and roughly what anyone absorbs in the few
// seconds this sits between two levels of a timed run.
const LEARN_CARD_MAX = 5;
// Seconds handed over on entering a boss. The fight opens on whatever clock the
// last level left, which can be almost nothing, and the boss pool is every
// language at once — so this is the knob that decides whether the fight is hard
// or simply unlucky. Raised from 10 when bosses were reported as too hard on
// MEDIUM; BOSS_WIN_TIME (the floor on the way OUT) is a separate rescue.
const BOSS_ENTRY_TIME = 18;
// Hard ceiling on the countdown. Every landed word buys time and the gains beat
// the drain, so a competent run used to snowball past an hour on the clock
// (measured: 3600s+ after ~1600 words) — at which point the countdown, the whole
// theme, stops being a threat. Capping it keeps the number in two digits and
// turns surplus time into pressure to SPEND it (push the level, not bank it).
// Rescue floors (boss win, festival start, armor save) set timeLeft directly and
// sit well under the cap, so they're unaffected.
const TIME_CAP = 99;
const LEVELUP_TIME_BONUS = 10;
const PERFECT_TIME_BONUS = 5;     // clearing a level with zero wrong patterns
const PERFECT_CREDIT = 10;
const BOSS_WIN_TIME = 25;        // clock floor after clearing a boss (fresh stage)
const MAX_TYPED = 24;
const FESTIVAL_CHANCE = 0.35;
const FESTIVAL_TIME = 20;
const FESTIVAL_MIN_TIME = 15;    // clock floor when a festival starts — mirrors
                                  // BOSS_WIN_TIME; the main clock still drains
                                  // DURING the round (that risk is intentional),
                                  // this only stops it opening already-critical
const FESTIVAL_CREDIT = 15;
const FESTIVAL_TIME_BONUS = 2;
const ENEMY_STRIKE_EVERY = 10;   // seconds between the front monster's hits
// ASSIST (see ui.js) is a rope thrown to a drowning player. Drowning means the
// clock is nearly out, OR nothing has landed in a while (you're staring at a
// language you've never written).
//
// The rate limit is the whole design. Without it — the first cut refreshed the
// shelf whenever you were idle, and under SOS_TIME it simply never left — you
// could clear a level by DOING NOTHING: wait, read the free words, type them,
// wait again. The words bought back roughly the time the waiting cost, so
// stalling was a viable strategy, which is the exact opposite of what a game
// about a countdown should reward.
//
// So: ONE pattern, at most once every SOS_COOLDOWN seconds of play, and always
// one of the shortest left (fewest points, since score scales with length).
// Waiting for the next rope costs 40 seconds of clock and returns about two.
// Nobody farms that. It exists so a player who cannot produce a single Haskell
// keyword still gets shown one, occasionally, instead of dying blind.
// DEPRECATION — the theme, inside the mechanic instead of next to it.
//
// A countdown clock is the most literal reading of "Count Down" there is. This
// is the other one: the POOL counts down too. Every DEPRECATE_EVERY seconds one
// pattern you haven't written yet is put on notice, and DEPRECATE_WARN seconds
// later it is gone — permanently unwritable for the rest of the level. The game
// is called Life of Software; software's actual countdown is the one running
// under every API you rely on. Write it before it's deprecated.
//
// Two rules keep it fair. It NEVER kills a pattern the level still needs (see
// canDeprecate): the remaining pool always stays a comfortable margin above the
// points you still owe, so this can't recreate the unreachable-target dead end.
// And it announces itself loudly, twice — a gold warning with a countdown, then
// a red obituary — because the player can't see the word list, so a silent kill
// would just be an unexplained rejection later.
const DEPRECATE_EVERY = 14;    // seconds between notices at stage 0
const DEPRECATE_FLOOR = 6;     // fastest it ever gets (SURVIVAL + laps)
const DEPRECATE_WARN = 3.5;    // grace period — type it now and it's yours
const DEPRECATE_MARGIN = 1.15; // pool must stay this many x the points still owed

const SOS_TIME = 20;       // clock at or below this = in trouble
const SOS_IDLE = 8;        // seconds since your last correct pattern
const SOS_LEN = 4;         // prefer patterns this short
const SOS_COOLDOWN = 40;   // seconds between ropes — the anti-stalling rule
const SOS_SHOW = 10;       // how long one stays on screen

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
        // The wallet comes back too. Credits are the one earned thing that is
        // pure inventory — you already keep the bag across runs (los_inv), so
        // dropping the money that bought its contents was just inconsistent.
        // Score deliberately does NOT resume: it is the measure OF a run, and
        // carrying it forward would let the same points be banked twice.
        this.credits = Math.max(0, ck.credits || 0);
      }
    }
    // The opening clock answers the prologue: +20s for someone still learning the
    // vocabulary, -10s for someone who says they write this for a living. Only
    // the ropes move — scoring is identical either way, so one PB stays one
    // number. Daily runs are excluded: a shared seed has to be a shared start.
    this.timeLeft = START_TIME + (this.daily ? 0 : Profile.startBonus);
    this.typed = '';
    this.learnKey = null;   // no stale code-review handler across a restart
    this.detailKey = null;  // ...nor a stale deep-panel handler
    this.found = new Set();
    this.comboShield = 0;       // PRISM: wrong patterns the combo survives
    this.slowUntil = 0;         // CORE: elapsed-time stamp the slow drain ends at
    this.slowFactor = 1;        // CORE: drain multiplier while slowed
    this.targetCut = 0;         // SHARD: fraction off THIS level's target (0..1)
    this.eolWards = 0;          // VAULT: deprecation notices to auto-save
    this.dead = new Set();      // patterns deprecated this level — unwritable
    this.eol = null;            // the one currently on notice, if any
    this.eolTimer = 0;
    this.deprecatedCount = 0;   // run total, for the End screen
    this.rescuedCount = 0;      // patterns written while on notice
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
    this._timerLow = false;   // tracks the big timer's low-time (<=10s) scale/frame state
    this._timerBand = 'normal';  // gates the 3-band timer recolor (normal/warn/low)
    this._lastShownSec = -1;  // last integer second painted to the timer text
    // refreshLangHud runs on EVERY correct word; these gate the expensive battle
    // re-stage / re-tier so it fires only when the value actually changes (see
    // refreshLangHud). -1 forces the first real call through.
    this._hudStage = -1;
    this._hudTier = -1;
    this._hudLabelKey = null;  // gates the per-word LEVEL/STAGE label re-raster
    this._hudBpm = -1;         // gates the per-word music-tempo set
    // gate refreshCredits()'s three setText re-rasters (runs on every landed word)
    this._creditStr = null;
    this._hintStr = null;
    this._effectStr = null;
    // gate refreshInput()'s per-KEYSTROKE setColor re-raster (the fastest churn
    // path in the game — fires on every key, not just landed words). See refreshInput.
    this._inputColor = null;
    this._comboTier = 1;      // last combo score-multiplier tier reached (juice)
    this.levelMistakes = 0;   // wrong patterns in the CURRENT normal level (perfect-clear bonus)
    this._perfectState = 'idle';  // gates the live PERFECT-pace indicator (see refreshPerfect)

    // combo + run stats
    this.combo = 0;
    this.maxCombo = 0;
    this.elapsed = 0;
    this.submitsTotal = 0;
    this.submitsOk = 0;
    this.lootCount = 0;
    this.timeBought = 0;     // total seconds your play added back to the clock (see addTime)

    // loot state
    this.inventory = Items.load();
    // boons drafted between levels (see offerBoons) — all permanent for the run
    this.boons = [];
    this.boonKey = null;      // set while a draft is on screen; onKey routes 1-3
    this.boonTime = 0;        // extra seconds per landed pattern
    this.boonCredit = 0;      // extra credits per landed pattern
    this.boonTarget = 1;      // multiplier on every level target
    this.boonEol = 0;         // extra seconds on a deprecation notice
    this.boonHint = 0;        // hint discount
    this.boonCombo = false;   // x3 combo tier at 10 instead of 15
    this.boonRefill = 0;      // seconds granted at each level start
    this._hintNextAt = 0;     // elapsed before which the hint button is recharging
    this.hintTokens = 0;
    this.creditMult = 1;
    this.multWords = 0;
    this.deathSave = 0;
    this.menuOpen = null;
    this.menuC = null;
    this.menuClock = null;
    this.menuClockBar = null;
    this.bagSel = -1;          // keyboard-selected bag slot (see menuKey/bagKey)
    this.shopStockCache = null; // the open shop's stock, for keyboard buys (shopKey)
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
    status.left.setText('type + ENTER · TAB bag/shop · ESC pause · CTRL+SPACE hint (' +
      HINT_COST + ' credits, ' + FESTIVAL_HINT_COST + ' at festivals)');
    // keep the right status handle + its base label: update() appends a live
    // WPM readout to it once per second (a typing game should show your speed).
    this.statusRight = status.right;
    this._statusBase = this.daily
      ? 'DAILY CHALLENGE — ' + new Date().toISOString().slice(0, 10)
      : 'GMTK 2026 — Count Down';
    this.statusRight.setText(this._statusBase);

    // chiptune loop; tempo rises with the stage
    Sfx.startMusic(94);
    // stopMusic tears its own layers down, but the boss bed and the low-clock
    // heartbeat are separate voices that a run can die inside — reset them by
    // hand so the End screen is never played over a boss drum or a heartbeat.
    this.events.once('shutdown', () => {
      this.sfx('setBossMode', false);
      this.sfx('setTension', 0);
      Sfx.stopMusic();
    });

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

    // live PERFECT-pace tag: lights up (green) while the CURRENT level still has
    // zero wrong patterns and you've landed at least one word, so the otherwise
    // invisible perfect-clear bonus (extra time/score/credits at levelUp) reads
    // during play — and flashes red the moment a mistake breaks it. Sits in the
    // left margin under the bag/shop row; driven by refreshPerfect().
    this.perfectText = this.add.text(16, 116, '', {
      fontFamily: 'monospace', fontSize: '13px', color: IDE.comment, fontStyle: 'bold'
    }).setOrigin(0, 0.5);

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

    // deprecation notices — directly above the input panel, the one place the
    // player is already looking, and clear of the hint/feedback lines below it.
    this.eolText = this.add.text(cx, panelY - panelH / 2 - 34, '', {
      fontFamily: 'monospace', fontSize: '16px', color: '#dcdcaa', fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false);
    // The changelog detail, on its own quieter line under the alarm.
    //
    // It started life inside the alarm sentence, which pushed that line from
    // 410px to 674px — and the credits/hint readout is RIGHT-aligned at ~780,
    // so it occupies 690..780 and the notice ran straight underneath it. The
    // alarm keeps the width it always had (it was already at the limit), and
    // the versions drop to 12px below it, where 264px of text cannot reach
    // anything. Two registers, too: the shout, then the changelog.
    this.eolVer = this.add.text(cx, panelY - panelH / 2 - 16, '', {
      fontFamily: 'monospace', fontSize: '12px', color: IDE.comment
    }).setOrigin(0.5).setVisible(false);
    this.hintText = this.add.text(cx, panelY + 62, '', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.stringy
    }).setOrigin(0.5);
    this.feedbackText = this.add.text(cx, panelY + 92, '', {
      fontFamily: 'monospace', fontSize: '15px', color: IDE.dim
    }).setOrigin(0.5);
    // ASSIST shelf — the still-unwritten patterns of the active language, dim,
    // between the feedback line (y+92) and the recent-words strip (h-44). Filters
    // to what you've typed so far, so it doubles as autocomplete: the game reads
    // as an editor, and this is the editor's suggestion list.
    this.assistText = this.add.text(cx, panelY + 120, '', {
      fontFamily: 'monospace', fontSize: '14px', color: IDE.dim
    }).setOrigin(0.5);
    this._assistStr = null;   // gates the per-keystroke re-raster
    this._lastLandAt = 0;     // elapsed at the last correct pattern (SOS trigger)
    this._sosWord = null;     // the rope currently on screen, if any
    this._sosLang = null;     // the language it belongs to (retires it on a change)
    this._sosUntil = 0;       // elapsed when it comes down
    this._sosNextAt = 0;      // elapsed before which no new rope is thrown
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
    // The button row has to fit INSIDE the Blender window art, not merely inside
    // the canvas. The panel is 560 wide against a 960 screen, so a row that
    // measured 662 sat comfortably on screen while hanging ~50px off each edge
    // of the window it is supposed to live in — which is what "the keys overflow"
    // meant. Without the PNG the whole screen is the frame, so fall back to it.
    this.pausePanelW = pPanel ? pPanel.width : this.scale.width;
    const pTitle = this.add.text(cx, pcy - 18, 'PAUSED', {
      fontFamily: 'monospace', fontSize: '46px', color: IDE.white, fontStyle: 'bold'
    }).setOrigin(0.5);
    // this run's stats so far — populated in togglePause() each time you pause, so
    // a mid-run breather doubles as a run dashboard without leaving the field or
    // reaching the End screen. Two centred lines: skill (score/wpm/accuracy) on
    // top, the run's spoils (best combo / credits banked / loot / time survived)
    // below — credits + loot were otherwise invisible until the End screen. The
    // block sits a touch lower (pcy+16) so two lines clear the 46px PAUSED title.
    this.pauseStats = this.add.text(cx, pcy + 16, '', {
      fontFamily: 'monospace', fontSize: '14px', color: '#dcdcaa',
      align: 'center', lineSpacing: 4
    }).setOrigin(0.5);
    // The pause board's controls are BUTTONS, not a legend.
    //
    // It used to be one line of text — "ESC resume · M sound: ON · A assist: ON ·
    // Q quit" — which is fine for a player who reads it and remembers four
    // letters, and useless for everyone else. Someone who paused specifically to
    // turn the sound off had to read a sentence to find out that a key they
    // cannot see does it. The keys all still work (this is a keyboard game and
    // they are faster), but every one of them is now a thing you can click, with
    // its current state written on it.
    this.pauseBtnDefs = [
      { label: () => 'RESUME  (ESC)', act: () => this.togglePause() },
      { label: () => 'SOUND: ' + (Sfx.muted ? 'OFF' : 'ON') + '  (M)',
        act: () => { Sfx.setMuted(!Sfx.muted); Sfx.blip(); } },
      { label: () => 'ASSIST: ' + (Assist.on ? 'ON' : 'OFF') + '  (A)',
        act: () => { Assist.setOn(!Assist.on); this.refreshAssist(); Sfx.blip(); } },
      { label: () => 'NOTES: ' + (Profile.learn ? 'ON' : 'OFF') + '  (L)',
        act: () => { Profile.setLearn(!Profile.learn); Sfx.blip(); } },
      { label: () => 'QUIT  (Q)', act: () => this.quitToMenu() }
    ];
    this.pauseBtns = this.pauseBtnDefs.map(() => {
      const box = this.add.rectangle(0, pcy + 54, 10, 26, 0x1c1c1d)
        .setStrokeStyle(1, IDE.border).setInteractive({ useHandCursor: true });
      const txt = this.add.text(0, pcy + 54, '', {
        fontFamily: 'monospace', fontSize: '13px', color: IDE.white
      }).setOrigin(0.5);
      return { box, txt };
    });
    this.pauseBtns.forEach((b, i) => {
      const def = this.pauseBtnDefs[i];
      b.box.on('pointerover', () => b.txt.setColor('#dcdcaa'));
      b.box.on('pointerout', () => b.txt.setColor(IDE.white));
      // act() then refresh: three of the five change the very label they sit on.
      b.box.on('pointerdown', () => { def.act(); this.refreshPauseHint(); });
    });
    this.pauseHint = this.add.text(cx, pcy + 82, 'the keys work too — this is a keyboard game', {
      fontFamily: 'monospace', fontSize: '11px', color: IDE.dim
    }).setOrigin(0.5);
    this.refreshPauseHint();
    this.pauseUI = this.add.container(0, 0,
      [pDim, pPanel, pTitle, this.pauseStats, this.pauseHint,
        ...this.pauseBtns.map(b => b.box), ...this.pauseBtns.map(b => b.txt)].filter(Boolean))
      .setDepth(50).setVisible(false);
    // The overlay starts hidden, so its buttons must start deaf — refreshPauseHint
    // above armed them while building the row, and an invisible container does not
    // stop Phaser hit-testing its children (see togglePause).
    this.pauseBtns.forEach(b => b.box.disableInteractive());

    // silent low-time warning: a red edge frame that intensifies as the clock
    // runs out, so the countdown tension reads even with sound muted. A full-
    // screen rect with a thick stroke shows only as an inner border band, so it
    // never covers the play area — one always-on object, alpha driven per frame.
    this.warnFrame = this.add.rectangle(cx, this.scale.height / 2,
      this.scale.width, this.scale.height, 0xff2233, 0)
      .setStrokeStyle(64, 0xff2233).setDepth(8).setAlpha(0);

    // the positive counterpart to warnFrame: a green edge pulse fired by
    // flashGain() the moment a BIG chunk of time is bought back on the LIVE field
    // (level-up, potion, armor death-save) — the "Count Down" theme's relief
    // beat, symmetric to the red tension frame. One-shot alpha tween, so it costs
    // nothing when idle. Sits just UNDER warnFrame (depth 7) so if a gain lands
    // while still in the red zone the red border stays on top and the green reads
    // as "escaping" it. Per-word +1.5s/+2s gains are too small and frequent to
    // flash (they already have the timer pulse + floating readout); the boss-win
    // cushion is skipped too — it plays under the full-screen stage overlay, so a
    // depth-7 pulse there would never be seen.
    this.gainFrame = this.add.rectangle(cx, this.scale.height / 2,
      this.scale.width, this.scale.height, 0x4caf50, 0)
      .setStrokeStyle(64, 0x4caf50).setDepth(7).setAlpha(0);

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
    // the game canvas / itch iframe onto browser chrome. Capture the arrow keys
    // too: they drive the keyboard-first bag/shop navigation (see menuKey) and
    // are unused during play, so capturing them only stops the itch page from
    // scrolling under the game when you steer the inventory grid.
    this.input.keyboard.addCapture('TAB');
    this.input.keyboard.addCapture('UP,DOWN,LEFT,RIGHT');
    this.input.keyboard.on('keydown', (e) => this.onKey(e));

    // Auto-pause on focus loss. The whole game is a live countdown, and on itch
    // it runs inside an iframe — so clicking OUTSIDE the frame (to read the
    // comments, alt-tab, etc.) blurs the window while the page stays VISIBLE.
    // Phaser's built-in pause only fires on visibilitychange (tab hidden), which
    // this case doesn't trigger, so update() keeps draining timeLeft and can kill
    // you while you're not even looking at the game. Force a pause on blur (never
    // an auto-resume — the player presses ESC when ready, so the clock can't drain
    // the instant focus returns). Routes through togglePause so every freeze it
    // owns (clock, tweens, music, decor emitters, stats snapshot) is inherited.
    // The bag/shop panel is the one case that must NOT be skipped: it keeps the
    // countdown draining on purpose (no free pause), so looking away with a panel
    // open is exactly the unearned death this blur pause exists to prevent — the
    // old guard mirrored the ESC path and skipped the pause while a menu was up,
    // leaving the clock draining behind an open bag while the player wasn't even
    // looking. Close the panel first (togglePause no-ops while menuOpen), then
    // pause. Listener is torn down on shutdown so a later run's fresh GameScene
    // isn't poked by the old one.
    this._onBlur = () => {
      if (this.paused || this.over || this.dying || this.transitioning) return;
      if (this.menuOpen) this.closeMenu();
      this.togglePause();
    };
    window.addEventListener('blur', this._onBlur);
    this.events.once('shutdown', () => window.removeEventListener('blur', this._onBlur));

    this.refreshLangHud();
    this.refreshCredits();
    this.refreshBag();

    // a nudge for first-time players; the first correct word clears it. Use a
    // word from the CURRENT language — hardcoding "body" (HTML) was wrong when
    // resuming a run at CSS/JS/etc. from a checkpoint.
    const sample = this.lang.words[0];
    this.hintText.setText('// try typing "' + sample + '" then ENTER — every word buys time!');
    this.refreshAssist();   // paint the shelf for word one, before any keystroke
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
    const base = this.festival ? FESTIVAL_HINT_COST : HINT_COST;
    // Someone who told the prologue they don't write code pays half — the hint
    // is their vocabulary lesson, not a shortcut past a fight they could win.
    return Math.max(5, Math.round((base - this.boonHint) * Profile.hintScale));
  }

  targetScore() {
    const mult = STAGES[this.stageIndex].mult + this.survivalLap * 0.5;
    // SHARD moves the goalpost. Applied to the RAW target only: the pool ceiling
    // below is a fairness floor, and cutting the target must never be able to
    // push it above what the words can actually pay.
    const raw = Math.round(
      this.lang.target * mult * this.boonTarget * (1 - this.targetCut) / 10) * 10;
    // A target is only fair if the language's word list can actually reach it.
    // The stage/lap multiplier had no such check, so late laps pushed targets
    // past the pool's ceiling — LUA at SURVIVAL lap 3 asked for 2500 when typing
    // EVERY one of its 38 patterns scores 1710. A player who dropped their combo
    // could clear the whole list, have nothing valid left to submit, get no
    // message explaining it, and just watch the clock kill them. Cap the target
    // at 80% of the no-combo pool total: combo multipliers make that comfortable,
    // and the dead end can't exist at any stage or lap.
    // 0.7, not 0.8: deprecation needs headroom to exist at all. With the ceiling
    // at 80% of the pool, a level where it binds (late laps, where the raw target
    // outruns the word list) leaves only 80% x 1.15 = 92% of the pool spoken for
    // — but the fairness check needs the pool ABOVE that, so nothing could ever
    // be deprecated on exactly the hardest content. At 0.7 there's room for the
    // theme to keep working everywhere, and the target stays comfortably reachable.
    const ceiling = Math.round(this.livePool() * 0.7 / 10) * 10;
    return Math.min(raw, ceiling);
  }

  // Say the rule out loud when a level opens. It's already named in the HUD, but
  // the HUD is a label you learn to stop reading — and a rule the player only
  // discovers by being charged 3 seconds for a typo is a gotcha, not a rule.
  // Called from levelUp (the next language's rule) rather than on arrival, so
  // it rides the same beat as the level-up bonus.
  announceRule() {
    const lang = LANGUAGES[this.langIndex];
    if (!lang || !lang.rule) return;
    const r = LANG_RULES[lang.rule];
    this.time.delayedCall(200, () => {
      if (this.over || this.dying) return;
      this.feedback('⚑ ' + lang.name + ' — ' + r.label + ': ' + r.desc, '#dcdcaa');
    });
  }

  // The active level's rule, if it has one (see LANG_RULES in data/languages.js).
  // Boss and festival levels are someone else's word list, so they run plain —
  // a rule you can't see coming isn't a rule, it's a surprise tax.
  rule() {
    if (this.bossMode || this.festival) return null;
    return this.lang.rule || null;
  }

  // What ONE pattern is worth, before the combo multiplier and before a
  // deprecation rescue doubles it. The single source of truth for a pattern's
  // base value: submit() scores with it, and the two reachability checks below
  // measure the pool with it, so a level's target and its scoring can no longer
  // disagree about what a word is worth.
  //
  // The rule multiplier belongs in here. It used to live only in submit(), so
  // livePool() valued a TERSE language's short patterns at face value while the
  // player was actually banking double for them — the ceiling believed less was
  // reachable than really was, and clamped targets that did not need clamping.
  // ASSEMBLY (the smallest terse pool) was running at 96% of that phantom
  // ceiling and capped from HARD upward, clearing ~2 patterns early against what
  // its ladder position asks for.
  wordPay(w) {
    const r = this.rule();
    const rulePay = (r === 'verbose' && w.length >= 6) ? 1.5
      : (r === 'terse' && w.length < 4) ? 2 : 1;
    return w.length * 10 * rulePay;
  }

  // Base points left on the table this level: every pattern not yet written and
  // not deprecated. Feeds both the target ceiling above and deprecation's
  // fairness check, so the two can never disagree about what's still reachable.
  livePool() {
    let total = 0;
    for (const w of this.lang.words) {
      if (!this.dead.has(w)) total += this.wordPay(w);
    }
    return total;
  }

  // Would killing `word` leave the level unwinnable? The pool that remains has to
  // stay DEPRECATE_MARGIN times the points still owed — a margin, not a knife
  // edge, since the player also has to FIND those patterns under a clock.
  canDeprecate(word) {
    const owed = this.targetScore() - this.score;
    if (owed <= 0) return false;
    let left = 0;
    for (const w of this.lang.words) {
      if (!this.dead.has(w) && !this.found.has(w) && w !== word) left += this.wordPay(w);
    }
    return left >= owed * DEPRECATE_MARGIN;
  }

  // Put one unwritten pattern on notice. Picks from the LONG end of what's left:
  // long patterns are worth the most points, so the threat is real, and it can't
  // quietly delete the two-letter filler the player was never going to miss.
  startDeprecation() {
    const pool = this.lang.words
      .filter(w => !this.dead.has(w) && !this.found.has(w) && this.canDeprecate(w));
    if (!pool.length) return;
    pool.sort((a, b) => b.length - a.length);
    const word = this.pickFrom(pool.slice(0, Math.max(3, Math.ceil(pool.length / 3))));
    // VAULT wards the notice before it can ever be on screen: the pattern is
    // simply never put at risk, and one ward is spent.
    if (this.eolWards > 0) {
      this.eolWards--;
      this.floatText('VAULT SAVED "' + word + '"');
      this.refreshLangHud();
      return;
    }
    this.eol = { word, left: DEPRECATE_WARN + this.boonEol, nextTick: null };
    // Dressed as the real thing. "is being deprecated" is a game telling you a
    // rule; "deprecated since 3.11, removed in 4.0" is the notice every working
    // programmer has actually read in a changelog — the same sentence that has
    // quietly ended careers' worth of code. Same mechanic, and the narrative is
    // carried by the mechanic's own text instead of a cutscene. Versions come
    // from the language's own scheme (`depVer` in languages.js); a language
    // without one keeps the plain wording rather than inventing a version.
    const v = this.lang.depVer;
    this.eolText.setText('⚠ "' + word + '" is being deprecated — write it now!')
      .setColor('#dcdcaa').setVisible(true);
    this.fitEol();
    this.eolVer.setText(v && v.since && v.removed
      ? 'deprecated since ' + v.since + ' · removed in ' + v.removed : '')
      .setVisible(!!(v && v.since && v.removed));
    this.tweens.killTweensOf(this.eolText);
    this.tweens.killTweensOf(this.eolVer);
    this.eolText.setAlpha(1);
    this.eolVer.setAlpha(1);
    this.tweens.add({ targets: [this.eolText, this.eolVer], alpha: 0.45, duration: 400, yoyo: true, repeat: -1 });
    this.teachDeprecation();
    // was Sfx.hint() — the rising chirp the HINT button uses, which read as a
    // reward for the one event in the game that is a threat. The notice now has
    // its own falling figure, and it is the only sound in the game that falls.
    if (typeof Sfx.deprecationNotice === 'function') Sfx.deprecationNotice();
    else Sfx.hint();
  }

  // Both notice lines go down together — a stale version line under a cleared
  // alarm would be the one artefact this split can leave behind.
  hideEol() {
    this.tweens.killTweensOf(this.eolText);
    this.eolText.setVisible(false);
    if (this.eolVer) {
      this.tweens.killTweensOf(this.eolVer);
      this.eolVer.setVisible(false);
    }
  }

  // Keep the notice line clear of the credits/hint block on its right.
  //
  // eolText is centred on the panel at x=480 and the [ HINT -20 ] / CREDITS
  // readout starts at x=790, so anything wider than ~596px runs underneath it.
  // The plain wording never got close; dressing the notice with real version
  // numbers ("deprecated since GHC 9.2, removed in GHC 9.8") pushed the widest
  // case to 674px, and it read as a collision in the corner of the screen.
  // Measured and scaled uniformly to fit, the same fix the pause key row uses
  // against the panel art — a slightly smaller sentence beats a clipped one.
  fitEol() {
    const t = this.eolText;
    t.setScale(1);
    const max = 596;
    if (t.width > max) t.setScale(max / t.width);
  }

  // A VAULT bought while a notice is already ticking should not have to wait for
  // the NEXT one — spend a ward on the pattern currently at risk and clear it.
  consumeEolWard() {
    if (!this.eol || this.eolWards <= 0) return;
    const word = this.eol.word;
    this.eolWards--;
    this.eol = null;
    this.hideEol();
    this.eolTimer = 0;
    this.floatText('VAULT SAVED "' + word + '"');
  }

  // The idea the whole game is built on, said out loud exactly once.
  //
  // The notice by itself reads as "hurry up" — a player seeing it for the first
  // time has no way to know that beating it pays DOUBLE, or that losing it takes
  // the pattern away for the rest of the level. That is the game's actual
  // premise (a second countdown, eating the answers to the first), and it was
  // being left for the player to infer from a warning triangle. A judge who
  // plays for three minutes and never works it out scores this as a typing
  // brawler with a timer, which is the one reading that costs us most.
  //
  // Once per browser, on the first notice ever seen, above the notice line, gone
  // after six seconds. Nothing is gated on it and it never repeats.
  teachDeprecation() {
    if (this._eolTaught) return;
    this._eolTaught = true;
    try {
      if (localStorage.getItem('los_seen_eol') === '1') return;
      localStorage.setItem('los_seen_eol', '1');
    } catch (e) { /* no storage: teach it this run and move on */ }

    const t = this.add.text(this.eolText.x, this.eolText.y - 22,
      'the second countdown — write it before the notice dies: DOUBLE pay, or gone for this level', {
        fontFamily: 'monospace', fontSize: '12px', color: IDE.comment
      }).setOrigin(0.5).setDepth(this.eolText.depth);
    this.time.delayedCall(6000, () => {
      this.tweens.add({
        targets: t, alpha: 0, duration: 400, onComplete: () => t.destroy()
      });
    });
  }

  // The notice expired: the pattern is gone for the rest of the level.
  finishDeprecation() {
    const word = this.eol.word;
    this.eol = null;
    this.dead.add(word);
    this.deprecatedCount++;
    this.hideEol();
    this.eolText.setVisible(true);
    this.eolText.setText('✖ "' + word + '" DEPRECATED — no longer accepted')
      .setColor(IDE.error).setAlpha(1).setVisible(true);
    this.fitEol();
    this.tweens.add({ targets: this.eolText, alpha: 0, duration: 2200, delay: 1200,
      onComplete: () => this.eolText.setVisible(false) });
    this.flashPanel(0xf44747);
    // not the wrong-answer buzzer: nothing was answered wrong. A pattern you
    // could have written is gone for the level — a dead, falling thud, and the
    // exact inverse of the flourish rescuing one plays.
    if (typeof Sfx.deprecationLost === 'function') Sfx.deprecationLost();
    else Sfx.wrong();
    // the target ceiling is derived from the live pool, so it may have just
    // dropped — repaint the HUD's target/progress rather than let it lie.
    this.refreshLangHud();
  }

  // Wipe the level's deprecation state. Called on every level change and on both
  // ends of a boss fight: `dead` is scoped to one language's pool, and a notice
  // left standing would tick down over a screen whose word list it no longer
  // belongs to.
  clearDeprecation() {
    this.dead.clear();
    this.eol = null;
    this.eolTimer = 0;
    if (this.eolText) this.hideEol();
  }

  // Deprecation runs during ordinary level play only: a boss or festival is an
  // interstitial on someone else's word list, and the transition/pause states
  // aren't play at all.
  tickDeprecation(dt) {
    if (this.bossMode || this.festival || this.transitioning || this.menuOpen) return;
    if (this.eol) {
      this.eol.left -= dt;
      if (this.eol.left <= 0) { this.finishDeprecation(); return; }
      // The second countdown, made audible. The notice sits above the input line
      // and a player mid-word is looking at their own typing, not at it — so the
      // clock the theme is named for was invisible to the person racing it. The
      // tick accelerates as the notice runs out (0.67s apart at the top, 0.18s
      // at the bottom), which is the same shape the run clock's <10s tick uses,
      // one octave of urgency lower. Scheduled off the notice's own remaining
      // time rather than a timer, so pausing (which stops update) stops it too.
      const span = DEPRECATE_WARN + this.boonEol;
      const step = Math.max(0.18, 0.18 + 0.49 * (this.eol.left / span));
      if (this.eol.nextTick === null) this.eol.nextTick = this.eol.left - step;
      if (this.eol.left <= this.eol.nextTick) {
        this.eol.nextTick = this.eol.left - step;
        this.sfx('deprecationTick', this.eol.left * 1000);
      }
      return;
    }
    this.eolTimer += dt;
    let every = Math.max(DEPRECATE_FLOOR,
      DEPRECATE_EVERY - this.stageIndex - this.survivalLap * 2);
    if (this.rule() === 'volatile') every /= 2;
    if (this.eolTimer >= every) {
      this.eolTimer = 0;
      this.startDeprecation();
    }
  }

  fmtC(c) {
    return String(parseFloat(c.toFixed(2)));
  }

  gainCredits(base) {
    this.credits += (base + this.boonCredit) * this.creditMult;
  }

  // Every EARNED clock increment routes through here so the run can tally how many
  // seconds your play clawed back from the countdown — the most on-theme number a
  // "Count Down" game can end on (surfaced on the End screen). Rescue floors (the
  // boss-win / festival-start cushions) and the armor death-save are deliberately
  // NOT counted: they're safety nets, not time you earned. The clock has no upper
  // cap, so a bare += is the whole story.
  addTime(sec) {
    // TIME BOUGHT still counts every earned second, clipped or not — it's the
    // "what your typing was worth" flex, and TIME_CAP is a balance clamp, not a
    // claim you didn't earn it. (Counting only landed seconds made the End-screen
    // headline read ~150s for a 1200-word run, which just looks broken.)
    this.timeBought += sec;
    const before = this.timeLeft;
    this.timeLeft = Math.min(TIME_CAP, this.timeLeft + sec);
    // Tell the player where their time went the first time it's clipped, then at
    // most once every 20s of play — silently swallowing the reward reads as a bug.
    if (this.timeLeft < before + sec && this.elapsed - (this._fullMsgAt || -99) > 20) {
      this._fullMsgAt = this.elapsed;
      this.feedback('clock is FULL (' + TIME_CAP + 's) — spend it, don\'t bank it', '#dcdcaa');
    }
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
    // TAB cycles the in-run panels: closed → BAG → SHOP → closed. This is a
    // keyboard game and every plain letter collides with word input, so Tab —
    // captured in create() so it can't shift focus out of the itch iframe — is the
    // one free key. Cycling through it (rather than toggling the bag only) is what
    // finally gives the SHOP a keyboard route, the standing "in-run SHOP access"
    // leftover; the mouse [BAG]/[SHOP] buttons still open each panel directly.
    // a boon draft owns 1-3 while it's up (see offerBoons); everything else on
    // the level-clear screen is already inert behind `transitioning`.
    if (this.boonKey) {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 3) this.boonKey(n - 1);
      return;
    }
    // the code-review card owns the keyboard while it's up (same idiom as the
    // boon draft above): ENTER/SPACE dismisses, N turns the notes off for good.
    if (this.learnKey) { this.learnKey(e); return; }
    if (e.key === 'Tab') { this.cycleMenu(); return; }
    if (this.menuOpen) {
      // The bag/shop are now fully keyboard-operable (this is a keyboard-first
      // game — every other screen answers the keys, so the panels should too).
      // menuKey handles ESC-close plus per-panel navigation/actions; nothing
      // else leaks through to word input while a panel is up.
      this.menuKey(e);
      return;
    }
    if (this.transitioning) return;
    if (e.key === 'Escape') { this.togglePause(); return; }
    if (this.paused) {
      // from the pause screen you can bail out to the main menu (to try the
      // daily, start fresh, etc.) — otherwise a run only ends by dying. The
      // furthest section reached is already checkpointed on each clear.
      if (e.key === 'q' || e.key === 'Q') this.quitToMenu();
      // M mutes/unmutes without leaving the keyboard (the gear is mouse-only).
      // Safe here: letters are word-input only when NOT paused. unlock() first so
      // the very first toggle still has an audio context to (un)mute.
      else if (e.key === 'm' || e.key === 'M') {
        Sfx.unlock();
        Sfx.setMuted(!Sfx.muted);
        this.refreshPauseHint();
        Sfx.blip();
      }
      // A toggles the pattern shelf. It's the difficulty switch, so it belongs on
      // the keyboard next to mute — mid-run is exactly when a player discovers
      // they don't know this language's keywords and needs it (or has had enough
      // help and wants it gone).
      else if (e.key === 'a' || e.key === 'A') {
        Assist.setOn(!Assist.on);
        this.refreshAssist();
        this.refreshPauseHint();
        Sfx.blip();
      }
      // L toggles the post-level pattern notes. It became a real game system, so
      // it belongs on the pause board next to the other two switches rather than
      // only on the review card itself (where you can turn it off but never back
      // on) and the menu's SETUP entry (which costs you the run to reach).
      else if (e.key === 'l' || e.key === 'L') {
        Profile.setLearn(!Profile.learn);
        this.refreshPauseHint();
        Sfx.blip();
      }
      return;
    }
    // CTRL+SPACE = HINT. The hint was the one during-play action with no keyboard
    // route (the standing "parked, not forgotten" leftover): every printable key
    // collides with word input, so no letter could ever hold it. A modifier combo
    // is the way out — and Ctrl+Space is *the* autocomplete chord in every IDE the
    // game is dressed as, so it needs no teaching. Space is already excluded from
    // word input (the \s test below) and modifier combos are dropped wholesale by
    // the guard that follows, so this steals nothing. preventDefault stops the
    // browser/IME claiming the chord. buyHint carries its own paused/over/dying/
    // transitioning/menuOpen guards plus the credit + cooldown checks, so the key
    // and the [ HINT ] button stay exactly equivalent.
    if ((e.ctrlKey || e.metaKey) && (e.key === ' ' || e.code === 'Space')) {
      e.preventDefault();
      this.buyHint();
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'Enter') {
      this.submit();
    } else if (e.key === 'Backspace') {
      // only act when there's something to delete — gives delete the same audio
      // feedback typing has, and skips a redundant refreshInput on an empty line.
      if (this.typed) {
        this.typed = this.typed.slice(0, -1);
        Sfx.back();
        this.refreshInput();
      }
    } else if (e.key.length === 1 && !/\s/.test(e.key) && this.typed.length < MAX_TYPED) {
      this.typed += e.key.toLowerCase();
      // the keystroke click climbs a pentatonic ladder with the live combo, so a
      // streak literally rises in pitch and a broken one drops back to the floor.
      // It is the cheapest feedback a typing game has and the loudest thing the
      // hands feel. Pure function of the combo, so it resets when the combo does.
      // This one falls back to the flat click rather than to silence: every other
      // new voice is an addition, but typing going quiet would be a regression.
      if (typeof Sfx.typeCombo === 'function') Sfx.typeCombo(this.combo);
      else Sfx.type();
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
      // Re-submitting a pattern you already cleared is a no-op, not an attempt:
      // the game already treats it as neither a hit nor a mistake — soft blip
      // (not the wrong buzzer), no combo break, no perfect-clear penalty. The
      // accuracy stat is the one place that still contradicted that, docking you
      // for it (submitsTotal++ above with no matching submitsOk). Pass-4 removed
      // this docking for the *false* "already typed" rejections it fixed; undo
      // the attempt count here so a genuine duplicate doesn't dent accuracy either
      // (a headline End/daily/share stat). Ranking is unaffected — it sorts on
      // progress → words → score, never accuracy.
      this.submitsTotal--;
      this.feedback('"' + w + '" already typed', IDE.dim);
      Sfx.blip();
      return;
    }
    // A deprecated pattern is a special kind of wrong: it WAS right, and the
    // player is being punished for arriving late rather than for not knowing.
    // Soft rejection — buzzer and a clear reason, but no combo break and no
    // perfect-clear penalty, same treatment a duplicate gets.
    if (!this.bossMode && !this.festival && this.dead.has(w)) {
      this.submitsTotal--;
      this.feedback('"' + w + '" was deprecated — too late', IDE.error);
      Sfx.wrong();
      this.shakePanel();
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
      if (!this.bossMode && !this.festival) {
        this.levelMistakes++;
        if (this._perfectState === 'on') this.refreshPerfect(true);  // one-shot break flash
      }
      // PRISM absorbs the reset. Spent per wrong word, and only on the combo —
      // the mistake still costs the perfect-clear bonus, the accuracy stat and
      // (under STRICT) the seconds, because forgiving all of that would make the
      // item a licence to type badly rather than insurance against one slip.
      if (this.comboShield > 0) {
        this.comboShield--;
        this.floatText('PRISM HELD THE COMBO  ×' + this.combo +
          (this.comboShield > 0 ? '  (' + this.comboShield + ' left)' : '  (last one)'));
      } else {
        this.combo = 0;
      }
      this.refreshCombo();
      if (this.rule() === 'strict') {
        // the level's own rule, announced at its start: this compiler charges
        // for a mistake. Floors at 0 so it can't push past the death check that
        // update() owns.
        this.timeLeft = Math.max(0, this.timeLeft - 3);
        this.floatText('STRICT COMPILER  -3s');
      }
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
      const b = this.bossMode;
      const m = this.comboMult();
      // where does this pattern sit in the chain? on it, off it, or off-order
      const onChain = !!(b.seq && w === b.seq[b.seqAt]);
      const brokeChain = !!(b.seq && !onChain && b.seq.includes(w));
      const bonus = ((1.5 + 0.25 * w.length) * b.lang.timeMult + this.boonTime) *
        (onChain ? 2 : 1);
      this.addTime(bonus);
      this.addScore(w.length * 15 * m * (onChain ? 2 : 1));
      this.gainCredits(CREDIT_PER_WORD);
      this.tickMult();
      this.refreshCredits();
      let dmg = 1;
      if (onChain) {
        dmg = 3;
        b.seqAt++;
        // Say when a chain is FINISHED rather than silently swapping in three new
        // patterns — the silent redraw is what makes the fight read as if the
        // boss changed language on you. It doesn't; only the chain does.
        this.floatText(b.seqAt >= b.seq.length
          ? 'CHAIN COMPLETE!  ×2  — new chain'
          : 'CHAIN ' + b.seqAt + '/3!  ×2  +' + bonus.toFixed(1) + 's');
        Sfx.win();
      } else if (brokeChain) {
        // Out of order. This used to HEAL the boss, and measurement said that was
        // the wrong call: a player still learning the chain types the link they
        // can spell rather than the one marked ▶, and the profile that does it
        // took 29 inputs while watching the bar climb 11 times. Being punished
        // for the natural mistake, with no explanation on screen, is what "the
        // boss doesn't take damage" felt like. It's still a valid pattern of the
        // boss's language, so it lands its ordinary 1 — you simply lose the 3x
        // the chain was offering, and a fresh chain is drawn because the link you
        // spent can't be asked for again.
        this.floatText('out of order — chain reset');
        this.feedback('the chain wanted "' + b.seq[b.seqAt] + '" first', IDE.error);
        this.shakePanel();
      } else {
        this.floatText('BOSS HIT!' + (m > 1 ? ' ×' + m : '') + '  +' + bonus.toFixed(1) + 's');
      }
      this.maybeDrop(pos);
      b.hp -= dmg;
      if (brokeChain || (b.seq && b.seqAt >= b.seq.length)) this.newBossSeq();
      else this.refreshBossSeq();
      this.refreshLangHud();
      if (b.hp <= 0) this.beatBoss();
      return;
    }

    if (this.festival) {
      const m = this.comboMult();
      this.festival.count++;
      this.addScore(w.length * 10 * m);
      this.gainCredits(FESTIVAL_CREDIT);
      this.addTime(FESTIVAL_TIME_BONUS);
      this.tickMult();
      this.refreshCredits();
      this.floatText((m > 1 ? '×' + m + '  ' : '') + '+' + FESTIVAL_CREDIT +
        ' credits  +' + FESTIVAL_TIME_BONUS + 's');
      this.maybeDrop(pos);
      this.pickFestivalLang();
      return;
    }

    const m = this.comboMult();
    // Written while the deprecation notice was up: you beat the clock the theme
    // is actually about, so the pattern pays double and the notice comes down.
    const rescued = !!(this.eol && this.eol.word === w);
    if (rescued) {
      this.eol = null;
      this.hideEol();
      this.eolTimer = 0;
      this.rescuedCount++;
      this.floatText('SAVED FROM DEPRECATION!  ×2');
      // the game's best moment gets the game's brightest sound — and it is the
      // rising answer to the falling notice, so the pair reads as one mechanic.
      this.sfx('rescued');
    }
    const points = this.wordPay(w) * m * (rescued ? 2 : 1);
    const bonus = ((1.5 + 0.25 * w.length) * this.lang.timeMult + this.boonTime) *
      (rescued ? 2 : 1);
    this.score += points;
    this.addScore(points);
    this.addTime(bonus);
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
      // Say which way round the question was. The old line read
      // ("import" is not a ASDF pattern) — it echoed the player's own typo back
      // as if it were a language, which is nonsense on a mistype. Still doesn't
      // name the answer: a wrong guess keeps the SAME word up (pickGrowthRound
      // only runs on a hit), so revealing it would hand over free points.
      const tail = this.combo >= 5 ? ' — combo ×' + this.combo + ' lost!' : '';
      this.feedback('"' + w + '" is not the language of "' + f.word + '"' + tail, IDE.error);
      // the shield covers festival misses too — it guards the combo, and the
      // combo is one number that runs across levels, bosses and festivals alike.
      if (this.comboShield > 0) {
        this.comboShield--;
        this.floatText('PRISM HELD THE COMBO  ×' + this.combo);
      } else {
        this.combo = 0;
      }
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
    this.addTime(FESTIVAL_TIME_BONUS);
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

  // A quick upward scale-pop on the big countdown when a word buys time — ties
  // the core "typing buys time" loop to the timer itself (the Count Down theme).
  // Skipped while low: update() drives a per-frame scale/tremble on the timer
  // under 10s, and a tween here would fight it. Cheap transform, no re-raster.
  pulseTimer() {
    if (this._timerLow) return;
    this.tweens.killTweensOf(this.timerText);
    this.timerText.setScale(1.18);
    this.tweens.add({ targets: this.timerText, scale: 1, duration: 180, ease: 'Quad.easeOut' });
  }

  // Green edge pulse for a big clock refill — the relief beat that mirrors the
  // red low-time warnFrame. One-shot: pop to a modest alpha, fade back to 0.
  // killTweensOf first so a second gain (potion right after a level-up) restarts
  // the pulse cleanly instead of stacking fades that cut it short — the same
  // one-tween-at-a-time discipline the feedback/shake/hint paths use.
  flashGain() {
    if (this.over || this.dying) return;
    this.tweens.killTweensOf(this.gainFrame);
    this.gainFrame.setAlpha(0.45);
    this.tweens.add({ targets: this.gainFrame, alpha: 0, duration: 520, ease: 'Quad.easeOut' });
  }

  celebrate() {
    // Every scoring path (normal / boss / festival / growth) runs through here,
    // so this is where "you are still moving" is recorded — the SOS shelf reads
    // it to decide whether you're stuck (see refreshAssist).
    this._lastLandAt = this.elapsed;
    this.hintText.setText('');
    this.flashPanel(IDE.greenHex);
    this.pulseTimer();   // every landed word buys time — pop the countdown to show it
    Sfx.pickup();
    // Combo heat: the correct-word burst grows AND warms with the score-multiplier
    // tier, so a hot streak visibly hits harder on the field — not just in the
    // COMBO readout's recolor. Runs after combo++ in every scoring path (normal /
    // boss / festival), so the tier is current. The ×3 tint matches the ×3 readout
    // colour (gold, IDE-orange) for a consistent "streak is paying off" language.
    // setParticleTint re-sets the shared burst emitter each pop, so it's a cheap
    // transform — no new objects — and every explode leaves it in a known state.
    const tier = this.comboMult();   // 1 / 2 / 3
    this.burstFx.setParticleTint(tier >= 3 ? 0xff9800 : tier >= 2 ? 0xb5e853 : IDE.greenHex);
    this.burstFx.explode(14 + (tier - 1) * 8);   // 14 / 22 / 30 particles
    if (this.bossMode) return this.battle.bossHit();
    return this.festival ? null : this.battle.attack();
  }

  // combo score-multiplier tier, shared by the COMBO readout and every scoring
  // path so what the readout advertises ("score ×N") is exactly what lands —
  // in normal mode, boss fights AND festivals alike (it used to apply to the
  // normal path only, so the multiplier the boss/festival readout promised was
  // never actually paid out).
  comboMult() {
    return this.combo >= (this.boonCombo ? 10 : 15) ? 3 : this.combo >= 5 ? 2 : 1;
  }

  // surface the run's best combo once it's worth showing. Self-gates on change
  // so it doesn't re-raster the glyph texture on every word (setText re-renders).
  refreshBestCombo() {
    if (this.maxCombo < 2 || this.maxCombo === this._shownBestCombo) return;
    this._shownBestCombo = this.maxCombo;
    this.bestComboText.setText('BEST COMBO ' + this.maxCombo);
  }

  // Live PERFECT-pace indicator. Only meaningful during a normal level (not a
  // boss/festival interstitial, which reset it via blankPerfect). broke=true is
  // the one-shot break flash on the level's first mistake; otherwise it self-
  // gates on the computed on/idle state so it re-rasters only on a real change
  // — the same setText gate the timer / HUD labels / credits readouts use.
  refreshPerfect(broke) {
    if (this.bossMode || this.festival || this.over || this.dying) return;
    if (broke) {
      this._perfectState = 'off';
      this.tweens.killTweensOf(this.perfectText);
      this.perfectText.setText('✗ PERFECT LOST').setColor(IDE.error).setAlpha(1).setScale(1.15);
      this.tweens.add({ targets: this.perfectText, scale: 1, duration: 150 });
      this.tweens.add({ targets: this.perfectText, alpha: 0, delay: 900, duration: 400 });
      return;
    }
    // 'off' is terminal for the rest of the level: once a mistake breaks the pace,
    // a perfect clear is no longer possible, so the tag can never light green again
    // this level. Return here so the per-word refresh can't (a) re-raster the tag
    // back to blank and, more importantly, (b) kill the "✗ PERFECT LOST" flash's
    // own fade tween the instant the next correct word lands — which, on a fast
    // typing game, wiped the break flash long before it finished playing. The next
    // level clears 'off' via blankPerfect() in levelUp so the tag arms again.
    if (this._perfectState === 'off') return;
    // "on" needs at least one landed word this level — a fresh level (score 0)
    // shows nothing until you've actually earned the streak worth protecting.
    const state = (this.levelMistakes === 0 && this.score > 0) ? 'on' : 'idle';
    if (state === this._perfectState) return;
    this._perfectState = state;
    this.tweens.killTweensOf(this.perfectText);
    if (state === 'on') this.perfectText.setText('◆ PERFECT').setColor(IDE.comment).setAlpha(1).setScale(1);
    else this.perfectText.setText('').setAlpha(1).setScale(1);
  }

  // hard-clear the indicator when a boss/festival takes over the level (their
  // refreshLangHud paths don't run the normal per-word refreshPerfect).
  blankPerfect() {
    this._perfectState = 'idle';
    this.tweens.killTweensOf(this.perfectText);
    this.perfectText.setText('').setAlpha(1).setScale(1);
  }

  refreshCombo(pulse) {
    this.refreshBestCombo();
    if (this.combo < 2) { this.comboText.setText(''); this._comboTier = 1; return; }
    const m = this.comboMult();
    // Teach the reward ramp live: the ×2/×3 score tiers were documented in HOW TO
    // PLAY but on the field you only saw the multiplier AFTER crossing it. Append a
    // "→ ×N at M" teaser toward the NEXT tier (mirrors comboMult's 5/15 thresholds)
    // so a building streak shows what it's climbing toward — and it self-drops once
    // you're at the top ×3 tier. Right-aligned readout, so the extra chars grow
    // leftward into empty HUD space; no new re-raster (this already setText's/word).
    const nextAt = this.combo < 5 ? 5 : this.combo < 15 ? 15 : 0;
    const tease = nextAt ? ' → ×' + (nextAt === 5 ? 2 : 3) + ' at ' + nextAt : '';
    this.comboText.setText('COMBO ' + this.combo + (m > 1 ? ' · score ×' + m : '') + tease)
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
    if (this.inventory.length >= Items.slots) {
      const v = RARITIES[item.r].salvage;
      this.credits += v;
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
    const eff = Items.effect(item);
    // Refuse a use that would throw the item away. A word's time bonus being
    // clipped by TIME_CAP is incidental; a consumable you deliberately spent
    // being destroyed is not — measured: a LEGENDARY potion (+60s) drunk at 90s
    // on the clock delivered 9 and burned 51. The rule now lives in items.js
    // (Items.refuseReason) with the whole context handed to it, because every
    // new gem needs its own version and five more inline `if`s here is exactly
    // how a rule like this quietly stops being applied to half the items.
    const refuse = Items.refuseReason(item, {
      timeLeft: this.timeLeft, timeCap: TIME_CAP, deathSave: this.deathSave,
      comboShield: this.comboShield, deadCount: this.dead.size,
      targetCut: this.targetCut, slowActive: this.elapsed < this.slowUntil
    });
    if (refuse) {
      this.feedback(Items.name(item) + ' — ' + refuse, IDE.error);
      Sfx.wrong();
      return;
    }
    if (T.key === 'sword') {
      this.creditMult = eff.creditMult;
      this.multWords = eff.multWords;
    } else if (T.key === 'armor') {
      this.deathSave = Math.max(this.deathSave, eff.deathSave);
    } else if (T.key === 'potion') {
      this.addTime(eff.time);
      this.flashGain();   // a potion is the biggest single refill (+10..60s)
    } else if (T.key === 'scroll') {
      this.hintTokens += eff.hints;
    } else if (T.key === 'treasure') {
      this.credits += eff.credits;
    } else if (T.key === 'prism') {
      // PRISM — the combo survives your next N wrong patterns. The combo
      // multiplier is the largest swing in the scoring, and one mistyped word
      // razes it; this is the only thing in the game that forgives a typo.
      this.comboShield = Math.max(this.comboShield, eff.comboShield);
      this.refreshCombo();
    } else if (T.key === 'sigil') {
      // SIGIL — put deprecated patterns back in the pool. The one answer to the
      // game's second countdown: everything else races it, this reverses it.
      const back = Array.from(this.dead).slice(0, eff.revive);
      back.forEach(w => this.dead.delete(w));
      this.deprecatedCount = Math.max(0, this.deprecatedCount - back.length);
      this.refreshAssist();      // the shelf can offer them again
      this.refreshLangHud();     // the target ceiling is derived from the pool
      this.floatText('RESTORED ' + back.length + ' PATTERN' + (back.length === 1 ? '' : 'S'));
    } else if (T.key === 'core') {
      // CORE — halve the drain for a while. Not more seconds (that is a potion),
      // but slower seconds: it buys the same time and makes a hard level readable
      // instead of just longer.
      this.slowUntil = this.elapsed + eff.slowSeconds;
      this.slowFactor = eff.slowFactor;
      this.flashGain();
    } else if (T.key === 'shard') {
      // SHARD — move the goalpost instead of the clock. One cut per level
      // (refuseReason blocks a second), cleared on every level change.
      this.targetCut = eff.targetCut;
      this.refreshLangHud();
      this.floatText('TARGET CUT ' + Math.round(eff.targetCut * 100) + '%');
    } else if (T.key === 'vault') {
      // VAULT — the notice never lands: the next N patterns put on deprecation
      // notice are saved automatically.
      //
      // It shipped from the item pass as "+N credit ceiling", which was correct
      // when it was written and dead on arrival by the time it landed: the credit
      // cap was removed in the same batch of work, so raising it bought nothing.
      // Rather than drop the item (its topaz texture is rendered and its slot in
      // the drop table is real), it was given the verb that was actually missing.
      // SIGIL undoes a deprecation after the fact; this one stops it happening,
      // which is the more valuable half and reads clearly next to it.
      this.eolWards += eff.eolWards;
      if (this.eol) this.consumeEolWard();   // spend one on the notice already up
      this.refreshLangHud();
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
    this.credits += v;
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

  // TAB's panel cycle: closed → BAG → SHOP → closed. Shares toggleMenu's guards
  // (no-op while over/dying/transitioning/paused/in a festival) so the keyboard
  // route inherits every safety the mouse buttons have.
  cycleMenu() {
    if (this.over || this.dying || this.transitioning || this.paused || this.festival) return;
    const next = this.menuOpen === 'bag' ? 'shop' : this.menuOpen === 'shop' ? null : 'bag';
    this.closeMenu();
    // TAB is the keyboard route, so pre-select the first item — U/S then act with
    // no steering step. (The mouse [BAG] button still opens with nothing selected.)
    if (next === 'bag') this.openBag(this.inventory.length ? 0 : -1);
    else if (next === 'shop') this.openShop();
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
    this.bagSel = selected;   // remember the highlighted slot for keyboard nav (bagKey)
    const cx = this.scale.width / 2, cy = this.scale.height / 2;
    const cap = Items.slots, maxCap = Items.slotsMax, price = Items.slotPrice();
    const c = this.menuShell('INVENTORY  (' + this.inventory.length + '/' + cap + ')',
      'click or ↑↓←→ / 1-9 to pick · U use · S salvage' +
      (price != null ? ' · B buy slot' : '') + ' · ESC closes');

    // The bag is bought, not given. Every slot up to the hard cap is drawn: the
    // ones you own as normal slots, the rest as locked outlines with the NEXT
    // one priced and clickable. Showing the locked slots at all is the point —
    // a bag that silently stops at 12 reads as a limit, a bag with four dim
    // slots and a price on the first one reads as something to save for, and it
    // gives credits a second thing to be for now that they no longer cap out.
    const cols = 6, size = 78;
    const x0 = cx - (cols - 1) * size / 2;
    for (let i = 0; i < maxCap; i++) {
      const x = x0 + (i % cols) * size, y = cy - 108 + Math.floor(i / cols) * size;
      if (i >= cap) {
        // locked. Only the very next one is buyable — otherwise a rich player
        // could skip rungs and the rising price would mean nothing.
        const next = i === cap;
        const afford = next && price != null && this.credits >= price;
        const lock = this.add.rectangle(x, y, 64, 64, 0x141416)
          .setStrokeStyle(2, afford ? 0xdcdcaa : IDE.border, next ? 0.9 : 0.35);
        c.add(lock);
        c.add(this.add.text(x, y - 6, next ? '+' : '·', {
          fontFamily: 'monospace', fontSize: next ? '26px' : '18px',
          color: afford ? '#dcdcaa' : IDE.dim
        }).setOrigin(0.5));
        if (next && price != null) {
          c.add(this.add.text(x, y + 20, price + ' cr', {
            fontFamily: 'monospace', fontSize: '11px',
            color: afford ? '#dcdcaa' : IDE.error
          }).setOrigin(0.5));
          lock.setInteractive({ useHandCursor: true });
          lock.on('pointerdown', () => this.buyBagSlot());
        }
        continue;
      }
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
    c.add(this.add.text(cx - 330, cy + 160, 'CREDITS ' + this.fmtC(this.credits), {
      fontFamily: 'monospace', fontSize: '15px', color: IDE.text
    }).setOrigin(0, 0.5));
  }

  openShop() {
    this.menuOpen = 'shop';
    const cx = this.scale.width / 2, cy = this.scale.height / 2;
    const stock = Items.shopStock();
    this.shopStockCache = stock;   // so keyboard buys (shopKey → buyStock) hit the same stock
    const c = this.menuShell('SHOP — ' + stock.day, 'click or press 1-4 to buy · bought items go to your bag · ESC closes');

    // A full bag auto-salvages incoming loot for a fraction of its value — fine
    // for a random drop, but a paid purchase would then charge full price and
    // hand back only the salvage crumbs. Block BUY when the bag is full instead.
    const full = this.inventory.length >= Items.slots;

    stock.items.forEach((item, i) => {
      const x = cx - 255 + i * 170, y = cy - 40;
      const sold = stock.sold.includes(i);
      const card = this.add.rectangle(x, y, 150, 190, 0x1c1c1d)
        .setStrokeStyle(2, sold ? IDE.border : RARITIES[item.r].tint);
      c.add(card);
      // the keyboard buy-key for this card, in its corner, so the '1-4 to buy'
      // note maps to something visible instead of the player guessing left-to-right.
      c.add(this.add.text(x - 65, y - 85, String(i + 1), {
        fontFamily: 'monospace', fontSize: '13px', color: IDE.dim, fontStyle: 'bold'
      }).setOrigin(0, 0).setAlpha(sold ? 0.4 : 1));
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
        btn.on('pointerdown', () => this.buyStock(i));
      }
      c.add(btn);
    });
    c.add(this.add.text(cx, cy + 160, 'CREDITS ' + this.fmtC(this.credits), {
      fontFamily: 'monospace', fontSize: '15px', color: IDE.text
    }).setOrigin(0.5));
  }

  // Buy shop slot i — shared by the mouse BUY button and the 1-4 keyboard route
  // (shopKey). Re-validates sold/bag-full/affordability itself so the keyboard
  // path is as safe as the (only-wired-when-buyable) mouse button; an invalid
  // press is a soft buzzer, since the card already shows SOLD / BAG FULL / price.
  buyStock(i) {
    const stock = this.shopStockCache;
    if (!stock) return;
    const item = stock.items[i];
    if (!item || stock.sold.includes(i) ||
        this.inventory.length >= Items.slots ||
        this.credits < RARITIES[item.r].price) {
      Sfx.wrong();
      return;
    }
    this.credits -= RARITIES[item.r].price;
    Items.markSold(stock, i);
    this.addItem(item, true);
    this.refreshCredits();
    this.closeMenu();
    this.openShop();
  }

  // --- keyboard control for the bag/shop panels (this is a keyboard-first game) ---

  // Dispatch a keypress while a panel is open. ESC always closes; otherwise the
  // active panel handles it. Called from onKey's menu branch, so nothing here can
  // leak into word input.
  menuKey(e) {
    if (e.key === 'Escape') { this.closeMenu(); return; }
    if (this.menuOpen === 'bag') this.bagKey(e);
    else if (this.menuOpen === 'shop') this.shopKey(e);
  }

  // Bag navigation: ↑↓←→ steer the dense 6-wide item grid (inventory is packed,
  // so slot index === inventory index and slots ≥ length are empty), 1-9 jump to
  // a slot, U/ENTER use the selected item, S salvages it. Re-opens the panel to
  // repaint the selection highlight — the same closeMenu→openBag idiom the mouse
  // click path uses, so no new render path.
  // Buy one bag slot. Credits are deducted ONLY after the write succeeded —
  // Items.buySlot() deliberately doesn't touch money, so a storage failure can
  // never take someone's credits and give nothing back.
  buyBagSlot() {
    const price = Items.slotPrice();
    if (price == null) {
      this.feedback('the bag is as big as it gets (' + Items.slotsMax + ' slots)', IDE.dim);
      Sfx.wrong();
      return;
    }
    if (this.credits < price) {
      this.feedback('need ' + price + ' credits for the next slot — you have ' +
        this.fmtC(this.credits), IDE.error);
      Sfx.wrong();
      return;
    }
    if (!Items.buySlot()) { Sfx.wrong(); return; }
    this.credits -= price;
    this.refreshCredits();
    Sfx.win();
    this.feedback('bag slot unlocked — ' + Items.slots + ' slots', '#dcdcaa');
    // redraw the panel so the new slot appears and the next price is restated
    this.closeMenu();
    this.openBag(this.bagSel);
  }

  bagKey(e) {
    // B buys the next slot. Above the empty-bag early return on purpose: a new
    // player with nothing in the bag is exactly who might want a bigger one, and
    // the old guard would have swallowed the key.
    if (e.key === 'b' || e.key === 'B') { this.buyBagSlot(); return; }
    const n = this.inventory.length;
    if (n === 0) return;
    const key = e.key, cols = 6, sel = this.bagSel, has = sel >= 0 && sel < n;

    if (key >= '1' && key <= '9') {
      const idx = key.charCodeAt(0) - 49;   // '1' → slot 0
      if (idx < n) this.reopenBag(idx);
      return;
    }
    if (key === 'ArrowRight') { this.reopenBag(has ? (sel + 1) % n : 0); return; }
    if (key === 'ArrowLeft')  { this.reopenBag(has ? (sel - 1 + n) % n : n - 1); return; }
    if (key === 'ArrowDown') {
      // down a row, wrapping to the top of the same column when it runs off the end
      this.reopenBag(has ? (sel + cols < n ? sel + cols : sel % cols) : 0);
      return;
    }
    if (key === 'ArrowUp') {
      // up a row, wrapping to the bottom-most filled slot in the same column
      if (!has) { this.reopenBag(0); return; }
      let j = sel % cols;
      while (j + cols < n) j += cols;
      this.reopenBag(sel - cols >= 0 ? sel - cols : j);
      return;
    }
    if (key === 'Enter' || key === 'u' || key === 'U') {
      if (has) { this.useItem(sel); this.afterBagAction(sel); }
    } else if (key === 's' || key === 'S') {
      if (has) { this.salvageItem(sel); this.afterBagAction(sel); }
    }
  }

  // repaint the bag with a new selection (mirrors the mouse slot-click flow).
  // A quiet keystroke tick makes keyboard steering feel as responsive as the
  // rest of the game's input — this path is keyboard-only, so the mouse click
  // flow (openBag directly) stays silent as before.
  reopenBag(sel) {
    if (sel !== this.bagSel) Sfx.type();
    this.closeMenu();
    this.openBag(sel);
  }

  // After a keyboard USE/SALVAGE removes the item at prevSel, keep a sensible
  // selection so you can act on several items in a row without re-steering:
  // the item that slid into that slot (or the new last one), or none if empty.
  afterBagAction(prevSel) {
    const n = this.inventory.length;
    this.closeMenu();
    this.openBag(n === 0 ? -1 : Math.min(prevSel, n - 1));
  }

  // Shop: number keys 1-4 buy the matching card (see buyStock's own guards).
  shopKey(e) {
    const key = e.key;
    if (key < '1' || key > '9') return;
    const i = key.charCodeAt(0) - 49;
    if (this.shopStockCache && i < this.shopStockCache.items.length) this.buyStock(i);
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
        p, stageIndex: this.stageIndex, lap: this.survivalLap, langIndex: this.langIndex,
        credits: this.credits
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
    // snapshot what was typed BEFORE found is cleared below — the code-review
    // card is built from the player's own words, in the order they wrote them.
    const learned = Profile.learn ? Array.from(this.found) : null;
    // banked the moment the level falls, not at the end of the run — dying two
    // languages later must not take back a language you actually cleared.
    Career.clearLang(LANGUAGES[fromIdx].name);
    this.levelMistakes = 0;
    // Re-arm the live PERFECT tag for the fresh level. A level that broke pace
    // leaves _perfectState terminally 'off' (see refreshPerfect); reset it here —
    // the only normal-play path that starts a new language level — so the next
    // level's first word can light the tag green again. Boss/festival do the same
    // via blankPerfect. Safe during the level-clear transition: the road overlay
    // covers the field, so blanking the tag is invisible.
    this.blankPerfect();
    this.langIndex++;
    this.saveCheckpoint();   // clearing a language (e.g. HTML -> CSS) is a checkpoint
    this.score = 0;   // per-level progress resets; the HUD keeps showing runScore
    this.found.clear();
    this.clearDeprecation();   // the new language starts with its full pool
    this.targetCut = 0;        // SHARD cuts ONE level's target, not the run's
    this.recent = [];
    this.recentText.setText('');
    this.hintText.setText('');
    this.feedbackText.setText('');
    this.announceRule();
    this.addTime(LEVELUP_TIME_BONUS + this.boonRefill);
    if (perfect) {
      this.addTime(PERFECT_TIME_BONUS);
      this.addScore(perfectScore);
      this.gainCredits(PERFECT_CREDIT);
      this.refreshCredits();
    }
    this.flashGain();   // clearing a level bought back +10s (+5s perfect) — pulse green
    this.strikeTimer = 0;
    this.shakeCam(250, 0.006);
    Sfx.win();
    this.transitioning = true;
    this.armTransitionGuard(12, 'levelUp');   // ulti + road overlay ≈ 6s
    this.battle.ulti(() => this.afterUlti(fromIdx, perfect, perfectScore, learned));
  }

  afterUlti(fromIdx, perfect, perfectScore, learned) {
    if (this.langIndex >= LANGUAGES.length) {
      // the level that fills the road (bonus already banked in levelUp) goes
      // straight to the boss — flash the perfect callout over the live field.
      if (perfect) this.floatText('PERFECT LEVEL!  +' + perfectScore);
      this.startBoss();
      return;
    }
    // The order of a level-clear, and why the festival moved to the front of it.
    //
    // It used to be: road → boons → review → play, and THEN a festival might
    // start, on top of the language you had already been dropped into. So the
    // festival was an ambush in the middle of a level, and when it ended you
    // were just... standing in a level that had begun without ceremony.
    //
    // Now the festival is its own section. It runs first, and CLEARING IT is
    // what triggers the road animation into the next language — so it reads as
    // a place you went and came back from, and the transition marks the way out
    // of it. ("festivaller ayrı bir bölüm olsun, festivali bitirince yeni
    // bölüme geçme animasyonuna gelsin.")
    const resume = () => {
      this.clearTransitionGuard();
      this.transitioning = false;
      this.refreshLangHud();
    };
    const road = (festival) => {
      // the festival ran with the field live, so take the transition back before
      // the overlay goes up, and re-arm the guard the festival stood down.
      this.transitioning = true;
      this.armTransitionGuard(12, 'levelUp:road');
      this.showPath(fromIdx, () => {
        if (Profile.learn && learned && learned.length) {
          this.showLearnCard(fromIdx, learned, resume);
        } else {
          resume();
        }
      }, perfect, perfectScore, festival || null);
    };

    if (this.rand() < FESTIVAL_CHANCE) {
      // A festival needs update() running (its own timer, and the main clock
      // still drains under it), and update() early-returns while transitioning —
      // so the transition is stood down for the duration and the guard with it.
      // The banner covers the field and blocks the menus, so nothing else can
      // reach the run in the meantime.
      this.clearTransitionGuard();
      this.transitioning = false;
      // one rand() call at the same point in the sequence as before, so a daily
      // seed still plays the same festival it always did
      const kind = this.rand() < 0.5 ? 'sw' : 'growth';
      this.startFestival(kind, () => road(kind));
      return;
    }
    road();
  }

  // --- code review: what the patterns you just typed actually meant ---
  //
  // The game's honest problem, until now: you could clear HASKELL at speed and
  // walk away knowing nothing about Haskell. You typed `>>=` because it was on a
  // list, not because it meant anything. This card is the fix — after a language
  // falls, it reviews the patterns YOU typed (not a generic lesson: your own
  // words, in the order you wrote them) with a one-line meaning and a real
  // example. Opt-in via the prologue and switchable off from the card itself,
  // because a fluent player wants none of this in the middle of a timed run.
  //
  // Deliberately capped at LEARN_CARD_MAX: this sits between two levels of a
  // countdown game, so it has to be readable in a breath, not studied. Anything
  // the glossary can't explain is left out rather than padded with filler.
  showLearnCard(langIdx, words, done) {
    const lang = LANGUAGES[Math.min(langIdx, LANGUAGES.length - 1)];
    const entries = Glossary.review(lang.name, words, LEARN_CARD_MAX);
    // nothing to teach (an all-operator level, or a language the glossary
    // doesn't cover deeply) → don't stop the run to say nothing.
    if (!entries.length) { done(); return; }

    // the card waits on the player, so the level-clear guard (armed for ~12s)
    // would otherwise fire underneath it and "resume" the run behind the panel.
    this.clearTransitionGuard();
    this.armTransitionGuard(180, 'learnCard');

    const cx = this.scale.width / 2, cy = this.scale.height / 2;
    const card = this.add.container(0, 0).setDepth(70);
    card.add(this.add.rectangle(cx, cy, this.scale.width, this.scale.height, 0x08060e, 0.9)
      .setInteractive());
    card.add(this.add.rectangle(cx, cy, 856, 428, IDE.panel).setStrokeStyle(2, IDE.border));

    card.add(this.add.text(cx, cy - 196, '// code review — ' + lang.name, {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.comment, fontStyle: 'bold'
    }).setOrigin(0.5));
    card.add(this.add.text(cx, cy - 172,
      'you cleared it. here is what you were actually typing.', {
        fontFamily: 'monospace', fontSize: '12px', color: IDE.dim
      }).setOrigin(0.5));

    const left = cx - 396;
    entries.forEach((e, i) => {
      const y = cy - 142 + i * 62;
      card.add(this.add.text(left, y, e.word, {
        fontFamily: 'monospace', fontSize: '17px', color: IDE.keyword, fontStyle: 'bold'
      }).setOrigin(0, 0.5));
      // DETAILED opens the deep panel for this pattern. Only offered when there
      // IS one — a button that opens an empty page is worse than no button — and
      // numbered, because this is a keyboard game and reaching for the mouse
      // mid-run is the thing every other screen here avoids.
      if (this.deepEntry(lang.name, e.word)) {
        const bx = cx + 396;
        const btn = this.add.text(bx, y, '[ ' + (i + 1) + ' · DETAILED ]', {
          fontFamily: 'monospace', fontSize: '12px', color: IDE.stringy
        }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
        btn.on('pointerover', () => btn.setColor(IDE.white));
        btn.on('pointerout', () => btn.setColor(IDE.stringy));
        btn.on('pointerdown', () => this.showDetailPanel(lang.name, e));
        card.add(btn);
      }
      card.add(this.add.text(left, y + 19, e.what, {
        fontFamily: 'monospace', fontSize: '12.5px', color: IDE.text,
        wordWrap: { width: 780 }
      }).setOrigin(0, 0.5));
      // examples are written multi-line in the glossary where the language needs
      // it (Python's indentation, Haskell's where-clause); the card is one row
      // per line, so flatten rather than let a stray newline shove the layout.
      card.add(this.add.text(left + 8, y + 38, e.ex.replace(/\s*\n\s*/g, ' ⏎ '), {
        fontFamily: 'monospace', fontSize: '12px', color: IDE.stringy,
        wordWrap: { width: 772 }
      }).setOrigin(0, 0.5));
    });

    // Say honestly why a pattern isn't here, and don't conflate the two reasons:
    // some were pushed out by the card's cap, some the glossary genuinely can't
    // explain. Claiming "no note" for a word that has one would be a lie the
    // player can catch by clearing the same level twice.
    const explained = Glossary.review(lang.name, words, 0).length;
    const unnoted = words.length - explained;
    const parts = [];
    parts.push(explained > entries.length
      ? 'showing ' + entries.length + ' of the ' + words.length + ' patterns you typed'
      : 'all ' + entries.length + ' patterns you typed this level');
    if (unnoted > 0) parts.push(unnoted + ' had no note yet');
    card.add(this.add.text(cx, cy + 172, parts.join('  ·  '), {
      fontFamily: 'monospace', fontSize: '11px', color: IDE.dim
    }).setOrigin(0.5));

    const btn = this.add.text(cx, cy + 196, '[ KEEP TYPING — ENTER ]', {
      fontFamily: 'monospace', fontSize: '17px', color: IDE.white, fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    card.add(btn);
    // kept short on purpose: centred at cx+250 it has ~480px of room before the
    // screen edge, and the longer wording ran straight off it.
    card.add(this.add.text(cx + 250, cy + 196, '1-5 detail  ·  N stop these', {
      fontFamily: 'monospace', fontSize: '11px', color: IDE.dim
    }).setOrigin(0.5));

    // the clock is stopped here on purpose. Everywhere else in this game a panel
    // keeps the countdown running (the bag, the shop, festivals) because pausing
    // was a free exploit — but this one is not a decision the player makes to
    // gain something, it's the game talking to them between levels, and charging
    // seconds for reading would just teach them to skip it.
    const close = (turnOff) => {
      if (this.learnKey === handler) this.learnKey = null;
      this.detailKey = null;   // a deep panel open over the card dies with it
      if (turnOff) Profile.setLearn(false);
      Sfx.blip();
      this.tweens.add({
        targets: card, alpha: 0, duration: 160,
        onComplete: () => { card.destroy(); done(); }
      });
    };
    const handler = (e) => {
      // the deep panel, while open, owns the keyboard — otherwise ENTER would
      // dismiss the card underneath it and drop the player back into the run.
      if (this.detailKey) { this.detailKey(e); return; }
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= entries.length && this.deepEntry(lang.name, entries[n - 1].word)) {
        this.showDetailPanel(lang.name, entries[n - 1]);
        return;
      }
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') close(false);
      else if (e.key === 'n' || e.key === 'N') close(true);
    };
    this.learnKey = handler;
    btn.on('pointerdown', () => close(false));

    card.setAlpha(0);
    this.tweens.add({ targets: card, alpha: 1, duration: 180 });
    Sfx.win();
  }

  // The deep layer lives in its own file (data/glossary_detail.js) so the review
  // card's data and the panel's data could be written independently. Guarded on
  // purpose: if that file is missing or failed to load, every DETAILED button
  // simply never appears and the review card behaves exactly as it did before —
  // a data file must never be able to black-screen the game.
  deepEntry(langName, word) {
    if (typeof GlossaryDetail === 'undefined' || !GlossaryDetail.get) return null;
    try { return GlossaryDetail.get(langName, word); } catch (e) { return null; }
  }

  // The second panel: one pattern, explained properly, with more code.
  //
  // The review card has room for one line per pattern, which is the right size
  // for "keep typing" but too small for anything you actually want to learn. So
  // the line is a door: press its number (or click DETAILED) and the pattern gets
  // the whole screen — a few sentences on what it is FOR and what people get
  // wrong about it, then several examples ordered simplest to most revealing.
  showDetailPanel(langName, entry) {
    const deep = this.deepEntry(langName, entry.word);
    if (!deep || this.detailKey) return;   // no data, or one is already open

    const cx = this.scale.width / 2, cy = this.scale.height / 2;
    const panel = this.add.container(0, 0).setDepth(80);
    panel.add(this.add.rectangle(cx, cy, this.scale.width, this.scale.height, 0x06050b, 0.95)
      .setInteractive());
    panel.add(this.add.rectangle(cx, cy, 880, 460, IDE.panel).setStrokeStyle(2, IDE.border));

    panel.add(this.add.text(cx - 410, cy - 202, entry.word, {
      fontFamily: 'monospace', fontSize: '26px', color: IDE.keyword, fontStyle: 'bold'
    }).setOrigin(0, 0.5));
    panel.add(this.add.text(cx + 410, cy - 202, langName, {
      fontFamily: 'monospace', fontSize: '14px', color: IDE.dim
    }).setOrigin(1, 0.5));
    panel.add(this.add.text(cx - 410, cy - 176, entry.what, {
      fontFamily: 'monospace', fontSize: '13px', color: '#dcdcaa', wordWrap: { width: 820 }
    }).setOrigin(0, 0.5));

    // The long text is variable-height, so lay the rest out from where it
    // actually ends rather than from a guessed constant — a four-sentence
    // explanation otherwise runs straight through the first example.
    const long = this.add.text(cx - 410, cy - 150, deep.long, {
      fontFamily: 'monospace', fontSize: '13.5px', color: IDE.text,
      wordWrap: { width: 820 }, lineSpacing: 5
    }).setOrigin(0, 0);
    panel.add(long);

    let y = cy - 150 + long.height + 18;
    panel.add(this.add.text(cx - 410, y, '// examples', {
      fontFamily: 'monospace', fontSize: '12px', color: IDE.comment
    }).setOrigin(0, 0));
    y += 20;

    // Stop before the footer rather than overflowing the panel: a pattern with
    // four long snippets would otherwise spill past the frame and off-screen.
    const limitY = cy + 176;
    (deep.examples || []).forEach(ex => {
      if (y > limitY) return;
      const t = this.add.text(cx - 396, y, ex, {
        fontFamily: 'monospace', fontSize: '12.5px', color: IDE.stringy,
        wordWrap: { width: 800 }, lineSpacing: 3
      }).setOrigin(0, 0);
      if (y + t.height > limitY) { t.destroy(); y = limitY + 1; return; }
      panel.add(t);
      y += t.height + 12;
    });

    const back = this.add.text(cx, cy + 202, '[ BACK — ESC ]', {
      fontFamily: 'monospace', fontSize: '16px', color: IDE.white, fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    panel.add(back);

    const close = () => {
      this.detailKey = null;
      Sfx.blip();
      panel.destroy();
    };
    // Any dismiss key closes only THIS panel — showLearnCard's handler defers to
    // detailKey while it is set, so the card underneath survives.
    this.detailKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ' ||
          e.key === 'b' || e.key === 'B') close();
    };
    back.on('pointerdown', close);
    Sfx.blip();
  }

  // --- boss fight at the end of every stage ---

  startBoss() {
    this.clearTransitionGuard();
    this.transitioning = false;
    // the fight gets its own bed — darker progression, a drum the ladder never
    // has — and beatBoss/death hand the language's music back.
    this.sfx('setBossMode', true);
    // The boss speaks EVERY language. It used to pick one at random, which made
    // it a wall built out of whichever language you happened not to know — and a
    // strange one to arrive at, since you only reach a boss by clearing all 25.
    // It should be the exam for that ladder, not a coin flip on one rung of it.
    // So its pool is the union of every language's patterns; anything you have
    // learned anywhere counts here.
    //
    // Merging it into a synthetic language object rather than special-casing the
    // boss everywhere means validity, the hint pool, the ASSIST rope and the
    // input's valid-prefix colouring all keep working through the one code path
    // they already use (activeLang).
    if (!this._allWords) {
      this._allWords = [...new Set(LANGUAGES.flatMap(l => l.words))];
    }
    const merged = {
      name: 'ALL LANGUAGES', color: IDE.error, abbr: '∀', icon: '☠',
      words: this._allWords,
      // between the ladder's easiest (1.0) and hardest (0.5): a boss pattern
      // shouldn't pay HTML rates just because `div` is in the merged pool
      timeMult: 0.7
    };
    // Anything counts for 1, so the bar has to be longer than the 15 that stood
    // when only one language's patterns did. The chain is still the fast way
    // through — five links kill 12 of these 24.
    //
    // Eased from 30 + 6/stage after "bosses are hard even on MEDIUM". Three
    // things stack against you here that no ordinary level has: the pool is all
    // 25 languages at once (nothing you have learned narrows it), the clock is
    // already whatever the last level left you, and the chain punishes a wrong
    // order by HEALING. 30 hits at MEDIUM was a long time to hold all three. The
    // shape is unchanged, just less of it — and the entry cushion below went from
    // +10 to +18 seconds, which is the half that actually decides the fight.
    const hp = 24 + this.stageIndex * 4;
    this.bossMode = {
      hp, max: hp, lang: merged,
      // the chain still comes from ONE real language, named on the line, so the
      // fight keeps something to aim at instead of being pure free typing
      chainLang: this.pickFrom(LANGUAGES),
      seq: null, seqAt: 0
    };
    this.blankPerfect();   // the boss is an interstitial — no perfect-pace tag
    this.found.clear();
    this.clearDeprecation();
    this.addTime(BOSS_ENTRY_TIME);
    this.strikeTimer = 0;
    this.battle.spawnBoss();
    this.refreshLangHud();
    this.feedback('BOSS FIGHT! every language counts — chase the chain for x3', IDE.error);
    this.shakeCam(200, 0.005);
    Sfx.hit();
    this.newBossSeq();
  }

  // --- boss exploit chain ---
  //
  // The boss used to be a normal level wearing a crown: same act, different word
  // list, HP instead of a target. Now it names three of its own patterns, in
  // order, on screen — an EXPLOIT CHAIN. Follow the chain and each link hits for
  // three HP instead of one and the clock jumps; any other valid pattern still
  // works but only chips, and breaking the order mid-chain lets the boss heal a
  // point. So the boss finally asks for something the levels never do: not "how
  // many patterns do you know" but "can you hit these three, in this order,
  // right now" — and it's readable to a player who knows nothing about the
  // language, which is the same accessibility bargain ASSIST makes.
  newBossSeq() {
    const b = this.bossMode;
    if (!b) return;
    // links come from the chain's own language, not the merged pool — three
    // patterns that belong together are a target; three drawn from 1200 mixed
    // ones would just be three more words.
    const pool = b.chainLang.words.filter(w => !this.found.has(w) && w.length >= 3);
    if (pool.length < 3) {
      b.chainLang = this.pickFrom(LANGUAGES);   // that language is used up — pick another
      const alt = b.chainLang.words.filter(w => !this.found.has(w) && w.length >= 3);
      if (alt.length < 3) { b.seq = null; this.refreshLangHud(); return; }
      b.seq = this.shuffle(alt.slice()).slice(0, 3);
      b.seqAt = 0;
      this.refreshBossSeq();
      return;
    }
    b.seq = this.shuffle(pool.slice()).slice(0, 3);
    b.seqAt = 0;
    this.refreshBossSeq();
  }

  refreshBossSeq() {
    const b = this.bossMode;
    if (!b || !b.seq) { this.hideEol(); return; }
    this.hideEol();
    this.eolText.setVisible(true);
    // Bracket the links that aren't live yet. One Text object can't colour words
    // individually, but brackets say "later" plainly enough — and the whole
    // out-of-order problem starts with three words that look equally typeable.
    const line = b.seq.map((w, i) =>
      i < b.seqAt ? '✓' : (i === b.seqAt ? '▶ ' + w : '[' + w + ']')).join('   ');
    // Name the language ON the chain line. It's already in the HUD's top-left
    // corner, but this line sits directly above the input where the eye actually
    // is during a fight — and a boss speaks a language picked at random from the
    // whole ladder, so "which language am I in" is the first thing a player needs
    // and the easiest thing to lose track of.
    this.eolText.setText(b.chainLang.name + ' EXPLOIT CHAIN:  ' + line)
      .setColor(b.seqAt > 0 ? '#dcdcaa' : IDE.error).setAlpha(1).setVisible(true);
    this.fitEol();
  }

  beatBoss() {
    this.transitioning = true;
    this.hideEol();
    this.armTransitionGuard(12, 'beatBoss');   // death anim + stage card ≈ 5s
    this.bossMode = null;
    // hand the bed back to the ladder. setBossMode(false) restores whatever
    // language was playing when the fight started — which is the LAST language
    // of the stage you have just left, not the first one of the stage you are
    // walking into. Measured: after a boss the music sat on the old language
    // until the first correct word of the new stage rebuilt the HUD label. So
    // re-apply explicitly, AFTER langIndex is back to 0 (this.lang reads it).
    this.sfx('setBossMode', false);
    this.langIndex = 0;
    this.applyMusicProfile();
    this.levelMistakes = 0;   // the fresh stage's first level starts clean
    this.found.clear();   // boss words must not carry into the fresh level
    this.clearDeprecation();
    // Cushion the victory: a boss can be beaten with ~1s left, and the next
    // stage restarts at langIndex 0 with higher targets and a new monster — so
    // without a floor you're dumped into a harder stage at near-death, an
    // instant, unfair-feeling loss. Give at least BOSS_WIN_TIME to settle in.
    if (this.timeLeft < BOSS_WIN_TIME) this.timeLeft = BOSS_WIN_TIME;
    if (this.stageIndex < STAGES.length - 1) this.stageIndex++;
    else this.survivalLap++;
    this.saveCheckpoint();   // reaching a new stage is a checkpoint
    this.shakeCam(350, 0.01);
    Sfx.win();
    this.battle.bossDie(() => {
      this.showStage(() => {
        this.clearTransitionGuard();
        this.transitioning = false;
        this.battle.clearBoss();
        this.refreshLangHud();
      });
    });
  }

  showPath(fromIdx, done, perfect, perfectScore, festival) {
    const cx = this.scale.width / 2, cy = 250;
    // A festival is a place you went, so it gets a stop on the road between the
    // language that fell and the one coming — HTML -> FESTIVAL -> CSS — instead
    // of being a banner that happened and left no trace. The strip opens up from
    // 230 to 290 only on those transitions: the stop needs a gap it can sit in
    // (290 - 170 = 120 wide) and the language nodes must not get closer to it
    // than they are to each other. 170 + 2*290 = 750, still inside 960.
    const spacing = festival ? 290 : 230;

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

    // Smaller than a language node on purpose: it reads as somewhere you passed
    // through, not as one of the 25. No badge either — those belong to languages.
    const mkFest = (kind) => {
      const node = this.add.container(spacing / 2, 0);
      const box = this.add.rectangle(0, 0, 96, 54, IDE.panel).setStrokeStyle(2, 0xdcdcaa);
      node.add(box);
      node.add(this.add.text(0, -12, kind === 'growth' ? 'GROWTH' : 'SOFTWARE', {
        fontFamily: 'monospace', fontSize: '10px', color: IDE.dim
      }).setOrigin(0.5));
      node.add(this.add.text(0, 6, 'FESTIVAL', {
        fontFamily: 'monospace', fontSize: '11px', color: '#dcdcaa', fontStyle: 'bold'
      }).setOrigin(0.5));
      node.box = box;
      strip.add(node);
      return node;
    };

    const prev = fromIdx > 0 ? mkNode(fromIdx - 1, -spacing, 0.55) : null;
    if (prev) prev.box.setStrokeStyle(2, IDE.greenHex);
    const cur = mkNode(fromIdx, 0, 1);
    cur.box.setStrokeStyle(3, 0xffffff);
    const next = mkNode(fromIdx + 1, spacing, 0.45);
    const fest = festival ? mkFest(festival) : null;

    // Echo the HUD's descending "N to boss" counter here, so the "Count Down"
    // theme is felt at every level-clear transition — not only in the corner HUD.
    // The road you're sliding onto is the DESTINATION level (fromIdx + 1), so the
    // count matches what refreshLangHud will show the instant the overlay clears
    // (both use LANGUAGES.length - 1 - <that level's index>). It ticks 24 → 0 down
    // the stage and reads "the road fills — BOSS awaits" on the last language (the
    // level that ends the stage), mirroring the HUD's "⚔ BOSS NEXT". stageIndex is
    // unchanged across a level-clear (only a boss raises it), so the stage name is
    // still the current one. Static per-transition; it lives on the fading overlay.
    const toBoss = LANGUAGES.length - 1 - (fromIdx + 1);
    const stageName = STAGES[this.stageIndex].name;
    overlay.add(this.add.text(cx, cy + 110, toBoss <= 0
      ? '⚔ the road fills — the ' + stageName + ' BOSS awaits'
      : toBoss + ' language' + (toBoss === 1 ? '' : 's') + ' down the road to the ' +
        stageName + ' boss', {
        fontFamily: 'monospace', fontSize: '15px', color: '#dcdcaa', fontStyle: 'bold'
      }).setOrigin(0.5));

    // --- the epitaph -------------------------------------------------------
    //
    // The run had a prologue and an ending and NOTHING in between: twenty-five
    // languages fell and the game never said a word about any of them. This is
    // that missing beat — one line, the obituary of the language you just
    // cleared, from inside a career that watched it happen (`epitaph` in
    // languages.js). It lands with the ✓ rather than with the overlay, so the
    // player reads the tick first and the sentence second.
    //
    // y=402: the road strip's badges bottom out around 316 and the "N languages
    // down the road" line sits at cy+110 = 360, so this is the first clear band
    // under both, with the overlay's own bottom edge far below it. 14px keeps a
    // 78-character line (the data's hard cap) at ~655px inside a 960 canvas
    // (measured across all 25: the widest, PERL, renders at 570px).
    //
    // And it LEAVES before the boon draft arrives. offerBoons() paints its three
    // cards onto this same overlay at 4600ms, over y≈322..442 — measured, the
    // cards land squarely on top of this line. So the epitaph gets the screen to
    // itself from 1.0s to 4.3s and is gone by the time the cards drop: 3.3
    // seconds is long enough to read one sentence and short enough that nobody
    // waiting to pick a boon is kept waiting by it.
    const fallen = LANGUAGES[fromIdx];
    if (fallen && fallen.epitaph) {
      const ep = this.add.text(cx, 402, '// ' + fallen.epitaph, {
        fontFamily: 'monospace', fontSize: '14px', color: IDE.comment
      }).setOrigin(0.5).setAlpha(0);
      overlay.add(ep);
      this.tweens.add({ targets: ep, alpha: 1, duration: 700, delay: 1000 });
      this.tweens.add({ targets: ep, alpha: 0, duration: 400, delay: 4300 });
    }

    this.tweens.add({ targets: overlay, alpha: 1, duration: 400 });

    this.time.delayedCall(1000, () => {
      cur.box.setStrokeStyle(3, IDE.greenHex);
      cur.add(this.add.text(70, -24, '✓', {
        fontFamily: 'monospace', fontSize: '22px', color: IDE.comment, fontStyle: 'bold'
      }).setOrigin(0.5));
      Sfx.pickup();
    });

    // ...and the stop ticks 400ms behind the language, so the eye reads them in
    // the order they were played rather than lighting up together.
    if (fest) {
      this.time.delayedCall(1400, () => {
        fest.box.setStrokeStyle(2, IDE.greenHex);
        fest.add(this.add.text(34, -18, '✓', {
          fontFamily: 'monospace', fontSize: '14px', color: IDE.comment, fontStyle: 'bold'
        }).setOrigin(0.5));
        Sfx.blip();
      });
    }

    this.time.delayedCall(2200, () => {
      const incoming = fromIdx + 2 < LANGUAGES.length
        ? mkNode(fromIdx + 2, spacing * 2, 0) : null;
      const slide = { x: '-=' + spacing, duration: 1000, ease: 'Cubic.easeInOut' };
      this.tweens.add({ targets: [cur, next], ...slide });
      if (fest) {
        this.tweens.add({ targets: fest, ...slide });
        this.tweens.add({ targets: fest, alpha: 0.5, duration: 1000 });
      }
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

    this.time.delayedCall(4600, () => this.offerBoons(overlay, done));
  }

  // --- boon draft (the level-clear screen's one decision) ---

  // Every level asks the same thing of the player: type these words, faster.
  // There was no point in the whole run where they CHOSE anything — items are
  // found or bought, never weighed against each other. The road overlay is
  // already a natural pause between levels, so it ends on a three-card draft:
  // one permanent upgrade, picked from a shuffled pool, keyboard (1-3) or mouse.
  // Runs stay different from each other, and a run develops a shape.
  boonDeck() {
    return [
      { key: 'time', name: 'FASTER COMPILER', desc: '+0.6s from every\npattern you write',
        apply: () => { this.boonTime += 0.6; } },
      { key: 'credit', name: 'OPEN SOURCE', desc: '+3 credits from\nevery pattern',
        apply: () => { this.boonCredit += 3; } },
      { key: 'target', name: 'SCOPE CUT', desc: 'every level target\n12% lower',
        apply: () => { this.boonTarget *= 0.88; } },
      { key: 'lts', name: 'LTS RELEASE', desc: 'deprecation notices\nlast 3s longer',
        apply: () => { this.boonEol += 3; } },
      { key: 'hints', name: 'STACK OVERFLOW', desc: '+3 free hints,\nand hints cost 5 less',
        apply: () => { this.hintTokens += 3; this.boonHint += 5; } },
      { key: 'combo', name: 'HOT PATH', desc: 'combo x3 arrives at\n10 instead of 15',
        apply: () => { this.boonCombo = true; } },
      { key: 'refill', name: 'NIGHTLY BUILD', desc: '+8s at the start of\nevery level',
        apply: () => { this.boonRefill += 8; } }
    ];
  }

  offerBoons(overlay, done) {
    // the draft waits on a human, so the transition guard has to outlast the
    // auto-pick below rather than tearing the overlay down on top of them.
    this.armTransitionGuard(30, 'boon draft');
    const finish = () => {
      this.boonKey = null;
      this.tweens.add({
        targets: overlay, alpha: 0, duration: 400,
        onComplete: () => { overlay.destroy(); done(); }
      });
    };

    const cards = this.shuffle(this.boonDeck()).slice(0, 3);
    const cx = this.scale.width / 2;
    overlay.add(this.add.text(cx, 330, '// pick one — it lasts the whole run', {
      fontFamily: 'monospace', fontSize: '15px', color: IDE.comment
    }).setOrigin(0.5));

    const take = (i) => {
      if (!this.boonKey) return;       // one pick only, and not after the timeout
      const b = cards[i];
      b.apply();
      this.boons.push(b.name);
      this.boonKey = null;
      Sfx.win();
      this.feedback('gained ' + b.name, '#dcdcaa');
      finish();
    };

    cards.forEach((b, i) => {
      const x = cx - 230 + i * 230, y = 410;
      const card = this.add.rectangle(x, y, 200, 118, IDE.panel)
        .setStrokeStyle(2, IDE.border).setInteractive({ useHandCursor: true });
      overlay.add(card);
      overlay.add(this.add.text(x - 88, y - 46, String(i + 1), {
        fontFamily: 'monospace', fontSize: '13px', color: IDE.dim, fontStyle: 'bold'
      }).setOrigin(0, 0.5));
      overlay.add(this.add.text(x, y - 28, b.name, {
        fontFamily: 'monospace', fontSize: '15px', color: IDE.keyword, fontStyle: 'bold'
      }).setOrigin(0.5));
      overlay.add(this.add.text(x, y + 16, b.desc, {
        fontFamily: 'monospace', fontSize: '13px', color: IDE.text, align: 'center', lineSpacing: 4
      }).setOrigin(0.5));
      card.on('pointerover', () => card.setStrokeStyle(2, IDE.white));
      card.on('pointerout', () => card.setStrokeStyle(2, IDE.border));
      card.on('pointerdown', () => take(i));
    });

    // onKey routes 1-3 here while boonKey is set (word input is dead behind the
    // overlay anyway, since `transitioning` is still true).
    this.boonKey = take;
    // …but never let the draft be the thing that stalls a run: if the player is
    // away from the keyboard, take the first card and carry on. The transition
    // guard would otherwise fire and leave the overlay up over live play.
    this.time.delayedCall(20000, () => { if (this.boonKey) take(0); });
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

  startFestival(type, then) {
    // The main clock keeps draining under the festival (see update) — that's
    // real risk by design, but it must not open the round already-dead: a
    // level-up can land the player at a near-zero clock a split second before
    // the 35% festival roll fires, so they'd get a "type a pattern!" prompt
    // with no realistic chance to answer. Floor it, same pattern as
    // BOSS_WIN_TIME; the ongoing stall-and-die risk mid-round is untouched.
    if (this.timeLeft < FESTIVAL_MIN_TIME) this.timeLeft = FESTIVAL_MIN_TIME;

    const cx = this.scale.width / 2;
    // growth asks "which language is this?", so its pool can only contain
    // languages that have signature patterns to ask about
    const source = type === 'growth'
      ? LANGUAGES.filter(l => (l.signatures || []).length) : LANGUAGES.slice();
    const pool = this.shuffle(source).slice(0, 6);

    const c = this.add.container(0, 0).setDepth(5).setAlpha(0);
    c.add(this.add.text(cx, 150,
      type === 'sw' ? '★ SOFTWARE FESTIVAL ★' : '★ GROWTH FESTIVAL ★', {
        fontFamily: 'monospace', fontSize: '22px', color: '#dcdcaa', fontStyle: 'bold'
      }).setOrigin(0.5));
    const spacing = 92, x0 = cx - (pool.length - 1) * spacing / 2;
    const badges = pool.map((lang, i) => {
      const b = UI.badge(this, x0 + i * spacing, 192, lang, 18);
      c.add(b);
      // Name every badge. The growth round asks you to TYPE a language's name
      // while showing you a camel, an elephant and a lambda — that's a quiz on
      // mascot trivia sitting in front of the actual question, and it's the same
      // recall problem ASSIST exists to solve. The names are the answer SET, not
      // the answer: you still have to know which one owns the pattern.
      c.add(this.add.text(x0 + i * spacing, 224, lang.name.toLowerCase(), {
        fontFamily: 'monospace', fontSize: '11px',
        color: type === 'growth' ? IDE.text : IDE.dim
      }).setOrigin(0.5));
      return b;
    });
    const prompt = this.add.text(cx, 252, '', {
      fontFamily: 'monospace', fontSize: '16px', color: IDE.text, fontStyle: 'bold'
    }).setOrigin(0.5);
    c.add(prompt);
    // the main clock keeps draining under the festival now (see update) — this
    // in-banner readout warns that, and shows how long the round itself lasts.
    const clock = this.add.text(cx, 278, '', {
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
      // what to run when the round is over. On a level-clear festival this is
      // the road overlay into the next language — the festival is a section, and
      // finishing it is what moves you on. Never called on the death teardown.
      then: then || null,
      timeLeft: FESTIVAL_TIME, count: 0, clockSec: -1
    };

    this.battle.setVisible(false);
    this.blankPerfect();   // the festival is an interstitial — no perfect-pace tag
    // the banner says which festival this is, in 22px, in the middle of the
    // screen — the HUD line saying it a second time is just noise. Use the slot
    // for the thing the banner does NOT say: what a correct answer is worth.
    this.langText.setText('+' + FESTIVAL_TIME_BONUS + 's · +' + FESTIVAL_CREDIT +
      ' credits per answer').setColor('#dcdcaa');
    // we've just clobbered the gated LEVEL/STAGE labels; force endFestival's
    // refreshLangHud() to rebuild them (the langIndex/stage is otherwise unchanged
    // across the festival, so the label-key gate would skip the restore).
    this._hudLabelKey = null;
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
    // Signatures only (LANG_SIGNATURES in data/languages.js). The old filter
    // asked for a word no OTHER POOLED language listed — which let through
    // "tuple" (only PYTHON's array has it) and then told a player who answered
    // C++ they were wrong, with std::tuple sitting in the standard library. The
    // question is only fair for patterns that genuinely belong to one language,
    // so those are the only ones it may ask.
    //
    // A festival ends when its own timer runs out, and at no other time. It used
    // to be able to end itself here, and did so routinely: the six pooled
    // languages own only ~22 signatures between them, the answers are language
    // NAMES (`c`, `java`, `rust` — two to six characters), and anyone who knows
    // them answers faster than one a second. So the board ran dry around the
    // halfway mark and the round just stopped, with ten seconds still on its
    // clock, having neither expired nor been failed. Measured: 22 answers, ended
    // at t=19.2s. It looked exactly like the game skipping ahead.
    //
    // Two changes. The board now RECYCLES instead of ending — you have already
    // answered those, and asking again in a speed round is no worse than the sw
    // festival, which repeats freely by design. And the pick is now deterministic
    // (build the set of languages that still have an unasked signature, then draw
    // from it) rather than up to 25 blind random draws that could also miss a
    // live language by luck alone and end the round for no reason at all.
    let live = f.pool.filter(l => (l.signatures || []).some(w => !f.used.has(w)));
    if (!live.length) {
      // wipe the board, but never ask the same word twice in a row across the
      // seam — that reads as a bug even though it isn't.
      const justAsked = f.word;
      f.used.clear();
      if (justAsked) f.used.add(justAsked);
      live = f.pool.filter(l => (l.signatures || []).some(w => !f.used.has(w)));
      this.feedback('board cleared — going again', '#dcdcaa');
    }
    // Unreachable: the growth pool is built only from languages that HAVE
    // signatures, so a recycled board always has at least one live language.
    // Kept as a last resort so a future pool change can't strand the round.
    if (!live.length) { this.endFestival(); return; }
    const lang = this.pickFrom(live);
    const word = this.pickFrom(lang.signatures.filter(w => !f.used.has(w)));
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
    if (silent) return;   // torn down by the death path: no summary, no continuation
    this.feedback('festival over — ' + f.count + ' answers, +' +
      (f.count * FESTIVAL_CREDIT) + ' credits', '#dcdcaa');
    Sfx.hint();
    // hand back to whatever queued the festival (the level-clear road). Delayed
    // so the summary line and the banner fade are seen before the overlay covers
    // the field, rather than being wiped on the same frame.
    if (f.then) this.time.delayedCall(700, f.then);
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

    // One hint at a time, HINT_COOLDOWN apart. Credits come in at ~5 a word
    // against a 20-credit hint, so an uncapped button was a stream of answers
    // for four words' work — ten hints in one second, measured — while ASSIST
    // next to it is rationed to one short pattern per 40s. The button was the
    // back door out of that rule.
    if (this.elapsed < this._hintNextAt) {
      this.feedback('hint recharging — ' +
        Math.ceil(this._hintNextAt - this.elapsed) + 's', IDE.dim);
      Sfx.blip();
      return;
    }

    let w;
    if (this.festival && this.festival.type === 'growth') {
      w = this.festival.lang.name.toLowerCase();
    } else {
      let remaining = this.activeLang.words
        .filter(x => !this.activeFound.has(x) && !this.dead.has(x));
      // nothing left to hint at — say so instead of eating the click silently
      // (no credits are spent either way; the charge happens below).
      if (remaining.length === 0) {
        this.feedback('every ' + this.activeLang.name + ' pattern is already written', IDE.dim);
        Sfx.blip();
        return;
      }
      // A one-character pattern can't be hinted at without simply being handed
      // over, so keep those out of the pool while anything longer is left.
      const longer = remaining.filter(x => x.length > 1);
      if (longer.length) remaining = longer;
      if (this.eol && remaining.includes(this.eol.word)) {
        // a pattern is on its deprecation notice right now: that's the one worth
        // paying for — it's about to be unwritable, and it pays double if caught
        w = this.eol.word;
      } else if (this.typed) {
        // hint on what the player is actually reaching for, if anything matches
        const m = remaining.filter(x => x.startsWith(this.typed));
        w = m.length ? this.pickFrom(m) : this.pickFrom(remaining);
      } else {
        // otherwise the most valuable thing left: score scales with length
        w = remaining.slice().sort((a, b) => b.length - a.length)[0];
      }
    }

    if (free) this.hintTokens--; else this.credits -= cost;
    this._hintNextAt = this.elapsed + HINT_COOLDOWN;
    this.refreshCredits();
    // floor, not ceil, and never the whole pattern: at ceil a 1-2 character
    // pattern came out fully revealed ("p" hinted as "p"), which isn't a hint,
    // it's the answer with a price tag.
    const shown = Math.max(1, Math.floor(w.length / 2));
    const masked = (w.slice(0, shown) + '_'.repeat(Math.max(1, w.length - shown)))
      .split('').join(' ');
    this.hintText.setText('// hint: ' + masked);
    // The hint no longer types itself into the input. It used to write the
    // revealed half for you — which turned a 1-character pattern into a free
    // word (hint, then ENTER) and, worse, threw away whatever you were already
    // typing: mid-"func", a hint replaced it with "ima". You get the letters;
    // you still do the typing.
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
      // total seconds your play clawed back from the countdown this run — the
      // most on-theme end stat a Count Down game has (see addTime).
      bought: Math.round(this.timeBought),
      // total active play time held off the clock — the survival headline for a
      // "Count Down" game. this.elapsed excludes paused/transition time (it's the
      // same clock the wpm divisor uses), so it reads as time actually SPENT racing
      // the countdown, not wall time. EndScene formats it M:SS.
      time: Math.round(this.elapsed),
      // The second countdown's own score, which the End screen never received:
      // how many patterns were deprecated out from under you, and how many you
      // got to first. They have been tallied since the mechanic was written
      // (deprecatedCount/rescuedCount) and were simply never passed — so the run
      // ended on wpm and accuracy, the two numbers any typing game can print,
      // while the one pair that belongs to THIS game stayed in the scene.
      deprecated: this.deprecatedCount,
      rescued: this.rescuedCount,
      daily: this.daily
    });
  }

  // --- UI helpers ---

  // Camera shake, gated by the reduced-motion setting (settings gear → SCREEN
  // SHAKE). All four shake sites (level-up, boss spawn, boss kill, death) route
  // through here so one toggle silences them; the death red-flash is left alone
  // (it's a flash, not shake, and reads as the fail state even with shake off).
  shakeCam(duration, intensity) {
    if (Motion.shake) this.cameras.main.shake(duration, intensity);
  }

  // Dead-man's switch for the transition state. While `transitioning` is true the
  // countdown stops AND every key is ignored (see update / onKey), so a level-up,
  // boss kill or road overlay that never calls its completion callback doesn't
  // fail loudly — it just leaves the player holding a frozen game, which in a jam
  // is indistinguishable from a crash. Every path that sets transitioning=true
  // arms this alongside it; the callback that clears the flag disarms it. Timed
  // generously (the road overlay alone runs ~5s) so it can only ever fire on a
  // genuinely lost callback, never on a slow one.
  armTransitionGuard(seconds, label) {
    if (this._transGuard) this._transGuard.remove(false);
    this._transGuard = this.time.delayedCall(seconds * 1000, () => {
      if (!this.transitioning || this.over) return;
      this.transitioning = false;
      this.battle.setVisible(true);
      this.refreshLangHud();
      this.refreshInput();
      this.feedback('…resuming', IDE.dim);
      console.warn('transition guard fired:', label);
    });
  }

  clearTransitionGuard() {
    if (this._transGuard) { this._transGuard.remove(false); this._transGuard = null; }
  }

  typedColor() {
    if (!this.typed) return IDE.text;
    const f = this.festival;
    if (f && f.type === 'growth') {
      const names = f.names;   // precomputed once at startFestival (fixed pool)
      if (names.includes(this.typed)) return IDE.keyword;
      if (names.some(n => n.startsWith(this.typed))) return IDE.text;
      return IDE.error;
    }
    if (this.dead.has(this.typed)) return IDE.error;
    if (this.activeLang.words.includes(this.typed)) {
      return this.activeFound.has(this.typed) ? IDE.dim : IDE.keyword;
    }
    if (this.activeLang.words.some(w => w.startsWith(this.typed))) return IDE.text;
    return IDE.error;
  }

  refreshInput() {
    // refreshInput fires on EVERY keystroke (type/backspace/submit) — the fastest
    // UI churn in the game. setText must run (the text genuinely changes each key),
    // but Phaser's Text.setColor re-renders the glyph canvas even when the color is
    // unchanged, and the validity color only flips at word boundaries (valid-prefix
    // ↔ invalid ↔ complete) — unchanged on the vast majority of keystrokes. Gate it
    // on the computed color, the same per-word re-raster gate the timer / HUD labels
    // / credits / best-combo readouts already use, so most keys re-raster once (the
    // setText), not twice.
    this.inputText.setText(this.typed);
    const col = this.typedColor();
    if (col !== this._inputColor) { this._inputColor = col; this.inputText.setColor(col); }
    this.cursor.x = this.inputText.x + this.inputText.width + 4;
    this.refreshAssist();
  }

  // The ASSIST shelf (see ui.js). Called from refreshInput — the one call every
  // state change funnels through, so the shelf can never show a stale language —
  // and once a second from update(), since the trigger is time-based and a
  // player who is truly stuck isn't pressing any keys to refresh it.
  // Deliberately silent during a growth festival: the six candidate languages
  // are already on screen as badges, so a list would just be the answer.
  refreshAssist() {
    if (!this.assistText) return;
    const live = Assist.on && !this.over && !this.dying && !this.paused &&
      !(this.festival && this.festival.type === 'growth');

    // Retire the current rope once it's been typed, once its language changed
    // out from under it (level up / boss / festival), or once its time is up.
    if (this._sosWord && (!live || this.elapsed >= this._sosUntil ||
        this._sosLang !== this.activeLang || this.activeFound.has(this._sosWord))) {
      this._sosWord = null;
    }

    // Throw a new one only if the cooldown has expired. Note the cooldown is
    // charged from the moment a rope is GIVEN, not from when it expires, and it
    // never resets on a level or stage change — otherwise stalling through the
    // transitions would hand out one per level.
    if (live && !this._sosWord && this.elapsed >= this._sosNextAt) {
      const drowning = this.timeLeft <= SOS_TIME ||
        (this.elapsed - this._lastLandAt) >= SOS_IDLE;
      const L = this.activeLang;
      if (drowning && L) {
        const rem = L.words.filter(w => !this.activeFound.has(w) && !this.dead.has(w));
        const short = rem.filter(w => w.length <= SOS_LEN);
        // shortest available, so the rope is always the cheapest word on offer
        const pick = (short.length ? short : rem).sort((a, b) => a.length - b.length)[0];
        if (pick) {
          this._sosWord = pick;
          this._sosLang = L;
          this._sosUntil = this.elapsed + SOS_SHOW;
          this._sosNextAt = this.elapsed + SOS_COOLDOWN;
        }
      }
    }

    const str = this._sosWord ? '// stuck? try:  ' + this._sosWord : '';
    if (str === this._assistStr) return;
    this._assistStr = str;
    this.assistText.setText(str);
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

  // --- audio bridge ------------------------------------------------------
  //
  // The synth's new voices (deprecation stingers, per-language music profiles,
  // the boss bed, the low-clock heartbeat) live in sfx.js and are consumed only
  // from here. They are called through this one guard on purpose: a voice that
  // is missing — an older cached sfx.js served by itch out of the browser cache,
  // a half-loaded script — must degrade to SILENCE, never to a TypeError thrown
  // in the middle of a run. Sound is a fifth of the score; a black screen is all
  // of it.
  sfx(name, ...args) {
    const fn = Sfx[name];
    if (typeof fn === 'function') fn.apply(Sfx, args);
  }

  // Each language carries its own musical identity (root, progression, waves —
  // see `music` in languages.js), so the ladder audibly descends from bright
  // HTML into cold Assembly instead of running one loop over all 25. The profile
  // swap is seamless (the loop keeps its step), so this can fire on any level
  // change without a click. A language with no `music` block falls back to the
  // engine's default, which is exactly the old sound.
  applyMusicProfile() {
    const l = this.lang;
    this.sfx('setMusicProfile', l ? l.music : null);
  }

  refreshLangHud() {
    // tempo only steps with the stage/lap, but this runs on every correct word —
    // gate the (otherwise redundant) setMusicTempo call on the computed value.
    // Tempo starts from the LANGUAGE's own tempo, not a flat 94. languages.js
    // carries a bpm per language that climbs 84 (HTML) to 120 (ASSEMBLY) — the
    // audible half of "the ladder gets colder as it gets harder" — and it had no
    // consumer at all: every language played at the same speed and only the
    // stage moved it. The stage/lap steps still stack on top, and the whole
    // thing is capped so a late survival lap cannot run the loop into a blur.
    //
    // A boss overrides it: the fight is the one place the ladder's own tempo is
    // not the point, and a step up in speed is half of why a boss reads as one.
    //
    // this.lang is undefined for exactly one moment — the road has just filled
    // (langIndex === LANGUAGES.length) and startBoss has not run yet — so this
    // reads defensively rather than trusting the getter.
    const lm = this.lang && this.lang.music;
    const baseBpm = this.bossMode ? 116 : (lm && isFinite(lm.bpm) ? lm.bpm : 94);
    const bpm = Math.min(168, baseBpm + this.stageIndex * 8 + this.survivalLap * 4);
    if (bpm !== this._hudBpm) { this._hudBpm = bpm; Sfx.setMusicTempo(bpm); }
    if (this.bossMode) {
      this.langText.setText('BOSS · ' + this.bossMode.lang.name).setColor(IDE.error);
      // surface how many un-typed patterns remain: boss words dedupe into
      // this.found, so a player with the HP bar alone can't see a starving pool
      // coming and just eats "already typed" rejections with the clock draining.
      // no "patterns left" any more: the merged pool is ~1200 deep, so the number
      // was neither a warning nor information. Say what the fight actually wants.
      this.stageText.setText('defeat the boss! HP ' + this.bossMode.hp + '/' + this.bossMode.max +
        ' · any language counts · chain = ×3');
      this.progressFill.width = 180 * Math.max(0, this.bossMode.hp / this.bossMode.max);
      this.progressFill.fillColor = 0xf44747;
      this.updateLangBadge('boss:' + this.bossMode.lang.name, this.bossMode.lang);
      return;
    }
    // The LEVEL/STAGE labels and the bar's fill color are constant for the whole
    // level, but this method fires on every correct word — and setText/setColor
    // re-raster the glyph texture (and HexStringToColor allocates + parses) each
    // call. Rebuild them only when the level/stage/lap changes; the same setText
    // re-raster gate the timer, festival clock and best-combo readouts already
    // use. Only the progress-bar WIDTH genuinely changes per word (score), so it
    // stays ungated below. Invalidated to null by startFestival/startBoss, which
    // clobber langText with their own text, so leaving them forces a full rebuild.
    const labelKey = this.langIndex + ':' + this.stageIndex + ':' + this.survivalLap;
    if (labelKey !== this._hudLabelKey) {
      this._hudLabelKey = labelKey;
      // The one place that already knows "the level actually changed" — and it
      // is invalidated (to null) by startFestival/startBoss, so coming back off
      // a boss re-applies the language's music without its own call site.
      this.applyMusicProfile();
      const rl = this.lang.rule ? '  ⚑ ' + LANG_RULES[this.lang.rule].label : '';
      this.langText.setText('LEVEL ' + (this.langIndex + 1) + '/' + LANGUAGES.length +
        ' · ' + this.lang.name + rl)
        .setColor(this.lang.color);
      // The theme is "Count Down", but every progression number counts UP (LEVEL
      // 1→25, STAGE names rising). Surface the one descending counter the road
      // hides: languages LEFT before this stage's boss, ticking 24→0 and resetting
      // each stage — the road read as a countdown, not a climb. On the last
      // language (fills the road → boss) it reads BOSS NEXT instead of "0 to boss".
      const toBoss = LANGUAGES.length - 1 - this.langIndex;
      const bossTag = toBoss <= 0 ? ' · ⚔ BOSS NEXT' : ' · ' + toBoss + ' to boss';
      this.stageText.setText('STAGE ' + STAGES[this.stageIndex].name +
        (this.survivalLap > 0 ? ' · LAP ' + (this.survivalLap + 1) : '') +
        ' · target ' + this.targetScore() + bossTag);
      this.progressFill.fillColor = Phaser.Display.Color.HexStringToColor(this.lang.color).color;
    }
    this.progressFill.width = 180 * Math.min(1, this.score / this.targetScore());
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
    // refresh the live PERFECT-pace tag with the rest of the per-word HUD (self-
    // gated, so it re-rasters only on an on/idle change). Boss uses the early
    // return above; festivals blank it via blankPerfect and never reach here.
    this.refreshPerfect();
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
    // This runs on EVERY landed word (the fastest scoring path), but Text.setText
    // re-rasters the glyph texture every call — and the hint label ('[ HINT -20 ]')
    // and the effect line ('' with no buff up) are constant across most words. Gate
    // each setText on its computed string so only genuine changes re-raster, the
    // same per-word gate the timer/HUD-label/best-combo readouts already use. The
    // credit number really does change most words, so gate
    // it too and the capped-100/100 tail stops re-rastering. setAlpha only tints —
    // it doesn't re-raster — so it stays ungated.
    const creditStr = 'CREDITS ' + this.fmtC(this.credits);
    if (creditStr !== this._creditStr) { this._creditStr = creditStr; this.creditText.setText(creditStr); }
    // the cooldown has to be on the button, not just in the rejection message —
    // a button that answers a click with "no" and looks unchanged reads as broken
    const cooling = Math.max(0, Math.ceil(this._hintNextAt - this.elapsed));
    // while cooling, still say how many free hints are banked — the count is the
    // scroll you spent an item slot on, and hiding it reads as having lost it
    const hintStr = cooling > 0
      ? (this.hintTokens > 0
        ? '[ HINT FREE ×' + this.hintTokens + ' · ' + cooling + 's ]'
        : '[ HINT ' + cooling + 's ]')
      : (this.hintTokens > 0
        ? '[ HINT FREE ×' + this.hintTokens + ' ]'
        : '[ HINT -' + this.hintCost + ' ]');
    if (hintStr !== this._hintStr) { this._hintStr = hintStr; this.hintBtn.setText(hintStr); }
    this.hintBtn.setAlpha(cooling > 0 ? 0.4
      : (this.hintTokens > 0 || this.credits >= this.hintCost ? 1 : 0.4));
    const fx = [];
    if (this.multWords > 0) fx.push('×' + this.creditMult + ' credits (' + this.multWords + 'w)');
    if (this.deathSave > 0) fx.push('SAVE ' + this.deathSave + 's');
    const effectStr = fx.join('  ·  ');
    if (effectStr !== this._effectStr) { this._effectStr = effectStr; this.effectText.setText(effectStr); }
  }

  refreshBag() {
    this.bagBtn.setText('[ BAG ' + this.inventory.length + '/' + Items.slots + ' ]');
    // Keep SHOP just past BAG's real rendered width. The fixed x=130 collides
    // with a two-digit bag count ('[ BAG 12/12 ]' reaches ~x=133), so anchor it
    // to bagBtn.width instead — robust to the count and to Items.slots changes.
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
    // Two pops fired in the same beat used to land on the same pixel and read as
    // one garbled line — and the pair that collides is the game's own best
    // moment: "SAVED FROM DEPRECATION! ×2" spawns in the same frame as the score
    // pop that rescue just paid, so the one message the whole game is built
    // around arrived unreadable. A pop that lands while another is still fresh
    // stacks above it instead. Capped at two rows: higher than that and it would
    // climb into the battle strip.
    const fresh = this.time.now - (this._floatAt || -99999) < 260;
    this._floatStack = fresh ? Math.min(2, (this._floatStack || 0) + 1) : 0;
    this._floatAt = this.time.now;
    t.setText(msg).setPosition(this.panel.x, this.panel.y - 50 - this._floatStack * 26).setAlpha(1);
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

  // the pause overlay's key legend, including the live SOUND state so the M-mute
  // toggle reads. Rebuilt on pause-open (the gear could have changed it mid-run)
  // and on each M press.
  // Relabel the pause buttons and lay the row out. Labels carry live state
  // (SOUND: OFF, ASSIST: ON…), so their widths change as they are pressed —
  // which means the row has to be measured and re-centred every refresh rather
  // than positioned once. Cheap: five short texts, only on pause-open and on a
  // press, never per frame.
  refreshPauseHint() {
    if (!this.pauseBtns) return;
    // Fit the row to the screen, don't let it run off the edges.
    //
    // Five buttons whose labels carry live state (SOUND: OFF is wider than
    // SOUND: ON) measured out to more than 960px and the outer two hung off the
    // canvas — unreachable, since a button you cannot see is a button you cannot
    // press. The row is laid out at its natural size first, then the whole thing
    // is scaled down uniformly if it overruns the usable width. Scaling beats
    // shrinking the font: the hit areas scale with it, and the labels stay
    // pixel-crisp instead of re-rasterising at fractional sizes.
    const pad = 14, gap = 10;
    const usable = Math.min(this.scale.width - 24, (this.pausePanelW || this.scale.width) - 32);
    const ws = this.pauseBtns.map((b, i) => {
      b.txt.setText(this.pauseBtnDefs[i].label()).setScale(1);
      return b.txt.width + pad * 2;
    });
    const natural = ws.reduce((a, w) => a + w, 0) + gap * (ws.length - 1);
    const k = Math.min(1, usable / natural);
    const total = natural * k;
    let x = this.scale.width / 2 - total / 2;
    this.pauseBtns.forEach((b, i) => {
      const w = ws[i] * k, h = 26 * k;
      b.txt.setScale(k);
      b.box.setSize(w, h).setPosition(x + w / 2, b.box.y);
      // setSize does not move the hit area Phaser built from the ORIGINAL size,
      // so rebuild it — otherwise the clickable region keeps the 10px placeholder
      // width these were created with and only a sliver of the button responds.
      b.box.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, w, h), Phaser.Geom.Rectangle.Contains);
      b.txt.setPosition(x + w / 2, b.txt.y);
      x += w + gap * k;
    });
  }

  togglePause() {
    if (this.over || this.transitioning || this.menuOpen) return;
    this.paused = !this.paused;
    if (this.paused) {
      // snapshot this run's stats onto the overlay (same 15s-floor wpm divisor and
      // accuracy formula the End screen uses, so the pause board and the final
      // report always agree).
      const wpm = this.wordsTyped > 0
        ? Math.round(this.wordsTyped / Math.max(this.elapsed / 60, 15 / 60)) : 0;
      const acc = this.submitsTotal ? Math.round(100 * this.submitsOk / this.submitsTotal) : 100;
      const t = Math.max(0, Math.round(this.elapsed));
      const survived = Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
      // line 1 = skill, line 2 = the run's spoils. credits + loot were otherwise
      // invisible mid-run (only the End screen showed loot); fmtC/lootCount are
      // always-valid state, so this stays crash-safe during a boss/festival pause
      // (unlike langIndex, which is out of range while a boss is up).
      this.pauseStats.setText(
        'SCORE ' + this.runScore + ' · ' + wpm + ' wpm · ' + acc + '% acc\n' +
        'best combo ' + this.maxCombo + ' · ' + this.fmtC(this.credits) + ' credits · ' +
        this.lootCount + ' loot · survived ' + survived);
      this.refreshPauseHint();   // the gear may have flipped mute since we built it
    }
    this.pauseUI.setVisible(this.paused);
    // Phaser hit-tests by display list, not by visibility of an ancestor
    // container — so without this the hidden pause buttons keep swallowing
    // clicks aimed at the field underneath them. Toggle their input with the
    // overlay.
    this.pauseBtns.forEach(b => {
      if (this.paused) b.box.setInteractive({ useHandCursor: true });
      else b.box.disableInteractive();
    });
    if (this.paused) this.refreshPauseHint();   // re-measure: labels may have changed
    this.time.paused = this.paused;
    this.tweens.timeScale = this.paused ? 0 : 1;
    // the demon fire-fountain emitters aren't scene tweens/timers, so the two
    // freezes above miss them — halt/resume them explicitly (see Battle.setDecorActive).
    if (this.battle) this.battle.setDecorActive(!this.paused);
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

    this.tickDeprecation(delta / 1000);

    // CORE slows the drain rather than refilling it — the same seconds bought,
    // but spread wide enough to actually read the screen. Expires on elapsed
    // (the run's own clock), so a pause cannot stretch it.
    const slowed = this.elapsed < this.slowUntil ? this.slowFactor : 1;
    this.timeLeft -= (delta / 1000) * (this.rule() === 'legacy' ? 1.25 : 1) * slowed;
    if (this.timeLeft <= 0) {
      // armor's death save gets one chance before the monsters do
      if (this.deathSave > 0) {
        this.timeLeft = this.deathSave;
        this.deathSave = 0;
        if (inMenu) this.closeMenu();
        this.refreshCredits();
        this.feedback('your ARMOR saved you! +' + Math.ceil(this.timeLeft) + 's', '#dcdcaa');
        this.flashPanel(0xdcdcaa);
        this.flashGain();   // snatched back from 0 — the biggest relief beat of all
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
      this.shakeCam(300, 0.01);
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
      // the SOS shelf's trigger is time-based, and a player who is genuinely
      // stuck isn't pressing keys — so it can't rely on refreshInput alone.
      this.refreshAssist();
      // same reason for the hint button's cooldown readout: it counts down on
      // its own, with no scoring event to repaint it.
      this.refreshCredits();
      // live WPM + accuracy in the status bar — refreshed once/sec, same 15s-floor
      // divisor and accuracy formula as the end-screen headline (and the pause
      // board), so the live readout can never disagree with the final report. A
      // typing game should show BOTH speed and precision as you play; accuracy was
      // otherwise only visible on pause or the End screen.
      if (this.wordsTyped > 0 && this.elapsed > 2) {
        const wpm = Math.round(this.wordsTyped / Math.max(this.elapsed / 60, 15 / 60));
        const acc = this.submitsTotal ? Math.round(100 * this.submitsOk / this.submitsTotal) : 100;
        this.statusRight.setText(this._statusBase + ' · ' + wpm + ' wpm · ' + acc + '% acc');
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
    const low = s <= 10;
    // Three-band recolor for the big timer: >20s normal, 11..20s amber (an early
    // "you're falling behind" cue before it's critical), <=10s red. Phaser's
    // Text.setColor re-renders the glyph texture on every call, even when the
    // color is unchanged — so gate it on the band and recolor only on a crossing,
    // not 60x/second (the same once-per-cross discipline the old two-state gate
    // used, with one added amber step).
    const band = low ? 'low' : (s <= 20 ? 'warn' : 'normal');
    if (band !== this._timerBand) {
      this._timerBand = band;
      this.timerText.setColor(band === 'low' ? IDE.error : band === 'warn' ? '#dcdcaa' : IDE.text);
    }
    // The <=10s scale-pulse / warn-frame / tick machinery keys off `low` alone
    // (amber is not "low" — it only recolors). Leaving the low zone (level-up /
    // boss / potion refilled the clock) resets those AND the tick memory:
    // otherwise, if the last tick before the refill fired at s=10 and the clock
    // drains back to exactly 10, s === lastTickSecond and that re-entry second's
    // tick is silently swallowed. Reset so the first second back under 10 ticks.
    if (low !== this._timerLow) {
      this._timerLow = low;
      if (!low) {
        this.timerText.setScale(1); this.warnFrame.setAlpha(0); this.lastTickSecond = -1;
        this.sfx('setTension', 0);   // clock refilled: drop the heartbeat, undim the bed
      }
    }
    if (low) {
      this.timerText.setScale(1 + (this.timeLeft % 1) * 0.15);
      // edge frame ramps 0→1 over the last 10s, pulsing faster as it tightens
      const intensity = Phaser.Math.Clamp((10 - this.timeLeft) / 10, 0, 1);
      const pulse = 0.7 + 0.3 * Math.sin(this.time.now / (70 + s * 12));
      this.warnFrame.setAlpha(intensity * 0.55 * pulse);
      // the same 0..1 ramp the red frame runs on, handed to the synth: the music
      // ducks and a sub-bass heartbeat comes up under it. Called every frame on
      // purpose — the engine ignores a level it is already at, so the ramp is
      // smooth rather than stepping once at the 10s edge.
      this.sfx('setTension', intensity);
      if (s !== this.lastTickSecond) {
        this.lastTickSecond = s;
        Sfx.tick(s);   // pitch rises as the count nears zero (see Sfx.tick)
      }
    }
  }
}
