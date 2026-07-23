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
      this.add.text(cx, 46, 'BEST: STAGE ' + best.stage + ' · LEVEL ' + best.level +
        ' · ' + best.words + ' words' + (best.score ? ' · ' + best.score + ' pts' : '') +
        ' · ' + best.wpm + ' wpm', {
          fontFamily: 'monospace', fontSize: '13px', color: '#dcdcaa'
        }).setOrigin(0.5);
    }

    // soft color glow behind the title — brighter, warmer menu lighting
    this.add.circle(cx - 150, cy - 140, 150, 0x569cd6, 0.10);
    this.add.circle(cx + 150, cy - 140, 150, 0xce9178, 0.10);
    this.add.circle(cx, cy - 140, 220, 0xffffff, 0.05);

    // two-tone title, like syntax highlighting
    const t1 = this.add.text(0, 0, 'LIFE OF', {
      fontFamily: 'monospace', fontSize: '56px', color: IDE.keyword, fontStyle: 'bold'
    });
    const t2 = this.add.text(0, 0, ' SOFTWARE', {
      fontFamily: 'monospace', fontSize: '56px', color: IDE.stringy, fontStyle: 'bold'
    });
    const totalW = t1.width + t2.width;
    t1.setPosition(cx - totalW / 2, cy - 150);
    t2.setPosition(cx - totalW / 2 + t1.width, cy - 150);

    this.add.text(cx, cy - 78, '// a Raiden Technology game — GMTK 2026: Count Down', {
      fontFamily: 'monospace', fontSize: '15px', color: IDE.comment
    }).setOrigin(0.5);

    this.add.text(cx, cy - 18,
      'Type the language\'s patterns before time runs out: import, async, fn, => ...\n' +
      'Every correct pattern grants TIME + SCORE + CREDITS.\n' +
      'Clear all ' + LANGUAGES.length + ' languages to raise the STAGE: Very Easy → Survival.',
      {
        fontFamily: 'monospace', fontSize: '15px', color: IDE.text,
        align: 'center', lineSpacing: 8
      }).setOrigin(0.5);

    const start = this.add.text(cx, cy + 58, '[ CLICK TO START ]', {
      fontFamily: 'monospace', fontSize: '24px', color: IDE.white
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.tweens.add({
      targets: start, alpha: 0.3, duration: 600, yoyo: true, repeat: -1
    });

    // same seed for everyone today — race on the itch comments!
    const daily = this.add.text(cx, cy + 92, '[ DAILY CHALLENGE — ' +
      new Date().toISOString().slice(0, 10) + ' ]', {
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

    start.on('pointerdown', () => {
      Sfx.unlock();          // first user gesture → audio allowed from here on
      Sfx.blip();
      this.scene.start('Game');
    });
    daily.on('pointerdown', () => {
      Sfx.unlock();
      Sfx.blip();
      this.scene.start('Game', { daily: true });
    });
  }
}
