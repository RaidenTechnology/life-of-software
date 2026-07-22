// Battle strip — the hero on the left, a queue of monsters on the right.
// Every correct pattern = one sword hit. Clearing a level = ulti attack.
// Running out of time = the monsters swarm and the hero falls.
//
// All textures are generated in code as placeholders. To swap in your own
// art (e.g. Blender renders exported as transparent PNGs), drop files into
// assets/ and load them in BootScene with the SAME keys ('hero0'..'hero5',
// 'en_ork', 'en_skeleton', 'en_elf', 'en_vampire', 'en_goblin', 'en_demon');
// makeTextures() skips any key that is already loaded.

class Battle {
  static TYPES = ['ork', 'skeleton', 'elf', 'vampire', 'goblin', 'demon'];

  static makeTextures(scene) {
    const g = scene.add.graphics();

    // hero tiers 0-5: armor color changes, the sword grows, gear is added
    const armors = [0x8d6e63, 0x9e9e9e, 0xffd54f, 0x26a69a, 0xe3242b, 0x7e57c2];
    armors.forEach((armor, t) => {
      const key = 'hero' + t;
      if (scene.textures.exists(key)) return;
      g.clear();
      g.fillStyle(0x37474f).fillRect(10, 40, 6, 8).fillRect(20, 40, 6, 8); // legs
      g.fillStyle(armor).fillRect(8, 22, 20, 18);                          // armor
      g.fillStyle(0xffcc99).fillRect(11, 8, 14, 12);                       // head
      if (t >= 1) g.fillStyle(armor).fillRect(10, 5, 16, 6);               // helmet
      if (t >= 3) g.fillStyle(0xffffff).fillRect(14, 1, 8, 4);             // plume
      if (t >= 2) g.fillStyle(0x455a64).fillRect(1, 24, 6, 14);            // shield
      g.fillStyle(0x5d4037).fillRect(28, 24, 4, 8);                        // hilt
      g.fillStyle(0xeceff1).fillRect(31, 25, 12 + t * 3, 4);               // blade
      g.generateTexture(key, 46 + t * 3, 48);
    });

    // monsters (facing left, weapons on their left side)
    const mk = (key, draw) => {
      if (scene.textures.exists('en_' + key)) return;
      g.clear();
      draw();
      g.generateTexture('en_' + key, 36, 48);
    };
    mk('ork', () => {
      g.fillStyle(0x33691e).fillRect(9, 40, 6, 8).fillRect(20, 40, 6, 8);
      g.fillStyle(0x6a994e).fillRect(7, 20, 22, 20);
      g.fillStyle(0x8bc34a).fillRect(10, 8, 16, 12);
      g.fillStyle(0xffffff).fillRect(11, 17, 3, 4).fillRect(22, 17, 3, 4);  // tusks
      g.fillStyle(0x5d4037).fillRect(0, 22, 6, 16);                          // club
    });
    mk('skeleton', () => {
      g.fillStyle(0xe0e0e0).fillRect(11, 40, 4, 8).fillRect(21, 40, 4, 8);
      g.fillStyle(0xe0e0e0).fillRect(10, 22, 16, 3).fillRect(10, 28, 16, 3).fillRect(10, 34, 16, 3);
      g.fillStyle(0xbdbdbd).fillRect(16, 24, 4, 14);                         // spine
      g.fillStyle(0xeeeeee).fillRect(10, 8, 16, 12);                         // skull
      g.fillStyle(0x212121).fillRect(13, 12, 3, 3).fillRect(20, 12, 3, 3);   // sockets
    });
    mk('elf', () => {
      g.fillStyle(0x00695c).fillRect(11, 40, 5, 8).fillRect(20, 40, 5, 8);
      g.fillStyle(0x80cbc4).fillRect(10, 20, 16, 20);
      g.fillStyle(0xffe0b2).fillRect(11, 8, 14, 12);
      g.fillStyle(0xfff59d).fillRect(10, 5, 16, 5);                          // hair
      g.fillStyle(0x8d6e63).fillRect(2, 14, 3, 26);                          // bow
    });
    mk('vampire', () => {
      g.fillStyle(0x212121).fillTriangle(4, 18, 32, 18, 18, 44);             // cape
      g.fillStyle(0x4a148c).fillRect(12, 20, 12, 20);
      g.fillStyle(0xf5f5f5).fillRect(11, 8, 14, 12);
      g.fillStyle(0xd50000).fillRect(14, 12, 3, 3).fillRect(20, 12, 3, 3);   // eyes
    });
    mk('goblin', () => {
      g.fillStyle(0x33691e).fillRect(12, 42, 5, 6).fillRect(20, 42, 5, 6);
      g.fillStyle(0x558b2f).fillRect(10, 28, 16, 14);
      g.fillStyle(0x7cb342).fillRect(11, 16, 14, 12);
      g.fillStyle(0x7cb342).fillRect(6, 18, 5, 4).fillRect(25, 18, 5, 4);    // ears
      g.fillStyle(0x90a4ae).fillRect(2, 30, 8, 3);                           // dagger
    });
    mk('demon', () => {
      g.fillStyle(0x7f0000).fillRect(10, 40, 6, 8).fillRect(20, 40, 6, 8);
      g.fillStyle(0xb71c1c).fillRect(8, 20, 20, 20);
      g.fillStyle(0xd32f2f).fillRect(10, 8, 16, 12);
      g.fillStyle(0x3e2723).fillTriangle(10, 8, 13, 8, 11, 2);               // horns
      g.fillStyle(0x3e2723).fillTriangle(23, 8, 26, 8, 25, 2);
      g.fillStyle(0xffeb3b).fillRect(13, 12, 3, 3).fillRect(20, 12, 3, 3);   // eyes
    });

    // white slash crescent — the classic swing effect
    if (!scene.textures.exists('slash')) {
      g.clear();
      g.lineStyle(7, 0xffffff, 1);
      g.beginPath();
      g.arc(24, 24, 19, Phaser.Math.DegToRad(-70), Phaser.Math.DegToRad(70));
      g.strokePath();
      g.lineStyle(3, 0xffffff, 0.6);
      g.beginPath();
      g.arc(24, 24, 12, Phaser.Math.DegToRad(-55), Phaser.Math.DegToRad(55));
      g.strokePath();
      g.generateTexture('slash', 48, 48);
    }

    g.destroy();
  }

  constructor(scene, groundY) {
    this.scene = scene;
    this.groundY = groundY;
    this.heroX = 150;
    this.baseX = 470;
    this.spacing = 80;
    this.max = 5;

    this.ground = scene.add.rectangle(scene.scale.width / 2, groundY + 27,
      scene.scale.width - 120, 2, 0x3c3c3c);
    this.hero = scene.add.image(this.heroX, groundY, 'hero0');
    scene.tweens.add({ targets: this.hero, y: groundY - 3, duration: 700, yoyo: true, repeat: -1 });
    this.enemies = [];
    this.fill(true);
  }

  fill(instant) {
    while (this.enemies.length < this.max) {
      const i = this.enemies.length;
      const key = 'en_' + Phaser.Utils.Array.GetRandom(Battle.TYPES);
      const e = this.scene.add.image(this.baseX + i * this.spacing, this.groundY, key);
      if (!instant) {
        e.setAlpha(0);
        this.scene.tweens.add({ targets: e, alpha: 1, duration: 300 });
      }
      this.scene.tweens.add({
        targets: e, y: this.groundY - 2, duration: 600 + i * 60, yoyo: true, repeat: -1
      });
      this.enemies.push(e);
    }
  }

  reflow() {
    this.enemies.forEach((e, i) => {
      this.scene.tweens.add({ targets: e, x: this.baseX + i * this.spacing, duration: 250 });
    });
  }

  kill(e, delay = 0) {
    this.scene.tweens.killTweensOf(e);
    this.scene.tweens.add({
      targets: e, y: '+=16', angle: 100, alpha: 0, duration: 300, delay,
      onComplete: () => e.destroy()
    });
    this.scene.time.delayedCall(delay, () => {
      this.scene.add.particles(e.x, e.y, 'pixel', {
        speed: { min: 60, max: 150 }, lifespan: 350, quantity: 8, emitting: false
      }).explode();
    });
  }

  // white swing arc, games-style: pops at the hit point, grows and fades
  slashAt(x, y, delay = 0, big = false) {
    this.scene.time.delayedCall(delay, () => {
      const s = this.scene.add.image(x, y, 'slash')
        .setBlendMode(Phaser.BlendModes.ADD)
        .setAngle(Phaser.Math.Between(-30, 30))
        .setScale(big ? 1.3 : 0.6)
        .setDepth(7);
      this.scene.tweens.add({
        targets: s, scale: big ? 2.3 : 1.4, alpha: 0, duration: 200,
        onComplete: () => s.destroy()
      });
    });
  }

  // one correct pattern = one sword hit on the front monster
  attack() {
    if (!this.enemies.length) return;
    const target = this.enemies.shift();
    this.scene.tweens.add({
      targets: this.hero, x: this.heroX + 40, duration: 90, yoyo: true, ease: 'Quad.easeOut'
    });
    this.slashAt(target.x - 10, target.y - 4);
    this.kill(target);
    this.reflow();
    this.fill(false);
  }

  // level cleared: flash + dash, every monster on screen dies
  ulti(done) {
    const s = this.scene;
    const flash = s.add.rectangle(s.scale.width / 2, this.groundY,
      s.scale.width, 130, 0xffffff, 0).setDepth(6);
    s.tweens.add({
      targets: flash, fillAlpha: 0.45, duration: 130, yoyo: true,
      onComplete: () => flash.destroy()
    });
    s.tweens.add({ targets: this.hero, x: this.heroX + 70, duration: 160, yoyo: true });
    const n = this.enemies.length;
    this.enemies.forEach((e, i) => {
      this.slashAt(e.x - 6, e.y - 4, i * 80, true);
      this.kill(e, i * 80);
    });
    this.enemies = [];
    s.time.delayedCall(n * 80 + 500, () => { this.fill(false); done(); });
  }

  // time ran out: the monsters swarm the hero and he falls
  defeat(done) {
    const s = this.scene;
    this.enemies.forEach((e, i) => {
      s.tweens.add({ targets: e, x: this.heroX + 45 + i * 22, duration: 350 });
    });
    s.time.delayedCall(420, () => {
      s.tweens.killTweensOf(this.hero);
      s.tweens.add({ targets: this.hero, angle: -90, y: '+=14', alpha: 0.4, duration: 500 });
      s.time.delayedCall(950, done);
    });
  }

  setTier(t) {
    this.hero.setTexture('hero' + Phaser.Math.Clamp(t, 0, 5));
  }

  setVisible(v) {
    [this.ground, this.hero, ...this.enemies].forEach(o => o.setVisible(v));
  }
}
