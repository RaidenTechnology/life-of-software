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
    // Capture the previous run-score BEFORE any overwrite below, so the end-screen
    // delta ("+N over your best" / "N to beat") measures this run against the score
    // you walked in with — the same number the in-run HUD PB target chases.
    const prevBestScore = (best && best.score) || 0;
    // rank by how far you got, then words typed, then run score as the final tiebreak
    const beats = !best || progress > best.p ||
      (progress === best.p && this.words > best.words) ||
      (progress === best.p && this.words === best.words && this.finalScore > (best.score || 0));
    if (!this.daily && beats) {
      try {
        localStorage.setItem('los_best', JSON.stringify({
          p: progress, words: this.words, wpm: this.wpm, score: this.finalScore,
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
        // widen the daily entry with wpm/score (was {p, words}) so a daily result
        // card / leaderboard can show speed + score without re-running the seed.
        try {
          localStorage.setItem(dk, JSON.stringify({
            p: progress, words: this.words, wpm: this.wpm, score: this.finalScore
          }));
        } catch (e) {}
      }
    }

    this.add.text(cx, cy - 58, 'SCORE ' + this.finalScore, {
      fontFamily: 'monospace', fontSize: '32px', color: IDE.text
    }).setOrigin(0.5);

    // how this run's score stacks against your previous best. Skipped for daily
    // runs (they rank on their own per-day key, not the global best) and when
    // there's no prior score to compare against.
    if (!this.daily && prevBestScore > 0) {
      const d = this.finalScore - prevBestScore;
      let msg, col;
      if (d > 0) { msg = '▲ +' + d + ' over your best score!'; col = IDE.comment; }
      else if (d === 0) { msg = 'matched your best score'; col = '#dcdcaa'; }
      else { msg = Math.abs(d) + ' to beat your best score'; col = IDE.dim; }
      this.add.text(cx, cy - 34, msg, {
        fontFamily: 'monospace', fontSize: '13px', color: col, fontStyle: 'bold'
      }).setOrigin(0.5);
    }

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

    // show where RECOMPILE will drop you back in (the saved checkpoint)
    if (!this.daily) {
      let ck = null;
      try { ck = JSON.parse(localStorage.getItem('los_ckpt') || 'null'); } catch (e) {}
      if (ck) {
        const st = STAGES[Math.min(ck.stageIndex || 0, STAGES.length - 1)];
        const ln = LANGUAGES[Math.min(ck.langIndex || 0, LANGUAGES.length - 1)];
        this.add.text(cx, cy + 132, 'resumes at STAGE ' + st.name + ' · ' + ln.name, {
          fontFamily: 'monospace', fontSize: '13px', color: IDE.stringy
        }).setOrigin(0.5);
      }
    }

    // for daily runs there's no checkpoint line — surface today's daily best
    // instead (re-read AFTER the write above so it reflects this run too), so
    // the seeded challenge shows the number to beat next attempt.
    if (this.daily) {
      let db = null;
      try { db = JSON.parse(localStorage.getItem('los_daily_' + new Date().toISOString().slice(0, 10)) || 'null'); } catch (e) {}
      if (db) {
        // decode the stored progress p into STAGE · language (the same way the
        // normal-mode BEST line reads), so the daily target isn't just a bare
        // word count. p = (stageIndex + lap) * LANGUAGES.length + langIndex; the
        // stage index saturates at SURVIVAL and laps pile on beyond it. wpm is
        // only present on entries written by this build onward, so it's optional.
        const sp = Math.floor((db.p || 0) / LANGUAGES.length);
        const li = (db.p || 0) % LANGUAGES.length;
        const stName = STAGES[Math.min(sp, STAGES.length - 1)].name;
        const lap = Math.max(0, sp - (STAGES.length - 1));
        const label = "today's daily best: " + db.words + ' patterns · STAGE ' +
          stName + (lap > 0 ? ' lap ' + (lap + 1) : '') + ' · ' + LANGUAGES[li].name +
          (db.wpm ? ' · ' + db.wpm + ' wpm' : '');
        this.add.text(cx, cy + 132, label, {
          fontFamily: 'monospace', fontSize: '13px', color: IDE.stringy
        }).setOrigin(0.5);
      }
    }

    // RECOMPILE resumes from the checkpoint (furthest section cleared) instead of
    // dumping you back at HTML. Daily runs always restart their fixed seed fresh.
    again.on('pointerdown', () => {
      Sfx.blip();
      this.scene.start('Game', this.daily ? { daily: true } : { resume: true });
    });
  }
}
