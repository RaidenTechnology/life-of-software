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

## Auto-dev log - 20260723-2346 pass 1

Fifth active-development pass on Opus 4.8. Re-read all 10 files (all still pass
`node --check`), then closed the single longest-standing leftover (the festival
free-pause), fixed a fresh game-feel bug, landed one of the recorded HUD ideas,
and cut a real per-frame render cost — four separate commits.

**Bug fixed**

1. **Stacked tweens drifted the panel and cut feedback short (GameScene) —
   FIXED.** Two reused HUD objects each got a *fresh* tween on every call, so a
   fast wrong-word streak stacked them. `feedback()` added an alpha fade on the
   shared `feedbackText` each time; an older fade firing mid-message blanked the
   newest text early — now `killTweensOf(feedbackText)` runs first. `shakePanel()`
   is a relative `'+=6'` yoyo; a second shake started before the first finished
   captured its start *mid-offset* and yoyo'd back to that, leaving a permanent
   x-drift on the panel/input/cursor — now a `_shaking` guard runs one shake at a
   time. Fresh area: no prior pass touched the panel-shake / feedback juice.

**Feature / balance shipped**

2. **Festivals no longer freeze the clock — the last free-pause surface (pass-4
   #2, re-flagged in every log since).** A festival both froze the main countdown
   *and* paid `+2s`/answer, so it was a cost-free net-positive clock event you
   could coast through. Now the main countdown keeps draining *under* the festival
   (same call the bag/shop fix made): the big central timer shows the MAIN clock
   with its usual sub-10s color/scale/tick/warn-frame tension, the festival's own
   20s timer plus a `⏱ clock runs — festival ends in Ns` warning sit in the
   banner, and the `+2s`/answer becomes a genuine race to offset the drain instead
   of pure upside. You can now die mid-festival if you stall. Plumbing: strikes are
   held under the banner via a `holdStrikes` flag (field is hidden there); the
   death path tears the banner down quietly with `endFestival(true)` so the battle
   strip is back for the killing blow; armor death-save still works mid-festival
   and just lets the round continue. **Decision made: festival = bounded risk/
   reward speed round, not a pause.**

3. **Live PB target on the HUD (recorded idea from pass 20260723-2313) —
   SHIPPED.** Run-total SCORE became rankable last pass but had no in-run goal. A
   small `PB <n>` now sits beside SCORE; the frame `addScore()` carries the run
   past it, it flips to a gold `★ RECORD ★`, pulses, floats `NEW RECORD!` and
   plays the win jingle — once. Blank during dailies (they rank on a separate
   per-day key), so the global-best target never misleads there.

**Quality / perf**

4. **Big timer recolored only on the 10s threshold, not every frame.** Phaser's
   `Text.setColor` re-renders the glyph's canvas texture on *every* call even when
   the color is unchanged; `update()` called it on the 60px countdown every frame
   for the whole (mostly >10s) run — a needless ~60 texture redraws+uploads/sec.
   Gated behind a `_timerLow` transition flag: recolor fires once crossing the
   sub-10s line and once on the way back up (level-up / boss reset). The per-frame
   scale pulse and warn-frame alpha still run only while actually low.

**Leftover for next passes**

- The in-menu clock readout is still text-only; a thin draining bar in the menu
  header would read the tension better while shopping. (The festival banner now
  has its own text readout too — same treatment could unify both.)
- End-screen delta vs. previous best (`+N over` / `N to beat`) is still unbuilt —
  the live HUD PB target landed this pass, the end-screen counterpart did not.
- Festival balance is now deliberate but untuned: entering a festival at low time
  is genuinely dangerous. If playtests find it too punishing, options are a small
  one-time clock cushion on festival start, or a slightly larger `+2s` per answer.
- Other reused-object tween sites (`flashPanel` stroke via `delayedCall`,
  `floatText` spawns) look safe, but a quick audit for the same stacked-tween
  class the shake/feedback fix addressed wouldn't hurt.

## Auto-dev log - 20260724-1424 pass 1

Sixth active-development pass on Opus 4.8 (Fable 5 hit its usage limit again).
Re-read all 10 files (all still pass `node --check`) and ran two data-integrity
scans first: every word list is clean (0 duplicates / uppercase / whitespace /
over-`MAX_TYPED` / missing-meta entries), and the smallest pool (LUA, 38) still
exceeds the max boss HP (27), so the boss can't starve. The state machines the
prompt calls out (strike flags, festival+boss exclusivity, death-save timing,
menu freeze) are all sound after five prior passes — genuine fresh *bugs* are
nearly exhausted, so this pass fixed the one real correctness nit left in the
timer, then shipped the two most-flagged unbuilt features and cut the last
recorded per-frame allocation. Four separate commits.

**Bug fixed**

1. **Countdown tick could be swallowed on a boundary refill (GameScene
   `update`) — FIXED.** The sub-10s tick fires once per integer second, gated on
   `s !== this.lastTickSecond`. `lastTickSecond` was never cleared when the timer
   *left* the ≤10s zone, so if the last tick before a level-up / boss / potion
   refill landed on `s = 10` and the clock later drained back to exactly 10,
   `s === lastTickSecond` and that re-entry second's tick was silently dropped.
   Now `lastTickSecond` resets to -1 in the leave-low transition, alongside the
   existing scale / warn-frame reset, so the first second back under 10 always
   ticks. Fresh area: no prior pass touched the tick cadence.

**Features shipped**

2. **End-screen score delta vs. previous best — SHIPPED (recorded-but-unbuilt in
   two prior logs).** The live HUD gained a PB target two passes ago, but its
   end-screen counterpart was never built. EndScene now captures the previous
   best *score* before the PB row can overwrite `los_best`, then prints one line
   under SCORE: green `▲ +N over your best score!` when you beat it, `matched
   your best score` on a tie, or a dim `N to beat your best score` when short.
   Gated to non-daily runs with a prior score, mirroring the in-run PB target so
   the two always agree. (SCORE nudged up 6px to make room; layout stays clear of
   the NEW-PERSONAL-BEST row above and the wpm line below.)

3. **Draining clock bar in the bag/shop header — SHIPPED (flagged in three prior
   logs).** The in-menu clock was text-only. `menuShell` now draws a 150px bar
   (full ≈ a fresh `START_TIME` clock) under the `CLOCK RUNNING` text; `update()`
   shrinks it every frame (rect width is a transform, no re-raster) and recolors
   it red under 10s in step with the text. Cleared with the rest of the menu in
   `closeMenu` (new `menuClockBar` handle nulled there and in `create`). Now the
   cost of browsing the bag reads at a glance, not just as a number.

**Quality / perf**

4. **`floatText` popups pooled instead of alloc+destroy per word.** `floatText`
   fires on every landed word (normal, boss, festival) — the fastest UI churn in
   the game — and each call `add()`'d a Text plus a 900ms destroy tween. Now a
   6-entry ring is preallocated in `create()` and recycled round-robin: kill any
   in-flight tween, reset text / position / alpha, re-tween. No per-word
   GameObject allocation or teardown; built last in `create()` so the popups keep
   their old above-panel / below-warn-frame layering. This clears the last
   recorded reused-object churn site (the `flashPanel` `delayedCall` reset is
   idempotent and stays as-is — it only ever sets the stroke back to border).

**Leftover for next passes**

- Festival balance (entering at low time is dangerous) is deliberate but still
  untuned — the standing options are a small one-time clock cushion on festival
  start, or a slightly larger `+2s`/answer. Needs a playtest call, not a code
  call.
- Daily bests (`los_daily_<date>`) are written but surfaced nowhere — the menu
  BEST line reads only the global `los_best`. A small "today's daily best" line
  on the menu / end screen would close the loop on the daily leaderboard hook.
- Settings gear/panel (`UI.settings`, depth 31) floats above the bag/shop modal
  (depth 30); you can't easily open both, but the layering is technically wrong
  — bump the menu above the gear or hide the gear while a menu is open.
- With the end-screen delta landed, a live "beat N to set a record" is already on
  the HUD; the two PB surfaces are now consistent — no further PB work needed.

## Auto-dev log - 20260724-1451 pass 1

Seventh active-development pass on Opus 4.8. Re-read all 10 files (all still pass
`node --check`). Genuine fresh bugs are nearly exhausted after six passes, so
this pass closed the last stacked-timer site the earlier juice fixes hadn't
reached, cleared two of the standing leftovers (the settings-gear layering and
the daily-best surfacing), and cut the last per-event allocation in the battle
strip — which no prior perf pass had touched. Four separate commits.

**Bugs fixed**

1. **Stacked `hintText` auto-clear timers blanked a newer hint early
   (GameScene `buyHint`) — FIXED.** Each hint scheduled a bare
   `time.delayedCall(6000, clear)`; buying a second hint within 6s left the
   first timer pending, and when it fired it wiped the *newer* hint's masked
   text 0–6s early. Exactly the stacked-timer class the `feedback`/`shakePanel`
   fixes addressed for their shared labels, but hints were never covered. Now the
   timer is tracked in `this._hintClear` and `remove()`d before the next is
   scheduled. Fresh area: no prior pass touched the hint auto-clear.

2. **Settings gear/panel drew above the bag/shop modal (depth 31 > 30) —
   FIXED (standing leftover, flagged in the pass-6 log).** `UI.chrome` mounts the
   gear + settings panel at depth 31; the bag/shop `menuShell` container sat at
   depth 30, so the gear stayed clickable through the modal dim and its panel
   opened on top of the shop window. Bumped the menu container to depth 40 — the
   dim now covers the gear (and swallows clicks aimed at it) while staying below
   the pause overlay (depth 50). One-line, no other depth users in 30–50.

**Feature shipped**

3. **Today's daily best surfaced on the menu + end screen (standing leftover,
   flagged in the pass-5 and pass-6 logs).** `los_daily_<date>` was written by
   EndScene but shown nowhere, so the seeded daily had no visible target. The
   menu now folds the day's best word count into the DAILY button label
   (`… · best Nw ]`), and the end screen prints `today's daily best: N patterns`
   for daily runs — re-read *after* the write so it includes the run just
   finished — reusing the slot the checkpoint line uses for normal runs. Closes
   the daily leaderboard loop that the shared-seed race depends on.

**Quality / perf**

4. **Death/flinch particle burst pooled instead of alloc+destroy per kill
   (battle.js — a fresh area for perf).** `Battle.kill()` fires on every correct
   melee word and `bossFlinch()` on every boss hit; each `add()`'d a fresh
   ParticleEmitter (`emitting:false`), `explode()`'d once, and scheduled a
   `delayedCall` to `destroy()` it ~400–450ms later — an emitter allocation +
   teardown + timer on the game's most frequent battle event. Now one reusable
   `deathFx` emitter is built in the constructor and `explode(n, x, y)` fires the
   burst at the hit point (verified the Phaser 3.90 `explode(count,x,y)` signature
   forwards x/y to `emitParticle`). Mirrors the `floatText`/`burstFx` pooling the
   GameScene passes did; the demon fire-fountain emitters stay as-is (they're
   persistent continuous emitters, not per-event).

**Leftover for next passes**

- Festival balance (entering at low time is dangerous) is deliberate but still
  untuned — a small one-time clock cushion on festival start or a slightly larger
  `+2s`/answer are the standing options. A playtest call, not a code call.
- The daily-best line shows only word count; decoding `p` into a STAGE·LEVEL label
  (as the checkpoint/menu lines do) would make the daily target read the same way
  as the normal-mode BEST line. Small polish.
- The music loop is a raw `setInterval`, so it keeps playing through an ESC pause
  (Phaser `time.paused` only freezes scene timers). Arguably fine, but pausing the
  chiptune on pause would be more correct if a playtest finds it odd.

## Auto-dev log - 20260724-1451 pass 2

Eighth active-development pass on Opus 4.8. Re-read all 10 source files (all pass
`node --check`) plus NOTES. Confirmed the earlier boss word-starvation worry is a
non-issue (smallest language pool is 38 words vs a max boss HP of 27), then found
a genuinely fresh render/perf bug no prior pass had spotted — the battle strip
was being fully re-staged on *every* correct word — and shipped one juice feature
and one standing-leftover quality fix. Three code commits + this log.

**Bug fixed**

1. **The battle strip re-staged on every correct word — FIXED (fresh area).**
   `refreshLangHud()` runs once per landed word (GameScene `submit` else-branch),
   and it called `battle.setStage(this.stageIndex)` + `battle.setTier(...)`
   unconditionally. `setStage()` re-textures the backdrop, the hero and all five
   monsters, and — worst — `decor.forEach(destroy)` + recreates the demon stage's
   two fire-fountain particle emitters. So on the SURVIVAL (demon) stage the fire
   fountains visibly reset on every keystroke-that-landed, and every stage paid a
   pile of no-op `setTexture` swaps per word. Now gated behind `_hudStage` /
   `_hudTier` change-tracking keys (same idiom as `updateLangBadge`), so the
   re-stage runs only when the stage or hero tier actually changes. `sceneBg`'s
   per-word `setTexture` folded into the same stage-change guard.

**Feature shipped**

2. **Combo score-multiplier milestones now pop (juice).** Hitting combo 5 (score
   ×2) and combo 15 (score ×3) previously only recolored the COMBO readout. Now
   crossing INTO a new multiplier tier gives it a bigger `Back.easeOut` spring pop
   (scale 1.7 vs the ordinary 1.25 nudge) and a bright rising chirp (`Sfx.pickup`),
   so the moment the multiplier starts paying off is felt, not just tinted.
   Tracked in `_comboTier`, fired only on the word that crosses each line, reset
   when the combo breaks.

**Quality**

3. **Chiptune now pauses with the game on ESC (standing leftover, flagged in the
   pass-6 and pass-7 logs).** The music loop is a raw `setInterval`, so Phaser's
   scene pause (`time.paused`, which only freezes scene timers/tweens) left it
   playing under the PAUSED overlay. Extracted the scheduler body into
   `Sfx.musicTick(m)` and added `pauseMusic()` / `resumeMusic()` that clear and
   restore the interval while keeping the step + bpm, so the melody resumes in
   place instead of restarting. `togglePause()` freezes/thaws it with everything
   else. `stopMusic()` still no-ops safely on the now-null timer at shutdown.

**Leftover for next passes**

- Festival balance (entering at low time is dangerous) remains a deliberate-but-
  untuned playtest call — a small one-time clock cushion on festival start or a
  slightly larger `+2s`/answer are the standing options.
- The daily-best line still shows only word count; decoding its stored `p` into a
  STAGE·LEVEL label (as the checkpoint/menu lines do) is small polish left undone.
- With the re-stage gate in, `refreshLangHud`'s remaining per-word work is all
  cheap text/rect updates — no known churn sites left in the battle strip.

## Auto-dev log - 20260724-1509 pass 1

Ninth active-development pass on Opus 4.8. Re-read all 10 source files (all pass
`node --check`) plus NOTES, and re-ran the data-integrity scan: all 25 word lists
are clean (0 duplicates / uppercase / whitespace / over-`MAX_TYPED` / missing-meta),
and the smallest pool (38) still exceeds max boss HP (27). The state machines the
prompt calls out — strike flags, festival/boss/menu exclusivity, death-save timing,
tick cadence — are all sound after eight prior passes, so **no fresh logic bug
surfaced this pass and none was invented**. Instead this pass closed the two
standing leftovers with real code and fixed a genuine correctness/quality nit in
the RNG. Three code commits + this log.

**Feature shipped**

1. **Richer daily leaderboard entry (closes the pass-7/8 decode leftover AND the
   pass-5 missing-wpm note).** `los_daily_<date>` stored only `{p, words}`, and the
   end-screen daily-best line showed a bare `N patterns` — so the seeded daily
   could never surface speed/score without a re-run, and its target didn't read
   like the normal-mode BEST line. The daily write now persists
   `{p, words, wpm, score}`, and the end screen decodes the stored `p` into
   `STAGE · <language>` (p = (stageIndex + lap) · 25 + langIndex; the stage index
   saturates at SURVIVAL and laps pile on beyond it, matching `showStage`), with
   `· N wpm` appended when present. `wpm` is optional so entries written by older
   builds still render. Decode math verified against three hand-computed cases
   (HARD/L18, SURVIVAL lap 0, SURVIVAL lap 2). MenuScene's compact daily label is
   left as word-count only to avoid overflow — the end screen is where the detail
   belongs.

**Quality / correctness**

2. **SHOP button anchored to BAG's rendered width so they can't overlap
   (960x540 layout, a fresh UI nit).** `bagBtn`/`shopBtn` sat at fixed `x=16`/`x=130`,
   but `[ BAG 12/12 ]` renders to ~x=133 at fontSize-15 monospace, so a two-digit
   bag count clipped into `[ SHOP ]`. `refreshBag()` (already called on every bag
   change) now sets `shopBtn.x = bagBtn.x + bagBtn.width + 14`, correct for any
   count and robust to future `INV_MAX` changes. No prior pass touched this row.

3. **Fair Fisher-Yates festival shuffle instead of the biased `sort` trick.**
   `startFestival` drew its 6-language pool with
   `LANGUAGES.slice().sort(() => this.rand() - 0.5)` — a comparator that isn't a
   consistent ordering, so the shuffle is non-uniform. Under the daily's *seeded*
   RNG that bias is deterministic, skewing which languages appear in the daily's
   festivals. Replaced with an in-place `shuffle()` helper (Fisher-Yates driven by
   `this.rand`), so the pool is now uniformly random and the daily stays fair.

**Leftover for next passes**

- Festival balance (entering at low time is dangerous) remains a deliberate-but-
  untuned playtest call — a small one-time clock cushion on festival start or a
  slightly larger `+2s`/answer are the standing options. Still a playtest call,
  not a code call, so left alone.
- Genuine fresh *bugs* are now exhausted across nine passes; future passes are
  best spent on tuning (needs playtests) or presentation polish (an itch capture
  showing the language road / a festival), not on hunting for logic defects that
  the earlier passes have already closed.

## Auto-dev log - 20260724-1509 pass 2

Tenth active-development pass on Opus 4.8. Re-read all 10 source files (all pass
`node --check`) plus the full NOTES history. Pass 9 declared logic bugs
"exhausted", so this pass hunted for the one class prior passes hadn't checked —
a UI element that *claims* something the scoring doesn't actually do — found and
fixed exactly that, then shipped a fresh skill-reward feature and a live-stat
readout. Three code commits + this log.

**Bug fixed**

1. **Combo score-multiplier was advertised but not applied outside normal mode
   — FIXED (fresh area: the readout-vs-scoring mismatch).** The COMBO readout
   prints "score ×2" (combo 5) / "score ×3" (combo 15) and the milestone
   spring-pop + chirp fire in every mode, but the multiplier was only ever
   folded into the *normal-level* scoring path. Boss hits (`w.length*15`) and
   both festival paths (`w.length*10`) paid flat points, so a player building a
   streak through a boss fight or a festival saw the game promise a ×2/×3 payout
   that never landed. Extracted the tier into a `comboMult()` helper (also reused
   by `refreshCombo`) and multiplied it into all four scoring sites, with a "×N"
   tag on the boss/festival float popups so the payout now reads truthfully.
   Combos require flawless play, so this rewards skill consistently rather than
   inflating everything.

**Features shipped**

2. **Perfect-level precision bonus.** The game is a typing test, yet clearing a
   whole language level without a single wrong pattern earned nothing extra. New
   `levelMistakes` counter tracks wrong patterns during *real* level play (boss
   and festival interstitials are excluded — they aren't the level being
   cleared), and a clean clear grants +5s, +10 credits and a stage/lap-scaled
   score bonus (`50 + 25·(stage+lap)`) on top of the normal level bonus. The
   payout is banked in `levelUp`; the celebration shows on the fully-visible
   level-clear road overlay ("★ PERFECT LEVEL — no mistakes!"), or as a float
   over the field when the cleared level rolls straight into a boss. Counter
   resets each level and after every boss so a fresh stage always starts clean.

3. **Live WPM readout in the status bar.** wpm only existed on the end screen;
   now the bottom-right status label appends "· N wpm" during a run, refreshed
   once per second inside the existing per-second timer gate (no new per-frame
   work) and using the same 15s-floor divisor as the end-screen headline so an
   early burst can't post an absurd rate. Placed in the status bar's spare
   right-side room, well clear of the left controls hint.

**Housekeeping**

- An untracked `blender/gen_items.py` (the item-texture generator, sibling to
  the existing `gen_chars.py` / `gen_backdrops.py`) was sitting in the tree and
  got picked up alongside commit 1; it's a legitimate part of the Blender
  pipeline, so it's kept rather than reverted.

**Leftover for next passes**

- Festival balance (entering at low time is dangerous) is still the standing
  deliberate-but-untuned playtest call — unchanged.
- With combos now paying out everywhere, a natural follow-up is surfacing the
  *best combo of the run* live (the end screen already shows max combo), or a
  small on-HUD combo-timer if a playtest finds streaks too easy to hold across
  level transitions (combo only breaks on a wrong pattern today).
- Presentation polish (an itch capture of the language road / a festival / a
  PERFECT-LEVEL banner) remains the highest-value non-code work left.

## Auto-dev log - 20260724-1558 pass 1

Eleventh active-development pass on Opus 4.8. Re-read all 10 source files (all
pass `node --check`) plus the full NOTES history, and confirmed the boss +
loot PNGs from the latest commit are all present (`assets/en_*_boss.png` ×6,
`assets/it_*.png` ×5), so the boss can't render a broken texture. Passes 9-10
declared genuine logic bugs exhausted, and re-reading the state machines
(strike flags, festival/boss/menu exclusivity, tick cadence, death-save) they
hold — so instead of inventing a "bug", this pass closed a real, unaddressed
*gap*: **the whole game is keyboard-driven, but every menu was pointer-only.**
Three focused commits + this log, all one cohesive theme (keyboard nav).

**Features shipped**

1. **Keyboard + main-menu route on the End screen.** The End screen was
   pointer-only and dead-ended on `[ RECOMPILE ]` (which *resumes* the run from
   the checkpoint) — from a finished run there was no way to reach the Daily or
   a fresh New Game without first resuming. Added a `[ MENU ]` button beside
   RECOMPILE (repositioned RECOMPILE to `cx-96`, MENU at `cx+104`, clear of the
   checkpoint/daily-best line at `cy+132`), a shared `recompile()`/`backToMenu()`
   pair bound to both pointer and keys, and a keydown handler: ENTER/SPACE
   recompiles, M/ESC returns to the menu. A dim hint line advertises the keys.
   Both handlers call `Sfx.unlock()` first (a keydown is a valid audio-unlock
   gesture) so restarting via keyboard keeps sound working.

2. **Keyboard controls on the main menu.** START/CONTINUE/DAILY were all
   click-only. Extracted `startNew` / `startContinue` / `startDaily` and bound
   both the existing pointer clicks and a new keydown handler: ENTER/SPACE runs
   the primary action (CONTINUE when a checkpoint exists — matching what the eye
   lands on — else NEW GAME), N forces a fresh run, D launches the daily. The
   first keypress also serves as the audio-unlock gesture. Button labels now
   advertise their key (`· ENTER` on CONTINUE, `· N` on NEW GAME, `· D` on
   DAILY, `[ PRESS ENTER OR CLICK ]` when there's no checkpoint), and I made
   sure the advertised key matches the actual binding (ENTER continues when a
   checkpoint exists, so NEW GAME reads `· N`, not `· ENTER`).

**Quality**

3. **Quit-to-menu from the pause screen (Q).** The last keyboard-nav gap: a
   paused run could only end by dying or refreshing the tab, so switching to the
   Daily or a fresh run mid-run meant losing the tab. Handled Q in `onKey`'s
   paused branch (before the `if (this.paused) return`) → new `quitToMenu()`
   that `scene.start('Menu')`s; the furthest section reached is already
   checkpointed on each clear, so CONTINUE still resumes. The scene-shutdown
   handler stops the (paused) music safely — `stopMusic` is null-timer-safe, and
   the next run's `startMusic` rebuilds from a null `Sfx.music`. Pause hint copy
   changed from "type + ENTER to fight the countdown" to "Q to quit to the menu".

**Notes on safety of the keyboard wiring**

- A single physical keydown dispatches once; `scene.start` tears down the old
  scene's listeners before the next scene registers its own, so no key cascades
  across scenes. Held-key OS repeat at most fires an extra harmless empty
  `submit()` in the freshly-started GameScene.

**Leftover for next passes**

- Festival balance (entering at low time is dangerous) is still the standing
  deliberate-but-untuned playtest call — a code change here needs a playtest, not
  a guess, so still left alone.
- Surfacing the run's *best combo* live on the HUD (end screen already shows it)
  and a small on-HUD combo timer remain the two most concrete unbuilt feel ideas.
- Presentation polish (an itch capture of the language road / a festival / the
  PERFECT-LEVEL banner) is still the highest-value non-code work left, plus the
  README's final checklist item (name + cover + screenshots on the itch page).

## Auto-dev log - 20260724-1611 pass 1

Twelfth active-development pass on Opus 4.8. Re-read all 10 source files (all
pass `node --check`) plus the full NOTES history. Rather than declare bugs
exhausted again, I traced the newest untested code path — the pass-1558
quit-to-menu-from-pause feature — through Phaser 3.90's actual scene-restart
semantics (read straight from lib/phaser.min.js) and found a real soft-lock the
last pass's music-only reasoning missed. Fixed it, then shipped the exact
best-combo HUD leftover and one combo-feel quality nit. Three code commits +
this log, all one theme (the combo readout + the pause-exit path).

**Bug fixed (1) — confirmed against the Phaser source, not guessed**

1. **Quit-to-menu from a paused run soft-locked the *next* run's timers.**
   `togglePause()` sets `this.time.paused = true`. Phaser reuses the scene's
   `Clock` across `scene.start` restarts, and — verified in phaser.min.js —
   `Clock.start()` (which fires on every restart) re-registers its PRE_UPDATE/
   UPDATE listeners but **never clears `paused`**; only the constructor does, on
   first boot. So `quitToMenu()`'s `scene.start('Menu')`, run while paused, left
   the reused GameScene clock paused on the following run. `update()` still
   drains `timeLeft` (delta-based), but every `this.time.delayedCall` stayed
   frozen: `battle.ulti`'s level-up completion callback never fires →
   `transitioning` sticks true → **hard soft-lock at the very first level-up**;
   plus the hint auto-clear and panel flash/shake resets. Fix: clear
   `this.time.paused` (and `this.tweens.timeScale`, for symmetry) in
   `quitToMenu()` before leaving. Note for future passes: `TweenManager.start()`
   *does* reset `timeScale`/`paused`, so tweens were never the problem — the
   asymmetry between the two managers is exactly what made this easy to miss.

**Feature shipped (1)**

2. **Live BEST COMBO readout on the HUD** (the standing pass-1558 leftover). A
   persistent `BEST COMBO N` line under the current-combo readout (top-right).
   Driven from `refreshCombo` right after `maxCombo` is bumped, self-gated on
   change so it never re-rasters on unchanged words. Survives level-ups, bosses
   and festivals, unlike `comboText`, which blanks whenever the live combo drops
   below 2 — so your record stays visible even after a break.

**Quality (1)**

3. **A wrong word that breaks a real streak (>=5) now says so.** Dropping a big
   combo was silent — identical red "not a pattern" line for a 2-streak or a
   20-streak. Appended `— combo ×N lost!` to the existing feedback when the
   broken combo was >=5 (the first score-multiplier tier), in both the normal
   and growth-festival wrong-word paths. One already-red message, no new
   objects; pure feedback (the combo already reset to 0 on any wrong word).

**Leftover for next passes**

- Festival low-time balance is still the standing deliberate-but-untuned
  playtest call — unchanged, still needs a play session not a guess.
- The other half of the pass-1558 combo idea — a small on-HUD *combo timer* —
  remains unbuilt on purpose: making combos decay on time is a real balance
  change (a playtest call), not a free feel win, so it stays parked with the
  festival tuning until someone can play it.
- Keyboard shortcuts for the in-run BAG/SHOP are tempting (the rest of the game
  is keyboard-first) but every plain letter collides with word input; only Tab
  is free, and wiring it needs `addCapture` + iframe-focus care — worth a
  dedicated pass, not a drive-by.
- Presentation polish (itch captures of the road / a festival / the PERFECT
  banner) + the README's final checklist item remain the top non-code work.

## Auto-dev log - 20260724-1625 pass 1

Thirteenth active-development pass on Opus 4.8. Re-read all 10 source files (all
pass `node --check`) plus the full NOTES history, and re-ran the data-integrity
scan from a throwaway Node harness: all 25 word lists are clean — 0 duplicates /
uppercase / whitespace / over-`MAX_TYPED` / missing-meta / missing-target — so
the DART duplicate an earlier pass found has not regressed and no new one crept
in. As passes 9-12 found, the state machines the prompt calls out (strike flags,
festival/boss/menu exclusivity, tick cadence, death-save, the pause-exit clock)
are sound, so **no fresh logic bug surfaced and none was invented.** Instead this
pass shipped the oldest recorded-but-unbuilt feature, cut a genuine per-frame
render cost no prior perf pass had reached, and fixed one real legacy-data nit.
Three code commits + this log.

**Quality / perf (fresh area)**

1. **Festival banner clock re-rastered its text every frame — FIXED.** During a
   festival, `update()` called `festival.clock.setText('⏱ clock runs — festival
   ends in Ns')` on *every* frame (~60/sec), but the shown `Math.ceil(timeLeft)`
   only steps once per second — so ~59 of every 60 calls re-rendered an identical
   glyph texture for the whole festival. This is the exact per-frame `setText`
   re-raster class earlier passes gated for the big countdown timer (update:1459)
   and the in-menu clock (update:1468), but the festival banner — added when
   festivals stopped freezing the clock (pass 20260723-2346) — was never covered.
   Now a `clockSec` field on the festival object tracks the last shown second and
   the `setText` fires only when it changes. Pure render-cost cut; the banner
   reads identically.

**Feature shipped**

2. **Shareable result card + COPY on the End screen — the oldest recorded-but-
   unbuilt idea (auto-review pass 1 #4, ~2026-07-23).** The End screen reported a
   run's stats but offered no way to share them. Added a compact one-line summary
   (`Life of Software — STAGE · language (L n/25) · N pts · N wpm · N% acc · xN
   combo`, prefixed `DAILY <date>` for daily runs) in a framed box, plus a
   `[ COPY RESULT ]` button and a **C** key that writes it to the clipboard. The
   write is fully guarded (`navigator.clipboard?.writeText` in a try/catch with a
   `.then/.catch`) and the button reports `COPIED ✓` or `COPY BLOCKED — screenshot
   it`, because a sandboxed itch iframe can refuse clipboard access — and the
   string stays on screen either way, so it always reads/screenshots. The daily
   runs one shared seed, so pasting a result into the itch comments turns it into
   a leaderboard race, and comment activity during voting drives an entry's
   visibility. The End-screen key hint now reads `ENTER recompile · M menu · C
   copy result`.

**Fix (legacy-data robustness)**

3. **Menu BEST line could render `undefined wpm`.** The `BEST:` line appended
   `best.wpm` unconditionally while the adjacent `best.score` was already guarded
   `(best.score ? … : '')`, so a `los_best` written by a pre-wpm build (or any
   partial entry lingering in a judge's storage) printed a literal
   `· undefined wpm`. Guarded `best.wpm` the same way, so the line degrades
   cleanly on old data. Normal current runs are unaffected (they always store wpm).

**Leftover for next passes**

- Festival low-time balance (entering at low time is dangerous) is still the
  standing deliberate-but-untuned playtest call — unchanged, needs a play session.
- With the result card landed, the natural follow-up is a per-run comparison in
  the shared string (e.g. `▲ new PB` when this run beat the stored best) so a
  pasted comment reads as an improvement, not just a raw stat line.
- In-run BAG/SHOP keyboard shortcuts remain parked (every plain letter collides
  with word input; only Tab is free and needs `addCapture` + iframe-focus care).
- Presentation polish (itch captures of the road / a festival / the PERFECT
  banner) + the README's final checklist item remain the top non-code work.

## Auto-dev log - 20260724-review pass 1

Robustness fix in a fresh area (the boss render path). The game's stated safety
net — "all art is code-drawn; makeTextures() skips any key already loaded, so
every sprite degrades to a code-drawn placeholder if its PNG is missing"
(battle.js:8) — had exactly one hole: the **boss** sprite. `Battle.makeTextures`
code-draws `en_ork`…`en_demon`, but nothing draws `en_<type>_boss`; that key
exists only because `BootScene` loads `assets/en_<type>_boss.png` (BootScene.js:36).
`spawnBoss` used `'en_' + type + '_boss'` unconditionally, so a single flaky boss
PNG (itch CDN hiccup / cache miss) would render the boss as Phaser's green
`__MISSING` texture while every other sprite survived. Fixed at the point of use:
`spawnBoss` now falls back to the always-code-drawn base monster texture
(`en_<type>`) when the boss key is absent — the existing 2.6x scale still reads as
a boss. Two-line guard, no per-monster crown redraw, so zero risk to the shipped
art path (the PNG is used whenever it loads). `node --check src/battle.js` passes.
This closes the last gap in the "every sprite degrades gracefully" invariant the
codebase claims but did not fully honor.

**Leftover for next passes** — unchanged from prior logs: festival low-time
balance still needs a play session; `▲ new PB` comparison in the shareable result
string; in-run BAG/SHOP keyboard shortcuts (only Tab is free); itch presentation
captures + README final checklist.

## Auto-dev log - 20260724-1653 pass 1

Re-read all 10 source files (all pass `node --check`) plus the full NOTES
history. Consistent with passes 9-14, the state machines the prompt calls out —
strike flags, festival/boss/menu exclusivity, tick cadence, death-save timing,
the pause-exit clock — are all sound, and re-tracing them surfaced no fresh
logic bug, so **none was invented.** Also confirmed a non-bug worth recording:
`finish()` is only ever called with `win=false` (the game is endless — survival
laps never terminate), so EndScene's "BUILD SUCCESSFUL / exit code 0" branch is
intentional dead-code headroom, not a reachable state. This pass shipped the
oldest recorded-but-unbuilt leftover and cut one genuine per-keystroke
allocation in a fresh area. Two code commits + this log.

**Feature shipped**

1. **Shareable result string now flags a NEW PB / NEW DAILY BEST — the
   recorded-but-unbuilt leftover from the last two logs.** The End-screen result
   card reported raw stats but never signalled that the run was an improvement,
   so a line pasted into the itch comments read identically whether you'd just
   set a personal best or posted your worst attempt. It now appends `· ▲ NEW PB`
   (or `· ▲ NEW DAILY BEST` on daily runs) when the run beat the stored best,
   reusing the same `beats` predicate that drives the on-screen NEW PERSONAL BEST
   banner so the two always agree, and adding a parallel `beatDaily` check for
   the per-day key. Gated on there being a PRIOR best to beat (`beats && best`)
   so a first-ever run — which has nothing to improve on — doesn't tag itself
   "NEW PB" in a public comment. Turns a pasted daily result into a visible
   race, which is the whole point of the shared seed during voting.

**Quality / perf (fresh area)**

2. **Growth-festival name lookup cached instead of rebuilt per keystroke.**
   `typedColor()` runs on every keystroke via `refreshInput()`, and its
   growth-festival branch `flatMap`'d a fresh 12-entry array (each pooled
   language's name + abbr, lowercased) every time just to color-check the input.
   The pool is fixed for the festival's lifetime, so the array is now built once
   at `startFestival` (`festival.names`) and read from there — removing a
   per-keystroke allocation on the game's fastest input path. No prior pass
   touched `typedColor`, so this is a genuinely fresh churn site, in the same
   spirit as the `floatText` / `burstFx` / `deathFx` pooling earlier passes did.

**Leftover for next passes** — genuine fresh *logic bugs* are exhausted across
fifteen passes; the remaining value is tuning and presentation, not defect
hunting. Standing items: festival low-time balance (needs a play session, not a
code guess); in-run BAG/SHOP keyboard shortcuts (only Tab is free and needs
`addCapture` + iframe-focus care — still worth a dedicated pass, not a drive-by);
itch presentation captures (language road / a festival / the PERFECT-LEVEL
banner) + the README's final checklist item (name + cover + screenshots).

## Auto-dev log - 20260724-1720 pass 1

Re-read all 10 source files (all pass `node --check`) plus the full NOTES
history. Consistent with prior passes, the state machines — strike flags,
festival/boss/menu exclusivity, tick cadence, death-save timing — re-traced
clean, so no logic bug was invented. Instead this pass extended an invariant the
codebase *claims but did not fully honor*, shipped the oldest standing leftover
as a real feature, and cut a genuine per-word re-raster in a fresh area. Three
code commits + this log.

**Robustness fix (fresh area — full-screen art)**

1. **`scene_<type>`, `menu_splash` and `pause_panel` now degrade gracefully
   instead of painting Phaser's green `__MISSING` fill.** Last pass closed the
   boss-sprite hole in the "every sprite degrades to a code-drawn placeholder if
   its PNG is missing" invariant — but three PNGs were still unguarded, and
   worse, they're *full-screen*: `Battle.makeTextures` code-draws the battle-strip
   `bg_<type>` textures as a fallback, yet the full-screen `scene_<type>`
   atmosphere, the menu splash and the pause window have **no** code fallback.
   A single flaky itch-CDN 404 / cache miss on `scene_ork.png` would render a
   green screen behind the entire play field — a far worse failure than one green
   boss. Fixed at the point of use: a new `applySceneBg()` hides the backdrop
   layer when its PNG is absent (the dark editor `backgroundColor` shows through);
   the pause overlay drops its window image (dim + PAUSED text still carry it);
   the menu skips its splash (scrim + bg remain). No new art, and the PNGs are
   used whenever they load. This actually closes the invariant's last gaps.

**Feature shipped (the standing "Tab is free" leftover)**

2. **TAB opens/closes the BAG mid-run.** For a keyboard-first typing game, the
   only in-run route to the inventory was the mouse — every plain letter collides
   with word input, so the parked idea (recorded across several logs) was to use
   the one free key, Tab. Now `TAB` toggles the BAG, so a player can pop a
   potion/armor or salvage loot without leaving the keys. Captured via
   `addCapture('TAB')` so it can't tab focus out of the itch iframe, and routed
   through the existing `toggleMenu()` so it inherits every guard (no-op while
   paused / transitioning / in a festival) and closes the bag — or swaps from the
   shop — on the next press. Surfaced in the status-bar hint (`· TAB bag`).

**Quality / perf (fresh churn site)**

3. **Stopped re-rasterizing the LEVEL/STAGE HUD labels on every correct word.**
   `refreshLangHud()` runs on every landed word, but its LEVEL/STAGE labels and
   the progress bar's fill color are constant for the whole level — yet it re-ran
   `setText`/`setColor` (each re-rasters the glyph texture) and `HexStringToColor`
   (an alloc + string parse) each time. Gated the label rebuild on a
   level/stage/lap key (the exact per-word re-raster gate the timer, festival
   clock and best-combo readouts already use); only the score-driven progress-bar
   *width* stays ungated. The redundant per-word `setMusicTempo` call is gated on
   its computed bpm too. The label key is invalidated in `startFestival` (which
   clobbers `langText`), so `endFestival` rebuilds the real labels; the boss
   branch is self-correcting because the stage always advances on boss exit. No
   prior pass touched these label sets — a genuinely fresh churn site, same
   spirit as the earlier timer/clock/badge gates.

**Leftover for next passes** — unchanged standing items: festival low-time
balance (needs a play session, not a code guess); in-run *SHOP* keyboard access
(now that BAG has TAB, SHOP could take a second captured key — but there's no
other obviously-free one, so it's parked); itch presentation captures (language
road / a festival / the PERFECT-LEVEL banner) + the README's final checklist item
(name + cover + screenshots). With the `scene_`/`splash`/`pause` fallbacks in,
the "every sprite degrades gracefully" invariant is now honored end to end.

## Auto-dev log - 20260724-1737 pass 1

Re-read all 10 source files (all pass `node --check`) plus the full NOTES history.
Consistent with the last several passes, the state machines the prompt calls out
— strike flags, festival/boss/menu exclusivity, tick cadence, death-save timing,
the pause-exit clock, checkpoint monotonicity — re-traced clean, and the
"every sprite degrades to a code-drawn placeholder if its PNG is missing"
invariant is now honored end to end (boss / scene_ / splash / pause all guarded
in prior passes). So **no fresh logic bug surfaced and none was invented.** This
pass instead shipped the oldest standing leftover as a real feature, cut a
genuine per-word re-raster in a fresh churn site no perf pass had reached, and
added a read-only quality touch. Three code commits + this log.

**Feature shipped (the standing "in-run SHOP keyboard access" leftover)**

1. **TAB now cycles the in-run panels: closed → BAG → SHOP → closed.** For a
   keyboard-first typing game the SHOP still had no keyboard route — every plain
   letter collides with word input, and TAB (the one free, iframe-captured key)
   only toggled the BAG (from the shop it swapped to the bag, so the shop could
   only ever be *opened* by mouse). TAB now cycles through both panels, giving the
   shop the keyboard access recorded-but-parked across several logs. The mouse
   `[BAG]`/`[SHOP]` buttons still open each panel directly; `cycleMenu()` shares
   `toggleMenu()`'s guards (no-op while over/dying/transitioning/paused/in a
   festival) so the keyboard route inherits every safety the mouse buttons have.
   Status-bar hint updated `TAB bag` → `TAB bag/shop`.

**Quality / perf (fresh churn site — refreshCredits)**

2. **Gated refreshCredits()'s three setText re-rasters.** `refreshCredits()` runs
   on every landed word (the fastest scoring path), but `Text.setText` re-rasters
   the glyph texture on every call — and the hint label (`[ HINT -20 ]`) and the
   effect line (empty when no buff is up) are constant across most words, so ~all
   of those per-word calls re-rendered an identical texture. Gated the
   credit/hint/effect `setText` calls on their computed strings so only genuine
   changes re-raster — the exact per-word gate the timer, HUD labels, festival
   clock and best-combo readouts already use. No prior perf pass touched
   `refreshCredits`, so this is a genuinely fresh churn site. `setAlpha` only
   tints (no re-raster) so it stays ungated; the credit number caps at
   `CREDIT_MAX`, so gating it also stops the capped-100/100 tail from re-rastering.

**Quality (read-only)**

3. **The ESC pause overlay now shows this run's live stats.** It showed only
   PAUSED + the resume/quit hint; it now surfaces SCORE · WPM · accuracy · best
   combo, snapshotted in `togglePause()` each time you pause, using the same
   15s-floor wpm divisor and accuracy formula the End screen uses so the pause
   board and the final report always agree. Zero balance impact — a mid-run
   breather now doubles as a scoreboard without leaving the field.

**Leftover for next passes** — unchanged standing items: festival low-time
balance (still a deliberate-but-untuned playtest call, needs a play session not a
code guess); itch presentation captures (language road / a festival / the
PERFECT-LEVEL banner) + the README's final checklist item (name + cover +
screenshots) remain the top non-code work. With SHOP now on TAB, in-run panel
access is complete on the keyboard.

## Auto-dev log - 20260724-1855 pass 1

Re-read all 10 source files (all pass `node --check`) plus the full NOTES
history. Consistent with the last several passes, the state machines the prompt
calls out — strike flags, festival/boss/menu exclusivity, tick cadence,
death-save timing, the pause-exit clock reset, checkpoint monotonicity, the
daily-best `p` decode, bag-full purchase blocking — all re-traced clean, and the
"every sprite degrades to a code-drawn placeholder if its PNG is missing"
invariant is honored end to end. So **no fresh logic bug surfaced and none was
invented.** This pass cut a genuine per-key re-raster in the one churn site every
prior perf pass had skipped. One code commit + this log.

**Quality / perf (fresh churn site — refreshInput, the fastest path)**

1. **Gated `refreshInput()`'s per-keystroke `setColor` re-raster.** Every earlier
   perf pass gated the per-*landed-word* readouts (timer, HUD labels, credits,
   badges, best-combo, festival clock), but `refreshInput()` — which fires on
   **every keystroke** (type / backspace / submit), a strictly faster path than
   "every landed word" — was never touched. It ran
   `setText(this.typed).setColor(this.typedColor())` each key; `setText` must run
   (the shown text genuinely changes every key), but Phaser's `Text.setColor`
   re-renders the glyph canvas even when the color is unchanged. The input's
   validity color only flips at word boundaries (valid-prefix ↔ invalid ↔
   complete), so on the vast majority of keystrokes the color is identical and the
   second re-raster was pure waste. Gated the `setColor` on the computed color
   (cached in `this._inputColor`, initialized alongside the other gate caches in
   `create()`) — the exact per-word re-raster gate the rest of the HUD already
   uses. Most keystrokes now re-raster once (the `setText`) instead of twice; only
   a real color change pays the second. Zero behavior change — the final color
   shown is identical, and the cache stays in sync because nothing else touches
   `inputText`'s color.

**Leftover for next passes** — unchanged standing items: festival low-time
balance (a deliberate-but-untuned playtest call, needs a play session not a code
guess); itch presentation captures (language road / a festival / the
PERFECT-LEVEL banner) + the README's final checklist item (name + cover +
screenshots) remain the top non-code work. The per-word/per-key re-raster gates
are now applied across the whole HUD — timer, labels, credits, badges,
best-combo, festival clock, and the input line — so that vein of perf work is
essentially exhausted; the remaining wins are gameplay-feel and presentation, not
churn-cutting.

## Auto-dev log - 20260724-review pass 1

Re-read all 10 source files (all pass `node --check`) plus the full NOTES
history. As in the last several passes the flagged state machines re-traced
clean — strike self-heal, festival/boss/menu exclusivity, tick cadence,
death-save timing, the pause-exit `this.time.paused` reset, checkpoint
monotonicity, the daily-best `p` decode (matches `saveCheckpoint`'s
`(stageIndex+lap)*N+langIndex`), bag-full purchase blocking, and the
"missing PNG → code-drawn placeholder" degradation (boss / scene_ / splash /
pause / title all guarded). No crash or deadlock surfaced. This pass instead
fixed one genuine **metric-consistency** defect that had survived every prior
pass, and I deliberately did **not** invent filler around it. One code commit
+ this log.

**Fix — accuracy no longer docks you for re-typing an already-cleared pattern**

`submit()` counts every non-empty submission as an attempt (`submitsTotal++`,
GameScene.js:439) before adjudicating it. A word you already cleared this
level/boss/festival lands in the `activeFound.has(w)` branch, which the rest of
the game treats as a **no-op, not a mistake** — soft `Sfx.blip()` (not the wrong
buzzer), no `combo = 0`, no `levelMistakes++`. The one place that contradicted
that classification was the accuracy stat: the attempt stayed counted with no
matching `submitsOk`, so a genuine duplicate silently dented accuracy — a
headline number on the End screen, the daily entry, and the shareable result
string.

This is the same docking **pass-4** (NOTES `20260723 pass 4`, ~line 280) called
out and removed for the *false* "already typed" rejections it fixed (the
`sw`-festival shared-`used` collision), which established the project's stance
that an already-typed event must not touch accuracy. This pass completes that
stance for the real-duplicate case: `this.submitsTotal--` in the already-typed
branch so the attempt nets to zero. Verified against the two readers
(`finish()` and `togglePause()`'s pause board) — both compute
`submitsTotal ? round(100*submitsOk/submitsTotal) : 100`, so they stay in
agreement. The growth-festival path returns *before* this branch, so its count
is untouched; wrong words still count (real mistakes). Zero balance impact —
time/score/credits/difficulty untouched, and ranking sorts on
progress → words → score, never accuracy. `node --check` passes.

**Leftover for next passes** — unchanged standing items: festival low-time
balance (a deliberate-but-untuned playtest call, needs a play session not a code
guess); itch presentation captures (language road / a festival / the
PERFECT-LEVEL banner) + the README's final checklist item (name + cover +
screenshots) remain the top non-code work. One remaining metric wrinkle noted
but *not* changed this pass (it's a genuine design call, not a defect): the
festival credit popup prints the flat `+15 credits` even when a sword multiplier
is live, so it understates the real (capped-at-100) gain — the effect readout
already shows the `×N credits` buff, so it's informative, just not summed in the
popup. Worth a design decision before touching.

## Auto-dev log - 20260724-review pass 2

Re-read all 10 source files (all pass `node --check`) plus the full NOTES
history. As in the last several passes the flagged state machines re-traced
clean — strike self-heal (the ulti/spawnBoss stale-flag path), festival/boss/
menu exclusivity, tick cadence, death-save timing, the pause-exit `time.paused`
reset, checkpoint monotonicity, the daily-best `p` decode, bag-full purchase
blocking, and the "missing PNG → code-drawn placeholder" degradation. No crash
or deadlock surfaced and none was invented. This pass fixed one genuine
correctness+perf defect in a fresh site (the continuous decor emitters), shipped
a small self-contained feature (a typing grade), and fixed a real presentation
overflow on the share card. Three code commits + this log.

**Fix — demon fire-fountain emitters keep running when frozen/hidden**

The demon stage's fire fountains (`Battle.decor`) are raw Phaser particle
emitters advanced by the scene's core update loop — NOT scene tweens or timers.
So two "everything stops now" paths silently missed them:
- **ESC pause.** `togglePause()` freezes `this.time.paused` + `tweens.timeScale
  = 0`, but the fountains kept spouting behind the frozen pause overlay — a
  visible "paused but fire still animating" tell.
- **Festivals.** `startFestival` calls `battle.setVisible(false)`, which only
  hid the emitters' rendering; they kept spawning particles unseen every frame
  of every festival on the demon/survival stage (wasted per-frame work).

Fixed at the source: `setVisible` now toggles the emitters' `active` alongside
`visible`, and a new `Battle.setDecorActive(on)` (called from `togglePause`)
halts/resumes them for the pause — `setActive(false)` skips their preUpdate so
existing particles hang in place (reading as paused) and none spawn.
`setDecorActive` gates *resume* on the strip's own visibility (`this.bg.visible`)
so a pause taken mid-festival can't bring them back emitting while still hidden.
No-op on every non-demon stage (`decor` is empty). This is a genuinely fresh
churn site — every prior perf pass gated setText/setColor re-rasters on the HUD;
none touched the emitter lifecycle. `node --check` passes.

**Feature — typing grade (S/A/B/C/D) on the End screen + share string**

Each run now ends with a single-letter skill verdict, a report-card stamp in the
End screen's empty left margin (S gold → D red, popping in on `Back.easeOut` so
it reads at a glance and on a screenshot). It's derived from the two normalized
metrics, speed and accuracy, and every rank needs BOTH — you can't S-rank on raw
wpm with sloppy accuracy nor on perfect accuracy while crawling (S 55/96, A
42/90, B 28/82, C 16/70, else D). Folded into the shareable result string
(`... · S-rank`) so a pasted itch comment carries the verdict. Purely cosmetic —
it never feeds ranking, the PB, the checkpoint or balance, so the thresholds are
a free tuning knob (a jam-feel guess; refine on a real play session, same status
as the standing festival-balance leftover). Verified the tiers behave across a
grid of wpm/acc pairs.

**Fix — shareable result box hugs its text (long results no longer spill)**

The share card's frame was a fixed width (`screen - 120`), but the string length
varies a lot: a daily run with a long language name, a NEW DAILY BEST tag and now
the grade rank is far wider than a short early run and overflowed the box toward
the screen edges. Now the text is built first, its font stepped down (12→9) until
it fits the screen, then the frame is sized to hug the actual text width (capped
to the screen); the text's depth is raised so it stays above the now-later frame.

**Leftover for next passes** — unchanged standing items: festival low-time
balance and the NEW grade thresholds are both deliberate-but-untuned playtest
calls (cosmetic for the grade, so low-risk); itch presentation captures (the
language road / a festival / the PERFECT-LEVEL banner / the new grade stamp) +
the README's final checklist item (name + cover + screenshots) remain the top
non-code work. The festival credit popup still prints the flat `+15 credits`
even under a live sword multiplier (a design call, not a defect — the effect
readout already shows the `×N` buff).

## Auto-dev log - 20260724-review pass 3

Read the whole game again (index.html, all of src/, languages.js, README, and
this NOTES history). Traced the full state machine for a fresh crash/deadlock:
pause ↔ menu ↔ festival ↔ boss ↔ death, the strike-flag self-heal, the once/sec
timer/HUD gates, checkpoint monotonicity, the daily seed + PB paths, boss-pool
starvation vs the smallest word list (Lua 38 words vs hp cap 27 — safe), and the
`this.lang === undefined` window while `langIndex` sits at the post-final index
(never dereferenced — the boss/activeLang getters cover it). No new deadlock or
crash surfaced and none was invented; after ~20 passes that surface is genuinely
mined out. So this pass went after a hidden mechanic and core-loop feel instead.
Verified no duplicate words in any of the 25 language lists. Two code commits +
this log.

**Feature — live PERFECT-pace indicator during a level**

The perfect-clear bonus (zero wrong patterns in a language level → +time/score/
credits at `levelUp`, scaling with stage/lap) was completely invisible until the
level-clear screen — players had no idea a streak was even in play. Now a green
`◆ PERFECT` tag in the left margin (under the bag/shop row) lights up once you've
landed a word and stays lit while the level is still clean, and flashes red
`✗ PERFECT LOST` the instant a wrong pattern breaks it (one-shot; a mistake
before any correct word doesn't false-fire, since there was no streak to lose).
Driven by `refreshPerfect()`, folded into the per-word `refreshLangHud` tail and
self-gated on the computed on/idle state so it re-rasters only on a real change —
the same setText gate the timer / HUD labels / credits readouts already use.
Boss fights and festivals are interstitials, not the language level being
cleared, so they hard-blank it via `blankPerfect()` (their `refreshLangHud`
paths take the early return and never run the normal per-word refresh). Makes
the precision mechanic — the whole point of a typing game — legible during play.

**Feel — pulse the countdown on time-gain + backspace keystroke sound**

Two small touches to the core loop:
- The big countdown never reacted to the thing the whole game is about: every
  correct word buys seconds. Added `pulseTimer()` — a quick scale-pop on the
  timer — called from `celebrate()` (the shared success path for normal / boss /
  festival / growth words), so all four paths pulse from one place. Skipped while
  low-time, since `update()` already drives a per-frame scale/tremble on the
  timer under 10s and a tween there would fight it. Cheap transform, no re-raster.
- Backspace was silent while forward typing chirps (`Sfx.type`), which reads as
  an unresponsive delete. Gave it its own softer, lower tick (`Sfx.back`, 300Hz),
  and only when there's actually something to delete — which also skips a
  redundant `refreshInput` on an already-empty line.

**Leftover for next passes** — unchanged standing items: festival low-time
balance and the grade thresholds remain deliberate-but-untuned playtest calls;
the live PERFECT tag's exact wording/placement is a fresh cosmetic tuning knob
(same low-risk status). Itch presentation captures (the language road / a
festival / the PERFECT-LEVEL banner / the grade stamp / now the live PERFECT
tag) + the README's final checklist item (name + cover + screenshots) remain the
top non-code work. The festival credit popup still prints the flat `+15 credits`
under a live sword multiplier (a design call — the effect readout shows the ×N).

## Auto-dev log - 20260724-review pass 4

Re-read the whole game (index.html, all of src/, languages.js, README, and this
NOTES history). As in the last several passes the flagged state machines re-traced
clean — pause ↔ menu ↔ festival ↔ boss ↔ death, the strike-flag self-heal, the
once/sec timer/HUD gates, checkpoint monotonicity, the daily seed + PB paths, the
bag-full purchase block, and the "missing PNG → code-drawn placeholder"
degradation — so no crash/deadlock surfaced and none was invented. But re-reading
the live PERFECT indicator shipped in pass 3 (its own log flagged the tag's exact
behaviour as a fresh, lightly-tested knob) turned up one genuine **feel defect** in
it, which this pass fixed, plus a matching live-readout gap in a fresh site. Two
code commits + this log.

**Fix — the "✗ PERFECT LOST" flash is no longer wiped by the next correct word**

The break flash is meant to play a one-shot ~1.3s fade (150ms pop, then a 900ms
hold + 400ms fade). But `refreshPerfect()` also runs on every landed word via
`refreshLangHud`'s tail, and after a mistake the computed state moves `off → idle`
— so the very next correct word ran `killTweensOf(perfectText)` + `setText('')`,
killing the flash's own fade tween and blanking the text. On a fast typing game the
next word almost always lands inside that 1.3s window, so the flash the last pass
shipped was routinely cut short — the exact stacked-/killed-tween class as the
earlier feedback/shake/hint-clear fixes, but in the *new* code.

Made `'off'` terminal for the level: once a mistake breaks the pace a perfect clear
is impossible this level, so `refreshPerfect()` now early-returns while `off` — the
flash plays out untouched and the tag can't relight green mid-level (both correct).
`levelUp()` re-arms it for the next level via `blankPerfect()` (the one normal-play
path that starts a new language level; boss/festival already blank it), so the
indicator still works every subsequent level. Verified the four transitions: fresh
level → first word lights green; mistake → flash survives to completion; more
correct words → tag stays blanked (no relight, no re-wipe); next level → armed
again. The early-return also trims the per-word `killTweensOf`+`setText` the broken
state used to run each word. `node --check` passes.

**Quality — live accuracy alongside WPM in the status bar (fresh readout site)**

The bottom-right status bar surfaced live WPM once you were typing, but accuracy —
the other half of a typing game's skill readout — only appeared on the pause board
or the End screen. Appended it to the same once/sec status update, using the exact
15s-floor wpm divisor and `100*ok/total` accuracy formula the End headline and the
pause board already use, so the three readouts can never disagree. Gated inside the
existing once/sec `setText` block, so it adds no per-frame work — the same
once/sec discipline every other live readout uses.

**Leftover for next passes** — unchanged standing items: festival low-time balance
and the grade thresholds remain deliberate-but-untuned playtest calls; itch
presentation captures (the language road / a festival / the PERFECT-LEVEL banner /
the grade stamp / the live PERFECT tag) + the README's final checklist item (name
+ cover + screenshots) remain the top non-code work. The festival credit popup
still prints the flat `+15 credits` under a live sword multiplier (a design call —
the effect readout shows the ×N). Genuine fresh logic bugs remain mined out after
~20 passes; the surviving value is presentation and playtest tuning, not defect
hunting — but this pass shows the *newly-added* features are still worth
re-auditing for feel defects even when the old state machines are clean.

## Auto-dev log - 20260724-review pass 5

Re-read the whole game end to end (index.html, all of src/, languages.js, README
and this NOTES history). `node --check` clean on all ten JS files. As in the last
several passes the flagged state machines re-traced clean — pause ↔ menu ↔
festival ↔ boss ↔ death, the strike-flag self-heal, the once/sec timer/HUD/status
gates, the pass-4 terminal-'off' PERFECT logic, checkpoint monotonicity + the p→
STAGE·language decode on both End sites, the daily seed/PB split, the bag-full
purchase block, and the "missing PNG → code-drawn/degraded" fallbacks. I also
re-checked the boss-HP-vs-pool starve math (max boss HP 27 at Survival, smallest
word pool ~38, so it can't starve) and the accuracy bookkeeping (empty submits and
genuine duplicates both correctly excluded). No crash/deadlock surfaced and I did
not invent one — after ~20 passes the genuine logic bugs are mined out. So this
pass is a single, self-contained FEEL feature, committed on its own.

**Feel — green edge pulse when you buy back a big chunk of the clock**

The countdown had a red screen-edge `warnFrame` that ramps up as time runs out
(the tension side of "Count Down"), but nothing marked the *opposite* beat —
pushing the clock back. Added `flashGain()`, a one-shot green edge pulse that is
the exact symmetric counterpart to the red frame, fired at the three LIVE-field
moments a big refill actually lands: `levelUp()` (+10s, +5s on a perfect),
potion use in `useItem()` (+10..60s), and the armor death-save in `update()`
(snatched back from 0 — the biggest relief beat there is). It sits at depth 7,
just UNDER the red frame (depth 8), so a gain taken while still inside the red
zone reads as *escaping* it instead of hiding it.

Deliberately NOT fired on: the per-word +1.5s/+2s gains (too small and far too
frequent — they already have the timer scale-pop `pulseTimer()` + the floating
"+Ns" readout), and the boss-win `BOSS_WIN_TIME` cushion (that plays under the
full-screen depth-20 stage overlay, where a depth-7 pulse would never be seen —
so wiring it would be dead code). One always-on rectangle, alpha driven by a
single tween, so it costs nothing when idle; `killTweensOf` first means a potion
used right after a level-up restarts the pulse cleanly rather than stacking fades
that cut it short — the same one-tween-at-a-time discipline the feedback / shake /
hint-clear paths already use. `node --check` passes.

**Leftover for next passes** — unchanged standing items: festival low-time balance
and the grade thresholds remain deliberate-but-untuned playtest calls; the itch
presentation captures (the language road / a festival / the PERFECT-LEVEL banner /
the grade stamp / the live PERFECT tag / now the green gain pulse) + the README's
final checklist item (name + cover + screenshots) remain the top non-code work.
The festival credit popup still prints the flat `+15 credits` under a live sword
multiplier (a design call — the effect readout shows the ×N). As pass 4 noted, the
surviving value is presentation and playtest tuning plus re-auditing newly-added
juice, not defect hunting — this pass's green pulse is itself the kind of small
feel touch worth a feel-defect re-check next pass (its interaction with the red
frame and the level-up ulti animation is the thing to eyeball on a real playthrough).

## Auto-dev log - 20260724-review pass 6

Read the whole game end to end again (index.html, all of src/, languages.js,
README and this NOTES history). `node --check` clean on all ten JS files. As in
the last several passes the flagged state machines re-traced clean — pause ↔
menu ↔ festival ↔ boss ↔ death, the strike-flag self-heal, the once/sec timer/
HUD/status gates, the pass-4 terminal-'off' PERFECT logic, checkpoint
monotonicity + the p→STAGE·language decode on both End sites, the daily seed/PB
split, the bag-full purchase block, and the "missing PNG → code-drawn/degraded"
fallbacks. **No fresh logic bug surfaced and — per the discipline this project
established — none was invented.** After ~25 passes the genuine defect surface is
mined out; the surviving value is fresh features, feel and presentation. This
pass shipped two small self-contained features and one readability touch, each
committed on its own.

**Feature — "time survived" run stat (End screen + share card + pause board)**

A game literally themed on a countdown never reported how long you held the clock
off zero — the most natural survival headline it could have. `finish()` now
passes the active-play elapsed to EndScene as `time` (the same `this.elapsed`
clock the wpm divisor uses, so it counts time actually SPENT racing the
countdown — paused/transition time excluded), formatted `M:SS`. Surfaced in the
End stats line (`... · survived 3:42`), folded into the shareable result string
so a pasted itch comment carries it (leaderboard flavour), and added to the pause
board so the live/pause/End readouts stay consistent — the same three-readouts-
must-agree discipline the wpm/accuracy work followed. Landmine avoided: stored as
`this.survived` in EndScene, **not** `this.time` — that name is Phaser.Scene's
Clock, and clobbering it would break every `this.time.*` the scene machinery
makes. `node --check` passes.

**Feature — M toggles mute on the pause screen (keyboard-first, no mouse trip)**

The only in-run sound control was the mouse-only settings gear — off-theme for an
all-keyboard typing game, where muting mid-run meant leaving the keys. The pause
overlay now toggles sound with **M** and shows the live `SOUND: ON/OFF` state in
its key legend (`refreshPauseHint()`, rebuilt on pause-open in case the gear
flipped it, and on each press). Key choice is collision-safe: plain letters are
word-input *only when not paused* (onKey's paused branch returns before the
character path), so M can never eat a keystroke during play. `Sfx.unlock()` first
so the very first toggle has an audio context to act on. `node --check` passes.

**Feel — amber warning band on the countdown (11-20s), before the red zone**

The big timer only reacted at `<=10s` (red + per-frame scale-pulse), so falling
behind gave no cue until it was already critical. Added a middle **amber** band
(11..20s) that recolors the countdown to a warning yellow — an earlier "you're
losing the race" read that suits the Count Down theme. Kept as a pure recolor,
gated on a 3-state band (`normal`/`warn`/`low`, cached in `_timerBand`) so it
re-rasters only on a crossing, never per frame — the same setColor gate the rest
of the HUD uses. Critically, the delicate `<=10s` machinery is untouched: the
scale-pulse, the red `warnFrame` ramp, and the low-zone reset (scale→1,
warnFrame→0, `lastTickSecond=-1`, which prevents a swallowed re-entry tick) all
still key off the `low` boolean alone — amber is not "low", it only recolors.
Verified the four crossings by trace: >20→warn recolors amber; warn→low goes red
and arms the pulse/frame; a refill low→warn recolors amber AND runs the low-exit
reset; a refill warn→normal recolors to text. `node --check` passes.

**Leftover for next passes** — unchanged standing items: festival low-time
balance and the grade/amber thresholds are deliberate-but-untuned playtest calls
(the amber 20s line and the S/A/B/C/D cut-offs both want a real play session, not
a code guess); the itch presentation captures (the language road / a festival /
the PERFECT-LEVEL banner / the grade stamp / the live PERFECT tag / the green
gain pulse / now the survived stat + amber band) + the README's final checklist
item (name + cover + screenshots) remain the top non-code work. The festival
credit popup still prints the flat `+15 credits` under a live sword multiplier (a
design call — the effect readout already shows the ×N, and reflecting the real
gain is complicated by the 100-credit cap, so it's left as-is). The two new
keyboard/readout touches this pass are themselves worth a feel re-check on a real
playthrough (does amber at 20s fire too eagerly given the +10s level-up refills?).

## Auto-dev log - 20260724-review pass 7

Read the whole game end to end again (index.html, all of src/, languages.js,
README and this NOTES history). `node --check` clean on all ten JS files. As in
the last several passes the flagged state machines re-traced clean — pause ↔
menu ↔ festival ↔ boss ↔ death, the strike-flag self-heal, the once/sec timer/
HUD/status gates + the pass-6 three-band recolor, the pass-4 terminal-'off'
PERFECT logic, checkpoint monotonicity + the p→STAGE·language decode on both End
sites, the daily seed/PB split, the bag-full purchase block, the music
pause/resume on ESC, and the "missing PNG → code-drawn/degraded" fallbacks. **No
fresh logic bug surfaced and — per the discipline this project established —
none was invented.** After ~26 passes the defect surface is mined out; the
surviving value is fresh features, feel and presentation. This pass finally built
the single oldest recorded-but-unbuilt idea — the how-to-play panel — plus one
consistency touch. Two code commits + this log.

**Feature — keyboard-first HOW TO PLAY panel on the menu (pass-6 idea #5, the
last recorded-but-never-built idea)**

The game has real depth a judge who plays two minutes never discovers: combo
score-multipliers (×2 at 5, ×3 at 15), five loot rarities across five item
types, festivals, boss fights, the perfect-clear bonus, the credit/hint/shop
economy. The menu carried only a one-line blurb, so none of that read before a
run — flagged all the way back in the pass-6 review ideas and never built. Added
an H-toggled help overlay on MenuScene (a clickable `[ HOW TO PLAY · H ]` at
top-left, plus the H key; ESC also closes, and the dim-backdrop click dismisses
it like the in-game bag/shop modal). It's a single depth-60 container built once
in `create()` and shown/hidden — no per-frame work, no new game state. The body
lays out COMBO / PERFECT / LOOT / BAG-SHOP / FESTIVAL / BOSS / STAGES in one
left-aligned monospace block (uses `LANGUAGES.length`, so the "clear all N
languages" line can't drift from the real ladder) with a keys footer. Landmine
avoided: while the overlay is up its keydown branch returns after H/ESC, so
ENTER/N/D can't start a run out from under the open panel — the same "panel
captures input" discipline the in-run onKey paused/menu branches use. Panel is
sized 840×400, centred, so it clears the title bar (y≤30) and status bar (y≥527)
and its widest body line (~610px) fits the 840px width. Direct payoff on the
Enjoyment / perceived-depth axis GMTK scores, with zero mechanical change.

**Quality — unify the overlay dismiss idiom**

The in-game bag/shop modal closes on a backdrop-dim click; the new help overlay
first only swallowed dim clicks. Made its dim close the panel too, so every
full-screen overlay in the game dismisses the same way (click-away or ESC/H).
One handler, no behaviour risk (the panel has no interactive content to guard).

**Leftover for next passes** — unchanged standing items: festival low-time
balance and the grade/amber thresholds remain deliberate-but-untuned playtest
calls; the itch presentation captures (language road / a festival / the
PERFECT-LEVEL banner / the grade stamp / the live PERFECT tag / the green gain
pulse / the survived stat + amber band / and now the how-to-play panel itself,
which screenshots well as a "depth at a glance" capture) + the README's final
checklist item (name + cover + screenshots) remain the top non-code work. With
pass-6 idea #5 now shipped, every recorded idea from the original review passes
(1-6) has been built — the remaining backlog is presentation and playtest
tuning, not code. The festival credit popup still prints the flat `+15 credits`
under a live sword multiplier (a design call — the effect readout shows the ×N).

## Auto-dev log - 20260724-review pass 8

Read the whole game again end to end (index.html, all of src/, languages.js,
README, this NOTES history). `node --check` clean on all ten JS files. As in the
last several passes the flagged state machines re-traced clean — pause ↔ menu ↔
festival ↔ boss ↔ death, the strike-flag self-heal, the once/sec timer/HUD/
status gates + the three-band recolor, the terminal-'off' PERFECT logic,
checkpoint monotonicity + the p→STAGE·language decode, the daily seed/PB split,
the bag-full purchase block, music pause/resume, and the "missing PNG →
code-drawn/degraded" fallbacks. **No fresh logic bug surfaced and — per this
project's discipline — none was invented.** After ~27 passes the defect surface
is mined out; the surviving value is fresh features, feel and presentation. This
pass closed the last real interaction-consistency gap: the bag/shop were the one
place the otherwise keyboard-first game still demanded the mouse. Three commits.

**Feature — keyboard-first BAG & SHOP (steer / use / salvage / buy, no mouse)**

Every other surface answers the keyboard — the menu (ENTER/N/D/H), pause (M/Q),
the End screen (ENTER/M/C), and TAB opens the panels — but once a panel was
open, *selecting, USING, SALVAGING or BUYING was mouse-only*, breaking the
"hands never leave the keys" promise the rest of the game keeps. Now the bag
navigates with the arrow keys over its dense 6-wide grid (inventory is packed,
so the visible slot index == the inventory index, and slots ≥ length are empty —
which makes ↑↓←→ wrap math trivial and correct), 1-9 jump to a slot, U/ENTER
use, S salvages. TAB-into-bag pre-selects slot 0 so U/S act with no steering
step (the mouse [BAG] button still opens with nothing selected); after a
use/salvage the selection stays on a valid slot so several items can be actioned
in a row. The shop buys with 1-4. Repaint reuses the exact closeMenu→openBag
idiom the mouse slot-click already used, so there's no new render path — just a
new input into the old one. Landmines avoided: (a) the buy logic was extracted
into `buyStock()`, shared by the mouse button and the keyboard route, and it
*re-validates* sold / bag-full / affordability itself so the keyboard path is as
safe as the (only-wired-when-buyable) mouse button — an invalid keypress is a
soft buzzer, since the card already shows SOLD / BAG FULL / price; (b) the arrow
keys are `addCapture`-d like TAB so steering the grid can't scroll the itch page
under the game; (c) menuKey lives inside onKey's existing `menuOpen` branch, so
no bag/shop key can ever leak into word input, and digits/U/S stay pure word
input during actual play (h1/h2/… need the digits). `node --check` passes.

**Quality — teach the new keys in the menu's HOW TO PLAY panel**

That panel predated keyboard control of the panels, so its BAG/SHOP line still
implied a mouse. Folded the new keys (arrows/1-9 pick, U use, S salvage, 1-4
buy) into it so the flow is discoverable before a run, not only from the
in-panel note. Text-only; still fits the 840×400 overlay. `node --check` passes.

**Quality — number the shop cards + a keystroke tick on bag keyboard nav**

Two touches so the new mapping is legible and responsive: the shop's "1-4 to
buy" note now maps to a visible per-card index drawn in each card's corner (no
more guessing left-to-right), and keyboard bag navigation plays the game's quiet
`type()` tick on a real selection change — steering the grid now feels like
input instead of silence. The tick lives in `reopenBag()`, a keyboard-only path,
so the mouse slot-click flow stays silent exactly as before. `node --check`
passes.

**Leftover for next passes** — unchanged standing items: festival low-time
balance and the grade/amber thresholds remain deliberate-but-untuned playtest
calls (a real play session, not a code guess). The itch presentation captures
(language road / a festival / the PERFECT-LEVEL banner / the grade stamp / the
live PERFECT tag / the green gain pulse / the survived stat + amber band / the
how-to-play panel / and now the keyboard-operable bag with numbered shop cards)
plus the README's final checklist item (name + cover + screenshots) remain the
top non-code work. With keyboard control now reaching the bag/shop, the whole
game is playable end to end without the mouse — a clean "keyboard-only" framing
for the itch page. The festival credit popup still prints the flat `+15 credits`
under a live sword multiplier (a design call — the effect readout shows the ×N).

## Auto-dev log - 20260724-review pass 9

Read the whole game again end to end (index.html, all of src/, languages.js,
README, this NOTES history). `node --check` clean on all ten JS files. As in the
last several passes the flagged state machines re-traced clean — pause ↔ menu ↔
festival ↔ boss ↔ death, the strike-flag self-heal, the once/sec timer/HUD/
status gates + the three-band recolor, the terminal-'off' PERFECT logic,
checkpoint monotonicity + the p→STAGE·language decode, the daily seed/PB split,
the bag-full purchase block, the music pause/resume, the keyboard bag/shop
routes, and the "missing PNG → code-drawn/degraded" fallbacks. I specifically
re-checked the sw-festival per-language `usedByLang` dedup (a keyword valid in
two pooled languages isn't wrongly rejected), the credit float paths (the sword
`creditMult` DOES apply to festival credits via `gainCredits`, and only the
festival popup understates it — the known, deliberately-left design call), and
the quit-to-menu `this.time.paused` reset that prevents a frozen next run. **No
fresh logic bug surfaced and — per this project's discipline — none was
invented.** After ~28 passes the defect surface is mined out; the surviving
value is fresh features, feel and presentation. This pass shipped one small,
self-contained accessibility feature. One code commit + this log.

**Feature — reduced-motion SCREEN SHAKE toggle (settings gear, all scenes)**

The game shakes the camera at its four punchiest beats — level-up (`250,0.006`),
boss spawn (`200,0.005`), boss kill (`350,0.01`) and death (`300,0.01`) — which
is great game-feel but is also one of the most common motion-sensitivity
triggers, and jam juries increasingly note a reduced-motion option as a
presentation/accessibility plus. Added a persisted `Motion.shake` setting (guarded
localStorage reads mirroring `Sfx`, so a sandboxed itch iframe can't leave it
undefined and break the settings panel) and a third row in the shared settings
panel — `[ SCREEN SHAKE: ON/OFF ]`, same row idiom as SOUND, so it shows on the
menu, in-game and End screens. All four shake sites now route through a single
gated `shakeCam(duration, intensity)` wrapper on GameScene, so the one toggle
silences every shake with no balance change. Scope kept honest: the death
red-`flash` is deliberately left on (it's a flash, not a shake, and it's the
fail-state read), and the toggle is labelled SCREEN SHAKE accordingly. The
settings panel was grown downward (height 106→128, centre nudged +8) to fit the
row while its top edge still clears the title bar and its bottom stays well above
the status bar. `node --check` passes on both touched files (`src/ui.js`,
`src/scenes/GameScene.js`); grep confirms the only surviving `cameras.main.shake`
call is inside the gated wrapper.

**Leftover for next passes** — unchanged standing items: festival low-time
balance and the grade/amber thresholds remain deliberate-but-untuned playtest
calls (a real play session, not a code guess). The itch presentation captures
(language road / a festival / the PERFECT-LEVEL banner / the grade stamp / the
live PERFECT tag / the green gain pulse / the survived stat + amber band / the
how-to-play panel / the keyboard-operable bag with numbered shop cards) plus the
README's final checklist item (name + cover + screenshots) remain the top
non-code work. The festival credit popup still prints the flat `+15 credits`
under a live sword multiplier (a design call — the effect readout shows the ×N).
With the reduced-motion toggle in, the settings gear now carries SOUND / VOLUME /
SCREEN SHAKE — a small "accessibility options" callout that also screenshots as a
polish signal for the itch page.

## Auto-dev log - 20260724-review pass 10

Read the whole game again end to end (index.html, all of src/, languages.js,
README, this NOTES history) and re-ran `node --check` on all ten JS files — clean.
As in the last several passes the flagged state machines re-traced clean: pause ↔
menu ↔ festival ↔ boss ↔ death, the strike-flag self-heal, the once/sec timer/
HUD/status gates + the three-band recolor, the terminal-'off' PERFECT logic,
checkpoint monotonicity + the p→STAGE·language decode on both End sites, the daily
seed/PB split, the bag-full purchase block, the music pause/resume, the keyboard
bag/shop routes, the pass-9 gated `shakeCam` wrapper, and the "missing PNG →
code-drawn/degraded" fallbacks. **No fresh logic bug surfaced and — per this
project's discipline — none was invented.** After ~29 passes the defect surface is
mined out; the surviving value is fresh features, feel and presentation. This pass
shipped one small, self-contained fairness/QoL feature. One code commit + this log.

**Feature — auto-pause the countdown on window blur (focus-loss safety)**

The one input-fairness gap left in a game whose entire mechanic is a live
countdown: nothing paused it when the player looked away. On itch the game runs
inside an **iframe**, so clicking OUTSIDE the frame — to read the comments, alt-tab,
or bring another window forward — fires a window `blur` while the page itself stays
VISIBLE. Phaser's built-in auto-pause only fires on `visibilitychange` (the tab
actually going hidden), which that iframe-blur case does **not** trigger, so
`update()` kept draining `timeLeft` and could kill you while you weren't even
looking at the game — an unfair, un-earned death on the exact platform the jam is
judged on. Added a `window.addEventListener('blur', …)` in `create()` that force-
pauses through the **existing** `togglePause()`, so every freeze it already owns —
the main clock (`this.time.paused`), all tweens (`tweens.timeScale`), the chiptune
(`Sfx.pauseMusic`), the demon fire-fountain decor emitters (`setDecorActive`), and
the pause-board stats snapshot — is inherited with **no new freeze path**. Design
calls that keep it safe: (a) it only ever pauses, **never auto-resumes** — the
player presses ESC when ready, so the clock can't drain the instant focus returns
(and a tab-hide that DID trip Phaser's loop-pause stays frozen too, since `update`
early-returns on `paused`); (b) it mirrors the **exact** guards the ESC pause path
uses — skip while `over` / `dying` / `transitioning` / a bag-or-shop menu is open,
or when already paused — so it can't fire mid-transition or stack a second pause;
(c) the listener is removed on the scene's `shutdown` event, so a later run's fresh
GameScene (RECOMPILE / CONTINUE restarts the scene) is never poked by the old
instance's dangling handler. Complements, rather than duplicates, Phaser's default
visibilitychange handling. `node --check` passes on the one touched file.

**Leftover for next passes** — unchanged standing items: festival low-time balance
and the grade/amber thresholds remain deliberate-but-untuned playtest calls (a real
play session, not a code guess). The itch presentation captures (language road / a
festival / the PERFECT-LEVEL banner / the grade stamp / the live PERFECT tag / the
green gain pulse / the survived stat + amber band / the how-to-play panel / the
keyboard-operable bag with numbered shop cards / the accessibility settings row)
plus the README's final checklist item (name + cover + screenshots) remain the top
non-code work. The festival credit popup still prints the flat `+15 credits` under
a live sword multiplier (a design call — the effect readout shows the ×N). With the
blur-pause in, the countdown can no longer steal a run while the player's attention
is off the frame — the last obvious "died to something I couldn't act on" case is
closed. One thing to eyeball on a real playthrough: confirm a blur triggered by an
in-page focus shift (there are no focusable HTML inputs over the canvas today, so
this should never mis-fire) doesn't pause unexpectedly.

## Auto-dev log - 20260724-review pass 11

Re-read the whole game end to end (index.html, all ten JS files, languages.js,
README, this NOTES history) and re-ran `node --check` on every file — clean. As
in the last several passes the flagged state machines re-traced clean: pause ↔
menu ↔ festival ↔ boss ↔ death, the strike-flag self-heal, the once/sec timer/HUD/
credits gates + the three-band recolor, the terminal-'off' PERFECT logic, the
p→STAGE·language checkpoint decode on both End sites, the daily seed/PB split, the
bag-full purchase block, the music pause/resume, the keyboard bag/shop routes, the
gated `shakeCam` wrapper, the blur auto-pause guards, and the "missing PNG →
code-drawn/degraded" fallbacks. **No fresh logic bug surfaced and — per this
project's discipline — none was invented.** After ~30 passes the defect surface is
mined out; the balance items (festival low-time, grade/amber thresholds) stay
parked as playtest calls, not code guesses. So this pass shipped one small,
self-contained *feel* win. One code commit + this log.

**Feel — combo-scaled correct-word burst (a hot streak hits harder on the field)**

The COMBO score-multiplier tier (×2 at 5, ×3 at 15) recolored the top-right
readout and did a springy milestone pop, but the actual play field — the green
particle burst that fires on every landed word — looked *identical* on a 2-streak
and a 20-streak. The streak's growing power lived only in a number. Scaled the
burst in `celebrate()` (the one shared correct-word feedback path) by the live
tier: **14 → 22 → 30** particles and a **green → lime → gold** tint, where the ×3
gold is the same IDE-orange the ×3 readout and the NEW-RECORD/UNIQUE cues already
use — so "your combo is paying off" reads in one consistent colour language across
the HUD and the field. Why it's safe: `celebrate()` runs *after* the `combo++` in
every scoring path (normal, boss, festival, growth-festival), so `comboMult()` is
current; `setParticleTint` re-sets the **existing** shared burst emitter on each
pop (a cheap transform, no new GameObjects, every explode leaves it in a known
tint) so there's nothing to leak; and a wrong word resets combo to 0 without
calling `celebrate()`, so the very next correct word pops back to tier-1 green —
the burst can never get stuck hot. Zero balance impact: particle count/tint is
pure juice, no scoring/time/credit path touched. `node --check` passes on the one
touched file (GameScene.js).

**Leftover for next passes** — unchanged standing items: festival low-time balance
and the grade/amber thresholds remain deliberate-but-untuned playtest calls (a real
play session, not a code guess). The itch presentation captures (language road / a
festival / the PERFECT-LEVEL banner / the grade stamp / the live PERFECT tag / the
green gain pulse / the survived stat + amber band / the how-to-play panel / the
keyboard-operable bag with numbered shop cards / the accessibility settings row /
now the tiered combo burst) plus the README's final checklist item (name + cover +
screenshots) remain the top non-code work. The one during-play action still
mouse-only is buying a HINT: every printable key collides with word input (even
`?`/`!`/`.`/`=` begin real patterns like `??`/`!==`/`=>`) and only the
non-printable keys are free, so a keyboard HINT route has no *intuitive* key — it
stays parked rather than bound to an arbitrary arrow/function key. The festival
credit popup still prints the flat `+15 credits` under a live sword multiplier (a
design call — the effect readout shows the ×N).

## Auto-dev log - 20260724-review pass 12

Re-read the whole game end to end (index.html, all ten JS files, languages.js,
README, this NOTES history) and re-ran `node --check` on every file — clean. As
in the last several passes the flagged state machines re-traced clean: pause ↔
menu ↔ festival ↔ boss ↔ death, the strike-flag self-heal, the once/sec timer/
HUD/credits gates + the three-band recolor, the terminal-'off' PERFECT logic, the
p→STAGE·language checkpoint decode on both End sites, the daily seed/PB split, the
bag-full purchase block, the music pause/resume, the keyboard bag/shop routes +
the ↑/↓ column-wrap math, the gated `shakeCam` wrapper, the blur auto-pause
guards, and the "missing PNG → code-drawn/degraded" fallbacks. I also re-verified
the boss-HP-vs-pool starve math (max boss HP 27 at Survival vs smallest pool Lua
38 — safe) and the accuracy bookkeeping (empty submits and genuine duplicates both
correctly excluded). **No fresh logic bug surfaced and — per this project's
discipline — none was invented.** After ~31 passes the defect surface is mined
out; the balance items (festival low-time, grade/amber thresholds) stay parked as
playtest calls. So this pass shipped two small, self-contained wins, each on its
own commit.

**Feel — live combo next-tier teaser (`→ ×N at M`) on the field**

The ×2-at-5 / ×3-at-15 score-multiplier tiers were documented in HOW TO PLAY, but
on the field the COMBO readout only showed the multiplier *after* you crossed the
line — a building streak gave no sense of what it was climbing toward. `refreshCombo`
now appends a `→ ×N at M` teaser toward the NEXT tier (thresholds mirror
`comboMult`'s 5/15 exactly, so the promise can't drift from what actually pays
out), and self-drops the teaser once you're at the top ×3 tier. So the readout
reads `COMBO 3 → ×2 at 5` early, `COMBO 7 · score ×2 → ×3 at 15` mid-streak, and
`COMBO 15 · score ×3` at the cap. It's a right-aligned readout, so the extra
characters grow leftward into empty HUD space (no overlap with the lang/progress
rows above or the best-combo line below), and it rides the `setText` that
`refreshCombo` already runs on every landed word — no new per-frame or per-word
re-raster. Pure legibility/juice: no scoring/time/credit path touched, and the
milestone-pop logic (keyed on `m > _comboTier`) is unchanged. `node --check`
passes on the one touched file (GameScene.js).

**Feature — persist best "time survived" and headline it on the menu**

A game literally themed on a countdown never kept how long your BEST run held the
clock off zero — the global `los_best` record carried stage / words / wpm / score
but not duration, even though the survived stat already reaches the End screen,
share card and pause board. `EndScene` now stores `time: this.survived` (the same
active-play elapsed the End headline uses) alongside the best when a run sets a new
PB, and `MenuScene`'s BEST line appends `M:SS survived`. The field is read-optional
(older bests predate it, guarded with `best.time ?`), so there's no migration and
an old record simply shows the line without the survived tail; the M:SS is inlined
in MenuScene (it has no `fmtDuration`, and it's a one-liner). Scope kept honest:
this only widens the normal-mode `los_best` write and its menu readout — the
daily/PB split, the in-run PB target (`GameScene` reads only `los_best.score`), and
the End-screen ranking are all untouched. Now the menu greets a returning player
with their best survival time, the most on-theme number the game has. `node --check`
passes on both touched files (EndScene.js, MenuScene.js).

**Leftover for next passes** — unchanged standing items: festival low-time balance
and the grade/amber thresholds remain deliberate-but-untuned playtest calls (a real
play session, not a code guess). The itch presentation captures (language road / a
festival / the PERFECT-LEVEL banner / the grade stamp / the live PERFECT tag / the
green gain pulse / the survived stat + amber band / the how-to-play panel / the
keyboard-operable bag with numbered shop cards / the accessibility settings row /
the tiered combo burst / now the combo next-tier teaser + the menu survival stat)
plus the README's final checklist item (name + cover + screenshots) remain the top
non-code work. The HINT is still the one during-play action without a keyboard
route (every printable key collides with word input, so no intuitive binding
exists — parked, not forgotten). The festival credit popup still prints the flat
`+15 credits` under a live sword multiplier (a design call — the effect readout
shows the ×N).

## Auto-dev log - 20260724-review pass 13

Re-read the whole game end to end (index.html, all ten JS files, languages.js,
README, this NOTES history) and re-ran `node --check` on every file — clean. As in
recent passes the flagged state machines re-traced clean: pause ↔ menu ↔ festival ↔
boss ↔ death, the strike-flag self-heal, the once/sec timer/HUD/credits gates + the
three-band recolor, the terminal-'off' PERFECT logic, the p→STAGE·language checkpoint
decode, the daily seed/PB split, the bag-full purchase block, the music pause/resume,
the keyboard bag/shop routes, the gated `shakeCam`, and the "missing PNG →
code-drawn/degraded" fallbacks. This pass found ONE genuine fairness bug (not
invented — a real interaction between two previously-shipped features) and fixed it,
shipped one small feature, and made one on-theme feel change. Four commits total +
this log.

**Bug fix — blur while the bag/shop is open no longer drains the clock unseen**

A real hole opened by the interaction of two earlier features. Pass 10 added a
`window` `blur` auto-pause so looking away (clicking outside the itch iframe, alt-tab)
can't kill you while the countdown drains unwatched. But a later change made the
bag/shop panel keep the countdown running on purpose (no free pause), and the blur
handler mirrored the ESC pause guards — which *skip while a menu is open*. For ESC
that's correct (ESC-in-menu means "close menu"); for blur it is not. Net result:
open the bag, then alt-tab or click outside the frame → `blur` fires → the handler
sees `menuOpen` and does nothing → the clock drains to zero behind the open panel
while you aren't even looking → the exact unearned death the blur pause exists to
prevent. Fixed the handler to close the panel first (`togglePause` no-ops while
`menuOpen`, so the close has to precede it) and then pause. Other guards
(over/dying/transitioning/already-paused) are unchanged, and the shutdown teardown of
the listener is untouched. `node --check` clean on the one touched file.

**Feature — pause board shows credits banked + loot this run (2-line run dashboard)**

The pause overlay is described as doubling as a scoreboard, but it only surfaced
score / wpm / accuracy / best combo / survived — two run stats a player actually
wants mid-run, **credits banked** and **loot collected**, were invisible until the
End screen. Split the readout into two centred lines (skill on top: score/wpm/acc;
the run's spoils below: best combo / credits / loot / survived) and nudged the block
+4px and the sound-hint line +6px so the taller two-line block still clears the 46px
PAUSED title above and the hint below. Deliberately built from **always-valid** state
(`fmtC(this.credits)`, `this.lootCount`) rather than `langIndex`/`this.lang`, so it
stays crash-safe when you pause during a boss (where `langIndex === LANGUAGES.length`
and `this.lang` is `undefined`) or a festival. `node --check` clean.

**Feel — low-time tick rises in pitch as the countdown nears zero**

Under 10s the game beeps once per second, but at a flat 990Hz — a rising countdown
beep is the classic tension device (bomb timers, quiz clocks) and "Count Down" is the
whole theme, so this was free thematic juice left on the table. `Sfx.tick` now takes
the whole seconds left and climbs 900→1305Hz across the final 10s; called with `s`
from the existing once/sec low-time tick site. No-arg calls keep the old flat 990Hz
(there are none today, but it's a safe default). Kept `sfx.js` Phaser-free (it's pure
WebAudio) by clamping with plain `Math.max/min` instead of `Phaser.Math.Clamp`.
Sfx-only — no scoring/time/state path touched. `node --check` clean on both files.

**Leftover for next passes** — unchanged standing items: festival low-time balance and
the grade/amber thresholds remain deliberate-but-untuned playtest calls (a real play
session, not a code guess). The itch presentation captures (language road / a festival
/ the PERFECT-LEVEL banner / the grade stamp / the live PERFECT tag / the green gain
pulse / the survived stat + amber band / the how-to-play panel / the keyboard-operable
bag / the accessibility settings row / the tiered combo burst + next-tier teaser / the
menu survival stat / now the enriched pause dashboard) plus the README's final
checklist item (name + cover + screenshots) remain the top non-code work. HINT is still
the one during-play action without a keyboard route (every printable key collides with
word input — parked, not forgotten). The festival credit popup still prints the flat
`+15 credits` under a live sword multiplier (a design call — the effect readout shows
the ×N).

## Auto-dev log - 20260724-review pass 14

Re-read the whole game end to end (index.html, all ten JS files, languages.js, README,
this NOTES history) and re-ran `node --check` on every file — clean. As in recent passes
the flagged state machines re-traced clean: pause ↔ menu ↔ festival ↔ boss ↔ death, the
strike-flag self-heal (battle.js `enemyStrike`), the once/sec timer/HUD/credits gates +
the three-band recolor, the blur↔menu pause interaction fixed last pass, the terminal-
'off' PERFECT logic, the p→STAGE·language checkpoint decode on both End sites, the daily
seed/PB split, the bag-full purchase block (mouse + keyboard `buyStock` guards), the
music pause/resume, the keyboard bag/shop routes + column-wrap math, the gated `shakeCam`,
the pooled `burstFx`/`floatText`/`deathFx` emitters, and the "missing PNG →
code-drawn/degraded" fallbacks (BootScene sprites, `applySceneBg`, `spawnBoss`, the menu
splash/title/pause panels). I also re-verified the boss-HP-vs-pool starve math (max boss
HP 27 at Survival vs smallest pool Lua 38 — safe) and the accuracy bookkeeping (empty
submits and genuine duplicates both correctly excluded). **No fresh logic bug surfaced
and — per this project's discipline — none was invented.** After ~32 passes the defect
surface is mined out; the balance items (festival low-time, grade/amber thresholds) stay
parked as playtest calls. So this pass shipped one small, self-contained feature that
also carried a genuine code-quality consolidation. One code commit + this log.

**Feature — TIME BOUGHT: the seconds your play clawed back from the countdown**

A game literally themed on a countdown never reported the single most on-theme number it
owns: how much time your typing added *back* to the clock. The End screen headlined
`survived M:SS` (active play elapsed) but nothing showed the flip side — the seconds you
earned racing it. Added a `this.timeBought` run tally, surfaced on the End screen's stat
line as `bought back M:SS`, paired with `survived`: together they tell the run's whole
story (e.g. clawed back 5:12 but the clock still caught you at 3:24 of active play,
because you also spent time on hints/shopping and simply out-typed for a while). It's
optional on the EndScene read (`data.bought || 0`), so older callers just show 0 — no
migration. Scope kept honest: End-screen only. I deliberately did **not** add it to the
pause board (pass 13 balanced that 2-line block against the 46px PAUSED title and the
Blender pause-panel art of unknown width; a fourth item on line 2 is an avoidable layout
risk), and left the share string untouched (it already auto-shrinks its font to fit — no
need to lengthen it for everyone).

**Quality — one `addTime()` source of truth for clock increments**

The feature is powered by a small refactor that stands on its own: every EARNED time
increment — per-word in normal / boss / festival / growth-festival play, potion use, the
level-up bonus + perfect-clear bonus, and the boss-entry `+10` — was a scattered
`this.timeLeft += X`. All eight now route through `addTime(sec)`, which adds to the clock
AND to `timeBought` in one place, so future time-gain logic (and the tally) can never
drift out of sync across call sites. The three rescue *sets* are deliberately left as
direct assignments and excluded from the tally: the boss-win floor (`BOSS_WIN_TIME`),
the festival-start floor (`FESTIVAL_MIN_TIME`) and the armor death-save are safety nets,
not time you earned — counting them would inflate the stat with rescues. Verified by grep
that the only surviving `timeLeft +=` is inside `addTime` itself; the init/floor/save/
death `timeLeft =` sets are untouched. `pulseTimer`/`flashGain` juice still fire from
their own call sites, so game-feel is unchanged. `node --check` clean on both touched
files (GameScene.js, EndScene.js).

**Leftover for next passes** — unchanged standing items: festival low-time balance and
the grade/amber thresholds remain deliberate-but-untuned playtest calls (a real play
session, not a code guess). The itch presentation captures (language road / a festival /
the PERFECT-LEVEL banner / the grade stamp / the live PERFECT tag / the green gain pulse /
the survived + now bought-back stats / the how-to-play panel / the keyboard-operable bag /
the accessibility settings row / the tiered combo burst + next-tier teaser / the menu
survival stat / the enriched pause dashboard) plus the README's final checklist item
(name + cover + screenshots) remain the top non-code work. If a future pass wants
TIME BOUGHT on the pause board too, restructure that block first (its width budget against
the pause-panel art is the constraint, not the stat). HINT is still the one during-play
action without a keyboard route (every printable key collides with word input — parked).
The festival credit popup still prints the flat `+15 credits` under a live sword
multiplier (a design call — the effect readout shows the ×N).

## Auto-dev log - 20260724-review pass 15

Re-read the whole game end to end (index.html, all ten JS files, languages.js,
README, this NOTES history) and re-ran `node --check` on every file — clean. As in
recent passes the flagged state machines re-traced clean: pause ↔ menu ↔ festival ↔
boss ↔ death, the blur↔menu pause fix (pass 13), the strike-flag self-heal
(battle.js `enemyStrike`), the once/sec timer/HUD/credits gates + the three-band
recolor, the terminal-'off' PERFECT logic, the p→STAGE·language checkpoint decode
on both End sites, the daily seed/PB split, the bag-full purchase block (mouse +
keyboard `buyStock`), the music pause/resume, the keyboard bag/shop routes, the
gated `shakeCam`, the pooled `burstFx`/`floatText`/`deathFx` emitters, the
`addTime()` single-source-of-truth for clock gains (pass 14), and the "missing PNG
→ code-drawn/degraded" fallbacks. Re-verified the boss-HP-vs-pool starve math (max
boss HP 27 at Survival vs smallest pool Lua 38 — safe) and the accuracy bookkeeping
(empty submits and genuine duplicates both correctly excluded). **No fresh logic
bug surfaced and — per this project's discipline — none was invented.** After ~33
passes the defect surface is mined out; the balance items (festival low-time, grade/
amber thresholds) stay parked as playtest calls. So this pass shipped one small,
self-contained *theme* win — the highest-level idea recorded (pass-1 #2) that had
gone unbuilt through every pass since. One code commit + this log.

**Theme — a descending "N to boss" countdown down the language road**

The game is themed on "Count Down", yet every *progression* number counts UP:
LEVEL 1/25 climbing, STAGE names rising Very Easy → Survival. The only descending
number was the seconds timer, so a judge skimming reads a typing brawler and can
miss the theme tie — and Theme is a distinct GMTK scored axis. This was literally
**pass-1 idea #2** ("surface an explicit descending counter — LANGUAGES LEFT
25 → 0"), recorded on the very first review and never built across 32 passes.
Shipped it: `refreshLangHud`'s normal-level branch now appends `· N to boss` to the
STAGE line, where `N = LANGUAGES.length - 1 - langIndex` — the languages left before
this stage's boss. It ticks 24 → 0 down the road and **resets each stage** (the road
read as a repeating countdown, not a one-way climb), and reads `· ⚔ BOSS NEXT` on the
final language (which fills the road → boss) instead of a bare "0 to boss". Why it's
safe and free: it lives entirely inside the `_hudLabelKey`-gated rebuild (keyed on
`langIndex:stageIndex:survivalLap`), so it re-rasters only when the level/stage/lap
changes — **not** on every correct word — and the boss branch returns early above it
(so a live boss keeps its own "HP · N patterns left" line) while festivals null the
label key and rebuild on teardown. Pure HUD text: no scoring/time/credit/state path
touched, no new GameObject, no per-frame or per-word cost. `node --check` clean on
the one touched file (GameScene.js); the left-aligned STAGE line still clears the
right-hand lang/progress cluster even at its longest (`STAGE VERY HARD · LAP 2 ·
target 340 · 24 to boss`).

**Leftover for next passes** — unchanged standing items: festival low-time balance
and the grade/amber thresholds remain deliberate-but-untuned playtest calls (a real
play session, not a code guess). The itch presentation captures (language road / a
festival / the PERFECT-LEVEL banner / the grade stamp / the live PERFECT tag / the
green gain pulse / the survived + bought-back stats / the how-to-play panel / the
keyboard-operable bag / the accessibility settings row / the tiered combo burst +
next-tier teaser / the menu survival stat / the enriched pause dashboard / now the
"N to boss" theme counter) plus the README's final checklist item (name + cover +
screenshots) remain the top non-code work. HINT is still the one during-play action
without a keyboard route (every printable key collides with word input — parked).
The festival credit popup still prints the flat `+15 credits` under a live sword
multiplier (a design call — the effect readout shows the ×N). With the road now
reading as a countdown, a further theme touch could echo `N to boss` on the
level-clear road overlay (`showPath`) so the descending count is felt at each
transition too, not only in the HUD.
