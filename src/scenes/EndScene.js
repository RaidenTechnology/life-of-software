class EndScene extends Phaser.Scene {
  constructor() {
    super('End');
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.words = data.words || 0;
    this.lang = data.lang || '';
    this.langIndex = data.langIndex || 0;
    this.win = !!data.win;
  }

  create() {
    const cx = this.scale.width / 2, cy = this.scale.height / 2;

    this.add.text(cx, cy - 100, this.win ? 'TÜM DİLLER TAMAM!' : 'SÜRE DOLDU', {
      fontFamily: 'monospace', fontSize: '48px',
      color: this.win ? '#f2f2f2' : '#e3242b', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, cy - 30, 'PUAN ' + this.finalScore, {
      fontFamily: 'monospace', fontSize: '32px', color: '#f2f2f2'
    }).setOrigin(0.5);

    this.add.text(cx, cy + 14,
      this.words + ' kalıp yazdın · ulaştığın dil: ' + this.lang +
      ' (' + (this.langIndex + 1) + '/' + LANGUAGES.length + ')',
      {
        fontFamily: 'monospace', fontSize: '16px', color: '#aaaaaa'
      }).setOrigin(0.5);

    const again = this.add.text(cx, cy + 90, '[ TEKRAR DENE ]', {
      fontFamily: 'monospace', fontSize: '20px', color: '#f2f2f2'
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
