// BootScene — loads assets and generates placeholder textures.
// Real art (drawn by hand, per jam rules) replaces these during the jam.

class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Loading bar (matters once real assets exist)
    const barW = 320, barH = 8;
    const cx = this.scale.width / 2, cy = this.scale.height / 2;
    const track = this.add.rectangle(cx, cy, barW, barH, 0x333333);
    const fill = this.add.rectangle(cx - barW / 2, cy, 0, barH, 0xe3242b).setOrigin(0, 0.5);
    this.load.on('progress', v => { fill.width = barW * v; });

    // this.load.image('...', 'assets/...');  ← jam assets go here
  }

  create() {
    this.makeTextures();
    this.scene.start('Menu');
  }

  makeTextures() {
    const g = this.add.graphics();

    // player: 24x24 red square with white core
    g.fillStyle(0xe3242b).fillRect(0, 0, 24, 24);
    g.fillStyle(0xf2f2f2).fillRect(8, 8, 8, 8);
    g.generateTexture('player', 24, 24);
    g.clear();

    // dot: 10x10 white diamond-ish square
    g.fillStyle(0xf2f2f2).fillRect(0, 0, 10, 10);
    g.generateTexture('dot', 10, 10);
    g.clear();

    // pixel: 2x2 white square (particles)
    g.fillStyle(0xffffff).fillRect(0, 0, 2, 2);
    g.generateTexture('pixel', 2, 2);

    g.destroy();
  }
}
