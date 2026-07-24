// Raiden Technology — GMTK Game Jam 2026
// Generic pre-jam skeleton. Game-specific code starts after theme reveal.

const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

// Palette lives in src/ui.js (IDE object) — the game is themed as a code editor.
const COLORS = {
  bg: 0x1e1e1e
};

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: COLORS.bg,
  // pixelArt: every texture defaults to NEAREST and the GL context drops
  // antialiasing — the game is Blender-rendered pixel art scaled up, and linear
  // filtering was quietly softening any texture the explicit NEAREST lists in
  // battle.js / items.js / MenuScene didn't name. The canvas is drawn 1:1 at
  // 960x540 (the browser does the upscale, with image-rendering: pixelated in
  // index.html), so text stays exactly as sharp as it was.
  render: { roundPixels: true, pixelArt: true },
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
