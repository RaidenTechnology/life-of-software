// Raiden Technology — GMTK Game Jam 2026
// Generic pre-jam skeleton. Game-specific code starts after theme reveal.

const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

// Brand palette
const COLORS = {
  bg: 0x0a0a0a,
  fg: 0xf2f2f2,
  accent: 0xe3242b,   // Raiden red
  dim: 0x555555
};

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: COLORS.bg,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [BootScene, MenuScene, GameScene, EndScene]
};

const game = new Phaser.Game(config);
