// GameScene — the core loop: a text panel in the middle, a countdown at the top.
// Type the current language's keywords before the clock hits zero. Every correct
// word buys back time, score and credits; hit the target score to climb to the
// next (harder) language. Credits (max 100) can be spent on hints.

const HINT_COST = 20;
const CREDIT_PER_WORD = 5;
const CREDIT_MAX = 100;
const START_TIME = 60;
const LEVELUP_TIME_BONUS = 8;
const MAX_TYPED = 24;

class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.totalScore = 0;
    this.levelScore = 0;
    this.credits = 0;
    this.wordsTyped = 0;
    this.langIndex = 0;
    this.timeLeft = START_TIME;
    this.typed = '';
    this.found = new Set();
    this.recent = [];
    this.paused = false;
    this.over = false;
    this.lastTickSecond = -1;

    const cx = this.scale.width / 2;

    // big countdown — the theme, front and center
    this.timerText = this.add.text(cx, 52, String(START_TIME), {
      fontFamily: 'monospace', fontSize: '64px', color: '#e3242b', fontStyle: 'bold'
    }).setOrigin(0.5);

    // HUD: total score (left), language + progress to target (right)
    this.scoreText = this.add.text(16, 12, 'PUAN 0', {
      fontFamily: 'monospace', fontSize: '20px', color: '#f2f2f2'
    });
    this.langText = this.add.text(this.scale.width - 16, 12, '', {
      fontFamily: 'monospace', fontSize: '20px', color: '#f2f2f2', fontStyle: 'bold'
    }).setOrigin(1, 0);
    this.progressTrack = this.add.rectangle(this.scale.width - 16, 44, 180, 6, 0x333333).setOrigin(1, 0.5);
    this.progressFill = this.add.rectangle(this.scale.width - 196, 44, 0, 6, 0xe3242b).setOrigin(0, 0.5);

    // input panel, dead center
    const panelW = 620, panelH = 74, panelY = 290;
    this.panel = this.add.rectangle(cx, panelY, panelW, panelH, 0x161616)
      .setStrokeStyle(2, 0x555555);
    this.inputText = this.add.text(cx - panelW / 2 + 20, panelY, '', {
      fontFamily: 'monospace', fontSize: '30px', color: '#f2f2f2'
    }).setOrigin(0, 0.5);
    this.cursor = this.add.rectangle(this.inputText.x + 2, panelY, 14, 34, 0xe3242b);
    this.tweens.add({ targets: this.cursor, alpha: 0, duration: 400, yoyo: true, repeat: -1 });

    // credits + hint button — top-right corner of the input panel
    const panelRight = cx + panelW / 2, panelTop = panelY - panelH / 2;
    this.creditText = this.add.text(panelRight, panelTop - 26, '', {
      fontFamily: 'monospace', fontSize: '16px', color: '#f2f2f2'
    }).setOrigin(1, 0.5);
    this.hintBtn = this.add.text(panelRight, panelTop - 48, '[ İPUCU -' + HINT_COST + ' ]', {
      fontFamily: 'monospace', fontSize: '16px', color: '#e3242b'
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    this.hintBtn.on('pointerover', () => this.hintBtn.setColor('#ffffff'));
    this.hintBtn.on('pointerout', () => this.hintBtn.setColor('#e3242b'));
    this.hintBtn.on('pointerdown', () => this.buyHint());

    // hint + feedback lines under the panel
    this.hintText = this.add.text(cx, panelY + 64, '', {
      fontFamily: 'monospace', fontSize: '20px', color: '#f7df1e'
    }).setOrigin(0.5);
    this.feedbackText = this.add.text(cx, panelY + 96, '', {
      fontFamily: 'monospace', fontSize: '15px', color: '#555555'
    }).setOrigin(0.5);
    this.recentText = this.add.text(cx, this.scale.height - 56, '', {
      fontFamily: 'monospace', fontSize: '14px', color: '#555555'
    }).setOrigin(0.5);
    this.add.text(cx, this.scale.height - 24, 'yaz + ENTER · ESC durdur', {
      fontFamily: 'monospace', fontSize: '13px', color: '#333333'
    }).setOrigin(0.5);

    // level-up banner (hidden until used)
    this.banner = this.add.text(cx, 170, '', {
      fontFamily: 'monospace', fontSize: '40px', color: '#f2f2f2', fontStyle: 'bold'
    }).setOrigin(0.5).setAlpha(0).setDepth(5);

    this.pauseText = this.add.text(cx, this.scale.height / 2, 'DURAKLATILDI', {
      fontFamily: 'monospace', fontSize: '48px', color: '#f2f2f2', fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false).setDepth(10);

    this.input.keyboard.on('keydown', (e) => this.onKey(e));

    this.refreshLangHud();
    this.refreshCredits();
  }

  get lang() {
    return LANGUAGES[this.langIndex];
  }

  onKey(e) {
    if (e.key === 'Escape') { this.togglePause(); return; }
    if (this.paused || this.over) return;

    if (e.key === 'Enter') {
      this.submit();
    } else if (e.key === 'Backspace') {
      this.typed = this.typed.slice(0, -1);
      this.refreshInput();
    } else if (/^[a-zA-Z0-9_+#]$/.test(e.key) && this.typed.length < MAX_TYPED) {
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

    if (this.found.has(w)) {
      this.feedback('"' + w + '" zaten yazıldı', '#888888');
      Sfx.blip();
      return;
    }
    if (!this.lang.words.includes(w)) {
      this.feedback('"' + w + '" ' + this.lang.name + ' kalıbı değil', '#e3242b');
      Sfx.wrong();
      this.shakePanel();
      return;
    }

    // correct word: score + time + credits
    this.found.add(w);
    this.wordsTyped++;
    const points = w.length * 10;
    const bonus = (1.5 + 0.25 * w.length) * this.lang.timeMult;
    this.totalScore += points;
    this.levelScore += points;
    this.timeLeft += bonus;
    this.credits = Math.min(CREDIT_MAX, this.credits + CREDIT_PER_WORD);

    this.scoreText.setText('PUAN ' + this.totalScore);
    this.refreshCredits();
    this.pushRecent(w);
    this.floatText('+' + points + '  +' + bonus.toFixed(1) + 's');
    Sfx.pickup();

    this.add.particles(this.panel.x, this.panel.y, 'pixel', {
      speed: { min: 80, max: 200 }, lifespan: 400, quantity: 14,
      scale: { start: 1.5, end: 0 }, emitting: false
    }).explode();

    if (this.levelScore >= this.lang.target) {
      this.levelUp();
    } else {
      this.refreshLangHud();
    }
  }

  levelUp() {
    this.langIndex++;
    if (this.langIndex >= LANGUAGES.length) {
      this.finish(true);
      return;
    }
    this.levelScore = 0;
    this.found.clear();
    this.recent = [];
    this.recentText.setText('');
    this.hintText.setText('');
    this.timeLeft += LEVELUP_TIME_BONUS;
    this.refreshLangHud();
    Sfx.win();

    this.banner.setText('SIRADAKİ DİL: ' + this.lang.name).setColor(this.lang.color).setAlpha(0);
    this.tweens.add({
      targets: this.banner, alpha: 1, duration: 200, yoyo: true, hold: 1200
    });
  }

  buyHint() {
    if (this.paused || this.over) return;
    if (this.credits < HINT_COST) {
      this.feedback('yetersiz kredi (' + HINT_COST + ' gerek)', '#e3242b');
      Sfx.wrong();
      return;
    }
    const remaining = this.lang.words.filter(w => !this.found.has(w));
    if (remaining.length === 0) return;

    this.credits -= HINT_COST;
    this.refreshCredits();
    const w = Phaser.Utils.Array.GetRandom(remaining);
    const shown = Math.ceil(w.length / 2);
    this.hintText.setText('İPUCU: ' + w.slice(0, shown) + '·'.repeat(w.length - shown));
    Sfx.hint();
    this.time.delayedCall(6000, () => this.hintText.setText(''));
  }

  finish(win) {
    if (this.over) return;
    this.over = true;
    if (win) Sfx.win(); else Sfx.hit();
    this.scene.start('End', {
      score: this.totalScore,
      words: this.wordsTyped,
      lang: this.lang ? this.lang.name : LANGUAGES[LANGUAGES.length - 1].name,
      langIndex: Math.min(this.langIndex, LANGUAGES.length - 1),
      win: win
    });
  }

  // --- UI helpers ---

  refreshInput() {
    this.inputText.setText(this.typed);
    this.cursor.x = this.inputText.x + this.inputText.width + 9;
  }

  refreshLangHud() {
    this.langText.setText((this.langIndex + 1) + '/' + LANGUAGES.length + ' ' + this.lang.name)
      .setColor(this.lang.color);
    this.progressFill.width = 180 * Math.min(1, this.levelScore / this.lang.target);
    this.panel.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(this.lang.color).color);
  }

  refreshCredits() {
    this.creditText.setText('KREDİ ' + this.credits + '/' + CREDIT_MAX);
    this.hintBtn.setAlpha(this.credits >= HINT_COST ? 1 : 0.4);
  }

  pushRecent(w) {
    this.recent.push(w);
    if (this.recent.length > 8) this.recent.shift();
    this.recentText.setText(this.recent.join('  '));
  }

  feedback(msg, color) {
    this.feedbackText.setText(msg).setColor(color).setAlpha(1);
    this.tweens.add({ targets: this.feedbackText, alpha: 0, delay: 1500, duration: 500 });
  }

  floatText(msg) {
    const t = this.add.text(this.panel.x, this.panel.y - 50, msg, {
      fontFamily: 'monospace', fontSize: '22px', color: '#f2f2f2', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.tweens.add({
      targets: t, y: t.y - 40, alpha: 0, duration: 900,
      onComplete: () => t.destroy()
    });
  }

  shakePanel() {
    this.tweens.add({
      targets: [this.panel, this.inputText, this.cursor],
      x: '+=6', duration: 40, yoyo: true, repeat: 3
    });
  }

  togglePause() {
    if (this.over) return;
    this.paused = !this.paused;
    this.pauseText.setVisible(this.paused);
    this.time.paused = this.paused;
    this.tweens.timeScale = this.paused ? 0 : 1;
  }

  update(_, delta) {
    if (this.paused || this.over) return;

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
      this.timerText.setScale(1 + (this.timeLeft % 1) * 0.15);
      if (s !== this.lastTickSecond) {
        this.lastTickSecond = s;
        Sfx.tick();
      }
    } else {
      this.timerText.setScale(1);
    }
  }
}
