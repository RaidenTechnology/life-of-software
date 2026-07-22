class EndScene extends Phaser.Scene {
  constructor() {
    super('End');
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.words = data.words || 0;
    this.langIndex = data.langIndex || 0;
    this.win = !!data.win;
  }

  create() {
    const cx = this.scale.width / 2, cy = this.scale.height / 2;
    const lang = LANGUAGES[this.langIndex];

    const status = UI.chrome(this, 'syntax_countdown — Raiden IDE');
    status.left.setText(this.win ? 'exit code 0' : 'exit code 1 — süre doldu');
    status.right.setText('GMTK 2026 — Count Down');

    this.add.text(cx, cy - 110, this.win ? 'DERLEME BAŞARILI ✓' : 'SÜRE DOLDU ✗', {
      fontFamily: 'monospace', fontSize: '46px',
      color: this.win ? IDE.comment : IDE.error, fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, cy - 44, 'PUAN ' + this.finalScore, {
      fontFamily: 'monospace', fontSize: '32px', color: IDE.text
    }).setOrigin(0.5);

    UI.badge(this, cx - 130, cy + 12, lang, 18);
    this.add.text(cx - 100, cy + 12,
      this.words + ' kalıp · ulaştığın dil: ' + lang.name +
      ' (' + (this.langIndex + 1) + '/' + LANGUAGES.length + ')',
      {
        fontFamily: 'monospace', fontSize: '16px', color: IDE.dim
      }).setOrigin(0, 0.5);

    const again = this.add.text(cx, cy + 90, '[ TEKRAR DERLE ]', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.white
    }).setOrigin(0.5);

    this.tweens.add({
      targets: again, alpha: 0.3, duration: 600, yoyo: true, repeat: -1
    });

    this.input.once('pointerdown', () => {
      Sfx.blip();
      this.scene.start('Game');
    });
  }
}
