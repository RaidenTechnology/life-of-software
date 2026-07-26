// Loot system: rarities, item types, drop chances, inventory persistence,
// the daily shop stock and the (purchasable) bag capacity.
// Items are {t: typeIndex, r: rarityIndex}.

const RARITIES = [
  { key: 'common',   name: 'COMMON',   color: '#9e9e9e', tint: 0x9e9e9e, weight: 50, salvage: 0.25, price: 15 },
  { key: 'uncommon', name: 'UNCOMMON', color: '#4caf50', tint: 0x4caf50, weight: 25, salvage: 1,    price: 30 },
  { key: 'rare',     name: 'RARE',     color: '#2196f3', tint: 0x2196f3, weight: 15, salvage: 5,    price: 55 },
  { key: 'epic',     name: 'EPIC',     color: '#9c27b0', tint: 0x9c27b0, weight: 7,  salvage: 15,   price: 80 },
  // PRICE FIX: this was 120. GameScene hard-caps the purse at CREDIT_MAX = 100,
  // so a 120-credit item was not "expensive", it was unreachable — the shop's
  // rarest slot could never be bought by anyone, ever, and the BUY button just
  // sat greyed out forever. 95 is the most a full purse can pay and still be a
  // purchase, which is exactly the feeling the top rarity is supposed to have.
  // UNIQUE is turquoise, house rule: the rarity ladder is always
  // common white, uncommon light green, rare dark blue, epic dark purple,
  // legendary gold, mythic pink, unique turquoise — top to bottom, unique highest.
  // It was orange here, which is also the colour of an S grade, the beaten
  // personal best and the x3 combo tier, so the rarest item in the game shared
  // its colour with three unrelated things.
  { key: 'unique',   name: 'UNIQUE',   color: '#40e0d0', tint: 0x40e0d0, weight: 3,  salvage: 50,   price: 95 }
];

// How hard the CORE gem slows the countdown. 0.5 = half speed. A separate
// constant because GameScene multiplies its per-frame drain by it, and the two
// numbers have to agree or the item's own description lies.
const SLOW_FACTOR = 0.5;

// Item types. `w` is the DROP weight (see roll()): the five gems below are new
// and there are as many of them as there are staples, so a uniform roll would
// have halved how often a potion or an armour — the two items that actually
// save a run — show up. The staples stay roughly twice as likely as any single
// gem; gems are ~32% of drops combined, which is "a nice surprise" rather than
// "the normal case".
//
// Every effect array is indexed by rarity (0..4 = common..unique).
const ITEM_TYPES = [
  // --- the original five ---------------------------------------------------
  { key: 'sword', label: 'SWORD', tex: 'it_sword', w: 12,
    mult: r => (r >= 3 ? 2 : 1.5), multWords: [8, 12, 16, 22, 30],
    desc: r => 'credits ×' + (r >= 3 ? 2 : 1.5) + ' for ' + [8, 12, 16, 22, 30][r] + ' words' },
  { key: 'armor', label: 'ARMOR', tex: 'it_armor', w: 14,
    save: [5, 8, 12, 16, 20],
    desc: r => 'death save — revive with ' + [5, 8, 12, 16, 20][r] + 's' },
  { key: 'potion', label: 'POTION', tex: 'it_potion', w: 16,
    time: [10, 20, 30, 45, 60],
    desc: r => '+' + [10, 20, 30, 45, 60][r] + 's time, instantly' },
  { key: 'scroll', label: 'SCROLL', tex: 'it_scroll', w: 12,
    hints: [1, 1, 2, 2, 3],
    desc: r => [1, 1, 2, 2, 3][r] + ' free hint(s)' },
  { key: 'treasure', label: 'TREASURE', tex: 'it_treasure', w: 14,
    credits: [5, 10, 20, 35, 50],
    desc: r => '+' + [5, 10, 20, 35, 50][r] + ' credits, instantly' },

  // --- the gems: five NEW verbs, one per system the game already runs ------
  // Deliberately not "a potion with a different name". Each one reaches into a
  // system that no existing item touches (combo, deprecation, the drain RATE,
  // the level target, the credit CEILING), and each is dead weight in the wrong
  // moment — that is the whole point. An item you can always use is a resource,
  // not a decision.

  // COMBO. The combo multiplier (×2 at 5, ×3 at 15) is the biggest score lever
  // in the game and one wrong word wipes it. Nothing protected it until now.
  // Worthless at combo 0, enormous at combo 14 — perfect situational item.
  { key: 'prism', label: 'PRISM', tex: 'it_prism', w: 7,
    shield: [1, 1, 2, 3, 4],
    desc: r => 'combo survives your next ' + [1, 1, 2, 3, 4][r] + ' wrong pattern(s)' },

  // DEPRECATION. Deprecated patterns leave the pool for the rest of the level,
  // which is what makes a late level tighten. This is the only way to put them
  // back — pure insurance against the theme, and literally unusable until the
  // theme has bitten you.
  { key: 'sigil', label: 'SIGIL', tex: 'it_sigil', w: 6,
    revive: [1, 2, 3, 4, 6],
    desc: r => 'restore up to ' + [1, 2, 3, 4, 6][r] + ' deprecated pattern(s)' },

  // COUNTDOWN — but the RATE, not the amount. This is why it isn't a potion:
  // TIME_CAP (99s) means a potion drunk on a fat clock is thrown away, and
  // GameScene already refuses that use. A slow clock has no ceiling to waste
  // itself against, so it is exactly the item for the moment a potion is
  // refused, and near-pointless when you are drowning at 4 seconds.
  { key: 'core', label: 'CORE', tex: 'it_core', w: 7,
    slow: [8, 12, 18, 25, 35],
    desc: r => 'clock drains at half speed for ' + [8, 12, 18, 25, 35][r] + 's' },

  // LEVEL TARGET. Every other item helps you score faster; this one moves the
  // goalpost. Useless the second a level starts (the target is fresh and far),
  // and a rescue when you are 40 points short with the clock in single digits.
  { key: 'shard', label: 'SHARD', tex: 'it_shard', w: 6,
    cut: [0.08, 0.12, 0.18, 0.25, 0.35],
    desc: r => "this level's target −" + Math.round([0.08, 0.12, 0.18, 0.25, 0.35][r] * 100) + '%' },

  // CREDITS — the CEILING, not the balance. CREDIT_MAX = 100 is a hard wall:
  // VAULT — wards against the deprecation notice itself: the next N patterns put
  // on notice are saved automatically, before they can expire.
  //
  // This was written as "+N credit ceiling" and was obsolete before it shipped:
  // the credit cap it raised was removed in the same batch of work, so the item
  // would have bought literally nothing. The texture is rendered and the drop
  // slot is real, so it kept both and took the verb that was actually missing.
  // SIGIL restores what deprecation already took; VAULT stops it taking. Dead
  // weight on a level where nothing is threatening you yet.
  { key: 'vault', label: 'VAULT', tex: 'it_vault', w: 6,
    ward: [1, 2, 3, 4, 6],
    desc: r => 'saves the next ' + [1, 2, 3, 4, 6][r] + ' pattern(s) from deprecation' }
];

// --- bag capacity ----------------------------------------------------------
// The bag used to be a fixed `const INV_MAX = 12`. It is now bought, one slot
// at a time, out of the same purse as the shop — so "do I widen the bag or buy
// the epic potion" is a real question.
//
// BASE 12: unchanged from the old fixed cap, on purpose. A returning player
// with a save opens the bag and sees exactly the bag they left.
//
// MAX 18: this is a LAYOUT ceiling, not a taste one. GameScene draws the grid
// 6 columns wide, 78px rows, first row at cy-108 — so rows land at cy-108,
// cy-30, cy+48, cy+126. The item detail block starts at cy+78, so a fourth row
// would draw straight through it. 18 (three full rows) is the largest bag that
// fits the panel, and +50% capacity is a real reward without deleting the
// bag-full-means-auto-salvage pressure that the drop economy leans on.
//
// PRICE 25 + 12 per slot already owned -> 25, 37, 49, 61, 73, 85.
// The curve is LINEAR and it has to be. Credits are capped at 100, so anything
// geometric (25 × 1.5^5 = 190) would price the last slots out of existence, the
// same bug the UNIQUE 120 price had. Every rung stays under a full purse; the
// last one costs 85 of a possible 100, which at CREDIT_PER_WORD = 5 is 17
// patterns banked without spending — steep, payable, and it competes with the
// shop the whole way. All six slots total 330 credits, ~66 clean patterns.
const INV_BASE = 12;
const INV_CAP = 18;
const SLOT_PRICE_BASE = 25;
const SLOT_PRICE_STEP = 12;

// Cached in a module local rather than re-read per access: GameScene reads the
// capacity inside the bag-grid draw loop and once per HUD refresh, and hitting
// localStorage on every iteration of a render-time loop is exactly the kind of
// thing that shows up as jank later. Read once, keep in sync on write.
let _slotsBought = null;

function _loadSlots() {
  // Same guarded idiom as load()/save() below: a localStorage that throws
  // (private mode, disabled storage, quota) must degrade to "base bag", never
  // to a broken game.
  if (_slotsBought !== null) return _slotsBought;
  let n = 0;
  try { n = parseInt(localStorage.getItem('los_slots'), 10); } catch (e) { n = 0; }
  if (!isFinite(n) || n < 0) n = 0;            // NaN from a missing/garbage key
  _slotsBought = Math.min(n, INV_CAP - INV_BASE);  // clamp a tampered value
  return _slotsBought;
}

const Items = {
  // ---- bag capacity API (see the INV_BASE block above for the numbers) ----

  // Current capacity, INV_BASE..INV_CAP. Read this everywhere the old INV_MAX
  // was read. It is a getter, so it is always live after buySlot().
  get slots() { return INV_BASE + _loadSlots(); },

  // How many extra slots have been bought so far (0..INV_CAP-INV_BASE).
  get slotsBought() { return _loadSlots(); },

  // The hard ceiling, for UI that wants to render "18/18 MAX".
  get slotsMax() { return INV_CAP; },

  // Cost of the NEXT slot, rising with each one already owned.
  // Returns null when the bag is maxed out — null, not 0 and not Infinity, so
  // the UI has an unambiguous "there is nothing to sell you" signal that can't
  // be mistaken for "free".
  slotPrice() {
    const bought = _loadSlots();
    if (INV_BASE + bought >= INV_CAP) return null;
    return SLOT_PRICE_BASE + bought * SLOT_PRICE_STEP;
  },

  // Grow the bag by one and persist. Returns true on success, false if already
  // at INV_CAP.
  //
  // NOTE FOR THE CALLER: this does NOT touch credits. GameScene owns the purse
  // (and its CREDIT_MAX clamp), so the affordability check and the deduction
  // stay there — check `credits >= Items.slotPrice()`, call buySlot(), and only
  // subtract if it returned true. Keeping the money out of here means a failed
  // write can never eat someone's credits.
  buySlot() {
    const bought = _loadSlots();
    if (INV_BASE + bought >= INV_CAP) return false;
    _slotsBought = bought + 1;
    try { localStorage.setItem('los_slots', String(_slotsBought)); } catch (e) {}
    // Deliberately still true if the write threw: the player paid, so the slot
    // exists for this session. Only the persistence is lost, and that is the
    // same bargain Items.save() already makes with the inventory itself.
    return true;
  },

  makeTextures(scene) {
    const g = scene.add.graphics();
    const mk = (key, draw) => {
      // Already loaded as a real Blender PNG by BootScene? Leave it alone.
      // This is also the graceful-degradation path: if a PNG is missing or
      // 404s, Phaser never registers the key, exists() is false, and we draw
      // the code placeholder instead of showing the green __MISSING texture.
      if (scene.textures.exists(key)) return;
      g.clear();
      draw();
      g.generateTexture(key, 22, 22);
    };
    mk('it_sword', () => {
      g.fillStyle(0xdfe7ec).fillTriangle(4, 18, 15, 3, 18, 7);
      g.fillStyle(0x5d4037).fillRect(2, 15, 7, 3);
      g.fillStyle(0xc9a227).fillRect(6, 13, 3, 7);
    });
    mk('it_armor', () => {
      g.fillStyle(0x90a4ae).fillRect(5, 5, 12, 13);
      g.fillStyle(0xb0bec5).fillRect(5, 5, 12, 3);
      g.fillStyle(0x78909c).fillRect(3, 5, 3, 6).fillRect(16, 5, 3, 6);
      g.fillStyle(0x546e7a).fillRect(10, 8, 2, 8);
    });
    mk('it_potion', () => {
      g.fillStyle(0x8d6e63).fillRect(8, 2, 6, 3);
      g.fillStyle(0xcfd8dc).fillRect(9, 5, 4, 3);
      g.fillStyle(0xd32f2f).fillRect(6, 8, 10, 11);
      g.fillStyle(0xef5350).fillRect(6, 8, 4, 4);
    });
    mk('it_scroll', () => {
      g.fillStyle(0xd7ccc8).fillRect(4, 6, 14, 11);
      g.fillStyle(0xa1887f).fillRect(3, 5, 3, 13).fillRect(16, 5, 3, 13);
      g.fillStyle(0x8d6e63).fillRect(7, 9, 8, 1).fillRect(7, 12, 8, 1);
    });
    mk('it_treasure', () => {
      g.fillStyle(0x4dd0e1).fillTriangle(4, 9, 18, 9, 11, 20);
      g.fillStyle(0x80deea).fillRect(6, 5, 10, 4);
      g.fillStyle(0xb2ebf2).fillRect(6, 5, 4, 4);
    });

    // The gems. Drawn as stacked bands rather than triangles so the placeholder
    // reads as the same chunky faceted cut the Blender renders use — if a PNG
    // ever fails to load mid-jam the silhouette still matches its neighbours
    // instead of turning into a smooth vector shape.
    const gem = (band, table, facet, tip) => {
      // band = [x, y, w, h] rows, widest in the middle; table = crown colour,
      // facet = body colour, tip = the darkest pavilion step.
      g.fillStyle(facet);
      band.forEach(b => g.fillRect(b[0], b[1], b[2], b[3]));
      g.fillStyle(table).fillRect(band[0][0], band[0][1], band[0][2], band[0][3]);
      const last = band[band.length - 1];
      g.fillStyle(tip).fillRect(last[0], last[1], last[2], last[3]);
    };
    mk('it_prism', () => {                       // diamond, brilliant cut
      gem([[8, 3, 6, 2], [6, 5, 10, 3], [4, 8, 14, 2], [5, 10, 12, 2],
           [7, 12, 8, 3], [9, 15, 4, 2], [10, 17, 2, 2]],
        0xe0f7fa, 0x4dd0e1, 0x00838f);
      g.fillStyle(0xffffff).fillRect(9, 4, 2, 2);   // spark
    });
    mk('it_sigil', () => {                       // emerald, step cut
      gem([[8, 3, 6, 2], [6, 5, 10, 3], [5, 8, 12, 6], [6, 14, 10, 3],
           [8, 17, 6, 2]],
        0xa5d6a7, 0x2e7d32, 0x1b5e20);
      g.fillStyle(0x66bb6a).fillRect(7, 9, 8, 1).fillRect(7, 12, 8, 1);
    });
    mk('it_core', () => {                        // amethyst octahedron
      gem([[10, 2, 2, 2], [8, 4, 6, 3], [5, 7, 12, 4], [5, 11, 12, 3],
           [8, 14, 6, 3], [10, 17, 2, 2]],
        0xe1bee7, 0x8e24aa, 0x4a148c);
      g.fillStyle(0xce93d8).fillRect(8, 8, 3, 4);
    });
    mk('it_shard', () => {                       // ruby splinter, off-axis
      gem([[12, 2, 4, 3], [10, 5, 6, 3], [8, 8, 7, 4], [6, 12, 7, 4],
           [5, 16, 5, 3]],
        0xffcdd2, 0xc62828, 0x7f0000);
      g.fillStyle(0xef5350).fillRect(11, 6, 2, 5);
    });
    mk('it_vault', () => {                       // topaz cushion cut
      gem([[6, 4, 10, 2], [4, 6, 14, 4], [4, 10, 14, 4], [6, 14, 10, 3],
           [8, 17, 6, 2]],
        0xffe082, 0xf9a825, 0x8f5c00);
      g.fillStyle(0xfff8e1).fillRect(7, 8, 4, 3);
    });

    g.destroy();
    // Built from ITEM_TYPES rather than a hand-written list so adding a type
    // can never leave one icon on Phaser's default LINEAR filter (which is the
    // difference between "pixel art" and "blurry pixel art"). Guarded on
    // exists(): a key whose PNG failed AND whose placeholder somehow did not
    // register must not take the scene down here.
    ITEM_TYPES.forEach(t => {
      if (scene.textures.exists(t.tex)) {
        scene.textures.get(t.tex).setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
    });
  },

  rollRarity(rnd = Math.random) {
    let roll = rnd() * RARITIES.reduce((s, r) => s + r.weight, 0);
    for (let i = 0; i < RARITIES.length; i++) {
      roll -= RARITIES[i].weight;
      if (roll < 0) return i;
    }
    return 0;
  },

  // Type is weighted now (see the `w` note on ITEM_TYPES) instead of uniform.
  // Same shape of loop as rollRarity, same single rnd() call, so the daily-shop
  // seed still produces one deterministic draw per item.
  rollType(rnd = Math.random) {
    let roll = rnd() * ITEM_TYPES.reduce((s, t) => s + t.w, 0);
    for (let i = 0; i < ITEM_TYPES.length; i++) {
      roll -= ITEM_TYPES[i].w;
      if (roll < 0) return i;
    }
    return 0;
  },

  roll(rnd = Math.random) {
    return { t: this.rollType(rnd), r: this.rollRarity(rnd) };
  },

  name(it) {
    return RARITIES[it.r].name + ' ' + ITEM_TYPES[it.t].label;
  },

  desc(it) {
    return ITEM_TYPES[it.t].desc(it.r);
  },

  // Normalised effect payload, so GameScene.useItem() can switch on `key` and
  // read named fields instead of reaching into the per-type arrays itself. Only
  // the fields that apply to this type are present; everything else is
  // undefined, which the `if (eff.x != null)` style handles without a lookup
  // table on the other side.
  //
  //   sword    -> creditMult, multWords
  //   armor    -> deathSave           (seconds of revive)
  //   potion   -> time                (seconds, instant)
  //   scroll   -> hints               (free hint tokens)
  //   treasure -> credits             (instant, still clamped by the purse cap)
  //   prism    -> comboShield         (wrong words the combo survives)
  //   sigil    -> revive              (deprecated patterns to put back)
  //   core     -> slowSeconds, slowFactor
  //   shard    -> targetCut           (0..1 fraction off THIS level's target)
  //   vault    -> eolWards            (deprecation notices auto-saved)
  effect(it) {
    const T = ITEM_TYPES[it.t], r = it.r;
    const e = { key: T.key, rarity: r };
    if (T.mult) { e.creditMult = T.mult(r); e.multWords = T.multWords[r]; }
    if (T.save) e.deathSave = T.save[r];
    if (T.time) e.time = T.time[r];
    if (T.hints) e.hints = T.hints[r];
    if (T.credits) e.credits = T.credits[r];
    if (T.shield) e.comboShield = T.shield[r];
    if (T.revive) e.revive = T.revive[r];
    if (T.slow) { e.slowSeconds = T.slow[r]; e.slowFactor = SLOW_FACTOR; }
    if (T.cut) e.targetCut = T.cut[r];
    if (T.ward) e.eolWards = T.ward[r];
    return e;
  },

  // "Would spending this right now throw it away?" — returns a player-facing
  // reason string, or null if the use is fine.
  //
  // This is GameScene's existing rule ("a consumable you deliberately spent
  // being destroyed is not incidental") lifted into the data layer, because
  // every new gem needs its own version of it and five more inline `if`s in
  // useItem() is how that rule quietly stops being applied. Call it, and if it
  // returns a string, show it + Sfx.wrong() and DON'T consume the item.
  //
  // ctx is all-optional; a missing field just skips that check:
  //   { timeLeft, timeCap, deathSave, comboShield, deadCount,
  //     targetCut, slowActive }
  refuseReason(it, ctx) {
    const c = ctx || {};
    const e = this.effect(it);
    switch (e.key) {
      case 'potion':
        // unchanged rule: refuse if two thirds of the pour would hit TIME_CAP
        if (c.timeCap != null && c.timeLeft != null &&
            c.timeCap - c.timeLeft < e.time * 0.66) {
          return 'clock too full — it would waste ' +
            Math.round(e.time - (c.timeCap - c.timeLeft)) + 's';
        }
        return null;
      case 'armor':
        if (c.deathSave != null && c.deathSave >= e.deathSave) {
          return 'your armour already saves ' + c.deathSave + 's — keep this one';
        }
        return null;
      case 'prism':
        // a second shield doesn't stack higher than the one already up
        if (c.comboShield != null && c.comboShield >= e.comboShield) {
          return 'your combo is already shielded ' + c.comboShield + '× — keep this one';
        }
        return null;
      case 'sigil':
        if (c.deadCount != null && c.deadCount === 0) {
          return 'nothing has been deprecated yet — save it';
        }
        return null;
      case 'core':
        if (c.slowActive) return 'the clock is already slowed';
        return null;
      case 'shard':
        // one cut per level: a second one would silently overwrite the first
        if (c.targetCut) return "this level's target is already cut";
        return null;
      default:
        return null;   // treasure / scroll / vault are never wasted
    }
  },

  // base 8%, +6% per stage (max +30% at survival), +20% during festivals
  dropChance(stageIndex, inFestival) {
    return 0.08 + Math.min(stageIndex, 5) * 0.06 + (inFestival ? 0.20 : 0);
  },

  load() {
    try { return JSON.parse(localStorage.getItem('los_inv') || '[]'); }
    catch (e) { return []; }
  },

  save(inv) {
    try { localStorage.setItem('los_inv', JSON.stringify(inv)); } catch (e) {}
  },

  // date-seeded daily stock of 4 items; purchases are remembered per day
  shopStock() {
    const day = new Date().toISOString().slice(0, 10);
    let s = 0;
    for (const ch of day) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
    const items = [];
    for (let i = 0; i < 4; i++) items.push(this.roll(rnd));
    const soldKey = 'los_shop_' + day;
    let sold;
    try { sold = JSON.parse(localStorage.getItem(soldKey) || '[]'); }
    catch (e) { sold = []; }
    return { day, items, sold, soldKey };
  },

  markSold(stock, index) {
    stock.sold.push(index);
    try { localStorage.setItem(stock.soldKey, JSON.stringify(stock.sold)); } catch (e) {}
  },

  // Prune per-day keys older than ~7 days. Left unchecked, los_daily_<date> and
  // los_shop_<date> accrete one pair per calendar day across the multi-week GMTK
  // voting window — harmless in size but exactly the slow drift that eventually
  // trips a QuotaExceededError. ISO dates sort lexicographically = chronologically.
  // (los_inv and los_slots are not per-day and are never matched by this.)
  pruneOld(keepDays = 7) {
    try {
      const cutoff = new Date(Date.now() - keepDays * 86400000)
        .toISOString().slice(0, 10);
      const stale = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        const m = k && k.match(/^los_(?:daily|shop)_(\d{4}-\d{2}-\d{2})$/);
        if (m && m[1] < cutoff) stale.push(k);
      }
      stale.forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  }
};

// The INV_MAX compat shim that lived here is gone: GameScene now reads
// Items.slots directly at all six sites, which is the live capacity and picks
// up a bought slot immediately.
