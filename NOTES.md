# GMTK Game Jam 2026 — Konsept Notları

**Tema: Count Down** (itch.io duyurusu, 22 Temmuz 2026 20:04, ~96 saatlik jam)

> Resmi açıklama: "How you interpret this theme is entirely up to you. It could be a
> countdown to zero. Numbers going down. Time going backwards. A depressed person with
> a historical title of nobility. Up to you!"

GMTK teması genelde çok yorumlanabilir bırakılıyor — dört farklı okuma mümkün:
1. **Sayısal geri sayım** (0'a doğru azalan bir sayaç, aciliyet/baskı mekaniği)
2. **Azalan sayılar** (kaynak/can/güç azalması, roguelite tarzı düşüş)
3. **Zamanda geri gitme** (rewind/time-loop mekaniği)
4. **Kelime oyunu**: "Count" (kont/asilzade unvanı) + "down" (çöküş/depresyon) — bir
   asilzadenin düşüşü, ironik/anlatı temelli bir yaklaşım

Aşağıdaki 5 konsept bu dört okumayı farklı türlerde karşılıyor.

---

## Konsept 1 — Ters Bomba Kaşifi (arcade/aksiyon)
Oyuncu, gövdesinde patlamaya "count down" yapan bir robot/karakteri yönetir. Labirent
tarzı bir haritada anahtar/parça toplayıp çıkışa ulaşmaya çalışır; her yanlış hamle
(tuzağa çarpma, geç kalma) sayacı hızlandırır, doğru hamleler yavaşlatır.

- **Artı:** Tema doğrudan ve okunur; mevcut top-down hareket + collectible döngüsü
  neredeyse birebir uyuyor; skeletondaki `timeLeft` sayacı zaten bu mekaniğin çekirdeği.
- **Eksi:** "Koş-topla-kaç" kalıbı jam'lerde çok görülür, öne çıkmak için görsel/ses
  kimliği (Raiden kırmızısı + sinirli bip sesleri) önemli olacak.
- **4 günlük jam'e uygunluk:** Yüksek — en düşük risk, en hızlı prototiplenebilir.

## Konsept 2 — Yankı Sarmalı (puzzle-platformer, zaman döngüsü)
Her seviyede sınırlı sayıda "tur" (ör. 5) hakkı var; her tur bittiğinde (count down 0'a
inince) o turdaki hareketleriniz bir "hayalet" olarak kaydedilip yeniden oynatılır ve
sahnede kalır. Hedefe ulaşmak için önceki turların hayaletlerini merdiven/köprü/dikkat
dağıtıcı olarak kullanmanız gerekir. Kalan tur sayısı ekranda geri sayar.

- **Artı:** "Count down" hem sayısal hem kavramsal (azalan hak) olarak işleniyor;
  bulmaca derinliği yüksek, GMTK jüri zevkine (mekanik-temelli oyunlar) çok uygun.
- **Eksi:** Ghost-replay sistemi (input kaydı + oynatma) ekstra mühendislik ister;
  seviye tasarımı zaman alır, 4 günde 4-5 iyi seviyeden fazlasına sığmaz.
- **4 günlük jam'e uygunluk:** Orta — çekirdek sistem 1 günde kurulabilirse geri kalan
  3 gün seviye tasarımına ayrılabilir. Risk: ghost sync bug'ları.

## Konsept 3 — Kontun Çöküşü (roguelite/anlatı, kelime oyunu okuması)
Oyuncu düşüşe geçmiş bir "Kont"u (nobility + count kelime oyunu) canlandırır: her tur
(gün) geçtikçe unvanı, serveti ve nüfuzu "sayaç" gibi azalır (count *down*). Kararlar
(ör. hangi haneyi satacak, hangi ittifakı bozacak) her turda skoru etkiler; sıfıra
inince oyun biter ve final "mirasınız" skorlanır.

- **Artı:** Temayı hem kelime oyunu hem duygusal katmanla en özgün işleyen fikir;
  jüri değerlendirmesinde "yaratıcılık" puanında öne çıkabilir.
- **Eksi:** Anlatı/metin-ağırlıklı oyunlar 4 günde yazı + dengeleme açısından pahalı;
  mevcut Phaser aksiyon iskeletiyle (fizik, collectible, particle) örtüşmesi düşük —
  UI-ağırlıklı yeni bir sahne yapısı gerekir.
- **4 günlük jam'e uygunluk:** Düşük-Orta — içerik (karar metinleri, dallanma) zaman
  yiyicidir; küçük ölçekli tutulursa (ör. 10 tur, 3 sonuç) mümkün.

## Konsept 4 — Geri Sayımlı Kuşatma (tower-defense/hayatta kalma)
Ekranın bir köşesinde büyük bir sayaç var: "İstila N tur sonra". Oyuncu bu süre
içinde savunma kurar/kaynak toplar; sayaç 0'a inince dalga saldırır ve zorluk kalıcı
olarak bir kademe artar (sayı hep aşağı iner, asla sıfırlanmaz — oyun sonunda kaç
dalga tutulduğu skorlanır).

- **Artı:** Skeletondaki collectible + skor + particle sistemleri kaynak toplama için
  doğrudan yeniden kullanılabilir; "aşamalı zorlaşma" doğal bir skor eğrisi verir.
- **Eksi:** Tower-defense dengelemesi (düşman AI, yerleştirme, ekonomi) 4 günde
  fazla kapsamlı olabilir; Konsept 1'e göre çok daha fazla içerik ister.
- **4 günlük jam'e uygunluk:** Düşük — kapsam en büyük risk, muhtemelen kısaltılmalı.

## Konsept 5 — Fırlatma Öncesi (arcade/escape, gerilim odaklı)
Bir roket/asansör/kapı fırlatma öncesi geri sayıma girer (görsel + sesli "10, 9, 8...").
Oyuncu bu sabit süre içinde odada dağılmış parçaları toplayıp doğru sırayla bir
mekanizmaya yerleştirmeli; süre bitmeden bitirirse kazanır, aksi halde (komik/absürt)
başarısızlık animasyonu oynar. Kısa ve tekrar oynanabilir (speedrun) bir döngü.

- **Artı:** En basit kapsam, en net "count down" görselleştirmesi (büyük rakamlar
  ekranda), speedrun/leaderboard ile tekrar oynanabilirlik ucuza eklenir.
- **Eksi:** Mekanik derinliği sığ kalabilir, jüri "orijinallik" puanında Konsept 1
  ile benzer riski taşır.
- **4 günlük jam'e uygunluk:** Yüksek — Konsept 1 ile birlikte en güvenli iki seçenek.

---

## Tavsiye sıralaması (risk/getiri)
1. **Konsept 1** (Ters Bomba Kaşifi) veya **Konsept 5** (Fırlatma Öncesi) — güvenli,
   mevcut iskeletle en az sürtünme, jam bitmeden cilalamaya vakit kalır.
2. **Konsept 2** (Yankı Sarmalı) — daha yüksek yaratıcılık/jüri potansiyeli ama teknik
   risk taşıyor; çekirdek ghost-replay sistemi gün 1 sonunda çalışmıyorsa Konsept 1'e
   düşülebilir (fallback plan).
3. Konsept 3 ve 4 kapsam riski yüksek, sadece ekip büyürse/vakit boşsa değerlendirilsin.

## Mevcut iskeletin konseptlere uyarlanması
- `src/main.js`: 960×540, arcade physics, sahne listesi — tüm konseptlerde aynı kalır.
- `src/scenes/GameScene.js`: şu an top-down hareket + collectible + 30sn sayaç
  (placeholder). **Konsept 1 ve 5** bu dosyayı doğrudan büyütür (aynı iskelet, tema
  mekaniği eklenir). **Konsept 2** input-history kaydı için yeni bir `Ghost` sınıfı ve
  tur yönetimi ekler. **Konsept 3/4** muhtemelen yeni sahneler (`ManorScene`,
  `WaveScene`) ve UI-ağırlıklı bir yapı gerektirir — mevcut particle/physics kodu
  büyük ölçüde kullanılmaz.
- `src/sfx.js`: WebAudio synth zaten var — geri sayım bip'i (`Sfx.tick()` gibi) her
  konseptte kolayca eklenebilir, yeni asset gerekmez (jam kuralına uygun).
- `src/scenes/MenuScene.js` / `EndScene.js`: değişmeden kalabilir, sadece metin/skor
  etiketleri temaya göre güncellenir (ör. "GERİ SAYIM BAŞLASIN").

## Kullanıcı dönünce ilk adımlar
1. Yukarıdaki 5 konsepti oku, birini seç (veya harmanla) — tavsiye: 1 veya 5 ile başla,
   zaman kalırsa derinlik ekle.
2. `GameScene.js` içindeki placeholder collectible döngüsünü seçilen mekanikle
   değiştirmeye başla; `main.js` ve sahne akışına dokunmaya gerek yok.
3. Oyun adını belirle → `README.md` başlığı, `index.html` `<title>` ve
   `build.ps1`'deki zip adını (`raiden-gmtk2026.zip`) güncelle.
4. El yapımı pixel-art / kendi çekilen ses varsa `assets/` altına ekle (AI asset YASAK).
5. Jam bitimine (26 Temmuz ~20:00) kadar her anlamlı adımdan sonra commit at.
6. Bitince `build.ps1` ile paketle, itch.io'ya "played in browser" olarak yükle,
   temaya nasıl uyduğunu submission formunda kısaca açıkla.

---

## Auto-review ideas - 20260723 pass 1

1. **Stage-clear time cushion after a boss.** `beatBoss()` refills no time, so
   winning a boss with ~1s left dumps you into a fresh stage (new monster, higher
   targets) at near-death — often an instant loss that feels unfair rather than
   hard. Refill to a floor (e.g. `timeLeft = Math.max(timeLeft, 20)`) or add a
   fixed bonus like the per-language `LEVELUP_TIME_BONUS`. Helps the "fun/feel"
   jury axis; effort: ~1 line + a playtest pass on pacing.

2. **Make the "Count Down" theme legible at a glance.** The game currently reads
   as a typing brawler; a judge skimming may miss the theme tie. Surface an
   explicit descending counter — e.g. "LANGUAGES LEFT 25 → 0" that ticks down as
   you clear the road, or frame the run as a shipping deadline. Directly lifts the
   Theme score, which is a distinct GMTK category; effort: low (one HUD label +
   copy), no new systems.

3. **Cap the particle-emitter accumulation.** Every correct word, kill, boss
   flinch and loot drop does `this.add.particles(...).explode()`, which leaves a
   dormant emitter GameObject in the display list forever. A long Survival run
   spawns thousands, degrading FPS on the modest laptops judges often use. Give
   each a short `duration`/self-destroy or reuse a small pool. Helps Presentation;
   effort: medium (touches ~5 call sites but each is mechanical).

4. **Shareable end-of-run result card.** The daily challenge already shares a
   seed; add a compact, screenshot-friendly summary (score · wpm · accuracy ·
   stage · seed) on EndScene plus a "copy result" line for itch comments. Turns
   the daily into a social loop and drives comment activity during voting, which
   correlates with visibility. Effort: low-medium (reuse existing EndScene stats).

5. **Teach the depth the game already has.** Combos, loot rarities, festivals and
   bosses are all built but never explained; a judge who plays two minutes may
   never learn why typing fast matters. Add one "how to play" panel on the menu or
   contextual first-time tooltips (the first festival, the first drop). Raises
   perceived depth and Enjoyment without new mechanics; effort: low (text + a
   `seen` flag in localStorage).

---

## Auto-review ideas - 20260723 pass 2

Verified pass-1's code fix: `beatBoss()` now calls `this.found.clear()` before
resetting `langIndex = 0` (GameScene.js:655). Correct and necessary — boss words
accumulate into `this.found` during the fight (submit() uses `activeFound`, which
is `this.found` when no festival is active), so without the clear, any boss word
that also exists in the next level's list (HTML) would read as "already typed" on
the fresh level. `startBoss()` already clears on entry; this closes the exit side.

1. **README undersells the game and names the wrong opener.** README.md:6 still
   advertises a 5-language ladder ("Python -> JavaScript -> Java -> C++ -> Rust"),
   but the game ships **25** languages and actually opens on **HTML** — the
   first-time nudge literally says type `"body"` (GameScene.js:190). A judge
   cross-referencing the itch page against the game sees a mismatch, and worse, the
   page hides a real selling point (25-language ladder + rising STAGES). Fixed the
   ladder line in this pass; still worth a screenshot/gif on the itch page that
   shows the language road. Effort: done (doc) + one capture.

2. **Bag/Shop is an unlimited free pause of the countdown.** `update()` early-
   returns whenever `this.menuOpen` is set (GameScene.js:1032), so `timeLeft`,
   the enemy strike timer and the death check all freeze while the inventory or
   shop is open — with no cost and no limit. On a game whose entire theme *is* the
   countdown, a player can park in the bag to stop the clock and plan indefinitely,
   which quietly deflates the tension judges are scoring. Consider keeping the
   clock running (or ticking at reduced rate) while menus are open, or gating menu
   access to festivals/between-levels. Effort: low (a flag + let update() keep
   decrementing), but playtest the feel.

3. **Boss word pool gets thin exactly when it matters.** Boss HP is
   `12 + stageIndex*3`, up to 27 at the last stage (GameScene.js:639), while the
   smallest language list (Lua, ~38 words) is the pool a random boss may draw.
   Late in a high-stage boss the player can run out of un-typed words and eat a
   string of "already typed" rejections with the clock draining — survivable, but
   the margin is thin and invisible (the HUD shows HP, never words-left). Either
   draw boss words from the union of all cleared languages (huge pool, no
   starvation) or show a "words left" count during the fight. Effort: low-medium.

4. **`score` reported to EndScene is only the current level's score.** `finish()`
   passes `score: this.score` (GameScene.js:902), but `score` resets to 0 on every
   `levelUp()` (line 606). So a deep run that dies on level 12 reports roughly one
   level's worth of points, and any "personal best" built on it rewards a lucky
   single level rather than a long run. If PB/leaderboard is meant to reflect a
   run, accumulate a `totalScore` alongside the per-level `score`. Effort: low
   (one running sum + use it in `finish()`), but confirm intent first.

---

## Auto-review ideas - 20260723 pass 3

Verified pass-2's changes: README.md now names the real 25-language ladder and
the HTML→…→Assembly ordering (matches `LANGUAGES`, which is 25 entries opening on
HTML and ending on ASSEMBLY, languages.js:7-305). Pass-2's four line references
also still hold: menu early-return (GameScene.js:1032), boss HP formula
(GameScene.js:639), `score: this.score` (GameScene.js:902), per-level reset
(GameScene.js:606).

Code fix this pass: the three one-shot `.explode()` bursts (pass-1 idea #3) were
leaking a `ParticleEmitter` GameObject each — one per correct word/festival
answer/boss hit (GameScene.js:375) and per kill/boss-flinch (battle.js:373, 588).
Each now self-destroys after its particle lifespan. Left the `demon` fire
fountain alone: it's a continuous emitter already tracked in `this.decor` and
destroyed on the next stage's decor rebuild (battle.js:640-650).

1. **Software Festival shares one `used` set across every pooled language, so a
   valid word gets wrongly rejected as "already typed".** `activeFound` returns
   the single `festival.used` set (GameScene.js:203), while `activeLang` is
   whichever language is currently highlighted. Type `return` while Python is up →
   it lands in `used`; a few rounds later Java is highlighted, the prompt says
   "type a JAVA pattern!", you type the perfectly valid `return`, and submit()
   rejects it with "already typed" (GameScene.js:258). Because the pool is picked
   from all 25 languages, shared keywords (`return`, `class`, `if`, `for`, `new`,
   `true`…) collide constantly, and the rejection reads as a bug mid-festival when
   the clock is fastest. Track "used" per highlighted language (e.g. key the set by
   `lang.name`) or drop the dedupe during the `sw` festival. Effort: low; helps
   feel/fairness on a mode judges will hit often (35% after each level).

2. **The "daily challenge" is not actually comparable between players.** `init()`
   seeds `this.rand` from the date so festival picks and loot *rolls* are
   deterministic (GameScene.js:39-46), but two things break parity: (a) the seeded
   stream is consumed in player-dependent order — `maybeDrop()` only pulls
   `rand()` when a word is submitted (GameScene.js:398-399), so a faster typist
   desyncs the sequence entirely; and (b) the run loads the shared persistent bag,
   `Items.load()` reading `los_inv` (GameScene.js:82, items.js:99), so a player who
   stockpiled EPIC potions/armor in normal mode walks into the "fair" daily fully
   loaded. If the daily is meant to be a level playing field, isolate it: start it
   with an empty or fixed loadout and, ideally, roll the day's loot up-front from
   the seed rather than on submit. Effort: medium; confirm how competitive the
   daily is meant to be first.

3. **`finish()`'s WPM denominator can inflate on very short runs.** `minutes =
   Math.max(this.elapsed / 60, 1/60)` floors the divisor at one second
   (GameScene.js:900), so a run that dies in ~3s with, say, 6 words reports
   6 / (1/60) = **360 wpm**. It only bites the fail-fast case, but the daily and
   PB both surface WPM, so a trivially short attempt can post an absurd headline
   number. Floor `minutes` at something like 10-15s instead, or clamp displayed
   WPM. Effort: ~1 line.

4. **Countdown freezes for free while the bag/shop is open — including mid-boss
   and mid-festival.** Pass-2 flagged the menu freezing `timeLeft`; worth noting
   `toggleMenu()` only guards over/dying/transitioning/paused (GameScene.js:463),
   not `bossMode` or `festival`. So the player can pop the bag during a boss to
   stop the boss's 6s strike timer and the drain, plan, use a potion, and resume —
   on a timed boss that's a sizable, invisible difficulty leak. Either keep the
   clock ticking while a menu is open (see pass-2 #2) or block menu access during
   boss/festival. Effort: low.

---

## Auto-review ideas - 20260723 pass 4

Verified pass-3's changes: the three one-shot bursts now self-destroy —
`celebrate()`'s emitter at GameScene.js:387, the kill burst at battle.js:377, and
the boss-flinch burst at battle.js:594 — matching pass-3's description. Pass-2's
still-open threads also hold: the menu early-return still freezes the clock and
`score: this.score` still reports only the current level (GameScene.js:913, resets
each `levelUp()`), neither addressed since.

Code fix this pass (pass-3 idea #1 — the `sw` festival's shared `used` set). The
Software festival pools up to 6 languages and highlights them one at a time
(startFestival GameScene.js:779, pickFestivalLang), but `activeFound` returned a
single `festival.used` set, so a keyword valid in two pooled languages (`return`,
`class`, `if`…) was added while one was up and then wrongly rejected as "already
typed" when another came up — mid-festival, when the clock is fastest, and it also
docked accuracy (`submitsTotal++` with no `submitsOk`). `activeFound` now dedupes
per highlighted language for `sw` via a new `festival.usedByLang` map keyed by
`lang.name` (GameScene.js:203-210, initialized at :807); growth stays on the shared
`used` set, which is correct because `pickGrowthRound` guarantees each prompt word
is unique across the pool. `buyHint`'s `remaining` filter reads the same getter, so
hints stay consistent for free.

1. **Daily runs overwrite the *global* personal best.** EndScene writes `los_best`
   unconditionally for every run (EndScene.js:41-45); the `if (this.daily)` block
   that writes the per-day key (`los_daily_<date>`, :51-58) is *additional*, not
   exclusive. So a daily attempt — which loads the shared persistent bag (pass-3 #2)
   and can therefore post an inflated `progress` — silently stomps the normal-mode
   PB banner shown on the menu, conflating two different games. Gate the `los_best`
   write behind `if (!this.daily)`. Effort: ~1 line.

2. **Festivals freeze the main countdown *and* still hand out clock time.**
   `update()` returns early whenever `this.festival` is set (GameScene.js:1046),
   before `this.timeLeft -= delta` at :1064 — so the main clock doesn't tick during
   a festival — yet every correct festival answer does `this.timeLeft +=
   FESTIVAL_TIME_BONUS` (:303/:358). A festival (35% after each level) is thus a
   cost-free, net-*positive* clock event: even a passive player exits with more time
   than they entered, on a game whose whole theme is the countdown. This is distinct
   from the menu-freeze already logged. If festivals are meant as a breather that's
   defensible — but decide it deliberately; otherwise don't grant main-clock time
   there, or let the main clock tick (slowly) through the festival. Effort: low.

3. **Boss victory still refills no time (pass-1 #1, never actually fixed).**
   `startBoss()` adds `this.timeLeft += 10` on entry (GameScene.js:651) but
   `beatBoss()` (:660) adds nothing, so clearing a boss with ~1s left drops you
   straight into a fresh stage (new monster, higher targets, `langIndex=0`) at
   near-death — often an instant, unfair-feeling loss. Pass-1 flagged this and
   pass-2's `beatBoss` edit was the `found.clear()`, not a refill, so it's still
   open. Floor it (`timeLeft = Math.max(timeLeft, 20)`) or add a fixed bonus.
   Effort: ~1 line + a pacing playtest.

4. **Ranking ignores score entirely, so the big on-screen SCORE is decorative.**
   Both the global PB and the daily key rank by `progress` then `words`
   (EndScene.js:41, :55) — never by `score` or `wpm`. Combined with pass-2 #4
   (`score` is only the current level's), the prominently displayed SCORE never
   affects what counts as a "personal best" and isn't comparable across runs. Either
   accumulate a run-total score and factor it into the PB tiebreak, or stop
   presenting SCORE as the headline number. Effort: low; confirm intent first.
