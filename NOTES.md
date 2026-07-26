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

## Auto-dev log - 20260724-review pass 16

Re-read the whole game end to end (index.html, all ten JS files, languages.js,
README, this NOTES history) and re-ran `node --check` on every file — clean. As in
recent passes the flagged state machines re-traced clean: pause ↔ menu ↔ festival ↔
boss ↔ death, the blur↔menu pause fix (pass 13), the strike-flag self-heal
(battle.js `enemyStrike`, robust across `ulti()`/`spawnBoss()`/`beatBoss()` killing
the tracked target mid-strike), the once/sec timer/HUD/credits gates + the three-band
recolor, the terminal-'off' PERFECT logic, the p→STAGE·language checkpoint decode on
both End sites, the daily seed/PB split, the bag-full purchase block (mouse + keyboard
`buyStock`), the music pause/resume, the keyboard bag/shop routes, the gated
`shakeCam`, the pooled `burstFx`/`floatText`/`deathFx` emitters, and the "missing PNG
→ code-drawn/degraded" fallbacks. I specifically re-verified the pass-14 `addTime()`
single-source-of-truth: the only `timeLeft +=` in the file is inside `addTime`, and
the three rescue *sets* (boss-win `BOSS_WIN_TIME`, festival-start `FESTIVAL_MIN_TIME`,
armor death-save) are still direct `timeLeft =` assignments correctly excluded from
the `timeBought` tally. Re-confirmed the boss-HP-vs-pool starve math (max boss HP 27
at Survival — hp = 12 + stageIndex·3, and stageIndex saturates at 5 through every
survival lap — vs the smallest pool Lua's 38 words, safe) and the accuracy bookkeeping
(empty submits and genuine duplicates both excluded via the `submitsTotal--`). **No
fresh logic bug surfaced and — per this project's discipline — none was invented.**
After ~34 passes the defect surface is mined out; the balance items (festival low-time,
grade/amber thresholds) stay parked as playtest calls. So this pass shipped the exact
small, self-contained *theme* win pass 15 teed up as the next step. One code commit +
this log.

**Theme — the level-clear road echoes the descending "N to boss" countdown**

Pass 15 added a descending "N to boss" counter to the corner HUD but left the
level-clear road overlay (`showPath`) silent — and that overlay is the ONE moment
the player stops and actually studies the language road (a ~4.6s animated interstitial
between levels). The "Count Down" theme was being surfaced everywhere *except* the
screen built to show the road. Closed that: `showPath` now adds a line under the road
strip echoing the same counter — `N languages down the road to the <STAGE> boss`,
reading `⚔ the road fills — the <STAGE> BOSS awaits` on the final language (the level
that ends the stage). It ticks 24 → 0 across the stage, so the descending count is now
felt at every transition, not only mid-play.

Why it's correct and safe: the line reads the **destination** level (`fromIdx + 1` —
the road you're sliding onto) with the HUD's **exact** formula
(`LANGUAGES.length - 1 - index`), so the overlay and the HUD it hands off to the
instant it clears can never disagree; `toBoss <= 0` maps to the same "BOSS
awaits"/"BOSS NEXT" wording the HUD uses on the final language. `stageIndex` is
unchanged across a level-clear (only beating a boss raises the stage), so the stage
name printed is the current one. It's a single static text added to the `overlay`
container, so it fades in/out and is destroyed with the rest of the overlay — no new
per-frame or per-word cost, no timer/tween to leak, and no scoring/time/credit/state
path touched. Placed at `cy+110` (cy=250 → y=360), clear below the strip's language
badges (~y=336) and well above the status bar. `node --check` clean on the one touched
file (GameScene.js). Pass-15's leftover suggestion is now shipped.

**Leftover for next passes** — unchanged standing items: festival low-time balance and
the grade/amber thresholds remain deliberate-but-untuned playtest calls (a real play
session, not a code guess). The itch presentation captures (language road / a festival
/ the PERFECT-LEVEL banner / the grade stamp / the live PERFECT tag / the green gain
pulse / the survived + bought-back stats / the how-to-play panel / the keyboard-operable
bag / the accessibility settings row / the tiered combo burst + next-tier teaser / the
menu survival stat / the enriched pause dashboard / the HUD "N to boss" counter / now
its echo on the level-clear road) plus the README's final checklist item (name + cover
+ screenshots) remain the top non-code work. HINT is still the one during-play action
without a keyboard route (every printable key collides with word input — parked). The
festival credit popup still prints the flat `+15 credits` under a live sword multiplier
(a design call — the effect readout shows the ×N). With the descending count now on
both the HUD and the road overlay, a further theme touch could carry it onto the End /
share card ("stopped N from the <STAGE> boss") so the run's finish reads on-theme too.

## Pre-build pass - 20260725 (deadline -31h)

Full pre-submission sweep before the first real build. `node --check` clean on all
10 files; booted the game in a browser and ran a live tour (Menu → Game → 8 correct
patterns → level-up → End) with **zero console errors**, and confirmed all 56 asset
PNGs resolve (no code-drawn fallback is being hit). Three ships, one of them a
deadline-grade packaging bug.

**Packaging — `build.ps1` was still on `Compress-Archive` (would have shipped a
dead build).** The jam repo's build script had never been given the fix the
`gmtk2026` repo got on 17 Jul: Windows PowerShell's `Compress-Archive` writes entry
names with **backslashes** (`src\main.js`), which itch.io's unpacker treats as a
literal filename — every script 404s and the page is a black screen. That exact
failure shipped once already (STAR BREAKER, 17 Jul). Rewritten on .NET
`ZipArchive` so entry names are written by us with forward slashes, `index.html`
forced to the zip root, `$ErrorActionPreference = 'Stop'`, and a file/size line on
success. Verified the produced zip: **68 entries, 0 backslash entries**, index at
root, `src/scenes/…` paths intact, 56 assets + phaser present.

**Feature — HINT finally has a keyboard route: CTRL+SPACE.** This was the standing
"parked, not forgotten" leftover across a dozen passes: the hint was the only
during-play action reachable by mouse alone, because every printable key collides
with word input. A *modifier chord* is the way out that no pass had tried — and
Ctrl+Space is the autocomplete chord in every IDE the game is dressed as, so it
needs no teaching. Placed immediately above the blanket `ctrlKey||metaKey||altKey`
early-return in `onKey`, so it steals nothing (space was already excluded from word
input, and modifier combos were already discarded); `preventDefault` keeps the
browser/IME off it, and `buyHint`'s own guards (paused/over/dying/transitioning/
menuOpen + credits + cooldown) make the key and the `[ HINT ]` button exactly
equivalent. Surfaced in both status bars and the menu help panel. Verified live:
chord fires the hint (credits 60→40, cooldown armed), leaves the typed word
untouched, and a plain space still does nothing.

**Bug — an in-flight ENTER could skip the whole End screen.** `EndScene.create()`
bound its keyboard handler immediately, and ENTER is the *submit* key of a fast
typing game — a player is very often mid-burst at the moment the clock hits zero.
One already-in-flight press then landed on the End screen the frame it appeared and
RECOMPILEd instantly, so the run's score, grade, PB delta, countdown coda and share
card flashed by unread; it reads as the game eating your results. Added a 500ms
input lock (`keysLive`) before the End screen answers keys — short enough that a
deliberate press never feels blocked. Verified: five ENTERs fired on frame 1 leave
the scene on `End`; one fired after the lock recompiles into `Game`.

`index.html` bumped to `?v=13` (assets unchanged, so `ASSET_V` stays 4).

## Learn/Career pass - 20260725 (deadline -30h)

Scored the entry honestly against the jam's REAL criteria first, and two findings
reframed the work. Straight from itch.io/jam/gmtk-jam-2026 on 25 Jul:

1. **The deadline is 26 Jul 17:00 BST = 19:00 Istanbul, not 20:00.** Every note in
   this repo assumed 20:00. That hour is the difference between submitting and not.
2. **There is no "Theme" voting category.** The five are Creativity, Enjoyment,
   **Narrative**, Artwork, Audio. A dozen earlier passes justified work with
   "Theme is a distinct GMTK scored axis" — it is not. Theme fit feeds Creativity
   indirectly. Meanwhile **Narrative is a full fifth of the score and the game had
   essentially none**, and every one of ~35 passes had gone into mechanics.

So this pass went at the axes the game had never touched, plus the thing that makes
it different from every other typing game in the jam.

**CODE REVIEW — the game now teaches the languages it makes you type.** You could
clear HASKELL at speed and walk away knowing nothing about Haskell; you typed `>>=`
because it was on a list. New `src/data/glossary.js`: a shared cross-language layer
plus per-language overrides, `[meaning, example]` per entry, lookup = language layer
→ shared → nothing (unexplained words are left OUT, never padded with filler).
**913 of 1276 patterns covered; HTML/CSS/PYTHON 100%, JAVASCRIPT 89%** — coverage
deliberately front-loaded onto the early ladder, where nearly every run is spent.
After a language falls, a card reviews up to 5 of the patterns *you* typed, in the
order you typed them, with meaning + a real example. Its footer is honest about the
gap: it separates "capped by the card" from "no note yet" rather than conflating
them. Runs between the boon draft and the next level, N on the card turns it off
for good, and the clock is stopped there on purpose (unlike the bag/festival, this
is the game talking to the player, not a decision they make to gain something).

**PROLOGUE — the two questions, and the frame.** `PrologueScene`: four lines that
say why any of this is happening (Narrative), then *how much software do you know*
(NOT MUCH / SOME CODE / I WRITE THIS) and *explain the patterns?* (Y/N). The skill
answer moves only the ropes — opening clock ±20/−10s, ASSIST default, hint price ×½
— and **never scoring**, so one PB stays one number; daily runs ignore it entirely
because a shared seed has to be a shared start. Shown automatically only until it is
answered once (`Profile.onboarded`), then it lives behind `[ SETUP ]` on the menu.

**CAREER — a run ends, what you learned does not.** New `Career` in ui.js: which of
the 25 languages you have EVER cleared, patterns typed for life, total time held off
zero, run count. Banked the instant a level falls, so dying later cannot take it
back. Drawn where it means something: the menu's language road burns full colour for
cleared languages and sits dim for the rest (the strip stops being decoration), and
the End screen mirrors the GRADE stamp with it — the grade judges one run, career
judges all of them. Credits now resume with the checkpoint too (the bag already
persisted; dropping the money that bought it was inconsistent). Score deliberately
does NOT resume — it measures a run, and carrying it forward banks points twice.

**Narrative coda.** The End screen closes the arc the prologue opens, with a line
that changes by how far you got (six bands, from "the first language took you" to
"you have done this ladder before and climbed it again anyway").

**The premise, said out loud once.** The deprecation notice read as "hurry up": a
first-timer had no way to know beating it pays DOUBLE or that missing it removes the
pattern for the level — the game's entire premise, left to be inferred from a
warning triangle. One line above the first notice ever seen (`los_seen_eol`), gone
after 6s, never repeated.

**CTRL+SPACE hint** (earlier today) is in the same family: the last unreachable
action getting a route.

All verified live in the browser, console clean: prologue defaults → pick → persist
→ clock 75→94 and hint 20→10 for NOT MUCH; a real level clear driving road → boon →
review card with the right five HTML patterns and an honest footer → dismiss →
next language typing normally; career 1/25 with 24 dim badges on the road; the
epitaph and share string (`… A-rank · LEARNING`) on the End screen; the deprecation
teach firing once and not again on a fresh run.

`index.html` at `?v=16`. Still the top non-code work, unchanged and now more
valuable than any further feature: **cover, screenshots and the GIF** — and the GIF
should include the code-review card, because it is the one thing in this entry that
nothing else in the jam has.

## Festival bug - 20260725 (player report, reproduced)

**Report:** "the festival moves on to the next level before it ends — it passes
with about 10 seconds left. A festival should only end on a correct answer or on
its timer running out."

**Reproduced, not guessed.** Drove a growth festival with correct answers and
logged the exit: it ended after **22 answers with 19.2s still on its own clock** —
neither expired nor failed. The player's ~10s is the same fault seen at human
speed.

**Cause:** `pickGrowthRound` could end the round itself. The growth festival pools
six languages and may only ask about their SIGNATURE patterns (the fairness rule
from the earlier pass: a question is only fair for a pattern that genuinely belongs
to one language). Six languages own ~22 signatures between them — and the answers
are language NAMES (`c`, `java`, `rust`, two to six characters), so anyone who
knows them answers faster than one per second. The board ran dry around the halfway
mark and `if (!word) { this.endFestival(); return; }` fired. Being good at the
round was what cut it short.

A second, rarer version of the same bug sat next to it: the pick was up to 25 blind
random draws over the whole pool with a guard counter, so even with live languages
left it could miss them by luck and end the round for no reason at all.

**Fix — a festival now ends on its timer, and at no other time (death aside).**
The board RECYCLES instead of ending: wipe `used` and go again, which is exactly
what the sw festival has always done (it repeats freely by design). The seam
carries the just-asked word forward so the same question can never appear twice in
a row across a recycle — that reads as a bug even though it isn't — and a
`board cleared — going again` line says what happened. The pick is now
deterministic: build the set of pooled languages that still have an unasked
signature and draw from that, so a live question can never be missed. The
`endFestival` fallback is kept but is now unreachable (the growth pool is built
only from languages that have signatures, so a recycled board always has one).

**Verified:** growth festival ran **45 answers and was still going** with 17.8s
left, 24 unique words (board recycled), **0 duplicates across the seam**; forcing
its timer to zero ends it with the normal summary and normal play resumes and
scores; the sw festival is untouched (40 answers, still running, ends on its
timer). Console clean.

**Balance note, deliberate:** an expert now gets the full 20 seconds of a growth
festival instead of having it cut short for answering well, so a fast player banks
more credits there than before. That is the same ceiling the sw festival already
had, and the round is still bounded by its own timer while the main clock drains
underneath it.

## Eight-task batch - 20260725 (five parallel agents + this session)

Split by FILE OWNERSHIP rather than by task, so no two workers could touch the
same file: glossary.js, glossary_detail.js (new), battle.js, languages.js, and
items.js+gen_items.py+BootScene.js went to one agent each; GameScene.js (four of
the eight asks) stayed here. Agents were barred from git, index.html, build.ps1
and the browser — all verification and every commit ran from one place.

**Credits no longer cap.** `CREDIT_MAX = 100` clamped all five earn paths. A hint
is 20, so a good run spent most of its typing earning money deleted on arrival —
and the shop's UNIQUE tier at 120 was literally unbuyable.

**Level pacing (reported: "some levels clear in 3 words, some in 6").** Measured,
not guessed: every language asked a flat 500 while a pattern pays
`length × 10 × combo × rulePay`, so long-word lists (JAVA, TYPESCRIPT — both
`verbose`, another ×1.5 on 6+ chars) cleared in **4** patterns and ASSEMBLY took
**7**; ladder position contributed nothing. Targets now derive from each list's
own mean payout plus a deliberate 6→8 ramp; the 1.6× arbitrary spread became a
smooth trend. The agent also flagged a real fault in GameScene it was not allowed
to touch: `livePool()` ignored `rulePay`, so the fairness ceiling undervalued a
TERSE pool and was clamping ASSEMBLY for a shortfall that did not exist. Fixed
here with `wordPay()` as the single source of truth for a pattern's base value —
`submit()` and both reachability checks now share it and cannot drift.

**Ranged is ranged now.** The concept already existed and is STAGE-driven
(`Battle.RANGED = ['skeleton','elf']`), not item-driven; the hero already held a
crossbow. The bug was that the ranged branch drew melee anyway: it fired the same
white sword-crescent on impact, the bolt was an unscaled outline-less smudge
crossing ~300px in a flat 140ms, and the level-up lunge still charged forward.
Now: pooled arrows, distance-scaled flight, impact particles on ARRIVAL, hero
braces backward. Verified — 3.8px of recoil (not a dash), pool settles at 1, the
y-bob tween survives, melee stages unchanged.

**Five new items, five verbs nothing else had.** PRISM shields the combo, SIGIL
restores deprecated patterns, CORE halves the drain RATE, SHARD cuts the level's
target, VAULT wards the deprecation notice outright. Gem textures genuinely
rendered in Blender 5.2 through the existing pixel-art pass (no AI art). Drop
rolls are weighted so doubling the type count didn't halve potion/armor.

⚠ **A cross-task collision worth remembering:** VAULT was designed as "+N credit
ceiling" by the item agent while the credit ceiling was being deleted by this
session — the item would have shipped doing nothing. Its texture and drop slot
were real, so it kept both and took the verb that was actually missing (SIGIL
undoes deprecation; VAULT prevents it). Parallel agents cannot see each other's
work: check every new feature against the same batch's other changes.

**The bag is bought, not given.** Locked slots are drawn with the next one priced
(25→85, base 12, cap 18 = the three rows the panel fits). Credits are deducted
only after the write succeeds, so a storage failure can't take money and give
nothing. `INV_MAX` deleted; all six sites read the live `Items.slots`.

**Pause board is buttons.** RESUME · SOUND · ASSIST · NOTES · QUIT, each carrying
live state, re-measured and re-centred per press (labels change width). Keys all
still work. NOTES is new — it could be switched off from the review card with no
way back on.

**Glossary 1276/1276** (was 913), plus a 415-entry deep layer behind the new
DETAILED button — 903 of the 1276 cards can open one.

⚠ **The same latent bug found twice, in code this session wrote.** `G_SHARED[word]`
was plain indexing on a plain object, so `constructor` — a real word in KOTLIN's
list — resolved to `Object.prototype.constructor`: truthy, so it counted as
covered and rendered blank text from a lookup reporting success. The detail agent
copied the flawed pattern into `GlossaryDetail.get`, where it was worse: the
DETAILED button appeared and the panel rendered `undefined`. Both now use
`hasOwnProperty`. `toString`/`valueOf`/`__proto__` are the same trap waiting on a
future word list — never index a lookup table with player-supplied strings.

All verified live in the browser, console clean: credits past 200; pause buttons
deaf while hidden, live when open, hit areas matching their widths, all three
toggles persisting; PRISM holding a combo across two misses and decrementing;
SHARD 320→210; CORE draining at half; VAULT blocking a notice and consuming a
ward; SIGIL restoring 2 of 3 dead patterns; bag 12→13 with the price rising
25→37 and a broke purchase refused without taking credits; ranged arrows pooled
with the y-bob alive; the review card's five DETAILED buttons, the deep panel
(316-char explanation, 4 examples, no undefined), ESC closing only the panel, and
ENTER then closing the card back into play.

`index.html` at `?v=23`.

## Player-report pass - 20260725 late (six reports + one bug found while fixing them)

**Skeleton kills didn't register.** Mechanically they died — measured: target
destroyed, queue refilled. The problem was purely that it did not READ. The
monsters on a stage are identical, `reflow()` slid the next one into the corpse's
slot over 250ms while the corpse faded over 300, and the whole death was a quiet
topple plus eight pixels. So a killed skeleton looked like a skeleton that had
stayed put. Now the corpse flashes white and pops (scale 1.45→1.81) on the frame
it dies, the burst is 18 particles, and the queue is held back 200ms so the death
has the slot to itself. Verified: tint flash seen, pop measured, corpse destroyed,
queue refilled.

**Ranged ENEMIES still charged.** The earlier ranged pass fixed the hero and left
the monsters alone — so on the two archer stages the skeletons and elves sprinted
the full field to punch you. `enemyStrike` now hands non-lethal strikes on ranged
stages to a new `enemyStrikeRanged`: draw back, loose, stay on the line. It reuses
the same arrow pool through a shared `shootFrom()`, so there is one projectile
implementation and a fix to one is a fix to both. Bosses keep the jab, and every
LETHAL blow still closes — the killing charge is the drama of dying.

⚠ **Bug found in that fix, caught only because it was tested:** the early return
to the ranged path was placed ABOVE `striking`/`strikeTarget` being set, so the
shot's own "did my target die mid-draw?" guard compared against a stale target,
decided the monster was gone, and finished without ever firing. The enemy neither
closed nor shot. First browser run showed `sawArrow: false` — a static reading of
the diff would have passed it.

**Pause buttons overflowed.** They fit the SCREEN fine (662px of 960), which is
why it looked correct here — but they hang off the Blender pause window, which is
only 560 wide. That is what "the keys overflow" meant. The row is now measured
against the panel art and scaled uniformly to fit (0.789 at the widest labels),
hit areas scaling with it. Verified with SOUND: OFF / ASSIST: OFF / NOTES: OFF,
the widest state the row can reach.

**Festivals are their own section now.** They used to fire AFTER the road, the
boons and the review — an ambush in the middle of a language you had already been
dropped into, ending with you just standing there. Now the festival runs FIRST and
clearing it is what triggers the road animation into the next language. Verified
order: level cleared → FESTIVAL → road → BOON → playing CSS. The transition is
stood down for the festival's duration (update() early-returns while transitioning,
and the festival needs its timer and the main clock both running) and re-armed with
its guard when the road goes up. The death teardown passes `silent`, which skips
the continuation, so dying in a festival still ends the run instead of walking into
a road overlay.

**Boss eased** after "hard even on MEDIUM". Three things stack there that no
ordinary level has: the pool is all 25 languages at once, the clock is whatever the
last level left, and a broken chain HEALS it. HP 30+6/stage → 24+4/stage (MEDIUM:
36 → 28) and the entry cushion 10s → 18s, which is the half that actually decides
the fight. Shape unchanged, just less of it.

**BASH detail layer written** (the one language the detail agent said it ran out of
pass for): 34 entries, BASH now 50/50 = 100%. 937 reachable detail entries total,
0 malformed. Verified in game: the BASH card shows five DETAILED buttons and the
panel opens on `echo` with a 345-character explanation and no undefined.

`index.html` at `?v=27`. Console clean across the whole sweep.

## Audio + narrative pass - 20260726 early (three parallel agents, one wiring hand)

The jam votes on Creativity / Enjoyment / Narrative / Artwork / Audio, a fifth
each. Audio was one Am-F-C-G loop across all 25 languages, a flat 880Hz key
click, and — the part that actually cost votes — the deprecation mechanic, the
thing the game is named for, made NO SOUND AT ALL. Narrative was a prologue and
an ending with nothing in between: twenty-five languages fell and the game never
said a word about any of them.

Split by FILE OWNERSHIP, not by task, so three agents could not collide: one owned
`sfx.js`, one owned `data/languages.js`, one owned `EndScene.js`/`PrologueScene.js`.
`GameScene.js`, the version bump, the build and every browser test stayed in one
hand. The contract (profile shape, voice names) was fixed up front, so the wiring
was written against it while the engine was still being built.

**Synth** — master bus (gain -> compressor) so the new layers stack without
clipping; `setMusicProfile` swaps a language's musical identity mid-loop without
restarting it; `typeCombo` climbs a pentatonic ladder with the live combo and
caps at +2 octaves; `deprecationNotice/Tick/Lost` and `rescued` give the second
countdown a falling voice and its rescue the mirrored rising one; `setBossMode`
borrows the loop for a darker progression plus percussion; `setTension` ducks the
bed and runs a sub-bass heartbeat under the last ten seconds. Every voice
early-returns on muted/no-context, and every timer is in one registry that
`pauseMusic` empties — the raw-setInterval-survives-pause bug has bitten this
repo before.

**Data** — all 25 languages carry `music` (root descends 50 -> 33, bpm climbs
84 -> 120, waves triangle/sine -> square -> sawtooth, the last three get the
flat-2nd move), an `epitaph`, and `depVer`. The notice now reads
`"otherwise" - deprecated since GHC 9.2, removed in GHC 9.8` — the sentence
every working programmer has actually read in a changelog.

**Wiring** — all new voices go through one `sfx(name, ...)` guard: a missing
voice degrades to silence, never to a TypeError (typing and the notice keep
explicit fallbacks to the old sounds instead). `applyMusicProfile` hangs off the
one HUD gate that already knows the level changed.

**Two bugs found by testing, neither visible in a diff:**
- The epitaph at y=402 was measured landing UNDER the boon draft: `offerBoons`
  paints its cards onto the same overlay at 4600ms over y~322..442. It now fades
  at 4300 — measured visible 1057ms to 4550ms, boons up at 4701ms, zero frames
  of overlap.
- After a boss, `setBossMode(false)` restores the profile from BEFORE the fight —
  the last language of the stage you just left, not the first of the one you are
  entering. The music sat wrong until the first correct word rebuilt the HUD.
  `beatBoss` now re-applies explicitly after `langIndex = 0`.

**Also passed:** `deprecatedCount`/`rescuedCount` were tallied since the mechanic
was written and never put in the End payload, so the run ended on wpm and
accuracy — two numbers any typing game can print — while the pair that belongs to
this one stayed in the scene. The End screen now opens with
`11 deprecation notices. You outran 4 of them.`

Verified in the browser end to end: per-language profile live across four level
transitions (JAVASCRIPT root 46, HTML 50), notice/tick/lost/rescued all firing
from real play, tick gaps measured accelerating 0.60s -> 0.25s, tension ramping
under 10s and standing down on a refill, boss bed on and handed back, pause
leaving zero live audio timers, death clearing tension/boss before the End screen.
Console clean across the whole sweep. Widest notice 674px and widest epitaph 570px
of 960, measured across all 25 languages.

`index.html` at `?v=28`.

## Review pass - 20260726 (read the code this time, not the reports)

Two real defects, both invisible to the browser tests that passed the night
before, because both were "the wiring works" bugs rather than "the wiring
throws" bugs.

**The per-language tempo was dead data.** languages.js carries a bpm per
language climbing 84 (HTML) to 120 (ASSEMBLY) — the audible half of the ladder
getting colder as it gets harder — and NOTHING consumed it. `refreshLangHud`
still computed the old flat `94 + stage*8 + lap*4`, so all 25 languages played
at the same speed and only the stage moved it. The language tempo is now the
base, the stage/lap steps stack on top, the whole thing caps at 168, and a boss
overrides it at 116 (the fight is the one place the ladder's own tempo is not the
point). Guarded: `this.lang` is undefined for exactly one moment — the road has
filled and startBoss has not run — so the base falls back to 94 there.
Measured: HTML 84, PHP 94, C# 98, R 104, ASSEMBLY 120, and 152 at stage 3 + lap 2.

**The combo pitch ladder flatlined at combo 10.** `Math.min(24, deg + 12*oct)`
clamped the whole semitone value, so from the tenth keystroke of a streak every
key played the same 2093Hz square — and the x3 score tier is at 15, so the
feedback died exactly where the combo starts to matter, and a long streak became
one piercing note repeated fifty times. The OCTAVE caps now and the degree keeps
cycling: 523Hz to 1760Hz over the first ten, then a rolling pentatonic at the
top. Measured across combos 0-30: max 1760Hz, five distinct pitches above 10.

Regression after both: 2 notices / 8 accelerating ticks / 1 lost / 1 rescued from
real play, tension ramping and standing down, zero live audio timers while
paused, zero after death, End screen opening on
`2 deprecation notices. You outran 1 of them.`, console clean.

`index.html` at `?v=29`.

## Weight pass - 20260726 (measured before touching anything)

**Runtime performance is a non-issue and was left alone.** Measured in a live
run: frame cost median 0.60ms, p95 1.2ms, worst 10.9ms against a 16.7ms budget
at 60fps; 13MB heap, 130 textures, 56 display objects. Optimising code paths here
would have bought nothing a player could feel.

**The download was the real weight, and 1.6MB of it was a file-format mistake.**
The six full-screen `scene_*.png` backdrops were 445-478KB each — 2.77MB of a
5.2MB build — and every one of them is 960x540 with **112 to 174 unique colours
and no alpha at all**. They were being stored as 32-bit truecolour RGBA. Palette
conversion is therefore not lossy compression, it is the correct format: 256
palette entries hold every colour these images contain. Converted with PIL
(ADAPTIVE, optimize) and each file re-opened FROM DISK and compared pixel by
pixel against the original — all six identical, 2772KB -> 1162KB.

Build: 4190KB -> **2579KB**. Live page weight 5228KB -> **3880KB**.

**Cache trap, hit and documented:** bumping `ASSET_V` alone did nothing — the
first reload still pulled the old 474KB images, because `ASSET_V` lives inside
`BootScene.js`, whose own URL had not changed, so the browser served the cached
BootScene that still asked for `?v=4`. Any asset change needs BOTH bumps:
`ASSET_V` for the images and `?v=` for the scripts that carry it. Verified after
both: `scene_*.png?v=5` fetched at 177-204KB, textures 960x540, backdrop visible
and sampling opaque colour in play, console clean.

`index.html` at `?v=30`, `ASSET_V` at 5.

## The GIF, and the two bugs it exposed - 20260726

Recorded in-engine rather than with a screen recorder: the Browser pane was not
compositing (no RAF), so MediaRecorder had nothing to capture. Instead each frame
is `game.renderer.snapshot()` queued BEFORE a manual `game.loop.step()` — queue,
render, await, POST to a local sink. Ordering matters: awaiting the snapshot
before stepping deadlocks, because the queued grab only runs at the end of the
next render pass. ~69ms per frame, so capture and game time run 1:1 and a 15fps
playback is real time. 351 frames, zero failures.

Two takes were thrown away first, both for the same reason: the run kept doing
what it is supposed to do. The third pattern typed CLEARED the level, so
`transitioning` went true and every later keystroke and deprecation tick was
correctly ignored — the footage was of the road, not the notice. And the window
blur handler paused the game between tool calls, which froze the scene clock, so
the boon draft's delayedCall never fired. The shoot now zeroes the score before
the notice beat and detaches the blur listener for the duration.

**Bug 1 — every float pop landed on the same pixel.** `floatText` always spawned
at `panel.y - 50`, so the score pop and "SAVED FROM DEPRECATION! ×2" — which by
definition fire in the same frame — printed on top of each other. The game's best
moment was arriving as one garbled line. Pops that land while another is still
fresh (<260ms) now stack, capped at two rows.

**Bug 2 — the versioned notice ran under the HUD.** Dressing the notice as a real
changelog line pushed it from 410px to 674px, and the credits/hint readout is
RIGHT-aligned at ~780, so it occupies 690..780: the notice ran straight
underneath it. First fix was a uniform scale-to-fit, which was wrong — measured
against the true 690 boundary the text would have had to shrink to 0.59. So the
line is split instead: the alarm keeps its original width (it was already at the
limit) and the versions drop to a 12px line under it. Measured after: alarm right
edge 685, version 599, both clear of 690; and the version line is torn down with
the alarm everywhere (rescue, expiry, ward, level change, boss chain, beatBoss)
through one `hideEol()`.

Deliverables in `media/`: `life-of-software.gif` (720x405, 1.78MB, 13.8s),
`-small.gif` (480px, 0.81MB), `.mp4` (960x540), and five stills cut from the same
take, so the page and the GIF tell one story.

`index.html` at `?v=33`.

## The festival is a stop on the road now - 20260726

It was already its own SECTION mechanically (level cleared -> festival -> road ->
boon), but the road it interrupted never mentioned it: you went somewhere, came
back, and the map showed HTML -> CSS as if nothing had happened. Now it reads
HTML ✓ -> FESTIVAL ✓ -> CSS, with the stop deliberately smaller than a language
node (96x54 against 170x64) and no badge, because it is somewhere you passed
through rather than one of the 25.

`showPath` takes the festival kind as a fifth argument and widens the strip from
230 to 290 only on those transitions — the stop needs a gap it can live in
(290 - 170 = 120) and the languages must not crowd it. Measured after the slide:
HTML 105..275, FESTIVAL 287..383, CSS 395..565, PYTHON 685..855 — 12px gaps, no
overlap, 750px of 960 used. The stop ticks green 400ms behind the language so the
eye reads them in the order they were played, and it slides and dims with the
rest of the road behind you.

`afterUlti` now hands the kind through (`road(kind)`), so the stop says which
festival it was: SOFTWARE or GROWTH. The `rand()` call that picks the kind stays
in exactly the same position in the sequence, so a daily seed still plays the
festival it always did.

Verified both paths in the browser: with the roll forced, a natural level clear
ran the festival and 'sw' arrived at the road, which drew the stop; with the roll
forced to fail, the fifth argument is null, spacing measures 230 and there is no
stop — the plain transition is byte-for-byte the old one. `media/ss6-festival-road.png`
added for the page.

`index.html` at `?v=36`.

## PRISM was working and saying it wasn't - 20260726

Asked whether the item actually does anything, because using it "on the last hit"
felt like it had no effect. Two separate things, both measured in play.

**It works.** With a shield up and a x8 streak, a wrong word left the combo at 8
and spent one charge. So did ARMOR (rolled a UNIQUE through the real pipeline,
used it out of the bag: deathSave 20 applied, item consumed) and SCROLL (3 free
hints applied; the hint then charged 0 credits and decremented a token, while
with no tokens it charged the full price). The death save was verified firing in
five situations: plain clock-out, mid-boss, under a festival banner, with the bag
open at 0.3s left, and — correctly — NOT a second time once spent.

**But the screen said the opposite.** The red feedback line is written before the
shield is consulted, so it printed `combo x8 lost!` while the pop directly above
it printed `PRISM HELD THE COMBO x8`. The line sits at the input, which is where
the player's eyes are, so the honest reading of the screen was "the item did
nothing". PRISM is now settled BEFORE the line is written, and the line says
`PRISM held your x8`.

**And it burned charges for nothing.** At combo 0 or 1 the shield still spent a
charge to "save" a x0 combo — measured: shield 2 -> 1, pop reading
`PRISM HELD THE COMBO x0`. An item charge for no benefit, unavoidable by the
player, which is the opposite of insurance. The shield now only spends at combo
>= 2. Verified: combo 0 leaves the charge alone and pops nothing, combo 2 spends
it and holds, combo 8 with no shield left still reports the loss plainly.

Worth noting the other consumables were already guarded against pointless use
(`Items.refuseReason`: a potion that would overflow the clock, an armour weaker
than the one standing, a sigil with nothing deprecated, a second core/shard) —
PRISM had a refusal for stacking a weaker shield, but nothing stopped it being
eaten by a miss that cost nothing.

`index.html` at `?v=37`.

## UNIQUE is turquoise - 20260726

House rule, now recorded outside this repo as well: the rarity ladder is always
common white, uncommon light green, rare dark blue, epic dark purple, legendary
gold, mythic pink, unique turquoise — and unique is the TOP of that ladder
(unique > mythic > legendary > epic > rare > uncommon > common). A project with
fewer tiers skips rungs rather than reordering them; this game has five and no
legendary/mythic, so its top rung is unique and it is turquoise.

UNIQUE was `#ff9800` here, which is also the colour of an S grade (EndScene), a
beaten personal best and the x3 combo tier — the rarest item in the game shared
its colour with three unrelated things. Now `#40e0d0`, verified in the bag with
one item of every rarity side by side: grey / green / blue / purple / turquoise,
and the turquoise does not read as the rare blue. Single source of truth, so the
loot line, the salvage line, the bag frame and the battle drop tint all followed
it (`RARITIES[r].color` / `.tint`); the other `#ff9800` uses in the repo are the
flame triangles and the three unrelated readouts, all untouched.

`index.html` at `?v=38`.

## The ranged level-up killed nothing, visibly - 20260726

Report: "okla karakter son vuruşu atınca hiçbiri ölmüyor aynı olduğu gibi kalıyor"
— on the crossbow stages the level-clearing blow leaves the whole row standing.

Not the kills. `ulti()` called on its own destroys all five sprites on a ranged
stage (measured 5/5), and an ordinary ranged kill has been fine since the earlier
pass. The bug was the REFILL racing the volley.

The ranged `attack()` deliberately delays `reflow()`/`fill()` by 200ms so a death
gets its slot to itself. But the word that clears a level runs `attack()` and then
`levelUp()` -> `ulti()` in the SAME tick, so that refill landed 200ms INTO the
volley. Measured before the fix, on a skeleton stage: at 700ms after the clearing
word, TWO of the originals were still falling while FIVE fresh skeletons already
stood in the row. The row was never empty, and since the monsters on a stage are
identical, the only honest reading of the screen was "nothing died". Melee never
had it — there the refill happens synchronously inside `attack()`, before `ulti()`
ever reads the queue.

`Battle.ultiActive` now marks the volley, the delayed refill returns early while
it is up, and the volley refills at its own tail. Measured after: ranged matches
melee — field empty at 1200ms with every original destroyed, fresh row fading in
at 2000ms, zero frames where a dying original shares the strip with a fresh
monster. An ordinary (non-clearing) ranged kill still drops its target and
refills to five inside ~400ms, untouched.

`index.html` at `?v=39`.
