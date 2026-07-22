class EndScene extends Phaser.Scene {
  constructor() {
    super('End');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const cx = this.scale.width / 2, cy = this.scale.height / 2;

    this.add.text(cx, cy - 70, 'TIME UP', {
      fontFamily: 'monospace', fontSize: '48px', color: '#e3242b', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, cy, 'SCORE ' + this.finalScore, {
      fontFamily: 'monospace', fontSize: '32px', color: '#f2f2f2'
    }).setOrigin(0.5);

    const again = this.add.text(cx, cy + 80, '[ CLICK TO RETRY ]', {
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
