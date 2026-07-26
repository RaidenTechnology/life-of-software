# itch.io page — copy & upload checklist

Paste-ready text for the jam submission. Nothing here is uploaded automatically;
the itch page and the build upload are yours to do.

---

## Title

**LIFE OF SOFTWARE**

## Short description (the one line under the title, ~140 chars)

> A typing roguelite about the two countdowns every programmer knows: the clock,
> and the patterns going obsolete while you write them. It also teaches you what
> you typed.

## Cover image

**Done — `media/cover-630x500.png`.** Built by `tools-cover.py` out of the game's
own pixels rather than drawn: the title is lifted from the menu the game renders
(so the cover's type IS the game's type), the cast is `assets/menu_splash.png`
nearest-upscaled ×4 (never bilinear — it's pixel art, a smooth upscale is the one
thing that makes it look cheap), and the hook row is the real deprecation notice
off a real frame, cropped clear of the HUD readout at x=687. Re-run the script if
the menu or the notice ever changes.

## GIF — DONE

`media/life-of-software.gif` (720×405, 13.8s, 1.78MB) and `-small.gif` (480px,
0.81MB) for anywhere with a tighter limit, plus `media/life-of-software.mp4` for
a devlog or a post. Five stills cut from the same take ship beside them
(`ss1-deprecation` … `ss5-code-review`), so the page and the GIF tell one story.
The cut, in order: patterns landing and the combo climbing, the notice up, the
rescue (×2), the boss exploit chain, the level clear, the language road with the
epitaph, the boon draft, the CODE REVIEW card.

The original brief this was shot against:

15–20 seconds, in this order, because it shows all three hooks before anyone
scrolls away:

1. Two or three patterns landing, combo climbing, clock jumping (2s)
2. A **deprecation notice** appearing and being typed in time — the ×2 SAVED
   FROM DEPRECATION pop (4s)
3. A **boss exploit chain** — the three-pattern sequence and the chain hits (4s)
4. The **boon draft** cards on the level-clear screen (2s)
5. The **CODE REVIEW** card — this is the one nothing else in the jam has, so let
   it sit long enough to actually read one entry (4s)

Record at 960×540 so the pixels stay square.

---

## Page body / "Details"

⚠ **The final paste-ready text lives in `ITCH-DETAILS.md`** — it carries today's
additions (per-language music, the epitaphs, the festival stop on the road, the
changelog-dressed notice, the End screen's verdict) and the RE-COUNTED teaching
numbers. The draft below is kept for reference only; one line in it is now wrong:
coverage is not "913 of 1276", it is **1276 of 1276 with a meaning and an example,
937 of them with a deeper panel** (counted out of the shipping build).

## Page body (earlier draft — superseded by ITCH-DETAILS.md)

### LIFE OF SOFTWARE

You have one clock and twenty-five languages. Type the patterns of the language
in front of you — `import`, `async`, `fn`, `=>`, `mov` — and every correct one
buys back seconds, score and credits. Run out of clock and the run is over.

**But the countdown isn't only on the clock.** While you type, the language
itself is going obsolete: every few seconds a pattern you haven't written yet is
put on notice, and moments later it's deprecated — gone for the rest of the
level. Write it before the notice expires and it pays double. That's the game:
racing one countdown while a second one eats the answers.

### What's in it

- **25 languages**, easiest to hardest: HTML → CSS → Python → JavaScript → …
  → Rust → Haskell → Assembly. Clear all of them and the STAGE rises and the
  ladder starts again, harder.
- **Language rules.** JAVA and C# pay more for long patterns; BASH and ASSEMBLY
  pay more for short ones; RUST and HASKELL charge you 3 seconds for a mistake;
  JAVASCRIPT deprecates twice as fast; PERL drains the clock faster.
- **Boss fights with an exploit chain** — three patterns, in order, on screen,
  for triple damage. Break the order and the boss heals.
- **A boon every level.** Three cards, pick one, it lasts the run: FASTER
  COMPILER, SCOPE CUT, LTS RELEASE, HOT PATH, NIGHTLY BUILD…
- **Loot, a bag and a daily shop.** Swords, armour with a death-save, potions,
  scrolls, treasure — dropped by the monsters you kill by typing.
- **Festivals** between levels, a **daily challenge** on a fixed seed, and a
  personal best worth chasing.

### It teaches you the languages it makes you type

Most typing games hand you words. This one hands you `impl`, `nonlocal`, `>>=`
and `%>%` — and if it stopped there you could clear HASKELL at speed and learn
nothing about Haskell.

So it asks, before the run: **how much software do you know?** (the answer moves
the ropes — opening clock, assist, hint price — and never the score, so one
personal best stays one number) and **do you want the patterns explained?**

Say yes, and every time a language falls you get a **code review** card: the
patterns *you* typed, in the order you typed them, each with a one-line meaning
and a real example. 913 of the game's 1276 patterns carry a note; the whole early
ladder is fully covered. Turn it off from the card itself the moment it stops
being useful.

And it remembers: which of the 25 languages you have **ever** cleared, how many
patterns you have typed in your life, how long you have held the clock off zero.
The language road on the menu burns full colour for the ones you've beaten and
sits dim for the rest — a ladder you climb across sessions, not one run.

### Don't know the language?

You don't have to. Turn ASSIST on (it's on by default) and when you're genuinely
stuck — out of clock, or nothing landed in a while — the game offers you one
short pattern, at most once every 40 seconds. It's enough to stay alive and pick
up the vocabulary, and far too little to score with. The leaderboard still
belongs to people who actually know Haskell.

### Controls

| | |
|---|---|
| type + ENTER | write a pattern |
| CTRL + SPACE | buy a hint (the IDE chord — it costs credits) |
| TAB | bag / daily shop |
| ESC | pause · **A** assist · **M** sound · **Q** quit |
| H (menu) | full help |
| 1-3 | pick a boon on the level-clear screen |
| ⚙ | sound, volume, screen shake, assist |

Keyboard only. Runs in the browser, 960×540.

### Made for GMTK Game Jam 2026 — theme: Count Down

Built in 96 hours by **Raiden Technology** on a generic pre-jam Phaser skeleton
(allowed by the rules: pre-existing generic code). All art is hand-made — the
characters, monsters, loot and backdrops are voxel figures modelled and rendered
in **Blender** by a script in this repo (`blender/gen_chars.py`), then
downscaled to pixel art with a hard-alpha pass. Every sound is synthesised at
runtime with the Web Audio API; there are no audio files. **No AI-generated art
or audio.**

---

## Upload checklist

- [ ] `powershell -File build.ps1` → `dist/raiden-gmtk2026.zip`
- [ ] **Bump `?v=` in index.html and `ASSET_V` in BootScene.js** if you're
      re-uploading over an earlier build — itch serves the new build from the
      same URL, so a returning browser will otherwise run cached JS
- [ ] Kind of project: **HTML** · "This file will be played in the browser"
- [ ] Viewport **960×540**, fullscreen button **on**, mobile friendly **off**
- [ ] Cover `media/cover-630x500.png`; screenshots `media/ss1..ss5`, the GIF first
- [ ] Mobile: leave **mobile friendly OFF** — the game is keyboard-only, and the
      menu now says so out loud to any touch-only device (coarse pointer AND no
      hover, so a touchscreen laptop never sees it)
- [ ] Genre: Action · Tags: `typing`, `roguelite`, `pixel-art`, `programming`,
      `countdown`, `phaser`
- [ ] Submit to the **GMTK Game Jam 2026** page before the deadline — the
      submission is a separate step from publishing the project
- [ ] ⚠ **Deadline is 26 Jul 17:00 BST = 19:00 Istanbul, not 20:00.** Read
      straight off itch.io/jam/gmtk-jam-2026 on 25 Jul; every earlier note in
      this repo assumed 20:00. Confirm the on-page countdown yourself and plan
      for the earlier hour — an upload started at 19:30 is an upload that missed.
- [ ] Voting is on **Creativity · Enjoyment · Narrative · Artwork · Audio**.
      There is NO separate "Theme" category (several NOTES entries assumed one).
      Narrative and Audio are each a full fifth of the score.

## Form fields — decided 26 Jul, with reasons

| Field | Value | Why |
|---|---|---|
| Kind of project | HTML + "played in the browser" | — |
| Genre | **Action** | Single-select. Real-time, timed, speed-based. "Educational" on itch skews to children's learning titles and reads as "not a game"; the teaching side is discoverable through TAGS, which is where itch traffic actually comes from. |
| Tags | `typing` `roguelite` `pixel-art` `programming` `educational` `countdown` `singleplayer` `phaser` | — |
| Viewport | **960 × 540** | the canvas is exactly this; anything else resamples it |
| Fullscreen button | **ON** | there is no game-side fullscreen code in this project (unlike STAR BREAKER), and none is needed: Phaser FIT + CENTER_BOTH plus `image-rendering: pixelated` scale cleanly from the iframe's own fullscreen |
| Enable scrollbars | **OFF** | `html,body{overflow:hidden}` — a scrollbar can only shift the canvas and break click alignment |
| Mobile friendly | **OFF** | keyboard-only game; the menu says so to any touch-only device |
| Made with | Phaser | — |
| Average session | A few minutes | a typical run is 5-15 minutes; "about a half-hour" would oversell it |
| Inputs | Keyboard (+ Mouse) | keyboard is required; the menus, bag and boon cards also answer the mouse |
| Accessibility | **Configurable difficulty only** | the prologue's skill question and the ASSIST toggle are real; there are no subtitles and no colour-blind mode, so nothing else gets ticked |
| Pricing | No payments | a donation target asks for payout details |
| AI disclosure | Yes — **code only** | art is Blender-scripted and code-drawn, audio is runtime WebAudio |

Note: the itch embed takes keyboard focus on the first click. Harmless here — the
menu's [ NEW GAME ] is mouse-clickable and that click hands over focus.
