class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const cx = this.scale.width / 2, cy = this.scale.height / 2;

    const status = UI.chrome(this, 'life_of_software — Raiden IDE');
    status.left.setText('type + ENTER · ESC pause · HINT = ' + HINT_COST +
      ' credits (' + FESTIVAL_HINT_COST + ' at festivals)');
    status.right.setText('GMTK 2026 — Count Down');

    // personal best, if any
    let best = null;
    try { best = JSON.parse(localStorage.getItem('los_best') || 'null'); } catch (e) {}
    if (best) {
      // best.time (seconds the best run survived) is written by EndScene; older
      // bests predate it, so it's optional. Inline M:SS here — MenuScene has no
      // fmtDuration and it's a one-liner — to headline how long you held the clock.
      const survived = best.time
        ? ' · ' + Math.floor(best.time / 60) + ':' +
          String(Math.round(best.time) % 60).padStart(2, '0') + ' survived'
        : '';
      this.add.text(cx, 46, 'BEST: STAGE ' + best.stage + ' · LEVEL ' + best.level +
        ' · ' + best.words + ' words' + (best.score ? ' · ' + best.score + ' pts' : '') +
        (best.wpm ? ' · ' + best.wpm + ' wpm' : '') + survived, {
          fontFamily: 'monospace', fontSize: '13px', color: '#dcdcaa'
        }).setOrigin(0.5);
    }

    // Blender key-art splash behind everything (hero facing the monster horde
    // at dusk), with a dark scrim so the title/menu text stays readable. The
    // source PNG is rendered natively LOW-RES (192x108) and scaled up here with
    // NEAREST filtering — same chunky-pixel look as the hero/monster sprites,
    // instead of a smooth high-res render. Guard the PNG: if it failed to load,
    // skip it so the scrim + dark bg show through instead of Phaser's green
    // __MISSING fill.
    if (this.textures.exists('menu_splash')) {
      this.textures.get('menu_splash').setFilter(Phaser.Textures.FilterMode.NEAREST);
      this.add.image(cx, cy, 'menu_splash')
        .setDisplaySize(this.scale.width, this.scale.height).setDepth(-100);
    }
    this.add.rectangle(cx, cy, this.scale.width, this.scale.height, 0x0a0812, 0.42)
      .setDepth(-99);

    // Blender-rendered backing plate behind the title block (glowing rim +
    // opaque dark glass, same IDE-window language as the pause panel) — the
    // title needs to stay readable regardless of what's happening in the
    // splash art behind it, which a flat alpha scrim alone can't guarantee.
    // title plate spans y≈[cy-195 .. cy-65]; title + subtitle live inside it.
    if (this.textures.exists('title_panel')) {
      this.add.image(cx, cy - 130, 'title_panel').setDepth(-50);
    }

    // two-tone title, like syntax highlighting (origin y=0.5 so it centres on
    // its baseline row inside the plate).
    const t1 = this.add.text(0, 0, 'LIFE OF', {
      fontFamily: 'monospace', fontSize: '52px', color: IDE.keyword, fontStyle: 'bold'
    }).setOrigin(0, 0.5);
    const t2 = this.add.text(0, 0, ' SOFTWARE', {
      fontFamily: 'monospace', fontSize: '52px', color: IDE.stringy, fontStyle: 'bold'
    }).setOrigin(0, 0.5);
    const totalW = t1.width + t2.width;
    t1.setPosition(cx - totalW / 2, cy - 146);
    t2.setPosition(cx - totalW / 2 + t1.width, cy - 146);

    this.add.text(cx, cy - 104, '// a Raiden Technology game — GMTK 2026: Count Down', {
      fontFamily: 'monospace', fontSize: '14px', color: IDE.comment
    }).setOrigin(0.5);

    // description sits clearly BELOW the title plate (plate bottom ≈ cy-65).
    this.add.text(cx, cy - 20,
      'Type the language\'s patterns before time runs out: import, async, fn, => ...\n' +
      'Every correct pattern grants TIME + SCORE + CREDITS.\n' +
      'Clear all ' + LANGUAGES.length + ' languages to raise the STAGE: Very Easy → Survival.',
      {
        fontFamily: 'monospace', fontSize: '14px', color: IDE.text,
        align: 'center', lineSpacing: 8
      }).setOrigin(0.5);

    // shared actions — bound to both pointer clicks and keys (this is a typing
    // game; the menu should answer the keyboard too, not just the mouse).
    const startNew = () => {
      Sfx.unlock();          // first user gesture → audio allowed from here on
      Sfx.blip();
      // pass resume:false explicitly — Phaser keeps the previous scene data when
      // start() is called with none, which would silently resume a NEW GAME.
      this.scene.start('Game', { resume: false });
    };
    const startDaily = () => {
      Sfx.unlock(); Sfx.blip();
      this.scene.start('Game', { daily: true });
    };
    const startContinue = () => {
      Sfx.unlock(); Sfx.blip();
      this.scene.start('Game', { resume: true });
    };

    // CONTINUE — resume from the checkpoint (furthest section cleared), if any
    let ckpt = null;
    try { ckpt = JSON.parse(localStorage.getItem('los_ckpt') || 'null'); } catch (e) {}
    if (ckpt) {
      const st = STAGES[Math.min(ckpt.stageIndex || 0, STAGES.length - 1)];
      const ln = LANGUAGES[Math.min(ckpt.langIndex || 0, LANGUAGES.length - 1)];
      const cont = this.add.text(cx, cy + 30,
        '[ CONTINUE — STAGE ' + st.name + ' · ' + ln.name + ' · ENTER ]', {
          fontFamily: 'monospace', fontSize: '16px', color: IDE.stringy, fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      cont.on('pointerover', () => cont.setColor(IDE.white));
      cont.on('pointerout', () => cont.setColor(IDE.stringy));
      cont.on('pointerdown', startContinue);
    }

    const start = this.add.text(cx, cy + 58,
      ckpt ? '[ NEW GAME · N ]' : '[ PRESS ENTER OR CLICK ]', {
        fontFamily: 'monospace', fontSize: '24px', color: IDE.white
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.tweens.add({
      targets: start, alpha: 0.3, duration: 600, yoyo: true, repeat: -1
    });

    // same seed for everyone today — race on the itch comments! Fold today's
    // own daily best (los_daily_<date>, written by EndScene) into the label so
    // the seeded run has a visible target instead of the score living nowhere.
    const today = new Date().toISOString().slice(0, 10);
    let dbest = null;
    try { dbest = JSON.parse(localStorage.getItem('los_daily_' + today) || 'null'); } catch (e) {}
    const daily = this.add.text(cx, cy + 92, '[ DAILY CHALLENGE — ' + today +
      (dbest ? ' · best ' + dbest.words + 'w' : '') + ' · D ]', {
        fontFamily: 'monospace', fontSize: '15px', color: IDE.stringy
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    daily.on('pointerover', () => daily.setColor(IDE.white));
    daily.on('pointerout', () => daily.setColor(IDE.stringy));

    // the full language road, as badges
    this.add.text(cx, cy + 122, 'A ' + LANGUAGES.length + '-LANGUAGE ROAD', {
      fontFamily: 'monospace', fontSize: '13px', color: IDE.dim
    }).setOrigin(0.5);
    const spacing = 44, perRow = Math.ceil(LANGUAGES.length / 2);
    LANGUAGES.forEach((lang, i) => {
      const row = Math.floor(i / perRow), col = i % perRow;
      const rowLen = row === 0 ? perRow : LANGUAGES.length - perRow;
      const x0 = cx - (rowLen - 1) * spacing / 2;
      UI.badge(this, x0 + col * spacing, cy + 156 + row * 38, lang, 13);
    });

    start.on('pointerdown', startNew);
    daily.on('pointerdown', startDaily);

    // --- HOW TO PLAY panel -------------------------------------------------
    // The game has real depth a judge who plays two minutes never discovers —
    // combo multipliers, five loot rarities, festivals, boss fights, the
    // perfect-clear bonus. A one-line menu blurb can't carry it, so surface a
    // keyboard-first help overlay (H opens/closes it, ESC closes) that teaches
    // WHY typing fast matters. Raises perceived depth + Enjoyment, a distinct
    // GMTK scoring axis, with no new game systems.
    const help = this.add.text(12, 44, '[ HOW TO PLAY · H ]', {
      fontFamily: 'monospace', fontSize: '13px', color: IDE.keyword
    }).setOrigin(0, 0.5).setDepth(32).setInteractive({ useHandCursor: true });
    help.on('pointerover', () => help.setColor(IDE.white));
    help.on('pointerout', () => help.setColor(IDE.keyword));

    const hw = this.scale.width - 120, hh = 400;
    const helpUI = this.add.container(0, 0).setDepth(60).setVisible(false);
    // dim: swallows clicks to the menu beneath AND closes on a click, matching
    // how the in-game bag/shop modal dismisses — one consistent overlay idiom.
    const helpDim = this.add.rectangle(cx, cy, this.scale.width, this.scale.height, 0x08060e, 0.82)
      .setInteractive();
    helpDim.on('pointerdown', () => toggleHelp());
    helpUI.add(helpDim);
    helpUI.add(this.add.rectangle(cx, cy, hw, hh, IDE.panel).setStrokeStyle(2, IDE.border));
    helpUI.add(this.add.text(cx, cy - hh / 2 + 26, '// how to play — life_of_software', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.comment, fontStyle: 'bold'
    }).setOrigin(0.5));
    const body =
      "Type each language's patterns, then ENTER, before the countdown hits 0.\n" +
      'Every correct pattern buys you TIME + SCORE + CREDITS.\n' +
      '\n' +
      'ASSIST     Out of time, or stuck on a language you\'ve never written? One\n' +
      '           short pattern is offered — once every 40s at most, worth the\n' +
      '           fewest points there are. Waiting for it costs far more clock\n' +
      '           than it pays. ESC then A, or the gear, turns it off.\n' +
      'COMBO      Chain correct patterns for a score multiplier: x2 at 5, x3 at 15.\n' +
      '           One wrong pattern resets the streak.\n' +
      'PERFECT    Clear a whole level with no mistakes for bonus time, score & credits.\n' +
      'LOOT       Slain monsters drop gear, COMMON to UNIQUE: swords (credit x),\n' +
      '           armor (death-save), potions (+time), scrolls (hints), treasure.\n' +
      'BAG / SHOP TAB opens your bag & the daily shop (clock keeps running) — all\n' +
      '           keyboard: arrows/1-9 pick, U use, S salvage, 1-4 buy.\n' +
      'FESTIVAL   Surprise bonus rounds between levels — the main clock still drains!\n' +
      'BOSS       A boss guards the end of every stage. Beat it to raise the difficulty.\n' +
      'STAGES     Clear all ' + LANGUAGES.length + ' languages to advance: VERY EASY -> SURVIVAL.\n' +
      '\n' +
      'Keys:  type + ENTER    TAB bag/shop    HINT costs credits    ESC pause';
    helpUI.add(this.add.text(cx, cy + 8, body, {
      fontFamily: 'monospace', fontSize: '14px', color: IDE.text, align: 'left', lineSpacing: 5
    }).setOrigin(0.5));
    helpUI.add(this.add.text(cx, cy + hh / 2 - 22, 'press H or ESC to close', {
      fontFamily: 'monospace', fontSize: '13px', color: IDE.dim
    }).setOrigin(0.5));

    let helpOpen = false;
    const toggleHelp = () => {
      Sfx.unlock(); Sfx.blip();
      helpOpen = !helpOpen;
      helpUI.setVisible(helpOpen);
    };
    help.on('pointerdown', toggleHelp);

    // keyboard: ENTER/SPACE = the primary action (CONTINUE if there's a
    // checkpoint, else NEW GAME — matching what the eye lands on first), plus N
    // for a fresh run and D for the daily. Also serves as the audio-unlock gesture.
    // While the help overlay is up it captures the keyboard (only H/ESC close it)
    // so ENTER/N/D can't start a run out from under an open panel.
    this.input.keyboard.on('keydown', (e) => {
      if (helpOpen) {
        if (e.key === 'Escape' || e.key === 'h' || e.key === 'H') toggleHelp();
        return;
      }
      if (e.key === 'h' || e.key === 'H') { toggleHelp(); return; }
      if (e.key === 'Enter' || e.key === ' ') { ckpt ? startContinue() : startNew(); }
      else if (e.key === 'n' || e.key === 'N') startNew();
      else if (e.key === 'd' || e.key === 'D') startDaily();
    });
  }
}
