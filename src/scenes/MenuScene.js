class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const cx = this.scale.width / 2, cy = this.scale.height / 2;

    this.add.text(cx, cy - 110, 'SYNTAX COUNTDOWN', {
      fontFamily: 'monospace', fontSize: '56px', color: '#f2f2f2', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, cy - 54, 'a Raiden Technology game — GMTK 2026: Count Down', {
      fontFamily: 'monospace', fontSize: '16px', color: '#e3242b'
    }).setOrigin(0.5);

    this.add.text(cx, cy + 8,
      'Süre bitmeden dilin kalıplarını yaz: import, async, let, fn...\n' +
      'Her doğru kelime SÜRE + PUAN + KREDİ kazandırır.\n' +
      'Hedef puana ulaş → sıradaki (daha zor) dile geç. 5 dil seni bekliyor.',
      {
        fontFamily: 'monospace', fontSize: '15px', color: '#aaaaaa',
        align: 'center', lineSpacing: 8
      }).setOrigin(0.5);

    const start = this.add.text(cx, cy + 100, '[ BAŞLAMAK İÇİN TIKLA ]', {
      fontFamily: 'monospace', fontSize: '24px', color: '#f2f2f2'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: start, alpha: 0.3, duration: 600, yoyo: true, repeat: -1
    });

    this.add.text(cx, this.scale.height - 30, 'yaz + ENTER · ESC durdur · İPUCU = 20 kredi', {
      fontFamily: 'monospace', fontSize: '14px', color: '#555555'
    }).setOrigin(0.5);

    this.input.once('pointerdown', () => {
      Sfx.unlock();          // first user gesture → audio allowed from here on
      Sfx.blip();
      this.scene.start('Game');
    });
  }
}
