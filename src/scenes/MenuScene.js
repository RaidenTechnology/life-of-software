class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const cx = this.scale.width / 2, cy = this.scale.height / 2;

    const status = UI.chrome(this, 'syntax_countdown — Raiden IDE');
    status.left.setText('yaz + ENTER · ESC durdur · İPUCU = 20 kredi');
    status.right.setText('GMTK 2026 — Count Down');

    // two-tone title, like syntax highlighting
    const t1 = this.add.text(0, 0, 'SYNTAX', {
      fontFamily: 'monospace', fontSize: '56px', color: IDE.keyword, fontStyle: 'bold'
    });
    const t2 = this.add.text(0, 0, ' COUNTDOWN', {
      fontFamily: 'monospace', fontSize: '56px', color: IDE.stringy, fontStyle: 'bold'
    });
    const totalW = t1.width + t2.width;
    t1.setPosition(cx - totalW / 2, cy - 150);
    t2.setPosition(cx - totalW / 2 + t1.width, cy - 150);

    this.add.text(cx, cy - 78, '// a Raiden Technology game — GMTK 2026: Count Down', {
      fontFamily: 'monospace', fontSize: '15px', color: IDE.comment
    }).setOrigin(0.5);

    this.add.text(cx, cy - 18,
      'Süre bitmeden dilin kalıplarını yaz: import, async, fn, => ...\n' +
      'Her doğru kalıp SÜRE + PUAN + KREDİ kazandırır.\n' +
      'Hedef puana ulaş → sıradaki (daha zor) dile geç.',
      {
        fontFamily: 'monospace', fontSize: '15px', color: IDE.text,
        align: 'center', lineSpacing: 8
      }).setOrigin(0.5);

    const start = this.add.text(cx, cy + 62, '[ BAŞLAMAK İÇİN TIKLA ]', {
      fontFamily: 'monospace', fontSize: '24px', color: IDE.white
    }).setOrigin(0.5);
    this.tweens.add({
      targets: start, alpha: 0.3, duration: 600, yoyo: true, repeat: -1
    });

    // the full language road, as badges — 18 languages waiting
    this.add.text(cx, cy + 118, LANGUAGES.length + ' DİLLİK YOL', {
      fontFamily: 'monospace', fontSize: '13px', color: IDE.dim
    }).setOrigin(0.5);
    const spacing = 48;
    const x0 = cx - (LANGUAGES.length - 1) * spacing / 2;
    LANGUAGES.forEach((lang, i) => {
      UI.badge(this, x0 + i * spacing, cy + 158, lang, 16);
    });

    this.input.once('pointerdown', () => {
      Sfx.unlock();          // first user gesture → audio allowed from here on
      Sfx.blip();
      this.scene.start('Game');
    });
  }
}
