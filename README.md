# LIFE OF SOFTWARE — Raiden Technology

**GMTK 2026 jam game.** Ortada bir yazı paneli, tepede acımasız bir geri sayım.
Süre bitmeden aktif dilin kalıplarını yaz (`import`, `async`, `let`, `fn`...) —
her doğru kelime **süre + puan + kredi** kazandırır. Hedef puana ulaşınca sıradaki
(daha zor) dile geçersin: **Python → JavaScript → Java → C++ → Rust**.
Kredilerle (max 100) panelin sağ üstündeki **İPUCU** butonundan ipucu satın alınır (20 kredi).

Built on our generic pre-jam skeleton (allowed by jam rules: "pre-existing generic code").

## Tema: Count Down

itch.io duyurusu (22 Temmuz 2026, 20:04): *"The GMTK Game Jam for 2026 starts right now.
You've got 96 hours to make a game that fits the theme. And this year's theme is... **Count Down**."*

> How you interpret this theme is entirely up to you. It could be a countdown to zero.
> Numbers going down. Time going backwards. A depressed person with a historical title
> of nobility. Up to you!

Jam bitiş: 26 Temmuz 2026, ~20:00 (96 saat). Konsept fikirleri için [NOTES.md](NOTES.md).

## Structure

```
index.html            entry point (plain script tags, no build step)
lib/phaser.min.js     Phaser 3 (local copy — works offline / on itch.io)
src/main.js           game config (960x540, FIT scale, arcade physics)
src/sfx.js            WebAudio synth — zero asset files, zero AI
src/data/languages.js dil merdiveni: kelime listeleri, hedef puanlar, süre çarpanları
src/scenes/           Boot → Menu → Game → End
assets/               jam art goes here (hand-made only — AI art = disqualification)
```

## Run locally

Any static server, e.g.:

```
python -m http.server 8765
```

## Package for itch.io

```
powershell -File build.ps1
```

Produces `dist/raiden-gmtk2026.zip` — upload to itch.io, mark **"This file will
be played in the browser"**, viewport 960×540.

## Swapping in your own art (Blender renders etc.)

The hero and monster sprites are code-drawn placeholders. To replace them,
export transparent PNGs (~40×48) and load them in `BootScene.preload` with
the same keys — `hero0`..`hero5`, `en_ork`, `en_skeleton`, `en_elf`,
`en_vampire`, `en_goblin`, `en_demon`. `Battle.makeTextures` skips any key
that is already loaded. Hand-made art only (jam rule: no AI art).

## Jam constraints checklist

- [x] Playable in browser, keyboard + mouse
- [x] No AI-generated art or audio (sfx = our own WebAudio synth)
- [x] Theme integrated mechanically (countdown timer IS the core mechanic)
- [ ] Name + cover image + screenshots on itch.io page
