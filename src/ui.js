// Shared IDE-style chrome + language badges. The whole game is themed as a
// code editor (VS dark palette) — a deliberate break from the STAR BREAKER look.

const IDE = {
  bg: 0x1e1e1e,
  panel: 0x252526,
  border: 0x3c3c3c,
  titlebar: 0x323233,
  statusbar: 0x007acc,
  greenHex: 0x6a9955,
  text: '#d4d4d4',
  dim: '#808080',
  keyword: '#569cd6',   // VS keyword blue — valid word while typing
  stringy: '#ce9178',   // VS string orange
  comment: '#6a9955',   // VS comment green
  error: '#f44747',     // VS error red
  white: '#ffffff'
};

const UI = {
  // window title bar + blue status bar, like an editor
  chrome(scene, title) {
    const w = scene.scale.width, h = scene.scale.height;

    scene.add.rectangle(w / 2, 15, w, 30, IDE.titlebar);
    scene.add.circle(20, 15, 6, 0xf44747);
    scene.add.circle(40, 15, 6, 0xdcdcaa);
    scene.add.circle(60, 15, 6, 0x6a9955);
    scene.add.text(w / 2, 15, title, {
      fontFamily: 'monospace', fontSize: '13px', color: '#9d9d9d'
    }).setOrigin(0.5);

    scene.add.rectangle(w / 2, h - 13, w, 26, IDE.statusbar);
    const left = scene.add.text(12, h - 13, '', {
      fontFamily: 'monospace', fontSize: '13px', color: '#ffffff'
    }).setOrigin(0, 0.5);
    const right = scene.add.text(w - 12, h - 13, '', {
      fontFamily: 'monospace', fontSize: '13px', color: '#ffffff'
    }).setOrigin(1, 0.5);
    return { left, right };
  },

  // round language badge with the language's abbreviation — hand-drawn, no assets
  badge(scene, x, y, lang, r = 22) {
    const c = scene.add.container(x, y);
    const color = Phaser.Display.Color.HexStringToColor(lang.color).color;
    c.add(scene.add.circle(0, 0, r, color));
    c.add(scene.add.circle(0, 0, r, 0x000000, 0).setStrokeStyle(2, 0xffffff, 0.25));
    c.add(scene.add.text(0, 0, lang.abbr, {
      fontFamily: 'monospace', fontSize: Math.round(r * 0.8) + 'px',
      color: lang.dark ? '#1e1e1e' : '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5));
    return c;
  }
};
