// Battle strip — the hero on the left, a queue of monsters on the right,
// fighting in front of a retro side-scroller backdrop (dusk sky, moon,
// castle silhouette, brick ground). Every correct pattern = one sword hit.
// Clearing a level = ulti attack. Running out of time = the monsters swarm.
//
// All art is original, code-drawn pixel style: dark outlines + 3-tone
// shading. To swap in hand-made PNGs (e.g. Blender renders), load them in
// BootScene with the SAME keys ('hero0'..'hero5', 'en_ork', 'en_skeleton',
// 'en_elf', 'en_vampire', 'en_goblin', 'en_demon', 'battlebg');
// makeTextures() skips any key that is already loaded.

class Battle {
  // one monster type per stage: Very Easy → ork, Easy → skeleton,
  // Medium → elf, Hard → goblin, Very Hard → vampire, Survival → demon
  static TYPES = ['ork', 'skeleton', 'elf', 'goblin', 'vampire', 'demon'];

  static makeTextures(scene) {
    const g = scene.add.graphics();
    const OUT = 0x0e1216;

    const shade = (c, f) => {
      const col = Phaser.Display.Color.IntegerToColor(c);
      const r = Phaser.Math.Clamp(Math.round(col.red * f), 0, 255);
      const gr = Phaser.Math.Clamp(Math.round(col.green * f), 0, 255);
      const b = Phaser.Math.Clamp(Math.round(col.blue * f), 0, 255);
      return (r << 16) | (gr << 8) | b;
    };
    // outlined block with top highlight and bottom shadow
    const part = (x, y, w, h, base, flat) => {
      g.fillStyle(OUT).fillRect(x - 1, y - 1, w + 2, h + 2);
      g.fillStyle(base).fillRect(x, y, w, h);
      if (!flat && h >= 4) {
        g.fillStyle(shade(base, 1.25)).fillRect(x, y, w, 2);
        g.fillStyle(shade(base, 0.7)).fillRect(x, y + h - 2, w, 2);
      }
    };

    // --- hero tiers 0-5: armor color changes, sword grows, gear is added
    const armors = [0x8d6e63, 0x9e9e9e, 0xd4af37, 0x2e9c87, 0xc62828, 0x6a4fb3];
    armors.forEach((armor, t) => {
      const key = 'hero' + t, W = 48 + t * 3;
      if (scene.textures.exists(key)) return;
      g.clear();
      part(12, 40, 7, 10, 0x37474f);                    // legs
      part(23, 40, 7, 10, 0x37474f);
      g.fillStyle(0x14181c).fillRect(11, 48, 9, 3).fillRect(22, 48, 9, 3); // boots
      part(9, 22, 24, 18, armor);                       // torso armor
      part(9, 36, 24, 4, 0x5d4037, true);               // belt
      g.fillStyle(0xc9a227).fillRect(19, 36, 4, 4);     // buckle
      part(4, 24, 6, 12, armor);                        // arms
      part(32, 24, 6, 12, armor);
      part(13, 8, 16, 13, 0xf0c29a);                    // head
      g.fillStyle(0x2b1d12).fillRect(19, 13, 2, 2).fillRect(24, 13, 2, 2); // eyes
      if (t >= 1) part(12, 4, 18, 6, armor);            // helmet
      if (t >= 3) part(18, 0, 6, 4, 0xd32f2f, true);    // plume
      if (t >= 2) {                                     // shield
        part(0, 26, 7, 16, 0x4e342e);
        g.fillStyle(0xb0bec5).fillRect(2, 32, 3, 4);    // metal boss
      }
      part(34, 28, 5, 4, 0x4e342e, true);               // hilt
      part(38, 29, 8 + t * 3, 3, 0xdfe7ec, true);       // blade
      g.fillStyle(0xffffff).fillRect(38, 29, 8 + t * 3, 1); // edge shine
      g.generateTexture(key, W, 52);
    });

    // --- monsters (facing left, 40x52)
    const mk = (key, draw) => {
      if (scene.textures.exists('en_' + key)) return;
      g.clear();
      draw();
      g.generateTexture('en_' + key, 40, 52);
    };
    mk('ork', () => {
      part(10, 40, 7, 10, 0x2e4d1e);
      part(23, 40, 7, 10, 0x2e4d1e);
      part(6, 20, 28, 20, 0x5d8a3c);                     // broad torso
      part(4, 17, 8, 6, 0x4a7030, true);                 // shoulder pads
      part(28, 17, 8, 6, 0x4a7030, true);
      part(11, 6, 18, 15, 0x7cb342);                     // head
      g.fillStyle(0xffee58).fillRect(15, 10, 3, 3).fillRect(23, 10, 3, 3); // eyes
      g.fillStyle(0xffffff).fillRect(13, 15, 3, 5).fillRect(24, 15, 3, 5); // tusks
      part(0, 18, 5, 22, 0x4e342e);                      // club
      g.fillStyle(0x8d6e63).fillRect(1, 20, 3, 2).fillRect(1, 26, 3, 2);   // studs
    });
    mk('skeleton', () => {
      part(13, 40, 4, 10, 0xd7d7d7);
      part(23, 40, 4, 10, 0xd7d7d7);
      part(12, 36, 16, 4, 0xcfcfcf, true);               // pelvis
      part(18, 22, 4, 14, 0xcfcfcf, true);               // spine
      g.fillStyle(0xe5e5e5).fillRect(11, 23, 18, 3).fillRect(11, 28, 18, 3).fillRect(11, 33, 18, 3); // ribs
      part(12, 5, 16, 14, 0xefefef);                     // skull
      g.fillStyle(0x111111).fillRect(15, 10, 4, 4).fillRect(22, 10, 4, 4); // sockets
      g.fillStyle(0x9e9e9e).fillRect(14, 17, 12, 1);     // jaw line
      part(2, 22, 4, 20, 0xe0e0e0);                      // bone club
      g.fillStyle(0xffffff).fillRect(1, 20, 6, 3).fillRect(1, 41, 6, 3);   // knobs
    });
    mk('elf', () => {
      part(12, 40, 6, 10, 0x14532d);
      part(22, 40, 6, 10, 0x14532d);
      part(10, 22, 20, 18, 0x1f7a45);                    // tunic
      part(10, 36, 20, 3, 0x8d6e63, true);               // belt
      part(13, 7, 15, 12, 0xffe0b2);                     // head
      part(12, 3, 17, 5, 0xd9c04a, true);                // hair
      g.fillStyle(0x1b5e20).fillRect(16, 11, 2, 2).fillRect(22, 11, 2, 2); // eyes
      part(2, 12, 3, 28, 0x6d4c41);                      // bow
      g.fillStyle(0xeeeeee).fillRect(6, 13, 1, 26);      // bowstring
    });
    mk('vampire', () => {
      g.fillStyle(OUT).fillTriangle(3, 15, 37, 15, 20, 51);   // cape outline
      g.fillStyle(0x1a1a1a).fillTriangle(4, 16, 36, 16, 20, 49);
      g.fillStyle(0x38124a).fillTriangle(8, 18, 32, 18, 20, 44); // cape lining
      part(14, 42, 5, 8, 0x212121);
      part(22, 42, 5, 8, 0x212121);
      part(12, 22, 16, 20, 0x3c1361);                    // suit
      g.fillStyle(0x1a1a1a).fillTriangle(9, 8, 15, 20, 9, 22);  // collar
      g.fillStyle(0x1a1a1a).fillTriangle(31, 8, 25, 20, 31, 22);
      part(13, 6, 14, 13, 0xf3e5d8);                     // pale head
      g.fillStyle(0x1a1a1a).fillTriangle(17, 6, 23, 6, 20, 10); // widow's peak
      g.fillStyle(0xff1744).fillRect(16, 11, 3, 2).fillRect(21, 11, 3, 2); // eyes
      g.fillStyle(0xffffff).fillRect(17, 16, 1, 2).fillRect(22, 16, 1, 2); // fangs
    });
    mk('goblin', () => {
      part(14, 44, 5, 6, 0x33691e);
      part(21, 44, 5, 6, 0x33691e);
      part(11, 30, 18, 14, 0x4f7a28);                    // small body
      part(10, 14, 20, 16, 0x76a840);                    // big head
      part(4, 18, 6, 4, 0x76a840, true);                 // ears
      part(30, 18, 6, 4, 0x76a840, true);
      g.fillStyle(0xffc107).fillRect(14, 20, 3, 3).fillRect(23, 20, 3, 3); // eyes
      g.fillStyle(0x2e1b0e).fillRect(15, 26, 10, 1);     // grin
      part(2, 34, 8, 3, 0xb0bec5, true);                 // dagger
    });
    mk('demon', () => {
      g.fillStyle(0x3a0d0d).fillTriangle(1, 18, 11, 8, 9, 34);   // wings
      g.fillStyle(0x3a0d0d).fillTriangle(39, 18, 29, 8, 31, 34);
      part(11, 40, 7, 10, 0x6d1b1b);
      part(22, 40, 7, 10, 0x6d1b1b);
      part(8, 20, 24, 20, 0xb42222);                     // torso
      part(12, 6, 16, 13, 0xcf3030);                     // head
      g.fillStyle(0x2d1b12).fillTriangle(12, 6, 16, 6, 13, 0);   // horns
      g.fillStyle(0x2d1b12).fillTriangle(24, 6, 28, 6, 27, 0);
      g.fillStyle(0xffee58).fillRect(15, 10, 3, 3).fillRect(22, 10, 3, 3); // eyes
    });

    // --- backdrop: dusk sky, moon, clouds, castle silhouette, brick ground
    if (!scene.textures.exists('battlebg')) {
      const W = 920, H = 104, GY = H - 18;
      g.clear();
      g.fillStyle(0x1c2438).fillRect(0, 0, W, GY);                  // sky
      g.fillStyle(0x232c44).fillRect(0, GY - 26, W, 26);            // horizon glow
      g.fillStyle(0xe8e3c8).fillCircle(838, 22, 11);                // moon
      g.fillStyle(0x1c2438).fillCircle(834, 19, 9);                 // crescent bite
      [[70, 16], [180, 26], [430, 12], [560, 24], [730, 18]].forEach(([x, y]) => {
        g.fillStyle(0x39445e).fillRect(x, y, 46, 6).fillRect(x + 10, y - 4, 26, 5); // clouds
      });
      // castle silhouette with battlements
      const castle = (x, w, h) => {
        g.fillStyle(0x121828).fillRect(x, GY - h, w, h);
        for (let i = 0; i < w; i += 8) g.fillRect(x + i, GY - h - 4, 5, 4);
      };
      castle(240, 34, 34); castle(274, 60, 22); castle(334, 34, 40);
      castle(640, 30, 28); castle(670, 50, 18); castle(720, 30, 36);
      g.fillStyle(0xf7d774).fillRect(250, GY - 26, 3, 4).fillRect(345, GY - 30, 3, 4)
        .fillRect(650, GY - 20, 3, 4).fillRect(729, GY - 28, 3, 4);  // lit windows
      // ground: bricks + grass lip
      g.fillStyle(0x3b2a20).fillRect(0, GY, W, 18);
      g.fillStyle(0x2a1d16);
      for (let y = GY; y < H; y += 6) g.fillRect(0, y, W, 1);
      for (let y = 0; y < 3; y++)
        for (let x = (y % 2) * 16; x < W; x += 32) g.fillRect(x, GY + y * 6, 1, 6);
      g.fillStyle(0x33691e).fillRect(0, GY - 3, W, 4);
      g.fillStyle(0x4e8a37);
      for (let x = 14; x < W; x += 38) g.fillRect(x, GY - 6, 2, 4);
      g.generateTexture('battlebg', W, H);
    }

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

    this.typeIndex = 0;
    this.bg = scene.add.image(scene.scale.width / 2, groundY - 10, 'battlebg');
    this.hero = scene.add.image(this.heroX, groundY - 4, 'hero0');
    scene.tweens.add({ targets: this.hero, y: groundY - 7, duration: 700, yoyo: true, repeat: -1 });
    this.enemies = [];
    this.fill(true);
  }

  fill(instant) {
    while (this.enemies.length < this.max) {
      const i = this.enemies.length;
      const key = 'en_' + Battle.TYPES[this.typeIndex];
      const e = this.scene.add.image(this.baseX + i * this.spacing, this.groundY - 4, key);
      if (!instant) {
        e.setAlpha(0);
        this.scene.tweens.add({ targets: e, alpha: 1, duration: 300 });
      }
      this.scene.tweens.add({
        targets: e, y: this.groundY - 6, duration: 600 + i * 60, yoyo: true, repeat: -1
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

  // stage decides the monster type; retexture the ones already on screen
  setStage(i) {
    this.typeIndex = Phaser.Math.Clamp(i, 0, Battle.TYPES.length - 1);
    const key = 'en_' + Battle.TYPES[this.typeIndex];
    this.enemies.forEach(e => e.setTexture(key));
  }

  setVisible(v) {
    [this.bg, this.hero, ...this.enemies].forEach(o => o.setVisible(v));
  }
}
