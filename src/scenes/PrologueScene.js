// The two questions the game cannot answer for you, and the only place it tells
// you why any of this is happening.
//
// Why it exists:
//  * The ladder hands a Haskell programmer and someone who has never opened an
//    editor the exact same 25 languages. One of them is playing a game and the
//    other is being buried. Nothing in the game could tell them apart, so it
//    asks — and the answer moves the ropes (opening clock, assist, hint price),
//    never the score, so one personal best stays one number.
//  * LEARN mode: after a language falls, do you want to be told what the
//    patterns you just typed actually meant? Off, this is a typing brawler. On,
//    you finish a run knowing what `impl`, `>>=` and `nonlocal` are. That is the
//    difference between a score screen and having learned something.
//  * And it is where the run gets a frame: you are not scoring points, you are
//    watching everything you know go obsolete underneath you.
//
// Shown automatically only until it has been answered once (Profile.onboarded);
// after that it is a menu entry, so a returning player never sits through it.
class PrologueScene extends Phaser.Scene {
  constructor() {
    super('Prologue');
  }

  init(data) {
    // where to go when this is done, and with what — the menu hands its own
    // start payload through so this scene never has to know the modes.
    this.next = (data && data.next) || 'Game';
    this.payload = (data && data.payload) || { resume: false };
    // sensible defaults for a first-ever player: neither claim is made for them.
    this.skill = Profile.skill || 'mid';
    this.learn = Profile.learn;
  }

  create() {
    const cx = this.scale.width / 2;

    const status = UI.chrome(this, 'life_of_software — new run');
    status.left.setText('1 2 3 pick what you know · Y / N pattern notes · ENTER begin');
    status.right.setText('GMTK 2026 — Count Down');

    // --- the frame ---------------------------------------------------------
    // Deliberately short: four lines a judge reads in eight seconds, that give
    // the countdown a reason to exist beyond "there is a timer".
    // y=44: the title bar owns 0..30, and the six-line frame below is centred on
    // 118 so it spans ~55..181 — anything lower than this collides with it.
    this.add.text(cx, 44, '// prologue', {
      fontFamily: 'monospace', fontSize: '14px', color: IDE.comment
    }).setOrigin(0.5);

    // Left as written: it is the strongest four lines in the game and every
    // rewrite tried came out longer or softer. The ONE change is the em dash on
    // line 3 → a colon: at 15px the monospace face can drop a non-ASCII dash as
    // a box, and the colon does the same work (it introduces what obsolescence
    // looks like) without the risk. Everything else here is ASCII already.
    this.add.text(cx, 118,
      'You have been writing software for as long as you can remember.\n' +
      'None of it is still running.\n\n' +
      'The languages go obsolete while you are still typing them: a deprecation\n' +
      'notice, then silence. Twenty-five of them. One clock. Whatever you can\n' +
      'still remember of each.',
      {
        fontFamily: 'monospace', fontSize: '15px', color: IDE.text,
        align: 'center', lineSpacing: 6
      }).setOrigin(0.5);

    // --- question 1: what do you actually know? ----------------------------
    this.add.text(cx, 216, 'HOW MUCH SOFTWARE DO YOU KNOW?', {
      fontFamily: 'monospace', fontSize: '15px', color: IDE.keyword, fontStyle: 'bold'
    }).setOrigin(0.5);

    const opts = [
      { key: 'low', n: '1', title: 'NOT MUCH', blurb: '+20s clock · assist on · half-price hints' },
      { key: 'mid', n: '2', title: 'SOME CODE', blurb: 'the standard run' },
      { key: 'high', n: '3', title: 'I WRITE THIS', blurb: '-10s clock · assist off · no training wheels' }
    ];
    this.skillCards = opts.map((o, i) => {
      const x = cx + (i - 1) * 268;
      const box = this.add.rectangle(x, 268, 250, 62, 0x1c1c1d).setStrokeStyle(2, IDE.border)
        .setInteractive({ useHandCursor: true });
      const t = this.add.text(x, 256, '[' + o.n + ']  ' + o.title, {
        fontFamily: 'monospace', fontSize: '15px', color: IDE.white, fontStyle: 'bold'
      }).setOrigin(0.5);
      const b = this.add.text(x, 279, o.blurb, {
        fontFamily: 'monospace', fontSize: '11px', color: IDE.dim,
        align: 'center', wordWrap: { width: 236 }
      }).setOrigin(0.5);
      box.on('pointerdown', () => this.pickSkill(o.key));
      return { key: o.key, box: box, t: t, b: b };
    });

    // --- question 2: do you want to be taught? -----------------------------
    this.add.text(cx, 332, 'AFTER EACH LANGUAGE, EXPLAIN THE PATTERNS YOU TYPED?', {
      fontFamily: 'monospace', fontSize: '15px', color: IDE.keyword, fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.text(cx, 353,
      'a short review card: what each pattern means, with a real example — so you\n' +
      'do not clear HASKELL without ever finding out what you typed', {
        fontFamily: 'monospace', fontSize: '11px', color: IDE.dim, align: 'center', lineSpacing: 3
      }).setOrigin(0.5);

    this.learnCards = [
      { on: true, n: 'Y', title: 'YES — TEACH ME' },
      { on: false, n: 'N', title: 'NO — JUST LET ME TYPE' }
    ].map((o, i) => {
      const x = cx + (i === 0 ? -140 : 140);
      const box = this.add.rectangle(x, 396, 264, 34, 0x1c1c1d).setStrokeStyle(2, IDE.border)
        .setInteractive({ useHandCursor: true });
      const t = this.add.text(x, 396, '[' + o.n + ']  ' + o.title, {
        fontFamily: 'monospace', fontSize: '14px', color: IDE.white
      }).setOrigin(0.5);
      box.on('pointerdown', () => this.pickLearn(o.on));
      return { on: o.on, box: box, t: t };
    });

    // --- begin -------------------------------------------------------------
    this.beginBtn = this.add.text(cx, 448, '[ BEGIN — ENTER ]', {
      fontFamily: 'monospace', fontSize: '22px', color: IDE.white, fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.tweens.add({ targets: this.beginBtn, alpha: 0.35, duration: 700, yoyo: true, repeat: -1 });
    this.beginBtn.on('pointerdown', () => this.begin());

    this.add.text(cx, 476, 'you can change both of these later — ESC in a run, or SETUP on the menu', {
      fontFamily: 'monospace', fontSize: '11px', color: IDE.dim
    }).setOrigin(0.5);

    this.refresh();

    this.input.keyboard.on('keydown', (e) => {
      if (e.key === '1') this.pickSkill('low');
      else if (e.key === '2') this.pickSkill('mid');
      else if (e.key === '3') this.pickSkill('high');
      else if (e.key === 'y' || e.key === 'Y') this.pickLearn(true);
      else if (e.key === 'n' || e.key === 'N') this.pickLearn(false);
      else if (e.key === 'Enter' || e.key === ' ') this.begin();
      else if (e.key === 'Escape') { Sfx.blip(); this.scene.start('Menu'); }
    });
  }

  pickSkill(k) { Sfx.unlock(); Sfx.blip(); this.skill = k; this.refresh(); }
  pickLearn(v) { Sfx.unlock(); Sfx.blip(); this.learn = !!v; this.refresh(); }

  // selection is drawn, not implied: the chosen card takes the accent stroke and
  // a lit label, everything else falls back to the border grey. Cheap enough to
  // redraw wholesale on every keypress.
  refresh() {
    this.skillCards.forEach(c => {
      const on = c.key === this.skill;
      c.box.setStrokeStyle(2, on ? 0xdcdcaa : IDE.border);
      c.box.setFillStyle(on ? 0x2a2a1e : 0x1c1c1d);
      c.t.setColor(on ? '#dcdcaa' : IDE.white);
      c.b.setColor(on ? IDE.text : IDE.dim);
    });
    this.learnCards.forEach(c => {
      const on = c.on === this.learn;
      c.box.setStrokeStyle(2, on ? 0xdcdcaa : IDE.border);
      c.box.setFillStyle(on ? 0x2a2a1e : 0x1c1c1d);
      c.t.setColor(on ? '#dcdcaa' : IDE.white);
    });
  }

  begin() {
    Sfx.unlock(); Sfx.blip();
    Profile.setSkill(this.skill);
    Profile.setLearn(this.learn);
    // NOT MUCH / I WRITE THIS also set the assist default, because that is the
    // same question asked twice; the player can still flip it with A mid-run.
    if (this.skill === 'low') Assist.setOn(true);
    else if (this.skill === 'high') Assist.setOn(false);
    this.scene.start(this.next, this.payload);
  }
}
