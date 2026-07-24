# LIFE OF SOFTWARE — Raiden Technology

**GMTK 2026 jam game.** Ortada bir yazı paneli, tepede acımasız bir geri sayım.
Süre bitmeden aktif dilin kalıplarını yaz (`import`, `async`, `let`, `fn`...) —
her doğru kelime **süre + puan + kredi** kazandırır. Hedef puana ulaşınca sıradaki
dile geçersin: **25 dillik bir merdiven**, en kolaydan en zora —
**HTML → CSS → Python → JavaScript → … → Rust → Haskell → Assembly**.
Tüm diller bitince **STAGE** yükselir (hedefler artar) ve merdiven baştan başlar.
Kredilerle (max 100) panelin sağ üstündeki **İPUCU** butonundan ipucu satın alınır.

Ama geri sayan tek şey saat değil: **kalıplar da eskiyor.** Birkaç saniyede bir,
henüz yazmadığın bir kalıp uyarıya düşer ve kısa süre sonra **deprecate** olur —
o seviye boyunca bir daha yazılamaz. Uyarı ekrandayken yazarsan çift öder.
Oyunun çekirdeği bu: bir geri sayımla yarışırken ikincisi cevapları yiyor.

Diğer sistemler: **dile özel kurallar** (VERBOSE / TERSE / STRICT COMPILER /
MOVES FAST / LEGACY SYSTEM), boss'larda **exploit chain** (sırayla üç kalıp =
3 kat hasar), her seviye sonunda **3 kart arasından kalıcı bir boon**, ganimet +
çanta + günlük dükkân, festivaller ve günlük mücadele.

**Dili bilmiyorsan:** ASSIST açık gelir — gerçekten sıkıştığında (saat bitmek
üzere ya da bir süredir hiçbir kalıp tutmadıysa) **40 saniyede en fazla bir kez**
kısa bir kalıp önerir. Hayatta kalmaya yeter, puana yetmez.

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

Kodu değiştirdikten sonra tarayıcı eski dosyayı önbellekten servis edebilir —
`index.html` içindeki `?v=` numarasını artır (itch'e yeni build yüklerken de
şart: itch aynı URL'den servis eder).

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
