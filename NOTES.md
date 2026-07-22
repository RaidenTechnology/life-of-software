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
