// Battle strip — the hero on the left, a queue of monsters on the right.
// Each stage has its own monster AND its own backdrop. Melee stages: the
// hero dashes into contact and slashes. Ranged stages (skeleton, elf):
// the hero carries a crossbow and shoots a bolt instead.
// Monsters can drop loot: white flash, rarity label, fall to the ground,
// then fly into the bag.
//
// All art is original, code-drawn pixel style. To swap in hand-made PNGs
// load them in BootScene with the SAME keys; makeTextures() skips any key
// that is already loaded.

class Battle {
  // one monster type per stage: Very Easy → ork, Easy → skeleton,
  // Medium → elf, Hard → goblin, Very Hard → vampire, Survival → demon
  static TYPES = ['ork', 'skeleton', 'elf', 'goblin', 'vampire', 'demon'];
  static RANGED = ['skeleton', 'elf'];   // stages where the hero uses the crossbow

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
    const part = (x, y, w, h, base, flat) => {
      g.fillStyle(OUT).fillRect(x - 1, y - 1, w + 2, h + 2);
      g.fillStyle(base).fillRect(x, y, w, h);
      if (!flat && h >= 4) {
        g.fillStyle(shade(base, 1.25)).fillRect(x, y, w, 2);
        g.fillStyle(shade(base, 0.7)).fillRect(x, y + h - 2, w, 2);
      }
    };

    // --- hero tiers 0-5, sword and crossbow variants
    const armors = [0x8d6e63, 0x9e9e9e, 0xd4af37, 0x2e9c87, 0xc62828, 0x6a4fb3];
    const heroBase = (armor, t) => {
      part(12, 40, 7, 10, 0x37474f);                    // legs
      part(23, 40, 7, 10, 0x37474f);
      g.fillStyle(0x14181c).fillRect(11, 48, 9, 3).fillRect(22, 48, 9, 3); // boots
      part(9, 22, 24, 18, armor);                       // torso
      g.fillStyle(shade(armor, 0.85)).fillRect(11, 26, 20, 1).fillRect(11, 31, 20, 1); // plate lines
      g.fillStyle(shade(armor, 1.35)).fillRect(12, 24, 2, 2).fillRect(28, 24, 2, 2);   // rivets
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
        g.fillStyle(0xb0bec5).fillRect(2, 32, 3, 4);
      }
    };
    armors.forEach((armor, t) => {
      const W = 52 + t * 3;
      if (!scene.textures.exists('hero' + t)) {
        g.clear();
        heroBase(armor, t);
        part(34, 27, 4, 6, 0x5d4037, true);             // grip
        g.fillStyle(0xc9a227).fillRect(33, 26, 6, 2);   // crossguard
        g.fillStyle(0xc9a227).fillRect(34, 33, 3, 3);   // pommel
        const L = 10 + t * 3;
        g.fillStyle(0xdfe7ec).fillRect(38, 27, L, 4);   // blade
        g.fillStyle(0xffffff).fillRect(38, 27, L, 1);   // edge shine
        g.fillStyle(0xb0bec5).fillRect(38, 30, L, 1);   // fuller
        g.fillStyle(0xdfe7ec).fillTriangle(38 + L, 26, 38 + L, 32, 44 + L, 29); // tip
        g.generateTexture('hero' + t, W + 8, 52);
      }
      if (!scene.textures.exists('hero' + t + 'x')) {
        g.clear();
        heroBase(armor, t);
        part(33, 27, 12, 4, 0x5d4037, true);            // crossbow stock
        part(42, 20, 3, 18, 0x6d4c41, true);            // bow arms
        g.fillStyle(0xeeeeee).fillRect(45, 21, 1, 16);  // string
        g.fillStyle(0xb0bec5).fillRect(38, 28, 12, 2);  // loaded bolt
        g.generateTexture('hero' + t + 'x', 58, 52);
      }
    });

    // crossbow bolt projectile
    if (!scene.textures.exists('bolt')) {
      g.clear();
      g.fillStyle(0xa1887f).fillRect(0, 2, 12, 2);
      g.fillStyle(0xdfe7ec).fillTriangle(12, 0, 12, 6, 17, 3);
      g.generateTexture('bolt', 18, 6);
    }

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
      part(6, 20, 28, 20, 0x5d8a3c);
      part(4, 17, 8, 6, 0x4a7030, true);
      part(28, 17, 8, 6, 0x4a7030, true);
      part(11, 6, 18, 15, 0x7cb342);
      g.fillStyle(0xffee58).fillRect(15, 10, 3, 3).fillRect(23, 10, 3, 3);
      g.fillStyle(0xffffff).fillRect(13, 15, 3, 5).fillRect(24, 15, 3, 5);
      part(0, 18, 5, 22, 0x4e342e);
      g.fillStyle(0x8d6e63).fillRect(1, 20, 3, 2).fillRect(1, 26, 3, 2);
    });
    mk('skeleton', () => {
      part(13, 40, 4, 10, 0xd7d7d7);
      part(23, 40, 4, 10, 0xd7d7d7);
      part(12, 36, 16, 4, 0xcfcfcf, true);
      part(18, 22, 4, 14, 0xcfcfcf, true);
      g.fillStyle(0xe5e5e5).fillRect(11, 23, 18, 3).fillRect(11, 28, 18, 3).fillRect(11, 33, 18, 3);
      part(12, 5, 16, 14, 0xefefef);
      g.fillStyle(0x111111).fillRect(15, 10, 4, 4).fillRect(22, 10, 4, 4);
      g.fillStyle(0x9e9e9e).fillRect(14, 17, 12, 1);
      part(2, 22, 4, 20, 0xe0e0e0);
      g.fillStyle(0xffffff).fillRect(1, 20, 6, 3).fillRect(1, 41, 6, 3);
    });
    mk('elf', () => {
      part(12, 40, 6, 10, 0x14532d);
      part(22, 40, 6, 10, 0x14532d);
      part(10, 22, 20, 18, 0x1f7a45);
      part(10, 36, 20, 3, 0x8d6e63, true);
      part(13, 7, 15, 12, 0xffe0b2);
      part(12, 3, 17, 5, 0xd9c04a, true);
      g.fillStyle(0x1b5e20).fillRect(16, 11, 2, 2).fillRect(22, 11, 2, 2);
      part(2, 12, 3, 28, 0x6d4c41);
      g.fillStyle(0xeeeeee).fillRect(6, 13, 1, 26);
    });
    mk('goblin', () => {
      part(14, 44, 5, 6, 0x33691e);
      part(21, 44, 5, 6, 0x33691e);
      part(11, 30, 18, 14, 0x4f7a28);
      part(10, 14, 20, 16, 0x76a840);
      part(4, 18, 6, 4, 0x76a840, true);
      part(30, 18, 6, 4, 0x76a840, true);
      g.fillStyle(0xffc107).fillRect(14, 20, 3, 3).fillRect(23, 20, 3, 3);
      g.fillStyle(0x2e1b0e).fillRect(15, 26, 10, 1);
      part(2, 34, 8, 3, 0xb0bec5, true);
    });
    mk('vampire', () => {
      g.fillStyle(OUT).fillTriangle(3, 15, 37, 15, 20, 51);
      g.fillStyle(0x1a1a1a).fillTriangle(4, 16, 36, 16, 20, 49);
      g.fillStyle(0x38124a).fillTriangle(8, 18, 32, 18, 20, 44);
      part(14, 42, 5, 8, 0x212121);
      part(22, 42, 5, 8, 0x212121);
      part(12, 22, 16, 20, 0x3c1361);
      g.fillStyle(0x1a1a1a).fillTriangle(9, 8, 15, 20, 9, 22);
      g.fillStyle(0x1a1a1a).fillTriangle(31, 8, 25, 20, 31, 22);
      part(13, 6, 14, 13, 0xf3e5d8);
      g.fillStyle(0x1a1a1a).fillTriangle(17, 6, 23, 6, 20, 10);
      g.fillStyle(0xff1744).fillRect(16, 11, 3, 2).fillRect(21, 11, 3, 2);
      g.fillStyle(0xffffff).fillRect(17, 16, 1, 2).fillRect(22, 16, 1, 2);
    });
    mk('demon', () => {
      g.fillStyle(0x3a0d0d).fillTriangle(1, 18, 11, 8, 9, 34);
      g.fillStyle(0x3a0d0d).fillTriangle(39, 18, 29, 8, 31, 34);
      part(11, 40, 7, 10, 0x6d1b1b);
      part(22, 40, 7, 10, 0x6d1b1b);
      part(8, 20, 24, 20, 0xb42222);
      part(12, 6, 16, 13, 0xcf3030);
      g.fillStyle(0x2d1b12).fillTriangle(12, 6, 16, 6, 13, 0);
      g.fillStyle(0x2d1b12).fillTriangle(24, 6, 28, 6, 27, 0);
      g.fillStyle(0xffee58).fillRect(15, 10, 3, 3).fillRect(22, 10, 3, 3);
    });

    // --- one backdrop per monster type (920x104, ground top at y=86)
    const W = 920, H = 104, GY = H - 18;
    const bg = (key, draw) => {
      if (scene.textures.exists('bg_' + key)) return;
      g.clear();
      draw();
      g.generateTexture('bg_' + key, W, H);
    };
    const ground = (base, line, grass, tuft) => {
      g.fillStyle(base).fillRect(0, GY, W, 18);
      g.fillStyle(line);
      for (let y = GY; y < H; y += 6) g.fillRect(0, y, W, 1);
      for (let y = 0; y < 3; y++)
        for (let x = (y % 2) * 16; x < W; x += 32) g.fillRect(x, GY + y * 6, 1, 6);
      if (grass) {
        g.fillStyle(grass).fillRect(0, GY - 3, W, 4);
        if (tuft) {
          g.fillStyle(tuft);
          for (let x = 14; x < W; x += 38) g.fillRect(x, GY - 6, 2, 4);
        }
      }
    };

    bg('ork', () => {   // deep forest
      g.fillStyle(0x16241a).fillRect(0, 0, W, GY);
      g.fillStyle(0x1d3122).fillRect(0, GY - 30, W, 30);
      [[60, 40], [150, 56], [300, 36], [420, 50], [600, 42], [740, 58], [860, 44]].forEach(([x, h]) => {
        g.fillStyle(0x241a10).fillRect(x, GY - h, 8, h);              // trunks
        g.fillStyle(0x0f2016).fillCircle(x + 4, GY - h - 6, 18);       // canopy
        g.fillStyle(0x14301f).fillCircle(x + 12, GY - h + 2, 13);
      });
      g.fillStyle(0x87c96b);
      [[110, 30], [370, 44], [530, 26], [810, 38]].forEach(([x, y]) => g.fillRect(x, y, 2, 2)); // fireflies
      ground(0x3a2c1c, 0x2a2014, 0x2f5d2a, 0x417c39);
    });
    bg('skeleton', () => {   // graveyard
      g.fillStyle(0x1d2130).fillRect(0, 0, W, GY);
      g.fillStyle(0xe8e3c8).fillCircle(838, 22, 11);
      g.fillStyle(0x1d2130).fillCircle(834, 19, 9);
      [[120, 0], [380, 0], [700, 0]].forEach(([x]) => {                // dead trees
        g.fillStyle(0x14151c).fillRect(x, GY - 44, 5, 44)
          .fillRect(x - 12, GY - 40, 14, 3).fillRect(x + 4, GY - 52, 3, 14);
      });
      [[220, 16], [300, 12], [520, 18], [610, 12], [800, 16]].forEach(([x, h]) => {
        g.fillStyle(0x3a3f52).fillRect(x, GY - h, 14, h);              // tombstones
        g.fillStyle(0x2c3040).fillRect(x, GY - h, 14, 3);
      });
      g.fillStyle(0x39445e).fillRect(0, GY - 8, W, 5);                 // fog band
      ground(0x2c2a26, 0x201e1b, 0x39413b, null);
    });
    bg('elf', () => {   // enchanted glade
      g.fillStyle(0x102830).fillRect(0, 0, W, GY);
      g.fillStyle(0x16414a).fillRect(0, GY - 26, W, 26);
      [[90, 46], [260, 60], [500, 40], [680, 56], [850, 48]].forEach(([x, h]) => {
        g.fillStyle(0x1e2a20).fillRect(x, GY - h, 7, h);
        g.fillStyle(0x2e7d6b).fillCircle(x + 3, GY - h - 4, 15);       // glowing canopy
        g.fillStyle(0x4dd0a1).fillCircle(x + 3, GY - h - 8, 6);
      });
      [[180, 10], [430, 8], [760, 10]].forEach(([x, r]) => {           // mushrooms
        g.fillStyle(0xefe6d0).fillRect(x, GY - 8, 4, 8);
        g.fillStyle(0xd9534f).fillCircle(x + 2, GY - 9, r);
        g.fillStyle(0xffffff).fillRect(x - 2, GY - 12, 2, 2).fillRect(x + 5, GY - 11, 2, 2);
      });
      g.fillStyle(0x9fe8c8);
      [[70, 24], [330, 38], [560, 20], [790, 34]].forEach(([x, y]) => g.fillRect(x, y, 2, 2)); // motes
      ground(0x2b2418, 0x1f1a11, 0x1e4632, 0x2f6b4d);
    });
    bg('goblin', () => {   // torch-lit cave
      g.fillStyle(0x181410).fillRect(0, 0, W, GY);
      g.fillStyle(0x241e18);
      for (let x = 0; x < W; x += 60) g.fillTriangle(x, 0, x + 44, 0, x + 22, 22 + (x % 3) * 8); // stalactites
      [[160, 0], [470, 0], [780, 0]].forEach(([x]) => {                // torches
        g.fillStyle(0x4e342e).fillRect(x, GY - 26, 4, 26);
        g.fillStyle(0xff9800).fillTriangle(x - 2, GY - 26, x + 6, GY - 26, x + 2, GY - 38);
        g.fillStyle(0xffee58).fillTriangle(x, GY - 26, x + 4, GY - 26, x + 2, GY - 33);
      });
      [[260, 12], [640, 10]].forEach(([x, h]) => {                     // rocks
        g.fillStyle(0x2c2620).fillTriangle(x, GY, x + 30, GY, x + 15, GY - h - 8);
      });
      g.fillStyle(0x4dd0e1).fillTriangle(350, GY, 356, GY, 353, GY - 10); // crystal
      g.fillStyle(0x4dd0e1).fillTriangle(700, GY, 708, GY, 704, GY - 13);
      ground(0x2c2620, 0x201c17, null, null);
    });
    bg('vampire', () => {   // grand crimson hall
      g.fillStyle(0x2c0b10).fillRect(0, 0, W, GY);
      g.fillStyle(0x3a1015).fillRect(0, 22, W, GY - 22);
      g.fillStyle(0xc9a227).fillRect(0, 20, W, 2);                     // gold trim
      for (let x = 40; x < W; x += 160) {                              // columns
        g.fillStyle(0x57181f).fillRect(x, 22, 18, GY - 22);
        g.fillStyle(0x6d2028).fillRect(x, 22, 4, GY - 22);
        g.fillStyle(0xc9a227).fillRect(x - 3, 22, 24, 4).fillRect(x - 3, GY - 6, 24, 6);
      }
      for (let x = 110; x < W; x += 160) {                             // arched windows
        g.fillStyle(0x200609).fillRect(x, 34, 22, 34);
        g.fillStyle(0x200609).fillCircle(x + 11, 34, 11);
        g.fillStyle(0x8c1c2b).fillRect(x + 10, 34, 2, 34);
      }
      for (let x = 150; x < W; x += 320) {                             // banners
        g.fillStyle(0x6d1220).fillRect(x, 24, 16, 26);
        g.fillStyle(0x6d1220).fillTriangle(x, 50, x + 16, 50, x + 8, 60);
        g.fillStyle(0xc9a227).fillRect(x + 6, 30, 4, 4);
      }
      g.fillStyle(0x6d1220).fillRect(0, GY, W, 18);                    // carpet
      g.fillStyle(0x8c1c2b).fillRect(0, GY, W, 3);
      g.fillStyle(0xc9a227).fillRect(0, GY + 4, W, 1).fillRect(0, GY + 14, W, 1);
    });
    bg('demon', () => {   // hellscape
      g.fillStyle(0x1a0b08).fillRect(0, 0, W, GY);
      g.fillStyle(0x2d0f08).fillRect(0, GY - 30, W, 30);
      g.fillStyle(0x241210).fillTriangle(600, GY, 780, GY, 690, GY - 58);   // volcano
      g.fillStyle(0xff5722).fillRect(682, GY - 58, 16, 4);
      g.fillStyle(0xff9800).fillTriangle(684, GY - 58, 696, GY - 58, 690, GY - 74); // eruption
      g.fillStyle(0xff7043);
      [[100, 30], [280, 18], [460, 40], [840, 26]].forEach(([x, y]) => g.fillRect(x, y, 2, 2)); // embers
      [[60, 0], [230, 0], [420, 0], [560, 0], [820, 0]].forEach(([x]) => {  // flames
        g.fillStyle(0xbf360c).fillTriangle(x, GY, x + 18, GY, x + 9, GY - 20);
        g.fillStyle(0xff9800).fillTriangle(x + 3, GY, x + 15, GY, x + 9, GY - 14);
        g.fillStyle(0xffee58).fillTriangle(x + 6, GY, x + 12, GY, x + 9, GY - 8);
      });
      g.fillStyle(0x241210).fillRect(0, GY, W, 18);                    // scorched ground
      g.fillStyle(0xff5722);
      for (let x = 30; x < W; x += 90) g.fillRect(x, GY + 6 + (x % 2) * 4, 24, 2); // lava cracks
      g.fillStyle(0xbf360c).fillRect(0, GY, W, 2);
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

    // crisp pixels: nearest-neighbor filtering for every battle texture
    Object.keys(scene.textures.list)
      .filter(k => /^(hero|en_|bg_|bolt|slash)/.test(k))
      .forEach(k => scene.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST));
  }

  constructor(scene, groundY) {
    this.scene = scene;
    this.groundY = groundY;
    this.heroX = 150;
    this.baseX = 470;
    this.spacing = 80;
    this.max = 5;
    this.typeIndex = 0;
    this.tier = 0;
    this.ranged = false;
    this.decor = [];

    this.striking = false;
    this.strikeTarget = null;
    this.bossActive = false;
    this.bg = scene.add.image(scene.scale.width / 2, groundY - 10, 'bg_ork');
    this.hero = scene.add.image(this.heroX, groundY - 7, 'hero0').setScale(1.15);
    // idle bob runs forever on y; dashes animate x only, so they don't conflict
    scene.tweens.add({ targets: this.hero, y: groundY - 10, duration: 700, yoyo: true, repeat: -1 });
    this.heroDash = null;
    this.enemies = [];
    this.fill(true);
  }

  // start a hero lunge/recoil on x, cancelling any in-flight one. Kept separate
  // from the y idle-bob (killTweensOf(hero) would have frozen the bob for good).
  dashHero(cfg) {
    if (this.heroDash) this.heroDash.stop();
    this.hero.x = this.heroX;
    this.heroDash = this.scene.tweens.add(Object.assign({ targets: this.hero }, cfg));
    return this.heroDash;
  }

  fill(instant) {
    if (this.bossActive) return;
    while (this.enemies.length < this.max) {
      const i = this.enemies.length;
      const key = 'en_' + Battle.TYPES[this.typeIndex];
      const e = this.scene.add.image(this.baseX + i * this.spacing, this.groundY - 7, key)
        .setScale(1.15);
      if (!instant) {
        e.setAlpha(0);
        this.scene.tweens.add({ targets: e, alpha: 1, duration: 300 });
      }
      this.scene.tweens.add({
        targets: e, y: this.groundY - 10, duration: 600 + i * 60, yoyo: true, repeat: -1
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
      const em = this.scene.add.particles(e.x, e.y, 'pixel', {
        speed: { min: 60, max: 150 }, lifespan: 350, quantity: 8, emitting: false
      });
      em.explode();
      this.scene.time.delayedCall(450, () => em.destroy());
    });
  }

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

  // one correct pattern = one hit. Melee: dash INTO the monster and slash.
  // Ranged stages: stand ground, loose a crossbow bolt. Returns the hit spot.
  attack() {
    if (!this.enemies.length) return null;
    const target = this.enemies.shift();
    if (target === this.strikeTarget) { this.striking = false; this.strikeTarget = null; }
    const pos = { x: target.x, y: target.y };
    const s = this.scene;

    if (this.ranged) {
      this.dashHero({ x: this.heroX - 6, duration: 60, yoyo: true }); // recoil
      const bolt = s.add.image(this.heroX + 34, this.groundY - 12, 'bolt').setDepth(6);
      s.tweens.add({
        targets: bolt, x: pos.x - 12, duration: 140, ease: 'Linear',
        onComplete: () => {
          bolt.destroy();
          this.slashAt(pos.x - 8, pos.y - 4);
          this.kill(target);
        }
      });
    } else {
      this.dashHero({
        x: pos.x - 48, duration: 140, yoyo: true,
        ease: 'Quad.easeIn', hold: 60
      });
      this.slashAt(pos.x - 10, pos.y - 4, 140);
      this.kill(target, 150);
    }
    this.reflow();
    this.fill(false);
    return pos;
  }

  // loot presentation: white flash, item falls to the ground with its rarity
  // label glowing in the rarity color, then flies into the bag
  dropLoot(pos, item, bagX, bagY, onDone) {
    const s = this.scene;
    const rar = RARITIES[item.r];
    s.time.delayedCall(350, () => {
      const flash = s.add.image(pos.x, pos.y, 'slash')
        .setBlendMode(Phaser.BlendModes.ADD).setScale(0.4).setDepth(8);
      s.tweens.add({ targets: flash, scale: 1.8, alpha: 0, duration: 250, onComplete: () => flash.destroy() });

      const icon = s.add.image(pos.x, pos.y - 26, ITEM_TYPES[item.t].tex).setDepth(8);
      const label = s.add.text(pos.x, this.groundY + 24, rar.name, {
        fontFamily: 'monospace', fontSize: '12px', color: rar.color, fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(8).setAlpha(0);
      const ring = s.add.circle(pos.x, this.groundY + 6, 14, rar.tint, 0)
        .setStrokeStyle(2, rar.tint, 0.9).setDepth(7).setAlpha(0);

      s.tweens.add({   // fall + bounce
        targets: icon, y: this.groundY + 6, duration: 450, ease: 'Bounce.easeOut',
        onComplete: () => {
          label.setAlpha(1);
          ring.setAlpha(1);
          s.tweens.add({ targets: ring, scale: 1.4, alpha: 0.2, duration: 500, yoyo: true, repeat: 1 });
          s.tweens.add({ targets: icon, angle: 8, duration: 260, yoyo: true, repeat: 2 });
          s.time.delayedCall(1400, () => {   // fly to the bag
            s.tweens.add({
              targets: [icon, label, ring], x: bagX, y: bagY, scale: 0.3, alpha: 0,
              duration: 380, ease: 'Cubic.easeIn',
              onComplete: () => { icon.destroy(); label.destroy(); ring.destroy(); onDone(); }
            });
          });
        }
      });
    });
  }

  ulti(done) {
    const s = this.scene;
    const flash = s.add.rectangle(s.scale.width / 2, this.groundY,
      s.scale.width, 130, 0xffffff, 0).setDepth(6);
    s.tweens.add({
      targets: flash, fillAlpha: 0.45, duration: 130, yoyo: true,
      onComplete: () => flash.destroy()
    });
    this.dashHero({ x: this.heroX + 70, duration: 160, yoyo: true });
    const n = this.enemies.length;
    this.enemies.forEach((e, i) => {
      this.slashAt(e.x - 6, e.y - 4, i * 80, true);
      this.kill(e, i * 80);
    });
    this.enemies = [];
    s.time.delayedCall(n * 80 + 500, () => { this.fill(false); done(); });
  }

  // the front monster steps up and strikes the hero once.
  // lethal=false: a warning hit (red flash + knockback), then it walks back.
  // lethal=true: the killing blow — the hero falls.
  enemyStrike(lethal, done) {
    const s = this.scene;
    // Self-heal a stale strike flag. A strike only clears `striking` in its own
    // onComplete; but ulti() (each level-up) and spawnBoss() kill every enemy
    // mid-strike, dropping that tween WITHOUT firing onComplete. The flag then
    // sticks true and strikeTarget points at a destroyed object, so this guard
    // early-returns forever and the periodic strikes silently stop for the rest
    // of the run. During a real in-flight strike the target IS enemies[0], so
    // this only fires when the tracked monster is gone.
    if (this.striking && this.strikeTarget !== this.enemies[0]) {
      this.striking = false;
      this.strikeTarget = null;
    }
    if (!this.enemies.length || (this.striking && !lethal)) { if (done) done(); return; }
    const e = this.enemies[0];
    const back = e.x;
    // A boss is a scale-2.6 sprite resting mid-field; charging it all the way to
    // the hero and back every 6s reads as a shuttle, not a threat. For the
    // periodic (non-lethal) boss strike, do a short forward jab and burst a big
    // slash at its reach instead. Grunts — and any lethal blow, including the
    // boss's own killing charge — still close the full distance to the hero.
    const bossJab = this.bossActive && !lethal;
    const lungeX = bossJab ? back - 110 : this.heroX + 44;
    this.striking = true;
    this.strikeTarget = e;
    s.tweens.killTweensOf(e);
    s.tweens.add({
      targets: e, x: lungeX, duration: bossJab ? 200 : 260, ease: 'Quad.easeIn',
      onComplete: () => {
        if (e !== this.strikeTarget) return;   // it died mid-charge
        const slX = bossJab ? e.x - 30 : this.heroX + 14;
        const sl = s.add.image(slX, this.groundY - 14, 'slash')
          .setBlendMode(Phaser.BlendModes.ADD).setTint(0xff6655)
          .setScale(bossJab ? 1.1 : 0.7).setAngle(Phaser.Math.Between(150, 210)).setDepth(7);
        s.tweens.add({ targets: sl, scale: bossJab ? 2 : 1.5, alpha: 0, duration: 200, onComplete: () => sl.destroy() });
        Sfx.hit();
        if (lethal) {
          s.tweens.killTweensOf(this.hero);
          this.hero.setTint(0xff8888);
          s.tweens.add({ targets: this.hero, angle: -90, y: '+=14', alpha: 0.4, duration: 500 });
          s.time.delayedCall(950, () => {
            this.striking = false;
            this.strikeTarget = null;
            if (done) done();
          });
        } else {
          // The grunt strike closes to the hero, so the hero flinching (red tint
          // + knockback) reads as a real poke. The boss JAB, however, only lunges
          // ~110px and halts mid-field, hundreds of px short of the hero — so
          // flinching the hero there looks like it reacts to a hit that never
          // arrives. Skip the hero recoil for the jab; the big slash bursting at
          // the boss's reach is the telegraph. (Non-lethal strikes deal no time
          // damage either way — this is pure feedback readability.)
          if (!bossJab) {
            this.hero.setTint(0xff8888);
            s.tweens.add({ targets: this.hero, x: this.heroX - 14, duration: 90, yoyo: true });
            s.time.delayedCall(260, () => this.hero.clearTint());
          }
          s.tweens.add({
            targets: e, x: back, duration: 320, delay: 160, ease: 'Quad.easeOut',
            onComplete: () => {
              this.striking = false;
              this.strikeTarget = null;
              // restore the idle hover at the RIGHT height: a boss floats far
              // higher than a rank-and-file monster, so groundY-10 would sink it.
              const restY = this.bossActive ? this.groundY - 38 : this.groundY - 10;
              s.tweens.add({ targets: e, y: restY, duration: 650, yoyo: true, repeat: -1 });
              if (done) done();
            }
          });
        }
      }
    });
  }

  // time ran out: only the front monster attacks — one lethal blow
  defeat(done) {
    this.enemyStrike(true, done);
  }

  // --- boss fight: one giant monster of the current stage's type ---

  spawnBoss() {
    const s = this.scene;
    this.enemies.forEach(e => { s.tweens.killTweensOf(e); e.destroy(); });
    this.enemies = [];
    this.bossActive = true;
    const key = 'en_' + Battle.TYPES[this.typeIndex];
    const b = s.add.image(620, this.groundY - 34, key)
      .setScale(2.6).setAlpha(0);
    s.tweens.add({ targets: b, alpha: 1, duration: 400 });
    s.tweens.add({ targets: b, y: this.groundY - 38, duration: 800, yoyo: true, repeat: -1 });
    this.enemies.push(b);
  }

  // a hit that hurts but does not kill: the boss flashes and staggers
  bossHit() {
    const b = this.enemies[0];
    if (!b) return null;
    const pos = { x: b.x, y: b.y };
    const s = this.scene;
    if (this.ranged) {
      this.dashHero({ x: this.heroX - 6, duration: 60, yoyo: true });
      const bolt = s.add.image(this.heroX + 34, this.groundY - 12, 'bolt').setDepth(6);
      s.tweens.add({
        targets: bolt, x: pos.x - 40, duration: 140,
        onComplete: () => {
          bolt.destroy();
          this.slashAt(pos.x - 30, pos.y, 0, true);
          this.bossFlinch(b);
        }
      });
    } else {
      this.dashHero({
        x: pos.x - 80, duration: 140, yoyo: true,
        ease: 'Quad.easeIn', hold: 60
      });
      this.slashAt(pos.x - 34, pos.y, 140, true);
      this.scene.time.delayedCall(150, () => this.bossFlinch(b));
    }
    return pos;
  }

  bossFlinch(b) {
    const s = this.scene;
    b.setTint(0xff9999);
    s.tweens.add({ targets: b, x: '+=10', duration: 70, yoyo: true });
    s.time.delayedCall(180, () => b.clearTint());
    const em = s.add.particles(b.x - 20, b.y, 'pixel', {
      speed: { min: 60, max: 150 }, lifespan: 300, quantity: 6, emitting: false
    });
    em.explode();
    s.time.delayedCall(400, () => em.destroy());
  }

  bossDie(done) {
    const s = this.scene;
    const b = this.enemies[0];
    this.enemies = [];
    const flash = s.add.rectangle(s.scale.width / 2, this.groundY,
      s.scale.width, 130, 0xffffff, 0).setDepth(6);
    s.tweens.add({
      targets: flash, fillAlpha: 0.5, duration: 150, yoyo: true,
      onComplete: () => flash.destroy()
    });
    if (b) {
      for (let i = 0; i < 4; i++) {
        this.slashAt(b.x - 30 + Phaser.Math.Between(-20, 20),
          b.y + Phaser.Math.Between(-25, 25), i * 110, true);
      }
      s.tweens.killTweensOf(b);
      s.tweens.add({
        targets: b, y: '+=30', angle: 100, alpha: 0, duration: 700, delay: 380,
        onComplete: () => b.destroy()
      });
    }
    s.time.delayedCall(1200, done);
  }

  clearBoss() {
    this.bossActive = false;
    this.fill(false);
  }

  applyHeroTexture() {
    this.hero.setTexture('hero' + this.tier + (this.ranged ? 'x' : ''));
  }

  setTier(t) {
    this.tier = Phaser.Math.Clamp(t, 0, 5);
    this.applyHeroTexture();
  }

  // stage decides the monster type, the backdrop and the hero's weapon
  setStage(i) {
    this.typeIndex = Phaser.Math.Clamp(i, 0, Battle.TYPES.length - 1);
    const type = Battle.TYPES[this.typeIndex];
    this.bg.setTexture('bg_' + type);
    this.ranged = Battle.RANGED.includes(type);
    this.applyHeroTexture();
    this.enemies.forEach(e => e.setTexture('en_' + type));

    this.decor.forEach(d => d.destroy());
    this.decor = [];
    if (type === 'demon') {   // fire fountains
      [340, 700].forEach(x => {
        const em = this.scene.add.particles(x, this.groundY + 12, 'pixel', {
          speedY: { min: -70, max: -30 }, speedX: { min: -12, max: 12 },
          scale: { start: 2, end: 0 }, tint: [0xff7043, 0xffca28, 0xef5350],
          lifespan: 600, frequency: 90
        });
        this.decor.push(em);
      });
    }
  }

  setVisible(v) {
    [this.bg, this.hero, ...this.enemies, ...this.decor].forEach(o => o.setVisible(v));
  }
}
