# itch.io page — copy & upload checklist

Paste-ready text for the jam submission. Nothing here is uploaded automatically;
the itch page and the build upload are yours to do.

---

## Title

**LIFE OF SOFTWARE**

## Short description (the one line under the title, ~140 chars)

> A typing roguelite about the two countdowns every programmer knows: the clock,
> and the patterns going obsolete while you write them.

## Cover image

`assets/menu_splash.png` upscaled to 630×500 with **nearest-neighbour** (never
bilinear — it's pixel art, a smooth upscale is the one thing that makes it look
cheap). The `cover.py` in the `gmtk2026` repo already does this.

## GIF (record this — it does more for votes than anything else on the page)

15–20 seconds, in this order, because it shows all three hooks before anyone
scrolls away:

1. Two or three patterns landing, combo climbing, clock jumping (2s)
2. A **deprecation notice** appearing and being typed in time — the ×2 SAVED
   FROM DEPRECATION pop (4s)
3. A **boss exploit chain** — the three-pattern sequence and the chain hits (5s)
4. The **boon draft** cards on the level-clear screen (3s)

Record at 960×540 so the pixels stay square.

---

## Page body

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
- [ ] Cover 630×500, at least 3 screenshots, the GIF first
- [ ] Genre: Action · Tags: `typing`, `roguelite`, `pixel-art`, `programming`,
      `countdown`, `phaser`
- [ ] Submit to the **GMTK Game Jam 2026** page before the deadline — the
      submission is a separate step from publishing the project
