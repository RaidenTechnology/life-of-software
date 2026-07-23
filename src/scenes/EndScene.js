class EndScene extends Phaser.Scene {
  constructor() {
    super('End');
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.words = data.words || 0;
    this.langIndex = data.langIndex || 0;
    this.stage = data.stage || 'VERY EASY';
    this.stageIndex = data.stageIndex || 0;
    this.lap = data.lap || 0;
    this.win = !!data.win;
    this.wpm = data.wpm || 0;
    this.acc = data.acc === undefined ? 100 : data.acc;
    this.maxCombo = data.maxCombo || 0;
    this.loot = data.loot || 0;
    this.daily = !!data.daily;
  }

  create() {
    const cx = this.scale.width / 2, cy = this.scale.height / 2;
    const lang = LANGUAGES[this.langIndex];

    const status = UI.chrome(this, 'life_of_software — Raiden IDE');
    status.left.setText(this.win ? 'exit code 0' : 'exit code 1 — time is up');
    status.right.setText(this.daily
      ? 'DAILY — ' + new Date().toISOString().slice(0, 10)
      : 'GMTK 2026 — Count Down');

    // everything centered on the screen axis
    this.add.text(cx, cy - 128, this.win ? 'BUILD SUCCESSFUL ✓' : 'TIME IS UP ✗', {
      fontFamily: 'monospace', fontSize: '46px',
      color: this.win ? IDE.comment : IDE.error, fontStyle: 'bold'
    }).setOrigin(0.5);

    // personal best bookkeeping (progress = total levels cleared overall).
    // Daily runs are excluded from the global PB: they load the shared bag and
    // can post an inflated progress, so a daily must not stomp the normal-mode
    // best (it has its own per-day key below).
    const progress = (this.stageIndex + (this.lap > 0 ? this.lap : 0)) * LANGUAGES.length + this.langIndex;
    let best = null;
    try { best = JSON.parse(localStorage.getItem('los_best') || 'null'); } catch (e) {}
    if (!this.daily && (!best || progress > best.p || (progress === best.p && this.words > best.words))) {
      try {
        localStorage.setItem('los_best', JSON.stringify({
          p: progress, words: this.words, wpm: this.wpm,
          stage: this.stage, level: this.langIndex + 1
        }));
      } catch (e) {}
      const nb = this.add.text(cx, cy - 88, '★ NEW PERSONAL BEST! ★', {
        fontFamily: 'monospace', fontSize: '18px', color: '#dcdcaa', fontStyle: 'bold'
      }).setOrigin(0.5);
      this.tweens.add({ targets: nb, scale: 1.12, duration: 400, yoyo: true, repeat: -1 });
    }
    if (this.daily) {
      const dk = 'los_daily_' + new Date().toISOString().slice(0, 10);
      let dbest = null;
      try { dbest = JSON.parse(localStorage.getItem(dk) || 'null'); } catch (e) {}
      if (!dbest || progress > dbest.p || (progress === dbest.p && this.words > dbest.words)) {
        try { localStorage.setItem(dk, JSON.stringify({ p: progress, words: this.words })); } catch (e) {}
      }
    }

    this.add.text(cx, cy - 52, 'SCORE ' + this.finalScore, {
      fontFamily: 'monospace', fontSize: '32px', color: IDE.text
    }).setOrigin(0.5);

    this.add.text(cx, cy - 16,
      this.wpm + ' wpm · ' + this.acc + '% accuracy · max combo ' + this.maxCombo +
      ' · ' + this.loot + ' loot', {
        fontFamily: 'monospace', fontSize: '14px', color: '#dcdcaa'
      }).setOrigin(0.5);

    UI.badge(this, cx, cy + 22, lang, 18);

    this.add.text(cx, cy + 58,
      this.words + ' patterns · STAGE ' + this.stage +
      (this.lap > 0 ? ' (lap ' + (this.lap + 1) + ')' : '') +
      ' · reached ' + lang.name + ' (' + (this.langIndex + 1) + '/' + LANGUAGES.length + ')',
      {
        fontFamily: 'monospace', fontSize: '15px', color: IDE.dim
      }).setOrigin(0.5);

    const again = this.add.text(cx, cy + 104, '[ RECOMPILE ]', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.white
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: again, alpha: 0.3, duration: 600, yoyo: true, repeat: -1
    });

    again.on('pointerdown', () => {
      Sfx.blip();
      this.scene.start('Game');
    });
  }
}
