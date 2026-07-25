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
    // seconds this run's play added back to the clock (GameScene.addTime). Optional
    // on read — older callers predate it — so it just shows 0 if absent.
    this.bought = data.bought || 0;
    // The second countdown's tally: patterns the deprecation notice took, and
    // patterns written while the notice was up. Read through Number()||0 rather
    // than the plain `|| 0` idiom above because these two are NOT guaranteed to
    // arrive at all — itch serves the built page from the browser cache, so a
    // returning player can run a stale GameScene.js against this file and send
    // neither field. Number(undefined)||0 and Number(null)||0 are both 0, so a
    // missing tally reads as "no notices" and the ledger falls through to the
    // language count instead of printing undefined on the last screen of the game.
    this.deprecated = Number(data.deprecated) || 0;
    this.rescued = Number(data.rescued) || 0;
    // NOT this.time — that's Phaser.Scene's Clock; clobbering it would break every
    // this.time.* call the scene machinery makes. Store the run duration separately.
    this.survived = data.time || 0;
    this.daily = !!data.daily;
  }

  // seconds → M:SS for the survival headline (the whole game is a countdown, so
  // "how long you held it off" is a natural end stat). Clamped non-negative.
  fmtDuration(s) {
    s = Math.max(0, Math.round(s));
    const m = Math.floor(s / 60);
    return m + ':' + String(s % 60).padStart(2, '0');
  }

  // Typing grade — a single-letter verdict on this run's SKILL, from the two
  // normalized metrics (speed + accuracy). Each rank needs BOTH: you can't
  // S-rank on raw speed with sloppy accuracy, nor on perfect accuracy while
  // crawling. Purely cosmetic — it never feeds ranking, the PB or balance, so
  // the thresholds are a free tuning knob (a jam-feel guess, refine on playtest).
  typingGrade() {
    const w = this.wpm, a = this.acc;
    if (w >= 55 && a >= 96) return 'S';
    if (w >= 42 && a >= 90) return 'A';
    if (w >= 28 && a >= 82) return 'B';
    if (w >= 16 && a >= 70) return 'C';
    return 'D';
  }

  // ONE line of career arithmetic, printed ABOVE the closing paragraph. The stat
  // block below already says how WELL you typed; nothing said what the run cost,
  // in the only currency the prologue set up: languages that are gone versus
  // languages that are still shipping without you. So this is the run's ledger,
  // not its score — and because it is arithmetic on the run, it is different
  // every time in a way a written line cannot be.
  //
  // The best version of that ledger is the deprecation tally (see below), but it
  // is not always available or always meaningful, so the language count behind it
  // is a full fallback rather than a degraded one: every branch here is a line
  // that can carry the screen on its own. Every value printed is clamped into a
  // sane range first, so no branch can emit a negative, a NaN or an undefined.
  //
  // ASCII only, like every string in this file: the monospace face renders the
  // fancy dashes/quotes as boxes at 13px.
  verdict() {
    const all = LANGUAGES.length;
    // langIndex is the language you were STANDING ON when the clock won, so the
    // count of languages you actually outlasted is exactly langIndex (on a boss
    // level it clamps to the last language, which reads correctly: you buried
    // all of them and still did not get out).
    const buried = Math.max(0, Math.min(this.langIndex, all));
    const standing = Math.max(0, all - buried);
    const climbs = Math.max(0, this.stageIndex + this.lap);
    // Re-normalized here as well as in init: init's Number()||0 already kills
    // undefined/null/NaN, and this kills a negative or a fraction, so the pair
    // cannot reach a template string in a state that prints badly.
    const lost = Math.max(0, Math.round(Number(this.deprecated) || 0));
    const kept = Math.max(0, Math.round(Number(this.rescued) || 0));
    // every pattern that was ever put on notice this run: the ones that died on
    // the notice plus the ones written before it expired.
    const notices = lost + kept;

    // The win outranks even the deprecation tally. A cleared ladder is the one
    // run where the tally is a footnote — the joke that finishing hands you a
    // fresh twenty-five is the whole payoff, and it needs the line.
    if (this.win)
      return 'You cleared ' + all + ' of ' + all + '. The count starts again at ' + all + '.';

    // The run's own countdown, scored. This is the number that belongs to THIS
    // game rather than to typing games in general, so when it exists it leads.
    //
    // Phrased as notices-issued vs notices-outrun instead of "N lost, M saved"
    // because that grammar survives every split: all-lost, all-outrun and the
    // single-notice run each read as a sentence, and none of them prints a 0.
    // A run with no notices at all (dead inside the first twenty seconds, or a
    // stale cached GameScene.js sending neither field) is not "0 notices" — it
    // is a run with nothing to say here, so it falls through to the languages.
    if (notices > 0) {
      if (notices === 1)
        return kept ? '1 deprecation notice. You outran it.'
                    : '1 deprecation notice. It outran you.';
      const head = notices + ' deprecation notices. ';
      if (lost === 0) return head + 'You outran all of them.';
      if (kept === 0) return head + 'You outran none of them.';
      return head + 'You outran ' + kept + ' of them.';
    }
    // a raised stage (or a survival lap) means you have already emptied this
    // ladder at least once and it refilled itself. That is the whole joke of the
    // game, stated as two numbers.
    if (climbs > 0)
      return 'Ladders behind you: ' + climbs + '. Languages still standing: ' + all + '.';
    if (buried === 0)
      return 'You outlived nothing. All ' + all + ' of them outlived you.';
    // defensive: GameScene clamps langIndex to LANGUAGES.length-1, so standing
    // should never reach 0 — but a future caller passing an unclamped index must
    // not print the nonsense "The other 0 outlived you."
    if (standing === 0)
      return 'You outlived all ' + all + ' of them. The clock outlived you.';
    if (standing === 1)
      return 'You outlived ' + buried + ' languages. The last one outlived you.';
    return 'You outlived ' + buried + ' language' + (buried === 1 ? '' : 's') +
           '. The other ' + standing + ' outlived you.';
  }

  // The run's closing line, in the prologue's voice. The prologue frames the
  // game (everything you know is going obsolete underneath you) and until now
  // nothing closed that arc — the End screen was a stat sheet. This gives the
  // finish a sentence, and it changes with how far you actually got, so it reads
  // as a verdict on THIS run rather than the same card every time.
  //
  // Always exactly TWO lines at 13px, in every branch — the band it is drawn in
  // (see create) is sized for two and a third would run into the 46px title.
  epitaph() {
    const n = this.langIndex, all = LANGUAGES.length;
    // The win is the narrative payoff, so it gets its own beat instead of
    // falling through to the veteran line: clearing the whole ladder does not
    // end the countdown, it just hands you a fresh one. Checked FIRST so a
    // winning run never reads as a death.
    if (this.win)
      return 'Every language on the road, cleared, before the clock ran out.\n' +
             'They are already writing the next twenty-five. You know that.';
    if (this.stageIndex > 0 || this.lap > 0)
      return 'You finished the ladder. It came back: same names, less time.\n' +
             'Nobody tells you the job is to do it again. Nobody has to.';
    if (n >= all - 1)
      return 'You reached the last language. The clock got there first.\n' +
             'Everything you learned is intact. There was no more time.';
    if (n >= all * 0.6)
      return 'The languages you were fluent in are two stages behind you now,\n' +
             'unmaintained, and nobody has noticed they stopped.';
    if (n >= all * 0.28)
      return 'Far enough that the easy syntax stopped covering for you.\n' +
             'This is where most careers quietly stall.';
    if (n >= 2)
      return 'Past the markup, into real code, and then the clock.\n' +
             'Everyone starts here. Almost nobody starts twice.';
    return 'The first language took you. It takes most people.\n' +
           'It is also the only one you will ever be sure of.';
  }

  create() {
    const cx = this.scale.width / 2, cy = this.scale.height / 2;
    const lang = LANGUAGES[this.langIndex];
    this.grade = this.typingGrade();

    // On-theme countdown coda: how many languages still stood between you and
    // this stage's boss when the clock finally won. "Count Down" is the jam
    // theme, and the descending "N to boss" counter already runs down the HUD
    // (refreshLangHud) and the level-clear road (showPath) — so the run's FINISH
    // should read it too. Same formula both use (LANGUAGES.length-1-langIndex),
    // so the three never disagree. finish() only ever fires on death today (the
    // game is endless — nothing calls finish(true)), so "the clock caught you" is
    // true for every run that currently reaches this screen; the coda below now
    // carries a win branch anyway, so a wired win path cannot print that lie.
    // On the boss level langIndex clamps to the last language → count 0 → reads as
    // dying at the boss's door instead of a bare "0". Shared by the on-screen line
    // below and the share card string.
    const toBoss = LANGUAGES.length - 1 - this.langIndex;

    // the run is over: fold it into the permanent record before anything is
    // drawn, so the career line this screen shows already includes it.
    Career.endRun(this.words, this.survived);

    const status = UI.chrome(this, 'life_of_software — Raiden IDE');
    status.left.setText(this.win ? 'exit code 0' : 'exit code 1 — time is up');
    status.right.setText(this.daily
      ? 'DAILY — ' + new Date().toISOString().slice(0, 10)
      : 'GMTK 2026 — Count Down');

    // --- the close of a career, in the empty band above the title ------------
    // The band runs y≈30..112 (the title bar owns 0..30; the 46px title centred
    // on cy-128=142 reaches up to ≈112), which is 82px — exactly enough for one
    // 13px ledger line plus the two-line closing paragraph, and nothing more.
    // Budgeted as: ledger at 44 spans ≈35..53, paragraph at 82 spans ≈62..102.
    // If either grows a line, this collides with the title — keep both at their
    // stated line counts.
    //
    // Ledger first, then the sentence: the numbers earn the line that follows.
    // Gold + bold so it reads as the verdict and the green paragraph below reads
    // as the comment on it (same colour language as the rest of the IDE theme).
    this.add.text(cx, 44, this.verdict(), {
      fontFamily: 'monospace', fontSize: '13px', color: '#dcdcaa', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, 82, this.epitaph(), {
      fontFamily: 'monospace', fontSize: '13px', color: IDE.comment,
      align: 'center', lineSpacing: 5
    }).setOrigin(0.5);

    // The permanent record, mirroring the GRADE stamp across the screen: the
    // grade judges this run, this judges everything you have ever done here.
    // Languages-ever-cleared is the number that actually tracks learning, which
    // is what the review cards made the game about.
    const cw = Career.data;
    this.add.text(cx + 250, cy - 116, 'CAREER', {
      fontFamily: 'monospace', fontSize: '13px', color: IDE.dim
    }).setOrigin(0.5);
    this.add.text(cx + 250, cy - 92,
      Career.clearedCount + '/' + LANGUAGES.length, {
        fontFamily: 'monospace', fontSize: '30px', color: IDE.stringy, fontStyle: 'bold'
      }).setOrigin(0.5);
    this.add.text(cx + 250, cy - 68, 'languages ever cleared', {
      fontFamily: 'monospace', fontSize: '10px', color: IDE.dim
    }).setOrigin(0.5);
    this.add.text(cx + 250, cy - 50,
      cw.words + ' patterns · ' + this.fmtDuration(cw.time) + ' typed', {
        fontFamily: 'monospace', fontSize: '10px', color: IDE.dim
      }).setOrigin(0.5);

    // everything centered on the screen axis
    this.add.text(cx, cy - 128, this.win ? 'BUILD SUCCESSFUL ✓' : 'TIME IS UP ✗', {
      fontFamily: 'monospace', fontSize: '46px',
      color: this.win ? IDE.comment : IDE.error, fontStyle: 'bold'
    }).setOrigin(0.5);

    // typing-grade stamp in the left margin — a report-card verdict on the run's
    // speed+accuracy, in the empty side space so it crowds nothing. S gold down
    // to D red; it pops on entry so the rank reads at a glance and on a screenshot.
    const gColors = { S: '#ff9800', A: '#6a9955', B: '#569cd6', C: '#a0a0a0', D: '#f44747' };
    const gx = cx - 250, gy = cy - 96;
    this.add.text(gx, gy - 34, 'GRADE', {
      fontFamily: 'monospace', fontSize: '13px', color: IDE.dim
    }).setOrigin(0.5);
    const gStamp = this.add.text(gx, gy, this.grade, {
      fontFamily: 'monospace', fontSize: '72px', color: gColors[this.grade], fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.circle(gx, gy, 46, 0x000000, 0)
      .setStrokeStyle(3, Phaser.Display.Color.HexStringToColor(gColors[this.grade]).color, 0.85);
    gStamp.setScale(2).setAlpha(0);
    this.tweens.add({ targets: gStamp, scale: 1, alpha: 1, duration: 320, ease: 'Back.easeOut' });

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
    // did this run set a record worth advertising in the shared result string?
    // Only tag it when there was a PRIOR best to beat — a first-ever run has
    // nothing to improve on, so "NEW PB" would read oddly in a public comment.
    let sharePB = false;
    if (!this.daily && beats && best) sharePB = true;
    if (!this.daily && beats) {
      try {
        localStorage.setItem('los_best', JSON.stringify({
          p: progress, words: this.words, wpm: this.wpm, score: this.finalScore,
          stage: this.stage, level: this.langIndex + 1,
          // persist how long this best run held the clock off zero — the natural
          // headline for a countdown game, surfaced on the menu's BEST line.
          // Optional on read (older bests predate it), so no migration needed.
          time: this.survived
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
      const beatDaily = !dbest || progress > dbest.p || (progress === dbest.p && this.words > dbest.words);
      // same rule as the global tag: only advertise a daily record when there
      // was an earlier daily entry today to actually beat.
      if (beatDaily && dbest) sharePB = true;
      if (beatDaily) {
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
      ' · ' + this.loot + ' loot · survived ' + this.fmtDuration(this.survived) +
      ' · bought back ' + this.fmtDuration(this.bought), {
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

    // the descending "N to boss" count, read at the finish (see toBoss above).
    // Sits in the gap between the progress line (cy+58) and the buttons (cy+104),
    // in the theme's gold, so the run ends on the same Count-Down beat the HUD
    // and the level-clear road carry. One line, ≤56 chars in every branch.
    //
    // The win branch exists because both loss strings assert "the clock caught
    // you", which is a lie on a run that got out: a winning run is the ONE time
    // the countdown expires on the ladder instead of on the player, and that is
    // the beat to end on. (finish() only passes win:false today, so this is the
    // line that lights up the moment a win path is wired.)
    this.add.text(cx, cy + 82, this.win
      ? 'the clock ran out on the ladder before it ran out on you'
      : (toBoss > 0
        ? '↓ the clock caught you ' + toBoss + ' language' + (toBoss === 1 ? '' : 's') +
          ' short of the ' + this.stage + ' boss'
        : '↓ the clock caught you at the ' + this.stage + " boss's door"), {
        fontFamily: 'monospace', fontSize: '13px', color: '#dcdcaa', fontStyle: 'bold'
      }).setOrigin(0.5);

    const again = this.add.text(cx - 96, cy + 104, '[ RECOMPILE ]', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.white
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: again, alpha: 0.3, duration: 600, yoyo: true, repeat: -1
    });

    // a route back to the main menu (Daily / New Game live there) — the End
    // screen otherwise dead-ends on RECOMPILE, which just resumes the run.
    const toMenu = this.add.text(cx + 104, cy + 104, '[ MENU ]', {
      fontFamily: 'monospace', fontSize: '20px', color: IDE.dim
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    toMenu.on('pointerover', () => toMenu.setColor(IDE.white));
    toMenu.on('pointerout', () => toMenu.setColor(IDE.dim));

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
    const recompile = () => {
      Sfx.unlock(); Sfx.blip();
      this.scene.start('Game', this.daily ? { daily: true } : { resume: true });
    };
    const backToMenu = () => {
      Sfx.unlock(); Sfx.blip();
      this.scene.start('Menu');
    };
    again.on('pointerdown', recompile);
    toMenu.on('pointerdown', backToMenu);

    // Shareable result card: a compact, screenshot-friendly one-liner plus a
    // COPY button (and the C key). The daily runs on a shared seed, so pasting
    // your result into the itch comments turns the daily into a leaderboard race
    // — and comment activity during voting drives an entry's visibility. Built
    // from run data already in scope; no new state.
    const dailyTag = this.daily ? 'DAILY ' + new Date().toISOString().slice(0, 10) + ' ' : '';
    this.shareStr = 'Life of Software ' + dailyTag + '— ' + this.stage +
      (this.lap > 0 ? ' lap ' + (this.lap + 1) : '') + ' · ' + lang.name +
      ' (L' + (this.langIndex + 1) + '/' + LANGUAGES.length + ') · ' + this.finalScore +
      ' pts · ' + this.wpm + ' wpm · ' + this.acc + '% acc · x' + this.maxCombo + ' combo · ' +
      this.fmtDuration(this.survived) + ' survived · ' +
      this.grade + '-rank · ' + Profile.label +
      // a run that beat the stored best reads as an improvement when pasted into
      // the itch comments, not just a raw stat line (mirrors the on-screen banner).
      (sharePB ? ' · ▲ ' + (this.daily ? 'NEW DAILY BEST' : 'NEW PB') : '');

    this.add.text(cx, cy + 164, 'ENTER recompile  ·  M menu  ·  C copy result', {
      fontFamily: 'monospace', fontSize: '12px', color: IDE.dim
    }).setOrigin(0.5);

    // the result string itself, framed and shown so it reads/screenshots even if
    // the clipboard write is blocked (sandboxed itch iframes can refuse it). The
    // string length varies a lot (a daily + long language + NEW DAILY BEST + rank
    // is far wider than a short early run), so build the text FIRST, step the font
    // down until it fits the screen, then size the frame to hug it — otherwise a
    // long result spilled past the fixed-width box toward the screen edges.
    const maxTextW = this.scale.width - 56;
    const shareText = this.add.text(cx, cy + 192, this.shareStr, {
      fontFamily: 'monospace', fontSize: '12px', color: IDE.stringy
    }).setOrigin(0.5);
    for (let fs = 12; fs > 8 && shareText.width > maxTextW; fs--) {
      shareText.setFontSize(fs);
    }
    const boxW = Math.min(shareText.width + 28, this.scale.width - 40);
    this.add.rectangle(cx, cy + 192, boxW, 24, 0x1c1c1d).setStrokeStyle(1, IDE.border);
    shareText.setDepth(1);   // keep the text above its just-added backing frame

    const copyBtn = this.add.text(cx, cy + 218, '[ COPY RESULT · C ]', {
      fontFamily: 'monospace', fontSize: '14px', color: IDE.keyword
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    copyBtn.on('pointerover', () => copyBtn.setColor(IDE.white));
    copyBtn.on('pointerout', () => copyBtn.setColor(IDE.keyword));
    const copyResult = () => {
      Sfx.unlock();
      const done = (ok) => copyBtn.setText(ok ? '[ COPIED ✓ ]' : '[ COPY BLOCKED — screenshot it ]')
        .setColor(ok ? IDE.comment : IDE.error);
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(this.shareStr).then(() => done(true)).catch(() => done(false));
        } else { done(false); }
      } catch (e) { done(false); }
      Sfx.blip();
    };
    copyBtn.on('pointerdown', copyResult);

    // Keyboard is the whole game — let it drive the End screen too, so a player
    // whose hands never left the keys can restart (ENTER/SPACE), bail to the
    // menu (M/ESC) or copy the result (C) without reaching for the mouse.
    // Brief input lock before the End screen answers keys. ENTER is the SUBMIT key
    // of a fast typing game, so a player is very often mid-burst — sometimes
    // literally mashing it — at the exact moment the clock runs out. Without a lock,
    // one already-in-flight ENTER lands on this scene the frame it appears and
    // RECOMPILEs instantly: the run's score, grade, PB delta, countdown coda and
    // share card flash by unread, and it reads as the game skipping the results.
    // 500ms is under the recompile animation's own beat, so a deliberate press
    // never feels blocked; only the momentum press is swallowed.
    let keysLive = false;
    this.time.delayedCall(500, () => { keysLive = true; });
    this.input.keyboard.on('keydown', (e) => {
      if (!keysLive) return;
      if (e.key === 'Enter' || e.key === ' ') recompile();
      else if (e.key === 'Escape' || e.key === 'm' || e.key === 'M') backToMenu();
      else if (e.key === 'c' || e.key === 'C') copyResult();
    });
  }
}
