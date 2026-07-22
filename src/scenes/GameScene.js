// GameScene — placeholder gameplay proving the full loop works:
// input, physics, collectibles, score, particles, sound, pause, game over.
// Everything here gets replaced by the real mechanic on theme day.

class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.score = 0;
    this.timeLeft = 30;

    // player
    this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'player');
    this.player.setCollideWorldBounds(true);

    // input: arrows + WASD
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');

    // collectible dots
    this.dots = this.physics.add.group();
    for (let i = 0; i < 6; i++) this.spawnDot();
    this.physics.add.overlap(this.player, this.dots, (_, dot) => this.collect(dot));

    // HUD
    this.scoreText = this.add.text(16, 12, 'SCORE 0', {
      fontFamily: 'monospace', fontSize: '20px', color: '#f2f2f2'
    });
    this.timeText = this.add.text(this.scale.width - 16, 12, '30', {
      fontFamily: 'monospace', fontSize: '20px', color: '#e3242b'
    }).setOrigin(1, 0);

    // countdown
    this.time.addEvent({
      delay: 1000, loop: true,
      callback: () => {
        this.timeLeft--;
        this.timeText.setText(String(this.timeLeft));
        if (this.timeLeft <= 0) {
          Sfx.hit();
          this.scene.start('End', { score: this.score });
        }
      }
    });

    // pause
    this.paused = false;
    this.pauseText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'PAUSED', {
      fontFamily: 'monospace', fontSize: '48px', color: '#f2f2f2', fontStyle: 'bold'
    }).setOrigin(0.5).setVisible(false).setDepth(10);

    this.input.keyboard.on('keydown-ESC', () => this.togglePause());
  }

  togglePause() {
    this.paused = !this.paused;
    this.pauseText.setVisible(this.paused);
    if (this.paused) {
      this.physics.pause();
      this.time.paused = true;
    } else {
      this.physics.resume();
      this.time.paused = false;
    }
  }

  spawnDot() {
    const x = Phaser.Math.Between(40, this.scale.width - 40);
    const y = Phaser.Math.Between(60, this.scale.height - 40);
    this.dots.create(x, y, 'dot');
  }

  collect(dot) {
    dot.destroy();
    this.score += 10;
    this.scoreText.setText('SCORE ' + this.score);
    Sfx.pickup();

    this.add.particles(dot.x, dot.y, 'pixel', {
      speed: { min: 60, max: 160 },
      lifespan: 350,
      quantity: 10,
      scale: { start: 1.5, end: 0 },
      emitting: false
    }).explode();

    this.spawnDot();
  }

  update() {
    if (this.paused) return;

    const speed = 260;
    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up = this.cursors.up.isDown || this.wasd.W.isDown;
    const down = this.cursors.down.isDown || this.wasd.S.isDown;

    this.player.setVelocity(
      (right - left) * speed,
      (down - up) * speed
    );
    this.player.body.velocity.normalize().scale(speed *
      ((left || right || up || down) ? 1 : 0));
  }
}
