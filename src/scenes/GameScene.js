// GameScene — the core loop: a text panel in the middle, a countdown at the top.
// Type the current language's patterns before the clock hits zero. Every correct
// word buys back time, score and credits; hit the target score to climb to the
// next (harder) language. Credits (max 100) can be spent on hints — a hint shows
// part of the word (rest as underscores) and types the revealed part for you.
// Every FESTIVAL_EVERY levels the road stops at the Software Festival: language
// badges appear above the input box and a random language demands a pattern.

const HINT_COST = 20;
const CREDIT_PER_WORD = 5;
const CREDIT_MAX = 100;
const START_TIME = 75;
const LEVELUP_TIME_BONUS = 10;
const MAX_TYPED = 24;
const FESTIVAL_EVERY = 3;
const FESTIVAL_TIME = 20;
const FESTIVAL_CREDIT = 10;
const FESTIVAL_TIME_BONUS = 2;

class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.score = 0;          // resets every level — only credits carry over
    this.credits = 0;
    this.wordsTyped = 0;
    this.langIndex = 0;
    this.timeLeft = START_TIME;
    this.typed = '';
    this.found = new Set();
    this.recent = [];
    this.paused = false;
    this.over = false;
    this.transitioning = false;
    this.festival = null;
    this.lastTickSecond = -1;

    const cx = this.scale.width / 2;

    const status = UI.chrome(this, 'syntax_countdown — Raiden IDE');
    status.left.setText('yaz + ENTER · ESC durdur · İPUCU = ' + HINT_COST + ' kredi');
    status.right.setText('GMTK 2026 — Count Down');

    // big countdown — the theme, front and center
    this.timerText = this.add.text(cx, 95, String(START_TIME), {
      fontFamily: 'monospace', fontSize: '60px', color: IDE.text, fontStyle: 'bold'
    }).setOrigin(0.5);

    // HUD: level score (left), language badge + name + progress (right)
    this.scoreText = this.add.text(16, 44, 'PUAN 0', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.text
    });
    this.langText = this.add.text(this.scale.width - 16, 44, '', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.text, fontStyle: 'bold'
    }).setOrigin(1, 0);
    this.langBadge = null;
    this.progressTrack = this.add.rectangle(this.scale.width - 16, 76, 180, 6, IDE.border).setOrigin(1, 0.5);
    this.progressFill = this.add.rectangle(this.scale.width - 196, 76, 0, 6, IDE.statusbar).setOrigin(0, 0.5);

    // input panel: one editor line, with a line-number gutter
    const panelW = 620, panelH = 74, panelY = 285;
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

    // credits + hint button — top-right corner of the input panel
    const panelRight = cx + panelW / 2, panelTop = panelY - panelH / 2;
    this.creditText = this.add.text(panelRight, panelTop - 22, '', {
      fontFamily: 'monospace', fontSize: '16px', color: IDE.text
    }).setOrigin(1, 0.5);
    this.hintBtn = this.add.text(panelRight, panelTop - 44, '[ İPUCU -' + HINT_COST + ' ]', {
      fontFamily: 'monospace', fontSize: '16px', color: IDE.keyword
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    this.hintBtn.on('pointerover', () => this.hintBtn.setColor(IDE.white));
    this.hintBtn.on('pointerout', () => this.hintBtn.setColor(IDE.keyword));
    this.hintBtn.on('pointerdown', () => this.buyHint());

    // hint + feedback lines under the panel
    this.hintText = this.add.text(cx, panelY + 62, '', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.stringy
    }).setOrigin(0.5);
    this.feedbackText = this.add.text(cx, panelY + 92, '', {
      fontFamily: 'monospace', fontSize: '15px', color: IDE.dim
    }).setOrigin(0.5);
    this.recentText = this.add.text(cx, this.scale.height - 44, '', {
      fontFamily: 'monospace', fontSize: '14px', color: IDE.comment
    }).setOrigin(0.5);

    this.pauseText = this.add.text(cx, this.scale.height / 2, 'DURAKLATILDI', {
      fontFamily: 'monospace', fontSize: '48px', color: IDE.text, fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false).setDepth(10);

    this.input.keyboard.on('keydown', (e) => this.onKey(e));

    this.refreshLangHud();
    this.refreshCredits();
  }

  get lang() {
    return LANGUAGES[this.langIndex];
  }

  // during the festival the demanded language changes every word
  get activeLang() {
    return this.festival ? this.festival.lang : this.lang;
  }

  get activeFound() {
    return this.festival ? this.festival.used : this.found;
  }

  onKey(e) {
    if (this.transitioning || this.over) return;
    if (e.key === 'Escape') { this.togglePause(); return; }
    if (this.paused) return;
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

    if (this.activeFound.has(w)) {
      this.feedback('"' + w + '" zaten yazıldı', IDE.dim);
      Sfx.blip();
      return;
    }
    if (!this.activeLang.words.includes(w)) {
      this.feedback('"' + w + '" ' + this.activeLang.name + ' kalıbı değil', IDE.error);
      Sfx.wrong();
      this.shakePanel();
      return;
    }

    this.activeFound.add(w);
    this.wordsTyped++;
    this.hintText.setText('');
    this.flashPanel(IDE.greenHex);
    Sfx.pickup();
    this.add.particles(this.panel.x, this.panel.y, 'pixel', {
      speed: { min: 80, max: 200 }, lifespan: 400, quantity: 14,
      scale: { start: 1.5, end: 0 }, tint: IDE.greenHex, emitting: false
    }).explode();

    if (this.festival) {
      // festival word: credits + a little main-clock time, no score
      this.festival.count++;
      this.credits = Math.min(CREDIT_MAX, this.credits + FESTIVAL_CREDIT);
      this.timeLeft += FESTIVAL_TIME_BONUS;
      this.refreshCredits();
      this.floatText('+' + FESTIVAL_CREDIT + ' kredi  +' + FESTIVAL_TIME_BONUS + 's');
      this.pickFestivalLang();
      return;
    }

    // normal word: score + time + credits
    const points = w.length * 10;
    const bonus = (1.5 + 0.25 * w.length) * this.lang.timeMult;
    this.score += points;
    this.timeLeft += bonus;
    this.credits = Math.min(CREDIT_MAX, this.credits + CREDIT_PER_WORD);

    this.scoreText.setText('PUAN ' + this.score);
    this.refreshCredits();
    this.pushRecent(w);
    this.floatText('+' + points + '  +' + bonus.toFixed(1) + 's');

    if (this.score >= this.lang.target) {
      this.levelUp();
    } else {
      this.refreshLangHud();
    }
  }

  levelUp() {
    const fromIdx = this.langIndex;
    this.langIndex++;
    if (this.langIndex >= LANGUAGES.length) {
      this.finish(true);
      return;
    }
    this.score = 0;          // fresh level, fresh score — credits stay
    this.scoreText.setText('PUAN 0');
    this.found.clear();
    this.recent = [];
    this.recentText.setText('');
    this.hintText.setText('');
    this.feedbackText.setText('');
    this.timeLeft += LEVELUP_TIME_BONUS;
    Sfx.win();

    // the countdown freezes while the language path plays
    this.transitioning = true;
    this.showPath(fromIdx, () => {
      this.transitioning = false;
      this.refreshLangHud();
      if (this.langIndex % FESTIVAL_EVERY === 0) this.startFestival();
    });
  }

  // --- language path: max 3 sections side by side, icons underneath.
  // The section you cleared turns white→green, then the road slides so the
  // cleared language falls behind and the next one takes its place.
  showPath(fromIdx, done) {
    const cx = this.scale.width / 2, cy = 250;
    const spacing = 230;

    const overlay = this.add.container(0, 0).setDepth(20).setAlpha(0);
    overlay.add(this.add.rectangle(cx, this.scale.height / 2,
      this.scale.width, this.scale.height, IDE.bg, 0.93));
    overlay.add(this.add.text(cx, 120, '// bölüm geçildi ✓ — dil yolu', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.comment
    }).setOrigin(0.5));

    const strip = this.add.container(cx, cy);
    overlay.add(strip);

    const mkNode = (idx, x, alpha) => {
      const lang = LANGUAGES[idx];
      const node = this.add.container(x, 0).setAlpha(alpha);
      const color = Phaser.Display.Color.HexStringToColor(lang.color).color;
      const box = this.add.rectangle(0, 0, 170, 64, IDE.panel).setStrokeStyle(2, color);
      node.add(box);
      node.add(this.add.text(0, -14, 'BÖLÜM ' + (idx + 1), {
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

    // road: [previous (already green)] [current (white)] [next (dim)]
    const prev = fromIdx > 0 ? mkNode(fromIdx - 1, -spacing, 0.55) : null;
    if (prev) prev.box.setStrokeStyle(2, IDE.greenHex);
    const cur = mkNode(fromIdx, 0, 1);
    cur.box.setStrokeStyle(3, 0xffffff);
    const next = mkNode(fromIdx + 1, spacing, 0.45);

    this.tweens.add({ targets: overlay, alpha: 1, duration: 400 });

    // 1) the cleared section turns white → green
    this.time.delayedCall(1000, () => {
      cur.box.setStrokeStyle(3, IDE.greenHex);
      cur.add(this.add.text(70, -24, '✓', {
        fontFamily: 'monospace', fontSize: '22px', color: IDE.comment, fontStyle: 'bold'
      }).setOrigin(0.5));
      Sfx.pickup();
    });

    // 2) the road slides: cleared language falls behind, next one arrives
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

    // 3) hold, fade out, resume play
    this.time.delayedCall(4600, () => {
      this.tweens.add({
        targets: overlay, alpha: 0, duration: 400,
        onComplete: () => { overlay.destroy(); done(); }
      });
    });
  }

  // --- Software Festival: badges above the input box, a random language
  // demands one of its patterns; each hit pays credits + a bit of time.
  startFestival() {
    const cx = this.scale.width / 2;
    const pool = Phaser.Utils.Array.Shuffle(LANGUAGES.slice()).slice(0, 6);

    const c = this.add.container(0, 0).setDepth(5).setAlpha(0);
    c.add(this.add.text(cx, 150, '★ YAZILIM ŞENLİĞİ ★', {
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
    this.tweens.add({ targets: c, alpha: 1, duration: 300 });

    this.festival = {
      pool, badges, prompt, container: c,
      lang: null, used: new Set(), timeLeft: FESTIVAL_TIME, count: 0
    };

    this.langText.setText('YAZILIM ŞENLİĞİ').setColor('#dcdcaa');
    if (this.langBadge) { this.langBadge.destroy(); this.langBadge = null; }
    this.progressFill.width = 0;
    this.typed = '';
    this.refreshInput();
    this.pickFestivalLang();
    Sfx.win();
  }

  pickFestivalLang() {
    const f = this.festival;
    const i = Phaser.Math.Between(0, f.pool.length - 1);
    f.lang = f.pool[i];
    f.badges.forEach((b, j) => {
      this.tweens.add({
        targets: b, scale: j === i ? 1.35 : 1, alpha: j === i ? 1 : 0.4, duration: 200
      });
    });
    f.prompt.setText(f.lang.name + ' kalıbı yaz!').setColor(f.lang.color);
    this.refreshInput();
  }

  endFestival() {
    const f = this.festival;
    this.festival = null;
    this.tweens.add({
      targets: f.container, alpha: 0, duration: 300,
      onComplete: () => f.container.destroy()
    });
    this.feedback('şenlik bitti — ' + f.count + ' kalıp, +' + (f.count * FESTIVAL_CREDIT) + ' kredi', '#dcdcaa');
    this.typed = '';
    this.refreshInput();
    this.refreshLangHud();
    Sfx.hint();
  }

  // a hint shows part of the word, the rest as underscores, and also types
  // the revealed part into the input box for you
  buyHint() {
    if (this.paused || this.over || this.transitioning) return;
    if (this.credits < HINT_COST) {
      this.feedback('yetersiz kredi (' + HINT_COST + ' gerek)', IDE.error);
      Sfx.wrong();
      return;
    }
    const remaining = this.activeLang.words.filter(w => !this.activeFound.has(w));
    if (remaining.length === 0) return;

    this.credits -= HINT_COST;
    this.refreshCredits();
    const w = Phaser.Utils.Array.GetRandom(remaining);
    const shown = Math.ceil(w.length / 2);
    const masked = (w.slice(0, shown) + '_'.repeat(w.length - shown)).split('').join(' ');
    this.hintText.setText('// ipucu: ' + masked);
    this.typed = w.slice(0, shown);
    this.refreshInput();
    Sfx.hint();
    this.time.delayedCall(6000, () => this.hintText.setText(''));
  }

  finish(win) {
    if (this.over) return;
    this.over = true;
    if (win) Sfx.win(); else Sfx.hit();
    this.scene.start('End', {
      score: this.score,
      words: this.wordsTyped,
      langIndex: Math.min(this.langIndex, LANGUAGES.length - 1),
      win: win
    });
  }

  // --- UI helpers ---

  // live syntax coloring, IDE-style: blue = valid pattern, dim = already used,
  // red = nothing can match anymore, default while still a valid prefix
  typedColor() {
    if (!this.typed) return IDE.text;
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

  refreshLangHud() {
    this.langText.setText('BÖLÜM ' + (this.langIndex + 1) + '/' + LANGUAGES.length + ' · ' + this.lang.name)
      .setColor(this.lang.color);
    this.progressFill.width = 180 * Math.min(1, this.score / this.lang.target);
    this.progressFill.fillColor = Phaser.Display.Color.HexStringToColor(this.lang.color).color;
    if (this.langBadge) this.langBadge.destroy();
    this.langBadge = UI.badge(this,
      this.scale.width - 30 - this.langText.width, 54, this.lang, 13);
  }

  refreshCredits() {
    this.creditText.setText('KREDİ ' + this.credits + '/' + CREDIT_MAX);
    this.hintBtn.setAlpha(this.credits >= HINT_COST ? 1 : 0.4);
  }

  pushRecent(w) {
    this.recent.push(w);
    if (this.recent.length > 8) this.recent.shift();
    this.recentText.setText('// ' + this.recent.join('  '));
  }

  feedback(msg, color) {
    this.feedbackText.setText(msg).setColor(color).setAlpha(1);
    this.tweens.add({ targets: this.feedbackText, alpha: 0, delay: 1500, duration: 500 });
  }

  floatText(msg) {
    const t = this.add.text(this.panel.x, this.panel.y - 50, msg, {
      fontFamily: 'monospace', fontSize: '22px', color: IDE.comment, fontStyle: 'bold'
    }).setOrigin(0.5);
    this.tweens.add({
      targets: t, y: t.y - 40, alpha: 0, duration: 900,
      onComplete: () => t.destroy()
    });
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
    this.tweens.add({
      targets: [this.panel, this.inputText, this.cursor],
      x: '+=6', duration: 40, yoyo: true, repeat: 3
    });
  }

  togglePause() {
    if (this.over || this.transitioning) return;
    this.paused = !this.paused;
    this.pauseText.setVisible(this.paused);
    this.time.paused = this.paused;
    this.tweens.timeScale = this.paused ? 0 : 1;
  }

  update(_, delta) {
    if (this.paused || this.over || this.transitioning) return;

    // festival: its own little clock runs, the main countdown is frozen
    if (this.festival) {
      this.festival.timeLeft -= delta / 1000;
      if (this.festival.timeLeft <= 0) {
        this.endFestival();
      } else {
        this.timerText.setText(String(Math.ceil(this.festival.timeLeft)))
          .setColor('#dcdcaa').setScale(1);
      }
      return;
    }

    this.timeLeft -= delta / 1000;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.timerText.setText('0');
      this.finish(false);
      return;
    }

    const s = Math.ceil(this.timeLeft);
    this.timerText.setText(String(s));
    if (s <= 10) {
      this.timerText.setColor(IDE.error);
      this.timerText.setScale(1 + (this.timeLeft % 1) * 0.15);
      if (s !== this.lastTickSecond) {
        this.lastTickSecond = s;
        Sfx.tick();
      }
    } else {
      this.timerText.setColor(IDE.text);
      this.timerText.setScale(1);
    }
  }
}
