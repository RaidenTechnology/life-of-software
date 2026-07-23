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

---

## Auto-review ideas - 20260723 pass 5

Verified pass-4's change (sw-festival per-language dedupe): `activeFound` returns
`festival.usedByLang.get(activeLang.name)` for `sw` (GameScene.js:208), and
`usedByLang` is seeded with an entry for every pooled language at startFestival
(`new Map(pool.map(l => [l.name, new Set()]))`, GameScene.js:807). `activeLang`
for a festival is always `festival.lang`, which is drawn from `pool`, so the
`.get()` can never miss and return `undefined` — no crash path on `.has()`/`.add()`
at :264/:278. Growth rounds correctly still use the shared `f.used` set (:842/:848).
Sound.

Code fix this pass (pass-4 idea #1 — daily runs stomping the global PB). EndScene
wrote `los_best` unconditionally for *every* run (EndScene.js:41), while the
per-day `los_daily_<date>` write (:51-58) was additional, not exclusive. Because a
daily loads the shared persistent bag (pass-3 #2) and can post an inflated
`progress`, a daily attempt could silently overwrite the normal-mode PB banner the
menu shows. The global write (and its "NEW PERSONAL BEST" banner) is now gated
behind `!this.daily`; the daily keeps its own per-day key. One-line predicate
change, no behavior change for normal runs.

1. **Boss victory still refills no time (pass-1 #1 / pass-4 #3, still open).**
   `beatBoss()` (GameScene.js:660) adds no time, so clearing a boss near-empty
   drops you into a fresh, harder stage at near-death — an unfair-feeling instant
   loss. Floor it (`timeLeft = Math.max(timeLeft, 20)`) or a fixed bonus. This is
   the most-flagged open item; ~1 line + a pacing playtest. Not fixed here because
   it's a deliberate balance call, unlike this pass's pure correctness fix.

2. **WPM inflates on very short runs (pass-3 #3, still open).** `finish()` floors
   the divisor at one second (`Math.max(this.elapsed/60, 1/60)`, GameScene.js:900),
   so a ~3s death posts an absurd headline wpm that the daily/PB then surface.
   Floor `minutes` at ~10-15s or clamp displayed WPM. ~1 line.

3. **`los_daily_<date>` stores no wpm/score, so a daily leaderboard can't show
   them.** The per-day write persists only `{p, words}` (EndScene.js:56) while the
   global PB stores wpm/stage/level. If the daily is ever surfaced as a shareable
   result (pass-1 idea #4's result card), it can't display speed or score without a
   re-run. Cheap to widen the stored object now. Effort: ~1 line; do it alongside
   the result-card work.

4. **Menu still freezes the countdown for free during boss/festival (pass-2 #2,
   pass-3 #4, still open).** `toggleMenu()` doesn't guard `bossMode`/`festival`
   (GameScene.js:463) and `update()` early-returns on `menuOpen`, so the bag is an
   unlimited free pause of the clock, boss strike timer, and death check — on a
   game whose theme *is* the countdown. Keep the clock ticking while a menu is open,
   or block menu access during boss/festival. Effort: low.

---

## Auto-review ideas - 20260723 pass 6

Verified pass-5's change (daily runs stomping the global PB): the `los_best` write
and its "NEW PERSONAL BEST" banner are now gated behind `!this.daily`
(EndScene.js:44), while the per-day `los_daily_<date>` key keeps its own additive
write (:54-61). Correct — a daily loads the shared bag and can post an inflated
`progress`, so keeping it out of the normal-mode PB is the right call, and normal
runs are unaffected (the predicate is a pure AND-narrowing).

Code fix this pass (pass-3 #3 / pass-5 #2 — WPM inflation on very short runs).
`finish()` floored the wpm divisor at one second (`Math.max(this.elapsed/60,
1/60)`, GameScene.js:911), so a ~3s death posted a triple-digit headline wpm that
the daily and PB then surfaced. The floor is now 15s (`15/60`), which only clamps
sub-15s runs and leaves every real run (`elapsed >= 15`) using the true
`elapsed/60`. Pure correctness — no effect on normal-length runs. This was the
oldest still-open pure-correctness item; the boss-refill floor (pass-1 #1, below)
stays deferred because it's a deliberate balance change, not a correctness fix.

1. **Unguarded `localStorage.setItem` can hard-lock the end screen.** Every
   `localStorage` *read* in the game is wrapped in `try/catch` (EndScene.js:43/57,
   items.js:100/118, sfx.js:9), but the *writes* are not (EndScene.js:45/59,
   items.js:105/125, sfx.js:16/21). EndScene's PB write runs inside `create()`
   *before* the `[ RECOMPILE ]` button is added (EndScene.js:45 vs :83), so on any
   browser where `setItem` throws — Safari private mode, storage disabled, or a
   `QuotaExceededError` — `create()` aborts mid-build and the player is stranded on
   a dead end screen with no way to restart. Judges frequently browse jam entries in
   locked-down/incognito windows, where this reads as "the game crashed." Wrap the
   writes in `try/catch` (mirroring the reads). Effort: low; pure robustness.

2. **Per-day localStorage keys accumulate forever.** Each calendar day mints a new
   `los_daily_<date>` (EndScene.js:55) and `los_shop_<date>` (items.js `shopStock`)
   key that is written but never pruned. It's a few keys/day — negligible in size —
   but it grows monotonically across the multi-week GMTK voting window and is exactly
   the kind of slow accretion that eventually trips the `QuotaExceededError` idea #1
   must survive. When you add the write-guards, also sweep keys older than ~7 days
   (enumerate `localStorage`, drop stale `los_daily_`/`los_shop_` prefixes). Effort:
   low; do it alongside #1.

3. **Low-time urgency is audio-only, so muted playthroughs miss the theme's tension.**
   Under 10s the game ticks `Sfx.tick()` each second and pulses the timer text red
   (GameScene.js:1090-1096), but there is no *screen-level* warning — no edge
   vignette, panel flash, or border pulse. Judges very often skim entries with sound
   off, and for them the entire "Count Down" pressure — the game's core theme, a
   distinct scored GMTK axis — simply doesn't register until the fail screen. Add a
   silent visual cue under 10s (a red screen-edge vignette that intensifies as
   `timeLeft` drops, or a full-panel flash on each tick). Effort: low (one always-on
   overlay whose alpha tracks `timeLeft`); direct Theme/Presentation payoff.

## Auto-dev log - 20260723-2214 pass 1

First active-development pass on Opus 4.8 (Fable 5 hit its usage limit, so the
review-jam loop fell through). This pass **shipped** three of pass-6's recorded-
but-unbuilt ideas plus two game-feel bugs found while reading `battle.js`.

**Bugs fixed**

1. **Unguarded `localStorage` writes (pass-6 idea #1) — FIXED.** Wrapped every
   `setItem` in `try/catch`, mirroring the reads: `Items.save`/`markSold`
   (items.js), `Sfx.setMuted`/`setVolume` (sfx.js), and both EndScene writes
   (`los_best`, `los_daily_<date>`). EndScene's PB write runs inside `create()`
   *before* the `[ RECOMPILE ]` button, so a throwing `setItem` (Safari private
   mode, storage disabled, `QuotaExceededError`) previously aborted the build and
   stranded the player on a dead end screen — the exact thing a judge in an
   incognito window reads as "crashed." Now writes fail silently and play continues.

2. **Per-day keys accreted forever (pass-6 idea #2) — FIXED.** Added
   `Items.pruneOld(keepDays=7)`, called once from `BootScene.create()`. It
   enumerates `localStorage` and drops `los_daily_<date>` / `los_shop_<date>` keys
   older than 7 days (ISO dates sort lexicographically = chronologically). Removes
   the slow monotonic drift across the multi-week voting window that fed idea #1's
   quota risk. Guarded in `try/catch` like the rest.

3. **Hero stopped idle-bobbing after the first attack — FIXED (battle.js).** Every
   `attack()`/`bossHit()` called `killTweensOf(this.hero)` to reset an in-flight
   dash, but that also killed the constructor's forever y-bob tween, which was never
   re-added — so the hero froze stiff from word one onward. Introduced `dashHero()`,
   which stores/stops only the tracked x-dash tween and leaves the y-bob running
   (dash animates x, bob animates y — no conflict). Routed all four dash sites plus
   the level-up `ulti()` lunge through it.

4. **Boss sank to grunt hover-height after it struck (battle.js) — FIXED.** In the
   boss fight the front "monster" is the giant boss (rest y ≈ groundY-38). After its
   6-second lunge, `enemyStrike()` re-added the idle hover at the rank-and-file
   `groundY-10`, visibly dropping the boss ~28px. Now restores the correct height
   based on `bossActive`.

**Feature shipped**

- **Silent low-time warning frame (pass-6 idea #3) — SHIPPED.** A full-screen
  rectangle with a thick red stroke (shows only as an inner edge band, never covers
  the play area) at depth 8 — under the HUD. Its alpha ramps 0→~0.55 over the last
  10 seconds and pulses faster as the clock tightens; zeroed above 10s and during
  festivals. Now the "Count Down" tension reads even with sound muted — a direct
  Theme/Presentation payoff on axes judges score.

**Quality / perf**

- The `dashHero()` refactor also removes four `killTweensOf` calls per combat beat
  and keeps a single reusable dash-tween handle instead of spawning/orphaning
  tweens. The warning frame is one always-on object whose alpha is set per frame —
  no per-frame allocation.

**Leftover for next passes**

- `refreshLangHud()` destroys + recreates `this.langBadge` (a container) on every
  boss hit — cheap but avoidable; could update the existing badge in place.
- Consider extending the low-time warning to festival timers (currently zeroed
  during festivals) if the festival countdown deserves the same tension read.
- The boss's full-width lunge across the battlefield every 6s (`enemyStrike` moving
  it to `heroX+44`) is a lot of travel for a scale-2.6 sprite; a shorter telegraph
  might read better than a full charge.

## Auto-dev log - 20260723-2256 pass 1

Second active-development pass on Opus 4.8 (Fable 5 hit its usage limit again).
Verified the whole game still passes `node --check` (10 files), then fixed a
previously-unflagged correctness bug, shipped the most-flagged balance item plus
one fresh readability feature, and cleared the pass-6-era perf leftover.

**Bugs fixed**

1. **Enemy strike-state flag leaked and permanently killed periodic strikes
   (battle.js) — FIXED.** `enemyStrike()` only clears `striking`/`strikeTarget`
   in the strike's own `onComplete`. But `ulti()` (fires every level-up) and
   `spawnBoss()` both kill every enemy mid-strike, dropping that tween *without*
   firing its `onComplete` — so `striking` stuck `true`, `strikeTarget` pointed
   at a destroyed object, and the guard `(this.striking && !lethal)` early-
   returned forever. The upshot: the very first time you cleared a level (or
   entered a boss) during the ~800ms strike animation, the front monster's
   periodic strikes silently stopped for the *rest of the run*. Lethal blows
   bypass the guard, so death still worked and the bug was invisible. Added a
   self-heal at the top of `enemyStrike`: if `strikeTarget !== enemies[0]` the
   flag is stale (a real in-flight strike always tracks `enemies[0]`), so clear
   it. This is a fresh area — none of passes 1-6 touched the strike state.

**Feature / balance shipped**

2. **Boss victory time cushion (pass-1 idea #1) — SHIPPED.** The single most-
   flagged open item across passes 1, 4, 5. `beatBoss()` refilled no time, so
   clearing a boss with ~1s left dumped you into a fresh stage (langIndex 0,
   higher targets, new monster) at near-death — a frequent unfair instant loss.
   New `BOSS_WIN_TIME = 25`; `beatBoss()` floors `timeLeft` to it (only ever
   raises the clock, so a comfortable win keeps its surplus). Deferred for six
   passes as a "balance call"; made the call.

3. **Boss "N patterns left" HUD (pass-2 idea #3) — SHIPPED.** The boss HUD showed
   HP but never how many un-typed patterns remained, so a thinning word pool was
   invisible until you hit a wall of "already typed" rejections with the clock
   draining. `refreshLangHud`'s boss branch now appends
   `lang.words.length - found.size` to the stage line. (Pool can't truly starve —
   max boss HP 27 < the smallest word list — but the count is honest feedback on
   the game's tensest screen.)

**Quality / perf**

4. **Language badge no longer rebuilt every keystroke.** `refreshLangHud()` runs
   on every correct word and each boss hit, and it destroyed + recreated
   `langBadge` (a 3-object container: two circles + text) unconditionally, even
   though the badge is identical within a level/boss — the exact pass-6 leftover.
   New `updateLangBadge(key, lang)` rebuilds only when the shown language changes
   (key = level index / boss lang name). `_badgeKey` is reset on scene init and
   festival teardown so a destroyed badge always redraws. Removes steady per-word
   GameObject allocation.

**Leftover for next passes**

- The menu/bag/shop still freezes the countdown (and boss strike timer, and death
  check) for free while open — flagged in passes 2/3/5, still open. On a game
  whose theme *is* the countdown, the bag is an unlimited free pause. Keep the
  clock ticking while a menu is open, or block menu access during boss/festival.
- Festivals both freeze the main countdown *and* still hand out `+2s` per answer
  (pass-4 #2), so a festival is a cost-free net-positive clock event — decide that
  deliberately.
- SCORE is still decorative for ranking: the PB/daily keys rank by `progress` then
  `words`, never `score`/`wpm`, and `score` resets each level anyway (pass-2 #4,
  pass-4 #4). Either accumulate a run-total score into the tiebreak or stop
  presenting SCORE as the headline number.
- Boss's full-width 6s lunge is still a lot of travel for a scale-2.6 sprite; a
  shorter telegraph might read better than a full charge.

## Auto-dev log - 20260723-2311 pass 1

Third active-development pass on Opus 4.8. Read the whole game again (10 files
still pass `node --check`), then went after the shop/menu economy — a fresh area
none of passes 1-6 or the two prior auto-dev passes had touched in code.

**Bug fixed**

1. **Buying with a full bag silently wasted credits (GameScene `openShop`) —
   FIXED.** A purchase routed through `addItem`, which *auto-salvages* an
   incoming item when `inventory.length >= INV_MAX`. So clicking BUY on a full
   bag charged the full price and refunded only the salvage crumbs — e.g. 80
   credits for an EPIC, ~15 back, no item, no warning. The BUY button now reads
   `BAG FULL` (red, non-interactive) whenever the bag is at INV_MAX, so credits
   are never burned for nothing. Auto-salvage on random *loot* drops is
   unchanged — that path is intentional; only paid purchases were wrong.

**Feature / balance shipped**

2. **The bag/shop no longer freezes the countdown — the single most-flagged open
   item (passes 2/3/5, and both prior auto-dev logs).** On a game whose theme
   *is* Count Down, opening the bag was an unlimited free pause that also let you
   heal (potion), arm a sword, and shop at zero time cost. `update()` now keeps
   draining `timeLeft` while a menu is open: the cosmetic front-monster strikes
   are held (the field is hidden behind the modal, so they'd play out of sight
   and desync the strike-state machine), a live `⏱ CLOCK RUNNING · Ns` readout
   sits in the menu header and recolors red under 10s, and a timeout closes the
   menu *before* the armor-save/death path runs so the outcome is visible.
   Menus are now blocked during festivals (they own the timer + prompt UI).
   ESC-pause is untouched: it stays a true freeze, but it already blocks every
   action, so the split is now clean — **pause = no clock but no acting; bag =
   act freely, but the clock keeps running.**

**Quality / perf**

3. **One reusable burst emitter for the correct-word pop.** `celebrate()` fires
   on every landed word and was allocating a fresh particle emitter (a
   GameObject) *plus* a 500 ms `delayedCall` to tear it down, every single time —
   steady churn during fast typing, which is the whole game. Now a single
   `this.burstFx` emitter is built once at the panel in `create()` and
   `explode(14)`'d per word; Phaser recycles the dead particles internally, so
   there is nothing to destroy and no per-word timer.

**Leftover for next passes**

- Festivals still freeze the main countdown *and* hand out `+2s` per answer, so a
  festival remains a cost-free net-positive clock event (pass-4 #2). Now that the
  bag no longer freezes time, the festival is the last free-pause surface — decide
  it deliberately (e.g. let the main clock keep ticking under the festival too, or
  drop the per-answer `+2s`).
- SCORE is still decorative for ranking: PB/daily keys rank by `progress` then
  `words`, never `score`/`wpm`, and `score` resets each level (pass-2 #4, pass-4
  #4). Accumulate a run-total into the tiebreak, or stop headlining SCORE.
- Boss's full-width 6s lunge is still a lot of travel for a scale-2.6 sprite; a
  shorter telegraph might read better than a full charge.
- The in-menu clock readout is text-only; a thin draining bar in the menu header
  might read the tension better while shopping.

## Auto-dev log - 20260723-2313 pass 1

Fourth active-development pass on Opus 4.8. Re-read the whole game (10 files pass
`node --check`), then went after two fresh areas no prior pass had touched in
code: the language **data** and the long-standing **decorative-SCORE** debt.

**Bug fixed**

1. **DART listed `'set'` twice (src/data/languages.js) — FIXED.** A scripted scan
   of all 25 word lists for duplicates / untypeable entries flagged exactly one:
   DART had `set` on two lines. `activeLang.words.length` therefore overcounted
   the pool by one, inflating the boss "N patterns left" readout and the hint
   pool size (`includes`/dedupe still worked, so it was invisible in play).
   Removed the second occurrence; re-ran the scan → 0 duplicates. Fresh area:
   no earlier pass touched the language data.

**Feature shipped**

2. **Real run-total SCORE — the single longest-standing open item (flagged in
   passes 2 & 4 and all three prior auto-dev logs).** `this.score` reset to 0
   every level, so the End screen headlined only the last, often half-cleared
   level, and the PB/daily keys ranked by `progress` then `words`, never score.
   Added `this.runScore` plus an `addScore()` helper wired into every earn site
   (normal words with their combo multiplier, boss hits ×15/char, and both
   sw + growth festival answers). `this.score` still drives the per-level target
   and progress bar (and resets each level); the HUD SCORE and the End headline
   now show the cumulative run total. The PB persists `score` and uses it as the
   final tiebreak after progress and words, and the menu BEST line surfaces it.
   SCORE is now a meaningful, rankable number instead of decoration.

**Gameplay quality**

3. **Periodic boss strike shortened into a forward jab (battle.js) — flagged in
   three prior logs.** The 6s non-lethal boss strike charged a scale-2.6 sprite
   the full width of the field to the hero and back, reading as a shuttle. It now
   does a short ~110px forward jab with a big slash bursting at the boss's reach.
   Grunts and every *lethal* blow (including the boss's own killing charge) still
   close the full distance, so the death drama is untouched; only the repeating
   telegraph got tighter. Return/hover-restore/strike-state handling unchanged.

**Leftover for next passes**

- Festivals still freeze the main countdown *and* hand out `+2s`/answer, so a
  festival remains a cost-free net-positive clock event (pass-4 #2). It is now the
  last free-pause surface — decide it deliberately.
- The in-menu clock readout is still text-only; a thin draining bar in the menu
  header would read the tension better while shopping.
- With run-total SCORE now ranked, consider showing a live run-best "beat N pts"
  target on the HUD, or a small end-screen delta vs. the previous best.
