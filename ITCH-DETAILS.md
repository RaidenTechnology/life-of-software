# itch.io "Details" — paste this into the big page-body field

Numbers in here were counted out of the shipping build on 26 Jul (1276 pattern
slots across 25 languages; Glossary.lookup answers all 1276; GlossaryDetail.get
answers 937). If the data changes, re-count before re-publishing.

---

You have one clock and twenty-five languages. Type the patterns of the language in front of you — `import`, `async`, `fn`, `=>`, `mov` — and every correct one buys back seconds, score and credits. Run out of clock and the run is over.

**But the clock is not the only countdown.** While you type, the language itself is going obsolete. Every few seconds a pattern you have not written yet is put on notice — *deprecated since 3.11, removed in 4.0* — and moments later it is gone for the rest of the level. Write it before the notice dies and it pays **double**. That is the game: racing one countdown while a second one eats the answers.

## What is in it

- **25 languages**, easiest to hardest: HTML → CSS → Python → JavaScript → … → Rust → Haskell → Assembly. Clear all of them and the STAGE rises and the ladder starts again, harder.
- **Language rules.** JAVA and C# pay more for long patterns; BASH and ASSEMBLY pay more for short ones; RUST and HASKELL charge you 3 seconds for a mistake; JAVASCRIPT deprecates twice as fast; PERL drains the clock faster.
- **Bosses with an exploit chain.** Three patterns, in order, on screen, for triple damage — break the order and the boss heals. Its pool is every language at once, because you only reach it by clearing all 25.
- **A boon every level.** Three cards, pick one, it lasts the run: FASTER COMPILER, SCOPE CUT, LTS RELEASE, HOT PATH, NIGHTLY BUILD, OPEN SOURCE, STACK OVERFLOW.
- **Loot with real decisions.** 10 item types across 5 rarities — a sword that multiplies credits, armour that revives you once, a PRISM that eats one broken combo, a SIGIL that puts deprecated patterns back in the pool, a VAULT that wards the notice before it lands. Dropped by the monsters you kill by typing, kept in a bag you can pay to enlarge, with a daily shop to spend the rest.
- **Festivals** between languages, as their own stop on the road: HTML ✓ → FESTIVAL ✓ → CSS.
- **A daily challenge** on a fixed seed, and a personal best worth chasing.

## It teaches you the languages it makes you type

Most typing games hand you words. This one hands you `impl`, `nonlocal`, `>>=` and `%>%` — and if it stopped there you could clear HASKELL at speed and learn nothing about Haskell.

So it asks, before the run: **how much software do you know?** (the answer moves the ropes — opening clock, assist, hint price — and never the score, so one personal best stays one number) and **do you want the patterns explained?**

Say yes, and every time a language falls you get a **CODE REVIEW** card: the patterns *you* typed, in the order you typed them, each with a one-line meaning and a real example. **All 1276 of the game's patterns carry one**; 937 of them open a second panel that goes deeper. Turn it off from the card itself the moment it stops being useful.

And it remembers: which of the 25 languages you have **ever** cleared, how many patterns you have typed in your life, how long you have held the clock off zero. The language road on the menu burns full colour for the ones you have beaten and sits dim for the rest — a ladder you climb across sessions, not one run.

## Don't know the language?

You don't have to. Turn ASSIST on (it's on by default) and when you are genuinely stuck — out of clock, or nothing landed in a while — the game offers you one short pattern, at most once every 40 seconds. Enough to stay alive and pick up the vocabulary, far too little to score with. The leaderboard still belongs to people who actually know Haskell.

## Turn the sound on

Every sound is synthesised at runtime — there are no audio files in the build.

- **Each of the 25 languages has its own music.** The key descends and the tempo climbs as the ladder gets harder: HTML is bright, slow and major; ASSEMBLY is a low sawtooth oscillating a semitone like a stuck machine.
- **The deprecation notice has its own voice** — a falling figure, and the only sound in the game that falls. Its tick accelerates as the notice runs out. Beat it and you get the mirror: the same figure, rising.
- **Bosses take the loop over** with a darker progression and a drum, and under the last ten seconds the music ducks for a sub-bass heartbeat.
- The keystroke click climbs a pentatonic ladder with your combo, so a streak rises in pitch under your hands.

## The run has a shape

A prologue that says why any of this is happening. Twenty-five epitaphs — one line for each language as it falls, written from inside a career that watched it happen. And an ending that reads your run back to you: how many notices you outran, how many languages outlived you, and the joke the whole game is built on — finishing the ladder just starts it again.

## Controls

| | |
|---|---|
| type + ENTER | write a pattern |
| CTRL + SPACE | buy a hint (the IDE chord — it costs credits, and more each stage) |
| TAB | bag / daily shop |
| ESC | pause · **A** assist · **M** sound · **L** notes · **Q** quit |
| H (menu) | full help |
| 1-3 | pick a boon on the level-clear screen |
| ⚙ | sound, volume, screen shake, assist |

**Keyboard only** — it is a typing game, so it needs a real keyboard. Runs in the browser at 960×540.

## Made for GMTK Game Jam 2026 — theme: Count Down

Built in 96 hours by **Raiden Technology** on a generic pre-jam Phaser skeleton (allowed by the rules: pre-existing generic code).

All art is hand-made: the characters, monsters, loot and backdrops are voxel figures modelled and rendered in **Blender** by a script in the project (`blender/gen_chars.py`), then downscaled to pixel art with a hard-alpha pass; everything else is drawn in code. Every sound is synthesised at runtime with the Web Audio API. **No AI-generated art or audio.**
