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

  create() {
    this.score = 0;          // resets every level — only credits carry over
    this.credits = 0;
    this.wordsTyped = 0;
    this.langIndex = 0;
    this.stageIndex = 0;
    this.survivalLap = 0;
    this.timeLeft = START_TIME;
    this.typed = '';
    this.found = new Set();
    this.recent = [];
    this.paused = false;
    this.over = false;
    this.dying = false;
    this.transitioning = false;
    this.festival = null;
    this.lastTickSecond = -1;
    this.strikeTimer = 0;

    // loot state
    this.inventory = Items.load();
    this.hintTokens = 0;
    this.creditMult = 1;
    this.multWords = 0;
    this.deathSave = 0;
    this.menuOpen = null;
    this.menuC = null;

    const cx = this.scale.width / 2;

    const status = UI.chrome(this, 'life_of_software — Raiden IDE');
    status.left.setText('type + ENTER · ESC pause · HINT = ' + HINT_COST +
      ' credits (' + FESTIVAL_HINT_COST + ' at festivals)');
    status.right.setText('GMTK 2026 — Count Down');

    this.timerText = this.add.text(cx, 95, String(START_TIME), {
      fontFamily: 'monospace', fontSize: '60px', color: IDE.text, fontStyle: 'bold'
    }).setOrigin(0.5);

    // HUD: score + stage + bag/shop (left), language + progress (right)
    this.scoreText = this.add.text(16, 40, 'SCORE 0', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.text
    });
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
    this.progressTrack = this.add.rectangle(this.scale.width - 16, 76, 180, 6, IDE.border).setOrigin(1, 0.5);
    this.progressFill = this.add.rectangle(this.scale.width - 196, 76, 0, 6, IDE.statusbar).setOrigin(0, 0.5);

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

    this.pauseText = this.add.text(cx, this.scale.height / 2, 'PAUSED', {
      fontFamily: 'monospace', fontSize: '48px', color: IDE.text, fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false).setDepth(10);

    this.input.keyboard.on('keydown', (e) => this.onKey(e));

    this.refreshLangHud();
    this.refreshCredits();
    this.refreshBag();
  }

  get lang() {
    return LANGUAGES[this.langIndex];
  }

  get activeLang() {
    return this.festival ? this.festival.lang : this.lang;
  }

  get activeFound() {
    return this.festival ? this.festival.used : this.found;
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

  onKey(e) {
    if (this.over || this.dying) return;
    if (this.menuOpen) {
      if (e.key === 'Escape') this.closeMenu();
      return;
    }
    if (this.transitioning) return;
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
      this.feedback('"' + w + '" is not a ' + this.activeLang.name + ' pattern', IDE.error);
      Sfx.wrong();
      this.shakePanel();
      return;
    }

    this.activeFound.add(w);
    this.wordsTyped++;
    const pos = this.celebrate();

    if (this.festival) {
      this.festival.count++;
      this.gainCredits(FESTIVAL_CREDIT);
      this.timeLeft += FESTIVAL_TIME_BONUS;
      this.tickMult();
      this.refreshCredits();
      this.floatText('+' + FESTIVAL_CREDIT + ' credits  +' + FESTIVAL_TIME_BONUS + 's');
      this.maybeDrop(pos);
      this.pickFestivalLang();
      return;
    }

    const points = w.length * 10;
    const bonus = (1.5 + 0.25 * w.length) * this.lang.timeMult;
    this.score += points;
    this.timeLeft += bonus;
    this.gainCredits(CREDIT_PER_WORD);
    this.tickMult();

    this.scoreText.setText('SCORE ' + this.score);
    this.refreshCredits();
    this.pushRecent(w);
    this.floatText('+' + points + '  +' + bonus.toFixed(1) + 's');
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
      this.feedback('"' + f.word + '" is not a ' + w.toUpperCase() + ' pattern', IDE.error);
      Sfx.wrong();
      this.shakePanel();
      return;
    }
    f.count++;
    this.wordsTyped++;
    const pos = this.celebrate();
    const i = f.pool.indexOf(f.lang);
    this.tweens.add({ targets: f.badges[i], scale: 1.4, duration: 150, yoyo: true });
    this.gainCredits(FESTIVAL_CREDIT);
    this.timeLeft += FESTIVAL_TIME_BONUS;
    this.tickMult();
    this.refreshCredits();
    this.floatText('+' + FESTIVAL_CREDIT + ' credits  +' + FESTIVAL_TIME_BONUS + 's');
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
    this.add.particles(this.panel.x, this.panel.y, 'pixel', {
      speed: { min: 80, max: 200 }, lifespan: 400, quantity: 14,
      scale: { start: 1.5, end: 0 }, tint: IDE.greenHex, emitting: false
    }).explode();
    return this.festival ? null : this.battle.attack();
  }

  // --- loot ---

  maybeDrop(pos) {
    const chance = Items.dropChance(this.stageIndex, !!this.festival);
    if (Math.random() >= chance) return;
    const item = Items.roll();
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
    if (this.over || this.dying || this.transitioning || this.paused) return;
    if (this.menuOpen === which) return this.closeMenu();
    this.closeMenu();
    if (which === 'bag') this.openBag(-1); else this.openShop();
  }

  closeMenu() {
    if (this.menuC) this.menuC.destroy();
    this.menuC = null;
    this.menuOpen = null;
  }

  menuShell(title, note) {
    const cx = this.scale.width / 2, cy = this.scale.height / 2;
    const c = this.add.container(0, 0).setDepth(30);
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
        sold ? 'SOLD' : '[ BUY ' + price + ' ]', {
          fontFamily: 'monospace', fontSize: '15px', fontStyle: 'bold',
          color: sold ? IDE.dim : (afford ? IDE.comment : IDE.error)
        }).setOrigin(0.5);
      if (!sold && afford) {
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

  levelUp() {
    const fromIdx = this.langIndex;
    this.langIndex++;
    this.score = 0;
    this.scoreText.setText('SCORE 0');
    this.found.clear();
    this.recent = [];
    this.recentText.setText('');
    this.hintText.setText('');
    this.feedbackText.setText('');
    this.timeLeft += LEVELUP_TIME_BONUS;
    this.strikeTimer = 0;
    Sfx.win();
    this.transitioning = true;
    this.battle.ulti(() => this.afterUlti(fromIdx));
  }

  afterUlti(fromIdx) {
    if (this.langIndex >= LANGUAGES.length) {
      this.langIndex = 0;
      if (this.stageIndex < STAGES.length - 1) this.stageIndex++;
      else this.survivalLap++;
      this.showStage(() => {
        this.transitioning = false;
        this.refreshLangHud();
      });
      return;
    }
    this.showPath(fromIdx, () => {
      this.transitioning = false;
      this.refreshLangHud();
      if (Math.random() < FESTIVAL_CHANCE) {
        this.startFestival(Math.random() < 0.5 ? 'sw' : 'growth');
      }
    });
  }

  showPath(fromIdx, done) {
    const cx = this.scale.width / 2, cy = 250;
    const spacing = 230;

    const overlay = this.add.container(0, 0).setDepth(20).setAlpha(0);
    overlay.add(this.add.rectangle(cx, this.scale.height / 2,
      this.scale.width, this.scale.height, IDE.bg, 0.93));
    overlay.add(this.add.text(cx, 120, '// level cleared ✓ — the language road', {
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
    const pool = Phaser.Utils.Array.Shuffle(LANGUAGES.slice()).slice(0, 6);

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
    this.tweens.add({ targets: c, alpha: 1, duration: 300 });

    this.festival = {
      type, pool, badges, prompt, container: c,
      lang: null, word: null, used: new Set(), timeLeft: FESTIVAL_TIME, count: 0
    };

    this.battle.setVisible(false);
    this.langText.setText(type === 'sw' ? 'SOFTWARE FESTIVAL' : 'GROWTH FESTIVAL')
      .setColor('#dcdcaa');
    if (this.langBadge) { this.langBadge.destroy(); this.langBadge = null; }
    this.progressFill.width = 0;
    this.typed = '';
    this.refreshInput();
    this.refreshCredits();
    if (type === 'sw') this.pickFestivalLang(); else this.pickGrowthRound();
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
    f.prompt.setText('type a ' + f.lang.name + ' pattern!').setColor(f.lang.color);
    this.refreshInput();
  }

  pickGrowthRound() {
    const f = this.festival;
    let lang = null, word = null, guard = 0;
    while (!word && ++guard < 25) {
      lang = Phaser.Utils.Array.GetRandom(f.pool);
      const unique = lang.words.filter(w =>
        !f.used.has(w) && f.pool.every(o => o === lang || !o.words.includes(w)));
      if (unique.length) word = Phaser.Utils.Array.GetRandom(unique);
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

  endFestival() {
    const f = this.festival;
    this.festival = null;
    this.battle.setVisible(true);
    this.tweens.add({
      targets: f.container, alpha: 0, duration: 300,
      onComplete: () => f.container.destroy()
    });
    this.feedback('festival over — ' + f.count + ' answers, +' +
      (f.count * FESTIVAL_CREDIT) + ' credits', '#dcdcaa');
    this.strikeTimer = 0;
    this.typed = '';
    this.refreshInput();
    this.refreshLangHud();
    this.refreshCredits();
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
    this.time.delayedCall(6000, () => this.hintText.setText(''));
  }

  finish(win) {
    if (this.over) return;
    this.over = true;
    this.closeMenu();
    if (win) Sfx.win(); else Sfx.hit();
    this.scene.start('End', {
      score: this.score,
      words: this.wordsTyped,
      langIndex: Math.min(this.langIndex, LANGUAGES.length - 1),
      stage: STAGES[this.stageIndex].name,
      lap: this.survivalLap,
      win: win
    });
  }

  // --- UI helpers ---

  typedColor() {
    if (!this.typed) return IDE.text;
    const f = this.festival;
    if (f && f.type === 'growth') {
      const names = f.pool.flatMap(l => [l.name.toLowerCase(), l.abbr.toLowerCase()]);
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

  refreshLangHud() {
    this.langText.setText('LEVEL ' + (this.langIndex + 1) + '/' + LANGUAGES.length + ' · ' + this.lang.name)
      .setColor(this.lang.color);
    this.stageText.setText('STAGE ' + STAGES[this.stageIndex].name +
      (this.survivalLap > 0 ? ' · LAP ' + (this.survivalLap + 1) : '') +
      ' · target ' + this.targetScore());
    this.progressFill.width = 180 * Math.min(1, this.score / this.targetScore());
    this.progressFill.fillColor = Phaser.Display.Color.HexStringToColor(this.lang.color).color;
    if (this.battle) {
      this.battle.setTier(Math.floor(this.langIndex / 5));
      this.battle.setStage(this.stageIndex);
    }
    if (this.langBadge) this.langBadge.destroy();
    this.langBadge = UI.badge(this,
      this.scale.width - 30 - this.langText.width, 54, this.lang, 13);
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
    if (this.over || this.transitioning || this.menuOpen) return;
    this.paused = !this.paused;
    this.pauseText.setVisible(this.paused);
    this.time.paused = this.paused;
    this.tweens.timeScale = this.paused ? 0 : 1;
  }

  update(_, delta) {
    if (this.paused || this.over || this.transitioning || this.dying || this.menuOpen) return;

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

    // every few seconds the front monster lands a (non-lethal) hit
    this.strikeTimer += delta / 1000;
    if (this.strikeTimer >= ENEMY_STRIKE_EVERY) {
      this.strikeTimer = 0;
      this.battle.enemyStrike(false);
    }

    this.timeLeft -= delta / 1000;
    if (this.timeLeft <= 0) {
      // armor's death save gets one chance before the monsters do
      if (this.deathSave > 0) {
        this.timeLeft = this.deathSave;
        this.deathSave = 0;
        this.refreshCredits();
        this.feedback('your ARMOR saved you! +' + Math.ceil(this.timeLeft) + 's', '#dcdcaa');
        this.flashPanel(0xdcdcaa);
        Sfx.win();
        return;
      }
      this.timeLeft = 0;
      this.timerText.setText('0');
      this.dying = true;
      Sfx.hit();
      this.battle.defeat(() => this.finish(false));
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
