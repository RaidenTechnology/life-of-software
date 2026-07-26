# LIFE OF SOFTWARE

**GMTK Game Jam 2026 entry — theme: *Count Down*.**
Play it: **[raidentechnology.itch.io/lifeofsoftware](https://raidentechnology.itch.io/lifeofsoftware)**

You have one clock and twenty-five languages. Type the patterns of the language
in front of you — `import`, `async`, `fn`, `=>`, `mov` — and every correct one
buys back seconds, score and credits. Run out of clock and the run is over.

**But the clock is not the only countdown.** While you type, the language itself
is going obsolete. Every few seconds a pattern you have not written yet is put on
notice — *deprecated since 3.11, removed in 4.0* — and moments later it is gone
for the rest of the level. Write it before the notice dies and it pays **double**.

That is the game: racing one countdown while a second one eats the answers.

## What is in it

- **25 languages**, easiest to hardest: HTML → CSS → Python → JavaScript → … →
  Rust → Haskell → Assembly. Clear them all and the STAGE rises and the ladder
  starts again, harder.
- **Language rules.** JAVA and C# pay more for long patterns; BASH and ASSEMBLY
  pay more for short ones; RUST and HASKELL charge 3 seconds for a mistake;
  JAVASCRIPT deprecates twice as fast; PERL drains the clock faster.
- **Bosses with an exploit chain.** Three patterns, in order, for triple damage —
  break the order and the boss heals.
- **A boon every level.** Three cards, pick one, it lasts the run.
- **Loot with real decisions.** 10 item types across 5 rarities, a bag you can
  pay to enlarge, and a daily shop.
- **Festivals** between languages, as their own stop on the road.
- **A daily challenge** on a fixed seed.

## It teaches the languages it makes you type

Most typing games hand you words. This one hands you `impl`, `nonlocal`, `>>=`
and `%>%` — and if it stopped there you could clear HASKELL at speed and learn
nothing about Haskell.

So it asks, before the run: *how much software do you know?* (the answer moves
the ropes — opening clock, assist, hint price — and **never the score**) and
*do you want the patterns explained?*

Say yes and every time a language falls you get a **CODE REVIEW** card: the
patterns *you* typed, in the order you typed them, each with a one-line meaning
and a real example. **All 1276 of the game's patterns carry one**; **937** of
them open a second, deeper panel.

Progress persists: which of the 25 languages you have *ever* cleared, how many
patterns you have typed in your life, how long you have held the clock off zero.

## Run locally

No build step — plain `<script>` tags. Any static server will do:

```bash
python -m http.server 8766
# then open http://localhost:8766
```

## Structure

```
index.html              entry point (plain script tags, no bundler)
lib/phaser.min.js       Phaser 3, local copy — works offline and on itch.io
src/main.js             game config (960×540, FIT scale, arcade physics)
src/sfx.js              WebAudio synthesis — every sound generated at runtime
src/data/languages.js   the ladder: word lists, target scores, clock multipliers
src/data/glossary.js    pattern dictionary — meaning + example (1276 entries)
src/data/glossary_detail.js   deeper panels (937 entries)
src/scenes/             Boot → Menu → Prologue → Game → End
```

**There are no audio files in the build.** Every sound is synthesised at runtime
from WebAudio primitives — including the per-language music profiles, the
deprecation stings and the boss bed.

⚠️ **Versioning trap:** every gameplay change must bump `?v=` in `index.html`.
itch.io serves updated builds from the same URL, so without the bump the browser
replays cached JavaScript. This bit us more than once.

## The theme

itch.io announcement, 22 July 2026: *"You've got 96 hours to make a game that
fits the theme. And this year's theme is… **Count Down**."*

Concept notes and the road not taken are in [NOTES.md](NOTES.md).

Built on a generic pre-jam skeleton, which the jam rules explicitly allow
("pre-existing generic code").

## AI disclosure

Design, direction and the game's concept are the author's. Parts of the code
were written with AI assistance (Claude) — notably the audio layer, the language
data pass and the ending/prologue scenes. **No AI-generated art or audio assets
are in the build**; all sound is procedurally synthesised code, which the jam
rules permit. The same disclosure is on the itch.io page.

## License

MIT — see [LICENSE](LICENSE). The *LIFE OF SOFTWARE* name and the Raiden
Technology brand are not covered by it.

---

Built by [Raiden Technology](https://github.com/RaidenTechnology).
