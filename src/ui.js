// Shared IDE-style chrome + language badges. The whole game is themed as a
// code editor (VS dark palette).

const IDE = {
  bg: 0x1e1e1e,
  panel: 0x2b2b30,
  border: 0x50505a,
  titlebar: 0x3a3a3e,
  statusbar: 0x007acc,
  greenHex: 0x6a9955,
  text: '#e8e8e8',
  dim: '#a0a0a0',
  keyword: '#569cd6',   // VS keyword blue — valid word while typing
  stringy: '#ce9178',   // VS string orange
  comment: '#6a9955',   // VS comment green
  error: '#f44747',     // VS error red
  white: '#ffffff'
};

const UI = {
  // window title bar + blue status bar, like an editor. Also mounts the
  // settings gear (top-right) with the sound toggle panel.
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

    this.settings(scene);
    return { left, right };
  },

  // gear button + tiny settings panel (sound on/off)
  settings(scene) {
    const w = scene.scale.width;
    const gear = scene.add.text(w - 12, 15, '⚙', {
      fontFamily: 'monospace', fontSize: '18px', color: '#9d9d9d'
    }).setOrigin(1, 0.5).setDepth(31).setInteractive({ useHandCursor: true });

    const panel = scene.add.container(w - 106, 92).setDepth(31).setVisible(false);
    panel.add(scene.add.rectangle(0, 0, 188, 106, IDE.panel).setStrokeStyle(1, IDE.border));
    panel.add(scene.add.text(0, -38, 'SETTINGS', {
      fontFamily: 'monospace', fontSize: '12px', color: IDE.dim
    }).setOrigin(0.5));

    const soundRow = scene.add.text(0, -12, '', {
      fontFamily: 'monospace', fontSize: '16px', color: IDE.keyword
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const refresh = () => soundRow.setText('[ SOUND: ' + (Sfx.muted ? 'OFF' : 'ON') + ' ]');
    refresh();
    soundRow.on('pointerover', () => soundRow.setColor(IDE.white));
    soundRow.on('pointerout', () => soundRow.setColor(IDE.keyword));
    soundRow.on('pointerdown', () => {
      Sfx.unlock();
      Sfx.setMuted(!Sfx.muted);
      refresh();
      Sfx.blip();
    });
    panel.add(soundRow);

    // volume stepper: ◀ 70% ▶
    const volLabel = scene.add.text(0, 18, '', {
      fontFamily: 'monospace', fontSize: '15px', color: IDE.text
    }).setOrigin(0.5);
    const refreshVol = () => volLabel.setText('VOLUME ' + Math.round(Sfx.master * 100) + '%');
    refreshVol();
    panel.add(volLabel);
    const mkArrow = (x, txt, dir) => {
      const a = scene.add.text(x, 18, txt, {
        fontFamily: 'monospace', fontSize: '16px', color: IDE.keyword, fontStyle: 'bold'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      a.on('pointerover', () => a.setColor(IDE.white));
      a.on('pointerout', () => a.setColor(IDE.keyword));
      a.on('pointerdown', () => {
        Sfx.unlock();
        Sfx.setVolume(Sfx.master + dir * 0.1);
        refreshVol();
        Sfx.blip();
      });
      panel.add(a);
    };
    mkArrow(-74, '◀', -1);
    mkArrow(74, '▶', 1);

    gear.on('pointerover', () => gear.setColor('#ffffff'));
    gear.on('pointerout', () => gear.setColor('#9d9d9d'));
    gear.on('pointerdown', () => {
      Sfx.unlock();
      panel.setVisible(!panel.visible);
    });
  },

  // round language badge with the language's symbol (emoji or glyph) inside
  badge(scene, x, y, lang, r = 22) {
    const c = scene.add.container(x, y);
    const color = Phaser.Display.Color.HexStringToColor(lang.color).color;
    c.add(scene.add.circle(0, 0, r, color));
    c.add(scene.add.circle(0, 0, r, 0x000000, 0).setStrokeStyle(2, 0xffffff, 0.25));
    const icon = lang.icon || lang.abbr;
    const emoji = icon.codePointAt(0) >= 0x2600;
    c.add(scene.add.text(0, emoji ? 1 : 0, icon, {
      fontFamily: 'monospace',
      fontSize: Math.round(r * (emoji ? 1.15 : 0.8)) + 'px',
      color: lang.dark ? '#1e1e1e' : '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5));
    return c;
  }
};
